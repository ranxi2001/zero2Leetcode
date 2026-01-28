"""
LeetCode 1. 两数之和 (Two Sum)

难度: Easy
分类: 哈希表
链接: https://leetcode.cn/problems/two-sum/

题目描述:
给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出
和为目标值 target 的那两个整数，并返回它们的数组下标。

思路:
1. 暴力法: 双重循环，O(n²)
2. 哈希表法: 遍历时存储 {值: 索引}，查找 complement = target - num

复杂度:
- 时间: O(n) - 只遍历一次
- 空间: O(n) - 哈希表存储
"""

from typing import List


class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        """
        哈希表解法
        """
        hashmap = {}  # 存储 {数值: 索引}
        
        for i, num in enumerate(nums):
            complement = target - num
            
            # 如果 complement 已在哈希表中，找到答案
            if complement in hashmap:
                return [hashmap[complement], i]
            
            # 否则将当前数存入哈希表
            hashmap[num] = i
        
        return []  # 题目保证有解，这行不会执行


# ===== 测试 =====
if __name__ == "__main__":
    sol = Solution()
    
    # 测试用例 1
    nums1 = [2, 7, 11, 15]
    target1 = 9
    print(f"输入: {nums1}, target={target1}")
    print(f"输出: {sol.twoSum(nums1, target1)}")  # [0, 1]
    
    # 测试用例 2
    nums2 = [3, 2, 4]
    target2 = 6
    print(f"输入: {nums2}, target={target2}")
    print(f"输出: {sol.twoSum(nums2, target2)}")  # [1, 2]
    
    # 测试用例 3
    nums3 = [3, 3]
    target3 = 6
    print(f"输入: {nums3}, target={target3}")
    print(f"输出: {sol.twoSum(nums3, target3)}")  # [0, 1]
