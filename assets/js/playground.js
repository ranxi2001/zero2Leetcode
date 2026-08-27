// =============================================
// Zero2Leetcode Playground - 在线 OJ
// =============================================

// ---------- 链表基础设施（注入到 Python 环境）----------
const LINKED_LIST_SETUP = `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
    def __repr__(self):
        vals = []
        node = self
        while node:
            vals.append(str(node.val))
            node = node.next
        return ' -> '.join(vals)

def _to_linked_list(arr):
    dummy = ListNode()
    curr = dummy
    for v in arr:
        curr.next = ListNode(v)
        curr = curr.next
    return dummy.next

def _to_array(node):
    result = []
    while node:
        result.append(node.val)
        node = node.next
    return result
`;

// ---------- 二叉树基础设施（注入到 Python 环境）----------
const BINARY_TREE_SETUP = `
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
    def __repr__(self):
        return f'TreeNode({self.val})'

def _to_tree(arr):
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

def _tree_to_array(root):
    if not root:
        return []
    result = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node:
            result.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(None)
    while result and result[-1] is None:
        result.pop()
    return result
`;

// ---------- 题目数据 ----------
const DETAILED_PROBLEMS = [
    {
        id: 1,
        title: 'LC 1 - 两数之和',
        difficulty: 'Easy',
        tags: ['哈希表'],
        description: `
<h3>1. 两数之和 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个整数数组 <code>nums</code> 和一个整数目标值 <code>target</code>，请你在该数组中找出<strong>和为目标值</strong>的那<strong>两个</strong>整数，并返回它们的数组下标。</p>
<p>你可以假设每种输入只会对应一个答案，并且你不能使用两次相同的元素。</p>
<p>你可以按任意顺序返回答案。</p>
<h4>示例</h4>
<pre>输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9，返回 [0, 1]</pre>
<pre>输入：nums = [3,2,4], target = 6
输出：[1,2]</pre>
<h4>提示</h4>
<ul>
<li>2 &lt;= nums.length &lt;= 10<sup>4</sup></li>
<li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
<li>只会存在一个有效答案</li>
</ul>`,
        template: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'two_sum',
        testCases: [
            { input: [[2, 7, 11, 15], 9], expected: [0, 1] },
            { input: [[3, 2, 4], 6], expected: [1, 2] },
            { input: [[3, 3], 6], expected: [0, 1] },
        ],
        compareFunc: 'sorted',
        solutionUrl: 'https://leetcode.cn/problems/two-sum/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19718436',
    },
    {
        id: 70,
        title: 'LC 70 - 爬楼梯',
        difficulty: 'Easy',
        tags: ['动态规划'],
        description: `
<h3>70. 爬楼梯 <span class="difficulty-tag easy">Easy</span></h3>
<p>假设你正在爬楼梯。需要 <code>n</code> 阶你才能到达楼顶。</p>
<p>每次你可以爬 <code>1</code> 或 <code>2</code> 个台阶。你有多少种不同的方法可以爬到楼顶呢？</p>
<h4>示例</h4>
<pre>输入：n = 2
输出：2
解释：有两种方法：1+1 和 2</pre>
<pre>输入：n = 3
输出：3
解释：有三种方法：1+1+1、1+2 和 2+1</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= n &lt;= 45</li>
</ul>`,
        template: `def climb_stairs(n):
    """
    :type n: int
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'climb_stairs',
        testCases: [
            { input: [2], expected: 2 },
            { input: [3], expected: 3 },
            { input: [5], expected: 8 },
            { input: [10], expected: 89 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/climbing-stairs/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19718527',
    },
    {
        id: 206,
        title: 'LC 206 - 反转链表',
        difficulty: 'Easy',
        tags: ['链表'],
        description: `
<h3>206. 反转链表 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你单链表的头节点 <code>head</code>，请你反转链表，并返回反转后的链表。</p>
<p><strong>说明：</strong>已内置 <code>ListNode</code> 类（<code>val</code> + <code>next</code>），输入输出自动转换，直接操作链表即可。</p>
<h4>示例</h4>
<pre>输入：head = [1,2,3,4,5]
输出：[5,4,3,2,1]</pre>
<pre>输入：head = [1,2]
输出：[2,1]</pre>
<pre>输入：head = []
输出：[]</pre>
<h4>提示</h4>
<ul>
<li>链表中节点的数目范围是 [0, 5000]</li>
<li>-5000 &lt;= Node.val &lt;= 5000</li>
</ul>`,
        template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reverse_list(head):
    """
    :type head: ListNode
    :rtype: ListNode
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'reverse_list',
        setup: LINKED_LIST_SETUP,
        argWrappers: ['_to_linked_list'],
        returnWrapper: '_to_array',
        testCases: [
            { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
            { input: [[1, 2]], expected: [2, 1] },
            { input: [[]], expected: [] },
            { input: [[1]], expected: [1] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/reverse-linked-list/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19722217',
    },
    {
        id: 20,
        title: 'LC 20 - 有效的括号',
        difficulty: 'Easy',
        tags: ['栈'],
        description: `
<h3>20. 有效的括号 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个只包括 <code>'('</code>，<code>')'</code>，<code>'{'</code>，<code>'}'</code>，<code>'['</code>，<code>']'</code> 的字符串 <code>s</code>，判断字符串是否有效。</p>
<p>有效字符串需满足：</p>
<ul>
<li>左括号必须用相同类型的右括号闭合。</li>
<li>左括号必须以正确的顺序闭合。</li>
<li>每个右括号都有一个对应的相同类型的左括号。</li>
</ul>
<h4>示例</h4>
<pre>输入：s = "()"
输出：True</pre>
<pre>输入：s = "()[]{}"
输出：True</pre>
<pre>输入：s = "(]"
输出：False</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= s.length &lt;= 10<sup>4</sup></li>
<li>s 仅由括号 '()[]{}' 组成</li>
</ul>`,
        template: `def is_valid(s):
    """
    :type s: str
    :rtype: bool
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'is_valid',
        testCases: [
            { input: ['()'], expected: true },
            { input: ['()[]{}'], expected: true },
            { input: ['(]'], expected: false },
            { input: ['([)]'], expected: false },
            { input: ['{[]}'], expected: true },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/valid-parentheses/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19722592',
    },
    {
        id: 21,
        title: 'LC 21 - 合并两个有序链表',
        difficulty: 'Easy',
        tags: ['链表'],
        description: `
<h3>21. 合并两个有序链表 <span class="difficulty-tag easy">Easy</span></h3>
<p>将两个升序链表合并为一个新的<strong>升序</strong>链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。</p>
<p><strong>说明：</strong>已内置 <code>ListNode</code> 类（<code>val</code> + <code>next</code>），输入输出自动转换，直接操作链表即可。</p>
<h4>示例</h4>
<pre>输入：list1 = [1,2,4], list2 = [1,3,4]
输出：[1,1,2,3,4,4]</pre>
<pre>输入：list1 = [], list2 = []
输出：[]</pre>
<pre>输入：list1 = [], list2 = [0]
输出：[0]</pre>
<h4>提示</h4>
<ul>
<li>两个链表的节点数目范围是 [0, 50]</li>
<li>-100 &lt;= Node.val &lt;= 100</li>
<li>两个链表均按非递减顺序排列</li>
</ul>`,
        template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def merge_two_lists(list1, list2):
    """
    :type list1: ListNode
    :type list2: ListNode
    :rtype: ListNode
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'merge_two_lists',
        setup: LINKED_LIST_SETUP,
        argWrappers: ['_to_linked_list', '_to_linked_list'],
        returnWrapper: '_to_array',
        testCases: [
            { input: [[1, 2, 4], [1, 3, 4]], expected: [1, 1, 2, 3, 4, 4] },
            { input: [[], []], expected: [] },
            { input: [[], [0]], expected: [0] },
            { input: [[1], [2]], expected: [1, 2] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/merge-two-sorted-lists/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19741176',
    },
    {
        id: 35,
        title: 'LC 35 - 搜索插入位置',
        difficulty: 'Easy',
        tags: ['二分查找'],
        description: `
<h3>35. 搜索插入位置 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。</p>
<p>请必须使用时间复杂度为 <code>O(log n)</code> 的算法。</p>
<h4>示例</h4>
<pre>输入：nums = [1,3,5,6], target = 5
输出：2</pre>
<pre>输入：nums = [1,3,5,6], target = 2
输出：1</pre>
<pre>输入：nums = [1,3,5,6], target = 7
输出：4</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>4</sup></li>
<li>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></li>
<li>nums 为无重复元素的升序排列数组</li>
</ul>`,
        template: `def search_insert(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'search_insert',
        testCases: [
            { input: [[1, 3, 5, 6], 5], expected: 2 },
            { input: [[1, 3, 5, 6], 2], expected: 1 },
            { input: [[1, 3, 5, 6], 7], expected: 4 },
            { input: [[1, 3, 5, 6], 0], expected: 0 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/search-insert-position/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19740616',
    },
    {
        id: 118,
        title: 'LC 118 - 杨辉三角',
        difficulty: 'Easy',
        tags: ['动态规划'],
        description: `
<h3>118. 杨辉三角 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个非负整数 <code>numRows</code>，生成「杨辉三角」的前 <code>numRows</code> 行。</p>
<p>在「杨辉三角」中，每个数是它左上方和右上方的数的和。</p>
<h4>示例</h4>
<pre>输入：numRows = 5
输出：[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]</pre>
<pre>输入：numRows = 1
输出：[[1]]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= numRows &lt;= 30</li>
</ul>`,
        template: `def generate(num_rows):
    """
    :type num_rows: int
    :rtype: List[List[int]]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'generate',
        testCases: [
            { input: [5], expected: [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]] },
            { input: [1], expected: [[1]] },
            { input: [3], expected: [[1], [1, 1], [1, 2, 1]] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/pascals-triangle/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19727095',
    },
    {
        id: 121,
        title: 'LC 121 - 买卖股票的最佳时机',
        difficulty: 'Easy',
        tags: ['贪心'],
        description: `
<h3>121. 买卖股票的最佳时机 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个数组 <code>prices</code>，它的第 <code>i</code> 个元素 <code>prices[i]</code> 表示一支给定股票第 <code>i</code> 天的价格。</p>
<p>你只能选择<strong>某一天</strong>买入这只股票，并选择在<strong>未来的某一个不同的日子</strong>卖出该股票。设计一个算法来计算你所能获取的最大利润。</p>
<p>返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 <code>0</code>。</p>
<h4>示例</h4>
<pre>输入：prices = [7,1,5,3,6,4]
输出：5
解释：在第 2 天买入（价格 = 1），第 5 天卖出（价格 = 6），利润 = 6-1 = 5</pre>
<pre>输入：prices = [7,6,4,3,1]
输出：0
解释：在这种情况下, 没有交易完成, 所以最大利润为 0</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= prices.length &lt;= 10<sup>5</sup></li>
<li>0 &lt;= prices[i] &lt;= 10<sup>4</sup></li>
</ul>`,
        template: `def max_profit(prices):
    """
    :type prices: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'max_profit',
        testCases: [
            { input: [[7, 1, 5, 3, 6, 4]], expected: 5 },
            { input: [[7, 6, 4, 3, 1]], expected: 0 },
            { input: [[2, 4, 1]], expected: 2 },
            { input: [[1]], expected: 0 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19727110',
    },
    {
        id: 136,
        title: 'LC 136 - 只出现一次的数字',
        difficulty: 'Easy',
        tags: ['位运算'],
        description: `
<h3>136. 只出现一次的数字 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你一个<strong>非空</strong>整数数组 <code>nums</code>，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。</p>
<p>你必须设计并实现线性时间复杂度的算法来解决此问题，且该算法只使用常量额外空间。</p>
<h4>示例</h4>
<pre>输入：nums = [2,2,1]
输出：1</pre>
<pre>输入：nums = [4,1,2,1,2]
输出：4</pre>
<pre>输入：nums = [1]
输出：1</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 3 * 10<sup>4</sup></li>
<li>-3 * 10<sup>4</sup> &lt;= nums[i] &lt;= 3 * 10<sup>4</sup></li>
<li>除了某个元素只出现一次以外，其余每个元素均出现两次</li>
</ul>`,
        template: `def single_number(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'single_number',
        testCases: [
            { input: [[2, 2, 1]], expected: 1 },
            { input: [[4, 1, 2, 1, 2]], expected: 4 },
            { input: [[1]], expected: 1 },
            { input: [[0, 1, 0]], expected: 1 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/single-number/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19731715',
    },
    {
        id: 169,
        title: 'LC 169 - 多数元素',
        difficulty: 'Easy',
        tags: ['技巧'],
        description: `
<h3>169. 多数元素 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个大小为 <code>n</code> 的数组 <code>nums</code>，返回其中的多数元素。多数元素是指在数组中出现次数<strong>大于</strong> <code>⌊ n/2 ⌋</code> 的元素。</p>
<p>你可以假设数组是非空的，并且给定的数组总是存在多数元素。</p>
<h4>示例</h4>
<pre>输入：nums = [3,2,3]
输出：3</pre>
<pre>输入：nums = [2,2,1,1,1,2,2]
输出：2</pre>
<h4>提示</h4>
<ul>
<li>n == nums.length</li>
<li>1 &lt;= n &lt;= 5 * 10<sup>4</sup></li>
<li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
</ul>
<p><strong>进阶：</strong>尝试设计时间复杂度为 O(n)、空间复杂度为 O(1) 的算法（Boyer-Moore 投票法）。</p>`,
        template: `def majority_element(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'majority_element',
        testCases: [
            { input: [[3, 2, 3]], expected: 3 },
            { input: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 },
            { input: [[1]], expected: 1 },
            { input: [[6, 5, 5]], expected: 5 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/majority-element/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19736326',
    },
    {
        id: 283,
        title: 'LC 283 - 移动零',
        difficulty: 'Easy',
        tags: ['双指针'],
        description: `
<h3>283. 移动零 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个数组 <code>nums</code>，编写一个函数将所有 <code>0</code> 移动到数组的末尾，同时保持非零元素的相对顺序。</p>
<p><strong>请注意</strong>，必须在不复制数组的情况下原地对数组进行操作。</p>
<h4>示例</h4>
<pre>输入：nums = [0,1,0,3,12]
输出：[0,1,0,3,12] → [1,3,12,0,0]</pre>
<pre>输入：nums = [0]
输出：[0]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>4</sup></li>
<li>-2<sup>31</sup> &lt;= nums[i] &lt;= 2<sup>31</sup> - 1</li>
</ul>
<p><strong>说明：</strong>本题返回修改后的数组即可。</p>`,
        template: `def move_zeroes(nums):
    """
    :type nums: List[int]
    :rtype: List[int]
    """
    # 在这里写你的代码（原地修改 nums 后返回）
    pass
`,
        functionName: 'move_zeroes',
        testCases: [
            { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0] },
            { input: [[0]], expected: [0] },
            { input: [[1, 0, 0, 2]], expected: [1, 2, 0, 0] },
            { input: [[1, 2, 3]], expected: [1, 2, 3] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/move-zeroes/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19736398',
    },
    // ========== 二叉树 ==========
    {
        id: 94,
        title: 'LC 94 - 二叉树的中序遍历',
        difficulty: 'Easy',
        tags: ['二叉树'],
        description: `
<h3>94. 二叉树的中序遍历 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个二叉树的根节点 <code>root</code>，返回它的<strong>中序遍历</strong>结果。</p>
<p><strong>说明：</strong>已内置 <code>TreeNode</code> 类（<code>val</code> + <code>left</code> + <code>right</code>），输入自动从数组转换为二叉树，直接操作树即可。</p>
<h4>示例</h4>
<pre>输入：root = [1,null,2,3]
输出：[1,3,2]</pre>
<pre>输入：root = []
输出：[]</pre>
<pre>输入：root = [1]
输出：[1]</pre>
<h4>提示</h4>
<ul>
<li>树中节点数目在范围 [0, 100] 内</li>
<li>-100 &lt;= Node.val &lt;= 100</li>
</ul>`,
        template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def inorder_traversal(root):
    """
    :type root: TreeNode
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'inorder_traversal',
        setup: BINARY_TREE_SETUP,
        argWrappers: ['_to_tree'],
        testCases: [
            { input: [[1, null, 2, 3]], expected: [1, 3, 2] },
            { input: [[]], expected: [] },
            { input: [[1]], expected: [1] },
            { input: [[1, 2, 3, 4, 5]], expected: [4, 2, 5, 1, 3] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/binary-tree-inorder-traversal/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19741295',
    },
    {
        id: 104,
        title: 'LC 104 - 二叉树的最大深度',
        difficulty: 'Easy',
        tags: ['二叉树'],
        description: `
<h3>104. 二叉树的最大深度 <span class="difficulty-tag easy">Easy</span></h3>
<p>给定一个二叉树 <code>root</code>，返回其<strong>最大深度</strong>。</p>
<p>二叉树的最大深度是指从根节点到最远叶子节点的最长路径上的节点数。</p>
<p><strong>说明：</strong>已内置 <code>TreeNode</code> 类（<code>val</code> + <code>left</code> + <code>right</code>），输入自动从数组转换为二叉树，直接操作树即可。</p>
<h4>示例</h4>
<pre>输入：root = [3,9,20,null,null,15,7]
输出：3</pre>
<pre>输入：root = [1,null,2]
输出：2</pre>
<h4>提示</h4>
<ul>
<li>树中节点的数量在 [0, 10<sup>4</sup>] 范围内</li>
<li>-100 &lt;= Node.val &lt;= 100</li>
</ul>`,
        template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def max_depth(root):
    """
    :type root: TreeNode
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'max_depth',
        setup: BINARY_TREE_SETUP,
        argWrappers: ['_to_tree'],
        testCases: [
            { input: [[3, 9, 20, null, null, 15, 7]], expected: 3 },
            { input: [[1, null, 2]], expected: 2 },
            { input: [[]], expected: 0 },
            { input: [[1]], expected: 1 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/maximum-depth-of-binary-tree/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19741351',
    },
    {
        id: 226,
        title: 'LC 226 - 翻转二叉树',
        difficulty: 'Easy',
        tags: ['二叉树'],
        description: `
<h3>226. 翻转二叉树 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你一棵二叉树的根节点 <code>root</code>，翻转这棵二叉树，并返回其根节点。</p>
<p><strong>说明：</strong>已内置 <code>TreeNode</code> 类（<code>val</code> + <code>left</code> + <code>right</code>），输入输出自动转换，直接操作树即可。</p>
<h4>示例</h4>
<pre>输入：root = [4,2,7,1,3,6,9]
输出：[4,7,2,9,6,3,1]</pre>
<pre>输入：root = [2,1,3]
输出：[2,3,1]</pre>
<pre>输入：root = []
输出：[]</pre>
<h4>提示</h4>
<ul>
<li>树中节点数目范围在 [0, 100] 内</li>
<li>-100 &lt;= Node.val &lt;= 100</li>
</ul>`,
        template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def invert_tree(root):
    """
    :type root: TreeNode
    :rtype: TreeNode
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'invert_tree',
        setup: BINARY_TREE_SETUP,
        argWrappers: ['_to_tree'],
        returnWrapper: '_tree_to_array',
        testCases: [
            { input: [[4, 2, 7, 1, 3, 6, 9]], expected: [4, 7, 2, 9, 6, 3, 1] },
            { input: [[2, 1, 3]], expected: [2, 3, 1] },
            { input: [[]], expected: [] },
            { input: [[1]], expected: [1] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/invert-binary-tree/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766910',
    },
    {
        id: 101,
        title: 'LC 101 - 对称二叉树',
        difficulty: 'Easy',
        tags: ['二叉树'],
        description: `
<h3>101. 对称二叉树 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你一个二叉树的根节点 <code>root</code>，检查它是否轴对称。</p>
<p><strong>说明：</strong>已内置 <code>TreeNode</code> 类（<code>val</code> + <code>left</code> + <code>right</code>），输入自动从数组转换为二叉树，直接操作树即可。</p>
<h4>示例</h4>
<pre>输入：root = [1,2,2,3,4,4,3]
输出：True</pre>
<pre>输入：root = [1,2,2,null,3,null,3]
输出：False</pre>
<h4>提示</h4>
<ul>
<li>树中节点数目在范围 [1, 1000] 内</li>
<li>-100 &lt;= Node.val &lt;= 100</li>
</ul>`,
        template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def is_symmetric(root):
    """
    :type root: TreeNode
    :rtype: bool
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'is_symmetric',
        setup: BINARY_TREE_SETUP,
        argWrappers: ['_to_tree'],
        testCases: [
            { input: [[1, 2, 2, 3, 4, 4, 3]], expected: true },
            { input: [[1, 2, 2, null, 3, null, 3]], expected: false },
            { input: [[1]], expected: true },
            { input: [[1, 2, 2, null, 3, 3]], expected: true },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/symmetric-tree/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766911',
    },
    {
        id: 543,
        title: 'LC 543 - 二叉树的直径',
        difficulty: 'Easy',
        tags: ['二叉树'],
        description: `
<h3>543. 二叉树的直径 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你一棵二叉树的根节点，返回该树的<strong>直径</strong>。</p>
<p>二叉树的直径是指树中任意两个节点之间最长路径的<strong>长度</strong>。这条路径可能经过也可能不经过根节点 <code>root</code>。</p>
<p>两节点之间路径的长度由它们之间边的数目表示。</p>
<p><strong>说明：</strong>已内置 <code>TreeNode</code> 类（<code>val</code> + <code>left</code> + <code>right</code>），输入自动从数组转换为二叉树，直接操作树即可。</p>
<h4>示例</h4>
<pre>输入：root = [1,2,3,4,5]
输出：3
解释：取路径 [4,2,1,3] 或 [5,2,1,3] 的长度</pre>
<pre>输入：root = [1,2]
输出：1</pre>
<h4>提示</h4>
<ul>
<li>树中节点数目在范围 [1, 10<sup>4</sup>] 内</li>
<li>-100 &lt;= Node.val &lt;= 100</li>
</ul>`,
        template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def diameter_of_binary_tree(root):
    """
    :type root: TreeNode
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'diameter_of_binary_tree',
        setup: BINARY_TREE_SETUP,
        argWrappers: ['_to_tree'],
        testCases: [
            { input: [[1, 2, 3, 4, 5]], expected: 3 },
            { input: [[1, 2]], expected: 1 },
            { input: [[1]], expected: 0 },
            { input: [[1, 2, 3, 4, 5, null, null, 8]], expected: 4 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/diameter-of-binary-tree/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766912',
    },
    {
        id: 102,
        title: 'LC 102 - 二叉树的层序遍历',
        difficulty: 'Medium',
        tags: ['二叉树'],
        description: `
<h3>102. 二叉树的层序遍历 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你二叉树的根节点 <code>root</code>，返回其节点值的<strong>层序遍历</strong>（即逐层地，从左到右访问所有节点）。</p>
<p><strong>说明：</strong>已内置 <code>TreeNode</code> 类（<code>val</code> + <code>left</code> + <code>right</code>），输入自动从数组转换为二叉树，直接操作树即可。</p>
<h4>示例</h4>
<pre>输入：root = [3,9,20,null,null,15,7]
输出：[[3],[9,20],[15,7]]</pre>
<pre>输入：root = [1]
输出：[[1]]</pre>
<pre>输入：root = []
输出：[]</pre>
<h4>提示</h4>
<ul>
<li>树中节点数目在范围 [0, 2000] 内</li>
<li>-1000 &lt;= Node.val &lt;= 1000</li>
</ul>`,
        template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def level_order(root):
    """
    :type root: TreeNode
    :rtype: List[List[int]]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'level_order',
        setup: BINARY_TREE_SETUP,
        argWrappers: ['_to_tree'],
        testCases: [
            { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
            { input: [[1]], expected: [[1]] },
            { input: [[]], expected: [] },
            { input: [[1, 2, 3, 4, 5]], expected: [[1], [2, 3], [4, 5]] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/binary-tree-level-order-traversal/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772923.html',
    },
    // ========== 滑动窗口 ==========
    {
        id: 3,
        title: 'LC 3 - 无重复字符的最长子串',
        difficulty: 'Medium',
        tags: ['滑动窗口'],
        description: `
<h3>3. 无重复字符的最长子串 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个字符串 <code>s</code>，请你找出其中不含有重复字符的<strong>最长子串</strong>的长度。</p>
<h4>示例</h4>
<pre>输入：s = "abcabcbb"
输出：3
解释：无重复字符的最长子串是 "abc"，长度为 3</pre>
<pre>输入：s = "bbbbb"
输出：1</pre>
<pre>输入：s = "pwwkew"
输出：3
解释：无重复字符的最长子串是 "wke"，长度为 3</pre>
<h4>提示</h4>
<ul>
<li>0 &lt;= s.length &lt;= 5 * 10<sup>4</sup></li>
<li>s 由英文字母、数字、符号和空格组成</li>
</ul>`,
        template: `def length_of_longest_substring(s):
    """
    :type s: str
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'length_of_longest_substring',
        testCases: [
            { input: ['abcabcbb'], expected: 3 },
            { input: ['bbbbb'], expected: 1 },
            { input: ['pwwkew'], expected: 3 },
            { input: [' '], expected: 1 },
            { input: [''], expected: 0 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/longest-substring-without-repeating-characters/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766922',
    },
    // ========== 双指针 ==========
    {
        id: 11,
        title: 'LC 11 - 盛最多水的容器',
        difficulty: 'Medium',
        tags: ['双指针'],
        description: `
<h3>11. 盛最多水的容器 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个长度为 <code>n</code> 的整数数组 <code>height</code>。有 <code>n</code> 条垂线，第 <code>i</code> 条线的两个端点是 <code>(i, 0)</code> 和 <code>(i, height[i])</code>。</p>
<p>找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。返回容器可以储存的最大水量。</p>
<h4>示例</h4>
<pre>输入：height = [1,8,6,2,5,4,8,3,7]
输出：49
解释：选择第 2 条线和第 9 条线，容器面积 = min(8,7) * (8-1) = 49</pre>
<pre>输入：height = [1,1]
输出：1</pre>
<h4>提示</h4>
<ul>
<li>n == height.length</li>
<li>2 &lt;= n &lt;= 10<sup>5</sup></li>
<li>0 &lt;= height[i] &lt;= 10<sup>4</sup></li>
</ul>`,
        template: `def max_area(height):
    """
    :type height: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'max_area',
        testCases: [
            { input: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
            { input: [[1, 1]], expected: 1 },
            { input: [[4, 3, 2, 1, 4]], expected: 16 },
            { input: [[1, 2, 1]], expected: 2 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/container-with-most-water/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766919',
    },
    // ========== 二分查找 ==========
    {
        id: 34,
        title: 'LC 34 - 在排序数组中查找元素的第一个和最后一个位置',
        difficulty: 'Medium',
        tags: ['二分查找'],
        description: `
<h3>34. 在排序数组中查找元素的第一个和最后一个位置 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个按照非递减顺序排列的整数数组 <code>nums</code>，和一个目标值 <code>target</code>。请你找出给定目标值在数组中的开始位置和结束位置。</p>
<p>如果数组中不存在目标值 <code>target</code>，返回 <code>[-1, -1]</code>。</p>
<p>你必须设计并实现时间复杂度为 <code>O(log n)</code> 的算法解决此问题。</p>
<h4>示例</h4>
<pre>输入：nums = [5,7,7,8,8,10], target = 8
输出：[3,4]</pre>
<pre>输入：nums = [5,7,7,8,8,10], target = 6
输出：[-1,-1]</pre>
<pre>输入：nums = [], target = 0
输出：[-1,-1]</pre>
<h4>提示</h4>
<ul>
<li>0 &lt;= nums.length &lt;= 10<sup>5</sup></li>
<li>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></li>
<li>nums 是一个非递减数组</li>
</ul>`,
        template: `def search_range(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'search_range',
        testCases: [
            { input: [[5, 7, 7, 8, 8, 10], 8], expected: [3, 4] },
            { input: [[5, 7, 7, 8, 8, 10], 6], expected: [-1, -1] },
            { input: [[], 0], expected: [-1, -1] },
            { input: [[1], 1], expected: [0, 0] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772980.html',
    },
    // ========== 回溯 ==========
    {
        id: 46,
        title: 'LC 46 - 全排列',
        difficulty: 'Medium',
        tags: ['回溯'],
        description: `
<h3>46. 全排列 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个不含重复数字的数组 <code>nums</code>，返回其<strong>所有可能的全排列</strong>。你可以按任意顺序返回答案。</p>
<h4>示例</h4>
<pre>输入：nums = [1,2,3]
输出：[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]</pre>
<pre>输入：nums = [0,1]
输出：[[0,1],[1,0]]</pre>
<pre>输入：nums = [1]
输出：[[1]]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 6</li>
<li>-10 &lt;= nums[i] &lt;= 10</li>
<li>nums 中的所有整数互不相同</li>
</ul>`,
        template: `def permute(nums):
    """
    :type nums: List[int]
    :rtype: List[List[int]]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'permute',
        testCases: [
            { input: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
            { input: [[0, 1]], expected: [[0, 1], [1, 0]] },
            { input: [[1]], expected: [[1]] },
        ],
        compareFunc: 'sorted_nested',
        solutionUrl: 'https://leetcode.cn/problems/permutations/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772936.html',
    },
    // ========== 矩阵 ==========
    {
        id: 48,
        title: 'LC 48 - 旋转图像',
        difficulty: 'Medium',
        tags: ['矩阵'],
        description: `
<h3>48. 旋转图像 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个 <code>n × n</code> 的二维矩阵 <code>matrix</code> 表示一个图像。请你将图像顺时针旋转 90 度。</p>
<p>你必须在<strong>原地</strong>旋转图像，直接修改输入的二维矩阵。</p>
<p><strong>说明：</strong>本题返回修改后的矩阵即可。</p>
<h4>示例</h4>
<pre>输入：matrix = [[1,2,3],[4,5,6],[7,8,9]]
输出：[[7,4,1],[8,5,2],[9,6,3]]</pre>
<pre>输入：matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
输出：[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]</pre>
<h4>提示</h4>
<ul>
<li>n == matrix.length == matrix[i].length</li>
<li>1 &lt;= n &lt;= 20</li>
<li>-1000 &lt;= matrix[i][j] &lt;= 1000</li>
</ul>`,
        template: `def rotate(matrix):
    """
    :type matrix: List[List[int]]
    :rtype: List[List[int]]
    """
    # 在这里写你的代码（原地修改 matrix 后返回）
    pass
`,
        functionName: 'rotate',
        testCases: [
            { input: [[[1, 2, 3], [4, 5, 6], [7, 8, 9]]], expected: [[7, 4, 1], [8, 5, 2], [9, 6, 3]] },
            { input: [[[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]], expected: [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]] },
            { input: [[[1]]], expected: [[1]] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/rotate-image/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778847.html',
    },
    // ========== 哈希表 ==========
    {
        id: 49,
        title: 'LC 49 - 字母异位词分组',
        difficulty: 'Medium',
        tags: ['哈希表'],
        description: `
<h3>49. 字母异位词分组 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个字符串数组，请你将<strong>字母异位词</strong>组合在一起。可以按任意顺序返回结果列表。</p>
<p><strong>字母异位词</strong>是由重新排列源单词的所有字母得到的一个新单词。</p>
<h4>示例</h4>
<pre>输入：strs = ["eat","tea","tan","ate","nat","bat"]
输出：[["bat"],["nat","tan"],["ate","eat","tea"]]</pre>
<pre>输入：strs = [""]
输出：[[""]]</pre>
<pre>输入：strs = ["a"]
输出：[["a"]]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= strs.length &lt;= 10<sup>4</sup></li>
<li>0 &lt;= strs[i].length &lt;= 100</li>
<li>strs[i] 仅包含小写字母</li>
</ul>`,
        template: `def group_anagrams(strs):
    """
    :type strs: List[str]
    :rtype: List[List[str]]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'group_anagrams',
        testCases: [
            { input: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
            { input: [['']], expected: [['']] },
            { input: [['a']], expected: [['a']] },
        ],
        compareFunc: 'sorted_nested',
        solutionUrl: 'https://leetcode.cn/problems/group-anagrams/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766917',
    },
    // ========== 子串/子数组 ==========
    {
        id: 53,
        title: 'LC 53 - 最大子数组和',
        difficulty: 'Medium',
        tags: ['子串/子数组'],
        description: `
<h3>53. 最大子数组和 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>nums</code>，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），返回其最大和。</p>
<h4>示例</h4>
<pre>输入：nums = [-2,1,-3,4,-1,2,1,-5,4]
输出：6
解释：连续子数组 [4,-1,2,1] 的和最大，为 6</pre>
<pre>输入：nums = [1]
输出：1</pre>
<pre>输入：nums = [5,4,-1,7,8]
输出：23</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>5</sup></li>
<li>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></li>
</ul>`,
        template: `def max_sub_array(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'max_sub_array',
        testCases: [
            { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6 },
            { input: [[1]], expected: 1 },
            { input: [[5, 4, -1, 7, 8]], expected: 23 },
            { input: [[-1]], expected: -1 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/maximum-subarray/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766929',
    },
    {
        id: 55,
        title: 'LC 55 - 跳跃游戏',
        difficulty: 'Medium',
        tags: ['贪心'],
        description: `
<h3>55. 跳跃游戏 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个非负整数数组 <code>nums</code>，你最初位于数组的<strong>第一个下标</strong>。数组中的每个元素代表你在该位置可以跳跃的最大长度。</p>
<p>判断你是否能够到达最后一个下标。如果可以，返回 <code>True</code>；否则，返回 <code>False</code>。</p>
<h4>示例</h4>
<pre>输入：nums = [2,3,1,1,4]
输出：True
解释：可以先跳 1 步到下标 1，然后跳 3 步到最后一个下标</pre>
<pre>输入：nums = [3,2,1,0,4]
输出：False
解释：无论怎样，总会到达下标为 3 的位置，该位置最大跳跃长度是 0</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>4</sup></li>
<li>0 &lt;= nums[i] &lt;= 10<sup>5</sup></li>
</ul>`,
        template: `def can_jump(nums):
    """
    :type nums: List[int]
    :rtype: bool
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'can_jump',
        testCases: [
            { input: [[2, 3, 1, 1, 4]], expected: true },
            { input: [[3, 2, 1, 0, 4]], expected: false },
            { input: [[0]], expected: true },
            { input: [[2, 0, 0]], expected: true },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/jump-game/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778837.html',
    },
    {
        id: 56,
        title: 'LC 56 - 合并区间',
        difficulty: 'Medium',
        tags: ['子串/子数组'],
        description: `
<h3>56. 合并区间 <span class="difficulty-tag medium">Medium</span></h3>
<p>以数组 <code>intervals</code> 表示若干个区间的集合，其中单个区间为 <code>intervals[i] = [start<sub>i</sub>, end<sub>i</sub>]</code>。请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。</p>
<h4>示例</h4>
<pre>输入：intervals = [[1,3],[2,6],[8,10],[15,18]]
输出：[[1,6],[8,10],[15,18]]
解释：区间 [1,3] 和 [2,6] 重叠, 将它们合并为 [1,6]</pre>
<pre>输入：intervals = [[1,4],[4,5]]
输出：[[1,5]]
解释：区间 [1,4] 和 [4,5] 可被视为重叠区间</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= intervals.length &lt;= 10<sup>4</sup></li>
<li>intervals[i].length == 2</li>
<li>0 &lt;= start<sub>i</sub> &lt;= end<sub>i</sub> &lt;= 10<sup>4</sup></li>
</ul>`,
        template: `def merge(intervals):
    """
    :type intervals: List[List[int]]
    :rtype: List[List[int]]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'merge',
        testCases: [
            { input: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
            { input: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
            { input: [[[1, 4], [0, 4]]], expected: [[0, 4]] },
            { input: [[[1, 4], [2, 3]]], expected: [[1, 4]] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/merge-intervals/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766930',
    },
    // ========== 回溯 ==========
    {
        id: 78,
        title: 'LC 78 - 子集',
        difficulty: 'Medium',
        tags: ['回溯'],
        description: `
<h3>78. 子集 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>nums</code>，数组中的元素<strong>互不相同</strong>。返回该数组所有可能的子集（幂集）。</p>
<p>解集<strong>不能</strong>包含重复的子集。你可以按<strong>任意顺序</strong>返回解集。</p>
<h4>示例</h4>
<pre>输入：nums = [1,2,3]
输出：[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]</pre>
<pre>输入：nums = [0]
输出：[[],[0]]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10</li>
<li>-10 &lt;= nums[i] &lt;= 10</li>
<li>nums 中的所有元素互不相同</li>
</ul>`,
        template: `def subsets(nums):
    """
    :type nums: List[int]
    :rtype: List[List[int]]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'subsets',
        testCases: [
            { input: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] },
            { input: [[0]], expected: [[], [0]] },
            { input: [[1, 2]], expected: [[], [1], [2], [1, 2]] },
        ],
        compareFunc: 'sorted_nested',
        solutionUrl: 'https://leetcode.cn/problems/subsets/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772937.html',
    },
    // ========== 动态规划 ==========
    {
        id: 198,
        title: 'LC 198 - 打家劫舍',
        difficulty: 'Medium',
        tags: ['动态规划'],
        description: `
<h3>198. 打家劫舍 <span class="difficulty-tag medium">Medium</span></h3>
<p>你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，<strong>如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警</strong>。</p>
<p>给定一个代表每个房屋存放金额的非负整数数组，计算你<strong>不触动警报装置的情况下</strong>，一夜之内能够偷窃到的最高金额。</p>
<h4>示例</h4>
<pre>输入：nums = [1,2,3,1]
输出：4
解释：偷窃 1 号房屋 (金额 = 1) 和 3 号房屋 (金额 = 3)，总金额 = 1 + 3 = 4</pre>
<pre>输入：nums = [2,7,9,3,1]
输出：12
解释：偷窃 1、3、5 号房屋，总金额 = 2 + 9 + 1 = 12</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 100</li>
<li>0 &lt;= nums[i] &lt;= 400</li>
</ul>`,
        template: `def rob(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'rob',
        testCases: [
            { input: [[1, 2, 3, 1]], expected: 4 },
            { input: [[2, 7, 9, 3, 1]], expected: 12 },
            { input: [[2, 1, 1, 2]], expected: 4 },
            { input: [[0]], expected: 0 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/house-robber/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778824.html',
    },
    // ========== 图论 ==========
    {
        id: 200,
        title: 'LC 200 - 岛屿数量',
        difficulty: 'Medium',
        tags: ['图论'],
        description: `
<h3>200. 岛屿数量 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个由 <code>'1'</code>（陆地）和 <code>'0'</code>（水）组成的的二维网格，请你计算网格中岛屿的数量。</p>
<p>岛屿总是被水包围，并且每座岛屿只能由水平方向和/或垂直方向上相邻的陆地连接形成。</p>
<p>此外，你可以假设该网格的四条边均被水包围。</p>
<h4>示例</h4>
<pre>输入：grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]
输出：1</pre>
<pre>输入：grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]
输出：3</pre>
<h4>提示</h4>
<ul>
<li>m == grid.length</li>
<li>n == grid[i].length</li>
<li>1 &lt;= m, n &lt;= 300</li>
<li>grid[i][j] 的值为 '0' 或 '1'</li>
</ul>`,
        template: `def num_islands(grid):
    """
    :type grid: List[List[str]]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'num_islands',
        testCases: [
            { input: [[['1', '1', '1', '1', '0'], ['1', '1', '0', '1', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '0', '0', '0']]], expected: 1 },
            { input: [[['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]], expected: 3 },
            { input: [[['1']]], expected: 1 },
            { input: [[['0']]], expected: 0 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/number-of-islands/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772932.html',
    },
    // ========== 堆 ==========
    {
        id: 215,
        title: 'LC 215 - 数组中的第K个最大元素',
        difficulty: 'Medium',
        tags: ['堆'],
        description: `
<h3>215. 数组中的第K个最大元素 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定整数数组 <code>nums</code> 和整数 <code>k</code>，请返回数组中第 <code>k</code> 个最大的元素。</p>
<p>请注意，你需要找的是数组排序后的第 <code>k</code> 个最大的元素，而不是第 <code>k</code> 个不同的元素。</p>
<p>你必须设计并实现时间复杂度为 <code>O(n)</code> 的算法解决此问题。</p>
<h4>示例</h4>
<pre>输入：nums = [3,2,1,5,6,4], k = 2
输出：5</pre>
<pre>输入：nums = [3,2,3,1,2,4,5,5,6], k = 4
输出：4</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= k &lt;= nums.length &lt;= 10<sup>5</sup></li>
<li>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></li>
</ul>`,
        template: `def find_kth_largest(nums, k):
    """
    :type nums: List[int]
    :type k: int
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'find_kth_largest',
        testCases: [
            { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5 },
            { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
            { input: [[1], 1], expected: 1 },
            { input: [[7, 6, 5, 4, 3, 2, 1], 5], expected: 3 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/kth-largest-element-in-an-array/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778840.html',
    },
    // ========== 链表 ==========
    {
        id: 234,
        title: 'LC 234 - 回文链表',
        difficulty: 'Easy',
        tags: ['链表'],
        description: `
<h3>234. 回文链表 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你一个单链表的头节点 <code>head</code>，请你判断该链表是否为<strong>回文链表</strong>。如果是，返回 <code>True</code>；否则，返回 <code>False</code>。</p>
<p><strong>说明：</strong>已内置 <code>ListNode</code> 类（<code>val</code> + <code>next</code>），输入自动转换，直接操作链表即可。</p>
<h4>示例</h4>
<pre>输入：head = [1,2,2,1]
输出：True</pre>
<pre>输入：head = [1,2]
输出：False</pre>
<h4>提示</h4>
<ul>
<li>链表中节点数目在范围 [1, 10<sup>5</sup>] 内</li>
<li>0 &lt;= Node.val &lt;= 9</li>
</ul>
<p><strong>进阶：</strong>你能否用 O(n) 时间复杂度和 O(1) 空间复杂度解决此题？</p>`,
        template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def is_palindrome(head):
    """
    :type head: ListNode
    :rtype: bool
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'is_palindrome',
        setup: LINKED_LIST_SETUP,
        argWrappers: ['_to_linked_list'],
        testCases: [
            { input: [[1, 2, 2, 1]], expected: true },
            { input: [[1, 2]], expected: false },
            { input: [[1]], expected: true },
            { input: [[1, 2, 3, 2, 1]], expected: true },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/palindrome-linked-list/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19741527',
    },
    // ========== 动态规划 ==========
    {
        id: 322,
        title: 'LC 322 - 零钱兑换',
        difficulty: 'Medium',
        tags: ['动态规划'],
        description: `
<h3>322. 零钱兑换 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>coins</code>，表示不同面额的硬币；以及一个整数 <code>amount</code>，表示总金额。</p>
<p>计算并返回可以凑成总金额所需的<strong>最少的硬币个数</strong>。如果没有任何一种硬币组合能组成总金额，返回 <code>-1</code>。</p>
<p>你可以认为每种硬币的数量是无限的。</p>
<h4>示例</h4>
<pre>输入：coins = [1,2,5], amount = 11
输出：3
解释：11 = 5 + 5 + 1</pre>
<pre>输入：coins = [2], amount = 3
输出：-1</pre>
<pre>输入：coins = [1], amount = 0
输出：0</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= coins.length &lt;= 12</li>
<li>1 &lt;= coins[i] &lt;= 2<sup>31</sup> - 1</li>
<li>0 &lt;= amount &lt;= 10<sup>4</sup></li>
</ul>`,
        template: `def coin_change(coins, amount):
    """
    :type coins: List[int]
    :type amount: int
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'coin_change',
        testCases: [
            { input: [[1, 2, 5], 11], expected: 3 },
            { input: [[2], 3], expected: -1 },
            { input: [[1], 0], expected: 0 },
            { input: [[1, 2, 5], 100], expected: 20 },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/coin-change/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19778826.html',
    },
    // ========== 栈 ==========
    {
        id: 739,
        title: 'LC 739 - 每日温度',
        difficulty: 'Medium',
        tags: ['栈'],
        description: `
<h3>739. 每日温度 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个整数数组 <code>temperatures</code>，表示每天的温度，返回一个数组 <code>answer</code>，其中 <code>answer[i]</code> 是指对于第 <code>i</code> 天，下一个更高温度出现在几天后。如果气温在这之后都不会升高，请在该位置用 <code>0</code> 来代替。</p>
<h4>示例</h4>
<pre>输入：temperatures = [73,74,75,71,69,72,76,73]
输出：[1,1,4,2,1,1,0,0]</pre>
<pre>输入：temperatures = [30,40,50,60]
输出：[1,1,1,0]</pre>
<pre>输入：temperatures = [30,60,90]
输出：[1,1,0]</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= temperatures.length &lt;= 10<sup>5</sup></li>
<li>30 &lt;= temperatures[i] &lt;= 100</li>
</ul>`,
        template: `def daily_temperatures(temperatures):
    """
    :type temperatures: List[int]
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'daily_temperatures',
        testCases: [
            { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
            { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
            { input: [[30, 60, 90]], expected: [1, 1, 0] },
            { input: [[100]], expected: [0] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/daily-temperatures/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766932',
    },
    // ========== 二叉树 ==========
    {
        id: 108,
        title: 'LC 108 - 将有序数组转换为二叉搜索树',
        difficulty: 'Easy',
        tags: ['二叉树'],
        description: `
<h3>108. 将有序数组转换为二叉搜索树 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你一个整数数组 <code>nums</code>，其中元素已经按<strong>严格递增</strong>顺序排列，请你将其转换为一棵<strong>平衡</strong>二叉搜索树。</p>
<p><strong>说明：</strong>已内置 <code>TreeNode</code> 类。系统会自动验证你返回的树是否为合法的平衡 BST（中序遍历结果与原数组一致即通过）。</p>
<h4>示例</h4>
<pre>输入：nums = [-10,-3,0,5,9]
输出：[0,-3,9,-10,null,5]（答案不唯一，合法即可）</pre>
<pre>输入：nums = [1,3]
输出：[3,1]（也接受 [1,null,3]）</pre>
<h4>提示</h4>
<ul>
<li>1 &lt;= nums.length &lt;= 10<sup>4</sup></li>
<li>-10<sup>4</sup> &lt;= nums[i] &lt;= 10<sup>4</sup></li>
<li>nums 按严格递增顺序排列</li>
</ul>`,
        template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def sorted_array_to_bst(nums):
    """
    :type nums: List[int]
    :rtype: TreeNode
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'sorted_array_to_bst',
        setup: BINARY_TREE_SETUP + `
def _validate_balanced_bst(root):
    if root is None:
        return []
    def height(node):
        if not node:
            return 0
        l, r = height(node.left), height(node.right)
        if l < 0 or r < 0 or abs(l - r) > 1:
            return -1
        return max(l, r) + 1
    if height(root) < 0:
        return "ERROR: not height-balanced"
    vals = []
    def inorder(node):
        if node:
            inorder(node.left)
            vals.append(node.val)
            inorder(node.right)
    inorder(root)
    for i in range(1, len(vals)):
        if vals[i] <= vals[i - 1]:
            return "ERROR: not a valid BST"
    return vals
`,
        returnWrapper: '_validate_balanced_bst',
        testCases: [
            { input: [[-10, -3, 0, 5, 9]], expected: [-10, -3, 0, 5, 9] },
            { input: [[1, 3]], expected: [1, 3] },
            { input: [[0]], expected: [0] },
            { input: [[-5, -3, 0, 1, 4, 7]], expected: [-5, -3, 0, 1, 4, 7] },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766901',
    },
    // ========== 链表 ==========
    {
        id: 141,
        title: 'LC 141 - 环形链表',
        difficulty: 'Easy',
        tags: ['链表'],
        description: `
<h3>141. 环形链表 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你一个链表的头节点 <code>head</code>，判断链表中是否有环。</p>
<p>如果链表中存在环（即某个节点的 <code>next</code> 指针指向链表中之前的某个节点），则返回 <code>True</code>；否则，返回 <code>False</code>。</p>
<p><strong>说明：</strong>已内置 <code>ListNode</code> 类。输入格式为 <code>[节点值数组, pos]</code>，其中 <code>pos</code> 表示尾节点连接到的节点下标（-1 表示无环），系统自动构造链表。</p>
<h4>示例</h4>
<pre>输入：head = [3,2,0,-4], pos = 1
输出：True
解释：链表中有一个环，尾节点连接到下标为 1 的节点</pre>
<pre>输入：head = [1,2], pos = 0
输出：True</pre>
<pre>输入：head = [1], pos = -1
输出：False</pre>
<h4>提示</h4>
<ul>
<li>链表中节点的数目范围是 [0, 10<sup>4</sup>]</li>
<li>-10<sup>5</sup> &lt;= Node.val &lt;= 10<sup>5</sup></li>
</ul>
<p><strong>进阶：</strong>你能用 O(1) 内存解决此题吗？（快慢指针）</p>`,
        template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def has_cycle(head):
    """
    :type head: ListNode
    :rtype: bool
    """
    # 在这里写你的代码
    pass
`,
        functionName: 'has_cycle',
        setup: LINKED_LIST_SETUP + `
def _to_cyclic_list(args):
    arr, pos = args
    if not arr:
        return None
    nodes = [ListNode(v) for v in arr]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if 0 <= pos < len(nodes):
        nodes[-1].next = nodes[pos]
    return nodes[0]
`,
        argWrappers: ['_to_cyclic_list'],
        testCases: [
            { input: [[[3, 2, 0, -4], 1]], expected: true },
            { input: [[[1, 2], 0]], expected: true },
            { input: [[[1], -1]], expected: false },
            { input: [[[1, 2, 3, 4], -1]], expected: false },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/linked-list-cycle/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19755041',
    },
    {
        id: 160,
        title: 'LC 160 - 相交链表',
        difficulty: 'Easy',
        tags: ['链表'],
        description: `
<h3>160. 相交链表 <span class="difficulty-tag easy">Easy</span></h3>
<p>给你两个单链表的头节点 <code>headA</code> 和 <code>headB</code>，请你找出并返回两个单链表相交的起始节点。如果两个链表不存在相交节点，返回 <code>null</code>。</p>
<p><strong>说明：</strong>已内置 <code>ListNode</code> 类。输入格式为 <code>[listA, listB, skipA, skipB]</code>，其中 <code>skipA/skipB</code> 表示各链表在相交前的节点数，系统自动构造共享尾部的两条链表。</p>
<h4>示例</h4>
<pre>输入：listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
输出：8
解释：相交节点的值为 8，A 跳过 2 个节点后、B 跳过 3 个节点后汇合</pre>
<pre>输入：listA = [1,9,1,2,4], listB = [3,2,4], skipA = 3, skipB = 1
输出：2</pre>
<pre>输入：listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
输出：null（无相交）</pre>
<h4>提示</h4>
<ul>
<li>listA 中节点数目为 m，listB 中节点数目为 n</li>
<li>1 &lt;= m, n &lt;= 3 * 10<sup>4</sup></li>
</ul>
<p><strong>进阶：</strong>你能设计一个时间复杂度 O(m + n)、空间复杂度 O(1) 的解法吗？</p>`,
        template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def get_intersection_node(headA, headB):
    """
    :type headA: ListNode
    :type headB: ListNode
    :rtype: ListNode
    """
    # 在这里写你的代码
    pass
`,
        functionName: '_test_intersection',
        setup: LINKED_LIST_SETUP + `
def _test_intersection(params):
    listA_vals, listB_vals, skipA, skipB = params
    shared = None
    if skipA < len(listA_vals):
        shared_nodes = [ListNode(v) for v in listA_vals[skipA:]]
        for i in range(len(shared_nodes) - 1):
            shared_nodes[i].next = shared_nodes[i + 1]
        shared = shared_nodes[0]
    headA = shared
    if skipA > 0:
        a_nodes = [ListNode(v) for v in listA_vals[:skipA]]
        for i in range(len(a_nodes) - 1):
            a_nodes[i].next = a_nodes[i + 1]
        a_nodes[-1].next = shared
        headA = a_nodes[0]
    headB = shared
    if skipB > 0:
        b_nodes = [ListNode(v) for v in listB_vals[:skipB]]
        for i in range(len(b_nodes) - 1):
            b_nodes[i].next = b_nodes[i + 1]
        b_nodes[-1].next = shared
        headB = b_nodes[0]
    result = get_intersection_node(headA, headB)
    return result.val if result else None
`,
        testCases: [
            { input: [[[4, 1, 8, 4, 5], [5, 6, 1, 8, 4, 5], 2, 3]], expected: 8 },
            { input: [[[1, 9, 1, 2, 4], [3, 2, 4], 3, 1]], expected: 2 },
            { input: [[[2, 6, 4], [1, 5], 3, 2]], expected: null },
        ],
        compareFunc: 'equal',
        solutionUrl: 'https://leetcode.cn/problems/intersection-of-two-linked-lists/solutions/',
        blogUrl: 'https://www.cnblogs.com/ranxi169/p/19754972',
    },
];

const FALLBACK_CATEGORY_NAMES = {
    "hash": "哈希表",
    "two-pointers": "双指针",
    "sliding-window": "滑动窗口",
    "subarray": "子串/子数组",
    "stack": "栈",
    "linked-list": "链表",
    "tree": "二叉树",
    "graph": "图论",
    "backtrack": "回溯",
    "binary-search": "二分查找",
    "dp": "动态规划",
    "greedy": "贪心",
    "heap": "堆",
    "matrix": "矩阵",
    "other": "其他",
};

const FALLBACK_DIFFICULTY_NAMES = {
    "easy": "简单",
    "medium": "中等",
    "hard": "困难",
};

function getCategoryName(category) {
    if (typeof window !== 'undefined' && window.CATEGORY_NAMES?.[category]) {
        return window.CATEGORY_NAMES[category];
    }
    return FALLBACK_CATEGORY_NAMES[category] || category;
}

function getDifficultyName(difficulty) {
    if (typeof window !== 'undefined' && window.DIFFICULTY_NAMES?.[difficulty]) {
        return window.DIFFICULTY_NAMES[difficulty];
    }
    return FALLBACK_DIFFICULTY_NAMES[difficulty] || difficulty;
}

function normalizeDifficulty(difficulty) {
    return {
        easy: 'Easy',
        medium: 'Medium',
        hard: 'Hard',
    }[difficulty] || difficulty;
}

function buildFallbackProblem(meta) {
    const title = `LC ${meta.id} - ${meta.title}`;
    const difficultyText = getDifficultyName(meta.difficulty);
    const categoryText = getCategoryName(meta.category);
    const solutionUrl = meta.url.replace(/\/$/, '') + '/solutions/';
    const blogTip = meta.blogUrl
        ? '<p>这道题已经有博客详解，可以直接查看解法，再去 LeetCode 提交验证。</p>'
        : '<p>这道题还没有博客详解，可以先跳到 LeetCode 练习。</p>';

    return {
        id: meta.id,
        title,
        difficulty: normalizeDifficulty(meta.difficulty),
        tags: [categoryText],
        description: `
<h3>${meta.id}. ${escapeHtml(meta.title)} <span class="difficulty-tag ${meta.difficulty}">${escapeHtml(difficultyText)}</span></h3>
<p>该题已经加入 Zero2Leetcode 题单，但当前页面还没有接入本地测试用例和专用模板。</p>
${blogTip}
<ul>
<li>分类：${escapeHtml(categoryText)}</li>
<li>难度：${escapeHtml(difficultyText)}</li>
</ul>
<p>如果是从外部链接直接打开 <code>?id=${meta.id}</code> 进入这里，说明题号识别已经生效；当前缺的只是这道题的本地 OJ 配置。</p>`,
        template: `def solve(*args):
    """
    LeetCode ${meta.id}. ${meta.title}
    当前题目暂未接入本地测试用例，请使用下方按钮跳转 LeetCode 练习。
    """
    pass
`,
        functionName: 'solve',
        testCases: [],
        compareFunc: 'equal',
        solutionUrl,
        blogUrl: meta.blogUrl || null,
        isFallback: true,
    };
}

function getExtraDetailedProblems() {
    if (typeof window === 'undefined' || !Array.isArray(window.PLAYGROUND_EXTRA_PROBLEMS)) {
        return [];
    }
    return window.PLAYGROUND_EXTRA_PROBLEMS;
}

function getAllDetailedProblems() {
    return [...DETAILED_PROBLEMS, ...getExtraDetailedProblems()];
}

function buildPlaygroundProblems() {
    const detailedById = new Map(getAllDetailedProblems().map(problem => [problem.id, problem]));
    const allProblems = (typeof window !== 'undefined' && Array.isArray(window.PROBLEMS_DATA) && window.PROBLEMS_DATA.length)
        ? window.PROBLEMS_DATA
        : DETAILED_PROBLEMS.map(problem => ({
            id: problem.id,
            title: problem.title.replace(/^LC\s+\d+\s*-\s*/, ''),
            difficulty: (problem.difficulty || '').toLowerCase(),
            category: '',
            url: problem.solutionUrl ? problem.solutionUrl.replace(/\/solutions\/$/, '/') : '',
            blogUrl: problem.blogUrl || null,
        }));

    const baseProblems = allProblems.map(meta => detailedById.get(meta.id) || buildFallbackProblem(meta));
    const baseIds = new Set(allProblems.map(p => p.id));
    const extraOnly = getExtraDetailedProblems().filter(p => !baseIds.has(p.id));
    return [...baseProblems, ...extraOnly];
}

let PROBLEMS = [];

function refreshProblems() {
    PROBLEMS = buildPlaygroundProblems();
    if (typeof window !== 'undefined') {
        window.PROBLEMS = PROBLEMS;
    }
    return PROBLEMS;
}

function getRequestedProblemId() {
    const urlId = new URLSearchParams(window.location.search).get('id');
    const parsedId = parseInt(urlId, 10);
    return Number.isNaN(parsedId) ? null : parsedId;
}

function syncProblemRegistry() {
    const previousProblemId = currentProblem?.id ?? null;
    refreshProblems();

    const select = document.getElementById('problem-select');
    if (!select) return;

    initProblemSelect();

    const requestedProblemId = getRequestedProblemId();
    const targetProblemId = requestedProblemId ?? previousProblemId ?? PROBLEMS[0]?.id ?? null;
    const nextIndex = PROBLEMS.findIndex(problem => problem.id === targetProblemId);

    if (nextIndex !== -1) {
        currentProblem = PROBLEMS[nextIndex];
        select.value = String(nextIndex);
    } else {
        currentProblem = PROBLEMS[0] || null;
        if (currentProblem) {
            select.value = '0';
        }
    }

    if (editor && currentProblem) {
        loadProblem(currentProblem);
    }
}

if (typeof window !== 'undefined') {
    window.syncPlaygroundProblems = syncProblemRegistry;
}

// ---------- 本地缓存 ----------
const STORAGE_KEY = 'z2l_playground_';
const LANGUAGE_STORAGE_KEY = 'z2l_playground_language';
const CORE_LANGUAGE_SUPPORT = window.LEETCODE_LANGUAGE_SUPPORT || null;
const CORE_LANGUAGE_CONFIGS = CORE_LANGUAGE_SUPPORT?.languages || {
    python: { label: 'Python 3', mode: 'python', indentUnit: 4, indentWithTabs: false },
};

function getCodeStorageKey(problemId, language = currentLanguage) {
    return language === 'python'
        ? STORAGE_KEY + problemId
        : `${STORAGE_KEY}${language}_${problemId}`;
}

function saveCode(problemId, code, language = currentLanguage) {
    try {
        localStorage.setItem(getCodeStorageKey(problemId, language), code);
        return true;
    } catch (e) {
        return false;
    }
}

function loadCode(problemId, language = currentLanguage) {
    try { return localStorage.getItem(getCodeStorageKey(problemId, language)); } catch (e) { return null; }
}

function clearSavedCode(problemId, language = currentLanguage) {
    try { localStorage.removeItem(getCodeStorageKey(problemId, language)); } catch (e) { /* noop */ }
}

// ---------- Python 自动补全 ----------
const PYTHON_KEYWORDS = [
    // 关键字
    'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
    'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
    'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
    'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return',
    'try', 'while', 'with', 'yield',
    // 内置函数
    'abs', 'all', 'any', 'bin', 'bool', 'chr', 'dict', 'dir',
    'divmod', 'enumerate', 'filter', 'float', 'format', 'frozenset',
    'getattr', 'hasattr', 'hash', 'hex', 'id', 'input', 'int',
    'isinstance', 'issubclass', 'iter', 'len', 'list', 'map', 'max',
    'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print',
    'property', 'range', 'repr', 'reversed', 'round', 'set',
    'setattr', 'slice', 'sorted', 'str', 'sum', 'super', 'tuple',
    'type', 'vars', 'zip',
    // 常用方法
    'append', 'extend', 'insert', 'remove', 'pop', 'clear', 'index',
    'count', 'sort', 'reverse', 'copy', 'keys', 'values', 'items',
    'get', 'update', 'add', 'discard', 'union', 'intersection',
    'split', 'join', 'strip', 'replace', 'find', 'startswith', 'endswith',
    'upper', 'lower', 'isdigit', 'isalpha',
];

function pythonHint(cm) {
    const cur = cm.getCursor();
    const token = cm.getTokenAt(cur);
    let start = token.start;
    let end = cur.ch;
    const word = token.string.slice(0, end - start);

    if (!word || word.length < 1) return;

    // 从代码中提取用户定义的标识符
    const code = cm.getValue();
    const userIdents = new Set();
    const identRe = /\b([a-zA-Z_]\w*)\b/g;
    let m;
    while ((m = identRe.exec(code)) !== null) {
        if (m[1] !== word) userIdents.add(m[1]);
    }

    const allWords = [...new Set([...PYTHON_KEYWORDS, ...userIdents])];
    const matches = allWords.filter(w =>
        w.startsWith(word) && w !== word
    ).sort();

    if (!matches.length) return;

    return {
        list: matches.slice(0, 15),
        from: CodeMirror.Pos(cur.line, start),
        to: CodeMirror.Pos(cur.line, end),
    };
}

// ---------- 全局状态 ----------
let pyodide = null;
let pyodideInitPromise = null;
let editor = null;
let currentProblem = null;
let isRunning = false;
let suppressEditorSave = false;

function getInitialLanguage() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('language') || params.get('lang') || localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return CORE_LANGUAGE_SUPPORT?.normalizeLanguage(requested) || 'python';
}

let currentLanguage = getInitialLanguage();

// ---------- 初始化 ----------
document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    syncProblemRegistry();
    bindEvents();
    activateCurrentRuntime();
});

// Some deploy platforms may delay or reorder non-critical scripts.
// Re-sync once the full page has loaded so late extra batches are still picked up.
window.addEventListener('load', () => {
    syncProblemRegistry();
});

function initEditor() {
    const language = CORE_LANGUAGE_CONFIGS[currentLanguage] || CORE_LANGUAGE_CONFIGS.python;
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        mode: language.mode,
        theme: 'material-darker',
        lineNumbers: true,
        indentUnit: language.indentUnit,
        tabSize: 4,
        indentWithTabs: language.indentWithTabs,
        lineWrapping: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        hintOptions: { completeSingle: false },
        extraKeys: {
            'Tab': (cm) => cm.replaceSelection('    ', 'end'),
            'Ctrl-Enter': () => runCode(),
            'Cmd-Enter': () => runCode(),
            'Ctrl-Space': (cm) => cm.showHint({ hint: pythonHint }),
        },
    });
    window.editor = editor; // expose for AI assistant

    // 输入时自动弹出补全
    editor.on('inputRead', (cm, change) => {
        if (currentLanguage !== 'python') return;
        if (change.origin !== '+input') return;
        const ch = change.text[0];
        // 输入字母/下划线且当前 token 长度 >= 2 时触发
        if (/[a-zA-Z_]/.test(ch)) {
            const token = cm.getTokenAt(cm.getCursor());
            if (token.string.length >= 2) {
                cm.showHint({ hint: pythonHint });
            }
        }
    });

    // 自动保存到 localStorage（防抖）
    let saveTimer = null;
    editor.on('change', () => {
        if (suppressEditorSave || !currentProblem) return;
        const problemId = currentProblem.id;
        const language = currentLanguage;
        clearTimeout(saveTimer);
        saveTimer = setTimeout(() => {
            saveCode(problemId, editor.getValue(), language);
        }, 500);
    });
}

function initProblemSelect() {
    const select = document.getElementById('problem-select');
    select.innerHTML = '';
    PROBLEMS.forEach((p, i) => {
        const opt = document.createElement('option');
        opt.value = i;
        opt.textContent = p.title;
        select.appendChild(opt);
    });
}

function loadProblem(problem) {
    currentProblem = problem;
    window.currentProblem = problem; // expose for AI assistant
    document.getElementById('problem-description').innerHTML = problem.description;
    const footer = document.getElementById('problem-footer');
    if (problem.solutionUrl) {
        const lcUrl = problem.solutionUrl.replace(/solutions\/$/, '');
        let btns = `<a href="${problem.solutionUrl}" target="_blank" rel="noopener" class="solution-btn">查看题解 ↗</a>`
            + `<a href="${lcUrl}" target="_blank" rel="noopener" class="solution-btn leetcode-btn">LeetCode 提交 ↗</a>`;
        if (problem.blogUrl) {
            btns += `<a href="${problem.blogUrl}" target="_blank" rel="noopener" class="solution-btn blog-btn">查看博客 ↗</a>`;
        }
        footer.innerHTML = btns;
        footer.style.display = '';
    } else {
        footer.innerHTML = '';
        footer.style.display = 'none';
    }
    // 优先从缓存恢复代码
    const cached = loadCode(problem.id, currentLanguage);
    const template = getCurrentTemplate(problem);
    suppressEditorSave = true;
    editor.setValue(cached || template);
    suppressEditorSave = false;
    clearOutput();
}

async function initPyodide() {
    if (pyodide) return pyodide;
    if (pyodideInitPromise) return pyodideInitPromise;
    pyodideInitPromise = (async () => {
        try {
            const runtime = await loadPyodide();
            pyodide = runtime;
            return runtime;
        } finally {
            pyodideInitPromise = null;
        }
    })();
    return pyodideInitPromise;
}

function getCurrentTemplate(problem = currentProblem, language = currentLanguage) {
    if (CORE_LANGUAGE_SUPPORT) return CORE_LANGUAGE_SUPPORT.getTemplate(problem, language);
    return problem?.template || '';
}

function setRuntimeStatus(text, state) {
    const status = document.getElementById('runtime-status');
    if (!status) return;
    status.textContent = text;
    status.className = `pyodide-status ${state}`;
}

function setRunButtonReady(ready) {
    const button = document.getElementById('run-btn');
    if (button) button.disabled = isRunning || !ready;
}

async function activateCurrentRuntime() {
    const languageAtStart = currentLanguage;
    if (languageAtStart === 'go') {
        setRuntimeStatus('Go 在线编译就绪', 'ready');
        setRunButtonReady(true);
        return;
    }
    if (languageAtStart === 'java') {
        if (!CORE_LANGUAGE_SUPPORT) {
            setRuntimeStatus('Java 17 运行层缺失', 'error');
            setRunButtonReady(false);
            return;
        }
        setRunButtonReady(false);
        try {
            await CORE_LANGUAGE_SUPPORT.prepareJava((message, state) => {
                if (currentLanguage === 'java') setRuntimeStatus(message, state);
            });
            if (currentLanguage === 'java') {
                setRuntimeStatus('Java 17 就绪', 'ready');
                setRunButtonReady(true);
            }
        } catch (error) {
            if (currentLanguage === 'java') {
                setRuntimeStatus('Java 17 加载失败', 'error');
                setRunButtonReady(false);
            }
            console.error('Java 17 runtime error:', error);
        }
        return;
    }

    setRuntimeStatus('Pyodide 加载中...', 'loading');
    setRunButtonReady(false);
    try {
        await initPyodide();
        if (currentLanguage === 'python') {
            setRuntimeStatus('Pyodide 就绪', 'ready');
            setRunButtonReady(true);
        }
    } catch (error) {
        if (currentLanguage === 'python') {
            setRuntimeStatus('Pyodide 加载失败', 'error');
            setRunButtonReady(false);
        }
        console.error('Pyodide load error:', error);
    }
}

function updateLanguageUi() {
    const config = CORE_LANGUAGE_CONFIGS[currentLanguage] || CORE_LANGUAGE_CONFIGS.python;
    const select = document.getElementById('language-select');
    if (select) select.value = currentLanguage;
    const hint = document.getElementById('language-hint');
    if (hint) hint.textContent = `${config.label} · 核心代码模式`;
    editor.setOption('mode', config.mode);
    editor.setOption('indentUnit', config.indentUnit);
    editor.setOption('indentWithTabs', config.indentWithTabs);
}

function switchLanguage(nextLanguage) {
    const next = CORE_LANGUAGE_SUPPORT?.normalizeLanguage(nextLanguage) || 'python';
    if (next === currentLanguage) return;
    if (currentProblem && editor) saveCode(currentProblem.id, editor.getValue(), currentLanguage);
    currentLanguage = next;
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
    const params = new URLSearchParams(window.location.search);
    params.set('language', currentLanguage);
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}${window.location.hash}`);
    updateLanguageUi();
    if (currentProblem) loadProblem(currentProblem);
    activateCurrentRuntime();
}

function bindEvents() {
    updateLanguageUi();
    document.getElementById('problem-select').addEventListener('change', (e) => {
        loadProblem(PROBLEMS[e.target.value]);
    });

    document.getElementById('language-select').addEventListener('change', (event) => {
        switchLanguage(event.target.value);
    });

    document.getElementById('run-btn').addEventListener('click', runCode);

    document.getElementById('reset-btn').addEventListener('click', () => {
        suppressEditorSave = true;
        editor.setValue(getCurrentTemplate());
        suppressEditorSave = false;
        clearSavedCode(currentProblem.id, currentLanguage);
        clearOutput();
    });

    // 移动端导航切换
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });
    }
}

// ---------- 代码执行 ----------
async function runCode() {
    if (isRunning) return;
    if (currentLanguage === 'python' && !pyodide) {
        await activateCurrentRuntime();
        if (!pyodide) return;
    }

    const runBtn = document.getElementById('run-btn');
    const languageSelect = document.getElementById('language-select');
    const problemSelect = document.getElementById('problem-select');
    isRunning = true;
    runBtn.disabled = true;
    languageSelect.disabled = true;
    problemSelect.disabled = true;
    runBtn.textContent = '运行中...';

    const outputArea = document.getElementById('output-area');
    const summary = document.getElementById('result-summary');
    outputArea.innerHTML = '';

    const userCode = editor.getValue();
    const problem = currentProblem;
    const testCases = Array.isArray(problem.testCases) ? problem.testCases : [];

    if (!testCases.length) {
        summary.textContent = '当前题目暂未接入本地测试';
        summary.className = 'result-summary';
        outputArea.innerHTML = `
<div class="output-placeholder">
    该题已支持按题号跳转，但当前页面还没有配置本地测试用例。<br>
    请使用下方按钮前往 LeetCode 提交，或查看博客详解。
</div>`;
        finishRunControls();
        return;
    }

    let passed = 0;
    const total = testCases.length;
    const totalStart = performance.now();
    try {
        if (currentLanguage === 'python') {
            for (let i = 0; i < total; i++) {
                const result = await runPythonTestCase(userCode, problem, testCases[i], i + 1);
                outputArea.appendChild(result.element);
                if (result.passed) passed++;
            }
        } else {
            const compiledResults = await CORE_LANGUAGE_SUPPORT.runCompiledTests(
                currentLanguage,
                problem,
                userCode,
                (message, state) => {
                    if (currentLanguage === 'java') setRuntimeStatus(message, state);
                }
            );
            const elapsed = (performance.now() - totalStart).toFixed(1);
            compiledResults.forEach((compiledResult, index) => {
                const result = renderTestResult(
                    problem,
                    testCases[index],
                    index + 1,
                    compiledResult.actual,
                    compiledResult.error,
                    index === 0 ? elapsed : ''
                );
                outputArea.appendChild(result.element);
                if (result.passed) passed++;
            });
        }
    } catch (error) {
        testCases.forEach((testCase, index) => {
            const result = renderTestResult(problem, testCase, index + 1, undefined, extractError(error), '');
            outputArea.appendChild(result.element);
        });
    }

    const totalTime = (performance.now() - totalStart).toFixed(1);

    // 更新总结
    if (passed === total) {
        summary.textContent = `${passed}/${total} 全部通过  ${totalTime} ms`;
        summary.className = 'result-summary all-pass';
    } else {
        summary.textContent = `${passed}/${total} 通过  ${totalTime} ms`;
        summary.className = 'result-summary has-fail';
    }

    finishRunControls();
}

function finishRunControls() {
    isRunning = false;
    const runBtn = document.getElementById('run-btn');
    runBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2l10 6-10 6V2z"/></svg> 运行代码`;
    document.getElementById('language-select').disabled = false;
    document.getElementById('problem-select').disabled = false;
    setRunButtonReady(true);
}

async function runPythonTestCase(userCode, problem, testCase, index) {
    try {
        // 构建 Python 代码：setup + 用户函数 + 调用
        const argsStr = testCase.input.map((arg, i) => {
            const repr = pythonRepr(arg);
            const wrapper = problem.argWrappers?.[i];
            return wrapper ? `${wrapper}(${repr})` : repr;
        }).join(', ');
        const callExpr = `${problem.functionName}(${argsStr})`;
        const resultExpr = problem.returnWrapper
            ? `${problem.returnWrapper}(${callExpr})`
            : callExpr;
        const fullCode = `
${problem.setup || ''}
${userCode}

__result__ = ${resultExpr}
`;
        const t0 = performance.now();
        await pyodide.runPythonAsync(fullCode);
        const elapsed = (performance.now() - t0).toFixed(1);
        const actual = pyodide.globals.get('__result__');
        const actualJS = toJS(actual);
        return renderTestResult(problem, testCase, index, actualJS, '', elapsed);
    } catch (err) {
        return renderTestResult(problem, testCase, index, undefined, extractError(err), '');
    }
}

function renderTestResult(problem, testCase, index, actual, error = '', elapsed = '') {
    const div = document.createElement('div');
    if (error) {
        div.className = 'test-case error';
        div.innerHTML = `
<div class="test-header">
    <span class="test-icon">&#10008;</span>
    <span class="test-label">测试用例 ${index}</span>
    <span class="test-status fail">错误</span>
</div>
<div class="test-detail">
    <div class="test-row"><span class="test-key">输入：</span><code>${escapeHtml(formatInput(problem, testCase.input))}</code></div>
    <div class="test-row error-msg"><span class="test-key">错误：</span><code>${escapeHtml(error)}</code></div>
</div>`;
        return { element: div, passed: false };
    }

    const passed = compareResults(actual, testCase.expected, problem.compareFunc);
    const time = elapsed ? `<span class="test-time">${elapsed} ms</span>` : '';
    div.className = `test-case ${passed ? 'pass' : 'fail'}`;
    div.innerHTML = `
<div class="test-header">
    <span class="test-icon">${passed ? '&#10004;' : '&#10008;'}</span>
    <span class="test-label">测试用例 ${index}</span>
    ${time}
    <span class="test-status ${passed ? 'pass' : 'fail'}">${passed ? '通过' : '失败'}</span>
</div>
<div class="test-detail">
    <div class="test-row"><span class="test-key">输入：</span><code>${escapeHtml(formatInput(problem, testCase.input))}</code></div>
    <div class="test-row"><span class="test-key">预期：</span><code>${escapeHtml(JSON.stringify(testCase.expected))}</code></div>
    <div class="test-row"><span class="test-key">实际：</span><code>${escapeHtml(JSON.stringify(actual))}</code></div>
</div>`;
    return { element: div, passed };
}

// ---------- 工具函数 ----------
function pythonRepr(val) {
    if (val === null || val === undefined) return 'None';
    if (typeof val === 'boolean') return val ? 'True' : 'False';
    if (typeof val === 'number') return String(val);
    if (typeof val === 'string') return JSON.stringify(val);
    if (Array.isArray(val)) return '[' + val.map(pythonRepr).join(', ') + ']';
    return JSON.stringify(val);
}

function toJS(pyVal) {
    if (pyVal === undefined || pyVal === null) return null;
    if (typeof pyVal === 'number' || typeof pyVal === 'string' || typeof pyVal === 'boolean') return pyVal;
    if (pyVal.toJs) {
        const jsVal = pyVal.toJs({ dict_converter: Object.fromEntries });
        if (jsVal instanceof Map) return Array.from(jsVal.values());
        return jsVal;
    }
    return pyVal;
}

function compareResults(actual, expected, mode) {
    if (mode === 'sorted') {
        if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
        return JSON.stringify([...actual].sort()) === JSON.stringify([...expected].sort());
    }
    if (mode === 'sorted_nested') {
        if (!Array.isArray(actual) || !Array.isArray(expected)) return false;
        const normalize = arr => arr
            .map(x => Array.isArray(x) ? [...x].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))) : x)
            .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
        return JSON.stringify(normalize(actual)) === JSON.stringify(normalize(expected));
    }
    // 'equal' default
    return JSON.stringify(actual) === JSON.stringify(expected);
}

function formatInput(problem, inputs) {
    const signature = CORE_LANGUAGE_SUPPORT?.parseProblemSignature(problem);
    if (signature?.kind === 'function' && signature.params.length === inputs.length) {
        return inputs.map((value, index) => {
            const rawName = signature.params[index]?.name || `arg${index}`;
            const name = currentLanguage === 'python' ? rawName : CORE_LANGUAGE_SUPPORT.toCamelCase(rawName);
            return `${name} = ${JSON.stringify(value)}`;
        }).join(', ');
    }
    return inputs.map((value) => JSON.stringify(value)).join(', ');
}

function extractError(err) {
    const msg = String(err.message || err);
    // 提取最后一行 Python 错误信息
    const lines = msg.split('\n').filter(l => l.trim());
    return lines[lines.length - 1] || msg;
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function clearOutput() {
    document.getElementById('output-area').innerHTML =
        '<div class="output-placeholder">点击「运行代码」查看测试结果</div>';
    document.getElementById('result-summary').textContent = '';
    document.getElementById('result-summary').className = 'result-summary';
}

function replacePlaygroundEditorContents(value, origin = '+ai') {
    const doc = editor?.getDoc?.() || editor;
    if (typeof doc?.replaceRange !== 'function') {
        editor?.setValue?.(value);
        return;
    }
    const firstLine = typeof doc.firstLine === 'function' ? doc.firstLine() : 0;
    const lastLine = typeof doc.lastLine === 'function'
        ? doc.lastLine()
        : Math.max(firstLine, (doc.lineCount?.() || 1) - 1);
    const replace = () => doc.replaceRange(
        value,
        { line: firstLine, ch: 0 },
        { line: lastLine, ch: (doc.getLine?.(lastLine) || '').length },
        origin
    );
    if (typeof editor.operation === 'function') editor.operation(replace);
    else replace();
}

function applyGeneratedCodeToPlayground(payload = {}) {
    const language = String(payload.language || '').trim().toLowerCase();
    const code = payload.code;
    if (!Object.prototype.hasOwnProperty.call(CORE_LANGUAGE_CONFIGS, language)) {
        return { ok: false, message: '当前练习场不支持这种编程语言。' };
    }
    if (typeof code !== 'string' || !code.trim()) {
        return { ok: false, message: '代码块为空，无法写入编辑器。' };
    }
    if (new TextEncoder().encode(code).byteLength > 96 * 1024) {
        return { ok: false, message: '代码超过 96 KB，无法写入编辑器。' };
    }
    if (!editor || !currentProblem) {
        return { ok: false, message: '编辑器尚未准备好，请稍后重试。' };
    }

    if (language !== currentLanguage) switchLanguage(language);

    const previousCode = editor.getValue();
    if (previousCode !== code) {
        try {
            replacePlaygroundEditorContents(code);
        } catch (error) {
            return { ok: false, message: '写入编辑器失败，请重试。' };
        }
        if (!saveCode(currentProblem.id, code, currentLanguage)) {
            replacePlaygroundEditorContents(previousCode, '+ai-rollback');
            return { ok: false, message: '浏览器无法保存生成的代码，已恢复原草稿。' };
        }
    }
    clearOutput();
    editor.refresh?.();
    return { ok: true, language: currentLanguage };
}

window.leetcodeApplyGeneratedCode = applyGeneratedCodeToPlayground;
window.leetcodeGetLanguageContext = () => ({
    language: currentLanguage,
    languageLabel: CORE_LANGUAGE_CONFIGS[currentLanguage]?.label || 'Python 3',
    template: getCurrentTemplate(),
});
