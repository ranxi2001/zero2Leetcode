"""
LeetCode 70. 爬楼梯 (Climbing Stairs)

难度: Easy
分类: 动态规划
链接: https://leetcode.cn/problems/climbing-stairs/

题目描述:
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

思路:
这是经典的斐波那契数列问题！
到达第 n 阶的方法 = 从第 n-1 阶爬 1 步 + 从第 n-2 阶爬 2 步
即 dp[n] = dp[n-1] + dp[n-2]

复杂度:
- 时间: O(n)
- 空间: O(1) 优化后 / O(n) 原始
"""


class Solution:
    def climbStairs_dp_array(self, n: int) -> int:
        """
        方法1: 动态规划（数组）
        
        dp[i] 表示到达第 i 阶的方法数
        """
        if n <= 2:
            return n
        
        dp = [0] * (n + 1)
        dp[1] = 1  # 到第1阶只有1种方法
        dp[2] = 2  # 到第2阶有2种方法: 1+1 或 2
        
        for i in range(3, n + 1):
            dp[i] = dp[i-1] + dp[i-2]
        
        return dp[n]
    
    def climbStairs_optimized(self, n: int) -> int:
        """
        方法2: 空间优化（推荐）
        
        只需要存储前两个状态
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
    
    def climbStairs_recursive_memo(self, n: int) -> int:
        """
        方法3: 递归 + 记忆化
        
        用于理解递归思路，但不推荐面试使用
        """
        memo = {}
        
        def dp(i):
            if i <= 2:
                return i
            if i in memo:
                return memo[i]
            memo[i] = dp(i-1) + dp(i-2)
            return memo[i]
        
        return dp(n)


# ===== 测试 =====
if __name__ == "__main__":
    sol = Solution()
    
    test_cases = [1, 2, 3, 4, 5, 10]
    
    print("爬楼梯方法数:")
    print("-" * 30)
    for n in test_cases:
        result = sol.climbStairs_optimized(n)
        print(f"n = {n}: {result} 种方法")
    
    # 验证三种方法结果一致
    print("\n验证三种方法结果一致:")
    for n in [5, 10, 20]:
        r1 = sol.climbStairs_dp_array(n)
        r2 = sol.climbStairs_optimized(n)
        r3 = sol.climbStairs_recursive_memo(n)
        print(f"n={n}: 数组={r1}, 优化={r2}, 递归={r3}, 一致={r1==r2==r3}")
