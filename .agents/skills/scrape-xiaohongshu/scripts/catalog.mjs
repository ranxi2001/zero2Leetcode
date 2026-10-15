import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { exclusionReason } from './scope.mjs';

export async function catalog(root = resolve(import.meta.dirname, '../output')) {
  const notes = new Map(), runs = [];
  for (const e of await readdir(root, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    let run;
    try { run = JSON.parse(await readFile(join(root, e.name, 'manifest.json'), 'utf8')); } catch { continue; }
    if (!Array.isArray(run.articles)) continue;
    runs.push({ directory: e.name, source: run.source, status: run.status, count: run.articles.length });
    for (const a of run.articles) notes.set(a.id, { ...a, localPath: `${e.name}/${a.file}`, fetchedAt: run.fetchedAt });
  }
  const archived = [...notes.values()];
  const articles = archived.filter(a => !exclusionReason(a));
  const excludedArticles = archived.filter(a => exclusionReason(a)).map(a => ({...a, exclusionReason:exclusionReason(a)}));
  const date = a => a.publishedAt ? new Date(a.publishedAt).toLocaleDateString('sv-SE', { timeZone: 'Asia/Shanghai' }) : '未知';
  const clean = x => (x || '').replace(/[\n\r|]/g, ' ');
  const index = `# 小红书抓取结果总索引\n\n更新时间：${new Date().toISOString()}\n\n已去重保存 ${articles.length} 篇笔记。包含其他年份和待筛选内容，不等于有效手撕题样本数。正文保存在单篇 Markdown，图片当前仅为链接。\n\n[全部笔记正文合集](all-in-one.md) · [结构化数据](catalog.json)\n\n| 发布日期 | 笔记 | 正文字数 | 图片数 |\n|---|---|---:|---:|\n${articles.map(a => `| ${date(a)} | [${clean(a.title || a.id)}](${a.localPath}) | ${a.text.length} | ${a.images.length} |`).join('\n')}\n\n## 抓取批次\n\n${runs.map(r => `- ${r.directory}：${r.status}，已保存 ${r.count} 篇`).join('\n')}\n`;
  await writeFile(join(root, 'index.md'), index);
  await writeFile(join(root, 'catalog.json'), JSON.stringify({ updatedAt: new Date().toISOString(), archivedCount:archived.length, excludedArticles, runs, articles }, null, 2));
  await writeFile(join(root, 'excluded.md'), `# 排除记录\n\n以下 ${excludedArticles.length} 篇已从技术岗总索引和统计中排除，保留原始归档以便核对。\n\n${excludedArticles.map(a => `- [${clean(a.title || a.id)}](${a.localPath})：${a.exclusionReason}`).join('\n')}\n`);
  await writeFile(join(root, 'all-in-one.md'), (await Promise.all(articles.map(a => readFile(join(root, a.localPath), 'utf8')))).join('\n\n---\n\n'));
  return { count: articles.length, index: join(root, 'index.md') };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) console.log(await catalog());
