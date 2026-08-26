# 动态规划

本文件维护第一章第三类题目的题解与面试追问。所有题解都要明确状态定义、转移来源、初始化、遍历顺序和答案位置。

## 字节核心题单

| 顺序 | 题目 | 字节频次 | 数据版本 | 其他统计覆盖 |
|------|------|----------|----------|--------------|
| 1 | LC 5 最长回文子串 | 46 | 08 更新 | 3/4 |
| 2 | LC 300 最长递增子序列 | 43 | 08 更新 | 3/4 |
| 3 | LC 72 编辑距离 | 34 | 08 更新 | 3/4 |
| 4 | LC 1143 最长公共子序列 | 23 | 08 更新 | 1/4 |
| 5 | LC 53 最大子数组和 | 30 | 04 基线 | 3/4 |
| 6 | LC 121 买卖股票的最佳时机 | 23 | 04 基线 | 3/4 |
| 7 | LC 322 零钱兑换 | 14 | 04 基线 | 2/4 |
| 8 | LC 122 买卖股票的最佳时机 II | 12 | 04 基线 | 0/4 |
| 9 | LC 198 打家劫舍 | 8 | 04 基线 | 0/4 |
| 10 | LC 70 爬楼梯 | 7 | 04 基线 | 3/4 |

## 其他来源新增题

| 题目 | 发现来源 |
|------|----------|
| LC 32 最长有效括号 | 美团、Hot 100 综合榜 |
| LC 64 最小路径和 | 华为、Hot 100 综合榜 |
| LC 118 杨辉三角 | Hot 100 综合榜 |
| LC 120 三角形最小路径和 | 美团 |
| LC 279 完全平方数 | Hot 100 综合榜 |
| LC 416 分割等和子集 | Hot 100 综合榜 |
| LC 647 回文子串 | 美团 |
| LC 718 最长重复子数组 | 美团、腾讯 |
| LC 918 环形子数组的最大和 | 腾讯 |
| LC 1262 可被三整除的最大和 | 腾讯 |

## 题解与追问重点

- 先给二维或完整状态，再讨论滚动数组、状态压缩和原地更新。
- LC 300 必须比较 $O(n^2)$ 动态规划与 $O(n\log n)$ 贪心加二分。
- 回文题比较动态规划与中心扩展，明确子串、子数组和子序列的区别。
- 股票题不仅给公式，还要解释状态机含义及交易次数变化时如何扩展。
- 背包题重点说明物品与容量的遍历顺序，避免把 0-1 背包写成完全背包。

## LC 5 最长回文子串

**考频与考点**：字节高频题。考查区间动态规划、中心扩展，以及“子串必须连续”这一约束。

**写代码前确认**：输入非空；长度相同的最优答案返回任意一个即可。先确认面试官更关注 DP 模型，还是更短的中心扩展实现。

**状态与思路**：令 `dp[i][j]` 表示闭区间 `s[i:j+1]` 是否为回文。转移为 `s[i] == s[j] and (j - i <= 1 or dp[i+1][j-1])`。单字符初始化为真；`i` 必须从右向左遍历，`j` 从 `i` 向右遍历，保证内部状态已计算。答案不在固定单元格，而是在遍历中维护最长区间。中心扩展使用相同的回文结构，空间降为常数，是面试编码首选。

```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        n = len(s)
        dp = [[False] * n for _ in range(n)]
        start = 0
        best_len = 1

        for i in range(n - 1, -1, -1):
            for j in range(i, n):
                dp[i][j] = s[i] == s[j] and (j - i <= 1 or dp[i + 1][j - 1])
                if dp[i][j] and j - i + 1 > best_len:
                    start, best_len = i, j - i + 1
        return s[start:start + best_len]
```

```python
from typing import Tuple

class SolutionCenter:
    def longestPalindrome(self, s: str) -> str:
        left = right = 0

        def expand(i: int, j: int) -> Tuple[int, int]:
            while i >= 0 and j < len(s) and s[i] == s[j]:
                i -= 1
                j += 1
            return i + 1, j - 1

        for center in range(len(s)):
            for i, j in (expand(center, center), expand(center, center + 1)):
                if j - i > right - left:
                    left, right = i, j
        return s[left:right + 1]
```

**复杂度**：两种解法时间均为 `O(n^2)`；DP 空间 `O(n^2)`，中心扩展空间 `O(1)`。

**边界与易错点**：偶数长度回文需要以两个字符为中心；DP 的遍历方向不能让 `dp[i+1][j-1]` 尚未计算。

**面试追问**：若求最长回文子序列，状态仍是区间 DP，但字符不等时可舍弃任一端；若要求线性时间，可进一步讨论 Manacher 算法。

## LC 300 最长递增子序列

**考频与考点**：字节高频题。必须掌握 `O(n^2)` DP，以及 `O(n log n)` 的贪心加二分优化。

**写代码前确认**：题目要求严格递增，因此二分找第一个“大于等于”当前位置的元素；子序列不要求连续。

**状态与思路**：DP 定义 `dp[i]` 为以 `nums[i]` 结尾的最长递增子序列长度；若 `j < i` 且 `nums[j] < nums[i]`，转移为 `dp[i] = max(dp[i], dp[j] + 1)`。所有位置初始化为 1，按 `i` 从左向右、`j` 在其左侧遍历，答案为 `max(dp)`。优化解法维护 `tails[k]`：长度为 `k+1` 的递增子序列可取得的最小末尾值；它不是实际答案序列，但越小越利于接入后续元素。

```python
from typing import List

class SolutionDP:
    def lengthOfLIS(self, nums: List[int]) -> int:
        dp = [1] * len(nums)
        for i in range(len(nums)):
            for j in range(i):
                if nums[j] < nums[i]:
                    dp[i] = max(dp[i], dp[j] + 1)
        return max(dp)
```

```python
from typing import List

from bisect import bisect_left

class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails: List[int] = []
        for value in nums:
            index = bisect_left(tails, value)
            if index == len(tails):
                tails.append(value)
            else:
                tails[index] = value
        return len(tails)
```

**复杂度**：DP 时间 `O(n^2)`、空间 `O(n)`；贪心加二分时间 `O(n log n)`、空间 `O(n)`。

**边界与易错点**：严格递增用 `bisect_left`；若允许相等则用 `bisect_right`。不要把 `tails` 直接当作原数组中的一条 LIS。

**面试追问**：如何恢复一条实际 LIS？为每个位置记录前驱与其在 `tails` 中的层级，再从最后一层回溯。

## LC 72 编辑距离

**考频与考点**：字节高频二维 DP。考查两个字符串前缀之间的最优编辑代价。

**写代码前确认**：一次操作可以插入、删除或替换一个字符，每种代价均为 1。

**状态与思路**：`dp[i][j]` 表示 `word1[:i]` 转成 `word2[:j]` 的最少操作数。末字符相等时继承 `dp[i-1][j-1]`；否则取删除 `dp[i-1][j]`、插入 `dp[i][j-1]`、替换 `dp[i-1][j-1]` 的最小值再加 1。初始化 `dp[i][0] = i`、`dp[0][j] = j`；按前缀长度递增遍历；答案在 `dp[m][n]`。

```python
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j

        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                else:
                    dp[i][j] = 1 + min(
                        dp[i - 1][j],
                        dp[i][j - 1],
                        dp[i - 1][j - 1],
                    )
        return dp[m][n]
```

**复杂度**：时间 `O(mn)`，空间 `O(mn)`；只保留上一行可压缩到 `O(n)`。

**边界与易错点**：数组下标表示前缀长度，字符下标要减 1；“从 word1 插入字符”等价于目标前缀缩短一位，对应左侧状态。

**面试追问**：操作代价不同时如何修改？把三个候选分别加各自代价；如何输出操作序列？从 `dp[m][n]` 反向追踪转移来源。

## LC 1143 最长公共子序列

**考频与考点**：考查双序列 DP，是编辑距离、最长重复子数组等模型的基础。

**写代码前确认**：求子序列而非连续子串；相对顺序必须保留。

**状态与思路**：`dp[i][j]` 表示 `text1[:i]` 与 `text2[:j]` 的 LCS 长度。末字符相等时由 `dp[i-1][j-1] + 1` 转移；否则舍弃任一末字符，取 `max(dp[i-1][j], dp[i][j-1])`。空前缀所在行列初始化为 0；两个维度均递增；答案为 `dp[m][n]`。

```python
class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        m, n = len(text1), len(text2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if text1[i - 1] == text2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                else:
                    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
        return dp[m][n]
```

**复杂度**：时间 `O(mn)`，空间 `O(mn)`；滚动数组可降至 `O(min(m,n))`。

**边界与易错点**：字符相等时不能写成同一行或同一列加 1；这会重复使用字符。

**面试追问**：最长公共子串为何不同？其状态表示“以两个位置结尾的公共连续段”，字符不等时必须归零。

## LC 53 最大子数组和

**考频与考点**：字节高频题。考查 Kadane 算法和连续子数组状态设计。

**写代码前确认**：子数组不能为空；全为负数时应返回最大的负数。

**状态与思路**：`dp[i]` 表示必须以 `nums[i]` 结尾的最大子数组和，转移为 `max(nums[i], dp[i-1] + nums[i])`。`dp[0] = nums[0]`，从左向右遍历，答案是所有 `dp[i]` 的最大值而非最后一个状态。由于只依赖前一项，可压缩为变量 `ending`。

```python
from typing import List

class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        ending = answer = nums[0]
        for value in nums[1:]:
            ending = max(value, ending + value)
            answer = max(answer, ending)
        return answer
```

**复杂度**：时间 `O(n)`，空间 `O(1)`。

**边界与易错点**：不能将初值设为 0，否则全负数组会错误地选择空数组。

**面试追问**：如何返回区间？当 `ending` 从当前值重新开始时更新候选左端点，在全局答案变大时记录左右端点。

## LC 121 买卖股票的最佳时机

**考频与考点**：单次交易模型，考查状态机 DP 与前缀最小值。

**写代码前确认**：只能买卖各一次，且必须先买后卖；允许不交易，此时利润为 0。

**状态与思路**：第 `i` 天结束后，`cash` 表示未持股最大利润，`hold` 表示持股最大利润。转移为 `cash = max(cash, hold + price)`、`hold = max(hold, -price)`，后者只能从未交易状态买入。初始化 `cash = 0`、`hold = -prices[0]`；按天从左到右；答案为最后的 `cash`。等价写法是维护历史最低价格。

```python
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price = prices[0]
        answer = 0
        for price in prices[1:]:
            answer = max(answer, price - min_price)
            min_price = min(min_price, price)
        return answer
```

**复杂度**：时间 `O(n)`，空间 `O(1)`。

**边界与易错点**：不能用未来最低价减当前价格；最低价只能来自卖出日之前。

**面试追问**：与 LC 122 的差别在哪里？LC 121 的持股状态只能由初始现金买入，LC 122 可用此前卖出所得再次买入。

## LC 322 零钱兑换

**考频与考点**：完全背包最少数量问题，重点是可重复选择与不可达状态。

**写代码前确认**：硬币可无限次使用；只求最少枚数，不要求方案数或具体组合。

**状态与思路**：`dp[x]` 表示凑成金额 `x` 的最少硬币数，转移为 `dp[x] = min(dp[x], dp[x-coin] + 1)`。`dp[0] = 0`，其余初始化为无穷。按硬币在外、金额从小到大遍历体现完全背包；若只求最少数，金额在外也能得到正确值。答案为 `dp[amount]`，仍为无穷则返回 `-1`。

```python
from typing import List

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        unreachable = amount + 1
        dp = [unreachable] * (amount + 1)
        dp[0] = 0
        for coin in coins:
            for value in range(coin, amount + 1):
                dp[value] = min(dp[value], dp[value - coin] + 1)
        return -1 if dp[amount] == unreachable else dp[amount]
```

**复杂度**：时间 `O(n * amount)`，空间 `O(amount)`。

**边界与易错点**：金额必须正序遍历才允许同一硬币重复使用；不可达初值不能设为 0。

**面试追问**：若求组合数，硬币在外可避免不同排列重复计数；若求排列数，则金额在外、硬币在内。

## LC 122 买卖股票的最佳时机 II

**考频与考点**：无限次交易的股票状态机，也可转化为累加所有正收益。

**写代码前确认**：同一时刻最多持有一股，卖出后可以再次买入；允许当天卖出再买入不影响最大利润。

**状态与思路**：`cash`、`hold` 分别表示当天结束未持股和持股的最大利润。转移为 `new_cash = max(cash, hold + price)`、`new_hold = max(hold, cash - price)`；初始化为 `0` 和 `-prices[0]`；从左到右遍历；答案是最终 `cash`。由于每段上涨都可独立兑现，也可贪心累加相邻正差值。

```python
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        cash, hold = 0, -prices[0]
        for price in prices[1:]:
            cash, hold = max(cash, hold + price), max(hold, cash - price)
        return cash
```

```python
from typing import List

class SolutionGreedy:
    def maxProfit(self, prices: List[int]) -> int:
        return sum(max(0, prices[i] - prices[i - 1]) for i in range(1, len(prices)))
```

**复杂度**：两种解法均为时间 `O(n)`、空间 `O(1)`。

**边界与易错点**：状态转移应基于上一日状态；Python 同时赋值右侧会先整体求值，因此这里可以安全更新。

**面试追问**：加入手续费、冷冻期或最多 `k` 次交易后，贪心通常失效，但持股/未持股状态机可以继续扩展。

## LC 198 打家劫舍

**考频与考点**：线性 DP，核心是相邻位置不可同时选择。

**写代码前确认**：金额非负；房屋首尾不相邻。若首尾也相邻，则是环形版本。

**状态与思路**：`dp[i]` 表示考虑前 `i` 间房的最高金额，转移为 `dp[i] = max(dp[i-1], dp[i-2] + nums[i-1])`。初始化 `dp[0] = 0`、`dp[1] = nums[0]`；按房屋顺序向右；答案在 `dp[n]`。代码用两个变量保存 `dp[i-2]` 与 `dp[i-1]`。

```python
from typing import List

class Solution:
    def rob(self, nums: List[int]) -> int:
        two_back = one_back = 0
        for money in nums:
            two_back, one_back = one_back, max(one_back, two_back + money)
        return one_back
```

**复杂度**：时间 `O(n)`，空间 `O(1)`。

**边界与易错点**：滚动更新时右侧必须同时基于旧值；只有一间房时也能由统一初始化处理。

**面试追问**：环形房屋如何处理？分别计算“不选最后一间”和“不选第一间”的线性答案，再取最大值。

## LC 70 爬楼梯

**考频与考点**：最基础的线性 DP，用于考查状态定义与空间压缩。

**写代码前确认**：每次只能走 1 或 2 阶，`n >= 1`；顺序不同视为不同走法。

**状态与思路**：`dp[i]` 表示到达第 `i` 阶的方法数，最后一步来自 `i-1` 或 `i-2`，故 `dp[i] = dp[i-1] + dp[i-2]`。初始化 `dp[0] = 1`、`dp[1] = 1`；按阶数递增；答案为 `dp[n]`。只依赖前两项，可滚动压缩。

```python
class Solution:
    def climbStairs(self, n: int) -> int:
        previous, current = 1, 1
        for _ in range(n):
            previous, current = current, previous + current
        return previous
```

**复杂度**：时间 `O(n)`，空间 `O(1)`。

**边界与易错点**：`dp[0] = 1` 表示“什么都不做”这一种空方案，是递推的中性起点。

**面试追问**：步长扩展为集合时可做完全背包；若 `n` 极大，可用矩阵快速幂将时间降至 `O(log n)`。

## LC 32 最长有效括号

**考频与考点**：新增高频题。考查位置 DP，或用栈维护最近一个无法匹配的位置。

**写代码前确认**：求连续子串长度；输入只含左右括号。

**状态与思路**：`dp[i]` 表示必须以 `s[i]` 结尾的最长有效括号长度。只有 `s[i] == ')'` 才可能转移：若前一字符为左括号，加上 `dp[i-2]`；否则跳过前一段有效串，检查位置 `i-dp[i-1]-1` 是否为左括号，再接上更早的有效串。数组初始化为 0；`i` 从 1 向右；答案为 `max(dp)`。

```python
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        dp = [0] * len(s)
        answer = 0
        for i in range(1, len(s)):
            if s[i] != ")":
                continue
            if s[i - 1] == "(":
                dp[i] = 2 + (dp[i - 2] if i >= 2 else 0)
            else:
                left = i - dp[i - 1] - 1
                if left >= 0 and s[left] == "(":
                    dp[i] = dp[i - 1] + 2
                    if left > 0:
                        dp[i] += dp[left - 1]
            answer = max(answer, dp[i])
        return answer
```

**复杂度**：时间 `O(n)`，空间 `O(n)`；双向计数扫描可做到 `O(1)` 空间。

**边界与易错点**：匹配 `...))` 时，要先跨过 `dp[i-1]` 找潜在左括号，并拼接左侧已有有效段。

**面试追问**：栈解法为何先压入 `-1`？它代表最近一个不可参与匹配的位置，使当前有效长度可以直接用下标差得到。

## LC 64 最小路径和

**考频与考点**：新增二维网格 DP，考查边界初始化与原地状态压缩。

**写代码前确认**：只能向右或向下，网格非空；是否允许覆盖输入需要提前确认。

**状态与思路**：`dp[i][j]` 表示到达 `(i,j)` 的最小路径和，转移为当前值加上方、左方的较小者。左上角初始化为自身，首行只能来自左侧，首列只能来自上方；按行从左到右遍历；答案在右下角。代码直接把 `grid` 当作 DP 表，代价是覆盖原数据。

```python
from typing import List

class Solution:
    def minPathSum(self, grid: List[List[int]]) -> int:
        rows, cols = len(grid), len(grid[0])
        for i in range(rows):
            for j in range(cols):
                if i == 0 and j == 0:
                    continue
                if i == 0:
                    grid[i][j] += grid[i][j - 1]
                elif j == 0:
                    grid[i][j] += grid[i - 1][j]
                else:
                    grid[i][j] += min(grid[i - 1][j], grid[i][j - 1])
        return grid[-1][-1]
```

**复杂度**：时间 `O(mn)`，除输入外空间 `O(1)`；不修改输入时可用 `O(n)` 滚动数组。

**边界与易错点**：首行和首列只有一个来源，不能用不存在的方向参与最小值比较。

**面试追问**：若允许四个方向，普通 DP 的无环依赖被破坏，应建图后使用 Dijkstra 等最短路算法。

## LC 118 杨辉三角

**考频与考点**：新增基础 DP。考查上一行到下一行的构造关系。

**写代码前确认**：返回前 `numRows` 行，而不是某一行；每行两端固定为 1。

**状态与思路**：`triangle[i][j]` 表示第 `i` 行第 `j` 个数，内部位置由上一行相邻两数相加得到。第一行初始化为 `[1]`；按行递增构造，每行先填充 1，再更新内部位置；答案是完整二维列表。

```python
from typing import List

class Solution:
    def generate(self, numRows: int) -> List[List[int]]:
        triangle: List[List[int]] = []
        for row_index in range(numRows):
            row = [1] * (row_index + 1)
            for j in range(1, row_index):
                row[j] = triangle[-1][j - 1] + triangle[-1][j]
            triangle.append(row)
        return triangle
```

**复杂度**：共生成 `O(numRows^2)` 个数，时间和输出空间均为 `O(numRows^2)`。

**边界与易错点**：只有一行时内部循环为空；输出本身需要二维空间，不能将其算作可省略的辅助空间。

**面试追问**：只求第 `k` 行时如何降到 `O(k)` 空间？使用一维数组并从右向左原地更新，避免覆盖上一层依赖。

## LC 120 三角形最小路径和

**考频与考点**：新增不规则网格 DP，适合考查自底向上压缩。

**写代码前确认**：相邻下一层位置是同下标或下标加一；路径必须从顶到底。

**状态与思路**：自底向上定义 `dp[j]` 为从当前层位置 `j` 到底部的最小路径和。以最后一行为初始化；处理第 `i` 层时，转移为 `dp[j] = triangle[i][j] + min(dp[j], dp[j+1])`。层从倒数第二层向上、位置从左向右；最终答案在 `dp[0]`。

```python
from typing import List

class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        dp = triangle[-1][:]
        for i in range(len(triangle) - 2, -1, -1):
            for j in range(i + 1):
                dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
        return dp[0]
```

**复杂度**：时间 `O(n^2)`，空间 `O(n)`。

**边界与易错点**：自底向上时 `dp[j]` 与 `dp[j+1]` 均来自下一层；若改为自顶向下原地更新，需要从右向左。

**面试追问**：若要恢复路径，可保留二维 DP，并从顶点依次选择代价更小的两个下一层状态。

## LC 279 完全平方数

**考频与考点**：新增完全背包题，与零钱兑换同构。

**写代码前确认**：每个完全平方数可以重复使用，目标是最少数量。

**状态与思路**：`dp[value]` 表示组成 `value` 的最少平方数个数，枚举平方数 `square` 后转移 `dp[value] = min(dp[value], dp[value-square] + 1)`。`dp[0] = 0`，其余为无穷；平方数在外，容量从小到大；答案为 `dp[n]`。

```python
from math import isqrt

class Solution:
    def numSquares(self, n: int) -> int:
        dp = [0] + [n + 1] * n
        for base in range(1, isqrt(n) + 1):
            square = base * base
            for value in range(square, n + 1):
                dp[value] = min(dp[value], dp[value - square] + 1)
        return dp[n]
```

**复杂度**：时间 `O(n * sqrt(n))`，空间 `O(n)`。

**边界与易错点**：容量正序表示完全背包；`isqrt` 可避免浮点开方误差。

**面试追问**：也可将每个整数看成图节点，用 BFS 找最少层数；数论解法可依据四平方和定理进一步优化。

## LC 416 分割等和子集

**考频与考点**：新增 0-1 背包可达性问题，遍历方向是关键。

**写代码前确认**：每个元素只能使用一次；总和为奇数时必然无解。

**状态与思路**：目标容量是总和的一半，`dp[value]` 表示能否从已处理元素中选出和为 `value` 的子集。`dp[0] = True`，其余为假；对每个数，容量必须从目标值向下遍历，转移为 `dp[value] |= dp[value-num]`；答案在 `dp[target]`。倒序保证本轮不会重复使用当前元素。

```python
from typing import List

class Solution:
    def canPartition(self, nums: List[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        dp = [False] * (target + 1)
        dp[0] = True
        for num in nums:
            for value in range(target, num - 1, -1):
                dp[value] = dp[value] or dp[value - num]
        return dp[target]
```

**复杂度**：时间 `O(n * target)`，空间 `O(target)`。

**边界与易错点**：容量若正序更新，会把一个元素使用多次，错误地变成完全背包。

**面试追问**：若要求恰好选 `k` 个数，应增加“已选数量”维度；若有负数，容量下标需平移或改用集合维护可达和。

## LC 647 回文子串

**考频与考点**：新增回文 DP。与 LC 5 共用状态，但目标由最长长度变为计数。

**写代码前确认**：相同内容出现在不同位置要分别计数；单字符也是回文子串。

**状态与思路**：`dp[i][j]` 表示闭区间是否为回文，转移为 `s[i] == s[j] and (j - i <= 1 or dp[i+1][j-1])`。初始化依靠统一短区间条件；`i` 从右到左、`j` 从 `i` 向右；每个为真的状态给答案加一，答案是所有状态之和。

```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        n = len(s)
        dp = [[False] * n for _ in range(n)]
        count = 0
        for i in range(n - 1, -1, -1):
            for j in range(i, n):
                dp[i][j] = s[i] == s[j] and (j - i <= 1 or dp[i + 1][j - 1])
                count += int(dp[i][j])
        return count
```

**复杂度**：时间和空间均为 `O(n^2)`；中心扩展可将空间降到 `O(1)`。

**边界与易错点**：这是按位置计数，不应使用集合去重；遍历方向仍需满足对内部区间的依赖。

**面试追问**：中心扩展总共有 `2n-1` 个中心，每成功扩展一次就得到一个不同位置的回文子串。

## LC 718 最长重复子数组

**考频与考点**：新增双序列 DP。名称是“子数组”，因此要求连续。

**写代码前确认**：两个数组中的重复片段都必须连续；只返回长度。

**状态与思路**：`dp[i][j]` 表示分别以 `nums1[i-1]`、`nums2[j-1]` 结尾的最长公共连续片段长度。元素相等时由左上角加一，否则归零。空前缀行列初始化为 0；两个维度递增；答案是所有 `dp[i][j]` 的最大值，不一定在右下角。

```python
from typing import List

class Solution:
    def findLength(self, nums1: List[int], nums2: List[int]) -> int:
        m, n = len(nums1), len(nums2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        answer = 0
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if nums1[i - 1] == nums2[j - 1]:
                    dp[i][j] = dp[i - 1][j - 1] + 1
                    answer = max(answer, dp[i][j])
        return answer
```

**复杂度**：时间 `O(mn)`，空间 `O(mn)`；一维倒序更新可降到 `O(n)`。

**边界与易错点**：字符不等时状态必须为 0，不能像 LCS 那样取上方或左方最大值。

**面试追问**：数据规模更大时，可二分答案并用滚动哈希检查公共片段，或使用后缀自动机。

## LC 918 环形子数组的最大和

**考频与考点**：新增 Kadane 变形。考查把跨边界区间转化为“总和减去中间最小子数组”。

**写代码前确认**：子数组不能为空；每个元素最多使用一次。

**状态与思路**：分别维护以当前位置结尾的最大和 `max_ending` 与最小和 `min_ending`，转移均为“从当前重启或接在前段之后”；初始化为首元素，按数组从左向右遍历。非环形答案是最大子数组和，环形答案是总和减最小子数组和。若最大值小于 0，说明全为负数，不能用总和减整个数组得到空数组，直接返回最大值。

```python
from typing import List

class Solution:
    def maxSubarraySumCircular(self, nums: List[int]) -> int:
        total = nums[0]
        max_ending = max_sum = nums[0]
        min_ending = min_sum = nums[0]
        for value in nums[1:]:
            max_ending = max(value, max_ending + value)
            max_sum = max(max_sum, max_ending)
            min_ending = min(value, min_ending + value)
            min_sum = min(min_sum, min_ending)
            total += value
        return max_sum if max_sum < 0 else max(max_sum, total - min_sum)
```

**复杂度**：时间 `O(n)`，空间 `O(1)`。

**边界与易错点**：全负数组必须特判，否则环形候选会错误地选择空子数组。

**面试追问**：如何返回环形区间下标？同时记录最大、最小子数组边界；跨边界答案对应最小区间之外的两段。

## LC 1262 可被三整除的最大和

**考频与考点**：新增余数状态 DP。考查将大数值容量压缩为有限模状态。

**写代码前确认**：每个元素最多选择一次，可以选择空集，因此答案至少为 0。

**状态与思路**：`dp[r]` 表示已处理元素中，和模 3 为 `r` 的最大值。初始化 `dp = [0, -inf, -inf]`；处理每个数时必须基于旧数组转移，选择它后更新余数 `(r + num) % 3`。按元素从左到右，余数维度遍历旧状态；答案在 `dp[0]`。

```python
from typing import List

class Solution:
    def maxSumDivThree(self, nums: List[int]) -> int:
        negative_infinity = float("-inf")
        dp: List[float] = [0, negative_infinity, negative_infinity]
        for num in nums:
            next_dp = dp[:]
            for remainder in range(3):
                if dp[remainder] != negative_infinity:
                    new_remainder = (remainder + num) % 3
                    next_dp[new_remainder] = max(
                        next_dp[new_remainder], dp[remainder] + num
                    )
            dp = next_dp
        return int(dp[0])
```

**复杂度**：时间 `O(n)`，空间 `O(1)`，因为余数状态固定为 3 个。

**边界与易错点**：不可达状态不能初始化为 0；直接原地更新可能在同一轮重复选择当前元素。

**面试追问**：若要求和能被 `k` 整除，只需把状态扩展为 `k` 个余数，时间 `O(nk)`、空间 `O(k)`。
