# 第三阶段：核心算法

> 🎯 目标：掌握面试常考的8大算法思想
> ⏱️ 预计时间：3-4 周

## 学习模块

---

### 01. 排序算法 `./01_sorting/`

**必须掌握：**
| 算法 | 时间复杂度 | 空间复杂度 | 稳定性 |
|------|-----------|-----------|--------|
| 快速排序 | O(nlogn) | O(logn) | 不稳定 |
| 归并排序 | O(nlogn) | O(n) | 稳定 |
| 堆排序 | O(nlogn) | O(1) | 不稳定 |

**快速排序模板：**
```python
def quick_sort(arr, left, right):
    if left >= right:
        return
    pivot = partition(arr, left, right)
    quick_sort(arr, left, pivot - 1)
    quick_sort(arr, pivot + 1, right)

def partition(arr, left, right):
    pivot = arr[right]
    i = left
    for j in range(left, right):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[right] = arr[right], arr[i]
    return i
```

---

### 02. 二分查找 `./02_binary_search/`

**核心思想：** 有序数组中排除一半

**标准模板：**
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

**查找左边界：**
```python
def search_left(nums, target):
    left, right = 0, len(nums)
    while left < right:
        mid = left + (right - left) // 2
        if nums[mid] >= target:
            right = mid
        else:
            left = mid + 1
    return left
```

**LeetCode 高频题：**
- [35. 搜索插入位置](https://leetcode.cn/problems/search-insert-position/)
- [34. 查找元素的第一个和最后一个位置](https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/)
- [33. 搜索旋转排序数组](https://leetcode.cn/problems/search-in-rotated-sorted-array/)

---

### 03. 双指针 `./03_two_pointers/`

**两种模式：**
1. **对撞指针**：左右向中间移动
2. **快慢指针**：同向不同速

**对撞指针模板：**
```python
def two_pointers(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        if condition:
            left += 1
        else:
            right -= 1
```

**LeetCode 高频题：**
- [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)
- [15. 三数之和](https://leetcode.cn/problems/3sum/)
- [42. 接雨水](https://leetcode.cn/problems/trapping-rain-water/)

---

### 04. 滑动窗口 `./04_sliding_window/`

**核心思想：** 维护动态区间

**通用模板：**
```python
def sliding_window(s):
    window = {}  # 窗口内容
    left = 0
    result = 0
    
    for right in range(len(s)):
        # 1. 扩大窗口
        c = s[right]
        window[c] = window.get(c, 0) + 1
        
        # 2. 收缩窗口（满足收缩条件时）
        while need_shrink:
            d = s[left]
            window[d] -= 1
            left += 1
        
        # 3. 更新结果
        result = max(result, right - left + 1)
    
    return result
```

**LeetCode 高频题：**
- [3. 无重复字符的最长子串](https://leetcode.cn/problems/longest-substring-without-repeating-characters/)
- [76. 最小覆盖子串](https://leetcode.cn/problems/minimum-window-substring/)
- [438. 找到所有字母异位词](https://leetcode.cn/problems/find-all-anagrams-in-a-string/)

---

### 05. 递归与回溯 `./05_recursion/`

**回溯三要素：**
1. 路径：已做的选择
2. 选择列表：当前可选项
3. 结束条件：到达决策树底部

**回溯模板：**
```python
def backtrack(path, choices):
    if 满足结束条件:
        result.append(path[:])
        return
    
    for choice in choices:
        # 做选择
        path.append(choice)
        # 递归
        backtrack(path, new_choices)
        # 撤销选择
        path.pop()
```

**LeetCode 高频题：**
- [46. 全排列](https://leetcode.cn/problems/permutations/)
- [78. 子集](https://leetcode.cn/problems/subsets/)
- [39. 组合总和](https://leetcode.cn/problems/combination-sum/)
- [51. N 皇后](https://leetcode.cn/problems/n-queens/)

---

### 06. DFS / BFS `./06_dfs_bfs/`

**DFS（深度优先）模板：**
```python
def dfs(node, visited):
    if node in visited:
        return
    visited.add(node)
    
    for neighbor in graph[node]:
        dfs(neighbor, visited)
```

**BFS（广度优先）模板：**
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

**LeetCode 高频题：**
- [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)
- [994. 腐烂的橘子](https://leetcode.cn/problems/rotting-oranges/)
- [102. 二叉树层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

---

### 07. 动态规划 `./07_dynamic_programming/`

**解题五步法：**
1. 确定 dp 数组含义
2. 确定递推公式
3. dp 数组初始化
4. 确定遍历顺序
5. 举例推导验证

**经典问题分类：**
- 线性 DP：爬楼梯、打家劫舍
- 背包问题：01背包、完全背包
- 区间 DP：最长回文子串
- 二维 DP：不同路径、编辑距离

**LeetCode 高频题：**
- [70. 爬楼梯](https://leetcode.cn/problems/climbing-stairs/)
- [198. 打家劫舍](https://leetcode.cn/problems/house-robber/)
- [322. 零钱兑换](https://leetcode.cn/problems/coin-change/)
- [300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)
- [72. 编辑距离](https://leetcode.cn/problems/edit-distance/)

---

### 08. 贪心算法 `./08_greedy/`

**核心思想：** 每步选局部最优，期望达到全局最优

**适用条件：**
- 贪心选择性质
- 最优子结构

**LeetCode 高频题：**
- [121. 买卖股票最佳时机](https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/)
- [55. 跳跃游戏](https://leetcode.cn/problems/jump-game/)
- [45. 跳跃游戏 II](https://leetcode.cn/problems/jump-game-ii/)

---

## 学习建议

1. **先学思想**：理解算法核心思路比背代码重要
2. **多画图**：DFS、DP 题目必须画决策树/状态表
3. **归纳模板**：每类算法总结自己的解题模板
4. **重复练习**：同类题目做 5+ 道形成肌肉记忆
