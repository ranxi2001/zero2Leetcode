# 栈、队列、哈希、贪心与设计

本文件维护第一章第五类题目的题解与面试追问。字节原文把哈希、堆、栈、队列、回溯、贪心和数据结构设计合并在本类，书稿保持这一安排。

## 字节核心题单

| 顺序 | 题目 | 字节频次 | 数据版本 | 其他统计覆盖 |
|------|------|----------|----------|--------------|
| 1 | LC 146 LRU 缓存 | 72 | 08 更新 | 4/4 |
| 2 | LC 215 数组中的第 K 个最大元素 | 64 | 08 更新 | 4/4 |
| 3 | LC 20 有效的括号 | 36 | 08 更新 | 3/4 |
| 4 | LC 1 两数之和 | 17 | 04 基线 | 3/4 |
| 5 | LC 46 全排列 | 16 | 04 基线 | 2/4 |
| 6 | LC 165 比较版本号 | 16 | 04 基线 | 1/4 |
| 7 | LC 232 用栈实现队列 | 14 | 04 基线 | 0/4 |
| 8 | LC 415 字符串相加 | 13 | 04 基线 | 1/4 |
| 9 | LC 22 括号生成 | 7 | 04 基线 | 2/4 |

## 其他来源新增题

| 题目 | 发现来源 |
|------|----------|
| LC 45 跳跃游戏 II | 华为、Hot 100 综合榜 |
| LC 49 字母异位词分组 | Hot 100 综合榜 |
| LC 51 N 皇后 | Hot 100 综合榜 |
| LC 55 跳跃游戏 | 华为 |
| LC 84 柱状图中最大的矩形 | Hot 100 综合榜 |
| LC 93 复原 IP 地址 | 华为、美团 |
| LC 128 最长连续序列 | 美团 |
| LC 131 分割回文串 | Hot 100 综合榜 |
| LC 136 只出现一次的数字 | 华为、Hot 100 综合榜 |
| LC 155 最小栈 | 华为、Hot 100 综合榜 |
| LC 224 基本计算器 | 腾讯 |
| LC 231 2 的幂 | 腾讯 |
| LC 326 3 的幂 | 美团 |
| LC 347 前 K 个高频元素 | 华为、腾讯、Hot 100 综合榜 |
| LC 394 字符串解码 | 华为、Hot 100 综合榜 |
| LC 406 根据身高重建队列 | 华为 |
| LC 451 根据字符出现频率排序 | 华为 |
| LC 470 用 Rand7() 实现 Rand10() | 腾讯 |
| LC 703 数据流中的第 K 大元素 | 华为 |
| LC 739 每日温度 | 华为 |
| LC 763 划分字母区间 | 华为、Hot 100 综合榜 |

## 题解与追问重点

- LC 1 必须比较暴力枚举、一次遍历哈希表和排序加双指针；若排序，必须处理原下标恢复。
- LC 1 与第四类的 LC 15 组成专题，统一解释补数查找、排序条件和去重策略。
- LC 146 必须手写哈希表加双向链表，禁止用有序字典代替核心实现，并覆盖更新已有键、容量为一和淘汰尾节点。
- LC 215 在本类重点维护最小堆解法；快速选择与排序解法在第六类交叉维护。
- 单调栈题要明确栈内保存值还是下标、单调方向及元素出栈时结算的含义。
- 回溯题统一维护选择、约束、递归和撤销选择，并说明剪枝条件。
- 设计题必须给出操作复杂度表，并解释多个数据结构如何协同保持复杂度承诺。

## LC 146 LRU 缓存

**考频与考点**　字节 72 次，其他统计覆盖 4/4。设计题核心是用哈希表实现 `O(1)` 定位，用双向链表实现 `O(1)` 的访问顺序调整与淘汰。

**写代码前确认**　`get` 命中和 `put` 更新已有键都算一次访问；容量为正；淘汰的是最久未使用项而非最早插入项。

**思路与解法**

哈希表保存 `key -> node`。双向链表使用两个哨兵：越靠近头部越新，越靠近尾部越旧。每次命中先摘下结点再移到头部；插入新键后若超容量，删除尾哨兵之前的结点，并同步删除哈希映射。不能用普通单链表，因为已知结点时仍无法 `O(1)` 找到其前驱。

```python
class Node:
    def __init__(self, key=0, value=0):
        self.key = key
        self.value = value
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.head = Node()  # 最近使用端哨兵
        self.tail = Node()  # 最久未使用端哨兵
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_first(self, node):
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node

    def _make_recent(self, node):
        self._remove(node)
        self._add_first(node)

    def get(self, key):
        node = self.cache.get(key)
        if node is None:
            return -1
        self._make_recent(node)
        return node.value

    def put(self, key, value):
        node = self.cache.get(key)
        if node is not None:
            node.value = value
            self._make_recent(node)
            return

        node = Node(key, value)
        self.cache[key] = node
        self._add_first(node)
        if len(self.cache) > self.capacity:
            oldest = self.tail.prev
            self._remove(oldest)
            del self.cache[oldest.key]
```

**复杂度**　`get`、`put` 均为平均 `O(1)`；存储至多 `capacity` 个有效结点，空间 `O(capacity)`。

**边界与易错点**　更新已有键不能增加容量；淘汰后必须同时删哈希表；容量为 1 时哨兵可避免头尾特判；结点中必须保存 `key`，才能淘汰时删除映射。

**面试追问**　若要求并发安全如何加锁或分片？怎样实现带过期时间的 LRU？LFU 需要增加哪些结构？操作复杂度为何能保持 `O(1)`？

## LC 215 数组中的第 K 个最大元素

**考频与考点**　字节 64 次，其他统计覆盖 4/4。本类重点考查固定大小最小堆；快速选择与排序解法在第六类交叉维护。

**写代码前确认**　第 `k` 大按排序后的位置计算，重复元素分别占位；输入通常保证 `1 <= k <= n`；是否允许修改原数组会影响快速选择。

**思路与解法**

维护大小不超过 `k` 的最小堆，堆中始终保存当前最大的 `k` 个数，堆顶就是其中最小者，也即全局第 `k` 大。扫描后续元素时用 `heappushpop` 一次完成压入和弹出。相比整体排序的 `O(n log n)`，当 `k` 较小时堆更合适；快速选择平均 `O(n)`，但会修改数组且最坏 `O(n^2)`。

```python
import heapq


class Solution:
    def findKthLargest(self, nums, k):
        heap = nums[:k]
        heapq.heapify(heap)
        for value in nums[k:]:
            if value > heap[0]:
                heapq.heapreplace(heap, value)
        return heap[0]
```

**复杂度**　建堆 `O(k)`，其余元素至多各调整一次，时间 `O(n log k)`，额外空间 `O(k)`。

**边界与易错点**　第 `k` 大应使用大小为 `k` 的最小堆，不是最大堆；重复值不能去重；`heapreplace` 仅在新值更大时调用。

**面试追问**　数据流场景为什么只能优先考虑堆？快速选择如何随机化主元？若求第 `k` 小如何改？为什么堆顶最终一定是答案？

## LC 20 有效的括号

**考频与考点**　字节 36 次，其他统计覆盖 3/4。考查栈的后进先出特性与字符映射。

**写代码前确认**　输入只包含三类括号；空串通常有效；括号必须按类型和嵌套顺序匹配。

**思路与解法**

遇到左括号就把“期望的右括号”压栈，遇到右括号时必须与栈顶一致。保存期望字符比保存左括号少一次反向映射。结束时栈也必须为空。

```python
class Solution:
    def isValid(self, s):
        expected = {"(": ")", "[": "]", "{": "}"}
        stack = []
        for ch in s:
            if ch in expected:
                stack.append(expected[ch])
            elif not stack or stack.pop() != ch:
                return False
        return not stack
```

**复杂度**　时间 `O(n)`，最坏空间 `O(n)`。

**边界与易错点**　右括号到来时先判断空栈；扫描结束后不能只返回 `True`；只统计数量无法识别 `([)]` 这类错误顺序。

**面试追问**　若字符串包含普通字符是否忽略？如何返回第一个错误位置？为什么此问题不能仅用三个计数器解决？

## LC 1 两数之和

**考频与考点**　字节 17 次，其他统计覆盖 3/4。与 LC 15 共同构成哈希表和双指针对照专题：哈希表用空间换取补数的常数时间查找，双指针依赖有序性。

**写代码前确认**　要求返回原数组下标而非数值；同一元素不能使用两次；通常保证恰有一个答案。若输出所有不重复数值对，去重规则会不同。

**思路与解法**

1. 暴力枚举所有下标对，时间 `O(n^2)`，是复杂度比较基线。
2. 一次遍历哈希表：处理 `nums[i]` 时，只查询此前出现的 `target-nums[i]`，因此不会复用当前元素；命中即返回原下标。这是返回下标问题的首选。
3. 排序加双指针：先保存 `(值, 原下标)` 再排序，从两端按和的大小收缩。时间 `O(n log n)`，若只排序数值会丢失原下标；当输入本来有序或题目要求返回数值对时更有优势。

```python
class Solution:
    def twoSum(self, nums, target):
        index_of = {}
        for i, value in enumerate(nums):
            need = target - value
            if need in index_of:
                return [index_of[need], i]
            index_of[value] = i

    def twoSumBruteForce(self, nums, target):
        for i in range(len(nums)):
            for j in range(i + 1, len(nums)):
                if nums[i] + nums[j] == target:
                    return [i, j]

    def twoSumWithTwoPointers(self, nums, target):
        pairs = sorted((value, i) for i, value in enumerate(nums))
        left, right = 0, len(pairs) - 1
        while left < right:
            total = pairs[left][0] + pairs[right][0]
            if total == target:
                return [pairs[left][1], pairs[right][1]]
            if total < target:
                left += 1
            else:
                right -= 1
```

**复杂度**　暴力为 `O(n^2)` 时间、`O(1)` 空间；哈希为平均 `O(n)` 时间、`O(n)` 空间；排序双指针为 `O(n log n)` 时间、`O(n)` 空间以保留原下标。

**边界与易错点**　必须先查补数再写入当前值，否则 `target = 2*x` 时可能复用同一位置；不能用 `if index_of.get(need)` 判断，因为下标 0 为假值；重复数值应由下标区分。

**面试追问**　数组有序时如何做到 `O(1)` 额外空间？如何返回所有不重复数值对？若数据持续到来怎样实时判断？LC 15 为什么标准答案更偏向排序双指针而不是哈希？

## LC 46 全排列

**考频与考点**　字节 16 次，其他统计覆盖 2/4。考查回溯的选择、约束、递归和撤销选择。

**写代码前确认**　标准题中元素互不相同；输出所有排列，顺序通常不限；若有重复元素，需要排序并增加同层去重。

**思路与解法**

路径长度等于 `n` 时得到一个排列。每层尝试一个尚未使用的下标，加入路径并标记，递归返回后恢复标记和路径。原地交换也能避免 `used` 数组，但会修改输入顺序。

```python
class Solution:
    def permute(self, nums):
        answer, path = [], []
        used = [False] * len(nums)

        def backtrack():
            if len(path) == len(nums):
                answer.append(path[:])
                return
            for i, value in enumerate(nums):
                if used[i]:
                    continue
                used[i] = True
                path.append(value)
                backtrack()
                path.pop()
                used[i] = False

        backtrack()
        return answer
```

**复杂度**　共有 `n!` 个结果，每次复制长度 `n`，时间 `O(n*n!)`，递归与路径空间 `O(n)`，不计输出。

**边界与易错点**　加入答案时必须复制 `path`；标记的是下标而非值；递归返回后撤销顺序要完整。

**面试追问**　含重复元素时如何剪枝？怎样用交换法实现？如何求字典序的下一个排列而不枚举全部结果？

## LC 165 比较版本号

**考频与考点**　字节 16 次，其他统计覆盖 1/4。考查字符串分段、前导零和不同段数的对齐。

**写代码前确认**　修订号只含数字且可能有前导零；缺失段等价于 0；返回 `-1/0/1`。超长修订号在不支持大整数的语言中要避免直接转换。

**思路与解法**

按点分割后逐段比较，循环次数取两边段数最大值，缺失段补 0。Python 整数不限固定宽度，可安全使用 `int`。若追问常数额外空间，可用两个指针逐段解析。

```python
class Solution:
    def compareVersion(self, version1, version2):
        parts1 = version1.split(".")
        parts2 = version2.split(".")
        for i in range(max(len(parts1), len(parts2))):
            x = int(parts1[i]) if i < len(parts1) else 0
            y = int(parts2[i]) if i < len(parts2) else 0
            if x < y:
                return -1
            if x > y:
                return 1
        return 0
```

**复杂度**　设输入总长度为 `n`，时间 `O(n)`，分割数组空间 `O(n)`；双指针解析可降至 `O(1)` 额外空间。

**边界与易错点**　不能按字符串字典序比较，如 `"10" > "2"` 的数值关系与字典序相反；尾部零段不影响结果；不要假设两边段数相同。

**面试追问**　不用 `split` 如何解析？修订号可能有百万位数字时如何比较？语义化版本中的预发布标识为何不能沿用此规则？

## LC 232 用栈实现队列

**考频与考点**　字节 14 次。考查两个后进先出结构如何组合成先进先出结构，以及均摊复杂度。

**写代码前确认**　允许使用两个栈；调用 `pop`、`peek` 时队列通常非空；需要说明单次最坏复杂度与均摊复杂度的区别。

**思路与解法**

`in_stack` 只负责接收新元素，`out_stack` 只负责提供队首。当 `out_stack` 为空时，才把 `in_stack` 全部倒入，使顺序反转。每个元素最多入、出两个栈各一次，因此操作均摊 `O(1)`。

```python
class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def push(self, x):
        self.in_stack.append(x)

    def _move_if_needed(self):
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())

    def pop(self):
        self._move_if_needed()
        return self.out_stack.pop()

    def peek(self):
        self._move_if_needed()
        return self.out_stack[-1]

    def empty(self):
        return not self.in_stack and not self.out_stack
```

**复杂度**　`push` 为 `O(1)`；`pop`、`peek` 单次最坏 `O(n)`、均摊 `O(1)`；空间 `O(n)`。

**边界与易错点**　`out_stack` 非空时不能搬运，否则会破坏旧元素顺序；判空要同时检查两个栈；不要在每次 `push` 时反复整体搬运。

**面试追问**　如何用队列实现栈？怎样用势能法解释均摊 `O(1)`？如果要求每次操作严格最坏 `O(1)`，需要怎样渐进搬运？

## LC 415 字符串相加

**考频与考点**　字节 13 次，其他统计覆盖 1/4。考查从低位到高位模拟加法和字符数字转换。

**写代码前确认**　输入是非负整数字符串，不能使用大整数库或直接转整数；结果不能有多余前导零。

**思路与解法**

两个指针从字符串末尾向前移动，缺失位视为 0；每轮用和的个位写入结果、十位作为进位。结果逆序产生，最后统一反转。该模板可直接推广到任意进制。

```python
class Solution:
    def addStrings(self, num1, num2):
        i, j = len(num1) - 1, len(num2) - 1
        carry = 0
        digits = []
        while i >= 0 or j >= 0 or carry:
            x = ord(num1[i]) - ord("0") if i >= 0 else 0
            y = ord(num2[j]) - ord("0") if j >= 0 else 0
            carry, digit = divmod(x + y + carry, 10)
            digits.append(chr(ord("0") + digit))
            i -= 1
            j -= 1
        return "".join(reversed(digits))
```

**复杂度**　时间 `O(max(m,n))`，结果数组空间 `O(max(m,n))`。

**边界与易错点**　循环条件必须包含最终进位；指针越界时该位为 0；不可在循环头提前丢弃较长字符串剩余部分。

**面试追问**　如何实现字符串减法并处理符号？如何支持任意进制？链表形式的两数相加与本题的遍历方向有何关系？

## LC 22 括号生成

**考频与考点**　字节 7 次，其他统计覆盖 2/4。考查生成型回溯及用约束保证只搜索合法前缀。

**写代码前确认**　生成 `n` 对圆括号的全部合法组合；输出顺序不限；`n = 0` 时数学上结果通常包含空串。

**思路与解法**

状态记录已使用的左右括号数。只要左括号未满就可添加；只有 `right < left` 时才能添加右括号，从而保证任意前缀中右括号不多于左括号。相比生成全部 `2^(2n)` 个串再校验，剪枝直接排除非法前缀。

```python
class Solution:
    def generateParenthesis(self, n):
        answer, path = [], []

        def backtrack(left, right):
            if len(path) == 2 * n:
                answer.append("".join(path))
                return
            if left < n:
                path.append("(")
                backtrack(left + 1, right)
                path.pop()
            if right < left:
                path.append(")")
                backtrack(left, right + 1)
                path.pop()

        backtrack(0, 0)
        return answer
```

**复杂度**　合法结果数为第 `n` 个卡特兰数 `C_n`，生成和复制结果的时间为 `O(n*C_n)`；递归路径空间 `O(n)`，不计输出。

**边界与易错点**　右括号条件是 `right < left`；加入答案时要复制或拼接当前路径；不能把 LC 20 的事后校验当作主要剪枝。

**面试追问**　如何计算合法组合数量？怎样扩展到多种括号且要求正确嵌套？如何按字典序生成第 `k` 个合法串？

## LC 45 跳跃游戏 II

**考频与考点**　新增来源为华为、Hot 100 综合榜。考查贪心分层和最少步数证明。

**写代码前确认**　通常保证能到达最后位置；`nums[i]` 是从位置 `i` 最远可跳距离；长度为 1 时答案为 0。

**思路与解法**

把一次跳跃能够到达的下标看作 BFS 的一层。扫描当前层 `[0, current_end]` 时，持续更新下一层最远边界 `farthest`；扫描到 `current_end` 才增加一次跳跃并扩展边界。无需真的保存图或队列。

```python
class Solution:
    def jump(self, nums):
        jumps = 0
        current_end = 0
        farthest = 0
        for i in range(len(nums) - 1):
            farthest = max(farthest, i + nums[i])
            if i == current_end:
                jumps += 1
                current_end = farthest
        return jumps
```

**复杂度**　时间 `O(n)`，额外空间 `O(1)`；动态规划基线为 `O(n^2)` 时间。

**边界与易错点**　循环只到倒数第二个位置，避免到达终点后多计一步；不能在每次更新最远距离时都增加步数；若输入不保证可达，应在扩层时检查 `farthest == current_end`。

**面试追问**　为什么局部选择最远边界不会错过更少步数？如何输出一条最短跳跃路径？与 LC 55 的状态含义有何不同？

## LC 49 字母异位词分组

**考频与考点**　新增来源为 Hot 100 综合榜。考查为等价类设计稳定哈希键。

**写代码前确认**　字符串通常只含小写英文字母；输出分组和组内顺序不限；空字符串的签名应合法。

**思路与解法**

异位词具有相同字符计数。对每个字符串构造长度 26 的计数元组作为哈希键，把原串加入对应列表。另一种写法用排序后字符串作键，代码更短，但每个长度为 `k` 的字符串需 `O(k log k)`。

```python
from collections import defaultdict


class Solution:
    def groupAnagrams(self, strs):
        groups = defaultdict(list)
        for word in strs:
            counts = [0] * 26
            for ch in word:
                counts[ord(ch) - ord("a")] += 1
            groups[tuple(counts)].append(word)
        return list(groups.values())
```

**复杂度**　设所有字符总数为 `N`，固定字符集计数法时间 `O(N)`，哈希表及输出空间 `O(N)`。

**边界与易错点**　列表不可哈希，必须转换为元组；不能用字符集合做键，因为它会丢失次数；若字符集不限于小写字母，应改用排序键或规范化计数字典。

**面试追问**　Unicode 字符如何设计键？海量字符串无法全部放内存时怎样外排分组？计数键和排序键分别适合什么字符集？

## LC 51 N 皇后

**考频与考点**　新增来源为 Hot 100 综合榜。考查回溯、列与两类对角线约束，以及剪枝状态的维护。

**写代码前确认**　每行恰放一个皇后；返回所有棋盘；主对角线可用 `row-col` 标识，副对角线可用 `row+col` 标识。

**思路与解法**

按行递归，每行尝试尚未被列集合、主对角线集合、副对角线集合占用的位置。选择后同时加入三个集合，递归返回时完整撤销。按行放置天然满足同行不冲突。

```python
class Solution:
    def solveNQueens(self, n):
        answer = []
        board = [["."] * n for _ in range(n)]
        cols, diag1, diag2 = set(), set(), set()

        def backtrack(row):
            if row == n:
                answer.append(["".join(line) for line in board])
                return
            for col in range(n):
                d1, d2 = row - col, row + col
                if col in cols or d1 in diag1 or d2 in diag2:
                    continue
                cols.add(col)
                diag1.add(d1)
                diag2.add(d2)
                board[row][col] = "Q"
                backtrack(row + 1)
                board[row][col] = "."
                cols.remove(col)
                diag1.remove(d1)
                diag2.remove(d2)

        backtrack(0)
        return answer
```

**复杂度**　搜索树结点数的常用上界为 `O(n!)`，当前实现会在每个非叶结点扫描 `n` 列；设方案数为 `S`，每个棋盘快照还需 `O(n^2)` 时间，因此总时间上界写作 `O(n*n! + S*n^2)` 更完整。三个约束集合和递归路径为 `O(n)`，工作棋盘为 `O(n^2)`；输出空间为 `O(S*n^2)`。

**边界与易错点**　对角线标识不能写反后混用；三个约束都要撤销；保存答案时要构造字符串快照，不能保存同一个可变棋盘引用。

**面试追问**　只统计方案数怎样省去棋盘？如何用位运算表示三类约束？为什么逐行搜索已隐含“每行一个”的约束？

## LC 55 跳跃游戏

**考频与考点**　新增来源为华为。考查可达性贪心和不变量。

**写代码前确认**　判断能否到达最后下标，不要求最少步数；元素非负；起点固定为下标 0。

**思路与解法**

维护从已确认可达的位置能够覆盖的最远下标 `farthest`。扫描到 `i` 时，若 `i > farthest`，说明中间出现不可跨越的断点；否则用 `i + nums[i]` 扩展覆盖。动态规划可令 `dp[i]` 表示是否可达，但空间和转移都没有必要。

```python
class Solution:
    def canJump(self, nums):
        farthest = 0
        for i, step in enumerate(nums):
            if i > farthest:
                return False
            farthest = max(farthest, i + step)
            if farthest >= len(nums) - 1:
                return True
        return True
```

**复杂度**　时间 `O(n)`，额外空间 `O(1)`。

**边界与易错点**　只有可达位置才能扩展最远边界；中间的 0 不一定导致失败；长度为 1 时无需跳跃即可到达。

**面试追问**　从终点反向贪心如何写？怎样返回一条可行路径？为何 LC 45 需要“当前层边界”而本题只需最远边界？

## LC 84 柱状图中最大的矩形

**考频与考点**　新增来源为 Hot 100 综合榜。考查单调栈中保存下标、单调方向，以及元素出栈时结算面积。

**写代码前确认**　柱宽均为 1，高度非负；矩形必须覆盖连续柱；相等高度应采用一致的入栈或弹栈规则。

**思路与解法**

维护高度单调不减的下标栈，并在两端使用高度 0 的哨兵。遇到更矮柱时，弹出的下标 `mid` 对应高度已确定右侧第一个更矮位置 `i`，弹栈后的新栈顶是左侧第一个更矮位置，因此宽度为 `i-stack[-1]-1`。每根柱只入栈、出栈一次。

```python
class Solution:
    def largestRectangleArea(self, heights):
        values = [0] + heights + [0]
        stack = []
        answer = 0
        for i, height in enumerate(values):
            while stack and values[stack[-1]] > height:
                mid = stack.pop()
                width = i - stack[-1] - 1
                answer = max(answer, values[mid] * width)
            stack.append(i)
        return answer
```

**复杂度**　时间 `O(n)`，栈空间 `O(n)`；逐柱向两侧扩展的基线最坏为 `O(n^2)`。

**边界与易错点**　栈内保存下标而非高度；面积在出栈时结算；左边界是弹栈后的栈顶；末尾哨兵用于清空仍未结算的柱。

**面试追问**　为何可以在出栈时确定最大宽度？相等高度用 `>` 或 `>=` 有何差别？如何扩展到最大矩形矩阵？

## LC 93 复原 IP 地址

**考频与考点**　新增来源为华为、美团。考查定长分段回溯与前导零剪枝。

**写代码前确认**　必须切成恰好 4 段，每段范围 `0..255`；除单独的 `0` 外不能有前导零；输入只含数字。

**思路与解法**

递归状态为当前位置和已选段。每段只尝试长度 1 到 3；选段前检查剩余字符数是否能填满剩余段，即是否位于 `[remaining_parts, 3*remaining_parts]`。遇到前导零时只允许长度 1。

```python
class Solution:
    def restoreIpAddresses(self, s):
        answer, parts = [], []

        def backtrack(start):
            remaining_parts = 4 - len(parts)
            remaining_chars = len(s) - start
            if remaining_chars < remaining_parts or remaining_chars > 3 * remaining_parts:
                return
            if len(parts) == 4:
                if start == len(s):
                    answer.append(".".join(parts))
                return

            for end in range(start + 1, min(start + 3, len(s)) + 1):
                segment = s[start:end]
                if len(segment) > 1 and segment[0] == "0":
                    break
                if int(segment) > 255:
                    break
                parts.append(segment)
                backtrack(end)
                parts.pop()

        backtrack(0)
        return answer
```

**复杂度**　IP 固定 4 段、每段至多 3 种长度，搜索规模有常数上界；按一般输入长度记，校验与构造可视为 `O(n)`，递归空间 `O(1)`（固定深度）。

**边界与易错点**　`"0"` 合法而 `"00"` 不合法；段数够 4 后必须同时耗尽字符串；超过 255 后更长前缀也必然无效，可直接停止。

**面试追问**　若分成 `k` 段且每段长度、范围可配置，复杂度如何表示？怎样只判断是否存在合法切分？IPv6 的规则为何不能直接复用？

## LC 128 最长连续序列

**考频与考点**　新增来源为美团。考查哈希集合如何把无序数组的连续性搜索优化到线性时间。

**写代码前确认**　连续指整数值相差 1，与原数组位置无关；重复元素不增加长度；要求期望 `O(n)` 时间。

**思路与解法**

把所有值放入集合。只从不存在前驱 `x-1` 的值开始向右扩展，因为它必然是一段连续序列的起点；非起点直接跳过。每个不同值只会在所属序列的扩展中被访问一次。排序法更直观，但需要 `O(n log n)`。

```python
class Solution:
    def longestConsecutive(self, nums):
        values = set(nums)
        answer = 0
        for value in values:
            if value - 1 in values:
                continue
            end = value
            while end + 1 in values:
                end += 1
            answer = max(answer, end - value + 1)
        return answer
```

**复杂度**　期望时间 `O(n)`，集合空间 `O(n)`。

**边界与易错点**　必须只从序列起点扩展，否则连续长段会被反复扫描到 `O(n^2)`；遍历集合可自然去重；空数组答案为 0。

**面试追问**　如何返回最长序列本身？并查集能否解决，代价是什么？哈希表极端冲突时复杂度如何变化？

## LC 131 分割回文串

**考频与考点**　新增来源为 Hot 100 综合榜。考查字符串切分回溯、回文判断和预处理优化。

**写代码前确认**　需要返回所有切分方案，每个片段都必须是非空回文串；输出顺序不限；空串的约定通常是一种空切分。

**思路与解法**

从 `start` 开始枚举当前片段终点，只有片段为回文时才选择并递归。直接双指针判断每个片段会重复扫描；先用动态规划预处理 `palindrome[i][j]`，其中两端字符相同且内部长度不超过 1 或内部也是回文，即可将每次判断降为 `O(1)`。

```python
class Solution:
    def partition(self, s):
        n = len(s)
        palindrome = [[False] * n for _ in range(n)]
        for i in range(n - 1, -1, -1):
            for j in range(i, n):
                palindrome[i][j] = (
                    s[i] == s[j]
                    and (j - i <= 1 or palindrome[i + 1][j - 1])
                )

        answer, path = [], []

        def backtrack(start):
            if start == n:
                answer.append(path[:])
                return
            for end in range(start, n):
                if not palindrome[start][end]:
                    continue
                path.append(s[start:end + 1])
                backtrack(end + 1)
                path.pop()

        backtrack(0)
        return answer
```

**复杂度**　预处理 `O(n^2)` 时间和空间；切分方案最坏为 `2^(n-1)` 个，包含结果复制时总时间为 `O(n*2^n)` 量级。

**边界与易错点**　终点下标与切片右端点相差 1；保存方案时必须复制路径；DP 要按 `i` 递减计算，确保内部状态已知。

**面试追问**　如何求最少切割次数？不用 `O(n^2)` 预处理怎样写？能否只统计方案数而不枚举结果？

## LC 136 只出现一次的数字

**考频与考点**　新增来源为华为、Hot 100 综合榜。考查异或的交换律、自反性和零元性质。

**写代码前确认**　除一个元素出现一次外，其余元素恰好出现两次；要求线性时间和常数额外空间。

**思路与解法**

将所有数异或。由于 `x ^ x = 0`、`x ^ 0 = x`，成对元素与遍历顺序无关地抵消，最终只剩单独元素。哈希计数也能做，但需要 `O(n)` 空间；求和公式可能溢出且仍依赖去重集合。

```python
class Solution:
    def singleNumber(self, nums):
        answer = 0
        for value in nums:
            answer ^= value
        return answer
```

**复杂度**　时间 `O(n)`，额外空间 `O(1)`。

**边界与易错点**　异或适用于整数位模式，包括负数；不能用逻辑异或替代按位异或；前提必须是其他元素都恰好出现两次。

**面试追问**　其余元素出现三次时如何按位计数？有两个元素各出现一次时如何用最低有效差异位分组？为什么异或顺序不影响结果？

## LC 155 最小栈

**考频与考点**　新增来源为华为、Hot 100 综合榜。考查用辅助状态为设计题维持所有操作 `O(1)`。

**写代码前确认**　`push`、`pop`、`top`、`getMin` 都要 `O(1)`；查询和弹出通常只在非空栈调用；重复最小值必须正确处理。

**思路与解法**

每次压入二元组 `(当前值, 压入后栈内最小值)`。这样弹出时，对应历史最小值会同步恢复。也可维护独立最小栈，但新值等于当前最小时也必须压入，否则弹出一个重复最小值后状态会错误。

```python
class MinStack:
    def __init__(self):
        self.stack = []

    def push(self, val):
        current_min = val if not self.stack else min(val, self.stack[-1][1])
        self.stack.append((val, current_min))

    def pop(self):
        self.stack.pop()

    def top(self):
        return self.stack[-1][0]

    def getMin(self):
        return self.stack[-1][1]
```

**复杂度**　四个操作均为 `O(1)` 时间，存储 `n` 个元素需要 `O(n)` 空间。

**边界与易错点**　重复最小值不能只记录一次；`pop` 后不需要重新扫描；若用差值编码压缩空间，要注意固定宽度整数溢出。

**面试追问**　如何同时支持 `getMax`？只用一个数值栈如何通过差值编码最小值？怎样设计支持 `getMin` 的队列？

## LC 224 基本计算器

**考频与考点**　新增来源为腾讯。考查表达式扫描、括号上下文和一元正负号。

**写代码前确认**　本题只含非负整数、`+`、`-`、括号和空格，不含乘除；表达式合法；负号既可能是二元减法，也可能是一元负号。

**思路与解法**

扫描时累积当前多位数 `number`，`sign` 表示它前面的符号。遇到运算符先把 `sign*number` 加入当前层结果。遇到左括号，把括号外的结果和符号压栈，并从新层开始；遇到右括号，先结算当前数字，再将括号内结果乘外层符号并加回外层结果。该状态机自然支持 `-(...)`。

```python
class Solution:
    def calculate(self, s):
        result = 0
        number = 0
        sign = 1
        stack = []

        for ch in s:
            if ch.isdigit():
                number = number * 10 + int(ch)
            elif ch in "+-":
                result += sign * number
                number = 0
                sign = 1 if ch == "+" else -1
            elif ch == "(":
                stack.append(result)
                stack.append(sign)
                result, sign = 0, 1
            elif ch == ")":
                result += sign * number
                number = 0
                outer_sign = stack.pop()
                outer_result = stack.pop()
                result = outer_result + outer_sign * result

        return result + sign * number
```

**复杂度**　时间 `O(n)`，括号栈空间 `O(d)`，其中 `d` 为嵌套深度。

**边界与易错点**　遇到运算符和右括号都要先结算已有数字；空格应忽略；多位数字不能逐字符立即结算；压栈和出栈的顺序必须对应。

**面试追问**　加入乘除后如何处理优先级？怎样用逆波兰表达式求值？递归下降解析器的文法和状态应如何设计？

## LC 231 2 的幂

**考频与考点**　新增来源为腾讯。考查二进制最低位性质。

**写代码前确认**　只有正整数可能是 2 的幂；0 和负数返回假；语言中的整数位宽和符号规则可能影响位运算解释。

**思路与解法**

正的 2 的幂二进制中恰有一个 1。`n-1` 会把该 1 变为 0，并把其低位全部变为 1，因此 `n & (n-1) == 0`。循环除以 2 也可做，但位运算直接表达核心性质。

```python
class Solution:
    def isPowerOfTwo(self, n):
        return n > 0 and (n & (n - 1)) == 0
```

**复杂度**　固定宽度整数下时间、空间均为 `O(1)`。

**边界与易错点**　必须先限制 `n > 0`，否则 0 会误判；位运算括号应写清；不要用浮点对数判断，精度可能造成误差。

**面试追问**　如何统计二进制中 1 的个数？如何取得最低位的 1？判断 4 的幂还需增加什么条件？

## LC 326 3 的幂

**考频与考点**　新增来源为美团。考查整除循环，以及不存在二进制单比特捷径时的替代思路。

**写代码前确认**　只有正整数可能是 3 的幂；输入位宽是否固定会影响“最大 3 的幂整除法”。

**思路与解法**

不断除以 3，若过程中出现不能整除则返回假，最终等于 1 即为 3 的幂。在 32 位有符号整数范围内，也可用最大 3 的幂 `3^19` 判断 `1162261467 % n == 0`，但该常量依赖输入范围，不如循环通用。

```python
class Solution:
    def isPowerOfThree(self, n):
        if n <= 0:
            return False
        while n % 3 == 0:
            n //= 3
        return n == 1
```

**复杂度**　时间 `O(log_3 n)`，额外空间 `O(1)`；固定 32 位最大幂整除法为 `O(1)`。

**边界与易错点**　`n = 1` 是 `3^0`，应返回真；必须使用整数除法；浮点 `log` 方案有精度风险。

**面试追问**　为何最大 3 的幂能被所有较小 3 的幂整除？该技巧为何要求底数为质数？如何统一判断任意正整数是否为 `k` 的幂？

## LC 347 前 K 个高频元素

**考频与考点**　新增来源为华为、腾讯、Hot 100 综合榜。考查计数哈希、固定大小堆和桶排序。

**写代码前确认**　返回元素而非频次；答案顺序通常不限；保证恰有足够元素且第 `k` 位不存在需要消解的歧义。

**思路与解法**

先用哈希表统计频次，再维护大小为 `k` 的最小堆 `(频次, 元素)`；堆顶是当前候选中频次最低者。若追求线性时间，可建立下标为频次的桶，从高频到低频收集 `k` 个元素，代价是 `O(n)` 额外桶空间。

```python
from collections import Counter
import heapq


class Solution:
    def topKFrequent(self, nums, k):
        counts = Counter(nums)
        heap = []
        for value, frequency in counts.items():
            if len(heap) < k:
                heapq.heappush(heap, (frequency, value))
            elif frequency > heap[0][0]:
                heapq.heapreplace(heap, (frequency, value))
        return [value for _, value in heap]
```

**复杂度**　设不同元素数为 `m`，堆解法时间 `O(n + m log k)`、空间 `O(m+k)`（计数表占 `O(m)`）；桶排序时间 `O(n)`、空间 `O(n)`。

**边界与易错点**　堆按频次排序，不能直接对元素建堆；结果无需按频次有序；与 LC 215 不同，本题先聚合频次再选前 `k`。

**面试追问**　如何按频次降序输出？数据流中如何近似统计 Top K？桶排序为什么最多只需 `n+1` 个桶？

## LC 394 字符串解码

**考频与考点**　新增来源为华为、Hot 100 综合榜。考查栈处理嵌套结构、多位重复次数和局部状态恢复。

**写代码前确认**　编码格式合法，重复次数位于方括号之前且可能为多位数；普通字母可连续出现；需要返回完全展开的字符串。

**思路与解法**

扫描时维护当前层的重复次数 `number` 和已解码字符列表 `current`。遇到 `[`，把外层列表和次数一起压栈，开始新的内层；遇到 `]`，弹出外层状态并拼接 `current` 的重复结果。也可递归解析，但显式栈更容易展示状态。

```python
class Solution:
    def decodeString(self, s):
        stack = []
        current = []
        number = 0

        for ch in s:
            if ch.isdigit():
                number = number * 10 + int(ch)
            elif ch == "[":
                stack.append((current, number))
                current = []
                number = 0
            elif ch == "]":
                previous, repeat = stack.pop()
                current = previous + current * repeat
            else:
                current.append(ch)
        return "".join(current)
```

**复杂度**　设编码串长度为 `n`、最终输出长度为 `L`、嵌套深度为 `d`。列表拼接的时间等于各次 `]` 产生的中间列表长度之和，最坏为 `O(n*L)`；例如多层重复次数为 1 的嵌套会反复复制同一段内容。最终结果占 `O(L)` 空间，栈另占 `O(d)` 个状态，处理中间列表的峰值空间为 `O(n+L)`。

**边界与易错点**　重复次数可能超过一位；进入新层后要清零 `number`；栈中必须同时保存外层内容和次数；复杂度不能只按编码串长度计算。

**面试追问**　如何写递归下降版本？若展开结果可能极大，怎样流式输出或只求长度？如何检测非法括号和缺失次数？

## LC 406 根据身高重建队列

**考频与考点**　新增来源为华为。考查排序规则设计和贪心插入不变量。

**写代码前确认**　每个人表示为 `[height, k]`，`k` 是排在其前面且身高不低于他的人数；输入保证存在合法答案。

**思路与解法**

先按身高降序、同身高按 `k` 升序排序。依次处理时，结果中已有的人都不矮于当前人，因此把当前人插入下标 `k`，其前面恰有 `k` 个不矮者。后续插入的更矮者不会破坏这一条件。

```python
class Solution:
    def reconstructQueue(self, people):
        people.sort(key=lambda person: (-person[0], person[1]))
        queue = []
        for person in people:
            queue.insert(person[1], person)
        return queue
```

**复杂度**　排序 `O(n log n)`，数组中间插入总计 `O(n^2)`，空间 `O(n)`（返回结果）。使用支持按秩插入的数据结构可进一步优化插入。

**边界与易错点**　同身高必须按 `k` 升序；若改为身高升序，需要从空位置角度设计完全不同的策略；不要把 `k` 理解为所有更高者数量。

**面试追问**　为什么后插入的矮个子不影响已处理的人？如何用树状数组在空位上重建？若同身高排序规则反过来会发生什么？

## LC 451 根据字符出现频率排序

**考频与考点**　新增来源为华为。考查频次哈希与按频次桶排序。

**写代码前确认**　字符大小写敏感；相同频次的相对顺序通常不限；输出必须包含原字符串的全部字符。

**思路与解法**

哈希统计每个字符次数。频次最大不超过字符串长度 `n`，因此可建立 `n+1` 个桶，把字符放入对应频次下标，再从高到低输出 `字符 * 次数`。按哈希项排序也可做，时间为 `O(m log m)`，其中 `m` 是不同字符数。

```python
from collections import Counter


class Solution:
    def frequencySort(self, s):
        counts = Counter(s)
        buckets = [[] for _ in range(len(s) + 1)]
        for ch, frequency in counts.items():
            buckets[frequency].append(ch)

        answer = []
        for frequency in range(len(s), 0, -1):
            for ch in buckets[frequency]:
                answer.append(ch * frequency)
        return "".join(answer)
```

**复杂度**　桶排序时间 `O(n)`，空间 `O(n)`；比较排序方案时间 `O(n + m log m)`。

**边界与易错点**　桶下标是频次而不是字符码；相同频次无需额外稳定排序，除非题目明确要求；空串应返回空串。

**面试追问**　若要求同频字符按字典序排列如何改？字符种类极多但字符串很短时桶和堆如何选择？怎样原地处理可变字符数组？

## LC 470 用 Rand7() 实现 Rand10()

**考频与考点**　新增来源为腾讯。考查等概率样本空间构造和拒绝采样。

**写代码前确认**　`rand7()` 独立且均匀返回 `1..7`；目标是每个 `1..10` 概率相同，不能用取模直接处理 7 或 49 个非整倍数状态。

**思路与解法**

两次调用可等概率生成 `1..49`：`(rand7()-1)*7 + rand7()`。接受前 40 个状态并映射为 `1..10`，其余 9 个状态拒绝后重采样。因为 40 是 10 的整数倍，每个结果恰对应 4 个等概率状态。

```python
class Solution:
    def rand10(self):
        while True:
            sample = (rand7() - 1) * 7 + rand7()
            if sample <= 40:
                return 1 + (sample - 1) % 10
```

**复杂度**　每轮接受概率为 `40/49`，期望轮数为 `49/40`，因此期望时间 `O(1)`、空间 `O(1)`；最坏调用次数没有有限上界。

**边界与易错点**　`rand7()+rand7()` 不是均匀分布；直接对 `1..49` 取模会产生偏差；应先减 1 映射到从 0 开始的等概率编号。

**面试追问**　如何回收被拒绝的 9 个状态以减少期望调用次数？怎样用 `RandM` 构造 `RandN`？如何证明拒绝后重新采样不会引入偏差？

## LC 703 数据流中的第 K 大元素

**考频与考点**　新增来源为华为。考查固定大小最小堆在在线数据中的应用。

**写代码前确认**　初始化数组也属于数据流已有元素；每次 `add` 后至少有 `k` 个元素可供定义第 `k` 大；重复元素分别占位。

**思路与解法**

维护大小不超过 `k` 的最小堆，保存目前最大的 `k` 个元素。加入新值后先压堆，若大小超过 `k` 就弹出最小值，堆顶始终为第 `k` 大。初始化时可先建全部元素的堆再缩小，也可逐个调用同一逻辑。

```python
import heapq


class KthLargest:
    def __init__(self, k, nums):
        self.k = k
        self.heap = []
        for value in nums:
            self._push(value)

    def _push(self, value):
        heapq.heappush(self.heap, value)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)

    def add(self, val):
        self._push(val)
        return self.heap[0]
```

**复杂度**　初始化 `n` 个数为 `O(n log k)`，每次 `add` 为 `O(log k)`，空间 `O(k)`；批量初始化也可优化为 `O(n + (n-k) log n)` 等实现。

**边界与易错点**　使用最小堆而非最大堆；堆只保留 `k` 个候选；负数和重复值不需特殊处理；不能每次重新排序全部历史数据。

**面试追问**　与 LC 215 的离线快速选择相比，为何数据流更适合堆？若 `k` 动态变化如何设计？如何支持删除任意历史元素？

## LC 739 每日温度

**考频与考点**　新增来源为华为。考查单调栈保存下标，以及元素出栈时确定右侧第一个更大值。

**写代码前确认**　要返回等待天数而不是更高温度；必须严格更高，相等温度不能结算；没有更高温度的位置保持 0。

**思路与解法**

维护尚未找到更高温度的下标栈，栈内对应温度单调不增。当前温度高于栈顶温度时，当前下标就是栈顶位置右侧第一个更高温度，弹出并写入距离；随后把当前下标压栈。

```python
class Solution:
    def dailyTemperatures(self, temperatures):
        answer = [0] * len(temperatures)
        stack = []
        for i, temperature in enumerate(temperatures):
            while stack and temperatures[stack[-1]] < temperature:
                previous = stack.pop()
                answer[previous] = i - previous
            stack.append(i)
        return answer
```

**复杂度**　每个下标至多入栈、出栈一次，时间 `O(n)`，栈空间 `O(n)`。

**边界与易错点**　栈中保存下标才能计算天数；相等温度不能弹出；未出栈位置答案保持初始化的 0。

**面试追问**　如何求右侧第一个更大元素的值或下标？循环数组版本如何处理？为什么总时间不是嵌套循环表面上的 `O(n^2)`？

## LC 763 划分字母区间

**考频与考点**　新增来源为华为、Hot 100 综合榜。考查最后出现位置哈希与区间贪心。

**写代码前确认**　每个字母最多出现在一个片段中；目标是片段数尽可能多；返回各片段长度而非字符串本身。

**思路与解法**

先记录每个字符最后出现位置。扫描一个片段时，当前字符的最后位置可能把片段右边界扩展得更远；当下标到达动态右边界，说明片段中出现过的所有字符都不会在后面再出现，此时立即切分可得到最多片段。

```python
class Solution:
    def partitionLabels(self, s):
        last = {ch: i for i, ch in enumerate(s)}
        answer = []
        start = end = 0
        for i, ch in enumerate(s):
            end = max(end, last[ch])
            if i == end:
                answer.append(end - start + 1)
                start = i + 1
        return answer
```

**复杂度**　时间 `O(n)`；哈希表空间为 `O(u)`，`u` 是不同字符数，小写字母条件下可视为 `O(1)`。

**边界与易错点**　边界要随片段内新字符持续扩展；长度为 `end-start+1`；在尚未到达右边界时切分会让某字符跨片段。

**面试追问**　如何从区间合并角度解释本题？若要求每个字符最多出现在两个片段中如何变化？为什么在首次可切位置立即切分具有最优性？
