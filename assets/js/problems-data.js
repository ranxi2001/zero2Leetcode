/**
 * LeetCode Hot 100 题目数据
 * 每道题包含: 题号、标题、难度、分类、LeetCode链接
 */

const PROBLEMS_DATA = [
    // 哈希表
    { id: 1, title: "两数之和", difficulty: "easy", category: "hash", url: "https://leetcode.cn/problems/two-sum/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19718436" },
    { id: 49, title: "字母异位词分组", difficulty: "medium", category: "hash", url: "https://leetcode.cn/problems/group-anagrams/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766917" },
    { id: 128, title: "最长连续序列", difficulty: "medium", category: "hash", url: "https://leetcode.cn/problems/longest-consecutive-sequence/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766918" },
    { id: 451, title: "根据字符出现频率排序", difficulty: "medium", category: "hash", url: "https://leetcode.cn/problems/sort-characters-by-frequency/", blogUrl: "./05_interview/coding/huawei/#lc451-frequency-sort" },

    // 双指针
    { id: 283, title: "移动零", difficulty: "easy", category: "two-pointers", url: "https://leetcode.cn/problems/move-zeroes/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19736398" },
    { id: 11, title: "盛最多水的容器", difficulty: "medium", category: "two-pointers", url: "https://leetcode.cn/problems/container-with-most-water/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766919" },
    { id: 15, title: "三数之和", difficulty: "medium", category: "two-pointers", url: "https://leetcode.cn/problems/3sum/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766921" },
    { id: 88, title: "合并两个有序数组", difficulty: "easy", category: "two-pointers", url: "https://leetcode.cn/problems/merge-sorted-array/" },
    { id: 42, title: "接雨水", difficulty: "hard", category: "two-pointers", url: "https://leetcode.cn/problems/trapping-rain-water/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772917.html" },

    // 滑动窗口
    { id: 3, title: "无重复字符的最长子串", difficulty: "medium", category: "sliding-window", url: "https://leetcode.cn/problems/longest-substring-without-repeating-characters/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766922" },
    { id: 209, title: "长度最小的子数组", difficulty: "medium", category: "sliding-window", url: "https://leetcode.cn/problems/minimum-size-subarray-sum/" },
    { id: 438, title: "找到字符串中所有字母异位词", difficulty: "medium", category: "sliding-window", url: "https://leetcode.cn/problems/find-all-anagrams-in-a-string/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766923" },
    { id: 76, title: "最小覆盖子串", difficulty: "hard", category: "sliding-window", url: "https://leetcode.cn/problems/minimum-window-substring/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772918.html" },

    // 子串/子数组
    { id: 560, title: "和为 K 的子数组", difficulty: "medium", category: "subarray", url: "https://leetcode.cn/problems/subarray-sum-equals-k/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766928" },
    { id: 239, title: "滑动窗口最大值", difficulty: "hard", category: "subarray", url: "https://leetcode.cn/problems/sliding-window-maximum/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772919.html" },
    { id: 53, title: "最大子数组和", difficulty: "medium", category: "subarray", url: "https://leetcode.cn/problems/maximum-subarray/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766929" },
    { id: 56, title: "合并区间", difficulty: "medium", category: "subarray", url: "https://leetcode.cn/problems/merge-intervals/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766930" },

    // 栈
    { id: 20, title: "有效的括号", difficulty: "easy", category: "stack", url: "https://leetcode.cn/problems/valid-parentheses/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19722592" },
    { id: 232, title: "用栈实现队列", difficulty: "easy", category: "stack", url: "https://leetcode.cn/problems/implement-queue-using-stacks/" },
    { id: 155, title: "最小栈", difficulty: "medium", category: "stack", url: "https://leetcode.cn/problems/min-stack/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766931" },
    { id: 394, title: "字符串解码", difficulty: "medium", category: "stack", url: "https://leetcode.cn/problems/decode-string/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766933" },
    { id: 739, title: "每日温度", difficulty: "medium", category: "stack", url: "https://leetcode.cn/problems/daily-temperatures/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766932" },
    { id: 84, title: "柱状图中最大的矩形", difficulty: "hard", category: "stack", url: "https://leetcode.cn/problems/largest-rectangle-in-histogram/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772920.html" },

    // 链表
    { id: 160, title: "相交链表", difficulty: "easy", category: "linked-list", url: "https://leetcode.cn/problems/intersection-of-two-linked-lists/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19754972" },
    { id: 206, title: "反转链表", difficulty: "easy", category: "linked-list", url: "https://leetcode.cn/problems/reverse-linked-list/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19722217" },
    { id: 234, title: "回文链表", difficulty: "easy", category: "linked-list", url: "https://leetcode.cn/problems/palindrome-linked-list/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19741527" },
    { id: 141, title: "环形链表", difficulty: "easy", category: "linked-list", url: "https://leetcode.cn/problems/linked-list-cycle/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19755041" },
    { id: 142, title: "环形链表 II", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/linked-list-cycle-ii/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766937" },
    { id: 21, title: "合并两个有序链表", difficulty: "easy", category: "linked-list", url: "https://leetcode.cn/problems/merge-two-sorted-lists/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19741176" },
    { id: 2, title: "两数相加", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/add-two-numbers/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766938" },
    { id: 19, title: "删除链表的倒数第 N 个结点", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/remove-nth-node-from-end-of-list/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766939" },
    { id: 24, title: "两两交换链表中的节点", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/swap-nodes-in-pairs/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766940" },
    { id: 25, title: "K 个一组翻转链表", difficulty: "hard", category: "linked-list", url: "https://leetcode.cn/problems/reverse-nodes-in-k-group/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772921.html" },
    { id: 92, title: "反转链表 II", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/reverse-linked-list-ii/" },
    { id: 138, title: "随机链表的复制", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/copy-list-with-random-pointer/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766941" },
    { id: 148, title: "排序链表", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/sort-list/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766942" },
    { id: 23, title: "合并 K 个升序链表", difficulty: "hard", category: "linked-list", url: "https://leetcode.cn/problems/merge-k-sorted-lists/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772922.html" },
    { id: 146, title: "LRU 缓存", difficulty: "medium", category: "linked-list", url: "https://leetcode.cn/problems/lru-cache/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19769206" },

    // 二叉树
    { id: 94, title: "二叉树的中序遍历", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/binary-tree-inorder-traversal/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19741295" },
    { id: 104, title: "二叉树的最大深度", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/maximum-depth-of-binary-tree/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19741351" },
    { id: 226, title: "翻转二叉树", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/invert-binary-tree/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766910" },
    { id: 101, title: "对称二叉树", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/symmetric-tree/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766911" },
    { id: 543, title: "二叉树的直径", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/diameter-of-binary-tree/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766912" },
    { id: 102, title: "二叉树的层序遍历", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/binary-tree-level-order-traversal/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772923.html" },
    { id: 103, title: "二叉树的锯齿形层序遍历", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/binary-tree-zigzag-level-order-traversal/" },
    { id: 108, title: "将有序数组转换为二叉搜索树", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19766901" },
    { id: 98, title: "验证二叉搜索树", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/validate-binary-search-tree/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772924.html" },
    { id: 230, title: "二叉搜索树中第K小的元素", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/kth-smallest-element-in-a-bst/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772925.html" },
    { id: 199, title: "二叉树的右视图", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/binary-tree-right-side-view/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772926.html" },
    { id: 114, title: "二叉树展开为链表", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772927.html" },
    { id: 105, title: "从前序与中序遍历序列构造二叉树", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772928.html" },
    { id: 437, title: "路径总和 III", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/path-sum-iii/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772929.html" },
    { id: 236, title: "二叉树的最近公共祖先", difficulty: "medium", category: "tree", url: "https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772930.html" },
    { id: 572, title: "另一棵树的子树", difficulty: "easy", category: "tree", url: "https://leetcode.cn/problems/subtree-of-another-tree/" },
    { id: 124, title: "二叉树中的最大路径和", difficulty: "hard", category: "tree", url: "https://leetcode.cn/problems/binary-tree-maximum-path-sum/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772931.html" },

    // 图论
    { id: 200, title: "岛屿数量", difficulty: "medium", category: "graph", url: "https://leetcode.cn/problems/number-of-islands/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772932.html" },
    { id: 695, title: "岛屿的最大面积", difficulty: "medium", category: "graph", url: "https://leetcode.cn/problems/max-area-of-island/" },
    { id: 994, title: "腐烂的橘子", difficulty: "medium", category: "graph", url: "https://leetcode.cn/problems/rotting-oranges/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772933.html" },
    { id: 207, title: "课程表", difficulty: "medium", category: "graph", url: "https://leetcode.cn/problems/course-schedule/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772934.html" },
    { id: 208, title: "实现 Trie (前缀树)", difficulty: "medium", category: "graph", url: "https://leetcode.cn/problems/implement-trie-prefix-tree/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772935.html" },

    // 回溯
    { id: 46, title: "全排列", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/permutations/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772936.html" },
    { id: 78, title: "子集", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/subsets/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772937.html" },
    { id: 17, title: "电话号码的字母组合", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/letter-combinations-of-a-phone-number/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772973.html" },
    { id: 39, title: "组合总和", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/combination-sum/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772974.html" },
    { id: 22, title: "括号生成", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/generate-parentheses/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772975.html" },
    { id: 79, title: "单词搜索", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/word-search/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772976.html" },
    { id: 131, title: "分割回文串", difficulty: "medium", category: "backtrack", url: "https://leetcode.cn/problems/palindrome-partitioning/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772977.html" },
    { id: 51, title: "N 皇后", difficulty: "hard", category: "backtrack", url: "https://leetcode.cn/problems/n-queens/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772978.html" },

    // 二分查找
    { id: 35, title: "搜索插入位置", difficulty: "easy", category: "binary-search", url: "https://leetcode.cn/problems/search-insert-position/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19740616" },
    { id: 74, title: "搜索二维矩阵", difficulty: "medium", category: "binary-search", url: "https://leetcode.cn/problems/search-a-2d-matrix/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772979.html" },
    { id: 34, title: "在排序数组中查找元素的第一个和最后一个位置", difficulty: "medium", category: "binary-search", url: "https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772980.html" },
    { id: 33, title: "搜索旋转排序数组", difficulty: "medium", category: "binary-search", url: "https://leetcode.cn/problems/search-in-rotated-sorted-array/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772981.html" },
    { id: 153, title: "寻找旋转排序数组中的最小值", difficulty: "medium", category: "binary-search", url: "https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19772982.html" },
    { id: 4, title: "寻找两个正序数组的中位数", difficulty: "hard", category: "binary-search", url: "https://leetcode.cn/problems/median-of-two-sorted-arrays/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778823.html" },

    // 动态规划
    { id: 70, title: "爬楼梯", difficulty: "easy", category: "dp", url: "https://leetcode.cn/problems/climbing-stairs/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19718527" },
    { id: 118, title: "杨辉三角", difficulty: "easy", category: "dp", url: "https://leetcode.cn/problems/pascals-triangle/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19727095" },
    { id: 198, title: "打家劫舍", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/house-robber/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778824.html" },
    { id: 279, title: "完全平方数", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/perfect-squares/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778825.html" },
    { id: 322, title: "零钱兑换", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/coin-change/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778826.html" },
    { id: 139, title: "单词拆分", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/word-break/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778827.html" },
    { id: 300, title: "最长递增子序列", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/longest-increasing-subsequence/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778828.html" },
    { id: 152, title: "乘积最大子数组", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/maximum-product-subarray/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778829.html" },
    { id: 416, title: "分割等和子集", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/partition-equal-subset-sum/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778830.html" },
    { id: 32, title: "最长有效括号", difficulty: "hard", category: "dp", url: "https://leetcode.cn/problems/longest-valid-parentheses/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778831.html" },
    { id: 62, title: "不同路径", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/unique-paths/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778832.html" },
    { id: 64, title: "最小路径和", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/minimum-path-sum/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778833.html" },
    { id: 5, title: "最长回文子串", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/longest-palindromic-substring/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778834.html" },
    { id: 1143, title: "最长公共子序列", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/longest-common-subsequence/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778835.html" },
    { id: 72, title: "编辑距离", difficulty: "medium", category: "dp", url: "https://leetcode.cn/problems/edit-distance/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778836.html" },

    // 贪心
    { id: 406, title: "根据身高重建队列", difficulty: "medium", category: "greedy", url: "https://leetcode.cn/problems/queue-reconstruction-by-height/", blogUrl: "./05_interview/coding/huawei/#lc406-reconstruct-queue" },
    { id: 179, title: "最大数", difficulty: "medium", category: "greedy", url: "https://leetcode.cn/problems/largest-number/", blogUrl: "./05_interview/coding/huawei/#lc179-largest-number" },
    { id: 121, title: "买卖股票的最佳时机", difficulty: "easy", category: "greedy", url: "https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19727110" },
    { id: 122, title: "买卖股票的最佳时机 II", difficulty: "medium", category: "greedy", url: "https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/" },
    { id: 55, title: "跳跃游戏", difficulty: "medium", category: "greedy", url: "https://leetcode.cn/problems/jump-game/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778837.html" },
    { id: 45, title: "跳跃游戏 II", difficulty: "medium", category: "greedy", url: "https://leetcode.cn/problems/jump-game-ii/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778838.html" },
    { id: 763, title: "划分字母区间", difficulty: "medium", category: "greedy", url: "https://leetcode.cn/problems/partition-labels/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778839.html" },

    // 堆
    { id: 215, title: "数组中的第K个最大元素", difficulty: "medium", category: "heap", url: "https://leetcode.cn/problems/kth-largest-element-in-an-array/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778840.html" },
    { id: 347, title: "前 K 个高频元素", difficulty: "medium", category: "heap", url: "https://leetcode.cn/problems/top-k-frequent-elements/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778841.html" },
    { id: 295, title: "数据流的中位数", difficulty: "hard", category: "heap", url: "https://leetcode.cn/problems/find-median-from-data-stream/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778842.html" },

    // 矩阵
    { id: 73, title: "矩阵置零", difficulty: "medium", category: "matrix", url: "https://leetcode.cn/problems/set-matrix-zeroes/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778843.html" },
    { id: 54, title: "螺旋矩阵", difficulty: "medium", category: "matrix", url: "https://leetcode.cn/problems/spiral-matrix/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778846.html" },
    { id: 48, title: "旋转图像", difficulty: "medium", category: "matrix", url: "https://leetcode.cn/problems/rotate-image/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778847.html" },
    { id: 240, title: "搜索二维矩阵 II", difficulty: "medium", category: "matrix", url: "https://leetcode.cn/problems/search-a-2d-matrix-ii/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778848.html" },

    // 其他技巧
    { id: 189, title: "轮转数组", difficulty: "medium", category: "other", url: "https://leetcode.cn/problems/rotate-array/", blogUrl: "https://www.cnblogs.com/ranxi169/p/22228302.html" },
    { id: 238, title: "除自身以外数组的乘积", difficulty: "medium", category: "other", url: "https://leetcode.cn/problems/product-of-array-except-self/", blogUrl: "https://www.cnblogs.com/ranxi169/p/22228304.html" },
    { id: 136, title: "只出现一次的数字", difficulty: "easy", category: "other", url: "https://leetcode.cn/problems/single-number/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19731715" },
    { id: 169, title: "多数元素", difficulty: "easy", category: "other", url: "https://leetcode.cn/problems/majority-element/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19736326" },
    { id: 75, title: "颜色分类", difficulty: "medium", category: "other", url: "https://leetcode.cn/problems/sort-colors/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778849.html" },
    { id: 31, title: "下一个排列", difficulty: "medium", category: "other", url: "https://leetcode.cn/problems/next-permutation/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778850.html" },
    { id: 287, title: "寻找重复数", difficulty: "medium", category: "other", url: "https://leetcode.cn/problems/find-the-duplicate-number/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778852.html" },
    { id: 165, title: "比较版本号", difficulty: "medium", category: "other", url: "https://leetcode.cn/problems/compare-version-numbers/" },
    { id: 415, title: "字符串相加", difficulty: "easy", category: "other", url: "https://leetcode.cn/problems/add-strings/" },
    { id: 912, title: "排序数组", difficulty: "medium", category: "other", url: "https://leetcode.cn/problems/sort-an-array/" },
    { id: 902, title: "最大为 N 的数字组合", difficulty: "hard", category: "other", url: "https://leetcode.cn/problems/numbers-at-most-n-given-digit-set/" },
    { id: 41, title: "缺失的第一个正数", difficulty: "hard", category: "other", url: "https://leetcode.cn/problems/first-missing-positive/", blogUrl: "https://www.cnblogs.com/ranxi169/p/19778854.html" },
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
