---
layout: default
title: 核心算法
---

# 第三阶段：核心算法

> 🎯 目标：掌握面试常考的8大算法思想
> ⏱️ 预计时间：3-4 周

## 学习模块

### 01. 排序算法

| 算法 | 时间复杂度 | 空间复杂度 | 稳定性 |
|------|-----------|-----------|--------|
| 快速排序 | O(nlogn) | O(logn) | 不稳定 |
| 归并排序 | O(nlogn) | O(n) | 稳定 |
| 堆排序 | O(nlogn) | O(1) | 不稳定 |

---

### 02. 二分查找

**核心思想：** 有序数组中排除一半

```python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

---

### 03. 双指针

**两种模式：**
1. **对撞指针**：左右向中间移动
2. **快慢指针**：同向不同速

```python
def two_pointers(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        if condition:
            left += 1
        else:
            right -= 1
```

---

### 04. 滑动窗口

**通用模板：**
```python
def sliding_window(s):
    window = {}
    left = 0
    result = 0
    
    for right in range(len(s)):
        # 1. 扩大窗口
        c = s[right]
        window[c] = window.get(c, 0) + 1
        
        # 2. 收缩窗口
        while need_shrink:
            d = s[left]
            window[d] -= 1
            left += 1
        
        # 3. 更新结果
        result = max(result, right - left + 1)
    
    return result
```

---

### 05. 递归与回溯

**回溯模板：**
```python
def backtrack(path, choices):
    if 满足结束条件:
        result.append(path[:])
        return
    
    for choice in choices:
        path.append(choice)      # 做选择
        backtrack(path, new_choices)  # 递归
        path.pop()               # 撤销选择
```

---

### 06. DFS / BFS

**DFS 模板：**
```python
def dfs(node, visited):
    if node in visited:
        return
    visited.add(node)
    for neighbor in graph[node]:
        dfs(neighbor, visited)
```

**BFS 模板：**
```python
from collections import deque

def bfs(start):
    queue = deque([start])
    visited = {start}
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

---

### 07. 动态规划

**解题五步法：**
1. 确定 dp 数组含义
2. 确定递推公式
3. dp 数组初始化
4. 确定遍历顺序
5. 举例推导验证

---

### 08. 贪心算法

**核心思想：** 每步选局部最优，期望达到全局最优

---

## 学习建议

1. **先学思想**：理解算法核心思路比背代码重要
2. **多画图**：DFS、DP 题目必须画决策树/状态表
3. **归纳模板**：每类算法总结自己的解题模板
4. **重复练习**：同类题目做 5+ 道形成肌肉记忆

---

[← 上一章：数据结构](/01_data_structures/) | [下一章：LeetCode 实战 →](/03_leetcode_practice/)
