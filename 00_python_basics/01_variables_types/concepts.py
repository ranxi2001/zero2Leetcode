"""
Python 基础：变量与数据类型

本模块涵盖:
1. 基本数据类型
2. 类型转换
3. 字符串操作
"""

# ============================================
# 1. 基本数据类型
# ============================================

# 整数 int
age = 25
negative = -10
big_number = 1_000_000  # 可用下划线分隔，提高可读性

print(f"整数: age = {age}, type = {type(age)}")

# 浮点数 float
price = 19.99
pi = 3.14159

print(f"浮点数: price = {price}, type = {type(price)}")

# 字符串 str
name = "Alice"
greeting = 'Hello, World!'
multiline = """
这是一个
多行字符串
"""

print(f"字符串: name = {name}, type = {type(name)}")

# 布尔值 bool
is_valid = True
is_empty = False

print(f"布尔值: is_valid = {is_valid}, type = {type(is_valid)}")

# None 类型（表示空值）
result = None
print(f"空值: result = {result}, type = {type(result)}")


# ============================================
# 2. 类型转换
# ============================================

print("\n--- 类型转换 ---")

# 字符串转整数
num_str = "123"
num_int = int(num_str)
print(f'int("123") = {num_int}')

# 整数转字符串
age_str = str(age)
print(f'str(25) = "{age_str}"')

# 字符串转浮点数
price_str = "19.99"
price_float = float(price_str)
print(f'float("19.99") = {price_float}')

# 数值转布尔值
# 0, 0.0, "", [], {}, None 转为 False，其他转为 True
print(f"bool(0) = {bool(0)}")
print(f"bool(1) = {bool(1)}")
print(f'bool("") = {bool("")}')
print(f'bool("hello") = {bool("hello")}')


# ============================================
# 3. 字符串操作（刷题常用！）
# ============================================

print("\n--- 字符串操作 ---")

s = "hello world"

# 长度
print(f"len('{s}') = {len(s)}")

# 索引访问
print(f"s[0] = '{s[0]}'")  # 第一个字符
print(f"s[-1] = '{s[-1]}'")  # 最后一个字符

# 切片
print(f"s[0:5] = '{s[0:5]}'")  # 前5个字符
print(f"s[6:] = '{s[6:]}'")  # 第6个到结尾
print(f"s[::-1] = '{s[::-1]}'")  # 反转字符串

# 分割
words = s.split(" ")
print(f"s.split(' ') = {words}")

# 连接
joined = "-".join(words)
print(f"'-'.join(words) = '{joined}'")

# 替换
replaced = s.replace("world", "python")
print(f"s.replace('world', 'python') = '{replaced}'")

# 查找
index = s.find("world")
print(f"s.find('world') = {index}")

# 大小写
print(f"s.upper() = '{s.upper()}'")
print(f"s.lower() = '{s.lower()}'")
print(f"s.capitalize() = '{s.capitalize()}'")

# 去空格
padded = "  hello  "
print(f"'  hello  '.strip() = '{padded.strip()}'")

# 判断
print(f"'abc'.isalpha() = {'abc'.isalpha()}")
print(f"'123'.isdigit() = {'123'.isdigit()}")
print(f"'abc123'.isalnum() = {'abc123'.isalnum()}")


# ============================================
# 练习题
# ============================================

print("\n--- 练习题 ---")

# 练习1: 将字符串 "12345" 转换为整数并求和
s1 = "12345"
total = sum(int(c) for c in s1)
print(f"练习1: '{s1}' 各位数字之和 = {total}")

# 练习2: 判断一个字符串是否是回文
def is_palindrome(s):
    return s == s[::-1]

print(f"练习2: 'racecar' 是回文? {is_palindrome('racecar')}")
print(f"练习2: 'hello' 是回文? {is_palindrome('hello')}")

# 练习3: 统计字符串中每个字符出现的次数
s3 = "aabbccc"
count = {}
for c in s3:
    count[c] = count.get(c, 0) + 1
print(f"练习3: '{s3}' 字符统计 = {count}")
