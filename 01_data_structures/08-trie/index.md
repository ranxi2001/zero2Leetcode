---
layout: default
title: 字典树
description: Trie 的结构、插入、完整单词查询、前缀查询与应用
eyebrow: 数据结构 / 08
---

# 字典树（Trie）：按前缀组织字符串

哈希集合可以 O(1) 平均判断完整单词是否存在，但不擅长回答“是否存在以 `app` 开头的单词”。Trie 把公共前缀合并成一条路径。

插入 `app`、`apple`、`apt` 后：

```text
root
 └─ a
    └─ p
       ├─ p  (app 结束)
       │  └─ l
       │     └─ e  (apple 结束)
       └─ t  (apt 结束)
```

节点本身通常不保存完整字符串，只保存：

- 指向下一字符的映射。
- 当前节点是否是某个完整单词的结尾。

## 节点定义

### 字典版

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False
```

适合字符范围不固定或分支稀疏。

### 固定 26 字母数组版

```python
class TrieNode:
    def __init__(self):
        self.children = [None] * 26
        self.is_end = False
```

数组常数更小，但只适合已知字符集。下标计算为 `ord(character) - ord("a")`。

## 完整实现

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for character in word:
            if character not in node.children:
                node.children[character] = TrieNode()
            node = node.children[character]
        node.is_end = True

    def search(self, word):
        node = self._find_node(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._find_node(prefix) is not None

    def _find_node(self, text):
        node = self.root
        for character in text:
            if character not in node.children:
                return None
            node = node.children[character]
        return node
```

## search 与 starts_with 的区别

插入 `apple` 后：

- `search("app")` 是 False，因为 `app` 不是完整单词。
- `starts_with("app")` 是 True，因为路径存在。
- 再插入 `app` 后，两个结果都是 True。

关键就在 `is_end`。只有走到某节点不代表这里有完整单词结束。

## 复杂度

设字符串长度为 L：

| 操作 | 时间 | 额外空间 |
|------|------|----------|
| 插入 | O(L) | 最坏 O(L) 新节点 |
| 查询单词 | O(L) | O(1) |
| 查询前缀 | O(L) | O(1) |

总空间与所有不重复前缀字符节点数有关。大量字符串且公共前缀少时，Trie 可能很占内存。

## 统计前缀数量

节点可以保存经过次数：

```python
class CountTrieNode:
    def __init__(self):
        self.children = {}
        self.pass_count = 0
        self.end_count = 0


class CountTrie:
    def __init__(self):
        self.root = CountTrieNode()

    def insert(self, word):
        node = self.root
        node.pass_count += 1
        for character in word:
            node = node.children.setdefault(character, CountTrieNode())
            node.pass_count += 1
        node.end_count += 1

    def count_prefix(self, prefix):
        node = self.root
        for character in prefix:
            if character not in node.children:
                return 0
            node = node.children[character]
        return node.pass_count
```

## Trie + DFS：单词搜索

在字符网格中搜索大量单词时，为每个单词单独 DFS 会重复匹配前缀。把全部单词建成 Trie，网格 DFS 只沿存在的前缀继续。

剪枝条件：

```python
def dfs(row, col, trie_node, grid):
    character = grid[row][col]
    if character not in trie_node.children:
        return

    next_node = trie_node.children[character]
    # 从 next_node 继续搜索相邻格子
```

当当前位置前缀不在 Trie 中，后面无需继续探索。

## 什么时候使用 Trie

- 自动补全、搜索建议。
- 大量单词的前缀查询。
- 字符网格中同时搜索多个单词。
- 最大异或值（把整数按二进制位插入 Trie）。

只查询完整单词是否存在时，set 通常更简单且更省内存。

## 常见错误

- 插入后忘记设置 `is_end`。
- 把“路径存在”误认为“单词存在”。
- 每次操作错误地从上一次节点继续，而不是从 root 开始。
- 字符集很大却使用巨大固定数组。
- 删除单词时直接删除共享前缀节点，破坏其他单词。

## 自测

1. 插入 apple、app、apt，画出共享节点。
2. 增加 `count_word(word)` 支持重复插入。
3. 实现返回指定前缀下所有单词的 DFS。
4. 比较 Trie 与 set 在完整查询和前缀查询中的差异。

---

[← 返回数据结构](../index.html) | [上一篇：图](../07-graph/index.html) | [下一篇：并查集 →](../09-union-find/index.html)
