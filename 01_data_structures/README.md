# 第二阶段：数据结构

> 🎯 目标：掌握面试高频数据结构的实现与应用
> ⏱️ 预计时间：2-3 周

## 学习模块

### 01. 数组与字符串 `./01_array_string/`
**核心知识点：**
- 数组遍历与原地操作
- 双指针技巧（对撞指针、快慢指针）
- 字符串处理

**LeetCode 高频题：**
- [283. 移动零](https://leetcode.cn/problems/move-zeroes/)
- [11. 盛最多水的容器](https://leetcode.cn/problems/container-with-most-water/)
- [15. 三数之和](https://leetcode.cn/problems/3sum/)

---

### 02. 链表 `./02_linked_list/`
**核心知识点：**
- 单链表 vs 双链表
- 虚拟头节点（dummy node）
- 快慢指针找环、找中点
- 链表反转

**Python 链表节点定义：**
```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
```

**LeetCode 高频题：**
- [206. 反转链表](https://leetcode.cn/problems/reverse-linked-list/)
- [141. 环形链表](https://leetcode.cn/problems/linked-list-cycle/)
- [21. 合并两个有序链表](https://leetcode.cn/problems/merge-two-sorted-lists/)

---

### 03. 栈与队列 `./03_stack_queue/`
**核心知识点：**
- 栈：LIFO（后进先出）
- 队列：FIFO（先进先出）
- 单调栈：维护单调性
- 优先队列（堆）

**Python 实现：**
```python
# 栈 - 使用 list
stack = []
stack.append(x)  # 入栈
stack.pop()      # 出栈

# 队列 - 使用 deque
from collections import deque
queue = deque()
queue.append(x)    # 入队
queue.popleft()    # 出队

# 优先队列 - 使用 heapq
import heapq
heap = []
heapq.heappush(heap, x)
heapq.heappop(heap)
```

**LeetCode 高频题：**
- [20. 有效的括号](https://leetcode.cn/problems/valid-parentheses/)
- [739. 每日温度](https://leetcode.cn/problems/daily-temperatures/)
- [155. 最小栈](https://leetcode.cn/problems/min-stack/)

---

### 04. 哈希表 `./04_hash_table/`
**核心知识点：**
- O(1) 查找
- 计数与去重
- 两数之和模式

**Python 实现：**
```python
# 字典 dict
hashmap = {}
hashmap[key] = value
if key in hashmap: ...

# Counter 快速计数
from collections import Counter
count = Counter(arr)

# defaultdict 默认值
from collections import defaultdict
graph = defaultdict(list)
```

**LeetCode 高频题：**
- [1. 两数之和](https://leetcode.cn/problems/two-sum/)
- [49. 字母异位词分组](https://leetcode.cn/problems/group-anagrams/)
- [128. 最长连续序列](https://leetcode.cn/problems/longest-consecutive-sequence/)

---

### 05. 树与二叉树 `./05_tree/`
**核心知识点：**
- 二叉树遍历：前序、中序、后序、层序
- 递归思维
- 二叉搜索树（BST）

**Python 节点定义：**
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

**三种遍历模板：**
```python
# 前序遍历：根 -> 左 -> 右
def preorder(root):
    if not root: return
    print(root.val)
    preorder(root.left)
    preorder(root.right)

# 中序遍历：左 -> 根 -> 右
def inorder(root):
    if not root: return
    inorder(root.left)
    print(root.val)
    inorder(root.right)

# 后序遍历：左 -> 右 -> 根
def postorder(root):
    if not root: return
    postorder(root.left)
    postorder(root.right)
    print(root.val)
```

**LeetCode 高频题：**
- [94. 二叉树的中序遍历](https://leetcode.cn/problems/binary-tree-inorder-traversal/)
- [104. 二叉树的最大深度](https://leetcode.cn/problems/maximum-depth-of-binary-tree/)
- [102. 二叉树的层序遍历](https://leetcode.cn/problems/binary-tree-level-order-traversal/)

---

### 06. 堆 `./06_heap/`
**核心知识点：**
- 最小堆 / 最大堆
- TopK 问题
- 堆排序

**Python 实现（默认最小堆）：**
```python
import heapq

# 最小堆
min_heap = []
heapq.heappush(min_heap, 3)
heapq.heappop(min_heap)

# 最大堆（取负）
max_heap = []
heapq.heappush(max_heap, -3)
-heapq.heappop(max_heap)

# nlargest / nsmallest
heapq.nlargest(k, arr)
heapq.nsmallest(k, arr)
```

**LeetCode 高频题：**
- [215. 数组中的第K个最大元素](https://leetcode.cn/problems/kth-largest-element-in-an-array/)
- [347. 前 K 个高频元素](https://leetcode.cn/problems/top-k-frequent-elements/)

---

### 07. 图 `./07_graph/`
**核心知识点：**
- 图的表示：邻接表、邻接矩阵
- DFS / BFS 遍历
- 拓扑排序

**邻接表表示：**
```python
from collections import defaultdict

graph = defaultdict(list)
graph[u].append(v)  # u -> v 的边
```

**LeetCode 高频题：**
- [200. 岛屿数量](https://leetcode.cn/problems/number-of-islands/)
- [207. 课程表](https://leetcode.cn/problems/course-schedule/)

---

## 学习建议

1. **先理解概念**：每个数据结构先理解其特点和适用场景
2. **手写实现**：尝试从零实现链表、栈、二叉树等
3. **刷题巩固**：每个模块配套 3-5 道 LeetCode 题目
4. **画图辅助**：链表、树的题目一定要画图
