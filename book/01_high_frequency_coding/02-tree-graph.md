# 二叉树与搜索图论

本文件维护第一章第二类题目的题解与面试追问。字节原文中的二叉树、网格搜索和图论题保持在同一分类。

## 字节核心题单

| 顺序 | 题目 | 字节频次 | 数据版本 | 其他统计覆盖 |
|------|------|----------|----------|--------------|
| 1 | LC 200 岛屿数量 | 50 | 08 更新 | 3/4 |
| 2 | LC 236 二叉树的最近公共祖先 | 41 | 08 更新 | 2/4 |
| 3 | LC 103 二叉树的锯齿形层序遍历 | 28 | 08 更新 | 2/4 |
| 4 | LC 102 二叉树的层序遍历 | 27 | 08 更新 | 4/4 |
| 5 | LC 199 二叉树的右视图 | 26 | 08 更新 | 2/4 |
| 6 | LC 572 另一棵树的子树 | 17 | 08 更新 | 0/4 |
| 7 | LC 104 二叉树的最大深度 | 22 | 04 基线 | 1/4 |
| 8 | LC 94 二叉树的中序遍历 | 18 | 04 基线 | 1/4 |
| 9 | LC 124 二叉树中的最大路径和 | 15 | 04 基线 | 3/4 |
| 10 | LC 226 翻转二叉树 | 10 | 04 基线 | 0/4 |
| 11 | LC 695 岛屿的最大面积 | 未单列 | 08 关联题 | 1/4 |

## 其他来源新增题

| 题目 | 发现来源 |
|------|----------|
| LC 108 将有序数组转换为二叉搜索树 | Hot 100 综合榜 |
| LC 111 二叉树的最小深度 | 美团 |
| LC 114 二叉树展开为链表 | Hot 100 综合榜 |
| LC 144 二叉树的前序遍历 | 美团 |
| LC 207 课程表 | 华为、Hot 100 综合榜 |
| LC 208 实现 Trie（前缀树） | Hot 100 综合榜 |
| LC 230 二叉搜索树中第 K 小的元素 | Hot 100 综合榜 |
| LC 437 路径总和 III | Hot 100 综合榜 |

## 题解与追问重点

- 每道递归题先定义函数语义、返回值和终止条件，再写代码。
- 遍历题比较递归与迭代；层序题统一使用队列模板，并讲清每层边界。
- 岛屿题比较 DFS、BFS 和并查集，说明原地标记与额外访问集合的取舍。
- 图论题补充有向图判环、拓扑排序和访问状态设计。
- 树题追问优先覆盖递归深度、退化树栈溢出、返回路径或具体节点等变体。

## LC 200 岛屿数量

**考频与考点**：字节 50 次，本类最高频。考查网格建图、连通分量搜索和访问标记。

**写代码前确认**：网格是否允许原地修改；相邻是否只含上下左右。本题可修改时，将访问过的 `"1"` 改成 `"0"`，无需额外集合。

**思路/解法**：扫描每个格子。遇到尚未访问的陆地，答案加一，再从它出发用 DFS 淹没整个岛屿。递归 DFS 可写得更短，但极端网格可能超过 Python 递归深度，下面使用显式栈。BFS 只需将栈换成队列，复杂度相同。若需要动态合并陆地或频繁查询连通性，可用并查集；对一次静态扫描没有优势。

```python
from typing import List


class Solution:
    def numIslands(self, grid: List[List[str]]) -> int:
        if not grid or not grid[0]:
            return 0

        rows, cols = len(grid), len(grid[0])
        answer = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] != "1":
                    continue
                answer += 1
                grid[r][c] = "0"
                stack = [(r, c)]
                while stack:
                    x, y = stack.pop()
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == "1":
                            grid[nx][ny] = "0"  # 入栈时标记，避免重复入栈
                            stack.append((nx, ny))
        return answer
```

**复杂度**：时间 `O(mn)`，每个格子至多处理一次；显式栈最坏 `O(mn)`。

**边界/易错点**：空网格、全水、单格岛屿；必须在入栈或入队时标记，不能等弹出后再标记。

**面试追问**：不能修改输入时如何用 `visited`？八方向相邻如何改？陆地逐个加入并实时询问岛屿数时如何用并查集？

## LC 236 二叉树的最近公共祖先

**考频与考点**：字节 41 次。考查后序递归、子树信息向上传递，以及节点引用与节点值的区别。

**写代码前确认**：`p`、`q` 是否都存在且节点值是否唯一。原题保证都存在，应按节点对象比较。

**思路/解法**：定义 `dfs(node)`：若当前子树包含 `p` 或 `q`，返回能够代表该目标或其最近公共祖先的节点；都不含则返回空。左右子树均返回非空时，当前节点就是答案；只有一侧非空则向上传递该侧结果。

```python
class Solution:
    def lowestCommonAncestor(self, root: "TreeNode", p: "TreeNode", q: "TreeNode") -> "TreeNode":
        def dfs(node: "TreeNode | None") -> "TreeNode | None":
            if node is None or node is p or node is q:
                return node
            left = dfs(node.left)
            right = dfs(node.right)
            if left is not None and right is not None:
                return node
            return left if left is not None else right

        return dfs(root)
```

**复杂度**：时间 `O(n)`；递归栈 `O(h)`，退化树最坏 `O(n)`。

**边界/易错点**：一个目标是另一个目标的祖先时，命中目标应立即返回；不要只比较 `val`。

**面试追问**：若节点可能不存在，如何同时返回命中数量？BST 如何利用大小关系？多次 LCA 查询如何做倍增预处理？

## LC 103 二叉树的锯齿形层序遍历

**考频与考点**：字节 28 次。考查层序边界、双端队列以及方向切换。

**写代码前确认**：空树返回空列表；第一层方向为从左到右。

**思路/解法**：BFS 每轮先固定 `len(queue)`，确保只消费当前层。树节点始终按左右顺序入队；输出时根据方向追加到本层结果的右端或左端，避免每层结束后再反转。DFS 也可按深度建立结果，并依据奇偶深度插入两端，但会承受递归栈风险。

```python
from collections import deque
from typing import List, Optional


class Solution:
    def zigzagLevelOrder(self, root: Optional["TreeNode"]) -> List[List[int]]:
        if root is None:
            return []
        queue = deque([root])
        left_to_right = True
        answer = []
        while queue:
            level = deque()
            for _ in range(len(queue)):
                node = queue.popleft()
                if left_to_right:
                    level.append(node.val)
                else:
                    level.appendleft(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            answer.append(list(level))
            left_to_right = not left_to_right
        return answer
```

**复杂度**：时间 `O(n)`，队列与结果之外的辅助空间最坏 `O(w)`，`w` 为最大层宽。

**边界/易错点**：不要改变子节点入队顺序来制造锯齿，否则下一层的结构顺序容易混乱。

**面试追问**：如何只用一个双端队列完成双向出队？若允许每层反转，代码和复杂度如何变化？

## LC 102 二叉树的层序遍历

**考频与考点**：字节 27 次，多家公司共同高频。考查 BFS 队列和分层控制。

**写代码前确认**：返回值按层分组，而不是一维访问序列。

**思路/解法**：队列保存下一批待访问节点。每轮记录当前长度，只弹出这些节点，因此新加入的子节点自然属于下一层。递归方案可定义 `dfs(node, depth)`，首次到达新深度时创建列表，再追加节点值；BFS 更贴合题意。

```python
from collections import deque
from typing import List, Optional


class Solution:
    def levelOrder(self, root: Optional["TreeNode"]) -> List[List[int]]:
        if root is None:
            return []
        answer, queue = [], deque([root])
        while queue:
            level = []
            for _ in range(len(queue)):
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            answer.append(level)
        return answer
```

**复杂度**：时间 `O(n)`；队列辅助空间 `O(w)`，输出空间 `O(n)`。

**边界/易错点**：循环中必须保存本层长度；直接遍历不断增长的队列会丢失层边界。

**面试追问**：如何返回自底向上的层序？如何计算每层平均值？递归层序在退化树上有什么风险？

## LC 199 二叉树的右视图

**考频与考点**：字节 26 次。考查层序遍历变体与先右后左的深度优先搜索。

**写代码前确认**：右视图是每一深度最右侧可见节点，并不等于沿 `right` 指针形成的链。

**思路/解法**：BFS 中每层最后弹出的节点就是该层最右节点。另一种常考写法是先右后左 DFS：定义 `dfs(node, depth)` 访问子树，当 `depth == len(answer)` 时说明这是该深度首次到达的节点，直接记录。

```python
from collections import deque
from typing import List, Optional


class Solution:
    def rightSideView(self, root: Optional["TreeNode"]) -> List[int]:
        if root is None:
            return []
        answer, queue = [], deque([root])
        while queue:
            level_size = len(queue)
            for index in range(level_size):
                node = queue.popleft()
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
                if index == level_size - 1:
                    answer.append(node.val)
        return answer
```

**复杂度**：时间 `O(n)`，辅助空间 `O(w)`；DFS 方案为 `O(h)` 递归栈。

**边界/易错点**：某层最右节点可能来自左子树；实现时可直接在 `index == level_size - 1` 时记录。

**面试追问**：如何改为左视图？如何用 DFS 保证每层首个节点就是答案？如何返回每层最右节点对象？

## LC 572 另一棵树的子树

**考频与考点**：字节 17 次。考查“枚举候选根 + 判断两棵树相同”的递归拆分。

**写代码前确认**：原题 `subRoot` 非空；相同必须同时满足结构和值一致，不能只比较某种遍历值序列。

**思路/解法**：定义 `same(a, b)`：判断两棵以 `a`、`b` 为根的树是否完全相同。再定义 `contains(node)`：判断 `node` 子树中是否存在与 `subRoot` 相同的根，检查当前节点后递归左右子树。

```python
from typing import Optional


class Solution:
    def isSubtree(self, root: Optional["TreeNode"], subRoot: Optional["TreeNode"]) -> bool:
        def same(a: Optional["TreeNode"], b: Optional["TreeNode"]) -> bool:
            if a is None or b is None:
                return a is b
            return a.val == b.val and same(a.left, b.left) and same(a.right, b.right)

        def contains(node: Optional["TreeNode"]) -> bool:
            if node is None:
                return False
            return same(node, subRoot) or contains(node.left) or contains(node.right)

        return contains(root)
```

**复杂度**：最坏时间 `O(nm)`，递归栈 `O(h_root + h_sub)`；`n`、`m` 为两树节点数。

**边界/易错点**：序列化方案必须记录空节点和分隔符，否则不同结构或多位数可能误匹配。

**面试追问**：如何用带空标记的序列化加 KMP 降低匹配复杂度？如何用子树哈希比较？

## LC 104 二叉树的最大深度

**考频与考点**：字节 22 次。考查最基础的树递归语义和高度定义。

**写代码前确认**：空树深度为 `0`，单节点树深度为 `1`。

**思路/解法**：定义 `depth(node)`：返回以 `node` 为根的子树最大深度。空节点为 `0`，非空节点为左右子树较大深度加一。迭代层序每完成一层将深度加一，可规避退化树的递归深度限制。

```python
from typing import Optional


class Solution:
    def maxDepth(self, root: Optional["TreeNode"]) -> int:
        def depth(node: Optional["TreeNode"]) -> int:
            if node is None:
                return 0
            return max(depth(node.left), depth(node.right)) + 1

        return depth(root)
```

**复杂度**：时间 `O(n)`；递归栈 `O(h)`。

**边界/易错点**：不要混淆节点数定义的深度与边数定义的高度；本题按节点数返回。

**面试追问**：如何改为最小深度？如何在求深度的同时判断平衡树？极深树如何迭代实现？

## LC 94 二叉树的中序遍历

**考频与考点**：字节 18 次。考查递归展开与显式栈模拟。

**写代码前确认**：顺序为左子树、根、右子树；是否要求避免递归。

**思路/解法**：递归中定义 `dfs(node)`：按中序把当前子树节点值追加到结果。迭代法用栈保存“左链上尚未访问的根”，先一路压左，弹栈访问，再转向右子树。面试通常应掌握两种。

```python
from typing import List, Optional


class Solution:
    def inorderTraversal(self, root: Optional["TreeNode"]) -> List[int]:
        answer, stack = [], []
        current = root
        while current is not None or stack:
            while current is not None:
                stack.append(current)
                current = current.left
            current = stack.pop()
            answer.append(current.val)
            current = current.right
        return answer
```

递归核心等价于：`dfs(node.left)`、记录 `node.val`、`dfs(node.right)`；迭代法把函数调用栈显式化，复杂度不变。

**复杂度**：时间 `O(n)`；栈空间 `O(h)`。

**边界/易错点**：外层条件必须是 `current is not None or stack`；弹栈访问后转向右子树。

**面试追问**：如何写前序、后序迭代？Morris 中序如何做到 `O(1)` 额外空间，它是否临时修改树？

## LC 124 二叉树中的最大路径和

**考频与考点**：字节 15 次，多家公司高频。考查树形 DP、全局答案与返回值语义分离。

**写代码前确认**：路径至少包含一个节点；可从任意节点开始和结束，不能重复节点；节点值可能全为负数。

**思路/解法**：定义 `gain(node)`：从 `node` 出发、只能向下选择一条分支时能提供给父节点的最大贡献。负贡献应舍弃为 `0`。经过当前节点且同时连接左右分支的路径不能继续向父节点延伸，只用于更新全局答案。

```python
from typing import Optional


class Solution:
    def maxPathSum(self, root: Optional["TreeNode"]) -> int:
        answer = float("-inf")

        def gain(node: Optional["TreeNode"]) -> int:
            nonlocal answer
            if node is None:
                return 0
            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)
            answer = max(answer, node.val + left + right)
            return node.val + max(left, right)

        gain(root)
        return int(answer)
```

**复杂度**：时间 `O(n)`；递归栈 `O(h)`。

**边界/易错点**：全负树不能把答案初始化为 `0`；返回父节点时不能同时带上左右两条分支。

**面试追问**：如何返回具体路径？如何改为只允许叶子到叶子？与二叉树直径的递推关系有何异同？

## LC 226 翻转二叉树

**考频与考点**：字节 10 次。考查递归定义、原地修改与树遍历。

**写代码前确认**：是否允许修改原树。原题要求返回翻转后的根，通常原地交换左右子树。

**思路/解法**：定义 `invert(node)`：翻转以 `node` 为根的整棵子树并返回其根。先递归翻转左右子树，再交换返回结果。也可 BFS 逐节点交换，避免递归栈过深。

```python
from typing import Optional


class Solution:
    def invertTree(self, root: Optional["TreeNode"]) -> Optional["TreeNode"]:
        def invert(node: Optional["TreeNode"]) -> Optional["TreeNode"]:
            if node is None:
                return None
            left = invert(node.left)
            right = invert(node.right)
            node.left, node.right = right, left
            return node

        return invert(root)
```

**复杂度**：时间 `O(n)`；递归栈 `O(h)`。

**边界/易错点**：若先覆盖一个子指针再赋另一个，会丢失原子树；应使用并行赋值或临时变量。

**面试追问**：如何生成一棵新镜像树而不修改原树？如何迭代实现？翻转两次后树是否必然恢复？

## LC 695 岛屿的最大面积

**考频与考点**：字节关联题。考查连通分量搜索过程中聚合节点数量。

**写代码前确认**：面积按四方向相邻的陆地格数计算；是否允许原地修改输入。

**思路/解法**：与 LC 200 相同地枚举每个未访问陆地，但每次搜索累计当前连通分量面积，并更新最大值。下面采用迭代 DFS。BFS 的访问顺序不同，结果和复杂度相同；并查集适合需要合并、查询多个分量大小的场景。

```python
from typing import List


class Solution:
    def maxAreaOfIsland(self, grid: List[List[int]]) -> int:
        if not grid or not grid[0]:
            return 0
        rows, cols = len(grid), len(grid[0])
        answer = 0
        for r in range(rows):
            for c in range(cols):
                if grid[r][c] != 1:
                    continue
                area = 0
                grid[r][c] = 0
                stack = [(r, c)]
                while stack:
                    x, y = stack.pop()
                    area += 1
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < rows and 0 <= ny < cols and grid[nx][ny] == 1:
                            grid[nx][ny] = 0
                            stack.append((nx, ny))
                answer = max(answer, area)
        return answer
```

**复杂度**：时间 `O(mn)`；栈最坏 `O(mn)`。

**边界/易错点**：全水时返回 `0`；应按连通分量重置 `area`，并在入栈时标记。

**面试追问**：如何返回最大岛屿的坐标集合？若翻转一个水格，如何求最大可能面积？

## LC 108 将有序数组转换为二叉搜索树

**考频与考点**：其他来源新增。考查分治构造、BST 中序有序性质和平衡条件。

**写代码前确认**：输入严格递增；高度平衡只要求任意节点左右子树高度差不超过一，答案不唯一。

**思路/解法**：定义 `build(left, right)`：用 `nums[left:right + 1]` 构造一棵平衡 BST 并返回根。选中点为根后，左右区间长度至多差一，递归构造左右子树。使用下标而非切片，避免额外复制。

```python
from typing import List, Optional


class Solution:
    def sortedArrayToBST(self, nums: List[int]) -> Optional["TreeNode"]:
        def build(left: int, right: int) -> Optional["TreeNode"]:
            if left > right:
                return None
            middle = left + (right - left) // 2
            root = TreeNode(nums[middle])
            root.left = build(left, middle - 1)
            root.right = build(middle + 1, right)
            return root

        return build(0, len(nums) - 1)
```

**复杂度**：时间 `O(n)`；递归栈 `O(log n)`，构造结果占 `O(n)`。

**边界/易错点**：空区间终止条件是 `left > right`；左右中点任选其一都合法。

**面试追问**：输入为有序链表时如何做到 `O(n)`？如何证明中点构造必然高度平衡？

## LC 111 二叉树的最小深度

**考频与考点**：其他来源新增。考查叶节点定义和 BFS 最短性。

**写代码前确认**：最小深度是根到最近叶节点的节点数；只有一个孩子的节点不是叶子。

**思路/解法**：BFS 按层搜索，首次遇到左右孩子都为空的节点即可返回当前深度，因为队列保证后续节点不会更浅。递归也可定义 `depth(node)` 返回子树最小深度，但单侧为空时不能直接取 `min(0, x)`。

```python
from collections import deque
from typing import Optional


class Solution:
    def minDepth(self, root: Optional["TreeNode"]) -> int:
        if root is None:
            return 0
        queue = deque([(root, 1)])
        while queue:
            node, depth = queue.popleft()
            if node.left is None and node.right is None:
                return depth
            if node.left:
                queue.append((node.left, depth + 1))
            if node.right:
                queue.append((node.right, depth + 1))
        return 0
```

**复杂度**：最坏时间 `O(n)`；队列空间 `O(w)`。若浅层很快出现叶子，BFS 可提前结束。

**边界/易错点**：根只有右子树时，答案必须沿右侧到叶子，不能把缺失的左子树深度当作 `0` 参与最小值。

**面试追问**：递归应如何处理单侧为空？若边带非负权，如何改用 Dijkstra 求最短根叶路径？

## LC 114 二叉树展开为链表

**考频与考点**：其他来源新增。考查原地指针重排、前序顺序和后序递归信息。

**写代码前确认**：必须原地展开；所有 `left` 置空，`right` 链顺序等于原树前序遍历。

**思路/解法**：定义 `flatten_tree(node)`：原地展开当前子树，并返回展开链表的尾节点。先保存并展开左右子树；若左子树存在，将其接到根的右侧，再把原右链接到左链尾部。显式栈按前序取节点并连接前驱也可实现，空间同为 `O(h)` 到 `O(n)`。

```python
from typing import Optional


class Solution:
    def flatten(self, root: Optional["TreeNode"]) -> None:
        def flatten_tree(node: Optional["TreeNode"]) -> Optional["TreeNode"]:
            if node is None:
                return None
            left_root, right_root = node.left, node.right
            left_tail = flatten_tree(left_root)
            right_tail = flatten_tree(right_root)
            if left_root is not None:
                node.right = left_root
                node.left = None
                left_tail.right = right_root
            return right_tail or left_tail or node

        flatten_tree(root)
```

**复杂度**：时间 `O(n)`；递归栈 `O(h)`，不计递归栈的额外空间为 `O(1)`。

**边界/易错点**：递归前先保存原右子树；不要每次扫描左链尾部，否则退化为 `O(n^2)`。

**面试追问**：如何用前驱节点实现 `O(1)` 额外空间？如何展开为中序顺序？

## LC 144 二叉树的前序遍历

**考频与考点**：其他来源新增。考查根、左、右的访问顺序及迭代模拟。

**写代码前确认**：空树返回空列表；是否限制使用递归。

**思路/解法**：递归函数 `dfs(node)` 的语义是按前序把当前子树追加到结果。迭代法弹出根后先压右孩子、再压左孩子，利用栈后进先出保证左子树先访问。

```python
from typing import List, Optional


class Solution:
    def preorderTraversal(self, root: Optional["TreeNode"]) -> List[int]:
        if root is None:
            return []
        answer, stack = [], [root]
        while stack:
            node = stack.pop()
            answer.append(node.val)
            if node.right:
                stack.append(node.right)
            if node.left:
                stack.append(node.left)
        return answer
```

**复杂度**：时间 `O(n)`；显式栈最坏 `O(h)`。

**边界/易错点**：压栈顺序与访问顺序相反；若先压左孩子，实际会先访问右子树。

**面试追问**：如何统一写出前、中、后序迭代模板？Morris 前序如何恢复临时线索？

## LC 207 课程表

**考频与考点**：华为与 Hot 100 新增。考查有向图判环、拓扑排序和入度维护。

**写代码前确认**：`[course, prerequisite]` 表示从先修课指向课程；只需判断能否完成，不要求返回具体顺序。

**思路/解法**：Kahn BFS 先把所有入度为零的课程入队。每学完一门课，就删除它的出边并降低后继入度；最终处理数量等于课程总数则无环。三色 DFS 也可判环：`0` 未访问、`1` 当前递归路径、`2` 已完成，遇到状态 `1` 即发现环；BFS 无递归深度风险。

```python
from collections import deque
from typing import List


class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for course, prerequisite in prerequisites:
            graph[prerequisite].append(course)
            indegree[course] += 1

        queue = deque(i for i, degree in enumerate(indegree) if degree == 0)
        completed = 0
        while queue:
            course = queue.popleft()
            completed += 1
            for next_course in graph[course]:
                indegree[next_course] -= 1
                if indegree[next_course] == 0:
                    queue.append(next_course)
        return completed == numCourses
```

**复杂度**：时间 `O(V + E)`；邻接表、入度和队列空间 `O(V + E)`。

**边界/易错点**：建图方向必须与入度定义一致；无先修关系时所有课程都可完成；重复边是否存在应在面试中确认。

**面试追问**：如何返回一条拓扑序？如何用 DFS 返回具体环？若持续新增依赖，如何维护可行性？

## LC 208 实现 Trie（前缀树）

**考频与考点**：Hot 100 新增。考查多叉树设计、前缀共享与单词结束标记。

**写代码前确认**：字符集范围；本题为小写英文字母。`search` 要求完整单词，`startsWith` 只要求前缀路径存在。

**思路/解法**：每个节点保存“字符到子节点”的映射和 `is_end` 标记。插入沿字符创建路径；查询沿路径行走，完整单词还需检查末节点标记。用字典便于适配稀疏字符集；固定 26 长度数组常数更稳定但占用更多空间。

```python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False


class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True

    def _find(self, text: str):
        node = self.root
        for char in text:
            if char not in node.children:
                return None
            node = node.children[char]
        return node

    def search(self, word: str) -> bool:
        node = self._find(word)
        return node is not None and node.is_end

    def startsWith(self, prefix: str) -> bool:
        return self._find(prefix) is not None
```

**复杂度**：单次插入或查询时间 `O(L)`；总空间与所有已创建字符节点数成正比。

**边界/易错点**：不能用“没有孩子”代表单词结束，因为一个单词可能是另一个单词的前缀。

**面试追问**：如何支持删除并回收节点？如何返回指定前缀的前 `k` 个词？字符集很大时节点怎样存储？

## LC 230 二叉搜索树中第 K 小的元素

**考频与考点**：Hot 100 新增。考查 BST 中序有序性质和迭代遍历提前终止。

**写代码前确认**：`k` 从 `1` 开始且合法；BST 是否允许重复值。原题通常按节点排名，不需要去重。

**思路/解法**：中序遍历 BST 会得到递增序列。使用显式栈压入左链，每弹出一个节点就将 `k` 减一，减到零立即返回，无需遍历剩余节点。递归也可通过外部计数提前记录答案，但 Python 中迭代更直接。

```python
from typing import Optional


class Solution:
    def kthSmallest(self, root: Optional["TreeNode"], k: int) -> int:
        stack = []
        current = root
        while current is not None or stack:
            while current is not None:
                stack.append(current)
                current = current.left
            current = stack.pop()
            k -= 1
            if k == 0:
                return current.val
            current = current.right
        raise ValueError("k exceeds the number of nodes")
```

**复杂度**：时间平均 `O(h + k)`、最坏 `O(n)`；栈空间 `O(h)`。

**边界/易错点**：访问根后必须进入右子树；题目保证合法时不会走到异常分支。

**面试追问**：若频繁查询第 `k` 小，如何在节点维护子树大小并做到 `O(h)`？如何求第 `k` 大？

## LC 437 路径总和 III

**考频与考点**：Hot 100 新增。考查树上前缀和、哈希计数和回溯恢复现场。

**写代码前确认**：路径必须向下但不必从根开始或到叶结束；节点值可为负，因此不能使用滑动窗口。

**思路/解法**：定义 `dfs(node, prefix)`：统计遍历当前子树时，以根到父节点的路径和为 `prefix` 的所有目标路径。到当前节点的新前缀和为 `current`，此前出现过 `current - targetSum` 的次数，就是以当前节点结尾的新路径数。哈希表保存当前递归路径上的前缀和频次；退出节点时减一，防止把兄弟分支拼成路径。

```python
from typing import Optional


class Solution:
    def pathSum(self, root: Optional["TreeNode"], targetSum: int) -> int:
        count = {0: 1}

        def dfs(node: Optional["TreeNode"], prefix: int) -> int:
            if node is None:
                return 0
            current = prefix + node.val
            answer = count.get(current - targetSum, 0)
            count[current] = count.get(current, 0) + 1
            answer += dfs(node.left, current)
            answer += dfs(node.right, current)
            count[current] -= 1
            if count[current] == 0:
                del count[current]
            return answer

        return dfs(root, 0)
```

**复杂度**：时间 `O(n)`；哈希表与递归栈空间 `O(h)`。

**边界/易错点**：必须初始化 `count[0] = 1` 才能统计从根开始的路径；回溯时必须撤销当前前缀和。

**面试追问**：朴素的“从每个节点重新向下搜索”为何是 `O(n^2)`？如何返回所有具体路径？为什么负数使双指针失效？
