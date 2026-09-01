---
layout: default
title: 输入输出与 ACM 模式
description: 从 input、split、map 到快速 IO、矩阵、多组用例和 EOF 的完整 Python 教程
eyebrow: Python 基础 / 06
---

# 输入输出与 ACM 模式

在 LeetCode 核心代码模式中，平台负责把输入变成参数；在 ACM 模式中，你必须完成完整流程：

```text
原始文本 -> 解析 token/行 -> 构造数据 -> 调用算法 -> 格式化输出
```

输入输出不是算法的附属细节。很多“看懂题但写不出来”的原因，其实是不知道怎样把题面数据变成 Python 对象。

## 先分清两种模式

### 核心代码模式

```python
def two_sum(nums, target):
    # nums 和 target 已经构造好
    ...
    return answer
```

### ACM 模式

```python
import sys

def solve():
    n, target = map(int, sys.stdin.buffer.readline().split())
    nums = list(map(int, sys.stdin.buffer.readline().split()))
    # 自己检查 nums 是否有 n 个元素
    answer = ...
    print(*answer)

if __name__ == "__main__":
    solve()
```

ACM 程序必须自己读取、计算并打印，通常没有平台提供的函数参数。

## input() 到底返回什么

`input()` 每次读取一行，去掉末尾换行，结果永远是字符串。

假设输入：

```text
42
```

```python
text = input()           # "42"，类型是 str
number = int(text)       # 42，类型是 int
```

直接写 `input() + 1` 会触发 TypeError，因为字符串不能和整数相加。

## split：把一行拆成多个字段

假设输入：

```text
10 20 30
```

```python
parts = input().split()              # ["10", "20", "30"]
numbers = list(map(int, parts))      # [10, 20, 30]
```

`split()` 不传参数时会按任意连续空白分隔，自动处理多个空格和行首行尾空格。通常不要写 `split(" ")`。

### 一行一个整数

```python
n = int(input())
```

### 一行多个整数

```python
n, m = map(int, input().split())
```

左右变量数量必须与输入字段数量相同。

### 一行数组

```python
nums = list(map(int, input().split()))
```

`map` 是惰性迭代器；需要下标、长度或多次遍历时转成 list。

### 字符串

```python
s = input()                 # 保留内部空格
s = input().strip()         # 额外去掉两端空白
characters = list(s)        # 字符列表
```

如果空格本身是有效数据，不要随意 `strip()`。

## 读取 n 行

### n 个整数，每行一个

```python
n = int(input())
nums = [int(input()) for _ in range(n)]
```

### n 行记录

输入：

```text
3
alice 90
bob 85
carol 92
```

```python
n = int(input())
records = []

for _ in range(n):
    name, score_text = input().split()
    records.append((name, int(score_text)))
```

## 矩阵与网格

### 整数矩阵

输入：

```text
3 4
1 2 3 4
5 6 7 8
9 10 11 12
```

```python
rows, cols = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(rows)]

for row in matrix:
    assert len(row) == cols
```

### 无空格字符网格

输入：

```text
3 4
..#.
.#..
....
```

```python
rows, cols = map(int, input().split())
grid = [list(input().strip()) for _ in range(rows)]
```

### 有空格字符或单词矩阵

```python
grid = [input().split() for _ in range(rows)]
```

先看样例中元素之间有没有空格，再决定使用 `list(input())` 还是 `input().split()`。

## 多组测试用例

### 第一行给 T

输入：

```text
2
3
1 2 3
4
1 2 3 4
```

```python
tests = int(input())
answers = []

for _ in range(tests):
    n = int(input())
    nums = list(map(int, input().split()))
    answers.append(str(sum(nums[:n])))

print("\n".join(answers))
```

每组数据都要重新初始化局部状态，避免上一组的数组、计数器或 visited 泄漏到下一组。

### 读取到 EOF

有些题没有 T，要求读到文件结束：

```python
import sys

for line in sys.stdin:
    if not line.strip():
        continue
    a, b = map(int, line.split())
    print(a + b)
```

不要用捕获所有异常的 `while True` 掩盖解析错误；按行遍历更清晰。

## 快速输入

`input()` 对一般题够用。数据很大时使用 `sys.stdin.buffer`。

### readline：仍按行读取

```python
import sys

input = sys.stdin.buffer.readline

n = int(input())
nums = list(map(int, input().split()))
```

这里读到的是 bytes，但 `int(b"42")` 可以直接转换。需要普通字符串时调用 `decode()`：

```python
name = input().decode().strip()
```

### read：一次读取全部 token

```python
import sys

tokens = sys.stdin.buffer.read().split()
numbers = list(map(int, tokens))
```

适合输入全部由空白分隔、无需保留行结构的题目。

## token 指针解析模板

一次读完后，用指针按题面顺序消费 token：

```python
import sys

def solve():
    data = sys.stdin.buffer.read().split()
    index = 0

    n = int(data[index])
    index += 1

    nums = list(map(int, data[index:index + n]))
    index += n

    m = int(data[index])
    index += 1

    edges = []
    for _ in range(m):
        u = int(data[index])
        v = int(data[index + 1])
        index += 2
        edges.append((u, v))

    print(sum(nums), len(edges))

if __name__ == "__main__":
    solve()
```

每解析一个字段就推进指针。复杂输入建议使用有意义的变量，不要把所有逻辑塞进一行。

## 输出语法

### 输出多个值

```python
print(a, b, c)                 # 默认用空格分隔
print(a, b, c, sep=",")        # 用逗号分隔
print(value, end=" ")          # 末尾不换行
```

### 输出数组

```python
answer = [1, 2, 3]
print(*answer)                  # 1 2 3
print(" ".join(map(str, answer)))
```

`print(*answer)` 简洁；大量输出时先拼字符串效率更稳定。

### 输出矩阵

```python
for row in matrix:
    print(*row)
```

### 批量输出

```python
answers = []
for case in cases:
    answers.append(str(solve_case(case)))

sys.stdout.write("\n".join(answers))
```

答案通常不应包含“结果是：”等额外说明。

## 浮点数输出

```python
value = 1 / 3
print(f"{value:.2f}")           # 0.33
print(f"{value:.6f}")           # 0.333333
```

先确认题面要求保留位数、绝对误差还是相对误差。

## 一个完整 ACM 示例

题意：给定 n 个整数，输出最大值、最小值和总和。

输入：

```text
5
3 1 4 1 5
```

代码：

```python
import sys

def solve():
    data = list(map(int, sys.stdin.buffer.read().split()))
    if not data:
        return

    n = data[0]
    nums = data[1:1 + n]

    maximum = max(nums)
    minimum = min(nums)
    total = sum(nums)
    print(maximum, minimum, total)

if __name__ == "__main__":
    solve()
```

这段程序的边界职责很明确：

1. `solve` 外只负责启动。
2. 开头负责解析。
3. 中间负责算法。
4. 末尾负责输出。

## 高频输入结构速查

| 题面格式 | 读取方式 |
|----------|----------|
| 单整数 | `n = int(input())` |
| 一行整数 | `a, b = map(int, input().split())` |
| 一行数组 | `nums = list(map(int, input().split()))` |
| n 行数组 | `[list(map(int, input().split())) for _ in range(n)]` |
| 无空格网格 | `[list(input().strip()) for _ in range(n)]` |
| T 组数据 | `for _ in range(int(input()))` |
| 直到 EOF | `for line in sys.stdin` |
| 超大 token 输入 | `sys.stdin.buffer.read().split()` |

## 常见错误

| 现象 | 原因 |
|------|------|
| ValueError: invalid literal for int | 读到了空字符串或非数字 |
| not enough values to unpack | 变量数量多于本行字段 |
| 输入明明有数据却读不到 | 多读了一行，或混用 read 与 readline |
| 输出 WA 但数值正确 | 多余文字、空格、换行或顺序错误 |
| T 组数据后答案互相影响 | 状态没有在每组重新初始化 |
| 大输入超时 | 逐行 input 过慢或频繁 print |

## 推荐的解题顺序

1. 只根据题面写出输入结构注释。
2. 用样例验证解析后的 Python 对象。
3. 单独写算法函数并测试。
4. 把算法接回 `solve()`。
5. 最后严格按格式输出。

不要一边猜输入一边写算法；先确保“读对了”。

## 自测

1. 读取 n 个学生的姓名和成绩，按成绩降序输出。
2. 读取一个字符网格，统计字符 `#` 的数量。
3. 读取 T 组数组，分别输出每组最大子段和。
4. 使用 token 指针读取 n 个点和 m 条边。

---

[← 返回 Python 基础](../index.html) | [上一篇：刷题工具与调试](../05-coding-tricks/index.html) | [下一章：数据结构 →]({{ '/01_data_structures/' | relative_url }})
