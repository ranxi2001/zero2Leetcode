---
layout: default
title: 函数
description: 掌握 Python 函数、参数、返回值、作用域、递归与刷题代码组织
eyebrow: Python 基础 / 03
---

# 函数：把一段逻辑变成可复用工具

函数接收输入，完成一项明确任务，并返回输出。刷题时，题目通常已经给出函数签名，你需要补全函数体。

```python
def add(a, b):
    result = a + b
    return result

answer = add(3, 5)       # 8
```

## 函数的四个部分

```python
def find_max(nums):      # 1. 函数名与参数
    best = nums[0]       # 2. 局部变量
    for value in nums:   # 3. 函数体
        if value > best:
            best = value
    return best           # 4. 返回值
```

- **函数名**说明它做什么，通常使用小写下划线命名。
- **参数**是调用者传入的数据。
- **函数体**只在调用函数时执行。
- **return** 把结果交还给调用者，并立即结束函数。

## return 与 print 不一样

```python
def wrong_add(a, b):
    print(a + b)          # 只显示，调用结果是 None

def correct_add(a, b):
    return a + b          # 可以继续参与计算

x = wrong_add(2, 3)       # 屏幕显示 5，但 x 是 None
y = correct_add(2, 3)     # y 是 5
```

LeetCode 核心代码模式要求 `return`；ACM 模式通常在 `solve()` 中计算，最后 `print()`。

## 参数的传递方式

### 位置参数与关键字参数

```python
def power(base, exponent):
    return base ** exponent

power(2, 3)
power(base=2, exponent=3)
power(2, exponent=3)
```

### 默认参数

```python
def clamp(value, lower=0, upper=100):
    return max(lower, min(value, upper))

clamp(120)             # 100
clamp(-5, lower=-2)    # -2
```

默认参数必须写在非默认参数后面。不要把可变对象作为默认值：

```python
# 错误：多次调用会共享同一个列表
def append_value(value, result=[]):
    result.append(value)
    return result

# 正确
def append_value(value, result=None):
    if result is None:
        result = []
    result.append(value)
    return result
```

### 可变数量参数

```python
def total(*numbers):
    return sum(numbers)

total(1, 2, 3)         # numbers 是元组 (1, 2, 3)

def show(**options):
    return options

show(color="red", size=10)  # options 是字典
```

刷题中不常定义 `*args`、`**kwargs`，但阅读库函数时会遇到。

## 多返回值与解包

Python 实际返回的是一个元组：

```python
def min_max(nums):
    return min(nums), max(nums)

smallest, largest = min_max([3, 1, 8])
left, right = right, left
```

## 可变对象与引用

Python 参数传递的是对象引用。整数和字符串不可变；列表、字典、集合可变。

```python
def change_number(number):
    number += 1          # 创建新的整数，不影响外部

def change_list(nums):
    nums.append(99)      # 修改同一个列表，外部可见

x = 10
values = [1, 2]
change_number(x)         # x 仍是 10
change_list(values)      # values 变成 [1, 2, 99]
```

原地题目要求修改传入数组；其他题目如果不希望影响输入，应先复制：

```python
copied = nums[:]
copied = list(nums)
```

## 作用域

函数内部定义的变量默认是局部变量。

```python
count = 10

def work():
    count = 3            # 新的局部变量
    return count

work()                   # 3
count                    # 10
```

递归和回溯中常用闭包保存答案：

```python
def tree_sum(root):
    total = 0

    def dfs(node):
        nonlocal total
        if node is None:
            return
        total += node.val
        dfs(node.left)
        dfs(node.right)

    dfs(root)
    return total
```

能用返回值表达时优先使用返回值，减少 `global` 和 `nonlocal` 带来的状态混乱。

## Lambda 与 key 函数

Lambda 是只包含一个表达式的匿名函数：

```python
square = lambda x: x * x
square(4)                        # 16

intervals = [(1, 5), (2, 3), (1, 2)]
intervals.sort(key=lambda item: (item[0], item[1]))
```

复杂逻辑应写普通函数：

```python
def sort_key(item):
    start, end = item
    return start, -end

intervals.sort(key=sort_key)
```

注意传递函数时不加括号：`key=sort_key` 是把函数交给排序；`key=sort_key()` 是立刻调用。

## 递归

递归函数直接或间接调用自己。必须有：

1. **终止条件**：最小问题直接返回。
2. **递归关系**：把当前问题缩小。

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
```

执行 `factorial(4)` 时，调用栈为：

```text
factorial(4)
  factorial(3)
    factorial(2)
      factorial(1) -> 1
    -> 2
  -> 6
-> 24
```

### 递归处理树

```python
def max_depth(root):
    if root is None:
        return 0
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    return max(left_depth, right_depth) + 1
```

递归深度过大可能触发 `RecursionError`。链式结构或大图优先考虑显式栈。

## 核心代码模式与 ACM 模式

### LeetCode 核心代码

```python
def two_sum(nums, target):
    seen = {}
    for index, value in enumerate(nums):
        if target - value in seen:
            return [seen[target - value], index]
        seen[value] = index
    return []
```

平台负责构造参数、调用函数和检查返回值。

### ACM 完整程序

```python
import sys

def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    n = data[0]
    nums = data[1:1 + n]
    print(sum(nums))

if __name__ == "__main__":
    solve()
```

你需要自己读取输入、构造数据、调用算法并输出答案。输入输出教程会完整讲解。

## 函数设计检查表

- 一个函数是否只做一件事？
- 参数名是否表达含义？
- 所有分支是否都有正确返回值？
- 是否无意修改了传入列表？
- 递归是否一定能到达终止条件？
- 函数返回的是结果，还是只打印了结果？

## 自测

1. 写 `count_even(nums)` 返回偶数个数。
2. 写 `divide(a, b)`，当 `b == 0` 时返回 `None`。
3. 写递归函数求列表元素和。
4. 分别用返回值和 `nonlocal` 实现二叉树节点计数，比较可读性。

---

[← 返回 Python 基础](../index.html) | [上一篇：控制流](../02-control-flow/index.html) | [下一篇：集合类型 →](../04-collections/index.html)
