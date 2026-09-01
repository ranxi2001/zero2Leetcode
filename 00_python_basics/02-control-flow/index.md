---
layout: default
title: 控制流
description: 从缩进、条件判断到循环不变量，系统掌握 Python 程序执行顺序
eyebrow: Python 基础 / 02
---

# 控制流：让程序做选择和重复工作

程序默认从上到下一行一行执行。控制流解决两个问题：

1. **选择**：满足条件时执行哪一段代码？
2. **重复**：一段代码需要执行多少次，什么时候停止？

算法本质上就是“状态 + 控制流”。数组遍历、二分查找、DFS 和动态规划，最后都会落到条件与循环。

## 缩进就是代码块

Python 不使用 `{}` 包围代码块，而是使用缩进。建议统一使用 4 个空格。

```python
score = 85

if score >= 60:
    result = "及格"       # 属于 if
    print(result)          # 属于 if

print("判断结束")          # 不属于 if，一定执行
```

同一代码块必须保持相同缩进。不要混用 Tab 和空格。

## 条件表达式

### 比较与逻辑运算

```python
age = 20
has_ticket = True

age >= 18                 # 大于等于
age == 20                 # 判断相等，不是赋值
age != 20                 # 不等于
18 <= age <= 60           # Python 支持连续比较

age >= 18 and has_ticket  # 两边都为真
age < 18 or age > 60      # 至少一边为真
not has_ticket            # 取反
```

常见优先级是 `not` 高于 `and`，`and` 高于 `or`。表达式较长时直接加括号，不要依赖记忆。

### 哪些值会被当成 False

`False`、`None`、数字 `0`、空字符串和空容器都会被当成假值。

```python
items = []

if not items:
    print("列表为空")

name = "Alice"
if name:
    print("字符串非空")
```

`if x is None` 用来判断“没有值”；`if not x` 会同时把 `0`、空字符串和空容器判断为假，两者不能随意互换。

## if / elif / else

```python
temperature = 28

if temperature >= 35:
    level = "高温"
elif temperature >= 25:
    level = "温暖"
elif temperature >= 10:
    level = "凉爽"
else:
    level = "寒冷"
```

程序从上到下检查，命中第一个为真的分支后就停止检查。因此范围更严格的条件通常放前面。

### 条件表达式（三元表达式）

```python
maximum = a if a >= b else b
parity = "偶数" if number % 2 == 0 else "奇数"
```

只适合简单赋值。多层嵌套会降低可读性，应改回普通 `if`。

## for 循环

`for` 用来依次取出可迭代对象中的元素。

```python
nums = [10, 20, 30]

for value in nums:
    print(value)

for index, value in enumerate(nums):
    print(index, value)
```

### range 的边界

`range(start, stop, step)` 包含 `start`，不包含 `stop`。

```python
list(range(5))            # [0, 1, 2, 3, 4]
list(range(2, 6))         # [2, 3, 4, 5]
list(range(0, 10, 2))     # [0, 2, 4, 6, 8]
list(range(5, -1, -1))    # [5, 4, 3, 2, 1, 0]
```

遍历下标时使用 `range(len(nums))`，同时需要下标和值时优先用 `enumerate(nums)`。

### 反向遍历

```python
for value in reversed(nums):
    print(value)

for index in range(len(nums) - 1, -1, -1):
    print(index, nums[index])
```

第二种写法中的停止值必须是 `-1`，因为 `range` 不包含停止值。

## while 循环与循环不变量

不知道确切循环次数、但知道停止条件时使用 `while`。

```python
left = 0
right = len(nums) - 1

while left < right:
    if nums[left] + nums[right] < target:
        left += 1
    else:
        right -= 1
```

写 `while` 前回答三个问题：

1. 循环开始前，哪些变量表示当前状态？
2. 每一轮怎样让状态接近结束？
3. 什么时候必须停止？

循环过程中始终成立的事实叫**循环不变量**。例如二分查找中，“答案如果存在，一定还在 `[left, right]` 范围内”就是不变量。

### 防止死循环

```python
while left <= right:
    middle = (left + right) // 2
    if nums[middle] < target:
        left = middle + 1   # 必须越过 middle
    else:
        right = middle - 1
```

如果写成 `left = middle`，当区间只剩两个元素时可能不再缩小。

## break、continue 与循环 else

```python
for value in nums:
    if value < 0:
        continue           # 跳过本轮剩余代码
    if value == target:
        print("找到")
        break              # 结束整个循环
```

循环的 `else` 只在循环**没有被 break 打断**时执行：

```python
for value in nums:
    if value == target:
        print("找到")
        break
else:
    print("未找到")
```

## 嵌套循环与复杂度

```python
for i in range(n):
    for j in range(m):
        process(i, j)
```

内层执行 `n * m` 次，时间复杂度是 `O(nm)`。两个循环写在前后不一定是 `O(n²)`：

```python
for value in nums:        # O(n)
    process(value)

for value in nums:        # O(n)
    process_again(value)
```

总计 `O(n + n) = O(n)`。

## 刷题中的四种常见循环

### 累加

```python
total = 0
for value in nums:
    total += value
```

### 计数

```python
count = 0
for value in nums:
    if value % 2 == 0:
        count += 1
```

### 维护最优值

```python
best = nums[0]
for value in nums[1:]:
    if value > best:
        best = value
```

### 双指针收缩区间

```python
left, right = 0, len(nums) - 1
while left < right:
    if should_move_left(nums[left], nums[right]):
        left += 1
    else:
        right -= 1
```

## 常见错误

| 错误 | 原因 | 修正 |
|------|------|------|
| `if x = 3` | `=` 是赋值 | 使用 `x == 3` |
| `range(len(nums) - 1)` 少处理末尾 | stop 不包含 | 检查区间边界 |
| 循环中删除正在遍历的列表 | 下标会移动 | 遍历副本或构造新列表 |
| `while` 状态不变化 | 永远无法结束 | 明确每轮推进变量 |
| 用多个 `if` 表示互斥分支 | 可能命中多次 | 使用 `if/elif/else` |

## 自测

1. 打印 `1` 到 `100` 中所有能被 3 整除但不能被 5 整除的数。
2. 不使用 `max()`，求一个非空列表的最大值。
3. 给定有序数组和目标值，用双指针判断是否存在两数之和等于目标值。
4. 解释 `while left <= right` 与 `while left < right` 分别适合哪种区间定义。

---

[← 返回 Python 基础](../index.html) | [上一篇：变量与数据类型](../01-variables-types/index.html) | [下一篇：函数 →](../03-functions/index.html)
