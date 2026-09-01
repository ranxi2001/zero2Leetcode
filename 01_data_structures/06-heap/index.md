---
layout: default
title: 堆
description: heapq 实现最小堆与最大堆
eyebrow: 数据结构 / 06
---

# 堆

## 什么是堆

堆（Heap）是一种特殊的**完全二叉树**，满足两个性质：

1. **结构性质**：除最后一层外每层都填满，最后一层从左到右连续填充。
2. **堆序性质**：每个节点的值满足与其子节点之间的大小关系。

- **最小堆（Min-Heap）**：父节点 ≤ 子节点，堆顶是最小元素。
- **最大堆（Max-Heap）**：父节点 ≥ 子节点，堆顶是最大元素。

完全二叉树可用数组紧凑存储：父节点 `(i-1)//2`，左子 `2*i+1`，右子 `2*i+2`。

### 核心操作与时间复杂度

| 操作 | 时间复杂度 | 说明 |
|------|-----------|------|
| 查看堆顶 | O(1) | 直接访问数组第一个元素 |
| 插入元素 | O(log n) | 添加到末尾，上浮调整 |
| 删除堆顶 | O(log n) | 堆顶与末尾交换，下沉调整 |
| 建堆 | O(n) | 自底向上调整，比逐个插入更快 |
| 获取前 K 个元素 | O(n log k) | 维护大小为 K 的堆 |

---

## Python heapq 模块

Python 标准库 `heapq` 提供了**最小堆**的实现，直接操作普通列表。

### 基本操作

```python
import heapq

heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
heapq.heappush(heap, 3)
print(heap)             # [1, 5, 3]
print(heapq.heappop(heap))  # 1（弹出最小值）
print(heap[0])          # 3（查看堆顶）

nums = [4, 1, 7, 3, 8, 5]
heapq.heapify(nums)     # 原地建堆 O(n)
print(heapq.nsmallest(3, nums))  # [1, 3, 4]
print(heapq.nlargest(3, nums))   # [8, 7, 5]
```

> **提示**：`nsmallest`/`nlargest` 在 K 很小时效率高；K 接近 n 时直接排序更快。

### 实现最大堆

`heapq` 只支持最小堆。实现最大堆的经典技巧是**对值取反**：

```python
import heapq

max_heap = []
for val in [3, 1, 4, 1, 5, 9]:
    heapq.heappush(max_heap, -val)

print(-heapq.heappop(max_heap))  # 9（弹出最大值）
print(-max_heap[0])              # 5（查看当前最大值）
```

### 自定义排序

用**元组 `(priority, data)`** 实现优先级队列。`heapq` 会按元组的第一个元素排序：

```python
import heapq

tasks = []
heapq.heappush(tasks, (2, "写代码"))
heapq.heappush(tasks, (1, "修 Bug"))
heapq.heappush(tasks, (3, "开会"))

while tasks:
    priority, task = heapq.heappop(tasks)
    print(f"优先级 {priority}: {task}")  # 修Bug -> 写代码 -> 开会
```

> **注意**：优先级相同时 Python 会比较下一个元素。若元素不可比较，加递增计数器：`(priority, counter, data)`。

---

## 高频题型

### Top K 问题

Top K 是堆最经典的应用场景。核心思路：**维护一个大小为 K 的堆**。

#### LC 347 前 K 个高频元素

```python
from collections import Counter
import heapq

def topKFrequent(nums, k):
    count = Counter(nums)
    # 简洁写法
    return heapq.nlargest(k, count.keys(), key=count.get)

# 手动维护堆（面试更常考）
def topKFrequent_heap(nums, k):
    count = Counter(nums)
    heap = []
    for num, freq in count.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)
    return [num for freq, num in heap]
```

#### LC 215 数组中的第 K 个最大元素

**思路**：维护一个大小为 K 的**最小堆**，遍历完成后堆顶就是第 K 大元素。

```python
def findKthLargest(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]
```

### 合并 K 个有序链表

#### LC 23 合并 K 个升序链表

**思路**：将每个链表头放入最小堆，每次弹出最小值，再将其 next 入堆。时间 O(N log K)。

```python
def mergeKLists(lists):
    heap = [(node.val, i, node) for i, node in enumerate(lists) if node]
    heapq.heapify(heap)
    dummy = curr = ListNode(0)
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    return dummy.next
```

> 元组中 `i` 用于打破值相同时的比较，避免 `ListNode` 之间无法比较。

### 数据流中位数

#### LC 295 数据流的中位数

**思路**：用两个堆维护数据流的左右两半：

- **大顶堆** `max_heap`：存较小的一半（取反模拟）
- **小顶堆** `min_heap`：存较大的一半

始终保持 `len(max_heap) == len(min_heap)` 或 `len(max_heap) == len(min_heap) + 1`。

```python
class MedianFinder:
    def __init__(self):
        self.small = []  # 大顶堆（取反）
        self.large = []  # 小顶堆

    def addNum(self, num):
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
```

### 滑动窗口最大值

#### LC 239 滑动窗口最大值

**思路**：用最大堆存储 `(-nums[i], i)`，每次取堆顶时检查索引是否在窗口内，不在则弹出。时间复杂度 O(n log n)。

```python
def maxSlidingWindow(nums, k):
    heap = []
    result = []
    for i in range(len(nums)):
        heapq.heappush(heap, (-nums[i], i))
        if i >= k - 1:
            while heap[0][1] <= i - k:
                heapq.heappop(heap)
            result.append(-heap[0][0])
    return result
```

> **补充**：此题最优解是单调队列 O(n)，但堆解法更通用，面试中两种都应掌握。

---

## 经典题目

### Medium

| 题号 | 题目 | 关键思路 |
|------|------|---------|
| [215](https://leetcode.com/problems/kth-largest-element-in-an-array/) | 数组中的第 K 个最大元素 | 大小为 K 的最小堆 |
| [347](https://leetcode.com/problems/top-k-frequent-elements/) | 前 K 个高频元素 | 频率统计 + 堆 |
| [692](https://leetcode.com/problems/top-k-frequent-words/) | 前 K 个高频单词 | 自定义排序的堆 |
| [378](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | 有序矩阵中第 K 小的元素 | 多路归并 + 堆 |

### Hard

| 题号 | 题目 | 关键思路 |
|------|------|---------|
| [23](https://leetcode.com/problems/merge-k-sorted-lists/) | 合并 K 个升序链表 | 堆维护 K 个链表头 |
| [295](https://leetcode.com/problems/find-median-from-data-stream/) | 数据流的中位数 | 对顶堆（大顶堆 + 小顶堆） |
| [239](https://leetcode.com/problems/sliding-window-maximum/) | 滑动窗口最大值 | 最大堆 / 单调队列 |
| [632](https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/) | 最小区间 | 堆 + 滑动窗口 |

---

## 学习建议

1. **堆是面试高频数据结构**：几乎所有涉及"第 K 大/小"、"前 K 个"、"合并多路有序序列"的题目都可以用堆解决。
2. **熟练掌握 `heapq` API**：`heappush`、`heappop`、`heapify`、`nlargest`、`nsmallest` 是基础工具。
3. **Top K 是必考题型**：LC 215 和 LC 347 建议多写几遍，做到闭眼能写。
4. **理解取反技巧**：Python 没有内置最大堆，取反是万能方案。
5. **对顶堆是进阶技巧**：LC 295 的大顶堆 + 小顶堆模式在很多变体题中都会用到。

---

## 小结

堆的本质是一棵用数组存储的完全二叉树，核心价值在于**高效获取极值**。在 Python 中，`heapq` 模块提供了简洁的最小堆操作，配合取反技巧和元组排序即可应对绝大多数面试场景。掌握 Top K、多路归并、对顶堆三种模式，堆相关的题目就不再是难点。

---

[← 返回数据结构](../index.html) | [上一篇：树与二叉树](../05-binary-tree/index.html) | [下一篇：图 →](../07-graph/index.html)
