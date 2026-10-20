// Huawei attachment / historical-list gaps. Typed Python signatures also supply
// the shared Java 17 and Go templates and core runners.
window.PLAYGROUND_EXTRA_PROBLEMS = (window.PLAYGROUND_EXTRA_PROBLEMS || []).concat([
  {
    id: 451,
    title: 'LC 451 - 根据字符出现频率排序',
    difficulty: 'Medium',
    tags: ['哈希表', '排序', '字符串'],
    description: `
<h3>451. 根据字符出现频率排序 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定字符串 <code>s</code>，按字符出现频率从高到低重新排列，返回重排后的字符串。频率指该字符在原字符串中的出现次数。</p>
<p>同一字符必须连续排列；同频字符之间可任意排列。大小写字符视为不同字符，存在多个合法答案时返回任意一个。</p>
<h4>示例 1</h4>
<pre>输入：s = "tree"
输出："eert"
解释："eetr" 也合法，e 出现两次，r 和 t 各一次。</pre>
<h4>示例 2</h4>
<pre>输入：s = "cccaaa"
输出："aaaccc"
解释："cccaaa" 也合法，但 "cacaca" 中同一字符没有连续排列。</pre>
<h4>示例 3</h4>
<pre>输入：s = "Aabb"
输出："bbAa"
解释："bbaA" 也合法，A 和 a 视为不同字符。</pre>
<h4>提示</h4>
<ul>
<li><code>1 &lt;= s.length &lt;= 5 * 10<sup>5</sup></code></li>
<li><code>s</code> 仅包含大小写英文字母和数字。</li>
<li>本地测试接受所有满足字符数量、连续分组和频率非升序要求的输出。</li>
</ul>`,
    template: `def frequency_sort(s):
    """
    :type s: str
    :rtype: str
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'frequency_sort',
    testCases: [
      { input: ['tree'], expected: 'eert' },
      { input: ['cccaaa'], expected: 'aaaccc' },
      { input: ['Aabb'], expected: 'bbAa' },
      { input: ['A1b1b11'], expected: '1111bbA' },
      { input: ['z'], expected: 'z' },
      { input: ['0000'], expected: '0000' },
      { input: ['abcd'], expected: 'abcd' },
    ],
    compareFunc: 'frequency_sort',
    solutionUrl: 'https://leetcode.cn/problems/sort-characters-by-frequency/solutions/',
    blogUrl: './05_interview/coding/huawei/#lc451-frequency-sort',
  },
  {
    id: 406,
    title: 'LC 406 - 根据身高重建队列',
    difficulty: 'Medium',
    tags: ['贪心', '排序', '数组'],
    description: `
<h3>406. 根据身高重建队列 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定顺序被打乱的人员数组 <code>people</code>，每项 <code>[h, k]</code> 表示一个身高为 <code>h</code> 的人，其前方恰好有 <code>k</code> 个身高<strong>大于或等于 h</strong>的人。</p>
<p>请重建并返回符合这些条件的队列。输出第一个元素表示队首，每个人必须保留且恰好出现一次。</p>
<h4>示例 1</h4>
<pre>输入：people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
输出：[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
解释：[5,2] 前面有 [5,0]、[7,0] 两人身高大于等于 5。</pre>
<h4>示例 2</h4>
<pre>输入：people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]
输出：[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]</pre>
<h4>提示</h4>
<ul>
<li><code>1 &lt;= people.length &lt;= 2000</code>，每项恰好有两个整数。</li>
<li><code>0 &lt;= h &lt;= 10<sup>6</sup></code></li>
<li><code>0 &lt;= k &lt; people.length</code></li>
<li>题目数据保证队列可以被重建。</li>
<li>本地测试核对原人员多重集及输出中每个人的队列约束。</li>
</ul>`,
    template: `def reconstruct_queue(people):
    """
    :type people: List[List[int]]
    :rtype: List[List[int]]
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'reconstruct_queue',
    testCases: [
      { input: [[[7, 0], [4, 4], [7, 1], [5, 0], [6, 1], [5, 2]]], expected: [[5, 0], [7, 0], [5, 2], [6, 1], [4, 4], [7, 1]] },
      { input: [[[6, 0], [5, 0], [4, 0], [3, 2], [2, 2], [1, 4]]], expected: [[4, 0], [5, 0], [2, 2], [3, 2], [1, 4], [6, 0]] },
      { input: [[[0, 0]]], expected: [[0, 0]] },
      { input: [[[5, 2], [5, 0], [5, 1]]], expected: [[5, 0], [5, 1], [5, 2]] },
      { input: [[[3, 0], [1, 0], [2, 0]]], expected: [[1, 0], [2, 0], [3, 0]] },
      { input: [[[1000000, 0], [0, 1], [1000000, 1]]], expected: [[1000000, 0], [0, 1], [1000000, 1]] },
    ],
    compareFunc: 'reconstruct_queue',
    solutionUrl: 'https://leetcode.cn/problems/queue-reconstruction-by-height/solutions/',
    blogUrl: './05_interview/coding/huawei/#lc406-reconstruct-queue',
  },
  {
    id: 179,
    title: 'LC 179 - 最大数',
    difficulty: 'Medium',
    tags: ['贪心', '排序', '字符串'],
    description: `
<h3>179. 最大数 <span class="difficulty-tag medium">Medium</span></h3>
<p>给定非负整数数组 <code>nums</code>，重新排列数组中的整数，使拼接后的数字最大，返回这个最大数字的<strong>字符串</strong>形式。</p>
<p>结果可能很大，不应转成整数。若所有元素都是零，返回 <code>"0"</code>。</p>
<h4>示例 1</h4>
<pre>输入：nums = [10,2]
输出："210"</pre>
<h4>示例 2</h4>
<pre>输入：nums = [3,30,34,5,9]
输出："9534330"</pre>
<h4>提示</h4>
<ul>
<li><code>1 &lt;= nums.length &lt;= 100</code></li>
<li><code>0 &lt;= nums[i] &lt;= 10<sup>9</sup></code></li>
<li>比较两个数字字符串的拼接结果，不能仅按整数大小排序。</li>
</ul>`,
    template: `def largest_number(nums):
    """
    :type nums: List[int]
    :rtype: str
    """
    # 在这里写你的代码
    pass
`,
    functionName: 'largest_number',
    testCases: [
      { input: [[10, 2]], expected: '210' },
      { input: [[3, 30, 34, 5, 9]], expected: '9534330' },
      { input: [[0, 0]], expected: '0' },
      { input: [[0]], expected: '0' },
      { input: [[121, 12]], expected: '12121' },
      { input: [[8308, 830]], expected: '8308830' },
      { input: [[1000000000, 1, 0]], expected: '110000000000' },
      { input: [[12, 1212]], expected: '121212' },
    ],
    compareFunc: 'equal',
    solutionUrl: 'https://leetcode.cn/problems/largest-number/solutions/',
    blogUrl: './05_interview/coding/huawei/#lc179-largest-number',
  },
]);

if (typeof window.syncPlaygroundProblems === 'function' && document.readyState !== 'loading') {
  window.syncPlaygroundProblems();
}
