window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  {
    id: 19,
    title: 'LC 19 - 删除链表的倒数第 N 个结点',
    difficulty: 'Medium',
    tags: ['链表', '双指针'],
    description: `
<h3>19. 删除链表的倒数第 N 个结点 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个链表，删除链表的倒数第 <code>n</code> 个结点，并返回链表头结点。</p>
<p>本地练习已内置 <code>ListNode</code>，输入会自动转换成链表，返回值也会自动转回数组。</p>
<h4>示例</h4>
<pre>输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]</pre>
<pre>输入：head = [1], n = 1
输出：[]</pre>`,
    template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def remove_nth_from_end(head, n):
    """
    :type head: ListNode
    :type n: int
    :rtype: ListNode
    """
    pass
`,
    functionName: 'remove_nth_from_end',
    setup: LINKED_LIST_SETUP,
    argWrappers: ['_to_linked_list'],
    returnWrapper: '_to_array',
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5] },
      { input: [[1], 1], expected: [] },
      { input: [[1, 2], 1], expected: [1] },
      { input: [[1, 2], 2], expected: [2] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/remove-nth-node-from-end-of-list/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766939',
  },
  {
    id: 24,
    title: 'LC 24 - 两两交换链表中的节点',
    difficulty: 'Medium',
    tags: ['链表'],
    description: `
<h3>24. 两两交换链表中的节点 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个链表，两两交换其中相邻的节点，并返回交换后的链表。</p>
<p>不能只修改节点值，必须真正调整节点指针。</p>
<h4>示例</h4>
<pre>输入：head = [1,2,3,4]
输出：[2,1,4,3]</pre>
<pre>输入：head = [1]
输出：[1]</pre>`,
    template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def swap_pairs(head):
    """
    :type head: ListNode
    :rtype: ListNode
    """
    pass
`,
    functionName: 'swap_pairs',
    setup: LINKED_LIST_SETUP,
    argWrappers: ['_to_linked_list'],
    returnWrapper: '_to_array',
    testCases: [
      { input: [[1, 2, 3, 4]], expected: [2, 1, 4, 3] },
      { input: [[]], expected: [] },
      { input: [[1]], expected: [1] },
      { input: [[1, 2, 3]], expected: [2, 1, 3] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/swap-nodes-in-pairs/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766940',
  },
  {
    id: 25,
    title: 'LC 25 - K 个一组翻转链表',
    difficulty: 'Hard',
    tags: ['链表'],
    description: `
<h3>25. K 个一组翻转链表 <span class="difficulty-tag hard">Hard</span></h3>
<p>给你链表头结点 <code>head</code> 和整数 <code>k</code>，每 <code>k</code> 个节点一组进行翻转，返回修改后的链表。</p>
<p>如果节点总数不是 <code>k</code> 的整数倍，最后剩余节点保持原有顺序。</p>
<h4>示例</h4>
<pre>输入：head = [1,2,3,4,5], k = 2
输出：[2,1,4,3,5]</pre>
<pre>输入：head = [1,2,3,4,5], k = 3
输出：[3,2,1,4,5]</pre>`,
    template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def reverse_k_group(head, k):
    """
    :type head: ListNode
    :type k: int
    :rtype: ListNode
    """
    pass
`,
    functionName: 'reverse_k_group',
    setup: LINKED_LIST_SETUP,
    argWrappers: ['_to_linked_list'],
    returnWrapper: '_to_array',
    testCases: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [2, 1, 4, 3, 5] },
      { input: [[1, 2, 3, 4, 5], 3], expected: [3, 2, 1, 4, 5] },
      { input: [[1, 2], 2], expected: [2, 1] },
      { input: [[1, 2], 3], expected: [1, 2] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/reverse-nodes-in-k-group/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772921.html',
  },
  {
    id: 138,
    title: 'LC 138 - 随机链表的复制',
    difficulty: 'Medium',
    tags: ['链表', '哈希表'],
    description: `
<h3>138. 随机链表的复制 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个由 <code>next</code> 和 <code>random</code> 指针组成的链表，请你返回这个链表的深拷贝。</p>
<p>当前页面暂未接入该题的本地测试，但保留了模板与跳转入口。</p>
<h4>示例</h4>
<pre>输入：head = [[7,null],[13,0],[11,4],[10,2],[1,0]]
输出：[[7,null],[13,0],[11,4],[10,2],[1,0]]</pre>`,
    template: `# Definition for a Node.
# class Node:
#     def __init__(self, x, next=None, random=None):
#         self.val = int(x)
#         self.next = next
#         self.random = random

def copy_random_list(head):
    """
    :type head: Node
    :rtype: Node
    """
    pass
`,
    functionName: 'copy_random_list',
    testCases: [],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/copy-list-with-random-pointer/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766941',
  },
  {
    id: 148,
    title: 'LC 148 - 排序链表',
    difficulty: 'Medium',
    tags: ['链表', '排序'],
    description: `
<h3>148. 排序链表 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你链表的头结点 <code>head</code>，请将其按升序排列并返回排序后的链表。</p>
<p>本地练习会自动把数组输入转为链表，并把返回结果转回数组。</p>
<h4>示例</h4>
<pre>输入：head = [4,2,1,3]
输出：[1,2,3,4]</pre>
<pre>输入：head = [-1,5,3,4,0]
输出：[-1,0,3,4,5]</pre>`,
    template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def sort_list(head):
    """
    :type head: ListNode
    :rtype: ListNode
    """
    pass
`,
    functionName: 'sort_list',
    setup: LINKED_LIST_SETUP,
    argWrappers: ['_to_linked_list'],
    returnWrapper: '_to_array',
    testCases: [
      { input: [[4, 2, 1, 3]], expected: [1, 2, 3, 4] },
      { input: [[-1, 5, 3, 4, 0]], expected: [-1, 0, 3, 4, 5] },
      { input: [[]], expected: [] },
      { input: [[1]], expected: [1] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/sort-list/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19766942',
  },
  {
    id: 23,
    title: 'LC 23 - 合并 K 个升序链表',
    difficulty: 'Hard',
    tags: ['链表', '堆'],
    description: `
<h3>23. 合并 K 个升序链表 <span class="difficulty-tag hard">Hard</span></h3>
<p>给你一个链表数组，每个链表都已经按升序排列，请将所有链表合并到一个升序链表中。</p>
<p>本地练习输入为二维数组，系统会自动转成链表数组。</p>
<h4>示例 1</h4>
<pre>输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]</pre>
<h4>示例 2</h4>
<pre>输入：lists = []
输出：[]</pre>
<h4>示例 3</h4>
<pre>输入：lists = [[]]
输出：[]</pre>`,
    template: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def merge_k_lists(lists):
    """
    :type lists: List[ListNode]
    :rtype: ListNode
    """
    pass
`,
    functionName: 'merge_k_lists',
    setup: LINKED_LIST_SETUP + `
def _to_linked_lists(arrs):
    return [_to_linked_list(arr) for arr in arrs]
`,
    argWrappers: ['_to_linked_lists'],
    returnWrapper: '_to_array',
    testCases: [
      { input: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { input: [[]], expected: [] },
      { input: [[[]]], expected: [] },
      { input: [[[], [1]]], expected: [1] },
      { input: [[[2], [], [-1, 3]]], expected: [-1, 2, 3] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/merge-k-sorted-lists/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772922.html',
  },
  {
    id: 146,
    title: 'LC 146 - LRU 缓存',
    difficulty: 'Medium',
    tags: ['链表', '哈希表'],
    description: `
<h3>146. LRU 缓存 <span class="difficulty-tag medium">Medium</span></h3>
<p>请你设计并实现一个满足 LRU 规则的数据结构，支持 <code>get</code> 和 <code>put</code>，并都要在平均 <code>O(1)</code> 时间完成。</p>
<p>当前页面暂未接入这类设计题的本地测试，但保留模板与跳转入口。</p>
<h4>示例</h4>
<pre>LRUCache cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);       // 返回 1
cache.put(3, 3);    // 淘汰 key 2
cache.get(2);       // 返回 -1（未找到）</pre>`,
    template: `class LRUCache:
    def __init__(self, capacity):
        """
        :type capacity: int
        """
        pass

    def get(self, key):
        """
        :type key: int
        :rtype: int
        """
        pass

    def put(self, key, value):
        """
        :type key: int
        :type value: int
        :rtype: None
        """
        pass
`,
    functionName: 'LRUCache',
    testCases: [],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/lru-cache/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19769206',
  },
  {
    id: 98,
    title: 'LC 98 - 验证二叉搜索树',
    difficulty: 'Medium',
    tags: ['二叉树', '二叉搜索树'],
    description: `
<h3>98. 验证二叉搜索树 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你一个二叉树的根节点 <code>root</code>，判断其是否为有效的二叉搜索树。</p>
<p>输入按层序数组给出，<code>null</code> 表示空节点。</p>
<h4>示例</h4>
<pre>输入：root = [2,1,3]
输出：true</pre>
<pre>输入：root = [5,1,4,null,null,3,6]
输出：false</pre>`,
    template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def is_valid_bst(root):
    """
    :type root: TreeNode
    :rtype: bool
    """
    pass
`,
    functionName: 'is_valid_bst',
    setup: BINARY_TREE_SETUP,
    argWrappers: ['_to_tree'],
    testCases: [
      { input: [[2, 1, 3]], expected: true },
      { input: [[5, 1, 4, null, null, 3, 6]], expected: false },
      { input: [[2, 2, 2]], expected: false },
      { input: [[1]], expected: true },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/validate-binary-search-tree/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772924.html',
  },
  {
    id: 230,
    title: 'LC 230 - 二叉搜索树中第 K 小的元素',
    difficulty: 'Medium',
    tags: ['二叉树', '二叉搜索树'],
    description: `
<h3>230. 二叉搜索树中第 K 小的元素 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个二叉搜索树的根节点 <code>root</code> 和一个整数 <code>k</code>，返回其中第 <code>k</code> 小的元素值。</p>
<h4>示例</h4>
<pre>输入：root = [3,1,4,null,2], k = 1
输出：1</pre>
<pre>输入：root = [5,3,6,2,4,null,null,1], k = 3
输出：3</pre>`,
    template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def kth_smallest(root, k):
    """
    :type root: TreeNode
    :type k: int
    :rtype: int
    """
    pass
`,
    functionName: 'kth_smallest',
    setup: BINARY_TREE_SETUP,
    argWrappers: ['_to_tree'],
    testCases: [
      { input: [[3, 1, 4, null, 2], 1], expected: 1 },
      { input: [[5, 3, 6, 2, 4, null, null, 1], 3], expected: 3 },
      { input: [[1], 1], expected: 1 },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/kth-smallest-element-in-a-bst/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772925.html',
  },
  {
    id: 199,
    title: 'LC 199 - 二叉树的右视图',
    difficulty: 'Medium',
    tags: ['二叉树'],
    description: `
<h3>199. 二叉树的右视图 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一个二叉树的根节点 <code>root</code>，返回从右侧看到的节点值。</p>
<h4>示例</h4>
<pre>输入：root = [1,2,3,null,5,null,4]
输出：[1,3,4]</pre>
<pre>输入：root = [1,null,3]
输出：[1,3]</pre>`,
    template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def right_side_view(root):
    """
    :type root: TreeNode
    :rtype: List[int]
    """
    pass
`,
    functionName: 'right_side_view',
    setup: BINARY_TREE_SETUP,
    argWrappers: ['_to_tree'],
    testCases: [
      { input: [[1, 2, 3, null, 5, null, 4]], expected: [1, 3, 4] },
      { input: [[1, null, 3]], expected: [1, 3] },
      { input: [[]], expected: [] },
      { input: [[1, 2]], expected: [1, 2] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/binary-tree-right-side-view/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772926.html',
  },
  {
    id: 114,
    title: 'LC 114 - 二叉树展开为链表',
    difficulty: 'Medium',
    tags: ['二叉树'],
    description: `
<h3>114. 二叉树展开为链表 <span class="difficulty-tag medium">Medium</span></h3>
<p>给你二叉树的根节点 <code>root</code>，请你将它展开为一个单链表，展开后的顺序应与先序遍历一致。</p>
<p>本地练习会校验右指针链的节点顺序，并检查所有左指针都被清空。</p>
<h4>示例</h4>
<pre>输入：root = [1,2,5,3,4,null,6]
输出：[1,null,2,null,3,null,4,null,5,null,6]</pre>`,
    template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def flatten(root):
    """
    :type root: TreeNode
    :rtype: None
    """
    pass
`,
    functionName: '_test_flatten',
    setup: BINARY_TREE_SETUP + `
def _flatten_to_array(root):
    result = []
    node = root
    while node:
        if node.left is not None:
            return "ERROR: left child should be None"
        result.append(node.val)
        node = node.right
    return result

def _test_flatten(root):
    flatten(root)
    return _flatten_to_array(root)
`,
    argWrappers: ['_to_tree'],
    testCases: [
      { input: [[1, 2, 5, 3, 4, null, 6]], expected: [1, 2, 3, 4, 5, 6] },
      { input: [[]], expected: [] },
      { input: [[0]], expected: [0] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772927.html',
  },
  {
    id: 105,
    title: 'LC 105 - 从前序与中序遍历序列构造二叉树',
    difficulty: 'Medium',
    tags: ['二叉树'],
    description: `
<h3>105. 从前序与中序遍历序列构造二叉树 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定一棵树的前序遍历 <code>preorder</code> 和中序遍历 <code>inorder</code>，请构造并返回这棵二叉树。</p>
<p>本地练习会将你返回的树转回层序数组进行校验。</p>
<h4>示例</h4>
<pre>输入：preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
输出：[3,9,20,null,null,15,7]</pre>`,
    template: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

def build_tree(preorder, inorder):
    """
    :type preorder: List[int]
    :type inorder: List[int]
    :rtype: TreeNode
    """
    pass
`,
    functionName: 'build_tree',
    setup: BINARY_TREE_SETUP,
    returnWrapper: '_tree_to_array',
    testCases: [
      { input: [[3, 9, 20, 15, 7], [9, 3, 15, 20, 7]], expected: [3, 9, 20, null, null, 15, 7] },
      { input: [[-1], [-1]], expected: [-1] },
      { input: [[1, 2, 4, 5, 3], [4, 2, 5, 1, 3]], expected: [1, 2, 3, 4, 5] },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/solutions/',
    blogUrl: 'https://www.cnblogs.com/ranxi169/p/19772928.html',
  },
]);

if (typeof window.syncPlaygroundProblems === 'function' && document.readyState !== 'loading') {
  window.syncPlaygroundProblems();
}
