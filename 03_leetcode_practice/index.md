---
layout: default
title: LeetCode 实战
---

# 第四阶段：LeetCode 实战

> 🎯 目标：通过 Hot 100 高频题，达到 Medium 难度稳定通过  
> ⏱️ 预计时间：2-3 周

---

## 📌 练习原则

1. **先自己做**：每题先独立思考 15-30 分钟
2. **限时训练**：Easy 15分钟，Medium 30分钟，Hard 45分钟
3. **理解思路**：看题解时理解思路，不要死记代码
4. **重复练习**：做错的题 3 天后重做
5. **归纳总结**：每做完一类题，总结解题模板

---

## 🔥 经典题解

### 1. 两数之和 (Easy) - 哈希表

> 📝 题目：给定数组和目标值，找出和为目标值的两个数的索引

**思路**：遍历时用哈希表存储已遍历的 `{值: 索引}`，查找 `target - num` 是否存在

```python
from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        """
        哈希表解法
        时间: O(n) - 只遍历一次
        空间: O(n) - 哈希表存储
        """
        hashmap = {}  # 存储 {数值: 索引}
        
        for i, num in enumerate(nums):
            complement = target - num
            
            # 如果 complement 已在哈希表中，找到答案
            if complement in hashmap:
                return [hashmap[complement], i]
            
            # 否则将当前数存入哈希表
            hashmap[num] = i
        
        return []

# 测试
sol = Solution()
print(sol.twoSum([2, 7, 11, 15], 9))  # [0, 1]
print(sol.twoSum([3, 2, 4], 6))       # [1, 2]
```

[→ 去 LeetCode 练习](https://leetcode.cn/problems/two-sum/)

---

### 206. 反转链表 (Easy) - 链表

> 📝 题目：反转单链表

**思路**：三指针迭代法 `prev, curr, next`

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def reverseList(self, head: ListNode) -> ListNode:
        """
        迭代法
        时间: O(n)
        空间: O(1)
        
        图解：
        原始: 1 -> 2 -> 3 -> None
        步骤1: None <- 1    2 -> 3 -> None
        步骤2: None <- 1 <- 2    3 -> None
        步骤3: None <- 1 <- 2 <- 3
        """
        prev = None
        curr = head
        
        while curr:
            next_temp = curr.next  # 保存下一个节点
            curr.next = prev       # 反转指针
            prev = curr            # prev 前进
            curr = next_temp       # curr 前进
        
        return prev
```

[→ 去 LeetCode 练习](https://leetcode.cn/problems/reverse-linked-list/)

---

### 70. 爬楼梯 (Easy) - 动态规划

> 📝 题目：每次爬 1 或 2 阶，问爬到第 n 阶有多少种方法

**思路**：经典斐波那契 `dp[n] = dp[n-1] + dp[n-2]`

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        """
        空间优化的动态规划
        时间: O(n)
        空间: O(1)
        """
        if n <= 2:
            return n
        
        prev2 = 1  # dp[i-2]
        prev1 = 2  # dp[i-1]
        
        for i in range(3, n + 1):
            curr = prev1 + prev2
            prev2 = prev1
            prev1 = curr
        
        return prev1

# 测试
sol = Solution()
print(sol.climbStairs(5))   # 8
print(sol.climbStairs(10))  # 89
```

[→ 去 LeetCode 练习](https://leetcode.cn/problems/climbing-stairs/)

---

## 🔗 在线练习

| 平台 | 链接 |
|------|------|
| LeetCode 力扣 | [leetcode.cn](https://leetcode.cn/) |
| Hot 100 官方题单 | [查看题单](https://leetcode.cn/studyplan/top-100-liked/) |
| 面试经典 150 题 | [查看题单](https://leetcode.cn/studyplan/top-interview-150/) |

---

## 📊 刷题进度表

| 分类 | 题数 | 重要程度 |
|------|------|----------|
| 哈希表 | 5 | ⭐⭐⭐⭐⭐ |
| 双指针 | 4 | ⭐⭐⭐⭐ |
| 滑动窗口 | 4 | ⭐⭐⭐⭐ |
| 栈 | 6 | ⭐⭐⭐⭐ |
| 链表 | 14 | ⭐⭐⭐⭐ |
| 二叉树 | 15 | ⭐⭐⭐⭐⭐ |
| 回溯 | 8 | ⭐⭐⭐⭐ |
| 二分查找 | 6 | ⭐⭐⭐⭐ |
| 动态规划 | 15 | ⭐⭐⭐⭐⭐ |
| 贪心 | 4 | ⭐⭐⭐ |

---

[← 上一章：核心算法](/02_algorithms/) | [返回首页](/)
