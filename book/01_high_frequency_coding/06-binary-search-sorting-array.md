# 二分查找、排序与数组

本文件维护第一章第六类题目的题解与面试追问。数组题优先明确循环不变量，二分题必须固定区间定义，排序题需要说明稳定性、最坏复杂度和原地性。

## 字节核心题单

| 顺序 | 题目 | 字节频次 | 数据版本 | 其他统计覆盖 |
|------|------|----------|----------|--------------|
| 1 | LC 215 数组中的第 K 个最大元素 | 64 | 08 更新 | 4/4 |
| 2 | LC 56 合并区间 | 18 | 04 基线 | 3/4 |
| 3 | LC 33 搜索旋转排序数组 | 15 | 04 基线 | 3/4 |
| 4 | LC 34 在排序数组中查找元素的第一个和最后一个位置 | 12 | 04 基线 | 2/4 |
| 5 | LC 912 排序数组 | 11 | 04 基线 | 1/4 |
| 6 | LC 4 寻找两个正序数组的中位数 | 10 | 04 基线 | 1/4 |
| 7 | LC 75 颜色分类 | 8 | 04 基线 | 2/4 |
| 8 | LC 902 最大为 N 的数字组合 | 未单列 | 08 新增题 | 0/4 |

## 其他来源新增题

| 题目 | 发现来源 |
|------|----------|
| LC 35 搜索插入位置 | 华为、Hot 100 综合榜 |
| LC 54 螺旋矩阵 | 华为、腾讯、Hot 100 综合榜 |
| LC 73 矩阵置零 | Hot 100 综合榜 |
| LC 74 搜索二维矩阵 | Hot 100 综合榜 |
| LC 153 寻找旋转排序数组中的最小值 | 华为、腾讯、Hot 100 综合榜 |
| LC 169 多数元素 | 华为 |
| LC 238 除自身以外数组的乘积 | 华为、Hot 100 综合榜 |
| LC 240 搜索二维矩阵 II | 腾讯、Hot 100 综合榜 |
| LC 287 寻找重复数 | 华为、腾讯、Hot 100 综合榜 |
| LC 442 数组中重复的数据 | 腾讯 |
| LC 704 二分查找 | 华为、腾讯 |

## 题解与追问重点

- 二分题统一声明使用左闭右闭还是左闭右开区间，循环条件、边界更新和返回位置必须保持一致。
- LC 33、LC 153 和 LC 704 组成二分模板专题，比较普通有序数组与旋转数组中仍然成立的单调性。
- LC 215 在本类重点维护排序、快速选择和分区写法；最小堆解法在第五类交叉维护。
- LC 912 至少覆盖快速排序与归并排序，并讨论随机基准、最坏情况、稳定性和额外空间。
- 矩阵题要先写清行列边界和遍历不变量，避免靠补丁式条件修复越界。
- 原地数组题说明哪些输入信息被覆盖，以及如何利用下标、符号位或固定数量变量保存状态。

## LC 215 数组中的第 K 个最大元素

**考频与考点**：字节最高频题之一。重点考查排序基线、快速选择与分区不变量；最小堆解法在第五类题解中交叉维护。

**写代码前确认**：`k` 从 1 开始，重复元素分别参与排名；是否允许修改输入会决定能否原地分区。

**思路**：完整排序后答案是下标 `n-k`，时间 `O(n log n)`。更优的快速选择同样寻找下标 `target = n-k`：随机选择基准，将小于等于基准的元素放在左侧，分区结束时基准已处于最终位置；只继续搜索目标所在的一侧。分区循环的不变量是 `[left, store)` 中元素不大于基准，`[store, i)` 中元素大于基准。

```python
from typing import List

class SolutionSort:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        nums.sort()
        return nums[len(nums) - k]
```

```python
from typing import List

from random import randint

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        target = len(nums) - k
        left, right = 0, len(nums) - 1

        while left <= right:
            pivot_index = randint(left, right)
            nums[pivot_index], nums[right] = nums[right], nums[pivot_index]
            pivot = nums[right]
            store = left
            for i in range(left, right):
                if nums[i] <= pivot:
                    nums[store], nums[i] = nums[i], nums[store]
                    store += 1
            nums[store], nums[right] = nums[right], nums[store]

            if store == target:
                return nums[store]
            if store < target:
                left = store + 1
            else:
                right = store - 1
        raise RuntimeError("unreachable")
```

**复杂度**：排序时间 `O(n log n)`；Python 的 `list.sort()` 会修改输入，最坏辅助空间 `O(n)`。快速选择期望时间 `O(n)`、最坏 `O(n^2)`，额外空间 `O(1)`，也会修改输入。

**边界与易错点**：第 `k` 大对应升序下标 `n-k`；分区的比较符号与目标下标必须匹配。随机基准降低持续遇到极端划分的概率。

**面试追问**：数据流或不允许修改输入时可维护大小为 `k` 的最小堆，时间 `O(n log k)`、空间 `O(k)`；最坏时间必须稳定时可讨论 BFPRT。

## LC 56 合并区间

**考频与考点**：高频排序扫描题。考查先建立顺序，再用局部信息维护全局合并结果。

**写代码前确认**：端点相接是否算重叠；本题闭区间 `[a,b]` 中 `[1,4]` 与 `[4,5]` 应合并。

**思路**：按左端点升序排序。扫描时保持循环不变量：`merged` 已覆盖所有处理过的区间，内部两两不重叠且按左端点有序。当前左端点不大于最后区间的右端点时更新右边界，否则开启新区间。

```python
from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        intervals.sort(key=lambda interval: interval[0])
        merged: List[List[int]] = []
        for left, right in intervals:
            if not merged or left > merged[-1][1]:
                merged.append([left, right])
            else:
                merged[-1][1] = max(merged[-1][1], right)
        return merged
```

**复杂度**：排序时间 `O(n log n)`，扫描 `O(n)`；Python 的 `list.sort()` 最坏辅助空间 `O(n)`，输出空间 `O(n)`。

**边界与易错点**：必须按左端点排序；本实现会重排输入列表，但为答案创建了新的区间对象，不会改写原区间的端点。若直接复用并修改输入区间对象，还会覆盖端点值。

**面试追问**：如何插入一个新区间？有序输入可依次处理左侧不相交、重叠、右侧不相交三段，做到 `O(n)`。

## LC 33 搜索旋转排序数组

**考频与考点**：高频旋转数组二分。核心是每轮至少有一半仍然有序。

**写代码前确认**：元素互不相同。本文统一采用左闭右闭区间 `[left, right]`，循环条件为 `left <= right`。

**思路**：取中点后，若 `nums[left] <= nums[mid]`，左半段有序；判断目标是否落在 `[nums[left], nums[mid])`，据此舍弃另一半。否则右半段有序，判断目标是否落在 `(nums[mid], nums[right]]`。每次排除中点并收缩闭区间。

```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                return mid
            if nums[left] <= nums[mid]:
                if nums[left] <= target < nums[mid]:
                    right = mid - 1
                else:
                    left = mid + 1
            else:
                if nums[mid] < target <= nums[right]:
                    left = mid + 1
                else:
                    right = mid - 1
        return -1
```

**复杂度**：时间 `O(log n)`，空间 `O(1)`。

**边界与易错点**：判断有序半段时要包含中点相等情形；各边界的不等号必须与闭区间一致。

**面试追问**：存在重复元素时，`nums[left] == nums[mid] == nums[right]` 无法判断哪边有序，只能收缩两端，最坏退化为 `O(n)`。

## LC 34 在排序数组中查找元素的第一个和最后一个位置

**考频与考点**：高频边界二分，考查“找任意位置”与“找插入边界”的差别。

**写代码前确认**：数组非降序；不存在目标时返回 `[-1,-1]`。辅助函数统一在左闭右开区间 `[left, right)` 中找第一个大于等于目标的位置。

**思路**：`lower_bound(x)` 保持答案始终位于 `[left, right]`：当中点值小于 `x` 时，答案只能在右侧，令 `left = mid + 1`；否则中点可能是答案，令 `right = mid`。目标左边界是 `lower_bound(target)`，右边界是 `lower_bound(target + 1) - 1`。

```python
from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        def lower_bound(value: int) -> int:
            left, right = 0, len(nums)
            while left < right:
                mid = left + (right - left) // 2
                if nums[mid] < value:
                    left = mid + 1
                else:
                    right = mid
            return left

        first = lower_bound(target)
        if first == len(nums) or nums[first] != target:
            return [-1, -1]
        return [first, lower_bound(target + 1) - 1]
```

**复杂度**：时间 `O(log n)`，空间 `O(1)`。

**边界与易错点**：二分结束后先检查 `first` 是否越界；在定宽整数语言中可另写 `upper_bound` 避免 `target + 1` 溢出。

**面试追问**：`lower_bound` 也直接解决搜索插入位置；将比较条件改为 `nums[mid] <= value` 可得到第一个严格大于目标的位置。

## LC 912 排序数组

**考频与考点**：排序算法手写题。要求理解快速排序和归并排序在稳定性、最坏复杂度及空间上的取舍。

**写代码前确认**：是否允许修改输入、是否要求稳定、数据是否可能基本有序或包含大量重复值。快速排序原地但不稳定；归并排序稳定但需线性辅助空间。

**思路**：快速排序随机选基准并做三路分区，将区间划分成小于、等于和大于基准的三段，只继续处理两侧；这能一次跳过大量重复元素。代码始终递归处理较短一侧、循环处理较长一侧，将递归栈限制为 `O(log n)`。归并排序先分别排好左右半段，再以双指针稳定合并；合并前两半均有序是其循环不变量。

```python
from typing import List

from random import randint

class SolutionQuickSort:
    def sortArray(self, nums: List[int]) -> List[int]:
        def quick_sort(left: int, right: int) -> None:
            while left < right:
                pivot = nums[randint(left, right)]
                less, current, greater = left, left, right
                while current <= greater:
                    if nums[current] < pivot:
                        nums[less], nums[current] = nums[current], nums[less]
                        less += 1
                        current += 1
                    elif nums[current] > pivot:
                        nums[current], nums[greater] = nums[greater], nums[current]
                        greater -= 1
                    else:
                        current += 1

                if less - left < right - greater:
                    quick_sort(left, less - 1)
                    left = greater + 1
                else:
                    quick_sort(greater + 1, right)
                    right = less - 1

        quick_sort(0, len(nums) - 1)
        return nums
```

```python
from typing import List

class SolutionMergeSort:
    def sortArray(self, nums: List[int]) -> List[int]:
        buffer = [0] * len(nums)

        def merge_sort(left: int, right: int) -> None:
            if right - left <= 1:
                return
            mid = (left + right) // 2
            merge_sort(left, mid)
            merge_sort(mid, right)
            i, j, write = left, mid, left
            while i < mid or j < right:
                if j == right or (i < mid and nums[i] <= nums[j]):
                    buffer[write] = nums[i]
                    i += 1
                else:
                    buffer[write] = nums[j]
                    j += 1
                write += 1
            nums[left:right] = buffer[left:right]

        merge_sort(0, len(nums))
        return nums
```

**复杂度**：随机快速排序期望 `O(n log n)`、最坏 `O(n^2)`；较短侧递归使栈空间最坏为 `O(log n)`。归并排序稳定为 `O(n log n)`，辅助空间 `O(n)`。

**边界与易错点**：朴素固定基准会在有序输入上退化；二路分区也会在大量重复值下形成极不均衡的子问题，因此代码使用三路分区。归并时相等元素优先取左侧才保持稳定。

**面试追问**：标准库常使用混合策略；若要求严格原地且最坏 `O(n log n)`，可讨论堆排序，但它同样不稳定。

## LC 4 寻找两个正序数组的中位数

**考频与考点**：高难度二分题。考查在较短数组上寻找能把两数组共同划分为左右两半的位置。

**写代码前确认**：两个数组不会同时为空；本解法令第一个数组较短。二分区间是划分位置的左闭右闭区间 `[0,m]`。

**思路**：设短数组左侧取 `i` 个元素，长数组左侧取 `j = (m+n+1)//2-i` 个。目标划分满足 `a_left <= b_right` 且 `b_left <= a_right`。若 `a_left > b_right`，`i` 太大；若 `b_left > a_right`，`i` 太小。用正负无穷统一处理切在数组边界的情况。

```python
from typing import List

class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        left, right = 0, m

        while left <= right:
            i = (left + right) // 2
            j = (m + n + 1) // 2 - i
            a_left = float("-inf") if i == 0 else nums1[i - 1]
            a_right = float("inf") if i == m else nums1[i]
            b_left = float("-inf") if j == 0 else nums2[j - 1]
            b_right = float("inf") if j == n else nums2[j]

            if a_left > b_right:
                right = i - 1
            elif b_left > a_right:
                left = i + 1
            else:
                left_max = max(a_left, b_left)
                if (m + n) % 2:
                    return float(left_max)
                return (left_max + min(a_right, b_right)) / 2.0
        raise RuntimeError("unreachable")
```

**复杂度**：时间 `O(log(min(m,n) + 1))`，空间 `O(1)`；加一覆盖短数组为空的边界。

**边界与易错点**：必须在短数组上二分，才能保证 `j` 不越界；左半部分多放一个元素可统一奇数长度中位数。

**面试追问**：这也是“第 `k` 小”问题的特例；通用解法可每次排除某数组约 `k/2` 个元素。

## LC 75 颜色分类

**考频与考点**：荷兰国旗问题，考查三区间循环不变量和原地交换。

**写代码前确认**：数组只含 0、1、2，要求原地完成，不能调用排序函数。

**思路**：维护 `[0, low)` 全为 0，`[low, current)` 全为 1，`[current, high]` 尚未分类，`(high,n)` 全为 2。遇 0 与 `low` 交换并同时右移；遇 1 只右移；遇 2 与 `high` 交换后只左移 `high`，因为换来的元素尚未检查。

```python
from typing import List

class Solution:
    def sortColors(self, nums: List[int]) -> None:
        low, current, high = 0, 0, len(nums) - 1
        while current <= high:
            if nums[current] == 0:
                nums[low], nums[current] = nums[current], nums[low]
                low += 1
                current += 1
            elif nums[current] == 1:
                current += 1
            else:
                nums[current], nums[high] = nums[high], nums[current]
                high -= 1
```

**复杂度**：时间 `O(n)`，空间 `O(1)`，会覆盖输入数组的原顺序。

**边界与易错点**：交换 2 后不能立刻移动 `current`；从右侧换来的可能是 0 或 2，必须继续分类。

**面试追问**：若颜色种类扩展到 `k`，计数排序为 `O(n+k)`；要求稳定时不能直接使用这种交换方案。

## LC 902 最大为 N 的数字组合

**考频与考点**：字节新增题。考查数位计数、前缀约束和组合数学。

**写代码前确认**：可用数字均为 `1` 到 `9`，可重复使用，不含前导零；统计正整数且不超过 `n`。

**思路**：设 `n` 有 `length` 位、数字集合大小为 `base`。先累加所有位数更短的数，共 `base^1 + ... + base^(length-1)`。再从高位到低位匹配 `n`：当前位置每个小于目标位的可用数字，都能与后续任意数字组成 `base^remaining` 个数；若目标位不在集合中，后续无法继续匹配，立即返回；若每位都匹配，最后把 `n` 本身计入。

```python
from typing import List

class Solution:
    def atMostNGivenDigitSet(self, digits: List[str], n: int) -> int:
        text = str(n)
        base = len(digits)
        answer = sum(base ** size for size in range(1, len(text)))

        for index, target_digit in enumerate(text):
            remaining = len(text) - index - 1
            smaller = sum(digit < target_digit for digit in digits)
            answer += smaller * (base ** remaining)
            if target_digit not in digits:
                return answer
        return answer + 1
```

**复杂度**：设 `n` 有 `L` 位、可用数字有 `D` 个，时间 `O(LD)`，空间 `O(1)`。

**边界与易错点**：较短位数必须从 1 位开始；只有完整匹配 `n` 的所有位后，才能把 `n` 自身加一。

**面试追问**：若数字集合包含 0，需要单独限制最高位；更通用的上下界、重复次数等约束可写成数位 DP。

## LC 35 搜索插入位置

**考频与考点**：新增基础边界二分，是后续查找左右边界的模板。

**写代码前确认**：数组严格递增；目标不存在时返回保持有序的插入下标。使用左闭右开区间 `[left, right)`。

**思路**：寻找第一个大于等于 `target` 的位置。循环中答案始终位于闭合的候选边界 `[left,right]`；中点值小于目标时排除中点及左侧，否则保留中点并收缩右边界。`left == right` 时即为答案，也可能等于数组长度。

```python
from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums)
        while left < right:
            mid = left + (right - left) // 2
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid
        return left
```

**复杂度**：时间 `O(log n)`，空间 `O(1)`。

**边界与易错点**：右边界初始化为 `len(nums)`，因此目标大于所有元素时自然返回末尾；半开区间更新右端时不能减一。

**面试追问**：将比较改为 `nums[mid] <= target`，可求第一个严格大于目标的插入位置。

## LC 54 螺旋矩阵

**考频与考点**：新增矩阵模拟题。重点不是方向数组，而是维护尚未访问矩形的边界。

**写代码前确认**：矩阵非空且为规则矩形；只返回遍历结果，不修改矩阵。

**思路**：维护闭合边界 `top、bottom、left、right`。每轮开始时，边界内恰是尚未访问的矩形；依次取顶边、右边，再在仍有剩余行/列时取底边和左边。每访问一条边就向内收缩对应边界。

```python
from typing import List

class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        top, bottom = 0, len(matrix) - 1
        left, right = 0, len(matrix[0]) - 1
        answer: List[int] = []

        while top <= bottom and left <= right:
            for col in range(left, right + 1):
                answer.append(matrix[top][col])
            top += 1

            for row in range(top, bottom + 1):
                answer.append(matrix[row][right])
            right -= 1

            if top <= bottom:
                for col in range(right, left - 1, -1):
                    answer.append(matrix[bottom][col])
                bottom -= 1

            if left <= right:
                for row in range(bottom, top - 1, -1):
                    answer.append(matrix[row][left])
                left += 1
        return answer
```

**复杂度**：每个元素访问一次，时间 `O(mn)`；除输出外空间 `O(1)`。

**边界与易错点**：单行或单列矩阵会在一轮内耗尽，访问底边、左边前必须再次检查边界，避免重复。

**面试追问**：若要求原地螺旋写入矩阵，可保留同样的边界不变量，只把“读取”替换为“写入”。

## LC 73 矩阵置零

**考频与考点**：新增原地矩阵题。考查用首行、首列复用标记空间。

**写代码前确认**：某元素为 0 时整行整列置零；要求常数额外空间，允许覆盖矩阵。

**思路**：先单独记录首行、首列原本是否含零。扫描内部元素时，把其所在行的首列和所在列的首行置零作为标记。此时循环不变量是：已扫描内部区域中每个零对应的行列都已在边界留下标记。再据标记清零内部，最后处理首行首列。原地代价是首行和首列的原始值被用作元数据并最终可能被覆盖。

```python
from typing import List

class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        rows, cols = len(matrix), len(matrix[0])
        first_row_zero = any(matrix[0][col] == 0 for col in range(cols))
        first_col_zero = any(matrix[row][0] == 0 for row in range(rows))

        for row in range(1, rows):
            for col in range(1, cols):
                if matrix[row][col] == 0:
                    matrix[row][0] = 0
                    matrix[0][col] = 0

        for row in range(1, rows):
            for col in range(1, cols):
                if matrix[row][0] == 0 or matrix[0][col] == 0:
                    matrix[row][col] = 0

        if first_row_zero:
            for col in range(cols):
                matrix[0][col] = 0
        if first_col_zero:
            for row in range(rows):
                matrix[row][0] = 0
```

**复杂度**：时间 `O(mn)`，额外空间 `O(1)`。

**边界与易错点**：首行首列共用 `matrix[0][0]`，所以必须用两个独立布尔值保存它们原本的状态；不能边发现零边直接清整行列，会污染后续判断。

**面试追问**：若不允许修改输入，只能另建结果或至少保存需要清零的行列集合，空间为 `O(m+n)`。

## LC 74 搜索二维矩阵

**考频与考点**：新增二分题。矩阵每行有序且下一行首元素大于上一行末元素，可以视为一维有序数组。

**写代码前确认**：确认题目是 LC 74 的全局有序条件，而不是 LC 240 的行列分别有序。使用左闭右开虚拟下标区间 `[left,right)`。

**思路**：把虚拟下标 `index` 映射到 `row = index // cols`、`col = index % cols`，在长度 `rows*cols` 的有序序列上做普通二分。循环前目标若存在必位于当前半开区间内；每次排除中点或保留右侧候选。

```python
from typing import List

class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        rows, cols = len(matrix), len(matrix[0])
        left, right = 0, rows * cols
        while left < right:
            mid = left + (right - left) // 2
            value = matrix[mid // cols][mid % cols]
            if value < target:
                left = mid + 1
            else:
                right = mid
        return left < rows * cols and matrix[left // cols][left % cols] == target
```

**复杂度**：时间 `O(log(mn))`，空间 `O(1)`。

**边界与易错点**：虚拟下标的除数和模数都是列数；最终候选可能等于元素总数，访问前要检查。

**面试追问**：若只有每行、每列分别递增，展平后不再有序，应使用 LC 240 的右上角阶梯搜索。

## LC 153 寻找旋转排序数组中的最小值

**考频与考点**：新增旋转数组二分。与 LC 33 不同，这里利用最小值相对右端点的单调分区。

**写代码前确认**：元素互不相同；使用左闭右闭区间 `[left,right]`，并保持最小值始终在区间内。

**思路**：当 `nums[mid] > nums[right]`，中点位于旋转前的较大段，最小值严格在右侧，令 `left = mid + 1`；否则中点可能就是最小值，令 `right = mid`。循环到单点时返回。

```python
from typing import List

class Solution:
    def findMin(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = left + (right - left) // 2
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                right = mid
        return nums[left]
```

**复杂度**：时间 `O(log n)`，空间 `O(1)`。

**边界与易错点**：与右端点比较时，`right = mid` 不能写成 `mid - 1`，因为中点仍可能是最小值。

**面试追问**：存在重复值且 `nums[mid] == nums[right]` 时只能执行 `right -= 1`，最坏退化为 `O(n)`。

## LC 169 多数元素

**考频与考点**：新增数组题。Boyer-Moore 投票考查“不同元素两两抵消”的不变量。

**写代码前确认**：多数元素出现次数严格大于 `n/2`，并保证存在；若不保证存在，最后必须再计数验证。

**思路**：维护候选人和净票数。净票为 0 时，当前元素成为新候选；相同则加一，不同则减一。扫描完任意前缀后，已经抵消的不同元素不会影响真正多数元素在剩余部分中的多数地位，因此最终候选必为答案。

```python
from typing import List

class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        candidate = 0
        votes = 0
        for value in nums:
            if votes == 0:
                candidate = value
            votes += 1 if value == candidate else -1
        return candidate
```

**复杂度**：时间 `O(n)`，空间 `O(1)`，不修改输入。

**边界与易错点**：投票只产生候选人；题目不保证多数存在时，需要第二次扫描确认其次数是否超过 `n/2`。

**面试追问**：寻找出现次数超过 `n/3` 的元素时最多有两个候选，可维护两个候选及票数并在最后验证。

## LC 238 除自身以外数组的乘积

**考频与考点**：新增前后缀题。考查不用除法、线性时间和常数额外空间的组合信息。

**写代码前确认**：不能使用除法；输出数组不计入额外空间。输入可能含零。

**思路**：第一次从左向右令 `answer[i]` 保存 `i` 左侧所有元素乘积；循环不变量是写入前 `prefix` 等于当前位置左侧乘积。第二次从右向左维护右侧乘积 `suffix`，把它乘入答案后再吸收当前值。输入不被覆盖，所有前缀信息放在输出数组中。

```python
from typing import List

class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        answer = [1] * len(nums)
        prefix = 1
        for i, value in enumerate(nums):
            answer[i] = prefix
            prefix *= value

        suffix = 1
        for i in range(len(nums) - 1, -1, -1):
            answer[i] *= suffix
            suffix *= nums[i]
        return answer
```

**复杂度**：时间 `O(n)`，除输出外空间 `O(1)`。

**边界与易错点**：先把当前 `prefix` 写入答案，再乘当前元素；零无需特判，前后缀乘积会自然处理一个或多个零。

**面试追问**：若允许除法，需要分别处理零的数量；相比之下前后缀方案更统一，也没有整除或浮点精度问题。

## LC 240 搜索二维矩阵 II

**考频与考点**：新增矩阵搜索题。考查从特殊角点出发，每次排除一整行或一整列。

**写代码前确认**：每行从左到右递增，每列从上到下递增，但矩阵不能整体展平成有序数组。

**思路**：从右上角开始。当前位置大于目标，则该列当前位置以下也都不可能更小到命中，排除当前列；当前位置小于目标，则该行当前位置左侧也都更小，排除当前行。循环不变量是目标若存在，始终位于左下方尚未排除的矩形中。

```python
from typing import List

class Solution:
    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:
        row, col = 0, len(matrix[0]) - 1
        while row < len(matrix) and col >= 0:
            value = matrix[row][col]
            if value == target:
                return True
            if value > target:
                col -= 1
            else:
                row += 1
        return False
```

**复杂度**：时间 `O(m+n)`，空间 `O(1)`。

**边界与易错点**：从左上角无法确定应排除行还是列；右上和左下才同时提供一增一减的两个方向。

**面试追问**：也可逐行二分，复杂度 `O(m log n)`；应根据矩阵形状比较它与 `O(m+n)` 的实际代价。

## LC 287 寻找重复数

**考频与考点**：新增数组题。经典解法把数组下标和值构成函数图，用 Floyd 判环定位入口。

**写代码前确认**：长度为 `n+1`，值域为 `[1,n]`，只有一个重复值但可能重复多次；不能修改输入且额外空间要求 `O(1)`。

**思路**：把 `index -> nums[index]` 看作单出边图。因为值域不含 0，从下标 0 出发必进入一个环；重复值是两条路径汇合的位置，也就是环入口。先用快慢指针找到环内相遇点，再让一个指针回到 0，两者同步前进，相遇处即入口。

```python
from typing import List

class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow = nums[0]
        fast = nums[nums[0]]
        while slow != fast:
            slow = nums[slow]
            fast = nums[nums[fast]]

        slow = 0
        while slow != fast:
            slow = nums[slow]
            fast = nums[fast]
        return slow
```

**复杂度**：时间 `O(n)`，空间 `O(1)`，不修改输入。

**边界与易错点**：指针移动的是“值对应的下标”，不是按数组位置顺序移动；第二阶段必须把一个指针放回起点 0。

**面试追问**：也可在值域 `[1,n]` 上二分，统计小于等于中点的元素数是否超过中点，时间 `O(n log n)`、空间 `O(1)`。

## LC 442 数组中重复的数据

**考频与考点**：新增原地下标标记题。利用值域与数组长度一致，把符号位当作访问标记。

**写代码前确认**：所有值位于 `[1,n]`，每个元素最多出现两次；允许修改输入数组。

**思路**：值 `v` 映射到下标 `v-1`。首次见到时将该位置取负；再次见到时发现该位置已为负，说明 `v` 重复。循环不变量是：已扫描元素对应的位置为负，当且仅当该值此前出现过。原地代价是数组元素的符号被覆盖。

```python
from typing import List

class Solution:
    def findDuplicates(self, nums: List[int]) -> List[int]:
        answer: List[int] = []
        for raw_value in nums:
            value = abs(raw_value)
            index = value - 1
            if nums[index] < 0:
                answer.append(value)
            else:
                nums[index] = -nums[index]
        return answer
```

**复杂度**：时间 `O(n)`，除输出外空间 `O(1)`。

**边界与易错点**：读取当前值必须先取绝对值，因为它可能已被此前标记；若输入值可出现三次以上，第二、三次都会加入答案，需要额外约束或恢复标记。

**面试追问**：若需要恢复输入，可在结束后将所有元素取绝对值；若不允许修改输入，则使用哈希集合需要 `O(n)` 空间。

## LC 704 二分查找

**考频与考点**：新增基础模板题。重点是区间定义、循环条件和边界更新三者一致。

**写代码前确认**：数组严格递增；不存在返回 `-1`。这里使用左闭右闭区间 `[left,right]`。

**思路**：循环不变量是：目标若存在，必在当前闭区间内。比较中点后若不相等，可以安全排除中点，所以分别更新为 `mid+1` 或 `mid-1`。当 `left > right` 时候选区间为空。

```python
from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums) - 1
        while left <= right:
            mid = left + (right - left) // 2
            if nums[mid] == target:
                return mid
            if nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        return -1
```

**复杂度**：时间 `O(log n)`，空间 `O(1)`。

**边界与易错点**：闭区间必须使用 `left <= right`；若把右端初始化为 `len(nums)`，就应整体改用半开区间模板，不能混搭。

**面试追问**：二分的本质不是“有序数组”，而是可判断答案位于哪一侧的单调谓词；边界二分、答案二分都基于这一点。
