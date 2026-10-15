import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import { CDP, browser, navigate, clickNote, closeNote, extract, targetUrl } from './scrape.mjs';
import { createPacer } from './pacing.mjs';
import { catalog } from './catalog.mjs';
import { exclusionReason } from './scope.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));
export async function fullSearch(o) {
  const pace = createPacer(o.delay);
  const url = targetUrl(o);
  if (new URL(url).pathname !== '/search_result') throw Error('--all 只支持搜索页');
  const root = resolve(import.meta.dirname, '../output');
  const out = resolve(o.out || join(root, `full-${new Date().toISOString().replace(/[:.]/g, '-')}`));
  await mkdir(out, { recursive: true });
  if (existsSync(join(out, 'manifest.json'))) throw Error('请使用新的输出目录');
  const cached = new Map();
  try {
    for (const a of JSON.parse(await readFile(join(root, 'catalog.json'), 'utf8')).articles) {
      if (existsSync(resolve(root, a.localPath))) cached.set(a.id, a);
    }
  } catch { /* First run has no cache. */ }
  const report = { fetchedAt: new Date().toISOString(), source: url, status: 'running', mode: 'all-visible-search-results', batches: 0, candidates: [], articles: [], excluded: [], failures: [], reused: 0, newNotes: 0, stopReason: '', loadChecks: [] };
  const found = new Map(), processed = new Set();
  const checkpoint = async () => {
    report.candidates = [...found.values()];
    await writeFile(join(out, 'manifest.json'), JSON.stringify(report, null, 2));
    await writeFile(join(out, 'index.md'), `# 华为面试搜索完整加载记录\n\n状态：${report.status}；加载批次 ${report.batches}；候选 ${found.size}；新读 ${report.newNotes}；复用 ${report.reused}；失败 ${report.failures.length}\n\n停止原因：${report.stopReason || '进行中'}\n\n${report.articles.map(a => `- [${(a.title || a.id).replace(/[\r\n]/g, ' ')}](${a.file})`).join('\n')}\n`);
    await catalog(root);
  };
  const tab = await browser(o.port), cdp = new CDP();
  await cdp.connect(tab.webSocketDebuggerUrl);
  let stagnant = 0;
  try {
    await navigate(cdp, url, o.delay, pace);
    for (let batch = 0; batch < 200; batch++) {
      let page = await cdp.eval(extract);
      for (let w = 0; w < 10 && !page.blocked && !page.candidates.length; w++) { await sleep(1000); page = await cdp.eval(extract); }
      if (page.blocked) { report.status = 'blocked'; report.stopReason = '登录或验证提示'; break; }
      report.batches++;
      const before = found.size;
      for (const n of page.candidates) if (!found.has(n.id) || (!found.get(n.id).url.includes('xsec_token') && n.url.includes('xsec_token'))) found.set(n.id, n);
      const pending = [...found.values()].filter(n => !processed.has(n.id));
      console.log(`批次 ${report.batches}：候选累计 ${found.size}，待读 ${pending.length}`);
      for (const n of pending) {
        processed.add(n.id);
        if (exclusionReason(n)) { report.excluded.push({...n,reason:exclusionReason(n)}); continue; }
        const old = cached.get(n.id);
        if (old) {
          report.articles.push({ ...old, file: relative(out, resolve(root, old.localPath)).replaceAll('\\', '/'), reused: true, sourceFetchedAt: old.fetchedAt });
          report.reused++;
          continue;
        }
        try {
          await clickNote(cdp, n.id, pace); await sleep(o.delay);
          let d = await cdp.eval(extract);
          for (let w = 0; w < 10 && !d.blocked && !d.unavailable && (d.note.id !== n.id || (!d.note.text && !d.note.images.length)); w++) { await sleep(1000); d = await cdp.eval(extract); }
          if (d.blocked) { report.status = 'blocked'; report.stopReason = '详情页触发登录或验证'; throw Error(report.stopReason); }
          if (d.unavailable || d.note.id !== n.id || (!d.note.text && !d.note.images.length)) throw Error('详情不可用或未加载');
          pace.success();
          const a = { ...d.note, title: d.note.title || n.title || '', url: n.url, file: `${n.id}.md`, openedBy: 'click', imageTextRead: false };
          if (exclusionReason(a)) { report.excluded.push({id:a.id,title:a.title,reason:exclusionReason(a)}); continue; }
          await writeFile(join(out, a.file), `# ${a.title || a.id}\n\n来源：${a.url}\n\n抓取时间：${new Date().toISOString()}\n\n发布时间（页面原始值）：${a.publishedAt ?? '未知'}\n\n${a.text || '（正文为空，未处理图片）'}\n`);
          report.articles.push(a); report.newNotes++;
          console.log(`新读 ${report.newNotes}：${a.title || a.id}（${a.text.length}字，${a.dateText}）`);
        } catch (e) {
          if (report.status !== 'blocked' && pace.failure()) { report.status = 'partial'; report.stopReason = '连续3次详情失败，停止访问'; }
          report.failures.push({ id: n.id, title: n.title, error: e.message });
          console.log(`未读 ${n.id}：${e.message}`);
        } finally {
          await checkpoint();
          if (report.status !== 'blocked') { await closeNote(cdp); await sleep(600); }
        }
        if (report.status === 'blocked' || report.stopReason) break;
      }
      await checkpoint();
      if (report.status === 'blocked' || report.stopReason) break;
      stagnant = found.size === before ? stagnant + 1 : 0;
      const screen = await cdp.eval(`({height:document.body.scrollHeight,scrollY:scrollY,tail:document.body.innerText.slice(-600),url:location.href})`);
      report.loadChecks.push({ batch: report.batches, newCandidates: found.size - before, ...screen });
      if (stagnant >= 5) { report.stopReason = '连续5次滚动加载没有新增笔记（仅代表当前搜索可加载边界）'; break; }
      await pace.before();
      await cdp.eval('window.scrollTo(0,document.body.scrollHeight)');
      await sleep(Math.max(o.delay, 4000));
    }
    if (!report.stopReason) report.stopReason = '达到200批次运行上限，尚不能宣称加载结束';
    if (report.status === 'running') report.status = report.failures.length ? 'partial' : 'ok';
  } catch (e) {
    report.status = 'interrupted'; report.stopReason = e.message;
  } finally { await checkpoint(); cdp.ws.close(); }
  console.log(JSON.stringify({ out, status: report.status, candidates: found.size, newNotes: report.newNotes, reused: report.reused, failed: report.failures.length, stopReason: report.stopReason }, null, 2));
  if (report.status !== 'ok') process.exitCode = 2;
}
