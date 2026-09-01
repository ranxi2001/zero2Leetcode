---
layout: default
title: 树状数组、线段树与位集合
description: 区间查询常见进阶数据结构及其适用边界
eyebrow: 数据结构 / 10
---

# 进阶数据结构：处理动态区间

普通前缀和能 O(1) 查询区间和，但数组修改后需要 O(n) 重建。进阶区间结构解决“数据会修改，同时反复查询”的问题。

## 先看选择表

| 数据结构 | 单点修改 | 区间查询 | 适合 |
|----------|----------|----------|------|
| 前缀和 | O(n) | O(1) | 静态数组 |
| 差分数组 | O(1) 区间修改 | O(n) 最终还原 | 批量修改后统一输出 |
| 树状数组 | O(log n) | O(log n) 前缀聚合 | 动态前缀和、频率 |
| 线段树 | O(log n) | O(log n) | 动态区间和/最值 |
| 稀疏表 | 不支持 | O(1) | 静态幂等查询，如最小值 |

先学前缀和与差分，再学树状数组；只有题目确实需要更灵活区间维护时再使用线段树。

## 前缀和

```python
nums = [3, 1, 4, 1, 5]
prefix = [0]

for value in nums:
    prefix.append(prefix[-1] + value)

def range_sum(left, right):
    # 闭区间 [left, right]
    return prefix[right + 1] - prefix[left]
```

额外的开头 0 可以统一边界，不必特判 left == 0。

### 二维前缀和

```python
prefix = [[0] * (cols + 1) for _ in range(rows + 1)]

for row in range(rows):
    for col in range(cols):
        prefix[row + 1][col + 1] = (
            matrix[row][col]
            + prefix[row][col + 1]
            + prefix[row + 1][col]
            - prefix[row][col]
        )

def rectangle_sum(top, left, bottom, right):
    return (
        prefix[bottom + 1][right + 1]
        - prefix[top][right + 1]
        - prefix[bottom + 1][left]
        + prefix[top][left]
    )
```

## 差分数组

要给区间 `[left, right]` 每个元素增加 delta：

```python
difference = [0] * (len(nums) + 1)

def add_range(left, right, delta):
    difference[left] += delta
    difference[right + 1] -= delta

add_range(1, 3, 5)

current = 0
result = []
for index, value in enumerate(nums):
    current += difference[index]
    result.append(value + current)
```

差分把一次区间修改变成两个端点修改。它适合“全部修改完成后统一还原”，不适合修改中间频繁查询。

## 树状数组（Fenwick Tree）

树状数组维护前缀聚合。下标通常从 1 开始，核心是：

```python
lowbit = index & -index
```

它表示当前节点负责的区间长度。

### 完整实现

```python
class FenwickTree:
    def __init__(self, size):
        self.size = size
        self.tree = [0] * (size + 1)

    def add(self, index, delta):
        # 外部使用 0-based，内部转为 1-based
        index += 1
        while index <= self.size:
            self.tree[index] += delta
            index += index & -index

    def prefix_sum(self, right):
        # nums[0:right+1] 的和
        right += 1
        total = 0
        while right > 0:
            total += self.tree[right]
            right -= right & -right
        return total

    def range_sum(self, left, right):
        if left == 0:
            return self.prefix_sum(right)
        return self.prefix_sum(right) - self.prefix_sum(left - 1)
```

从数组构建：

```python
fenwick = FenwickTree(len(nums))
for index, value in enumerate(nums):
    fenwick.add(index, value)
```

常见应用包括动态区间和、逆序对、离散化后的频率统计。

## 线段树

线段树把区间不断二分。每个节点保存一段区间的信息，父节点由左右子节点合并。

下面实现单点修改 + 区间和：

```python
class SegmentTree:
    def __init__(self, nums):
        self.length = len(nums)
        self.tree = [0] * (4 * max(1, self.length))
        if nums:
            self._build(nums, 1, 0, self.length - 1)

    def _build(self, nums, node, left, right):
        if left == right:
            self.tree[node] = nums[left]
            return

        middle = (left + right) // 2
        self._build(nums, node * 2, left, middle)
        self._build(nums, node * 2 + 1, middle + 1, right)
        self.tree[node] = self.tree[node * 2] + self.tree[node * 2 + 1]

    def update(self, index, value):
        self._update(1, 0, self.length - 1, index, value)

    def _update(self, node, left, right, index, value):
        if left == right:
            self.tree[node] = value
            return

        middle = (left + right) // 2
        if index <= middle:
            self._update(node * 2, left, middle, index, value)
        else:
            self._update(node * 2 + 1, middle + 1, right, index, value)

        self.tree[node] = self.tree[node * 2] + self.tree[node * 2 + 1]

    def query(self, query_left, query_right):
        return self._query(1, 0, self.length - 1, query_left, query_right)

    def _query(self, node, left, right, query_left, query_right):
        if query_left <= left and right <= query_right:
            return self.tree[node]

        middle = (left + right) // 2
        total = 0
        if query_left <= middle:
            total += self._query(node * 2, left, middle, query_left, query_right)
        if query_right > middle:
            total += self._query(node * 2 + 1, middle + 1, right, query_left, query_right)
        return total
```

把“加法”换成 `min` 或 `max`，就可以维护区间最值。区间修改还需要懒标记，属于进一步内容。

## 位集合与位掩码

当状态只有“出现/未出现”且范围较小时，一个整数可以表示集合：

```python
mask = 0
value = 3

mask |= 1 << value              # 加入
exists = bool(mask & (1 << value))
mask &= ~(1 << value)           # 删除
mask ^= 1 << value              # 翻转
```

枚举 n 个元素的所有子集：

```python
for mask in range(1 << n):
    subset = []
    for index in range(n):
        if mask & (1 << index):
            subset.append(nums[index])
```

时间复杂度仍是 O(n * 2^n)，位运算只是更紧凑地表示状态。

## 什么时候不要使用进阶结构

- 数组完全不修改：用前缀和。
- 只有一次查询：直接遍历。
- 只要区间最大值且窗口固定移动：单调队列可能更简单。
- 节点数量很小：朴素方案更清楚。

数据结构不是越复杂越好。先根据操作次数和数据规模算出朴素复杂度，再决定是否升级。

## 常见错误

- 树状数组混用 0-based 和 1-based。
- 区间端点有时闭有时开。
- 线段树数组开得过小。
- 查询无交集时返回了错误的单位元。
- 为静态问题上复杂结构，增加 bug 风险。

---

[← 返回数据结构](../index.html) | [上一篇：并查集](../09-union-find/index.html) | [下一篇：ACM 构造数据结构 →](../11-acm-construction/index.html)
