// Extra detailed problems (batch 1). This file is safe to load before/after playground.js.
window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  {
    id: 128,
    title: 'LC 128 - 最长连续序列',
    difficulty: 'Medium',
    tags: ['哈希表'],
    description: `
<h3>128. 最长连续序列 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个未排序的整数数组 <code>nums</code>，找出数字连续的最长序列（不要求序列元素在原数组中连续）的长度。</p>
<p>请你设计并实现时间复杂度为 <code>O(n)</code> 的算法解决此问题。</p>
<h4>示例</h4>
<pre>输入：nums = [100,4,200,1,3,2]
输出：4
解释：最长连续序列是 [1,2,3,4]，长度为 4。</pre>
<pre>输入：nums = [0,3,7,2,5,8,4,6,0,1]
输出：9</pre>
<h4>提示</h4>
<ul>
  <li><code>0 &lt;= nums.length &lt;= 10^5</code></li>
  <li><code>-10^9 &lt;= nums[i] &lt;= 10^9</code></li>
</ul>`,
    template: `def longest_consecutive(nums):
    """
    :type nums: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'longest_consecutive',
    testCases: [
      { input: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
      { input: [[]], expected: 0 },
      { input: [[1, 2, 0, 1]], expected: 3 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/longest-consecutive-sequence/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766918',
  },
  {
    id: 15,
    title: 'LC 15 - 三数之和',
    difficulty: 'Medium',
    tags: ['双指针', '排序'],
    description: `
<h3>15. 三数之和 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>nums</code>，判断是否存在三元组 <code>[nums[i], nums[j], nums[k]]</code> 满足 <code>i != j</code>、<code>i != k</code>、<code>j != k</code>，且 <code>nums[i] + nums[j] + nums[k] == 0</code>。</p>
<p>请你返回所有和为 <code>0</code> 且不重复的三元组。</p>
<h4>示例</h4>
<pre>输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]</pre>
<pre>输入：nums = [0,0,0,0]
输出：[[0,0,0]]</pre>
<h4>提示</h4>
<ul>
  <li><code>3 &lt;= nums.length &lt;= 3000</code></li>
  <li><code>-10^5 &lt;= nums[i] &lt;= 10^5</code></li>
</ul>`,
    template: `def three_sum(nums):
    """
    :type nums: List[int]
    :rtype: List[List[int]]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'three_sum',
    testCases: [
      { input: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { input: [[0, 0, 0, 0]], expected: [[0, 0, 0]] },
      { input: [[0, 1, 1]], expected: [] },
      { input: [[-2, 0, 0, 2, 2]], expected: [[-2, 0, 2]] },
    ],
    compareFunc: 'sorted_nested',
    solutionUrl: 'https://leetcode.cn/problems/3sum/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766921',
  },
  {
    id: 42,
    title: 'LC 42 - 接雨水',
    difficulty: 'Hard',
    tags: ['双指针', '单调栈'],
    description: `
<h3>42. 接雨水 <span class="difficulty-tag hard">Hard</span></h3>
<p>给定 <code>n</code> 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能接多少雨水。</p>
<h4>示例</h4>
<pre>输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
输出：6</pre>
<pre>输入：height = [4,2,0,3,2,5]
输出：9</pre>
<h4>提示</h4>
<ul>
  <li><code>n == height.length</code></li>
  <li><code>1 &lt;= n &lt;= 2 * 10^4</code></li>
  <li><code>0 &lt;= height[i] &lt;= 10^5</code></li>
</ul>`,
    template: `def trap(height):
    """
    :type height: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'trap',
    testCases: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { input: [[1, 0, 1]], expected: 1 },
      { input: [[2, 0, 2]], expected: 2 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/trapping-rain-water/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772917.html',
  },
  {
    id: 438,
    title: 'LC 438 - 找到字符串中所有字母异位词',
    difficulty: 'Medium',
    tags: ['滑动窗口'],
    description: `
<h3>438. 找到字符串中所有字母异位词 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定两个字符串 <code>s</code> 和 <code>p</code>，找到 <code>s</code> 中所有 <code>p</code> 的异位词的子串，返回这些子串的起始索引。</p>
<p>异位词指由相同字母重排列形成的字符串。</p>
<h4>示例</h4>
<pre>输入：s = "cbaebabacd", p = "abc"
输出：[0,6]</pre>
<pre>输入：s = "abab", p = "ab"
输出：[0,1,2]</pre>
<h4>提示</h4>
<ul>
  <li><code>1 &lt;= s.length, p.length &lt;= 3 * 10^4</code></li>
  <li><code>s</code> 和 <code>p</code> 仅包含小写英文字母</li>
</ul>`,
    template: `def find_anagrams(s, p):
    """
    :type s: str
    :type p: str
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'find_anagrams',
    testCases: [
      { input: ['cbaebabacd', 'abc'], expected: [0, 6] },
      { input: ['abab', 'ab'], expected: [0, 1, 2] },
      { input: ['aaaaa', 'aa'], expected: [0, 1, 2, 3] },
      { input: ['abc', 'abcd'], expected: [] },
    ],
    compareFunc: 'sorted',
    solutionUrl: 'https://leetcode.cn/problems/find-all-anagrams-in-a-string/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766923',
  },
  {
    id: 76,
    title: 'LC 76 - 最小覆盖子串',
    difficulty: 'Hard',
    tags: ['滑动窗口'],
    description: `
<h3>76. 最小覆盖子串 <span class="difficulty-tag hard">Hard</span></h3>
<p>给你一个字符串 <code>s</code> 和一个字符串 <code>t</code>。返回 <code>s</code> 中涵盖 <code>t</code> 所有字符的最小子串。如果不存在，返回空字符串 <code>""</code>。</p>
<h4>示例</h4>
<pre>输入：s = "ADOBECODEBANC", t = "ABC"
输出："BANC"</pre>
<pre>输入：s = "a", t = "a"
输出："a"</pre>
<pre>输入：s = "a", t = "aa"
输出：""</pre>
<h4>提示</h4>
<ul>
  <li><code>1 &lt;= s.length, t.length &lt;= 10^5</code></li>
  <li><code>s</code> 和 <code>t</code> 由英文字母组成</li>
</ul>`,
    template: `def min_window(s, t):
    """
    :type s: str
    :type t: str
    :rtype: str
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'min_window',
    testCases: [
      { input: ['ADOBECODEBANC', 'ABC'], expected: 'BANC' },
      { input: ['a', 'a'], expected: 'a' },
      { input: ['a', 'aa'], expected: '' },
      { input: ['aaabdabcefaecbef', 'abc'], expected: 'abc' },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/minimum-window-substring/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772918.html',
  },
  {
    id: 560,
    title: 'LC 560 - 和为 K 的子数组',
    difficulty: 'Medium',
    tags: ['前缀和', '哈希表'],
    description: `
<h3>560. 和为 K 的子数组 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个整数数组 <code>nums</code> 和一个整数 <code>k</code>，请你统计并返回该数组中和为 <code>k</code> 的连续子数组的个数。</p>
<h4>示例</h4>
<pre>输入：nums = [1,1,1], k = 2
输出：2</pre>
<pre>输入：nums = [1,2,3], k = 3
输出：2</pre>
<h4>提示</h4>
<ul>
  <li><code>1 &lt;= nums.length &lt;= 2 * 10^4</code></li>
  <li><code>-1000 &lt;= nums[i] &lt;= 1000</code></li>
  <li><code>-10^7 &lt;= k &lt;= 10^7</code></li>
</ul>`,
    template: `def subarray_sum(nums, k):
    """
    :type nums: List[int]
    :type k: int
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'subarray_sum',
    testCases: [
      { input: [[1, 1, 1], 2], expected: 2 },
      { input: [[1, 2, 3], 3], expected: 2 },
      { input: [[-1, -1, 1], 0], expected: 1 },
      { input: [[0, 0, 0], 0], expected: 6 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/subarray-sum-equals-k/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766928',
  },
  {
    id: 239,
    title: 'LC 239 - 滑动窗口最大值',
    difficulty: 'Hard',
    tags: ['单调队列', '滑动窗口'],
    description: `
<h3>239. 滑动窗口最大值 <span class="difficulty-tag hard">Hard</span></h3>
<p>给你一个整数数组 <code>nums</code>，有一个大小为 <code>k</code> 的滑动窗口从数组的最左侧移动到最右侧。你只可以看到窗口中的 <code>k</code> 个数字。滑动窗口每次只向右移动一位。</p>
<p>返回滑动窗口中的最大值。</p>
<h4>示例</h4>
<pre>输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
输出：[3,3,5,5,6,7]</pre>
<pre>输入：nums = [1], k = 1
输出：[1]</pre>
<h4>提示</h4>
<ul>
  <li><code>1 &lt;= nums.length &lt;= 10^5</code></li>
  <li><code>-10^4 &lt;= nums[i] &lt;= 10^4</code></li>
  <li><code>1 &lt;= k &lt;= nums.length</code></li>
</ul>`,
    template: `def max_sliding_window(nums, k):
    """
    :type nums: List[int]
    :type k: int
    :rtype: List[int]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'max_sliding_window',
    testCases: [
      { input: [[1, 3, -1, -3, 5, 3, 6, 7], 3], expected: [3, 3, 5, 5, 6, 7] },
      { input: [[1], 1], expected: [1] },
      { input: [[9, 11], 2], expected: [11] },
      { input: [[4, -2], 1], expected: [4, -2] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/sliding-window-maximum/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772919.html',
  },
  {
    id: 155,
    title: 'LC 155 - 最小栈',
    difficulty: 'Medium',
    tags: ['栈', '设计'],
    description: `
<h3>155. 最小栈 <span class="difficulty-tag medium">Medium</span></h3>
<p>设计一个支持 <code>push</code>、<code>pop</code>、<code>top</code> 以及在常数时间内检索最小元素的栈。</p>
<p><strong>本地练习约定：</strong>为了适配单函数 OJ，这里使用函数 <code>min_stack(ops)</code> 来模拟操作：</p>
<ul>
  <li><code>ops</code> 是操作列表，如 <code>[["push",-2],["push",0],["getMin"],["pop"],["top"]]</code></li>
  <li>函数返回所有 <code>top/getMin</code> 操作的输出（按出现顺序）</li>
</ul>
<h4>示例</h4>
<pre>输入：ops = [["push",-2],["push",0],["push",-3],["getMin"],["pop"],["top"],["getMin"]]
输出：[-3,0,-2]</pre>
<h4>提示</h4>
<ul>
  <li><code>push/pop/top/getMin</code> 总操作次数不超过 <code>3 * 10^4</code></li>
</ul>`,
    template: `def min_stack(ops):
    """
    本地练习签名：
    :type ops: List[List[object]]
    :rtype: List[int]
    """
    # 在这里写你的代码
    # 建议：用两个栈，一个存值，一个存当前最小值
    pass
`,
    functionName: 'min_stack',
    testCases: [
      {
        input: [[['push', -2], ['push', 0], ['push', -3], ['getMin'], ['pop'], ['top'], ['getMin']]],
        expected: [-3, 0, -2],
      },
      {
        input: [[['push', 1], ['getMin'], ['push', 2], ['getMin'], ['pop'], ['getMin']]],
        expected: [1, 1, 1],
      },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/min-stack/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766931',
  },
  {
    id: 394,
    title: 'LC 394 - 字符串解码',
    difficulty: 'Medium',
    tags: ['栈', '字符串'],
    description: `
<h3>394. 字符串解码 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个经过编码的字符串，返回它解码后的字符串。</p>
<p>编码规则：<code>k[encoded_string]</code> 表示括号中的 <code>encoded_string</code> 重复 <code>k</code> 次。你可以认为输入字符串总是有效的，且数字只表示重复次数。</p>
<h4>示例</h4>
<pre>输入：s = "3[a]2[bc]"
输出："aaabcbc"</pre>
<pre>输入：s = "3[a2[c]]"
输出："accaccacc"</pre>
<pre>输入：s = "2[abc]3[cd]ef"
输出："abcabccdcdcdef"</pre>
<h4>提示</h4>
<ul>
  <li><code>1 &lt;= s.length &lt;= 30</code></li>
  <li><code>s</code> 由小写字母、数字和方括号组成</li>
</ul>`,
    template: `def decode_string(s):
    """
    :type s: str
    :rtype: str
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'decode_string',
    testCases: [
      { input: ['3[a]2[bc]'], expected: 'aaabcbc' },
      { input: ['3[a2[c]]'], expected: 'accaccacc' },
      { input: ['2[abc]3[cd]ef'], expected: 'abcabccdcdcdef' },
      { input: ['10[a]'], expected: 'aaaaaaaaaa' },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/decode-string/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766933',
  },
  {
    id: 84,
    title: 'LC 84 - 柱状图中最大的矩形',
    difficulty: 'Hard',
    tags: ['栈', '单调栈'],
    description: `
<h3>84. 柱状图中最大的矩形 <span class="difficulty-tag hard">Hard</span></h3>
<p>给定 <code>n</code> 个非负整数，用来表示柱状图中各个柱子的高度。每个柱子彼此相邻，且宽度为 1。</p>
<p>求在该柱状图中，能够勾勒出来的矩形的最大面积。</p>
<h4>示例</h4>
<pre>输入：heights = [2,1,5,6,2,3]
输出：10</pre>
<pre>输入：heights = [2,4]
输出：4</pre>
<h4>提示</h4>
<ul>
  <li><code>1 &lt;= heights.length &lt;= 10^5</code></li>
  <li><code>0 &lt;= heights[i] &lt;= 10^4</code></li>
</ul>`,
    template: `def largest_rectangle_area(heights):
    """
    :type heights: List[int]
    :rtype: int
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'largest_rectangle_area',
    testCases: [
      { input: [[2, 1, 5, 6, 2, 3]], expected: 10 },
      { input: [[2, 4]], expected: 4 },
      { input: [[1, 1, 1, 1]], expected: 4 },
      { input: [[6, 2, 5, 4, 5, 1, 6]], expected: 12 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/largest-rectangle-in-histogram/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772920.html',
  },
  {
    id: 142,
    title: 'LC 142 - 环形链表 II',
    difficulty: 'Medium',
    tags: ['链表', '双指针'],
    description: `
<h3>142. 环形链表 II <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个链表的头节点 <code>head</code>，返回链表开始入环的第一个节点。如果链表无环，则返回 <code>null</code>。</p>
<p>不允许修改链表。</p>
<p><strong>本地判题：</strong>已内置 <code>ListNode</code> 类。系统根据 <code>head</code> 数组和 <code>pos</code> 自动构造链表：<code>pos</code> 是尾节点连接的节点索引，<code>-1</code> 表示无环，不会传入你的函数。请返回原链表中的入环节点对象或 <code>None</code>，不要返回节点值或索引。测试结果将节点显示为从 0 开始的索引，无环显示为 <code>null</code>，并检查链表未被修改。</p>
<h4>示例</h4>
<pre>输入：head = [3,2,0,-4], pos = 1
输出：索引 1 对应的节点（值为 2）</pre>
<pre>输入：head = [1,2], pos = 0
输出：索引 0 对应的节点（值为 1）</pre>
<pre>输入：head = [1], pos = -1
输出：null</pre>
<h4>提示</h4>
<ul>
  <li>链表中节点的数目范围在 <code>[0, 10^4]</code></li>
  <li><code>-10^5 &lt;= Node.val &lt;= 10^5</code></li>
  <li><code>pos</code> 为 <code>-1</code> 或者链表中的一个有效索引</li>
</ul>`,
    template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def detect_cycle(head):
    """
    :type head: ListNode
    :rtype: ListNode
    """
    # 在这里写你的代码
    pass
`,
    functionName: '_test_detect_cycle',
    setup: `
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def _test_detect_cycle(values, pos):
    nodes = [ListNode(value) for value in values]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if nodes and pos >= 0:
        nodes[-1].next = nodes[pos]
    original = [(node.val, node.next) for node in nodes]
    result = detect_cycle(nodes[0] if nodes else None)
    for node, (value, successor) in zip(nodes, original):
        if node.val != value or node.next is not successor:
            raise ValueError("不允许修改链表的节点值或 next 指针")
    if result is None:
        return None
    for index, node in enumerate(nodes):
        if result is node:
            return index
    raise ValueError("请返回原链表中的节点对象或 None，不要返回节点值、索引或新建节点")
`,
    testCases: [
      { input: [[3, 2, 0, -4], 1], expected: 1 },
      { input: [[1, 2], 0], expected: 0 },
      { input: [[1], -1], expected: null },
      { input: [[], -1], expected: null },
      { input: [[1], 0], expected: 0 },
      { input: [[1, 2, 3, 4], -1], expected: null },
      { input: [[7, 7, 7, 7], 2], expected: 2 },
      { input: [[1, 2, 3], 2], expected: 2 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/linked-list-cycle-ii/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766937',
  },
  {
    id: 2,
    title: 'LC 2 - 两数相加',
    difficulty: 'Medium',
    tags: ['链表'],
    description: `
<h3>2. 两数相加 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照<strong>逆序</strong>的方式存储的，并且每个节点只能存储一位数字。</p>
<p>请你将两个数相加，并以相同形式返回一个表示和的链表。</p>
<h4>示例</h4>
<pre>输入：l1 = [2,4,3], l2 = [5,6,4]
输出：[7,0,8]
解释：342 + 465 = 807</pre>
<pre>输入：l1 = [0], l2 = [0]
输出：[0]</pre>
<h4>提示</h4>
<ul>
  <li>每个链表中的节点数在范围 <code>[1, 100]</code> 内</li>
  <li><code>0 &lt;= Node.val &lt;= 9</code></li>
  <li>题目数据保证列表表示的数字不含前导零</li>
</ul>`,
    template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def add_two_numbers(l1, l2):
    """
    :type l1: ListNode
    :type l2: ListNode
    :rtype: ListNode
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'add_two_numbers',
    setup: (typeof LINKED_LIST_SETUP !== 'undefined') ? LINKED_LIST_SETUP : '',
    argWrappers: ['_to_linked_list', '_to_linked_list'],
    returnWrapper: '_to_array',
    testCases: [
      { input: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8] },
      { input: [[0], [0]], expected: [0] },
      { input: [[9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]], expected: [8, 9, 9, 9, 0, 0, 0, 1] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/add-two-numbers/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766938',
  },
]);

if (typeof window.syncPlaygroundProblems === 'function' && document.readyState !== 'loading') {
  window.syncPlaygroundProblems();
}
