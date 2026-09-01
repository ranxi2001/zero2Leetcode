---
layout: default
title: Python 基础
description: 从零掌握 Python 语法、容器、调试和 ACM 输入输出
eyebrow: Module 01
---

# 第一阶段：Python 刷题基础

> 目标：不只会抄语法，而是能读懂题解、跟踪变量，并独立写出完整 ACM 程序。

## 学习路线

### 第一层：读懂表达式

1. [变量与数据类型](./01-variables-types/index.html) — 数字、字符串、布尔值、类型转换
2. [控制流](./02-control-flow/index.html) — 条件、循环、边界与循环不变量
3. [函数](./03-functions/index.html) — 参数、返回值、作用域、递归与代码组织

### 第二层：选对容器

4. [集合类型](./04-collections/index.html) — list、tuple、dict、set、deque 与复杂度
5. [类、对象与数据结构节点](./05-classes/index.html) — class、self、ListNode、TreeNode
6. [刷题工具与调试](./05-coding-tricks/index.html) — 排序 key、bisect、itertools、断言与报错定位

### 第三层：写完整程序

7. [输入输出与 ACM 模式](./06-input-output/index.html) — 单行、多行、矩阵、多组测试、EOF、快速 IO

## 学完应该能做到

- 解释一段 Python 代码每个变量如何变化。
- 根据操作需求选择 list、dict、set 或 deque。
- 区分 return 与 print、原地修改与返回新对象。
- 读懂 class、self、ListNode 与 TreeNode。
- 看懂递归的终止条件和调用栈。
- 把题面输入解析成数组、矩阵和记录。
- 写出 `solve()`，处理多组用例并严格格式化输出。

## 文章概览

| # | 标题 | 解决的问题 |
|---|------|------------|
| 01 | 变量与数据类型 | 值是什么类型，怎样转换与操作字符串 |
| 02 | 控制流 | 程序为什么走这个分支，循环何时结束 |
| 03 | 函数 | 参数怎样传递，结果怎样返回，递归怎样展开 |
| 04 | 集合类型 | 数据该用什么容器存，操作复杂度是多少 |
| 05 | 类与节点对象 | 链表和树节点怎样定义、连接与访问 |
| 06 | 刷题工具与调试 | 怎样少写重复代码、设计测试和定位错误 |
| 07 | 输入输出与 ACM | 怎样把原始文本变成算法输入并输出答案 |

## 推荐学习方法

每篇不要只阅读：

1. 手敲至少一个示例。
2. 改一个输入并预测输出。
3. 用表格记录循环变量。
4. 完成文末自测。
5. 最后到 [ACM 模拟 IDE]({{ '/acm-playground.html' | relative_url }}) 运行完整程序。

---

[开始学习：变量与数据类型 →](./01-variables-types/index.html)
