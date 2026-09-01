---
layout: default
title: 刷题工具与调试
description: 掌握 enumerate、zip、排序、二分库、迭代工具及算法调试方法
eyebrow: Python 基础 / 05
---

# 刷题工具与调试

这篇不要求死记库函数，而是建立一套“看到需求就知道用什么工具”的映射。

## enumerate：同时取得下标和值

```python
nums = [5, 8, 13]

for index, value in enumerate(nums):
    print(index, value)

for index, value in enumerate(nums, start=1):
    print(index, value)          # 下标从 1 开始显示
```

需要修改原数组时用下标；只读时直接遍历值。

## zip：并行遍历

```python
names = ["Alice", "Bob"]
scores = [95, 88]

for name, score in zip(names, scores):
    print(name, score)

pairs = list(zip(names, scores))
```

`zip` 在最短序列结束时停止。需要检查长度是否一致时，应先显式判断。

转置矩阵：

```python
matrix = [[1, 2, 3], [4, 5, 6]]
transposed = [list(column) for column in zip(*matrix)]
# [[1, 4], [2, 5], [3, 6]]
```

`*matrix` 表示把每一行拆成独立参数传给 `zip`。

## sorted、min、max 的 key

```python
words = ["pear", "fig", "banana", "apple"]
sorted(words, key=len)

records = [("Alice", 90), ("Bob", 95), ("Carol", 90)]
records.sort(key=lambda item: (-item[1], item[0]))

best = max(records, key=lambda item: item[1])
```

`key` 返回“用于比较的值”，不会修改原元素。多条件排序使用元组；降序数字常取负数。

### 稳定排序

相同 key 的元素保持原顺序。可以分两次稳定排序：

```python
records.sort(key=lambda item: item[0])                # 次要条件
records.sort(key=lambda item: item[1], reverse=True)  # 主要条件
```

通常一次元组 key 更清晰。

## sum、any、all

```python
sum(nums)
sum(value * value for value in nums)

any(value < 0 for value in nums)   # 是否至少有一个负数
all(value >= 0 for value in nums)  # 是否全部非负
```

生成器表达式不会先创建完整列表，适合只遍历一次的聚合。

## 字符串与数字的高频转换

```python
digits = [int(character) for character in "12345"]
number = int("12345")
text = str(12345)

values = [1, 2, 3]
output = " ".join(map(str, values))   # "1 2 3"

binary = bin(10)[2:]                  # "1010"
value = int("1010", 2)                # 10
```

## divmod 与整除

```python
quotient, remainder = divmod(17, 5)   # 3, 2

hours, minutes = divmod(total_minutes, 60)
```

Python 的 `//` 是向下取整，负数时与“向 0 截断”不同：

```python
-3 // 2       # -2
int(-3 / 2)   # -1
```

## bisect：有序数组二分工具

```python
from bisect import bisect_left, bisect_right, insort

nums = [1, 2, 2, 4]
bisect_left(nums, 2)     # 1，第一个 >= 2 的位置
bisect_right(nums, 2)    # 3，第一个 > 2 的位置
insort(nums, 3)          # 插入后仍有序
```

查找是 O(log n)，但列表中间插入仍是 O(n)。

## itertools：组合枚举

```python
from itertools import permutations, combinations, product, accumulate

list(permutations([1, 2, 3], 2))
list(combinations([1, 2, 3], 2))
list(product([0, 1], repeat=3))
list(accumulate([1, 2, 3, 4]))        # [1, 3, 6, 10]
```

这些工具适合验证小数据或题目允许直接枚举时使用。排列数量是阶乘级，不能因为代码短就忽略复杂度。

## copy：浅拷贝与深拷贝

```python
import copy

matrix = [[1, 2], [3, 4]]
shallow = matrix[:]                    # 只复制外层
deep = copy.deepcopy(matrix)           # 递归复制

shallow[0][0] = 99                     # matrix 也会变化
deep[0][0] = 100                       # matrix 不变
```

刷题中优先按结构手动复制，`deepcopy` 方便但可能带来额外开销。

## infinity 与边界初值

```python
positive_infinity = float("inf")
negative_infinity = float("-inf")

minimum = float("inf")
for value in nums:
    minimum = min(minimum, value)
```

如果数组保证非空，也可以用 `nums[0]` 初始化，能更早暴露空输入问题。

## 用断言写最小测试

```python
def two_sum(nums, target):
    seen = {}
    for index, value in enumerate(nums):
        if target - value in seen:
            return [seen[target - value], index]
        seen[value] = index
    return []

assert two_sum([2, 7, 11, 15], 9) == [0, 1]
assert two_sum([3, 2, 4], 6) == [1, 2]
assert two_sum([], 1) == []
```

每道题至少覆盖：

- 正常样例
- 最小输入或空输入
- 重复元素
- 全相同、全递增、全递减
- 答案不存在或在边界

## 怎样读懂一段陌生代码

不要从第一行一路猜到最后。按下面顺序：

1. 找函数参数与返回值，确认输入输出类型。
2. 找核心状态变量，例如 `left`、`right`、`visited`、`dp`。
3. 写出每个变量在循环开始时代表什么。
4. 选择一个最小样例，手动记录每轮变量。
5. 最后再看特殊边界。

### 手动跟踪表示例

对 `nums = [2, 7, 11]`、`target = 9`：

| index | value | seen（本轮前） | 查找 target-value | 动作 |
|------:|------:|----------------|-------------------|------|
| 0 | 2 | {} | 7 不存在 | 记录 2:0 |
| 1 | 7 | {2: 0} | 2 存在 | 返回 [0,1] |

## 报错定位

| 错误 | 常见原因 | 第一检查点 |
|------|----------|------------|
| `IndexError` | 下标越界 | 循环边界、空列表 |
| `KeyError` | dict key 不存在 | 改用 get 或先判断 |
| `TypeError` | 类型不匹配、函数参数错 | 打印 type 和函数签名 |
| `ValueError` | 字符串无法转换 | 检查输入格式与空行 |
| `RecursionError` | 递归过深或无终止 | 终止条件、是否重复访问 |
| `Time Limit Exceeded` | 复杂度过高 | 嵌套循环、重复计算 |

临时调试输出建议写到标准错误，避免 ACM 答案被污染：

```python
import sys

print(left, right, current, file=sys.stderr)
```

提交前删除调试输出。

## 写完算法后的检查清单

- 输入为空时会怎样？
- 下标的闭区间/开区间是否一致？
- 是否把 `==` 写成 `=`？
- 函数是否在所有路径返回？
- 是否无意修改输入？
- 时间复杂度能否承受数据规模？
- 输出是否多了说明文字或空格？

## 自测

1. 用 `zip` 计算两个向量的点积。
2. 将区间按左端点升序、右端点降序排序。
3. 用 `bisect_left` 实现“第一个大于等于 target 的位置”。
4. 为回文判断函数设计至少 5 个边界测试。

---

[← 返回 Python 基础](../index.html) | [上一篇：类与节点对象](../05-classes/index.html) | [下一篇：输入输出与 ACM →](../06-input-output/index.html)
