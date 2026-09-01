---
layout: default
title: 图
description: 图的概念、邻接表、邻接矩阵、入度与带权图的 Python 表示
eyebrow: 数据结构 / 07
---

# 图：描述任意关系

链表和树都可以看成受限制的图。图由**顶点（vertex）**和连接顶点的**边（edge）**组成，适合表示道路、社交关系、依赖、网络和网格连通性。

## 基本术语

- **无向图**：边没有方向，`u-v` 可以双向到达。
- **有向图**：边有方向，`u -> v` 不代表 `v -> u`。
- **带权图**：每条边带距离、费用或时间。
- **度**：无向图中与节点相连的边数。
- **入度/出度**：有向图中进入/离开节点的边数。
- **路径**：沿边经过的一串节点。
- **环**：从某节点出发能回到自己。
- **连通分量**：无向图中互相可达的一组节点。

题目中的节点编号可能从 0 开始，也可能从 1 开始。构图前先确认编号范围。

## 三种表示方式

假设无向边为 `(1,2)、(1,3)、(2,4)`。

### 边列表

```python
edges = [(1, 2), (1, 3), (2, 4)]
```

适合 Kruskal 最小生成树或只需逐条处理边的场景。查询某节点邻居需要扫描所有边。

### 邻接矩阵

```python
n = 4
matrix = [[False] * (n + 1) for _ in range(n + 1)]

for u, v in edges:
    matrix[u][v] = True
    matrix[v][u] = True
```

- 空间 O(n²)。
- 判断 `u` 与 `v` 是否直接相连是 O(1)。
- 适合节点很少、边很密的图。

### 邻接表

```python
n = 4
graph = [[] for _ in range(n + 1)]

for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)       # 无向图必须加反向边
```

- 空间 O(n + m)。
- 遍历所有邻居总成本 O(n + m)。
- 竞赛中最常用。

也可以用字典：

```python
from collections import defaultdict

graph = defaultdict(list)
for u, v in edges:
    graph[u].append(v)
    graph[v].append(u)
```

节点是连续整数时，列表更快也更容易控制范围；节点是字符串或稀疏编号时，字典更方便。

## 有向图与入度

```python
n = 4
graph = [[] for _ in range(n)]
indegree = [0] * n

for source, target in directed_edges:
    graph[source].append(target)
    indegree[target] += 1
```

入度为 0 的节点没有前置依赖，是拓扑排序的起点。

## 带权图

输入边 `u v weight`：

```python
graph = [[] for _ in range(n + 1)]

for u, v, weight in weighted_edges:
    graph[u].append((v, weight))
    graph[v].append((u, weight))

for neighbor, weight in graph[current]:
    new_distance = distance[current] + weight
```

元组顺序要统一。推荐始终使用 `(neighbor, weight)`。

## 图的遍历

### DFS

```python
def dfs(start, graph):
    visited = set()
    stack = [start]

    while stack:
        node = stack.pop()
        if node in visited:
            continue
        visited.add(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)

    return visited
```

### BFS

```python
from collections import deque

def bfs(start, graph):
    visited = {start}
    queue = deque([start])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)       # 入队时标记
                queue.append(neighbor)

    return order
```

BFS 应在入队时标记，否则同一节点可能被重复加入很多次。

## 连通分量

```python
def count_components(n, graph):
    visited = [False] * n
    components = 0

    for start in range(n):
        if visited[start]:
            continue
        components += 1
        stack = [start]
        visited[start] = True

        while stack:
            node = stack.pop()
            for neighbor in graph[node]:
                if not visited[neighbor]:
                    visited[neighbor] = True
                    stack.append(neighbor)

    return components
```

外层循环负责找到每个尚未访问的新起点；每启动一次搜索，就发现一个连通分量。

## 网格也是图

`(row, col)` 是节点，上下左右相邻格子是边。通常不显式构建邻接表，而是在遍历时计算邻居：

```python
directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]

for dr, dc in directions:
    next_row = row + dr
    next_col = col + dc
    if 0 <= next_row < rows and 0 <= next_col < cols:
        ...
```

## 表示方式对比

| 表示 | 空间 | 判断直接相连 | 遍历邻居 | 适合 |
|------|------|--------------|----------|------|
| 边列表 | O(m) | O(m) | O(m) | 按边排序、批处理 |
| 邻接矩阵 | O(n²) | O(1) | O(n) | 稠密小图 |
| 邻接表 | O(n+m) | O(deg(u)) | O(deg(u)) | 大多数稀疏图 |

## 常见错误

- 无向图只加入一条方向，导致一半路径不可达。
- 1-based 节点却只创建长度 n 的数组。
- 在出队时才标记 BFS 节点，造成重复入队。
- 忘记图可能不连通，只从节点 0 搜一次。
- 带权图把元组顺序写乱。
- 无向图 DFS 只判断父节点却忽略其他已访问节点，无法正确检测复杂环。

## 学完后应该会

1. 从边列表建立无向、有向和带权邻接表。
2. 根据 n 与 m 判断使用邻接表还是矩阵。
3. 用 DFS/BFS 遍历所有可达节点。
4. 解释 visited 应在什么时候标记。
5. 把网格题翻译成隐式图。

---

[← 返回数据结构](../index.html) | [上一篇：堆](../06-heap/index.html) | [下一篇：字典树 →](../08-trie/index.html)
