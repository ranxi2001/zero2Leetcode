---
layout: default
title: 变量与数据类型
description: 从对象、赋值和运算开始，掌握 Python 数字、字符串、布尔值与类型转换
eyebrow: Python 基础 / 01
---

# 变量与数据类型

变量不是装数据的盒子，而是指向 Python 对象的名字：

```python
score = 90
name = "Alice"
```

`score` 指向整数对象 90，`name` 指向字符串对象。重新赋值只是让名字改为指向另一个对象。

## 命名与赋值

```python
student_count = 30       # 推荐：小写 + 下划线
MAX_SIZE = 100_000       # 常量约定使用大写

left = right = 0
minimum, maximum = 1, 10
```

变量名不能以数字开头，不能使用 `for`、`if`、`class` 等关键字，也不要覆盖 `list`、`sum`、`str` 等内置名称。

## 查看类型

```python
type(42)                 # int
type(3.14)               # float
type("hello")            # str
type(True)               # bool
type(None)               # NoneType

isinstance(42, int)      # True
```

刷题时通常不需要频繁判断类型，但报错时 `type(value)` 能快速确认实际数据。

## 整数 int

Python 整数没有 32 位溢出限制，会自动扩展：

```python
positive = 25
negative = -10
million = 1_000_000
very_large = 10 ** 100
```

### 常用运算

```python
7 + 3       # 10
7 - 3       # 4
7 * 3       # 21
7 / 3       # 2.333...，普通除法总是得到 float
7 // 3      # 2，向下整除
7 % 3       # 1，余数
7 ** 3      # 343，幂
```

商和余数可以一起求：

```python
quotient, remainder = divmod(17, 5)
```

### 负数整除

```python
-3 // 2       # -2，向负无穷方向取整
int(-3 / 2)   # -1，向 0 截断
```

涉及负数时，先确认题目需要哪一种规则。

## 浮点数 float

```python
price = 19.99
ratio = 1 / 3
scientific = 1.5e6
```

二进制浮点不能精确表示所有十进制小数：

```python
0.1 + 0.2 == 0.3        # False
```

比较计算结果时使用误差：

```python
from math import isclose

isclose(0.1 + 0.2, 0.3)
abs(actual - expected) < 1e-9
```

金额题如果要求精确到分，常把元转换为整数分处理。

## 布尔值 bool

```python
is_valid = True
is_empty = False

3 < 5                    # True
3 == 5                   # False
3 != 5                   # True
```

`and` 和 `or` 会短路：

```python
if index < len(nums) and nums[index] == target:
    ...
```

如果前半部分为 False，后半部分不会执行，因此不会越界。

## None：表示没有结果

```python
answer = None

if answer is None:
    print("还没有答案")
```

判断 None 使用 `is None` 或 `is not None`，不要写 `== None`。

None 与 0、空字符串含义不同：

- None：没有值。
- 0：有一个数值，值为零。
- "": 有一个字符串，只是长度为零。

## 字符串 str

```python
single = 'hello'
double = "hello"
multiline = """first line
second line"""
```

### 转义字符

```python
text = "line 1\nline 2"
tabbed = "a\tb"
quote = "She said \"hello\""
path = r"C:\new\test"       # 原始字符串
```

### 索引与切片

```python
s = "algorithm"

len(s)              # 9
s[0]                # 'a'
s[-1]               # 'm'
s[1:4]              # 'lgo'
s[:4]               # 'algo'
s[4:]               # 'rithm'
s[::2]              # 每隔一个字符
s[::-1]             # 反转
```

切片是左闭右开 `[start, stop)`，不会修改原字符串。

### 字符串不可变

```python
s = "cat"
# s[0] = "b"        # TypeError
s = "b" + s[1:]     # 创建新字符串 "bat"
```

循环中反复 `result += character` 可能产生大量新字符串。大量拼接优先收集到列表，最后 join。

### 分割与连接

```python
line = "10  20 30"
parts = line.split()             # ["10", "20", "30"]
csv_parts = "a,b,c".split(",")

words = ["hello", "python"]
sentence = " ".join(words)
```

`split()` 不传参数时会合并连续空白，是 ACM 输入解析的常用写法。

### 查找、替换与判断

```python
s = "Hello Python"

s.lower()                        # "hello python"
s.upper()
s.startswith("Hello")
s.endswith("Python")
"Python" in s
s.find("Python")                 # 6，不存在返回 -1
s.replace("Python", "World")
"123".isdigit()
"abc".isalpha()
"abc123".isalnum()
```

### f-string

```python
name = "Alice"
score = 95
message = f"{name} scored {score}"

value = 1 / 3
formatted = f"{value:.2f}"       # "0.33"
```

ACM 输出必须严格按题面格式，不要额外添加说明文字。

## 类型转换

```python
int("123")               # 123
float("3.14")            # 3.14
str(123)                 # "123"
list("abc")              # ["a", "b", "c"]
tuple([1, 2])            # (1, 2)
set([1, 1, 2])           # {1, 2}
```

不能直接 `int("3.14")`，应先转 float 或根据题意处理。

不同进制：

```python
int("1010", 2)           # 10
int("ff", 16)            # 255
bin(10)                  # "0b1010"
hex(255)                 # "0xff"
```

## 可变与不可变

| 类型 | 是否可变 |
|------|----------|
| int、float、bool、str、tuple、None | 不可变 |
| list、dict、set | 可变 |

可变性决定函数调用、复制和哈希表 key 的行为。后面的函数与集合教程会继续展开。

## 常见错误

| 错误 | 原因 |
|------|------|
| `"2" + 3` | 字符串与整数不能直接相加 |
| 用 `/` 计算数组下标 | 结果是 float，应使用 `//` |
| `0.1 + 0.2 == 0.3` | 浮点表示误差 |
| 修改 `s[0]` | 字符串不可变 |
| 把变量命名为 `list`、`sum` | 覆盖内置函数 |
| 用 `== None` | 应使用 `is None` |

## 自测

1. 解释 `/`、`//` 和 `%` 的区别。
2. 把秒数转换为“小时、分钟、秒”。
3. 判断一个字符串是否只包含十进制数字。
4. 将十六进制字符串 `"1a"` 转换为整数。
5. 解释为什么字符串可以作为 dict key，而列表不行。

---

[← 返回 Python 基础](../index.html) | [下一篇：控制流 →](../02-control-flow/index.html)
