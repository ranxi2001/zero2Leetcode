#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { catalog } from './catalog.mjs';
import { createPacer } from './pacing.mjs';

const sleep = ms => new Promise(r => setTimeout(r, ms));
export function options(args) {
  const o = { search: '华为面试', port: 9222, pages: 1, limit: 5, delay: 10000 };
  for (let i = 0; i < args.length; i++) {
    const k = args[i].replace(/^--/, '');
    if (['login', 'help', 'all'].includes(k)) { o[k] = true; continue; }
    if (!['search', 'url', 'port', 'pages', 'limit', 'delay', 'out'].includes(k) || !args[i + 1] || args[i + 1].startsWith('--')) throw Error(`无效参数：${args[i]}`);
    o[k] = ['port', 'pages', 'limit', 'delay'].includes(k) ? Number(args[++i]) : args[++i];
  }
  for (const k of ['port', 'pages', 'limit', 'delay']) if (!Number.isInteger(o[k]) || o[k] < 1) throw Error(`${k} 必须为正整数`);
  if (o.port > 65535 || o.delay < 5000) throw Error('端口必须 <= 65535，delay 必须 >= 5000');
  return o;
}
export function targetUrl(o) {
  if (o.url) {
    const u = new URL(o.url);
    if (u.protocol !== 'https:' || !['www.xiaohongshu.com', 'xiaohongshu.com'].includes(u.hostname)) throw Error('只支持小红书 HTTPS URL');
    if (!['/search_result', '/search_result_ai'].includes(u.pathname)) return u.href;
    let q = u.searchParams.get('keyword') || o.search;
    for (let i = 0; i < 2 && /%[0-9a-f]{2}/i.test(q); i++) { try { q = decodeURIComponent(q); } catch { break; } }
    return `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(q)}&source=web_search_result_notes`;
  }
  return `https://www.xiaohongshu.com/search_result?keyword=${encodeURIComponent(o.search)}&source=web_search_result_notes`;
}

export class CDP {
  pending = new Map(); id = 0;
  async connect(url) {
    this.ws = new WebSocket(url);
    await new Promise((ok, fail) => {
      const timer = setTimeout(() => { this.ws.close(); fail(Error('CDP 连接超时')); }, 10000);
      this.ws.addEventListener('open', () => { clearTimeout(timer); ok(); }, { once: true });
      this.ws.addEventListener('error', () => { clearTimeout(timer); fail(Error('CDP 连接失败')); }, { once: true });
    });
    this.ws.addEventListener('message', e => {
      const m = JSON.parse(e.data), p = this.pending.get(m.id);
      if (!p) return;
      clearTimeout(p.timer); this.pending.delete(m.id);
      m.error ? p.fail(Error(m.error.message)) : p.ok(m.result);
    });
    this.ws.addEventListener('close', () => {
      for (const p of this.pending.values()) { clearTimeout(p.timer); p.fail(Error('CDP 已断开')); }
      this.pending.clear();
    });
  }
  send(method, params = {}) {
    return new Promise((ok, fail) => {
      const id = ++this.id;
      const timer = setTimeout(() => { this.pending.delete(id); fail(Error(`${method} 超时`)); }, 15000);
      this.pending.set(id, { ok, fail, timer });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expression) {
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw Error(r.exceptionDetails.text);
    return r.result.value;
  }
}
export async function browser(port, attempts = 0) {
  if (attempts > 10 || port > 65535) throw Error('未找到可用 CDP 端口');
  const profile = join(homedir(), '.chrome-nowcoder');
  const base = `http://127.0.0.1:${port}`;
  const available = async () => { try { return (await fetch(`${base}/json/version`, { signal: AbortSignal.timeout(1500) })).ok; } catch { return false; } };
  if (!await available()) {
    const exe = [process.env.CHROME_PATH, ...['PROGRAMFILES', 'PROGRAMFILES(X86)', 'LOCALAPPDATA'].map(k => process.env[k] && join(process.env[k], 'Google/Chrome/Application/chrome.exe')), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(p => p && existsSync(p));
    if (!exe) throw Error('找不到 Chrome，请设置 CHROME_PATH');
    const child = spawn(exe, [`--remote-debugging-port=${port}`, '--remote-debugging-address=127.0.0.1', `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', 'https://www.xiaohongshu.com/explore'], { detached: true, stdio: 'ignore', windowsHide: true });
    child.on('error', e => console.error(e.message)); child.unref();
    for (let i = 0; i < 20 && !await available(); i++) await sleep(500);
    if (!await available()) throw Error('Chrome 调试端口未就绪');
  }
  const r = await fetch(`${base}/json/new?chrome://version`, { method: 'PUT', signal: AbortSignal.timeout(5000) });
  if (!r.ok) throw Error('无法创建 CDP 标签页');
  const tab = await r.json(), probe = new CDP();
  let actual = '';
  try {
    await probe.connect(tab.webSocketDebuggerUrl);
    for (let i = 0; i < 20 && !actual; i++) {
      actual = await probe.eval('document.querySelector("#profile_path")?.textContent || ""');
      if (!actual) await sleep(250);
    }
  } finally { probe.ws?.close(); }
  const normalize = p => resolve(p.trim()).replaceAll('\\', '/').toLowerCase();
  if (!actual || !normalize(actual).startsWith(normalize(profile) + '/')) {
    await fetch(`${base}/json/close/${tab.id}`, { signal: AbortSignal.timeout(5000) });
    if (!actual) throw Error('无法核实浏览器 profile，停止连接');
    console.log(`端口 ${port} 属于其他 profile，检查下一个端口。`);
    return browser(port + 1, attempts + 1);
  }
  console.log(`已确认复用牛客 profile：${actual.trim()}（CDP ${port}）`);
  return tab;
}

// Read only loaded page data; keep access tokens paired with their original note IDs.
export const extract = String.raw`(() => {
  const unwrap = x => x?.value ?? x?._value ?? x;
  const s = window.__INITIAL_STATE__ || {};
  const body = document.body?.innerText || '';
  const visible = e => e && e.getClientRects().length > 0;
  const blocked = [...document.querySelectorAll('.login-container,.login-modal,.captcha-container')].some(visible)
    || /安全验证|安全限制|访问频次异常|访问频繁|请稍后再试|请完成验证|扫码查看|登录后查看/.test(body)
    || /\/login|\/website-login|\/captcha/.test(location.pathname);
  const feeds = unwrap(s.search?.feeds);
  const candidates = [];
  for (const f of Array.isArray(feeds) ? feeds : []) {
    const id = f.id || f.noteId, token = f.xsecToken || f.xsec_token;
    if (!/^[a-f0-9]{24}$/i.test(id || '')) continue;
    const card = f.noteCard || f.note_card || {};
    const a = [...document.querySelectorAll('a[href]')].find(a => a.href.includes('/' + id));
    const url = token ? 'https://www.xiaohongshu.com/explore/' + id + '?xsec_token=' + encodeURIComponent(token) + '&xsec_source=pc_search' : a?.href;
    if (url) candidates.push({ id, url, title: card.displayTitle || card.display_title || '' });
  }
  for (const a of document.querySelectorAll('a[href]')) {
    const u = new URL(a.href), m = u.pathname.match(/\/(?:explore|search_result)\/([a-f0-9]{24})/i);
    if (u.hostname === 'www.xiaohongshu.com' && m) candidates.push({ id: m[1], url: u.href, title: a.innerText || '' });
  }
  const id = location.pathname.match(/([a-f0-9]{24})/i)?.[1];
  const map = unwrap(s.note?.noteDetailMap) || {};
  const note = unwrap(map[id])?.note || {};
  const title = note.title || document.querySelector('#detail-title')?.innerText || '';
  const text = note.desc || document.querySelector('#detail-desc')?.innerText || '';
  const images = (note.imageList || []).map(x => x.urlDefault || x.url || x.infoList?.[0]?.url).filter(Boolean);
  if (!images.length) for (const img of document.querySelectorAll('.note-detail-mask .swiper-slide img, .note-container .swiper-slide img')) if (img.src) images.push(img.src);
  return { blocked, candidates, note: { id, title, text, images: [...new Set(images)], publishedAt: note.time || null, dateText: document.querySelector('.note-content .date, .bottom-container .date, .date')?.innerText || '', authorId: note.user?.userId || '', author: note.user?.nickname || '' }, unavailable: /当前笔记暂时无法浏览|笔记已被删除|内容不存在/.test(body) };
})()`;

export async function navigate(cdp, url, delay, pace) {
  await pace?.before();
  const r = await cdp.send('Page.navigate', { url });
  if (r.errorText) throw Error(r.errorText);
  await sleep(delay);
  for (let i = 0; i < 10; i++) {
    if (await cdp.eval('document.readyState === "complete"')) break;
    await sleep(500);
  }
}

export async function clickNote(cdp, id, pace) {
  await pace?.before();
  const locate = `(() => {
    const a = [...document.querySelectorAll('a[href]')].find(a => a.href.includes('/' + ${JSON.stringify(id)}) && a.href.includes('xsec_token'));
    if (!a) return null;
    a.scrollIntoView({block:'center'});
    const r = a.getBoundingClientRect();
    return r.width && r.height ? {x:r.x+r.width/2,y:r.y+r.height/2} : null;
  })()`;
  let point = await cdp.eval(locate);
  if (!point) {
    await pace?.before();
    await cdp.eval('window.scrollTo(0,0)'); await sleep(700);
    for (let i = 0; i < 15 && !point; i++) {
      point = await cdp.eval(locate);
      if (!point) { await pace?.before(); await cdp.eval('window.scrollBy(0,innerHeight*0.75)'); await sleep(500); }
    }
  }
  if (!point) throw Error('搜索列表中未找到可点击笔记');
  await pace?.before();
  await cdp.send('Input.dispatchMouseEvent', {type:'mousePressed',button:'left',clickCount:1,...point});
  await cdp.send('Input.dispatchMouseEvent', {type:'mouseReleased',button:'left',clickCount:1,...point});
}

export async function closeNote(cdp) {
  return cdp.eval(`(() => {
    const e = [...document.querySelectorAll('.close-circle,.close-mask-dark')].find(e => e.getClientRects().length);
    if (e) { e.click(); return true; }
    return false;
  })()`);
}

async function main() {
  const o = options(process.argv.slice(2));
  if (o.help) { console.log('用法: node scrape.mjs [--login] [--all] [--search 关键词 | --url URL] [--pages 1] [--limit 5] [--port 9222] [--delay 10000] [--out 新目录]'); return; }
  if (o.all) { const { fullSearch } = await import('./full-search.mjs'); await fullSearch(o); return; }
  const pace = createPacer(o.delay);
  const url = o.login ? 'https://www.xiaohongshu.com/explore' : targetUrl(o);
  const tab = await browser(o.port), cdp = new CDP();
  await cdp.connect(tab.webSocketDebuggerUrl);
  try {
    await navigate(cdp, url, o.delay, pace);
    if (o.login) { console.log('已打开 CDP Chrome。请在该窗口登录小红书，完成后重新运行搜索命令。'); return; }
    const out = resolve(o.out || join(import.meta.dirname, '../output', new Date().toISOString().replace(/[:.]/g, '-')));
    await mkdir(out, { recursive: true });
    if (existsSync(join(out, 'manifest.json'))) throw Error('输出目录已有 manifest，请使用新的目录');
    const report = { fetchedAt: new Date().toISOString(), source: url, status: 'ok', batches: 0, candidates: [], articles: [], failures: [] };
    const found = new Map();
    let page = await cdp.eval(extract);
    for (let i = 0; i < 10 && !page.blocked && !page.candidates.length && !page.note.text; i++) {
      await sleep(1000); page = await cdp.eval(extract);
    }
    if (page.blocked) report.status = 'blocked';
    else if (new URL(url).pathname === '/search_result') {
      for (let i = 0; i < o.pages; i++) {
        if (i) { await pace.before(); await cdp.eval('window.scrollTo(0, document.body.scrollHeight)'); await sleep(o.delay); page = await cdp.eval(extract); }
        if (page.blocked) { report.status = 'blocked'; break; }
        report.batches++;
        const before = found.size;
        for (const n of page.candidates) if (!found.has(n.id) || (!found.get(n.id).url.includes('xsec_token') && n.url.includes('xsec_token'))) found.set(n.id, n);
        if (before === found.size) break;
      }
    } else {
      const id = new URL(url).pathname.match(/([a-f0-9]{24})/i)?.[1];
      if (!id) throw Error('URL 不是笔记详情或搜索页面');
      found.set(id, { id, url });
    }
    report.candidates = [...found.values()];
    const searchMode = new URL(url).pathname === '/search_result';
    if (report.status !== 'blocked') for (const n of report.candidates.slice(0, o.limit)) {
      try {
        if (searchMode) { await clickNote(cdp, n.id, pace); await sleep(o.delay); }
        // Single-note URL was already opened above; do not navigate twice.
        let data = await cdp.eval(extract);
        for (let i = 0; i < 8 && !data.blocked && !data.unavailable && (data.note.id !== n.id || (!data.note.text && !data.note.images.length)); i++) { await sleep(1000); data = await cdp.eval(extract); }
        if (data.blocked) { report.status = 'blocked'; throw Error('需要登录或验证，已停止'); }
        if (data.unavailable || data.note.id !== n.id || (!data.note.text && !data.note.images.length)) throw Error('详情不可用或未加载正文/图片');
        const note = { ...data.note, url: n.url, file: `${n.id}.md`, imageTextRead: false, openedBy: searchMode ? 'click' : 'url' };
        const md = `# ${note.title || n.title || n.id}\n\n来源：${n.url}\n\n抓取时间：${report.fetchedAt}\n\n发布时间（页面原始值）：${note.publishedAt ?? '未知'}\n\n${note.text || '（图片笔记，未提取图片文字）'}\n\n${note.images.map((u, i) => `[图片 ${i + 1}](${u})`).join('\n\n')}\n`;
        await writeFile(join(out, note.file), md, 'utf8'); report.articles.push(note); pace.success();
        console.log(`已读 ${report.articles.length}：${note.title}（${note.text.length} 字，${note.images.length} 图，${note.dateText}）`);
      } catch (e) { report.failures.push({ id: n.id, error: e.message }); if (report.status === 'blocked') break;
        if (pace.failure()) { report.status = 'partial'; report.stopReason = '连续3次详情失败，停止访问'; break; } }
      finally {
        await writeFile(join(out, 'manifest.json'), JSON.stringify(report, null, 2));
        if (!o.out) await catalog();
        if (searchMode && report.status !== 'blocked') { await closeNote(cdp); await sleep(600); }
      }
    }
    if (report.status === 'ok' && report.failures.length) report.status = 'partial';
    if (report.status === 'ok' && !found.size) report.status = 'empty_or_unloaded';
    await writeFile(join(out, 'manifest.json'), JSON.stringify(report, null, 2));
    await writeFile(join(out, 'index.md'), `# 小红书面经抓取\n\n状态：${report.status}；候选 ${found.size}；成功 ${report.articles.length}；失败 ${report.failures.length}\n\n图片仅保留链接，未 OCR。\n\n${report.articles.map(n => `- [${(n.title || n.id).replace(/[\r\n]/g, ' ')}](${n.file})`).join('\n')}\n`);
    if (!o.out) await catalog();
    console.log(JSON.stringify({ status: report.status, candidates: found.size, saved: report.articles.length, failed: report.failures.length, out }, null, 2));
    if (report.status === 'blocked') console.log('已停止访问。若为频率限制，请停止本轮采集；若为登录/验证，请在 CDP Chrome 中自行处理后决定是否恢复。');
    if (report.status !== 'ok') process.exitCode = 2;
  } finally { cdp.ws.close(); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(e => { console.error(e.message); process.exitCode = 1; });
