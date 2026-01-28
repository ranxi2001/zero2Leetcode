/**
 * LeetCode Hot 100 题目数据
 * 每道题包含: 题号、标题、难度、分类、LeetCode链接
 */

const PROBLEMS_DATA = [
    // 哈希表
    { id: 1, title: "两数之和", difficulty: "easy", category: "hash", url: "https://leetcode.cn/problems/two-sum/" },
    { id: 49, title: "字母异位词分组", difficulty: "medium", category: "hash", url: "https://leetcode.cn/problems/group-anagrams/" },
    { id: 128, title: "最长连续序列", difficulty: "medium", category: "hash", url: "https://leetcode.cn/problems/longest-consecutive-sequence/" },
    
    // 双指针
    { id: 283, title: "移动零", difficulty: "easy", category: "two-pointers", url: "https://leetcode.cn/problems/move-zeroes/" },
    { id: 11, title: "盛最多水的容器", difficulty: "medium", category: "two-pointers", url: "https://leetcode.cn/problems/container-with-most-water/" },
    { id: 15, title: "三数之和", difficulty: "medium", category: "two-pointers", url: "https://leetcode.cn/problems/3sum/" },
    { id: 42, title: "接雨水", difficulty: "hard", category: "two-pointers", url: "https://leetcode.cn/problems/trapping-rain-water/" },
    
    // 滑动窗口
    { id: 3, title: "无重复字符的最长子串", difficulty: "medium", category: "sliding-window", url: "https://leetcode.cn/problems/longest-substring-without-repeating-characters/" },
    { id: 438, title: "找到字符串中所有字母异位词", difficulty: "medium", category: "sliding-window", url: "https://leetcode.cn/problems/find-all-anagrams-in-a-string/" },
    { id: 76, title: "最小覆盖子串", difficulty: "hard", category: "sliding-window", url: "https://leetcode.cn/problems/minimum-window-substring/" },
    
    // 子串/子数组
    { id: 560, title: "和为 K 的子数组", difficulty: "medium", category: "subarray", url: "https://leetcode.cn/problems/subarray-sum-equals-k/" },
    { id: 239, title: "滑动窗口最大值", difficulty: "hard", category: "subarray", url: "https://leetcode.cn/problems/sliding-window-maximum/" },
    { id: 53, title: "最大子数组和", difficulty: "medium", category: "subarray", url: "https://leetcode.cn/problems/maximum-subarray/" },
    { id: 56, title: "合并区间", difficulty: "medium", category: "subarray", url: "https://leetcode.cn/problems/merge-intervals/" },
    
    // 栈
    { id: 20, title: "有效的括号", difficulty: "easy", category: "stack", url: "https://leetcode.cn/problems/valid-parentheses/" },
    { id: 155, title: "最小栈", difficulty: "medium", category: "stack", url: "https://leetcode.cn/problems/min-stack/" },
    { id: 394, title: "字符串解码", difficulty: "medium", category: "stack", url: "https://leetcode.cn/problems/decode-string/" },
    { id: 739, title: "每日温度", difficulty: "medium", category: "stack", url: "https://leetcode.cn/problems/daily-temperatures/" },
    { id: 84, title: "柱状图中最大的矩形", difficulty: "hard", category: "stack", url: "https://leetcode.cn/problems/largest-rectangle-in-histogram/" },
    
    // 链表
    { id: 160, title: "相交链表", difficulty: "easy", category: "linked-list", url: "https://leetcode.cn/problems/intersection-of-two-linked-lists/" },
    { id: 206, title: "反转链表", difficulty: "easy", category: "linked-list", url: "https://leetcode.cn/problems/reverse-linked-list/" },
    { id: 234, title: "回文链表", difficulty: "easy", category: "linked-list", url: "https://leetcode.cn/problems/palindrome-linked-list/" },
    { id: 141, title: "环形链表", difficulty: "easy", category: "linked-list", url: "https://leetcode.cn/problems/linked-list-cycle/" },
    { id: 142, title: "环形链表 II", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/linked-list-cycle-ii/" },
    { id: 21, title: "合并两个有序链表", difficulty: "easy", category: "linked-list", url: "https://leetcode.cn/problems/merge-two-sorted-lists/" },
    { id: 2, title: "两数相加", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/add-two-numbers/" },
    { id: 19, title: "删除链表的倒数第 N 个结点", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/remove-nth-node-from-end-of-list/" },
    { id: 24, title: "两两交换链表中的节点", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/swap-nodes-in-pairs/" },
    { id: 25, title: "K 个一组翻转链表", difficulty: "hard", category: "linked-list", url: "https://leetcode.cn/problems/reverse-nodes-in-k-group/" },
    { id: 138, title: "随机链表的复制", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/copy-list-with-random-pointer/" },
    { id: 148, title: "排序链表", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/sort-list/" },
    { id: 23, title: "合并 K 个升序链表", difficulty: "hard", category: "linked-list", url: "https://leetcode.cn/problems/merge-k-sorted-lists/" },
    { id: 146, title: "LRU 缓存", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/lru-cache/" },
    
    // 二叉树
    { id: 94, title: "二叉树的中序遍历", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/binary-tree-inorder-traversal/" },
    { id: 104, title: "二叉树的最大深度", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/maximum-depth-of-binary-tree/" },
    { id: 226, title: "翻转二叉树", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/invert-binary-tree/" },
    { id: 101, title: "对称二叉树", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/symmetric-tree/" },
    { id: 543, title: "二叉树的直径", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/diameter-of-binary-tree/" },
    { id: 102, title: "二叉树的层序遍历", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/binary-tree-level-order-traversal/" },
    { id: 108, title: "将有序数组转换为二叉搜索树", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/" },
    { id: 98, title: "验证二叉搜索树", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/validate-binary-search-tree/" },
    { id: 230, title: "二叉搜索树中第K小的元素", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/kth-smallest-element-in-a-bst/" },
    { id: 199, title: "二叉树的右视图", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/binary-tree-right-side-view/" },
    { id: 114, title: "二叉树展开为链表", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/" },
    { id: 105, title: "从前序与中序遍历序列构造二叉树", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
    { id: 437, title: "路径总和 III", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/path-sum-iii/" },
    { id: 236, title: "二叉树的最近公共祖先", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/" },
    { id: 124, title: "二叉树中的最大路径和", difficulty: "hard", category: "tree", url: "https://leetcode.cn/problems/binary-tree-maximum-path-sum/" },
    
    // 图论
    { id: 200, title: "岛屿数量", difficulty: "medium", category: "graph", url: "https://leetcode.cn/problems/number-of-islands/" },
    { id: 994, title: "腐烂的橘子", difficulty: "medium", category: "graph", url: "https://leetcode.cn/problems/rotting-oranges/" },
    { id: 207, title: "课程表", difficulty: "medium", category: "graph", url: "https://leetcode.cn/problems/course-schedule/" },
    { id: 208, title: "实现 Trie (前缀树)", difficulty: "medium", category: "graph", url: "https://leetcode.cn/problems/implement-trie-prefix-tree/" },
    
    // 回溯
    { id: 46, title: "全排列", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/permutations/" },
    { id: 78, title: "子集", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/subsets/" },
    { id: 17, title: "电话号码的字母组合", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/letter-combinations-of-a-phone-number/" },
    { id: 39, title: "组合总和", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/combination-sum/" },
    { id: 22, title: "括号生成", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/generate-parentheses/" },
    { id: 79, title: "单词搜索", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/word-search/" },
    { id: 131, title: "分割回文串", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/palindrome-partitioning/" },
    { id: 51, title: "N 皇后", difficulty: "hard", category: "backtrack", url: "https://leetcode.cn/problems/n-queens/" },
    
    // 二分查找
    { id: 35, title: "搜索插入位置", difficulty: "easy", category: "binary-search", url: "https://leetcode.cn/problems/search-insert-position/" },
    { id: 74, title: "搜索二维矩阵", difficulty: "medium", category: "binary-search", url: "https://leetcode.cn/problems/search-a-2d-matrix/" },
    { id: 34, title: "在排序数组中查找元素的第一个和最后一个位置", difficulty: "medium", category: "binary-search", url: "https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/" },
    { id: 33, title: "搜索旋转排序数组", difficulty: "medium", category: "binary-search", url: "https://leetcode.cn/problems/search-in-rotated-sorted-array/" },
    { id: 153, title: "寻找旋转排序数组中的最小值", difficulty: "medium", category: "binary-search", url: "https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/" },
    { id: 4, title: "寻找两个正序数组的中位数", difficulty: "hard", category: "binary-search", url: "https://leetcode.cn/problems/median-of-two-sorted-arrays/" },
    
    // 动态规划
    { id: 70, title: "爬楼梯", difficulty: "easy", category: "dp", url: "https://leetcode.cn/problems/climbing-stairs/" },
    { id: 118, title: "杨辉三角", difficulty: "easy", category: "dp", url: "https://leetcode.cn/problems/pascals-triangle/" },
    { id: 198, title: "打家劫舍", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/house-robber/" },
    { id: 279, title: "完全平方数", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/perfect-squares/" },
    { id: 322, title: "零钱兑换", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/coin-change/" },
    { id: 139, title: "单词拆分", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/word-break/" },
    { id: 300, title: "最长递增子序列", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/longest-increasing-subsequence/" },
    { id: 152, title: "乘积最大子数组", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/maximum-product-subarray/" },
    { id: 416, title: "分割等和子集", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/partition-equal-subset-sum/" },
    { id: 32, title: "最长有效括号", difficulty: "hard", category: "dp", url: "https://leetcode.cn/problems/longest-valid-parentheses/" },
    { id: 62, title: "不同路径", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/unique-paths/" },
    { id: 64, title: "最小路径和", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/minimum-path-sum/" },
    { id: 5, title: "最长回文子串", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/longest-palindromic-substring/" },
    { id: 1143, title: "最长公共子序列", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/longest-common-subsequence/" },
    { id: 72, title: "编辑距离", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/edit-distance/" },
    
    // 贪心
    { id: 121, title: "买卖股票的最佳时机", difficulty: "easy", category: "greedy", url: "https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/" },
    { id: 55, title: "跳跃游戏", difficulty: "medium", category: "greedy", url: "https://leetcode.cn/problems/jump-game/" },
    { id: 45, title: "跳跃游戏 II", difficulty: "medium", category: "greedy", url: "https://leetcode.cn/problems/jump-game-ii/" },
    { id: 763, title: "划分字母区间", difficulty: "medium", category: "greedy", url: "https://leetcode.cn/problems/partition-labels/" },
    
    // 堆
    { id: 215, title: "数组中的第K个最大元素", difficulty: "medium", category: "heap", url: "https://leetcode.cn/problems/kth-largest-element-in-an-array/" },
    { id: 347, title: "前 K 个高频元素", difficulty: "medium", category: "heap", url: "https://leetcode.cn/problems/top-k-frequent-elements/" },
    { id: 295, title: "数据流的中位数", difficulty: "hard", category: "heap", url: "https://leetcode.cn/problems/find-median-from-data-stream/" },
    
    // 矩阵
    { id: 73, title: "矩阵置零", difficulty: "medium", category: "matrix", url: "https://leetcode.cn/problems/set-matrix-zeroes/" },
    { id: 54, title: "螺旋矩阵", difficulty: "medium", category: "matrix", url: "https://leetcode.cn/problems/spiral-matrix/" },
    { id: 48, title: "旋转图像", difficulty: "medium", category: "matrix", url: "https://leetcode.cn/problems/rotate-image/" },
    { id: 240, title: "搜索二维矩阵 II", difficulty: "medium", category: "matrix", url: "https://leetcode.cn/problems/search-a-2d-matrix-ii/" },
    
    // 其他技巧
    { id: 136, title: "只出现一次的数字", difficulty: "easy", category: "other", url: "https://leetcode.cn/problems/single-number/" },
    { id: 169, title: "多数元素", difficulty: "easy", category: "other", url: "https://leetcode.cn/problems/majority-element/" },
    { id: 75, title: "颜色分类", difficulty: "medium", category: "other", url: "https://leetcode.cn/problems/sort-colors/" },
    { id: 31, title: "下一个排列", difficulty: "medium", category: "other", url: "https://leetcode.cn/problems/next-permutation/" },
    { id: 287, title: "寻找重复数", difficulty: "medium", category: "other", url: "https://leetcode.cn/problems/find-the-duplicate-number/" },
    { id: 41, title: "缺失的第一个正数", difficulty: "hard", category: "other", url: "https://leetcode.cn/problems/first-missing-positive/" },
];

// 分类映射中英文名
const CATEGORY_NAMES = {
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
    "other": "技巧"
};

// 难度映射
const DIFFICULTY_NAMES = {
    "easy": "简单",
    "medium": "中等",
    "hard": "困难"
};

// 导出供 app.js 使用
if (typeof window !== 'undefined') {
    window.PROBLEMS_DATA = PROBLEMS_DATA;
    window.CATEGORY_NAMES = CATEGORY_NAMES;
    window.DIFFICULTY_NAMES = DIFFICULTY_NAMES;
}
