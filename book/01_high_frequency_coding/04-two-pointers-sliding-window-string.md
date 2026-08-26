# 双指针、滑动窗口与字符串

本文件维护第一章第四类题目的题解与面试追问。本类重点不是背指针模板，而是说明指针为何可以单向移动，以及哈希表如何减少窗口内的重复查找。

## 字节核心题单

| 顺序 | 题目 | 字节频次 | 数据版本 | 其他统计覆盖 |
|------|------|----------|----------|--------------|
| 1 | LC 3 无重复字符的最长子串 | 174 | 08 更新 | 3/4 |
| 2 | LC 15 三数之和 | 44 | 08 更新 | 4/4 |
| 3 | LC 42 接雨水 | 38 | 08 更新 | 4/4 |
| 4 | LC 88 合并两个有序数组 | 29 | 04 基线 | 2/4 |
| 5 | LC 209 长度最小的子数组 | 12 | 04 基线 | 2/4 |
| 6 | LC 239 滑动窗口最大值 | 9 | 04 基线 | 4/4 |

## 其他来源新增题

| 题目 | 发现来源 |
|------|----------|
| LC 8 字符串转换整数（atoi） | 美团 |
| LC 11 盛最多水的容器 | 华为 |
| LC 14 最长公共前缀 | 美团 |
| LC 16 最接近的三数之和 | 美团 |
| LC 43 字符串相乘 | 美团、腾讯 |
| LC 76 最小覆盖子串 | 腾讯、Hot 100 综合榜 |
| LC 283 移动零 | Hot 100 综合榜 |
| LC 438 找到字符串中所有字母异位词 | Hot 100 综合榜 |
| LC 468 验证 IP 地址 | 美团 |

## 题解与追问重点

- LC 3 比较集合维护窗口与“最近出现位置”哈希表，解释左指针为什么只能前进，以及哈希表如何让它直接跳转。
- LC 15 必须给出排序加双指针和枚举加哈希表两种解法，重点比较去重难度、空间成本和面试推荐写法。
- LC 15 与第五类的 LC 1 组成专题：哈希表用于快速找补数，双指针用于在有序区间中缩小搜索范围。
- LC 42 比较前后缀最大值、双指针和单调栈，说明每种解法真正累加水量的时机。
- 滑动窗口题统一说明窗口含义、扩张条件、收缩条件和答案更新时机。
- 字符串解析题必须列出空串、前导零、符号、非法字符、溢出和分隔符边界。

## LC 3 无重复字符的最长子串

**考频与考点**：字节 174 次，是本章最高频题。考查可变滑动窗口、哈希集合与最近位置哈希表。

**写代码前确认**：答案是子串长度，子串必须连续；字符集是否只含 ASCII 不影响字典写法；空串返回 `0`。

**思路/解法一：集合维护合法窗口**。窗口 `[left, right]` 始终无重复。若新字符已在集合中，持续移除左端字符并右移 `left`，直到可加入新字符。每个字符最多进出集合一次。

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        window = set()
        left = answer = 0
        for right, char in enumerate(s):
            while char in window:
                window.remove(s[left])
                left += 1
            window.add(char)
            answer = max(answer, right - left + 1)
        return answer
```

**思路/解法二：最近位置哈希表直接跳转**。记录每个字符最近一次出现的下标。新字符上次出现在当前窗口内时，`left` 可直接跳到该位置后一格；必须取 `max`，因为左边界只能前进，不能被窗口外的旧位置拉回。

```python
class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        last_index = {}
        left = answer = 0
        for right, char in enumerate(s):
            if char in last_index:
                left = max(left, last_index[char] + 1)
            last_index[char] = right
            answer = max(answer, right - left + 1)
        return answer
```

**复杂度**：两种方法时间均为 `O(n)`、空间均为 `O(min(n, 字符集大小))`。最近位置法减少了逐个收缩窗口的操作，表达更直接。

**边界/易错点**：`"abba"` 可检查左边界是否错误回退；更新最近位置和答案的先后顺序要与窗口定义一致。

**面试追问**：若每个字符最多出现 `k` 次，窗口状态如何维护？如何返回最长子串本身？输入是字符流且不能保存全部字符串时怎么办？

## LC 15 三数之和

**考频与考点**：字节 44 次，所有统计源均覆盖。考查排序、双指针、哈希补数和结果去重，是 LC 1“两数之和”的自然扩展。

**写代码前确认**：返回数值三元组而非下标；三元组内使用三个不同位置；答案不能重复，输出顺序不限。

**思路/解法一：排序 + 双指针**。排序后枚举第一个数 `nums[i]`，剩余区间转化为目标值为 `-nums[i]` 的两数之和。和偏小则左指针右移，和偏大则右指针左移，这是有序性保证的单调排除。三层去重缺一不可：固定数与前一个相同时跳过；找到答案后分别跳过左侧重复值和右侧重复值；最后同时收缩两端。若 `nums[i] > 0`，之后不可能得到零，可提前结束。

```python
from typing import List


class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        nums.sort()
        answer = []
        for i in range(len(nums) - 2):
            if nums[i] > 0:
                break
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            left, right = i + 1, len(nums) - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if total < 0:
                    left += 1
                elif total > 0:
                    right -= 1
                else:
                    answer.append([nums[i], nums[left], nums[right]])
                    left_value, right_value = nums[left], nums[right]
                    while left < right and nums[left] == left_value:
                        left += 1
                    while left < right and nums[right] == right_value:
                        right -= 1
        return answer
```

**思路/解法二：枚举 + 哈希表**。固定一个位置后，从其右侧扫描第二个数；哈希集合保存已经扫描过的值，以平均 `O(1)` 查找补数。与 LC 1 的一次扫描哈希完全同构，但三数之和还要对三元组归一化并用集合去重，因此空间和去重成本更高，面试中通常优先排序双指针。

```python
from typing import List


class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        triples = set()
        for i in range(len(nums) - 2):
            seen = set()
            for j in range(i + 1, len(nums)):
                complement = -nums[i] - nums[j]
                if complement in seen:
                    triples.add(tuple(sorted((nums[i], nums[j], complement))))
                seen.add(nums[j])
        return [list(triple) for triple in triples]
```

**复杂度**：排序双指针时间 `O(n^2)`，排序额外空间取决于实现；哈希法平均时间 `O(n^2)`，除答案外额外空间 `O(n)`。

**边界/易错点**：长度不足三、全为零、大量重复值；找到答案后只移动一侧会重复输出。排序会修改输入，若不允许应先复制。

**面试追问**：为何双指针必须依赖有序性？如何推广到目标值不为零、四数之和或 `kSum`？若要求返回原下标，应如何设计去重？

## LC 42 接雨水

**考频与考点**：字节 38 次，所有统计源均覆盖。考查按列计算、边界最大值、双指针不变量和单调栈。

**写代码前确认**：每格宽度为 `1`，高度非负；长度小于三必然无法蓄水。

**思路/解法一：前后缀最大值**。第 `i` 列水量由其左侧最高柱与右侧最高柱中较矮者决定：`min(left_max[i], right_max[i]) - height[i]`。该方法最直观，适合先推导正确公式。

```python
from typing import List


class Solution:
    def trap(self, height: List[int]) -> int:
        n = len(height)
        if n < 3:
            return 0
        left_max = [0] * n
        right_max = [0] * n
        left_max[0], right_max[-1] = height[0], height[-1]
        for i in range(1, n):
            left_max[i] = max(left_max[i - 1], height[i])
        for i in range(n - 2, -1, -1):
            right_max[i] = max(right_max[i + 1], height[i])
        return sum(min(left_max[i], right_max[i]) - height[i] for i in range(n))
```

**思路/解法二：双指针**。维护两端迄今最高值。若 `left_max <= right_max`，左侧当前列的短板已经确定为 `left_max`，未来右侧再高也不会改变它，因此可立即结算并右移左指针；反之结算右侧。空间降为常数。

```python
from typing import List


class Solution:
    def trap(self, height: List[int]) -> int:
        left, right = 0, len(height) - 1
        left_max = right_max = water = 0
        while left <= right:
            if left_max <= right_max:
                left_max = max(left_max, height[left])
                water += left_max - height[left]
                left += 1
            else:
                right_max = max(right_max, height[right])
                water += right_max - height[right]
                right -= 1
        return water
```

**思路/解法三：单调栈**。栈保存高度单调不增的柱下标。当前柱更高时，弹出的柱是凹槽底部；新栈顶与当前柱形成左右边界，一次计算一层横向水量。它更适合追问“每个凹槽如何形成”。

```python
from typing import List


class Solution:
    def trap(self, height: List[int]) -> int:
        stack, water = [], 0
        for right, current_height in enumerate(height):
            while stack and current_height > height[stack[-1]]:
                bottom = stack.pop()
                if not stack:
                    break
                left = stack[-1]
                width = right - left - 1
                bounded_height = min(height[left], current_height) - height[bottom]
                water += width * bounded_height
            stack.append(right)
        return water
```

**复杂度**：三种方法时间均为 `O(n)`；前后缀空间 `O(n)`，双指针空间 `O(1)`，单调栈空间 `O(n)`。

**边界/易错点**：单调序列、全等高度、多个相同边界；双指针比较的是已知边界最大值，而非简单比较当前两根柱后随意结算。

**面试追问**：三种算法分别按列还是按层累加？为什么单调栈在弹出后若为空不能计算？二维接雨水为何需要最小堆？

## LC 88 合并两个有序数组

**考频与考点**：字节 29 次。考查逆向双指针和原地覆盖安全性。

**写代码前确认**：`nums1` 尾部有 `n` 个占位空间；有效元素分别为前 `m` 个和前 `n` 个；要求修改 `nums1`。

**思路/解法**：若从前向后写，`nums1` 中尚未比较的元素可能被覆盖。从两数组有效区末尾比较，把较大值写入 `nums1` 最末空位，写指针不断左移。最后只需补齐 `nums2` 剩余部分；若 `nums1` 有剩余，它们已在正确位置。

```python
from typing import List


class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        first, second, write = m - 1, n - 1, m + n - 1
        while second >= 0:
            if first >= 0 and nums1[first] > nums2[second]:
                nums1[write] = nums1[first]
                first -= 1
            else:
                nums1[write] = nums2[second]
                second -= 1
            write -= 1
```

**复杂度**：时间 `O(m + n)`；额外空间 `O(1)`。

**边界/易错点**：`m = 0`、`n = 0`、重复值；循环条件以 `second >= 0` 为准即可。

**面试追问**：若 `nums1` 没有尾部空间怎么办？如何合并两个有序流？为何正向合并需要额外数组？

## LC 209 长度最小的子数组

**考频与考点**：字节 12 次。考查正数数组上的可变滑动窗口。

**写代码前确认**：原题元素均为正数，这是窗口和具有单调性的关键；不存在答案时返回 `0`。

**思路/解法**：窗口 `[left, right]` 表示当前连续子数组。右端加入新数使总和增大；当总和达到目标时，持续右移左边界寻找以当前右端结尾的最短合法窗口，并在删除左端前更新答案。若允许负数，该单调性消失，应考虑前缀和加单调队列。

```python
from typing import List


class Solution:
    def minSubArrayLen(self, target: int, nums: List[int]) -> int:
        left = window_sum = 0
        answer = len(nums) + 1
        for right, value in enumerate(nums):
            window_sum += value
            while window_sum >= target:
                answer = min(answer, right - left + 1)
                window_sum -= nums[left]
                left += 1
        return 0 if answer == len(nums) + 1 else answer
```

**复杂度**：时间 `O(n)`，每个元素最多进入和离开窗口一次；额外空间 `O(1)`。

**边界/易错点**：单元素已达标、总和不足；答案要在收缩前更新，否则会漏掉合法窗口。

**面试追问**：如何用前缀和加二分做到 `O(n log n)`？包含负数时为什么普通滑窗错误，怎样改成单调队列？

## LC 239 滑动窗口最大值

**考频与考点**：字节 9 次，所有统计源均覆盖。考查单调队列、过期下标和摊还复杂度。

**写代码前确认**：窗口大小 `k` 合法；返回每个完整窗口的最大值。

**思路/解法**：双端队列保存下标，并保证对应值从队首到队尾单调不增。加入新元素前，先移除队尾所有不大于它的元素，因为它们更小且更早过期，不可能再成为最大值；再移除队首已离开窗口的下标。队首始终是当前窗口最大值。

```python
from collections import deque
from typing import List


class Solution:
    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:
        queue = deque()
        answer = []
        for right, value in enumerate(nums):
            while queue and nums[queue[-1]] <= value:
                queue.pop()
            queue.append(right)
            left = right - k + 1
            if queue[0] < left:
                queue.popleft()
            if left >= 0:
                answer.append(nums[queue[0]])
        return answer
```

**复杂度**：时间 `O(n)`，每个下标至多入队、出队各一次；队列空间 `O(k)`。

**边界/易错点**：队列必须存下标才能判断过期；`k = 1` 时答案等于原数组；相等元素是否弹出不影响正确性，但弹出可保持队列更短。

**面试追问**：如何同时维护窗口最小值？为什么堆解法通常是 `O(n log n)`？单调队列的摊还 `O(1)` 如何证明？

## LC 8 字符串转换整数（atoi）

**考频与考点**：美团新增。考查顺序解析、状态边界和 32 位整数溢出。

**写代码前确认**：只跳过前导空格；符号至多一个；遇到首个非数字后立即停止；无有效数字返回 `0`；结果限制在 `[-2^31, 2^31 - 1]`。

**思路/解法**：依次处理前导空格、可选符号和连续数字。累加新数字前用 `(limit - digit) // 10` 判断是否将溢出，从而不依赖语言的大整数能力。`limit` 根据符号分别取 `2^31 - 1` 或 `2^31`。

```python
class Solution:
    def myAtoi(self, s: str) -> int:
        index, n = 0, len(s)
        while index < n and s[index] == " ":
            index += 1

        sign = 1
        if index < n and s[index] in "+-":
            sign = -1 if s[index] == "-" else 1
            index += 1

        limit = 2**31 if sign == -1 else 2**31 - 1
        value = 0
        while index < n and "0" <= s[index] <= "9":
            digit = ord(s[index]) - ord("0")
            if value > (limit - digit) // 10:
                return sign * limit
            value = value * 10 + digit
            index += 1
        return sign * value
```

**复杂度**：时间 `O(n)`；额外空间 `O(1)`。

**边界/易错点**：空串、只有符号、前导零、符号后空格、数字后字母、正负边界；不要把中间空格当作可跳过字符。

**面试追问**：如何用有限状态机表达？若解析任意进制或 64 位整数，需要调整哪些状态和边界？

## LC 11 盛最多水的容器

**考频与考点**：华为新增。考查相向双指针及“移动短板”的正确性证明。

**写代码前确认**：两条竖线与横轴构成容器，面积为距离乘较短高度；不能倾斜容器。

**思路/解法**：从最宽区间开始计算面积。面积受较短边限制；若移动较长边，宽度减小而短板不变，面积不可能变大，因此只能移动较短边，寻找更高的短板。每一步都安全排除一批不可能更优的组合。

```python
from typing import List


class Solution:
    def maxArea(self, height: List[int]) -> int:
        left, right = 0, len(height) - 1
        answer = 0
        while left < right:
            answer = max(answer, (right - left) * min(height[left], height[right]))
            if height[left] <= height[right]:
                left += 1
            else:
                right -= 1
        return answer
```

**复杂度**：时间 `O(n)`；额外空间 `O(1)`。

**边界/易错点**：面积宽度是下标差；两边等高时移动任意一边都不会漏掉更优解。

**面试追问**：如何严格证明移动长边无收益？与 LC 42 的双指针不变量有何区别？

## LC 14 最长公共前缀

**考频与考点**：美团新增。考查字符串逐列比较和输入边界。

**写代码前确认**：空数组和包含空串时均返回空字符串；比较区分大小写。

**思路/解法**：把第一个字符串作为基准，逐列检查其余字符串。任一字符串长度不足或当前位置字符不同，当前下标之前就是答案。也可不断缩短候选前缀，但可能反复创建字符串。

```python
from typing import List


class Solution:
    def longestCommonPrefix(self, strs: List[str]) -> str:
        if not strs:
            return ""
        for index, char in enumerate(strs[0]):
            for position in range(1, len(strs)):
                text = strs[position]
                if index == len(text) or text[index] != char:
                    return strs[0][:index]
        return strs[0]
```

**复杂度**：时间 `O(S)`，`S` 为实际检查的字符总数上界；除切片结果外空间 `O(1)`。

**边界/易错点**：不要访问短字符串越界；只有一个字符串时应返回它本身。

**面试追问**：大量字符串如何用 Trie？字符串分布在多台机器时如何归并公共前缀？

## LC 16 最接近的三数之和

**考频与考点**：美团新增。考查排序双指针与最优差值维护。

**写代码前确认**：题目保证至少三个数且答案唯一；返回三数之和而非差值或下标。

**思路/解法**：排序后枚举第一个数，在其右侧使用双指针。每次先根据绝对差更新当前最佳和；和小于目标时只能右移左指针使其增大，和大于目标时只能左移右指针使其减小，恰好相等可立即返回。

```python
from typing import List


class Solution:
    def threeSumClosest(self, nums: List[int], target: int) -> int:
        nums.sort()
        best = nums[0] + nums[1] + nums[2]
        for i in range(len(nums) - 2):
            left, right = i + 1, len(nums) - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if abs(total - target) < abs(best - target):
                    best = total
                if total < target:
                    left += 1
                elif total > target:
                    right -= 1
                else:
                    return target
        return best
```

**复杂度**：时间 `O(n^2)`；排序额外空间取决于实现。

**边界/易错点**：最佳值应初始化为真实三数之和，不能随意设为 `0`；若题目不保证答案唯一，要约定差值相同时的选择。

**面试追问**：如何做最接近目标的两数之和？如何通过边界和进行剪枝？与 LC 15 的去重要求有何不同？

## LC 43 字符串相乘

**考频与考点**：美团、腾讯新增。考查竖式乘法、进位与字符串大整数模拟。

**写代码前确认**：输入只含数字且无多余前导零；不能直接转换为大整数；任一输入为 `"0"` 时返回 `"0"`。

**思路/解法**：长度为 `m`、`n` 的数相乘结果最多 `m+n` 位。反向枚举两个数字，乘积累加到结果数组位置 `i+j+1`，个位留在该处，进位累加到 `i+j`。由于从低位向高位处理，累加进位可被后续计算继续归并。

```python
class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        if num1 == "0" or num2 == "0":
            return "0"
        result = [0] * (len(num1) + len(num2))
        for i in range(len(num1) - 1, -1, -1):
            for j in range(len(num2) - 1, -1, -1):
                product = (ord(num1[i]) - 48) * (ord(num2[j]) - 48)
                total = product + result[i + j + 1]
                result[i + j + 1] = total % 10
                result[i + j] += total // 10
        first = 0
        while first < len(result) - 1 and result[first] == 0:
            first += 1
        return "".join(str(digit) for digit in result[first:])
```

**复杂度**：时间 `O(mn)`；结果数组空间 `O(m+n)`。

**边界/易错点**：下标对应关系是 `i+j` 和 `i+j+1`；结果前导零要移除，但不能把零乘积变成空串。

**面试追问**：如何实现字符串加法？超长数字如何用更大的进制分块？Karatsuba 乘法何时值得使用？

## LC 76 最小覆盖子串

**考频与考点**：腾讯、Hot 100 新增。考查带重复需求的可变窗口和哈希计数。

**写代码前确认**：覆盖必须满足 `t` 中每个字符的频次而非仅包含字符种类；若不存在返回空串；大小写敏感。

**思路/解法**：`need` 保存尚缺的字符频次，`missing` 保存尚缺字符总数。右端字符若仍被需要，则 `missing` 减一；无论是否多余都将其需求减一。覆盖完成后持续收缩左端，并在收缩前更新最短答案；移出字符后若其需求变为正数，说明窗口重新缺字符。

```python
from collections import Counter


class Solution:
    def minWindow(self, s: str, t: str) -> str:
        if not s or not t:
            return ""
        need = Counter(t)
        missing = len(t)
        left = 0
        best_start, best_length = 0, len(s) + 1

        for right, char in enumerate(s):
            if need[char] > 0:
                missing -= 1
            need[char] -= 1

            while missing == 0:
                length = right - left + 1
                if length < best_length:
                    best_start, best_length = left, length
                left_char = s[left]
                need[left_char] += 1
                if need[left_char] > 0:
                    missing += 1
                left += 1

        if best_length == len(s) + 1:
            return ""
        return s[best_start:best_start + best_length]
```

**复杂度**：时间 `O(|s| + |t|)`；哈希表空间 `O(|字符集|)`。

**边界/易错点**：`t` 含重复字符、`t` 比 `s` 长、刚好覆盖；多余字符的需求允许为负数。

**面试追问**：如何返回所有同长度最小窗口？若字符流只能向前读取，如何保存候选窗口？与 LC 438 的固定窗口有何联系？

## LC 283 移动零

**考频与考点**：Hot 100 新增。考查同向双指针、原地稳定移动。

**写代码前确认**：保持非零元素相对顺序；必须原地操作，不需要返回数组。

**思路/解法**：`write` 指向下一个非零元素应放的位置。`read` 扫描数组，遇到非零就与 `write` 位置交换并推进 `write`。已扫描区间中，前 `write` 个元素始终是按原顺序收集的全部非零元素，其后均可视为待处理区域。

```python
from typing import List


class Solution:
    def moveZeroes(self, nums: List[int]) -> None:
        write = 0
        for read in range(len(nums)):
            if nums[read] != 0:
                nums[write], nums[read] = nums[read], nums[write]
                write += 1
```

**复杂度**：时间 `O(n)`；额外空间 `O(1)`。

**边界/易错点**：全零、无零、只有一个元素；交换法在 `read == write` 时会自交换但不影响正确性。

**面试追问**：如何减少写操作次数？如何把满足任意谓词的元素稳定移到末尾？若不要求稳定可怎样做？

## LC 438 找到字符串中所有字母异位词

**考频与考点**：Hot 100 新增。考查固定长度滑动窗口与频次哈希。

**写代码前确认**：异位词必须长度相同且字符频次一致；返回起始下标；原题字符为小写字母。

**思路/解法**：窗口长度固定为 `len(p)`。沿用 LC 76 的含义：`need` 表示当前窗口还缺多少字符，`missing` 表示缺失总数。加入右端后，若窗口过长就移出左端并恢复需求；长度刚好且 `missing == 0` 时记录起点。

```python
from collections import Counter
from typing import List


class Solution:
    def findAnagrams(self, s: str, p: str) -> List[int]:
        if len(p) > len(s):
            return []
        need = Counter(p)
        missing = len(p)
        left = 0
        answer = []
        for right, char in enumerate(s):
            if need[char] > 0:
                missing -= 1
            need[char] -= 1

            if right - left + 1 > len(p):
                left_char = s[left]
                need[left_char] += 1
                if need[left_char] > 0:
                    missing += 1
                left += 1
            if right - left + 1 == len(p) and missing == 0:
                answer.append(left)
        return answer
```

**复杂度**：时间 `O(|s| + |p|)`；哈希表空间 `O(|字符集|)`。

**边界/易错点**：`p` 比 `s` 长、重复字符、相邻答案；移出字符时先恢复 `need`，再判断是否重新产生缺失。

**面试追问**：小写字母场景如何用长度 26 的数组优化？如何判断两个字符串是否异位？与最小覆盖子串的收缩条件有何区别？

## LC 468 验证 IP 地址

**考频与考点**：美团新增。考查严格格式解析、分隔符和字符范围校验。

**写代码前确认**：IPv4 恰有四段，IPv6 恰有八段；本题不接受 IPv6 压缩写法 `::`、前后分隔符或混合格式。

**思路/解法**：先按出现的分隔符决定候选类型。IPv4 每段必须是 1 至 3 个十进制数字，除单个 `0` 外不能有前导零，数值不超过 255。IPv6 每段必须是 1 至 4 个十六进制字符。先校验字符再转换，避免 `int` 接受题目不允许的符号或空白。

```python
class Solution:
    def validIPAddress(self, queryIP: str) -> str:
        if "." in queryIP and ":" not in queryIP:
            parts = queryIP.split(".")
            if len(parts) != 4:
                return "Neither"
            for part in parts:
                if not 1 <= len(part) <= 3:
                    return "Neither"
                if not all("0" <= char <= "9" for char in part):
                    return "Neither"
                if len(part) > 1 and part[0] == "0":
                    return "Neither"
                if int(part) > 255:
                    return "Neither"
            return "IPv4"

        if ":" in queryIP and "." not in queryIP:
            parts = queryIP.split(":")
            hexadecimal = set("0123456789abcdefABCDEF")
            if len(parts) != 8:
                return "Neither"
            for part in parts:
                if not 1 <= len(part) <= 4 or any(char not in hexadecimal for char in part):
                    return "Neither"
            return "IPv6"

        return "Neither"
```

**复杂度**：时间 `O(n)`；切分后的辅助空间 `O(n)`，IP 长度有固定上限时可视为常数。

**边界/易错点**：空段、尾部分隔符、IPv4 前导零、正负号、IPv6 非法字母、同时含点和冒号。

**面试追问**：如何支持 IPv6 的 `::` 压缩和 IPv4 映射地址？不用 `split` 如何写状态机？
