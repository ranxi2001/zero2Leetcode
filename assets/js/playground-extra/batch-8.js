// Extra playground problems (batch 8) — 设计与其他技巧
// Note: Keep this file self-contained. It only appends objects into window.PLAYGROUND_EXTRA_PROBLEMS.

window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  {
    id: 189,
    title: 'LC 189 - 轮转数组',
    difficulty: 'Medium',
    tags: ['数组', '双指针'],
    description: `
<h3>189. 轮转数组 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个整数数组 <code>nums</code>，将数组中的元素向右轮转 <code>k</code> 个位置，其中 <code>k</code> 是非负数。</p>
<p>请<strong>原地</strong>修改数组；本站测试会读取修改后的 <code>nums</code>，无需返回值。</p>
<h4>示例</h4>
<pre>输入：nums = [1,2,3,4,5,6,7], k = 3
输出：[5,6,7,1,2,3,4]</pre>
<pre>输入：nums = [-1,-100,3,99], k = 2
输出：[3,99,-1,-100]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>5</sup></li>
<li>0 &lt;= k &lt;= 10<sup>5</sup></li>
<li>尝试使用空间复杂度为 <code>O(1)</code> 的原地算法。</li>
</ul>`,
    template: `def rotate(nums, k):
    """
    :type nums: List[int]
    :type k: int
    :rtype: None
    """
    # 请原地修改 nums
    pass
`,
    functionName: '_run_rotate',
    setup: `
def _run_rotate(nums, k):
    rotate(nums, k)
    return nums
`,
    testCases: [
      { input: [[1, 2, 3, 4, 5, 6, 7], 3], expected: [5, 6, 7, 1, 2, 3, 4] },
      { input: [[-1, -100, 3, 99], 2], expected: [3, 99, -1, -100] },
      { input: [[1, 2], 3], expected: [2, 1] },
      { input: [[1], 0], expected: [1] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/rotate-array/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/22228302.html',
  },
  {
    id: 238,
    title: 'LC 238 - 除自身以外数组的乘积',
    difficulty: 'Medium',
    tags: ['数组', '前缀积'],
    description: `
<h3>238. 除自身以外数组的乘积 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>nums</code>，返回数组 <code>answer</code>，其中 <code>answer[i]</code> 等于 <code>nums</code> 中除 <code>nums[i]</code> 之外其余各元素的乘积。</p>
<p>题目数据保证数组中任意元素的全部前缀元素和后缀元素的乘积都在 32 位整数范围内。</p>
<p>请在 <code>O(n)</code> 时间复杂度内完成，并且不能使用除法。</p>
<h4>示例</h4>
<pre>输入：nums = [1,2,3,4]
输出：[24,12,8,6]</pre>
<pre>输入：nums = [-1,1,0,-3,3]
输出：[0,0,9,0,0]</pre>
<h4>提示</h4>
<ul>
<li>2 &lt;= nums.length &lt;= 10<sup>5</sup></li>
<li>-30 &lt;= nums[i] &lt;= 30</li>
<li>进阶：除输出数组外，能否只使用 <code>O(1)</code> 额外空间？</li>
</ul>`,
    template: `def product_except_self(nums):
    """
    :type nums: List[int]
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'product_except_self',
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      { input: [[0, 0]], expected: [0, 0] },
      { input: [[2, 3]], expected: [3, 2] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/product-of-array-except-self/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/22228304.html',
  },
  {
    id: 146,
    title: 'LC 146 - LRU 缓存',
    difficulty: 'Medium',
    tags: ['设计', '哈希表', '链表'],
    description: `
<h3>146. LRU 缓存 <span class="difficulty-tag medium">Medium</span></h3>
<p>请你设计并实现一个满足 <a href="https://baike.baidu.com/item/LRU" target="_blank">LRU (最近最少使用) 缓存</a> 约束的数据结构。</p>
<p>实现 <code>LRUCache</code> 类：</p>
<ul>
<li><code>LRUCache(int capacity)</code> 以<strong>正整数</strong>作为容量 <code>capacity</code> 初始化 LRU 缓存</li>
<li><code>int get(int key)</code> 如果关键字 <code>key</code> 存在于缓存中，则返回关键字的值，否则返回 <code>-1</code></li>
<li><code>void put(int key, int value)</code> 如果关键字 <code>key</code> 已经存在，则变更其数据值 <code>value</code>；如果不存在，则向缓存中插入该组 <code>key-value</code>。如果插入操作导致关键字数量超过 <code>capacity</code>，则应该<strong>逐出</strong>最久未使用的关键字。</li>
</ul>
<p>函数 <code>get</code> 和 <code>put</code> 必须以 <code>O(1)</code> 的平均时间复杂度运行。</p>
<h4>示例</h4>
<pre>输入：
["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
输出：
[null, null, null, 1, null, -1, null, -1, 3, 4]

解释：
LRUCache lru = new LRUCache(2);
lru.put(1, 1); // 缓存是 {1=1}
lru.put(2, 2); // 缓存是 {1=1, 2=2}
lru.get(1);    // 返回 1
lru.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
lru.get(2);    // 返回 -1 (未找到)
lru.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
lru.get(1);    // 返回 -1 (未找到)
lru.get(3);    // 返回 3
lru.get(4);    // 返回 4</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= capacity &lt;= 3000</li>
<li>0 &lt;= key &lt;= 10<sup>4</sup></li>
<li>0 &lt;= value &lt;= 10<sup>5</sup></li>
<li>最多调用 2 * 10<sup>5</sup> 次 get 和 put</li>
</ul>`,
    template: `class LRUCache:
    def __init__(self, capacity):
        """
        :type capacity: int
        """
        # 在这里写你的代码
        pass

    def get(self, key):
        """
        :type key: int
        :rtype: int
        """
        # 在这里写你的代码
        pass

    def put(self, key, value):
        """
        :type key: int
        :type value: int
        :rtype: None
        """
        # 在这里写你的代码
        pass
`,
    functionName: '_run_class_ops',
    setup: `
def _run_class_ops(operations, arguments):
    obj = None
    results = []
    for op, args in zip(operations, arguments):
        if op == "LRUCache":
            obj = LRUCache(*args)
            results.append(None)
        else:
            ret = getattr(obj, op)(*args)
            results.append(ret)
    return results
`,
    testCases: [
      {
        input: [
          ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"],
          [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
        ],
        expected: [null, null, null, 1, null, -1, null, -1, 3, 4]
      },
      {
        input: [
          ["LRUCache", "put", "put", "get", "put", "put", "get"],
          [[2], [2, 1], [2, 2], [2], [1, 1], [4, 1], [2]]
        ],
        expected: [null, null, null, 2, null, null, -1]
      },
      {
        input: [
          ["LRUCache", "put", "get", "put", "get", "get"],
          [[1], [2, 1], [2], [3, 2], [2], [3]]
        ],
        expected: [null, null, 1, null, -1, 2]
      },
      {
        input: [
          ["LRUCache", "put", "put", "put", "put", "get", "get"],
          [[2], [2, 1], [1, 1], [2, 3], [4, 1], [1], [2]]
        ],
        expected: [null, null, null, null, null, -1, 3]
      },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/lru-cache/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19769206',
  },
  {
    id: 902,
    title: 'LC 902 - 最大为 N 的数字组合',
    difficulty: 'Hard',
    tags: ['动态规划', '数位 DP'],
    description: `
<h3>902. 最大为 N 的数字组合 <span class="difficulty-tag hard">Hard</span></h3>
<p>给定一个按非递减顺序排列且元素互不相同的数字字符数组 <code>digits</code>，你可以使用其中任意次数的数字组成正整数。</p>
<p>返回可以生成的小于或等于整数 <code>n</code> 的正整数个数。</p>
<h4>示例</h4>
<pre>输入：digits = ["1","3","5","7"], n = 100
输出：20</pre>
<pre>输入：digits = ["1","4","9"], n = 1000000000
输出：29523</pre>
<pre>输入：digits = ["7"], n = 8
输出：1</pre>
<h4>提示</h4>
<ul>
<li><code>1 &lt;= digits.length &lt;= 9</code></li>
<li><code>digits[i]</code> 是从 <code>'1'</code> 到 <code>'9'</code> 的数字字符</li>
<li><code>digits</code> 中的所有值互不相同，并按非递减顺序排列</li>
<li><code>1 &lt;= n &lt;= 10<sup>9</sup></code></li>
</ul>`,
    template: `def at_most_n_given_digit_set(digits, n):
    """
    :type digits: List[str]
    :type n: int
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'at_most_n_given_digit_set',
    testCases: [
      { input: [["1", "3", "5", "7"], 100], expected: 20 },
      { input: [["1", "4", "9"], 1000000000], expected: 29523 },
      { input: [["7"], 8], expected: 1 },
      { input: [["1", "2", "3", "4", "5", "6", "7", "8", "9"], 9], expected: 9 },
      { input: [["3", "4", "8"], 4], expected: 2 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/numbers-at-most-n-given-digit-set/solutions/',
  },
  {
    id: 103,
    title: 'LC 103 - 二叉树的锯齿形层序遍历',
    difficulty: 'Medium',
    tags: ['二叉树', '广度优先搜索'],
    description: `
<h3>103. 二叉树的锯齿形层序遍历 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你二叉树的根节点 <code>root</code>，返回其节点值的锯齿形层序遍历：第一层从左到右，下一层从右到左，以此类推。</p>
<h4>示例</h4>
<pre>输入：root = [3,9,20,null,null,15,7]
输出：[[3],[20,9],[15,7]]</pre>
<pre>输入：root = [1]
输出：[[1]]</pre>
<h4>提示</h4>
<ul>
<li>树中节点数目在 <code>[0, 2000]</code> 范围内</li>
<li><code>-100 &lt;= Node.val &lt;= 100</code></li>
</ul>`,
    template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def zigzag_level_order(root):
    """
    :type root: TreeNode
    :rtype: List[List[int]]
    """
    pass
`,
    functionName: 'zigzag_level_order',
    setup: BINARY_TREE_SETUP,
    argWrappers: ['_to_tree'],
    testCases: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [20, 9], [15, 7]] },
      { input: [[1]], expected: [[1]] },
      { input: [[]], expected: [] },
      { input: [[1, 2, 3, 4, null, null, 5]], expected: [[1], [3, 2], [4, 5]] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/solutions/',
  },
  {
    id: 572,
    title: 'LC 572 - 另一棵树的子树',
    difficulty: 'Easy',
    tags: ['二叉树', '深度优先搜索'],
    description: `
<h3>572. 另一棵树的子树 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你两棵二叉树 <code>root</code> 和 <code>subRoot</code>，检验 <code>root</code> 中是否包含一棵与 <code>subRoot</code> 具有相同结构和节点值的子树。</p>
<h4>示例</h4>
<pre>输入：root = [3,4,5,1,2], subRoot = [4,1,2]
输出：True</pre>
<pre>输入：root = [3,4,5,1,2,null,null,null,null,0], subRoot = [4,1,2]
输出：False</pre>
<h4>提示</h4>
<ul>
<li><code>root</code> 的节点数目范围是 <code>[1, 2000]</code></li>
<li><code>subRoot</code> 的节点数目范围是 <code>[1, 1000]</code></li>
<li><code>-10<sup>4</sup> &lt;= Node.val &lt;= 10<sup>4</sup></code></li>
</ul>`,
    template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def is_subtree(root, sub_root):
    """
    :type root: TreeNode
    :type sub_root: TreeNode
    :rtype: bool
    """
    pass
`,
    functionName: 'is_subtree',
    setup: BINARY_TREE_SETUP,
    argWrappers: ['_to_tree', '_to_tree'],
    testCases: [
      { input: [[3, 4, 5, 1, 2], [4, 1, 2]], expected: true },
      { input: [[3, 4, 5, 1, 2, null, null, null, null, 0], [4, 1, 2]], expected: false },
      { input: [[1, 1], [1]], expected: true },
      { input: [[1, 2, 3], [2, 3]], expected: false },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/subtree-of-another-tree/solutions/',
  },
  {
    id: 695,
    title: 'LC 695 - 岛屿的最大面积',
    difficulty: 'Medium',
    tags: ['深度优先搜索', '广度优先搜索', '矩阵'],
    description: `
<h3>695. 岛屿的最大面积 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个大小为 <code>m x n</code> 的二进制矩阵 <code>grid</code>。岛屿由水平或竖直方向相邻的 <code>1</code> 组成，返回其中最大的岛屿面积；如果没有岛屿，返回 <code>0</code>。</p>
<h4>示例</h4>
<pre>输入：grid = [[0,0,1,0],[1,1,1,0],[0,1,0,0]]
输出：5</pre>
<pre>输入：grid = [[0,0,0,0]]
输出：0</pre>
<h4>提示</h4>
<ul>
<li><code>1 &lt;= m, n &lt;= 50</code></li>
<li><code>grid[i][j]</code> 为 <code>0</code> 或 <code>1</code></li>
</ul>`,
    template: `def max_area_of_island(grid):
    """
    :type grid: List[List[int]]
    :rtype: int
    """
    pass
`,
    functionName: 'max_area_of_island',
    testCases: [
      { input: [[[0, 0, 1, 0], [1, 1, 1, 0], [0, 1, 0, 0]]], expected: 5 },
      { input: [[[0, 0, 0, 0]]], expected: 0 },
      { input: [[[1]]], expected: 1 },
      { input: [[[1, 0, 1], [0, 1, 0], [1, 0, 1]]], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/max-area-of-island/solutions/',
  },
  {
    id: 93,
    title: 'LC 93 - 复原 IP 地址',
    difficulty: 'Medium',
    tags: ['回溯', '字符串'],
    description: `
<h3>93. 复原 IP 地址 <span class="difficulty-tag medium">Medium</span></h3>
<p>有效 IP 地址由恰好四个整数（每个整数位于 <code>0</code> 到 <code>255</code> 之间）组成，且整数之间用 <code>.</code> 分隔。给定一个只包含数字的字符串 <code>s</code>，返回所有可能的有效 IP 地址。</p>
<p>有效地址中的每个整数都不能有前导零，除非该整数本身就是 <code>0</code>。答案可以按任意顺序返回。</p>
<h4>示例 1</h4>
<pre>输入：s = "25525511135"
输出：["255.255.11.135","255.255.111.35"]</pre>
<h4>示例 2</h4>
<pre>输入：s = "0000"
输出：["0.0.0.0"]</pre>
<h4>示例 3</h4>
<pre>输入：s = "101023"
输出：["1.0.10.23","1.0.102.3","10.1.0.23","10.10.2.3","101.0.2.3"]</pre>
<h4>提示</h4>
<ul>
<li><code>1 &lt;= s.length &lt;= 20</code></li>
<li><code>s</code> 仅由数字组成</li>
</ul>`,
    template: `def restore_ip_addresses(s):
    """
    :type s: str
    :rtype: List[str]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'restore_ip_addresses',
    testCases: [
      { input: ['25525511135'], expected: ['255.255.11.135', '255.255.111.35'] },
      { input: ['0000'], expected: ['0.0.0.0'] },
      { input: ['101023'], expected: ['1.0.10.23', '1.0.102.3', '10.1.0.23', '10.10.2.3', '101.0.2.3'] },
    ],
    compareFunc: 'sorted',
    solutionUrl: 'https://leetcode.cn/problems/restore-ip-addresses/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/22228303.html',
  },
]);

if (typeof window.syncPlaygroundProblems === 'function' && document.readyState !== 'loading') {
  window.syncPlaygroundProblems();
}
