# 复杂度分析入门

> 面试必问：你的解法时间复杂度是多少？

## 什么是复杂度？

复杂度描述了算法**执行时间**或**占用空间**如何随输入规模增长而变化。

---

## 时间复杂度

### 常见时间复杂度（从快到慢）

| 符号 | 名称 | 例子 |
|------|------|------|
| O(1) | 常数 | 数组随机访问 |
| O(log n) | 对数 | 二分查找 |
| O(n) | 线性 | 遍历数组 |
| O(n log n) | 线性对数 | 快速排序、归并排序 |
| O(n²) | 平方 | 双重循环、冒泡排序 |
| O(2ⁿ) | 指数 | 暴力递归（斐波那契） |
| O(n!) | 阶乘 | 全排列 |

### 如何分析？

**规则 1：只保留最高阶**
```python
# O(n) + O(n²) = O(n²)
for i in range(n):      # O(n)
    pass
for i in range(n):      # O(n²)
    for j in range(n):
        pass
```

**规则 2：忽略常数系数**
```python
# O(3n) = O(n)
for i in range(n): pass
for i in range(n): pass
for i in range(n): pass
```

**规则 3：嵌套循环相乘**
```python
# O(n * m)
for i in range(n):
    for j in range(m):
        pass
```

### 实例分析

```python
# 例1: O(n)
def find_max(arr):
    max_val = arr[0]
    for x in arr:       # 遍历一次
        max_val = max(max_val, x)
    return max_val

# 例2: O(n²)
def has_duplicate(arr):
    for i in range(len(arr)):
        for j in range(i+1, len(arr)):  # 双重循环
            if arr[i] == arr[j]:
                return True
    return False

# 例3: O(log n)
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:   # 每次排除一半
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
```

---

## 空间复杂度

描述算法**额外使用的内存**。

| 符号 | 例子 |
|------|------|
| O(1) | 只用几个变量 |
| O(n) | 创建与输入等长的数组 |
| O(n²) | 创建 n×n 的矩阵 |

### 实例分析

```python
# 例1: O(1) - 原地操作
def reverse_array(arr):
    left, right = 0, len(arr) - 1
    while left < right:
        arr[left], arr[right] = arr[right], arr[left]
        left += 1
        right -= 1

# 例2: O(n) - 额外数组
def copy_array(arr):
    result = []
    for x in arr:
        result.append(x)
    return result

# 例3: O(h) - 递归栈空间，h 是树的高度
def tree_height(root):
    if not root:
        return 0
    return 1 + max(tree_height(root.left), 
                   tree_height(root.right))
```

---

## 常见算法复杂度速查

| 算法 | 时间 | 空间 |
|------|------|------|
| 数组遍历 | O(n) | O(1) |
| 二分查找 | O(log n) | O(1) |
| 快速排序 | O(n log n) | O(log n) |
| 归并排序 | O(n log n) | O(n) |
| BFS/DFS | O(V + E) | O(V) |
| 动态规划 | O(n²) 或更低 | O(n) |

---

## 面试技巧

1. **写完代码后主动分析**：不等面试官问就说
2. **说明最坏/平均情况**：如快排最坏 O(n²)，平均 O(n log n)
3. **讨论优化空间**：能否用空间换时间？能否原地操作？
