---
layout: default
title: 排序算法大全
description: 从冒泡到基数排序，系统掌握常见排序原理、实现、复杂度与选型
eyebrow: 核心算法 / 01
---

# 排序算法

## 为什么要学排序

1. **很多算法的前提都是有序数据**。比如二分查找要求数组有序；很多贪心策略需要先按某个维度排序再处理。
2. **面试高频考点**。面试官经常问：快排和归并的区别是什么？哪些排序是稳定的？时间复杂度各是多少？
3. **锻炼算法思维**。排序算法涵盖了暴力枚举、分治、递归等核心思想，是训练算法直觉的绝佳入口。

对于刷题来说，你不需要手写每一种排序，但**必须理解原理和复杂度**，尤其是归并排序和快速排序。

---

## 常见排序算法对比

| 算法 | 平均时间复杂度 | 最坏时间复杂度 | 空间复杂度 | 是否稳定 |
|------|--------------|--------------|-----------|---------|
| 冒泡排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(1) | 不稳定 |
| 插入排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 希尔排序 | 依赖增量，常见约 O(n^1.3) | O(n²) | O(1) | 不稳定 |
| 归并排序 | O(n log n) | O(n log n) | O(n) | 稳定 |
| 快速排序 | O(n log n) | O(n²) | O(log n) | 不稳定 |
| 堆排序 | O(n log n) | O(n log n) | O(1) | 不稳定 |
| 计数排序 | O(n + k) | O(n + k) | O(n + k) | 可稳定 |
| 桶排序 | 平均 O(n + k) | O(n²) | O(n + k) | 取决于桶内排序 |
| 基数排序 | O(d(n + k)) | O(d(n + k)) | O(n + k) | 稳定 |
| Python sorted/sort | O(n log n) | O(n log n) | O(n) | 稳定 |

其中 `n` 是元素数量，`k` 是值域或桶数量，`d` 是数字位数。

**怎么记？** 简单排序（冒泡、选择、插入）都是 O(n²)；比较排序中的归并、快排、堆排通常是 O(n log n)；计数、桶、基数排序利用值域信息，可以突破比较排序的 O(n log n) 下界。稳定性常用口诀是“快选堆希不稳定”。

### 先理解三个评价维度

- **稳定**：相等元素排序后仍保持原相对顺序。多字段分步排序时很重要。
- **原地**：除少量变量或递归栈外，不申请与 n 同规模的辅助数组。
- **自适应**：数据已有序或部分有序时能更快，例如插入排序和 Timsort。

没有“任何场景都最好”的排序。数据规模、值域、稳定性和内存限制共同决定选择。

---

## 冒泡排序

**相邻两个元素比较，如果前面比后面大就交换**。每一轮遍历后，最大的元素会像气泡一样"浮"到数组末尾。

以 `[5, 3, 8, 1]` 为例，第一轮：比较 5 和 3 → 交换；比较 5 和 8 → 不换；比较 8 和 1 → 交换。结果 `[3, 5, 1, 8]`，最大值 8 已到末尾。接下来对前面部分重复。

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        swapped = False  # 优化：如果某轮没发生交换，说明已经有序
        for j in range(n - 1 - i):  # 每轮结束后末尾已排好，不用再比
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break  # 提前退出
    return arr
```

- 时间 O(n²)，最好情况（已有序）O(n)；空间 O(1)；**稳定**。

---

## 选择排序

每一轮从未排序部分中**找到最小值**，然后放到已排序部分的末尾。

以 `[5, 3, 8, 1]` 为例：第一轮找到最小值 1，和下标 0 交换 → `[1, 3, 8, 5]`；第二轮 3 已在正确位置；第三轮 5 和 8 交换 → `[1, 3, 5, 8]`。

```python
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i  # 假设当前位置就是最小值
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j  # 记录真正最小值的下标
        arr[i], arr[min_idx] = arr[min_idx], arr[i]  # 把最小值放到前面
    return arr
```

- 时间 O(n²)，无论数据是否有序都一样；空间 O(1)；**不稳定**。

---

## 插入排序

类似**打扑克牌时整理手牌**：手里已有排好的牌，每摸到一张新牌，从右往左找到合适的位置插进去。

以 `[5, 3, 8, 1]` 为例：取出 3，插到 5 前面；取出 8，位置不变；取出 1，一路往前，插到最前面 → `[1, 3, 5, 8]`。

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]  # 当前要插入的"新牌"
        j = i - 1
        # 从右往左，把比 key 大的元素都往后挪一位
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key  # 找到位置，插入
    return arr
```

- 时间 O(n²)，最好情况（已有序）O(n)；空间 O(1)；**稳定**。
- 小技巧：数据量很小或基本有序时，插入排序性能反而比快排好。Python 内置的 Timsort 就在小段数据上使用插入排序。

---

## 希尔排序

希尔排序是“分组插入排序”。普通插入排序每次只能移动一位；希尔排序先用较大间隔让元素快速接近正确位置，再逐步缩小间隔，最后执行一次间隔为 1 的插入排序。

```python
def shell_sort(arr):
    n = len(arr)
    gap = n // 2

    while gap > 0:
        for i in range(gap, n):
            current = arr[i]
            j = i

            while j >= gap and arr[j - gap] > current:
                arr[j] = arr[j - gap]
                j -= gap

            arr[j] = current

        gap //= 2

    return arr
```

- 空间 O(1)，不稳定。
- 复杂度取决于 gap 序列，最简单的折半序列最坏仍可能 O(n²)。
- 工程和面试中重要性低于归并、快排和堆排，但它展示了“先粗调、再精调”的思想。

---

## 归并排序（重点）

归并排序是**分治思想**的经典应用，核心三步：**分 → 排 → 合**。

1. **分**：把数组从中间一分为二，递归地对左右两半分别排序。
2. **排**：递归到只剩一个元素时，天然有序，开始返回。
3. **合**：把两个已排好序的子数组合并成一个有序数组——就像两堆已排好的扑克牌，每次比较牌顶，取较小的放到新堆里。

```
[5, 3, 8, 1]
     ↓ 分
[5, 3]   [8, 1]
  ↓ 分      ↓ 分
[5] [3]  [8] [1]
  ↓ 合      ↓ 合
[3, 5]   [1, 8]
     ↓ 合
[1, 3, 5, 8]
```

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr  # 递归终止：只有一个元素，天然有序

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])   # 递归排序左半部分
    right = merge_sort(arr[mid:])  # 递归排序右半部分
    return merge(left, right)

def merge(left, right):
    """合并两个有序数组"""
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:  # <= 保证稳定性
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    # 把剩余的元素加上（只有一边会有剩余）
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

- **时间 O(n log n)**：每层合并 O(n)，共 log n 层，最好最坏都一样。
- **空间 O(n)**：合并时需要额外数组。
- **稳定排序**：合并时相等元素取左边的，保持原有顺序。

**面试点拨**：归并排序是唯一保证 O(n log n) 且稳定的比较排序。链表排序（LC 148）首选归并，因为链表合并不需要额外空间。

---

## 快速排序（重点）

快速排序也是分治法，但思路和归并不同：

1. **选基准（Pivot）**：从数组中选一个元素作为基准。
2. **分区（Partition）**：比 pivot 小的放左边，比 pivot 大的放右边。
3. **递归**：对左右两部分分别递归快排。

归并是"先分后合"，快排是"先分区后递归"，分区过程本身就在排序，所以不需要合并步骤。

简洁写法（易理解但有额外空间开销）：

```python
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]  # 选中间元素作为基准
    left = [x for x in arr if x < pivot]    # 比基准小的
    middle = [x for x in arr if x == pivot]  # 等于基准的
    right = [x for x in arr if x > pivot]   # 比基准大的
    return quick_sort(left) + middle + quick_sort(right)
```

面试中更常考**原地分区**写法：

```python
def quick_sort_inplace(arr, low, high):
    if low < high:
        pivot_idx = partition(arr, low, high)
        quick_sort_inplace(arr, low, pivot_idx - 1)
        quick_sort_inplace(arr, pivot_idx + 1, high)

def partition(arr, low, high):
    """以最右元素为基准，把小于基准的移到左边"""
    pivot = arr[high]
    i = low  # i 指向下一个该放"小元素"的位置
    for j in range(low, high):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    arr[i], arr[high] = arr[high], arr[i]  # 把 pivot 放到正确位置
    return i

# 用法：quick_sort_inplace(arr, 0, len(arr) - 1)
```

- **平均时间 O(n log n)**，最坏 O(n²)（数组已有序且每次选到极端 pivot，可通过随机选 pivot 避免）。
- **空间 O(log n)**：递归调用栈开销。
- **不稳定**：分区过程中交换可能打乱相对顺序。

**面试点拨**：快排在工程中最常用，常数因子小、缓存友好。LC 215（第 K 大元素）可以用快排分区思想（Quick Select）在平均 O(n) 时间内解决。

---

## 堆排序

堆排序分两步：

1. 把数组原地建成最大堆，根节点是当前最大值。
2. 把根与末尾交换，缩小堆范围，再恢复最大堆。

```python
def heap_sort(arr):
    n = len(arr)

    # 从最后一个非叶子节点开始，自底向上建最大堆
    for root in range(n // 2 - 1, -1, -1):
        sift_down(arr, root, n)

    # 每次把最大值放到当前末尾
    for end in range(n - 1, 0, -1):
        arr[0], arr[end] = arr[end], arr[0]
        sift_down(arr, 0, end)

    return arr


def sift_down(arr, root, heap_size):
    while True:
        largest = root
        left = root * 2 + 1
        right = root * 2 + 2

        if left < heap_size and arr[left] > arr[largest]:
            largest = left
        if right < heap_size and arr[right] > arr[largest]:
            largest = right

        if largest == root:
            return

        arr[root], arr[largest] = arr[largest], arr[root]
        root = largest
```

为什么建堆是 O(n) 而不是 O(n log n)？靠近底层的节点很多，但下沉距离很短；靠近顶层的节点少，虽然可能下沉很多层，总工作量求和为 O(n)。

- 最好、平均、最坏都是 O(n log n)。
- 额外空间 O(1)。
- 不稳定，缓存局部性通常不如快排。
- 当必须保证最坏 O(n log n) 且内存很紧时有价值。

---

## 计数排序

当元素是整数且值域不大时，不比较元素大小，而是统计每个值出现次数。

### 简单版

```python
def counting_sort(nums):
    if not nums:
        return []

    minimum = min(nums)
    maximum = max(nums)
    count = [0] * (maximum - minimum + 1)

    for value in nums:
        count[value - minimum] += 1

    result = []
    for offset, frequency in enumerate(count):
        value = offset + minimum
        result.extend([value] * frequency)

    return result
```

这个版本支持负数，但不保留附加信息的稳定顺序。

### 稳定版

```python
def stable_counting_sort(nums):
    if not nums:
        return []

    minimum = min(nums)
    maximum = max(nums)
    count = [0] * (maximum - minimum + 1)

    for value in nums:
        count[value - minimum] += 1

    # count[i] 变成“<= 当前值的元素数量”
    for index in range(1, len(count)):
        count[index] += count[index - 1]

    output = [0] * len(nums)
    for value in reversed(nums):
        position = count[value - minimum] - 1
        output[position] = value
        count[value - minimum] -= 1

    return output
```

从右向左放置保证相等元素稳定。

如果只有 100 个数，但值可能到 10^9，不能创建 10^9 大小的计数数组，此时应使用比较排序或哈希计数。

---

## 桶排序

桶排序把值域分成若干区间，每个桶内部单独排序，最后按桶顺序合并。

```python
def bucket_sort(nums, bucket_count=10):
    if len(nums) <= 1:
        return nums[:]

    minimum = min(nums)
    maximum = max(nums)
    if minimum == maximum:
        return nums[:]

    buckets = [[] for _ in range(bucket_count)]
    width = (maximum - minimum + 1) / bucket_count

    for value in nums:
        index = int((value - minimum) / width)
        index = min(index, bucket_count - 1)
        buckets[index].append(value)

    result = []
    for bucket in buckets:
        bucket.sort()
        result.extend(bucket)

    return result
```

- 数据均匀分布时，元素被分散到各桶，平均接近 O(n + k)。
- 所有元素落进同一桶时退化为桶内排序复杂度。
- 关键不是“有几个桶”的固定答案，而是如何根据分布设计映射。

---

## 基数排序

基数排序从低位到高位，按每一位做稳定排序。以十进制非负整数为例：

```python
def radix_sort_nonnegative(nums):
    if not nums:
        return []

    result = nums[:]
    exponent = 1
    maximum = max(result)

    while maximum // exponent > 0:
        result = counting_sort_by_digit(result, exponent)
        exponent *= 10

    return result


def counting_sort_by_digit(nums, exponent):
    count = [0] * 10
    output = [0] * len(nums)

    for value in nums:
        digit = (value // exponent) % 10
        count[digit] += 1

    for digit in range(1, 10):
        count[digit] += count[digit - 1]

    for value in reversed(nums):
        digit = (value // exponent) % 10
        output[count[digit] - 1] = value
        count[digit] -= 1

    return output
```

支持有符号整数可以分开处理：

```python
def radix_sort(nums):
    negatives = [-value for value in nums if value < 0]
    nonnegatives = [value for value in nums if value >= 0]

    negatives = radix_sort_nonnegative(negatives)
    nonnegatives = radix_sort_nonnegative(nonnegatives)

    return [-value for value in reversed(negatives)] + nonnegatives
```

每一位必须使用稳定排序，否则低位已经建立的顺序会被破坏。

---

## 如何选择排序算法

| 场景 | 选择 |
|------|------|
| 日常 Python 刷题 | `sort()` / `sorted()` |
| 面试要求手写通用排序 | 归并或随机快排 |
| 链表排序 | 归并排序 |
| 数据很小或基本有序 | 插入排序 |
| 要稳定且保证 O(n log n) | 归并排序 |
| 内存很紧且要最坏 O(n log n) | 堆排序 |
| 整数值域很小 | 计数排序 |
| 数据均匀分布且值域可分桶 | 桶排序 |
| 固定位数整数/字符串 | 基数排序 |

## 统一测试所有排序实现

```python
def check_sort(sort_function):
    cases = [
        [],
        [1],
        [2, 1],
        [1, 1, 1],
        [3, -1, 2, -1, 0],
        list(range(10)),
        list(range(9, -1, -1)),
    ]

    for case in cases:
        expected = sorted(case)
        actual = sort_function(case[:])
        assert actual == expected, (case, actual, expected)
```

排序代码最容易在空数组、重复值、负数和边界下标上出错。

---

## Python 内置排序

实际刷题中，90% 的场景直接用 Python 内置排序就够了。

**sorted() 和 list.sort() 的区别**：

```python
# sorted() —— 返回新列表，不改变原列表
nums = [3, 1, 4, 1, 5]
new_list = sorted(nums)  # new_list = [1, 1, 3, 4, 5]，nums 不变

# list.sort() —— 原地排序，返回 None
nums.sort()  # nums 变为 [1, 1, 3, 4, 5]
```

`sorted()` 可以用于任何可迭代对象（列表、元组、字符串等），返回新列表；`list.sort()` 只能用于列表，原地修改，更省内存。

**key 参数用法**——自定义排序规则，传入函数，按返回值比较：

```python
# 按绝对值排序
sorted([-3, 1, -2, 4], key=abs)  # [1, -2, -3, 4]

# 按字符串长度排序
sorted(["banana", "apple", "fig"], key=len)  # ["fig", "apple", "banana"]

# 按元组的第二个元素排序（面试常用！）
intervals = [(1, 3), (2, 1), (3, 2)]
sorted(intervals, key=lambda x: x[1])  # [(2, 1), (3, 2), (1, 3)]

# 多条件排序：先按第一个元素升序，再按第二个元素降序
sorted(intervals, key=lambda x: (x[0], -x[1]))
```

**Timsort 简介**：Python 底层使用 Timsort 算法（Tim Peters，2002），它是归并排序和插入排序的混合体。先把数组分成天然有序的小段（run），对每段用插入排序整理，再用归并方式逐步合并。由于现实数据往往部分有序，Timsort 最好情况可达 O(n)。复杂度：时间 O(n log n)，空间 O(n)，稳定排序。

---

## 经典题目

以下是排序相关的高频面试题，建议按顺序练习：

| 题号 | 题目 | 考查重点 |
|------|------|---------|
| LC 912 | 排序数组 | 手写快排/归并，练习排序模板 |
| LC 56 | 合并区间 | 按左端点排序后贪心合并，`key=lambda` 的典型应用 |
| LC 148 | 排序链表 | 链表上的归并排序，练习链表操作 + 分治 |
| LC 215 | 数组中的第 K 个最大元素 | 快速选择（Quick Select），快排分区的变形 |
| LC 75 | 颜色分类 | 荷兰国旗问题，三路分区，一次遍历 O(n) |

**LC 912** 是最好的练习起点：用它来手写归并和快排，确保模板能 AC。

**LC 215** 是面试超高频题，除了排序 O(n log n)，还可以用 Quick Select 优化到平均 O(n)——本质就是快排分区，每次只递归一边。

**LC 75** 是荷兰国旗问题：用三个指针（low、mid、high）把数组分成 0、1、2 三个区域，一次遍历完成，思路和快排分区相通。

---

## 小结

1. **基础排序**（冒泡、选择、插入、希尔）用于理解交换、选择和局部有序。
2. **归并排序**和**快速排序**是重中之重，必须能手写。归并稳定且时间始终 O(n log n)；快排平均最快但最坏 O(n²)。
3. **堆排序**保证最坏 O(n log n) 且原地；计数、桶、基数排序利用值域特征突破比较排序下界。
4. **实际刷题**直接用 `sorted()` / `list.sort()`，重点掌握 `key` 参数与稳定性。
5. 排序不是孤立知识点，二分、贪心、分治、Top K 和区间题都依赖有序性。
6. 稳定性记忆：**快、选、堆、希通常不稳定**；实现细节也可能改变稳定性。
