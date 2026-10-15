---
name: scrape-xiaohongshu
description: 通过 Chrome 原生 CDP 搜索小红书笔记、读取面经正文与图片链接，导出带来源的 Markdown。用户要求抓取小红书面经、读取小红书搜索链接或使用无插件 CDP 方案时使用。
---

# 小红书面经 CDP 抓取

使用 [scripts/scrape.mjs](scripts/scrape.mjs)，Node.js >= 22，无 npm 依赖，无需 XHS Bridge。默认复用牛客技能的 `~/.chrome-nowcoder` profile 及其中已有的小红书登录态。

## 运行

在仓库根目录执行：

```powershell
# 仅当共享 profile 中的小红书登录失效时使用
node .agents/skills/scrape-xiaohongshu/scripts/scrape.mjs --login

# 默认搜索华为面试，首屏最多读取 5 篇
node .agents/skills/scrape-xiaohongshu/scripts/scrape.mjs --search "华为面试" --pages 1 --limit 5

# 逐批点击所有可加载结果；复用已保存的笔记，持续写盘
node .agents/skills/scrape-xiaohongshu/scripts/scrape.mjs --search "华为面试" --all --port 9223

# 支持用户给出的 search_result_ai URL（自动解码重复编码的关键词）
node .agents/skills/scrape-xiaohongshu/scripts/scrape.mjs --url "https://www.xiaohongshu.com/search_result_ai?keyword=%25E5%258D%258E%25E4%25B8%25BA%25E9%259D%25A2%25E8%25AF%2595"

# 读取单篇，保留来源 URL 中的 xsec_token
node .agents/skills/scrape-xiaohongshu/scripts/scrape.mjs --url "完整笔记链接"
```

参数：`--port` 默认 9222；`--pages` 是搜索滚动批次数，默认 1；`--limit` 默认 5；`--delay` 默认 10000 毫秒，最小 5000；它同时作为页面加载等待和可能加载远端内容的操作间隔下限；`--out` 指定新的输出目录。默认输出到本技能 `output/<运行时间>/`。

导航、详情定位滚动、点击和搜索翻页共用串行节流预算，每 10 次操作后至少休息 60 秒；页面内部 DOM 读取不计入预算。详情失败后，下次访问至少等待 30 秒、60 秒；连续 3 次失败就保存进度并以 `partial` 停止，不自动重试失败笔记。成功读取详情会重置连续失败计数。单篇 URL 只导航一次。

同一登录 profile 同时只运行一个抓取任务；不要并行跑关键词或连续重启脚本规避等待。当前节流预算仅在单次进程内有效，不跨进程共享。出现频繁访问、登录或验证提示立即停止，不自动刷新或重新启动；频率限制应先停止本轮采集，登录/验证由用户自行处理后再决定是否恢复。默认间隔是保守的本地配置，不是平台公布的安全阈值，不能保证免于风控。需要更慢时可使用 `--delay 20000`。

用户要求搜集完整时使用 `--all`：逐批发现、点击和保存，不受默认 `--pages/--limit` 限制；连续 5 次滚动无新 ID 时停止，最多 200 批次。记录停止原因、加载检查和失败 ID；达到上限或出现验证不能称为完成。即使正常停止，也只能说当前查询已加载到无新增结果，不能声称整个小红书全量。原文复用通过 `file` 指向此前运行目录；统计应读 `manifest.json` 中的 `articles`，不能只数当前目录的 Markdown 文件。

脚本优先连接已有调试端口，通过 `chrome://version` 核实配置路径属于 `~/.chrome-nowcoder`；端口属于其他 profile 时保留该浏览器并尝试后续端口（最多 10 次）。端口不可达时用牛客 profile 启动 Chrome，可用 `CHROME_PATH` 指定 Chrome。保留浏览器供用户核对，只关闭脚本创建的 CDP 连接。连接已有实例时创建自己的标签页，不覆盖用户标签页。不复制 Cookie、不另建小红书 profile。若牛客 profile 已由其他端口的实例使用，使用 `--port` 指定该端口；若该实例未启用 CDP，应说明情况，不强制关闭用户浏览器。

## 执行与核对

按用户给定关键词或 URL 直接执行。没有范围时先取首屏 5 篇。搜索 URL 统一转为普通 `/search_result` 页面；AI 搜索摘要不作为原帖证据。

从搜索列表逐条点击笔记打开详情，等待正文加载，提取后关闭详情并继续；不能把搜索卡片标题当笔记正文。每篇立即写入单篇 Markdown 和 `manifest.json`，默认输出目录还会更新根目录的 `index.md`、`catalog.json` 和 `all-in-one.md`，按笔记 ID 去重。可运行 `node .agents/skills/scrape-xiaohongshu/scripts/catalog.mjs` 重建总索引。核对候选数、成功数、失败数及来源链接；`partial` 表示部分详情失败，`blocked` 表示登录或验证阻断。未提取到结果时不能宣称该主题没有帖子。

本项目手撕题清单默认只分析文字正文，不下载、OCR 或查看图片。按自然年筛选原帖发布时间，区分发布时间与编辑时间、2026 年与 2026 届。若正文明确描述往年面试，按实际年份排除。跨关键词按笔记 ID 去重，并检查同作者重复叙述。同题在同一篇只计一次；未实际要求写代码、换题前只口述的题另外统计。推广汇总中的频次不能作为独立一手面试计数。模糊的“链表题”“DP题”单列，不猜测具体题名或 LeetCode 编号。报告频次是本轮已读样本中的出现次数，不代表全网全年概率。

华为手撕资料范围排除财经、财务、会计、审计：`scripts/scope.mjs` 负责筛选，完整模式在点击前按标题跳过，读取后再核对正文。已归档的范围外笔记从总索引和合集移出，保留在 `excluded.md` 及 `catalog.json.excludedArticles` 供审计，不进入题目频次。文章还需人工排除非编码岗位、其他公司、机考题、社招与不匹配的招聘批次。

只读取页面已加载的笔记数据及 DOM，不破解签名、不绕过登录或验证码。遇到登录/验证页面，说明需要用户在已打开的 CDP Chrome 完成操作。原文为空而有图片时标记为图片笔记；图片仅保存链接，未 OCR，不能宣称已读取图片内题目。抓取时间与原帖发布时间分开记录，缺失日期不推测。

摘要优先区分公司、岗位、轮次、具体问题与个人感受，保留来源归因，不把经验帖描述为公司官方题库。不在抓取时发布、评论、点赞或收藏。不自动将原始面经改写进正式文章。

原始抓取结果及带访问参数的链接只保存在 Git 忽略的 `output/` 下。每轮使用新目录，避免覆盖前一轮结果；不保存 Cookie 或浏览器配置到仓库。
