"""
Python 基础：集合类型

本模块涵盖 LeetCode 最常用的四种集合类型:
1. 列表 list - 有序可变
2. 字典 dict - 键值对
3. 集合 set - 无序去重
4. 元组 tuple - 有序不可变
"""

# ============================================
# 1. 列表 list（使用最频繁！）
# ============================================

print("=" * 50)
print("列表 list")
print("=" * 50)

# 创建
nums = [1, 2, 3, 4, 5]
empty = []
mixed = [1, "hello", True, 3.14]

# 访问
print(f"nums[0] = {nums[0]}")      # 第一个
print(f"nums[-1] = {nums[-1]}")    # 最后一个
print(f"nums[1:3] = {nums[1:3]}")  # 切片

# 添加元素
nums.append(6)          # 末尾添加
print(f"append(6): {nums}")

nums.insert(0, 0)       # 指定位置插入
print(f"insert(0, 0): {nums}")

# 删除元素
nums.pop()              # 删除末尾
print(f"pop(): {nums}")

nums.pop(0)             # 删除指定索引
print(f"pop(0): {nums}")

nums.remove(3)          # 删除指定值
print(f"remove(3): {nums}")

# 查找
print(f"4 in nums: {4 in nums}")
print(f"nums.index(4): {nums.index(4)}")

# 排序
nums = [3, 1, 4, 1, 5, 9]
nums.sort()             # 原地排序
print(f"sort(): {nums}")

nums.sort(reverse=True) # 降序
print(f"sort(reverse=True): {nums}")

# sorted() 返回新列表，不修改原列表
original = [3, 1, 4]
sorted_list = sorted(original)
print(f"sorted({original}) = {sorted_list}")

# 列表推导式（非常重要！）
squares = [x**2 for x in range(5)]
print(f"[x**2 for x in range(5)] = {squares}")

evens = [x for x in range(10) if x % 2 == 0]
print(f"[x for x in range(10) if x % 2 == 0] = {evens}")


# ============================================
# 2. 字典 dict（刷题必备！）
# ============================================

print("\n" + "=" * 50)
print("字典 dict")
print("=" * 50)

# 创建
person = {"name": "Alice", "age": 25}
empty_dict = {}

# 访问
print(f"person['name'] = {person['name']}")
print(f"person.get('age') = {person.get('age')}")
print(f"person.get('city', 'Unknown') = {person.get('city', 'Unknown')}")  # 默认值

# 添加/修改
person["city"] = "Beijing"
person["age"] = 26
print(f"添加/修改后: {person}")

# 删除
del person["city"]
print(f"del person['city']: {person}")

# 遍历
print("遍历 keys:")
for key in person:
    print(f"  {key}: {person[key]}")

print("遍历 items:")
for key, value in person.items():
    print(f"  {key}: {value}")

# 常用方法
print(f"person.keys() = {list(person.keys())}")
print(f"person.values() = {list(person.values())}")
print(f"'name' in person = {'name' in person}")

# 计数模式（刷题常用！）
from collections import Counter

arr = ['a', 'b', 'a', 'c', 'a', 'b']
count = Counter(arr)
print(f"Counter({arr}) = {count}")

# defaultdict（避免 KeyError）
from collections import defaultdict

dd = defaultdict(list)
dd['a'].append(1)
dd['a'].append(2)
dd['b'].append(3)
print(f"defaultdict(list): {dict(dd)}")


# ============================================
# 3. 集合 set
# ============================================

print("\n" + "=" * 50)
print("集合 set")
print("=" * 50)

# 创建
s = {1, 2, 3, 4, 5}
empty_set = set()  # 注意：{} 是空字典！

# 从列表创建（去重）
nums = [1, 2, 2, 3, 3, 3]
unique = set(nums)
print(f"set({nums}) = {unique}")

# 添加/删除
s.add(6)
print(f"add(6): {s}")

s.remove(1)  # 不存在会报错
print(f"remove(1): {s}")

s.discard(100)  # 不存在不报错
print(f"discard(100): {s}")

# 集合运算
a = {1, 2, 3}
b = {2, 3, 4}

print(f"a | b (并集) = {a | b}")
print(f"a & b (交集) = {a & b}")
print(f"a - b (差集) = {a - b}")

# 成员检查 O(1)
print(f"2 in {a}: {2 in a}")


# ============================================
# 4. 元组 tuple
# ============================================

print("\n" + "=" * 50)
print("元组 tuple")
print("=" * 50)

# 创建（不可变）
point = (3, 4)
single = (1,)  # 单元素元组需要逗号

# 访问
print(f"point[0] = {point[0]}")
print(f"point[1] = {point[1]}")

# 解包
x, y = point
print(f"x, y = {x}, {y}")

# 可作为字典的 key（因为不可变）
locations = {}
locations[(0, 0)] = "origin"
locations[(1, 2)] = "point A"
print(f"locations: {locations}")


# ============================================
# 刷题常用技巧总结
# ============================================

print("\n" + "=" * 50)
print("刷题常用技巧")
print("=" * 50)

# 1. enumerate 同时获取索引和值
nums = ['a', 'b', 'c']
for i, val in enumerate(nums):
    print(f"  索引 {i}: {val}")

# 2. zip 并行遍历多个列表
list1 = [1, 2, 3]
list2 = ['a', 'b', 'c']
for x, y in zip(list1, list2):
    print(f"  {x} - {y}")

# 3. 快速反转
nums = [1, 2, 3, 4, 5]
print(f"反转 nums[::-1] = {nums[::-1]}")

# 4. 二维数组创建
rows, cols = 3, 4
matrix = [[0] * cols for _ in range(rows)]
print(f"3x4 矩阵: {matrix}")

# 5. 字典统计
text = "hello"
freq = {}
for c in text:
    freq[c] = freq.get(c, 0) + 1
print(f"字符频率: {freq}")
