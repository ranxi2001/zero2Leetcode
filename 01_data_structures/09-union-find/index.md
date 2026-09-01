---
layout: default
title: 并查集
description: 并查集的 parent、路径压缩、按大小合并与连通性应用
eyebrow: 数据结构 / 09
---

# 并查集：动态维护分组关系

并查集（Disjoint Set Union，DSU）维护若干互不相交的集合，支持两个核心操作：

- `find(x)`：x 属于哪个集合？
- `union(a, b)`：合并 a 和 b 所在集合。

它擅长回答“两个节点是否连通”，但不负责给出两点之间的具体路径。

## 用 parent 表示集合

每个集合用一棵树表示，根节点是代表。初始时每个元素自成一组：

```python
parent = list(range(n))
# parent[i] == i 表示 i 是根
```

最基础的 find：

```python
def find(x):
    while parent[x] != x:
        x = parent[x]
    return x
```

## 路径压缩

查询时让沿途节点直接指向根，后续查询会非常快。

### 递归写法

```python
def find(x):
    if parent[x] != x:
        parent[x] = find(parent[x])
    return parent[x]
```

### 迭代写法

```python
def find(x):
    root = x
    while parent[root] != root:
        root = parent[root]

    while parent[x] != x:
        next_node = parent[x]
        parent[x] = root
        x = next_node

    return root
```

## 按大小合并

总让小树挂到大树根下，避免树退化成链。

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.components = n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        root_a = self.find(a)
        root_b = self.find(b)

        if root_a == root_b:
            return False

        if self.size[root_a] < self.size[root_b]:
            root_a, root_b = root_b, root_a

        self.parent[root_b] = root_a
        self.size[root_a] += self.size[root_b]
        self.components -= 1
        return True

    def connected(self, a, b):
        return self.find(a) == self.find(b)

    def component_size(self, x):
        return self.size[self.find(x)]
```

`union` 返回 False 表示两点原本已连通，这对检测环很有用。

## 复杂度

路径压缩 + 按大小合并后，单次操作的均摊复杂度是 `O(α(n))`。`α` 是反阿克曼函数，在现实数据规模下可以看作小于 5，近似常数。

空间复杂度为 O(n)。

## 应用一：统计连通分量

```python
def count_components(n, edges):
    union_find = UnionFind(n)
    for u, v in edges:
        union_find.union(u, v)
    return union_find.components
```

## 应用二：无向图检测环

逐条加入边。如果某条边两端已经连通，再加入这条边就形成环。

```python
def contains_cycle(n, edges):
    union_find = UnionFind(n)

    for u, v in edges:
        if not union_find.union(u, v):
            return True

    return False
```

## 应用三：Kruskal 最小生成树

按边权从小到大尝试加入；只有连接两个不同集合的边才加入答案。

```python
def minimum_spanning_tree(n, edges):
    # edge = (weight, u, v)
    edges.sort()
    union_find = UnionFind(n)
    total_weight = 0
    used_edges = 0

    for weight, u, v in edges:
        if union_find.union(u, v):
            total_weight += weight
            used_edges += 1

    if used_edges != n - 1:
        return None
    return total_weight
```

## 字符串或稀疏节点

可以先离散化：

```python
names = ["alice", "bob", "carol"]
node_id = {name: index for index, name in enumerate(names)}

union_find.union(node_id["alice"], node_id["bob"])
```

也可以写 dict 版 parent，但连续整数数组通常更高效。

## 并查集与 DFS/BFS 的区别

| 需求 | 推荐 |
|------|------|
| 静态图遍历、需要具体路径 | DFS/BFS |
| 边不断加入、反复问是否连通 | 并查集 |
| 删除边后动态连通 | 普通并查集不直接支持 |
| 无权最短路径 | BFS |
| Kruskal 最小生成树 | 并查集 |

## 常见错误

- 合并 `a` 和 `b` 本身，而不是它们的根。
- `size` 更新到非根节点。
- 忘记路径压缩或按大小合并，极端情况下退化。
- 节点从 1 开始却只建立 n 个元素。
- 把有向图环检测直接套用无向图并查集方法。

## 自测

1. 手动执行 union(0,1)、union(1,2)，画出 parent 变化。
2. 增加返回当前集合数量的方法。
3. 用并查集判断一组等式与不等式是否冲突。
4. 解释为什么并查集不能直接回答最短路径。

---

[← 返回数据结构](../index.html) | [上一篇：字典树](../08-trie/index.html) | [下一篇：进阶结构 →](../10-advanced-structures/index.html)
