---
layout: default
title: 数据结构
description: 从数组到图和区间结构，掌握实现、复杂度与 ACM 构造
eyebrow: Module 02
---

# 第二阶段：数据结构

> 目标：知道每种结构怎样存数据、支持什么操作、复杂度是多少，并能从 ACM 文本输入自己构造。

## 建议阅读顺序

### 线性结构

1. [数组与字符串](./01-array-string/index.html) — 连续存储、下标、前缀和
2. [链表](./02-linked-list/index.html) — ListNode、指针修改、虚拟头节点
3. [栈与队列](./03-stack-queue/index.html) — LIFO、FIFO、deque、单调结构
4. [哈希表](./04-hash-table/index.html) — 映射、去重、计数与分组

### 树与图

5. [树与二叉树](./05-binary-tree/index.html) — TreeNode、遍历、BST
6. [堆](./06-heap/index.html) — 优先队列、Top K、多路归并
7. [图](./07-graph/index.html) — 边列表、邻接表、邻接矩阵与带权图
8. [字典树](./08-trie/index.html) — 字符串前缀查询
9. [并查集](./09-union-find/index.html) — 动态连通性与集合合并

### 动态区间与实战构造

10. [树状数组、线段树与位集合](./10-advanced-structures/index.html) — 动态区间查询
11. [ACM 模式构造数据结构](./11-acm-construction/index.html) — 从输入构造矩阵、链表、树、图和操作序列

## 选择数据结构的思路

先问“程序反复做什么操作”：

| 高频操作 | 首选结构 |
|----------|----------|
| 按下标访问 | 数组 |
| 中间节点插入/删除 | 链表 |
| 最近加入的先处理 | 栈 |
| 最早加入的先处理 | 队列 |
| 判断存在、按 key 查询 | 哈希表 |
| 反复取最小/最大 | 堆 |
| 层级关系 | 树 |
| 任意关系、路径、依赖 | 图 |
| 字符串前缀 | Trie |
| 动态判断是否连通 | 并查集 |
| 动态区间聚合 | 树状数组/线段树 |

## 学完应该能做到

- 手写 ListNode、TreeNode、Trie 和 UnionFind。
- 说出核心操作的时间与空间复杂度。
- 在邻接表、邻接矩阵和边列表之间做选择。
- 解释堆、BST、Trie 各自维护的结构性质。
- 从层序 token 构造二叉树并序列化。
- 从 n、m 和边列表构造有向/无向/带权图。

---

[开始学习：数组与字符串 →](./01-array-string/index.html)
