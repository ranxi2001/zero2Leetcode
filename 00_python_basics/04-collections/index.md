---
layout: default
title: 集合类型
description: 系统掌握 Python list、tuple、dict、set、deque 及其复杂度
eyebrow: Python 基础 / 04
---

# 集合类型：算法中的数据容器

算法不仅关心“存什么”，还关心“怎样存”。同样一批数据，选择不同容器会让操作从 `O(n)` 变成 `O(1)`。

## 先看选择表

| 需求 | 推荐容器 | 典型复杂度 |
|------|----------|------------|
| 按下标访问、顺序遍历 | `list` | 下标访问 O(1) |
| 固定且不可修改的一组值 | `tuple` | 下标访问 O(1) |
| 根据 key 查 value | `dict` | 平均 O(1) |
| 去重、判断是否存在 | `set` | 平均 O(1) |
| 两端添加和删除 | `collections.deque` | 两端 O(1) |
| 频率统计 | `collections.Counter` | 构建 O(n) |

## list：动态数组

### 创建、访问与切片

```python
nums = [10, 20, 30]
nums[0]                 # 10
nums[-1]                # 30
nums[1:3]               # [20, 30]，新列表
nums[::-1]              # 反转后的新列表
```

下标必须在 `[-len(nums), len(nums)-1]` 范围内，否则抛出 `IndexError`。

### 添加、删除与查找

```python
nums.append(40)         # 末尾添加，均摊 O(1)
nums.extend([50, 60])   # 批量添加
last = nums.pop()       # 删除末尾，O(1)
first = nums.pop(0)     # 删除开头，O(n)
nums.insert(1, 99)      # 中间插入，O(n)
nums.remove(30)         # 查找并删除第一个 30，O(n)
30 in nums              # 存在性检查，O(n)
```

### 常见复杂度

| 操作 | 复杂度 | 原因 |
|------|--------|------|
| `nums[i]`、赋值 | O(1) | 连续内存，可直接定位 |
| `append/pop()` | 均摊 O(1) | 操作末尾 |
| 中间插入/删除 | O(n) | 后续元素需要移动 |
| `x in nums` | O(n) | 最坏需要全部扫描 |
| 切片 `nums[a:b]` | O(k) | 创建长度为 k 的新列表 |

### 别名、浅拷贝与二维数组陷阱

```python
a = [1, 2]
b = a                   # b 与 a 指向同一个列表
b.append(3)             # a 也变成 [1, 2, 3]

c = a[:]                # 新的外层列表
d = list(a)
```

错误的二维数组初始化：

```python
wrong = [[0] * 3] * 4
wrong[0][0] = 1         # 四行的第一个元素都会变成 1

correct = [[0] * 3 for _ in range(4)]
```

`*` 只是重复同一个内层列表引用；列表推导式每次创建新行。

### 列表推导式

```python
squares = [x * x for x in range(5)]
evens = [x for x in nums if x % 2 == 0]
matrix = [[row * cols + col for col in range(cols)] for row in range(rows)]
```

一层转换很适合推导式；包含复杂分支时用普通循环。

## tuple：不可变序列

```python
point = (3, 5)
x, y = point

single = (7,)           # 单元素元组必须有逗号
```

元组不可修改，因此可以作为字典 key 或集合元素：

```python
visited = {(0, 0)}
visited.add((1, 2))
```

网格搜索中常用坐标元组。列表 `[1, 2]` 不能放进 set，因为列表可变且不可哈希。

## dict：键值映射

```python
scores = {"Alice": 95, "Bob": 88}
scores["Alice"]               # key 不存在会抛 KeyError
scores.get("Carol", 0)        # 不存在时返回默认值
scores["Carol"] = 90
```

### 遍历

```python
for key in scores:
    print(key)

for key, value in scores.items():
    print(key, value)

for value in scores.values():
    print(value)
```

### 高频模式：计数、分组、记录位置

```python
# 计数
frequency = {}
for value in nums:
    frequency[value] = frequency.get(value, 0) + 1

# 分组
groups = {}
for word in words:
    key = "".join(sorted(word))
    groups.setdefault(key, []).append(word)

# 记录最后出现位置
last_position = {}
for index, value in enumerate(nums):
    last_position[value] = index
```

字典保持插入顺序，但算法正确性不应依赖哈希表“按大小排序”。

### 字典 key 的要求

key 必须可哈希，通常使用整数、字符串、元组。列表、字典、集合不能直接作为 key。

## set：只保存唯一元素

```python
seen = set()
seen.add(3)
seen.add(3)             # 仍然只有一个 3
3 in seen               # 平均 O(1)
seen.discard(9)         # 不存在也不会报错
```

### 集合运算

```python
a = {1, 2, 3}
b = {2, 3, 4}

a | b                   # 并集 {1, 2, 3, 4}
a & b                   # 交集 {2, 3}
a - b                   # 差集 {1}
a ^ b                   # 对称差 {1, 4}
a <= b                  # 是否为子集
```

需要输出有序结果时使用 `sorted(seen)`，不要依赖 set 的遍历顺序。

## deque：双端队列

列表适合做栈，但不适合频繁删除开头。BFS 应使用 `deque`。

```python
from collections import deque

queue = deque([1, 2])
queue.append(3)         # 右端加入
queue.appendleft(0)     # 左端加入
queue.pop()             # 右端删除
queue.popleft()         # 左端删除
```

两端添加和删除都是 O(1)。`list.pop(0)` 是 O(n)。

## Counter 与 defaultdict

### Counter

```python
from collections import Counter

count = Counter("banana")
count["a"]              # 3
count["x"]              # 0，不抛 KeyError
count.most_common(2)    # [('a', 3), ('n', 2)]
```

### defaultdict

```python
from collections import defaultdict

graph = defaultdict(list)
graph[1].append(2)
graph[1].append(3)

frequency = defaultdict(int)
frequency["apple"] += 1
```

读取不存在的 key 会自动创建默认值。若不希望读取时改变字典，使用普通 `dict.get()`。

## 排序容器中的数据

```python
items = [("apple", 3), ("banana", 1), ("pear", 3)]

# 数量降序，数量相同时名称升序
items.sort(key=lambda item: (-item[1], item[0]))
```

字典排序实际是在排序 `items()`：

```python
ordered = sorted(frequency.items(), key=lambda item: (-item[1], item[0]))
```

## 如何选容器

遇到题目时先问操作，而不是先猜数据结构：

1. 是否需要按下标访问？选 list。
2. 是否频繁判断元素存在？选 set。
3. 是否需要从 key 找 value？选 dict。
4. 是否从队头取元素？选 deque。
5. 是否要保留重复次数？选 Counter 或 dict。
6. 是否要把坐标放入 set？使用 tuple。

## 常见错误

| 错误 | 后果 | 正确做法 |
|------|------|----------|
| `matrix = [[0] * m] * n` | 多行联动 | 使用列表推导式 |
| 遍历 dict 时增删 key | 运行时错误 | 遍历 `list(d)` 或另存修改 |
| 用 list 做 BFS 队列 | `pop(0)` 导致 O(n²) | 使用 deque |
| 用 `d[key]` 查询可选 key | KeyError | 使用 `get` 或先判断 |
| 认为 set 有固定顺序 | 输出不稳定 | 输出前 sorted |

## 自测

1. 用 dict 统计数组频率，并输出频率最高的元素。
2. 用 set 判断数组是否存在重复元素。
3. 用 defaultdict(list) 按字符串长度分组。
4. 解释为什么网格坐标常用 tuple 而不是 list。

---

[← 返回 Python 基础](../index.html) | [上一篇：函数](../03-functions/index.html) | [下一篇：类与节点对象 →](../05-classes/index.html)
