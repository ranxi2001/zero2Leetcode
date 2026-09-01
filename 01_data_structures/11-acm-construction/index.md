---
layout: default
title: ACM 模式构造数据结构
description: 从文本输入构造数组、矩阵、链表、二叉树和图，并正确序列化输出
eyebrow: 数据结构 / 11
---

# ACM 模式如何构造数据结构

核心代码模式会直接给你 `ListNode`、`TreeNode` 或二维数组；ACM 模式只给文本。你需要自己决定表示方式并完成转换。

通用流程：

```text
题面输入格式
  -> 读取行或 token
  -> 转成整数/字符串
  -> 选择表示方式
  -> 构造结构
  -> 调用算法
  -> 序列化答案
```

## 先判断是否真的需要“节点对象”

题目说“链表”不代表一定要创建 ListNode；题目说“树”也不代表一定要创建 TreeNode。

- 只处理节点值顺序：数组可能更简单。
- 父子关系固定且只做统计：邻接表可能比 TreeNode 更适合。
- 需要反转链表指针：创建 ListNode。
- 需要递归访问左右子树：创建 TreeNode。

表示方式应服务算法，不要为了“像题目”而增加对象。

## 一维数组

输入：

```text
5
3 1 4 1 5
```

```python
n = int(input())
nums = list(map(int, input().split()))
assert len(nums) == n
```

如果数组可能跨多行，使用 token 读取：

```python
import sys

data = list(map(int, sys.stdin.buffer.read().split()))
n = data[0]
nums = data[1:1 + n]
```

## 二维矩阵

```python
rows, cols = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(rows)]
```

坐标常用 `(row, col)`，访问顺序是先行后列：

```python
for row in range(rows):
    for col in range(cols):
        value = matrix[row][col]
```

## 构造单链表

### 节点定义

```python
class ListNode:
    def __init__(self, val=0, next_node=None):
        self.val = val
        self.next = next_node
```

### 数组转链表

```python
def build_linked_list(values):
    dummy = ListNode()
    tail = dummy

    for value in values:
        tail.next = ListNode(value)
        tail = tail.next

    return dummy.next
```

虚拟头节点 dummy 让空数组也能统一处理。

### 链表转数组输出

```python
def linked_list_to_values(head):
    values = []
    current = head

    while current is not None:
        values.append(current.val)
        current = current.next

    return values

values = [1, 2, 3]
head = build_linked_list(values)
print(*linked_list_to_values(head))
```

若链表可能有环，普通遍历会死循环，需要 visited 或步数限制。

### 构造带环链表

输入值数组和 `pos`，`pos = -1` 表示无环：

```python
def build_cyclic_list(values, pos):
    if not values:
        return None

    nodes = [ListNode(value) for value in values]
    for index in range(len(nodes) - 1):
        nodes[index].next = nodes[index + 1]

    if pos != -1:
        nodes[-1].next = nodes[pos]

    return nodes[0]
```

## 构造二叉树

### 节点定义

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

### 层序数组转树

输入：

```text
7
3 9 20 null null 15 7
```

`null` 表示缺少子节点。

```python
from collections import deque

def build_tree_level_order(tokens):
    if not tokens or tokens[0] == "null":
        return None

    root = TreeNode(int(tokens[0]))
    queue = deque([root])
    index = 1

    while queue and index < len(tokens):
        node = queue.popleft()

        if index < len(tokens) and tokens[index] != "null":
            node.left = TreeNode(int(tokens[index]))
            queue.append(node.left)
        index += 1

        if index < len(tokens) and tokens[index] != "null":
            node.right = TreeNode(int(tokens[index]))
            queue.append(node.right)
        index += 1

    return root
```

为什么要用队列？层序输入按照“当前节点的左孩子、右孩子”依次给出，队列保存下一批等待接收孩子的父节点。

### 树转层序数组

```python
def tree_to_level_order(root):
    if root is None:
        return []

    result = []
    queue = deque([root])

    while queue:
        node = queue.popleft()
        if node is None:
            result.append("null")
            continue

        result.append(str(node.val))
        queue.append(node.left)
        queue.append(node.right)

    while result and result[-1] == "null":
        result.pop()

    return result

tokens = ["3", "9", "20", "null", "null", "15", "7"]
root = build_tree_level_order(tokens)
print(" ".join(tree_to_level_order(root)))
```

末尾连续 null 不影响树结构，通常删除。

## 根据父节点数组构造树

有些题给每个节点的父节点：

```text
5
-1 0 0 1 1
```

`-1` 对应根，其他值是父节点编号。

```python
n = int(input())
parents = list(map(int, input().split()))
children = [[] for _ in range(n)]
root = -1

for node, parent in enumerate(parents):
    if parent == -1:
        root = node
    else:
        children[parent].append(node)
```

这类题通常直接用 children 邻接表，不必创建 TreeNode。

## 构造无向图

输入 n 个节点、m 条边：

```text
4 3
1 2
1 3
2 4
```

```python
n, m = map(int, input().split())
graph = [[] for _ in range(n + 1)]

for _ in range(m):
    u, v = map(int, input().split())
    graph[u].append(v)
    graph[v].append(u)
```

节点从 1 开始，因此分配 `n + 1` 个列表并空置下标 0。

## 构造有向图

```python
graph = [[] for _ in range(n)]
indegree = [0] * n

for _ in range(m):
    source, target = map(int, input().split())
    graph[source].append(target)
    indegree[target] += 1
```

不要加入反向边。拓扑排序需要同时记录入度。

## 构造带权图

```python
graph = [[] for _ in range(n + 1)]

for _ in range(m):
    u, v, weight = map(int, input().split())
    graph[u].append((v, weight))
    graph[v].append((u, weight))
```

统一使用 `(neighbor, weight)`，遍历时解包：

```python
for neighbor, weight in graph[node]:
    ...
```

## 邻接矩阵输入

输入本身就是 n 行 n 列时：

```python
n = int(input())
matrix = [list(map(int, input().split())) for _ in range(n)]
```

`matrix[u][v]` 可能表示是否有边，也可能直接表示权重。确认 0、-1 或 INF 分别代表什么。

## 操作序列构造设计类

输入：

```text
6
push 3
push 5
top
pop
empty
top
```

```python
operations = int(input())
stack = []
answers = []

for _ in range(operations):
    parts = input().split()
    operation = parts[0]

    if operation == "push":
        stack.append(int(parts[1]))
    elif operation == "pop":
        answers.append(str(stack.pop()))
    elif operation == "top":
        answers.append(str(stack[-1]))
    elif operation == "empty":
        answers.append("true" if not stack else "false")

print("\n".join(answers))
```

先读取操作名，再根据操作决定后面有几个参数。

## 一个完整示例：树的最大深度

```python
import sys
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def build_tree(tokens):
    if not tokens or tokens[0] == b"null":
        return None

    root = TreeNode(int(tokens[0]))
    queue = deque([root])
    index = 1

    while queue and index < len(tokens):
        node = queue.popleft()
        if index < len(tokens) and tokens[index] != b"null":
            node.left = TreeNode(int(tokens[index]))
            queue.append(node.left)
        index += 1
        if index < len(tokens) and tokens[index] != b"null":
            node.right = TreeNode(int(tokens[index]))
            queue.append(node.right)
        index += 1

    return root

def max_depth(root):
    if root is None:
        return 0
    return max(max_depth(root.left), max_depth(root.right)) + 1

def solve():
    tokens = sys.stdin.buffer.read().split()
    if not tokens:
        return
    count = int(tokens[0])
    root = build_tree(tokens[1:1 + count])
    print(max_depth(root))

if __name__ == "__main__":
    solve()
```

## 构造检查清单

1. 节点编号从 0 还是 1 开始？
2. 图是有向还是无向？
3. 边是否带权，元组顺序是什么？
4. 树输入是层序、父节点数组，还是边列表？
5. `null`、`-1`、`0` 各自代表什么？
6. 空结构怎样表示？
7. 输出需要值序列、层序数组还是逐行答案？

## 建议练习

- 数组转链表，再反转并序列化。
- 层序 token 构建二叉树，再输出前序遍历。
- 边列表构建图，统计连通分量。
- 父节点数组构建多叉树，求树高。
- 操作序列模拟队列或 LRU Cache。

---

[← 返回数据结构](../index.html) | [上一篇：进阶结构](../10-advanced-structures/index.html) | [下一章：核心算法 →]({{ '/02_algorithms/' | relative_url }})
