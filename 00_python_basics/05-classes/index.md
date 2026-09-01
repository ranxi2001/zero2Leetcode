---
layout: default
title: 类、对象与数据结构节点
description: 从 class、self、__init__ 到 ListNode、TreeNode，读懂刷题中的节点对象
eyebrow: Python 基础 / 05
---

# 类、对象与数据结构节点

数组里的元素只需要一个值；链表节点除了值，还要指向下一个节点；树节点还要指向左右孩子。类让我们定义这种“数据 + 操作”的新类型。

## 类与对象

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def passed(self):
        return self.score >= 60


alice = Student("Alice", 95)
alice.name                 # "Alice"
alice.score                # 95
alice.passed()             # True
```

- `Student` 是类，描述对象应该有什么。
- `alice` 是对象，也叫实例。
- `name`、`score` 是对象属性。
- `passed` 是实例方法。

## __init__ 做什么

调用 `Student("Alice", 95)` 时，Python 创建对象并自动调用 `__init__` 初始化属性。

```python
class Point:
    def __init__(self, row=0, col=0):
        self.row = row
        self.col = col
```

`__init__` 通常不显式 return。它负责初始化，不负责创建并返回对象。

## self 是当前对象

```python
class Counter:
    def __init__(self):
        self.value = 0

    def increment(self):
        self.value += 1
```

调用：

```python
counter = Counter()
counter.increment()
```

可以理解为 Python 把 counter 自动作为第一个参数传入：

```python
Counter.increment(counter)
```

因此实例方法定义必须写 self，但调用时不用手动传。

## 每个对象有自己的属性

```python
first = Counter()
second = Counter()

first.increment()
first.value              # 1
second.value             # 0
```

属性写在 `self` 上属于具体对象。不要把本应独立的数据误写成所有对象共享的类属性。

## 单链表节点 ListNode

```python
class ListNode:
    def __init__(self, val=0, next_node=None):
        self.val = val
        self.next = next_node
```

手动连接三个节点：

```python
first = ListNode(1)
second = ListNode(2)
third = ListNode(3)

first.next = second
second.next = third
head = first
```

结构是：

```text
head -> [1] -> [2] -> [3] -> None
```

遍历：

```python
current = head
while current is not None:
    print(current.val)
    current = current.next
```

变量 `current` 保存“当前节点对象”，`current.val` 是值，`current.next` 是另一个节点或 None。

## 二叉树节点 TreeNode

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

构造：

```python
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
```

对应：

```text
       1
      / \
     2   3
    /
   4
```

递归遍历：

```python
def preorder(node):
    if node is None:
        return
    print(node.val)
    preorder(node.left)
    preorder(node.right)
```

## 对象变量保存的是引用

```python
node_a = ListNode(1)
node_b = node_a
node_b.val = 99

node_a.val                # 99
```

`node_a` 和 `node_b` 指向同一个对象。这是链表“相交”能够成立的原因：两个 next 可以指向同一个节点对象。

判断是不是同一个对象：

```python
node_a is node_b          # True
```

`==` 可以被类自定义为“值相等”；链表指针题判断节点身份时通常用 `is`。

## 方法与普通函数怎样选

LeetCode Python 模板在本站使用顶层函数：

```python
def reverse_list(head):
    ...
```

官方题面有时使用 Solution 类：

```python
class Solution:
    def reverseList(self, head):
        ...
```

算法本身相同，只是调用组织方式不同。必须沿用当前平台给出的函数或方法签名。

设计数据结构题则确实需要维护对象状态：

```python
class MinStack:
    def __init__(self):
        self.values = []
        self.minimums = []

    def push(self, value):
        self.values.append(value)
        if not self.minimums:
            self.minimums.append(value)
        else:
            self.minimums.append(min(value, self.minimums[-1]))

    def pop(self):
        self.minimums.pop()
        return self.values.pop()

    def get_min(self):
        return self.minimums[-1]
```

`self.values` 和 `self.minimums` 会在多次方法调用之间保留。

## dataclass：减少样板代码

普通业务代码可以使用：

```python
from dataclasses import dataclass

@dataclass
class Edge:
    target: int
    weight: int
```

但算法平台通常已经给出节点类，或更偏好简单元组。先熟练普通 class，再按需要使用 dataclass。

## 常见错误

| 错误 | 结果 |
|------|------|
| 方法漏写 self | 调用时参数数量错误 |
| 写 `val = val` 而不是 `self.val = val` | 属性没有保存 |
| `__init__` 返回一个值 | TypeError |
| 把节点值与节点对象混淆 | 访问 int.next 报错 |
| 链表移动后丢失 head | 无法返回原链表 |
| 递归访问 node.left 前不判断 None | AttributeError |

## 读节点题的步骤

1. 圈出函数参数是“值、数组还是节点对象”。
2. 画出每个 next、left、right 指向谁。
3. 每次修改指针前保存仍需使用的后继节点。
4. 明确函数最后返回节点还是节点值。
5. 用 0、1、2 个节点的最小结构测试。

## 自测

1. 构造链表 1 -> 2 -> 3 并遍历。
2. 解释 `current = current.next` 修改的是变量还是节点。
3. 构造一棵三层二叉树，写函数统计节点数。
4. 实现一个支持 add 和 size 的简单集合类。

---

[← 返回 Python 基础](../index.html) | [上一篇：集合类型](../04-collections/index.html) | [下一篇：刷题工具与调试 →](../05-coding-tricks/index.html)
