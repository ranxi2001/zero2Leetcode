---
name: local-practice-problem-adder
description: 为 Zero2Leetcode 的本地练习页批量补充题目描述、代码模板、测试用例与接线逻辑。适用于扫描缺失题目、按当前可用并发能力分批写入 `assets/js/playground-extra/`，并最终接入 `playground.html` 与 `assets/js/playground.js`。
---

# 本地练习加题技能

你是 Zero2Leetcode 的本地练习加题助手。你的任务是把 Hot 100 题目逐步补进本地练习页，使题目既能通过 `playground.html?id=<id>` 直接打开，也尽可能支持本地运行测试。

除非用户明确指定别的做法，否则默认按本技能执行。

## 适用场景

当用户出现以下需求时，使用本技能：

- “为本地练习加题”
- “给 playground 补题目描述和测试用例”
- “把剩下的题接入本地练习”
- “用并行代理补本地 OJ”
- “让 `playground.html?id=xx` 支持更多题”
- “把缺失的题详情补进本地练习页”

## 关键文件

- `assets/js/problems-data.js`
  题目元数据总表，包含 id、标题、难度、分类、LeetCode 链接、部分博客链接。
- `assets/js/playground.js`
  本地练习核心逻辑，已有部分详细题目对象、辅助数据结构 setup、运行器与比较函数。
- `playground.html`
  页面脚本加载顺序与入口。
- `assets/js/playground-extra/`
  并行代理写入的批次文件目录。每个代理只负责一个 `batch-*.js`。
- `.claude/skills/cnblogs-publisher/published_links_*.json`
  若该文件存在且 `problems-data.js` 的 `blogUrl` 不全，可从这里补齐已发布博客链接；不要假设日期后缀或文件一定存在。

## 默认工作流

### 1. 先盘点缺口

读取 `assets/js/problems-data.js` 与 `assets/js/playground.js`：

- 找出已经在 `problems-data.js` 中存在，但在 `playground.js` 里没有详细对象的题目 id
- 优先补已经发布博客、已经被外部链接引用、或用户点名的题目

### 2. 按当前可用并发动态分工

如果缺口很多，可使用并行代理分批处理，但并发数必须根据当前运行环境动态决定：

- 先检查当前可用并发槽位与正在运行的任务，不硬编码代理数量
- 没有额外并发能力时改为主线程顺序处理
- 每个代理只拥有一个独立输出文件
- 不要让多个代理同时编辑 `assets/js/playground.js` 或 `playground.html`

推荐分工方式：

- 代理只写 `assets/js/playground-extra/batch-N.js`
- 当前仓库已加载 `batch-1.js` 到 `batch-8.js`；新增批次使用未占用的编号，不覆盖现有文件
- 主线程最后统一修改 `playground.html` 和 `assets/js/playground.js`

## 批次文件规范

每个批次文件必须是合法 JS，格式固定为：

```js
window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  {
    id: 128,
    title: 'LC 128 - Longest Consecutive Sequence',
    difficulty: 'Medium',
    tags: ['哈希表'],
    description: `...`,
    template: `...`,
    functionName: 'longest_consecutive',
    testCases: [
      { input: [[100, 4, 200, 1, 3, 2]], expected: 4 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/longest-consecutive-sequence/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/xxxx.html',
  },
]);
```

### 每题对象必须包含

- `id`
- `title`
- `difficulty`
- `tags`
- `description`
- `template`
- `functionName`
- `testCases`
- `compareFunc`
- `solutionUrl`
- `blogUrl`

### 按题型补充字段

链表题按需使用：

- `setup: LINKED_LIST_SETUP`
- `argWrappers`
- `returnWrapper`

二叉树题按需使用：

- `setup: BINARY_TREE_SETUP`
- `argWrappers`
- `returnWrapper`

可直接参考 `assets/js/playground.js` 中已有链表题、树题对象的写法。

## 题目内容约束

### 描述

- 使用中文
- 适合直接展示在页面里
- 与现有 `playground.js` 风格保持一致
- 用 HTML 字符串，包含标题、难度、示例、提示

### 模板

- 使用 Python 模板
- 函数名与 `functionName` 对齐
- 如果题目依赖结构体，模板中保留 LeetCode 风格注释

### 测试用例

- 尽量给 3 到 5 组有效测试
- 用例优先覆盖基础情况、边界情况、常见坑点
- 比较函数通常为 `equal`、`sorted`、`sorted_nested`

以下类型允许暂时不接本地测试，但题目对象仍要完整：

- random 指针链表
- 数据流/缓存/前缀树等类设计题
- “返回环入口节点”这类在当前运行模型下不方便稳定校验的题

这类题可写：

```js
testCases: [],
compareFunc: 'equal',
```

并在描述中明确“当前暂未接入本地测试”。

## 接线原则

### 1. 批次脚本加载顺序

如果批次文件中引用了 `LINKED_LIST_SETUP` 或 `BINARY_TREE_SETUP`，则：

- 批次脚本必须放在 `assets/js/playground.js` 之后加载
- 但要在页面初始化前加载完成

推荐顺序：

```html
<script src="assets/js/problems-data.js"></script>
<script src="assets/js/playground.js"></script>
<script src="assets/js/playground-extra/batch-1.js"></script>
<script src="assets/js/playground-extra/batch-2.js"></script>
<script src="assets/js/playground-extra/batch-3.js"></script>
<script src="assets/js/playground-extra/batch-4.js"></script>
<script src="assets/js/playground-extra/batch-5.js"></script>
<script src="assets/js/playground-extra/batch-6.js"></script>
<script src="assets/js/playground-extra/batch-7.js"></script>
<script src="assets/js/playground-extra/batch-8.js"></script>
<script src="assets/js/ai-assistant.js"></script>
```

### 2. `playground.js` 的合并方式

不要要求并行代理直接改 `DETAILED_PROBLEMS`。

主线程统一把额外题目并进详细题目集合，例如：

```js
const EXTRA_DETAILED_PROBLEMS =
    (typeof window !== 'undefined' && Array.isArray(window.PLAYGROUND_EXTRA_PROBLEMS))
        ? window.PLAYGROUND_EXTRA_PROBLEMS
        : [];

const ALL_DETAILED_PROBLEMS = [...DETAILED_PROBLEMS, ...EXTRA_DETAILED_PROBLEMS];
```

然后用 `ALL_DETAILED_PROBLEMS` 构建最终的题目映射。

### 3. 不要破坏 fallback

即使某题暂时没有本地测试，也要保留基于 `problems-data.js` 的 fallback 能力，保证：

- `playground.html?id=<id>` 能打开正确题目
- 没有本地测试时页面能给出提示，而不是报错

## 并行代理提示词模板

给单个代理时，建议使用下面的结构：

```text
你负责 `assets/js/playground-extra/batch-N.js`，只改这一个文件。
你不是独自在代码库里工作，不要回滚别人的改动，也不要编辑其他文件。

任务：为以下题目生成本地练习题详情对象并写入该文件：
<题号列表>

输出文件格式必须是：
window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  ...题目对象...
]);

要求：
1. 参考 `assets/js/playground.js` 现有题目对象风格。
2. 参考 `assets/js/problems-data.js` 的标题、难度、url、blogUrl。
3. 每题必须包含：id,title,difficulty,tags,description,template,functionName,testCases,compareFunc,solutionUrl,blogUrl。
4. 链表题/树题按需使用 `LINKED_LIST_SETUP`、`BINARY_TREE_SETUP`、`argWrappers`、`returnWrapper`。
5. 对不适合当前本地 OJ 的题，允许 `testCases: []`，但不能写错题目对象结构。
6. 输出必须是合法 JS。

完成后只回复你改了哪个文件。
```

## 验收清单

完成一轮加题后，至少检查以下内容：

1. `assets/js/playground-extra/batch-*.js` 都存在且是合法 JS
2. `playground.html` 已加载这些批次文件
3. `assets/js/playground.js` 已合并额外详细题目
4. 下拉列表能显示新增题目
5. 直接访问 `playground.html?id=<id>` 能定位到对应题目
6. 有测试用例的题可以正常运行
7. 无测试用例的题会显示“暂未接入本地测试”，而不是崩溃

## 执行策略

- 小批量改动时，可以手工补到 `playground.js`
- 大批量改动时，优先使用 `playground-extra/` + 主线程接线
- 如果用户要求并行，按当前可用并发槽位分工，并保证每个代理只编辑自己的批次文件
- 若发现已有未提交改动，理解并兼容，不要回滚用户的修改
