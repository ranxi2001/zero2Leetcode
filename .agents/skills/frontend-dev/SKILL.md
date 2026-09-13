---
name: frontend-dev
description: Zero2Leetcode 前端开发技能 — 快速理解项目技术栈、架构、CSS/JS 模式，指导页面调整与功能添加。
---

# Zero2Leetcode 前端开发技能

你是 Zero2Leetcode 项目的前端开发助手。帮助开发者理解项目架构、调整页面、添加新功能。

除非用户明确指定别的做法，否则当涉及前端开发相关问题时默认按本技能执行。

## 适用场景

当用户出现以下需求时，使用本技能：

- "帮我理解这个项目的前端架构"
- "页面上要加一个新功能/新区块"
- "修改某个页面的样式"
- "添加一个新页面"
- "这个 JS 逻辑是怎么工作的"
- "我想改 playground 的布局"
- "首页要加一个新板块"
- "怎么给页面加交互"

## 技术栈概览

| 分类 | 技术 |
|------|------|
| **框架** | 纯 HTML/CSS/JavaScript（无框架） |
| **静态生成** | Jekyll（GitHub Pages） |
| **代码编辑器** | CodeMirror 5（CDN 引入） |
| **Python 运行时** | Pyodide v0.26.4（浏览器端 Python） |
| **Go 运行时** | 官方 Go Playground（远程编译执行） |
| **Java 运行时** | CheerpJ 4.3 + ECJ 3.42.0（浏览器端 Java 17） |
| **Markdown 渲染** | Marked.js |
| **AI 集成** | OpenRouter API（SSE 流式） |
| **部署** | GitHub Pages + GitHub Actions |
| **样式方案** | 纯 CSS + CSS 自定义属性（无 Tailwind/预处理器） |
| **状态存储** | localStorage + 全局 window 变量 |
| **字体** | Google Fonts（Inter + Fira Code） |

## 项目目录结构

```
zero2Leetcode/
├── index.html                    # 首页（学习路线、知识模块、题目清单）
├── playground.html               # 在线练习场（三栏布局：题目|编辑器|AI）
├── acm-playground.html           # ACM 模拟 IDE（Python/Go/Java、stdin/stdout、调试）
├── _config.yml                   # Jekyll 配置
│
├── assets/
│   ├── css/
│   │   ├── style.css             # 全局样式 + CSS 变量（主题系统）
│   │   ├── playground.css        # 练习场专用样式
│   │   ├── acm-playground.css    # ACM 模拟 IDE 专用样式
│   │   └── docs.css              # 文档页样式
│   ├── js/
│   │   ├── app.js                # 首页逻辑（导航、筛选、搜索、表格）
│   │   ├── playground.js         # 练习场核心（~2300 LOC）
│   │   ├── acm-playground.js     # ACM 模拟 IDE 核心逻辑
│   │   ├── acm-bridge.js         # 真题文章与 ACM IDE 的代码/样例桥接
│   │   ├── java-runner-worker.js # CheerpJ Java 编译执行 Worker
│   │   ├── ai-assistant.js       # AI 助手 UI + API 调用
│   │   ├── problems-data.js      # 题目元数据总表
│   │   └── playground-extra/     # 批次扩展题目文件
│   │       └── batch-*.js         # 当前为 batch-1.js ... batch-8.js
│   ├── vendor/
│   │   └── zero2leetcode-java-runner.jar # ECJ + 浏览器 runner
│   └── images/
│       └── logo.svg
│
├── _layouts/                     # Jekyll 模板
├── docs/                         # 文档与学习指南
├── 00_python_basics/             # 学习路径阶段 1
├── 01_data_structures/           # 学习路径阶段 2
├── 02_algorithms/                # 学习路径阶段 3
├── 03_leetcode_practice/         # 学习路径阶段 4
│
├── .github/workflows/deploy.yml  # CI/CD 部署
└── .claude/skills/               # 项目技能目录
```

## 页面架构

### index.html（首页）

- **加载的 CSS**：`style.css`
- **加载的 JS**：`problems-data.js` → `app.js`
- **页面结构**：
  - `nav.navbar` — 顶部导航栏
  - `header.hero` — 首页横幅（统计数据、CTA 按钮）
  - `section#roadmap` — 学习路线（4 阶段时间线）
  - `section#modules` — 知识模块卡片网格
  - `section#problems` — 题目清单表格（带筛选/搜索）
  - `footer.footer` — 页脚
- **JS 初始化入口**：`DOMContentLoaded` → `initNavbar()` / `initProblemsTable()` / `initFilters()` / `initSearch()` / `initModuleCards()`

### playground.html（在线练习场）

- **加载的 CSS**：`style.css` + `playground.css` + CodeMirror CSS（CDN）
- **加载的 JS**（按顺序）：
  1. `marked.min.js`（defer）
  2. CodeMirror 核心 + Python 模式 + 插件（CDN）
  3. `problems-data.js`
  4. `playground.js`
  5. `playground-extra/batch-*.js`
  6. `ai-assistant.js`
- **页面结构**：
  - `nav.navbar` — 顶部导航栏（与首页共享结构）
  - `.playground-toolbar` — 工具栏（题目选择、运行按钮、Pyodide 状态）
  - `.playground-layout` — 三栏布局：
    - `.panel-problem` — 左侧题目描述面板
    - `.panel-editor` — 中间代码编辑器 + 输出面板
    - `.panel-ai` — 右侧 AI 助手面板
- **关键全局变量**：
  - `window.currentProblem` — 当前选中的题目对象
  - `window.editor` — CodeMirror 实例
  - `window.PROBLEMS_DATA` — 题目元数据数组（来自 problems-data.js）
  - `window.PROBLEMS` — `playground.js` 合并详细题目与 fallback 后的运行时数组
  - `window.PLAYGROUND_EXTRA_PROBLEMS` — 扩展题目数组

### acm-playground.html（ACM 模拟 IDE）

- **加载的 CSS**：`style.css` + `acm-playground.css` + CodeMirror CSS（CDN）
- **加载的 JS**：CodeMirror 核心与 Python/Go/Java 模式（CDN）→ Pyodide（CDN）→ `acm-playground.js`
- **页面结构**：
  - `.acm-toolbar` — 语言、输入模板、超时、运行/调试/重置/保存代码
  - `.acm-layout` — 左侧代码编辑器，右侧 stdin/stdout/期望输出与调试面板
  - `.acm-statusbar` — 执行状态与调试提示
- **运行模式**：Python 通过浏览器内 Pyodide 执行；Go 通过官方 Go Playground 在线编译；Java 17 由 Web Worker 加载 CheerpJ 4.3，并使用同域 ECJ runner JAR 在访问者浏览器内编译执行
- **调试能力**：仅 Python 支持逐行调试；Go 和 Java 首版只支持编译运行
- **持久化**：代码、输入、期望输出与当前语言按语言分别保存到 localStorage
- **文件能力**：源代码保存为 `.py`/`.go`/`.java`，练习包使用 JSON 导入导出；真题文章由 `acm-bridge.js` 识别三种语言并注入跳转参数

## CSS 架构与规范

### 主题系统

所有颜色、间距、圆角、阴影、字体都通过 CSS 自定义属性定义在 `:root` 中。修改视觉风格时优先调整变量，而不是硬编码值。

```css
/* 关键变量分组 */
--primary / --primary-dark / --primary-light / --primary-glow  /* 主色调（紫色系 hue=250） */
--accent / --accent-dark                                        /* 强调色（青色系 hue=170） */
--easy / --medium / --hard                                      /* 难度颜色 */
--bg-primary / --bg-secondary / --bg-tertiary / --bg-card       /* 背景层级（深色主题） */
--text-primary / --text-secondary / --text-muted                /* 文字层级 */
--border-color / --border-hover                                 /* 边框 */
--spacing-xs ~ --spacing-3xl                                    /* 间距梯度 */
--radius-sm ~ --radius-xl                                       /* 圆角梯度 */
--shadow-sm ~ --shadow-glow                                     /* 阴影梯度 */
--transition-fast / --transition-base / --transition-slow        /* 过渡速度 */
--font-sans / --font-mono                                       /* 字体族 */
```

### 样式编写规范

1. **亮/暗主题**：`:root` 提供默认变量，`html[data-theme="light"]` 覆盖亮色变量；主题选择保存在 `z2l-theme`，未设置时跟随系统偏好
2. **卡片样式**：统一使用 `--bg-card` + `--border-color` + `--radius-md`，hover 时用 `--bg-card-hover`
3. **按钮系统**：`.btn` 基础类 + `.btn-primary` / `.btn-secondary` / `.btn-run` / `.btn-reset` 变体
4. **响应式**：现有页面以桌面布局为基础，通过 `max-width` 媒体查询在小屏下折叠和重排
5. **过渡动画**：所有交互元素使用 `var(--transition-base)`，微交互用 `var(--transition-fast)`
6. **渐变文字**：使用 `.gradient-text` 类实现渐变效果
7. **命名约定**：BEM 风格命名（如 `.panel-header`、`.nav-link-active`、`.hero-stats`）

### 添加新样式的位置

- 全局通用样式 → `assets/css/style.css`
- 练习场专用样式 → `assets/css/playground.css`
- 文档页样式 → `assets/css/docs.css`
- 如果新增独立页面，可新建对应 CSS 文件并在 HTML 中引入

## JavaScript 模式

### 代码组织

项目使用函数式组织方式，无模块打包器。每个 JS 文件通过 `<script>` 标签加载，通过 `window` 全局变量通信。

```
problems-data.js  →  window.PROBLEMS_DATA（题目元数据数组）
playground.js     →  window.editor, window.currentProblem, DETAILED_PROBLEMS 等
batch-*.js        →  window.PLAYGROUND_EXTRA_PROBLEMS（扩展题目）
ai-assistant.js   →  读取 window.currentProblem 获取当前题目上下文
app.js            →  读取 window.PROBLEMS_DATA 构建首页表格
acm-playground.js →  管理 ACM 编辑器、Python/Go/Java 执行、调试与文件导入导出
java-runner-worker.js → 加载 CheerpJ 与 ECJ runner，在独立 Worker 中执行 Java
```

### 关键 JS 模式

1. **DOM 操作**：直接使用 `document.querySelector` / `document.getElementById`，无 jQuery
2. **事件绑定**：`addEventListener` 绑定在 `DOMContentLoaded` 之后
3. **模板渲染**：使用字符串模板字面量（backtick）生成 HTML，赋值给 `innerHTML`
4. **数据存取**：`localStorage.getItem/setItem` + JSON 序列化
5. **异步模式**：`async/await` 用于 Pyodide、远程 Go、Java Worker 和 AI API 调用
6. **AI 流式响应**：使用 `fetch` + `ReadableStream` 读取 SSE 事件流

### 添加新功能的入口

| 功能类型 | 修改文件 | 入口函数 |
|---------|---------|---------|
| 首页新板块 | `index.html` + `style.css` + `app.js` | 在 `DOMContentLoaded` 回调中添加 `initXxx()` |
| 练习场新面板 | `playground.html` + `playground.css` + `playground.js` | 在页面初始化流程中添加 |
| ACM IDE 功能 | `acm-playground.html` + `acm-playground.css` + `acm-playground.js` | 在 `DOMContentLoaded` 初始化与 `bindEvents()` 中接入 |
| AI 助手功能 | `ai-assistant.js` + `playground.css` | 修改 AI 面板逻辑 |
| 新独立页面 | 新建 `xxx.html` + 对应 CSS/JS | 复制导航栏结构，引入 `style.css` |

## 常见开发任务指南

### 1. 添加首页新板块

```
步骤：
1. 在 index.html 中合适位置添加 <section> 结构
2. 在 style.css 中添加板块样式（使用 CSS 变量）
3. 如果需要交互，在 app.js 中添加初始化函数并在 DOMContentLoaded 中调用
```

### 2. 修改练习场布局

```
步骤：
1. 阅读 playground.html 理解三栏结构
2. 修改 playground.css 中的 .playground-layout grid 定义
3. 如果添加新面板，需要同时更新 HTML 结构和 CSS grid 模板
4. 注意保持响应式：检查 @media 查询的移动端适配
```

### 3. 添加新的交互组件

```
步骤：
1. HTML：在目标页面添加 DOM 结构
2. CSS：使用项目 CSS 变量保持视觉一致性
   - 卡片：var(--bg-card), var(--border-color), var(--radius-md)
   - 按钮：复用 .btn 基础类
   - 文字：var(--text-primary) / var(--text-secondary)
3. JS：在对应 JS 文件中添加逻辑
   - 使用 querySelector 获取 DOM
   - 使用 addEventListener 绑定事件
   - 数据持久化用 localStorage
```

### 4. 创建新独立页面

```
步骤：
1. 复制 index.html 的 <head> 和 <nav> 部分作为基础
2. 引入 style.css（全局样式）
3. 如需独立样式，新建 assets/css/xxx.css
4. 如需逻辑，新建 assets/js/xxx.js
5. 更新共享模板中的导航；对仍使用内联导航的独立 HTML 页面同步修改
6. 顶层 HTML 默认会被 Jekyll 复制；只有文件受 include/exclude 配置影响时才调整 `_config.yml`
```

### 5. 修改题目数据

```
- 题目元数据（标题、难度、链接）→ assets/js/problems-data.js
- 题目详情（描述、模板、测试用例）→ assets/js/playground.js 或 playground-extra/batch-*.js
- 修改后需验证：
  - 首页表格是否正常显示
  - playground 下拉列表是否包含该题
  - playground.html?id=<id> 是否能正确路由
```

## 脚本加载顺序（重要）

### index.html

```html
<script src="assets/js/problems-data.js"></script>   <!-- 题目数据 -->
<script src="assets/js/app.js"></script>              <!-- 首页逻辑 -->
```

### playground.html

```html
<!-- 1. 第三方库 -->
<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js" defer></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/mode/python/python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/addon/hint/show-hint.min.js"></script>

<!-- 2. 数据层 -->
<script src="assets/js/problems-data.js"></script>

<!-- 3. 核心逻辑（定义 LINKED_LIST_SETUP、BINARY_TREE_SETUP 等） -->
<script src="assets/js/playground.js"></script>

<!-- 4. 扩展题目（依赖 playground.js 中的 setup 常量） -->
<script src="assets/js/playground-extra/batch-1.js"></script>
<script src="assets/js/playground-extra/batch-2.js"></script>
<script src="assets/js/playground-extra/batch-3.js"></script>
<script src="assets/js/playground-extra/batch-4.js"></script>
<script src="assets/js/playground-extra/batch-5.js"></script>
<script src="assets/js/playground-extra/batch-6.js"></script>
<script src="assets/js/playground-extra/batch-7.js"></script>
<script src="assets/js/playground-extra/batch-8.js"></script>

<!-- 5. AI 助手（依赖 window.currentProblem） -->
<script src="assets/js/ai-assistant.js"></script>
```

**新增脚本时必须注意加载顺序**：数据层 → 核心逻辑 → 扩展数据 → 附加功能。

### acm-playground.html

```html
<!-- 第三方编辑器与运行时均使用 CDN -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/codemirror.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/mode/python/python.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/mode/go/go.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.18/mode/clike/clike.min.js"></script>
<script src="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js"></script>

<!-- 页面逻辑最后加载 -->
<script src="assets/js/acm-playground.js?v=<version>"></script>
```

Java 不在页面主线程加载 JVM。`acm-playground.js` 按需创建 `java-runner-worker.js`，Worker 从 CheerpJ 官方 CDN 加载运行时，并从 `assets/vendor/` 读取随站点发布的 runner JAR。修改 Worker 或 runner 时必须同步递增资源版本并运行 `tests/acm-java.test.cjs`。

## 调试与验证

### 本地运行

```bash
# 方式 1：已安装 Jekyll 时渲染完整站点
jekyll serve

# 方式 2：简单 HTTP 服务（不需要 Jekyll 编译时）
python3 -m http.server 8000
# 或
npx serve .
```

仓库当前没有 `Gemfile`；不要使用 `bundle exec jekyll serve`，除非后续补充了 Bundler 配置。

### 检查清单

- [ ] 页面在 Chrome/Safari/Firefox 中正常显示
- [ ] 移动端响应式布局正确折叠
- [ ] 新增的 CSS 使用了项目 CSS 变量而非硬编码颜色
- [ ] 新增的 JS 不与现有全局变量冲突
- [ ] 脚本加载顺序正确（依赖项在前）
- [ ] localStorage 的 key 使用有意义的前缀避免冲突
- [ ] 导航栏链接在所有页面间保持一致
- [ ] 修改 ACM Java 链路后，Worker、runner JAR 和第三方许可文件均进入 Jekyll 发布产物

## 踩坑经验（来自 zero2Agent 姊妹项目）

### CSS 缓存问题

GitHub Pages 会强缓存 CSS/JS，修改样式后部署不生效是常见问题。**所有 CSS/JS 引用必须带版本号**：

```html
<link rel="stylesheet" href="assets/css/style.css?v=2">
<script src="assets/js/app.js?v=9"></script>
```

每次修改后递增版本号，否则用户看到的是旧样式。

### Hero 装饰代码块定位

浮动代码块（如首页右侧的代码装饰）正确写法：

```css
.hero { position: relative; overflow: hidden; }           /* 父容器 */
.hero-inner { position: relative; z-index: 1; }           /* 内容层，必须高于装饰 */
.hero-decoration {                                         /* 装饰层 */
    position: absolute;
    right: -60px; top: 50%;
    transform: translateY(-50%) rotate(-5deg);
    opacity: 0.55;
    pointer-events: none;
}
```

**常见错误**：
- 忘记给父容器加 `position: relative` → 装饰块定位到 viewport
- 忘记给父容器加 `overflow: hidden` → 装饰块溢出产生横向滚动条
- 忘记给内容层加 `z-index` → 装饰块遮挡文字/按钮的点击

### SVG Logo 设计

两个项目使用同一套 `{0}` logo，通过渐变色区分：
- **zero2Leetcode**：紫→青 `#818cf8 → #14b8a6`
- **zero2Agent**：绿→橙 `#10b981 → #f59e0b`

SVG logo 要点：
- 使用 `linearGradient` + `stroke="url(#logoGradient)"` 实现渐变描边
- 保持 `viewBox="0 0 48 48"` 统一尺寸
- 不要尝试用 SVG arc path 画复杂形状（弧线参数极易算错），优先用 `<ellipse>`、`<circle>`、`<path>` 的简单曲线

### 友情链接跨项目配色

友情链接应使用**对方项目的品牌色**，而非本项目色：

```css
/* zero2Agent 站内的 zero2Leetcode 链接 → 用紫青色 */
.nav-friend-link { color: #818cf8; border-color: rgba(129,140,248,0.3); }
.nav-friend-link:hover { color: #14b8a6; }

/* zero2Leetcode 站内的 Zero2Agent 链接 → 用绿橙色 */
.nav-friend-link { color: #10b981; border-color: rgba(16,185,129,0.3); }
.nav-friend-link:hover { color: #f59e0b; }
```

### 不蒜子访客计数

免费静态站计数器，零后端，CDN 加载：

```html
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>

<!-- 容器初始 display:none，busuanzi 加载完自动显示 -->
<span id="busuanzi_container_site_uv" style="display:none">
    你是第 <span id="busuanzi_value_site_uv"></span> 位读者
</span>
<span id="busuanzi_container_page_pv" style="display:none">
    本文 <span id="busuanzi_value_page_pv"></span> 次阅读
</span>
```

### 上一篇/下一篇导航 + Prefetch

通过 JS 在页面底部生成 prev/next 按钮，并注入 `<link rel="prefetch">` 实现秒开：

```javascript
var lnk = document.createElement('link');
lnk.rel = 'prefetch';
lnk.href = nextPageUrl;
document.head.appendChild(lnk);
```

导航数据从模板引擎（Jekyll Liquid）注入 `window.Z2A_NAV` 全局数组，JS 匹配当前 URL 找到前后文章。

### 回到顶部按钮

用 `scroll` 事件 + `{ passive: true }` 监听，超过 320px 显示，用 CSS `opacity + transform` 过渡：

```css
.back-to-top {
    position: fixed; right: 28px; bottom: 72px;
    opacity: 0; transform: translateY(14px);
    transition: opacity 0.25s, transform 0.25s;
}
.back-to-top.is-visible { opacity: 1; transform: translateY(0); }
```

### Mermaid 图表兼容性（9.4.3）

- **不要**在 edge label 里用 Unicode 特殊字符
- **不要**在 Note 里用 `<br/>`
- **不要**在 stateDiagram label 里用 `\n`
- 使用 `flowchart TD/LR`、`stateDiagram-v2`、`sequenceDiagram`
- 配置 `startOnLoad: false`，手动调用 `mermaid.init(undefined, els)`

## 执行策略

- 修改前先阅读相关文件，理解现有结构
- 优先使用 CSS 变量保持视觉一致性
- 新增交互时遵循项目现有的 JS 模式（函数式、无框架、全局变量通信）
- 修改 HTML 结构后检查响应式表现
- 修改 CSS/JS 后**必须递增版本号**（`?v=N`），否则部署后缓存不刷新
- 若发现已有未提交改动，理解并兼容，不要回滚用户的修改
- 不要引入新的构建工具或框架依赖（保持纯静态站点的简洁性）
- 装饰性元素用 `position: absolute` + `pointer-events: none`，内容层用 `z-index` 保持可交互
