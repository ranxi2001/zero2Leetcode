---
layout: default
title: 华为面试手撕高频题与备考规划
description: 华为2026校招/暑期实习面试手撕代码高频题Top20、完整题单(25/26届)、10天备考速通规划、ACM模式模板、AI岗ML手撕专题
eyebrow: 面试手撕 / 华为
permalink: /05_interview/coding/huawei/
---

# 华为面试手撕高频题与备考规划

2027 届秋招资料（本页已累加已有题目的频次，不新增题目）：[2027届应届生华为手撕面试经验汇总]({{ site.baseurl }}/05_interview/coding/huawei-2027/)，含近期题目、逐题来源与独立统计口径。

> 历史统计基于 6139 篇面经（小红书 4867 + 牛客 1272），LC 真题 199 种、总频次 629 次；2026-10-15 累加 2027 届资料中本页已有的 13 道题、17 次记录后，累计频次为 646 次（仅合并已有题目）。华为面试手撕 = 80% LeetCode 原题（Hot 100 为主）+ 20% 基础算法/ML 手撕。每位考生通常有一次换题机会。

---

## 面试流程概览

### 轮次说明

| 类型 | 轮次 |
|------|------|
| 暑期实习 | 技术一面 + 主管面（共 2 轮） |
| 秋招 | 技术一面 + 技术二面 + 主管面（共 3 轮） |

### 技术面考察内容

| 环节 | 说明 |
|------|------|
| 自我介绍 & 项目 | 简短自我介绍 + 追问简历中的实习/项目经历 |
| 八股文 | 数据结构、操作系统、网络、数据库等基础知识 |
| 手撕代码 | 现场编码，ACM 模式，详见下文 |
| 机试复盘 | 一面可能出现，代码重复率高时必定出现 |

> 考察顺序不固定，有些面试官会一开始就让你写代码。

### 手撕代码形式

**线上面试**：

| 形式 | 占比 | 流程 |
|------|------|------|
| 发送文字题目 | 50% | 面试官通过聊天框发题 → 本地 IDE 编写 → 面试官浏览代码问思路 |
| LeetCode 题号 | 45% | 登录自己的 LeetCode 账号，报题号现场做 |
| 机考复查 | 5% | 挑一道机考没满分的题当场重做 |

**线下面试**：白板编程，在白纸上写代码，面试官肉眼观察。

### 主管面

- 80% 聊天：生活、价值观、为人处世
- 20% 继续问技术

---

## 各岗位手撕考察方向

### AI 算法岗

| 概率 | 内容 |
|------|------|
| 70% | LeetCode Easy~Mid 原题（90% 来自 Hot 100） |
| 30% | 机器学习/深度学习手撕（KMeans、注意力机制等） |

影响因素：简历项目方向 + 面试官个人偏好，随机性大。

### 软件开发岗（通软/数据开发/测试等 · 最多人投递）

| 概率 | 内容 |
|------|------|
| 80% | LeetCode 原题（Medium 为主，少量 Hard） |
| 20% | 基础算法手撕（手写快排、优先队列、归并排序等） |

考察形式：一道主题题 + 面试官追问变体或换解法。

### 嵌入式 / 数字 IC 岗

| 概率 | 内容 |
|------|------|
| 90% | Verilog 电路手撕（同步 FIFO 控制器、异步 FIFO、状态机设计、分频电路） |
| 10% | 基础算法（与 LeetCode 几乎无交集） |

**注意**：嵌入式/IC 是完全独立的备考体系，和软件开发岗无重叠。

---

## 高频手撕题 Top 38（分类详解）

> 历史统计来源：小红书（4867 篇）+ 牛客网（1272 篇）共 **6139 篇**华为校招面经，LC 真题 199 种、总频次 629 次（历史高频≥5 共 38 种）。基础数据版本：v12，生成于 2026-05-02，已剔除 OD 机考/笔试来源。2026-10-15 已将 2027 届资料中本页已有题目的 17 次记录累加至下表，累计频次 646 次；新题及未确认编码的题目不计入，版本未细分的 Attention 不并入 Self-Attention 或 MHA。

### 分类总览

> 按主要数据结构或核心解法单一归类，每题只计一次；同一题仍可能有多种解法。LC 300 归入动态规划（也可用贪心 + 二分），LC 142 归入链表（快慢指针），LC 23 归入链表（堆 / 分治合并），LC 451 归入哈希（计数 + 排序 / 桶排序）。

| 分类 | 高频题数 | 代表高频题（频次） |
|------|---------|-------------------|
| 双指针/滑动窗口 | 6 道 | 无重复字符最长子串（**32次**）、接雨水（11次） |
| 图论 | 3 道 | 岛屿数量（**31次**）、课程表（6次） |
| 栈系列 | 4 道 | 有效括号（**22次**）、字符串解码（15次） |
| 链表 | 8 道 | LRU 缓存（17次）、反转链表（14次） |
| 二叉树 | 2 道 | 层序遍历（10次）、最大路径和（5次） |
| 排序/二分 | 3 道 | 合并区间（14次）、数组第 K 大元素（10次） |
| 动态规划 | 5 道 | 最长递增子序列（9次）、最大子数组和（7次） |
| 回溯 | 2 道 | 全排列（10次）、复原 IP 地址（8次） |
| 哈希 | 2 道 | 两数之和（11次）、根据字符出现频率排序（8次） |
| 贪心 | 2 道 | 跳跃游戏（8次）、根据身高重建队列（5次） |
| 矩阵模拟 | 1 道 | 螺旋矩阵（5次） |

### 双指针/滑动窗口（6 道）

| # | 题目 | 频次 |
|---|------|------|
| 1 | [LC 3. 无重复字符的最长子串](https://onefly.top/zero2Leetcode/playground.html?id=3) | **32次** |
| 2 | [LC 42. 接雨水](https://onefly.top/zero2Leetcode/playground.html?id=42)（双指针/单调栈） | **11次** |
| 3 | [LC 15. 三数之和](https://onefly.top/zero2Leetcode/playground.html?id=15) | 11次 |
| 4 | [LC 11. 盛最多水的容器](https://onefly.top/zero2Leetcode/playground.html?id=11) | 9次 |
| 5 | [LC 209. 长度最小的子数组](https://onefly.top/zero2Leetcode/playground.html?id=209) | 8次 |
| 6 | [LC 239. 滑动窗口最大值](https://onefly.top/zero2Leetcode/playground.html?id=239) | 5次 |

### 图论（3 道）

| # | 题目 | 频次 |
|---|------|------|
| 1 | [LC 200. 岛屿数量](https://onefly.top/zero2Leetcode/playground.html?id=200)（DFS/BFS） | **31次** |
| 2 | [LC 207. 课程表](https://onefly.top/zero2Leetcode/playground.html?id=207)（拓扑排序） | 6次 |
| 3 | [LC 695. 岛屿的最大面积](https://onefly.top/zero2Leetcode/playground.html?id=695) | 5次 |

### 栈系列（4 道）

| # | 题目 | 频次 |
|---|------|------|
| 1 | [LC 20. 有效的括号](https://onefly.top/zero2Leetcode/playground.html?id=20) | **22次** |
| 2 | [LC 394. 字符串解码](https://onefly.top/zero2Leetcode/playground.html?id=394) | **15次** |
| 3 | [LC 739. 每日温度](https://onefly.top/zero2Leetcode/playground.html?id=739) | 7次 |
| 4 | [LC 155. 最小栈](https://onefly.top/zero2Leetcode/playground.html?id=155) | 6次 |

### 链表（8 道）

| # | 题目 | 频次 |
|---|------|------|
| 1 | [LC 146. LRU 缓存](https://onefly.top/zero2Leetcode/playground.html?id=146)（双向链表+哈希） | **17次** |
| 2 | [LC 206. 反转链表](https://onefly.top/zero2Leetcode/playground.html?id=206) | **14次** |
| 3 | [LC 19. 删除链表倒数第N个节点](https://onefly.top/zero2Leetcode/playground.html?id=19) | 9次 |
| 4 | [LC 21. 合并两个有序链表](https://onefly.top/zero2Leetcode/playground.html?id=21) | 7次 |
| 5 | [LC 142. 环形链表 II](https://onefly.top/zero2Leetcode/playground.html?id=142) | 7次 |
| 6 | [LC 2. 两数相加](https://onefly.top/zero2Leetcode/playground.html?id=2) | 6次 |
| 7 | [LC 23. 合并K个升序链表](https://onefly.top/zero2Leetcode/playground.html?id=23) | 5次 |
| 8 | [LC 92. 反转链表 II](https://onefly.top/zero2Leetcode/playground.html?id=92) | 3次 |

### 二叉树（2 道）

| # | 题目 | 频次 |
|---|------|------|
| 1 | [LC 102. 二叉树的层序遍历](https://onefly.top/zero2Leetcode/playground.html?id=102) | **10次** |
| 2 | [LC 124. 二叉树中的最大路径和](https://onefly.top/zero2Leetcode/playground.html?id=124)（Hard） | 5次 |

### 排序/二分（3 道）

| # | 题目 | 频次 |
|---|------|------|
| 1 | [LC 56. 合并区间](https://onefly.top/zero2Leetcode/playground.html?id=56) | **14次** |
| 2 | [LC 215. 数组中的第K个最大元素](https://onefly.top/zero2Leetcode/playground.html?id=215) | **10次** |
| 3 | [LC 704. 二分查找](https://onefly.top/zero2Leetcode/playground.html?id=704) | 5次 |

### 动态规划（5 道）

| # | 题目 | 频次 |
|---|------|------|
| 1 | [LC 300. 最长递增子序列](https://onefly.top/zero2Leetcode/playground.html?id=300) | 9次 |
| 2 | [LC 53. 最大子数组和](https://onefly.top/zero2Leetcode/playground.html?id=53) | 7次 |
| 3 | [LC 70. 爬楼梯](https://onefly.top/zero2Leetcode/playground.html?id=70) | 7次 |
| 4 | [LC 64. 最小路径和](https://onefly.top/zero2Leetcode/playground.html?id=64) | 6次 |
| 5 | [LC 72. 编辑距离](https://onefly.top/zero2Leetcode/playground.html?id=72) | 5次 |

### 回溯（2 道）

| # | 题目 | 频次 |
|---|------|------|
| 1 | [LC 46. 全排列](https://onefly.top/zero2Leetcode/playground.html?id=46) | 10次 |
| 2 | [LC 93. 复原 IP 地址](https://onefly.top/zero2Leetcode/playground.html?id=93) | 8次 |

### 哈希（2 道）

| # | 题目 | 频次 |
|---|------|------|
| 1 | [LC 1. 两数之和](https://onefly.top/zero2Leetcode/playground.html?id=1)（哈希） | 11次 |
| 2 | [LC 451. 根据字符出现频率排序](https://onefly.top/zero2Leetcode/playground.html?id=451) | 8次 |

### 贪心（2 道）

| # | 题目 | 频次 |
|---|------|------|
| 1 | [LC 55. 跳跃游戏](https://onefly.top/zero2Leetcode/playground.html?id=55) | 8次 |
| 2 | [LC 406. 根据身高重建队列](https://onefly.top/zero2Leetcode/playground.html?id=406) | 5次 |

### 矩阵模拟（1 道）

| # | 题目 | 频次 |
|---|------|------|
| 1 | [LC 54. 螺旋矩阵](https://onefly.top/zero2Leetcode/playground.html?id=54) | 5次 |

### Hot100 之外需额外准备的题

38 道高频题里，大部分来自 Hot100，但以下几道不在 Hot100 中，需要单独准备：

| 题目 | 频次 | 说明 |
|------|------|------|
| LC 451 根据字符出现频率排序 | 8次 | 哈希计数 + 桶排序 |
| LC 300 最长递增子序列 | 9次 | DP / 贪心+二分 |
| LC 93 复原 IP 地址 | 8次 | 回溯 + 剪枝 |
| LC 406 根据身高重建队列 | 5次 | 排序 + 贪心插入 |
| LC 92 反转链表 II | 3次 | 区间翻转 |

加上非 LC 的原创题（手写快排 5 次、手写单例模式 4 次），只刷 Hot100 有明显盲区。

### 备考优先级：TOP7 必刷（覆盖约 40% 考察概率）

| # | 题目 | 频次 |
|---|------|------|
| 1 | LC 3. 无重复字符的最长子串 | **32次** |
| 2 | LC 200. 岛屿数量 | **31次** |
| 3 | LC 20. 有效的括号 | **22次** |
| 4 | LC 146. LRU 缓存 | **17次** |
| 5 | LC 394. 字符串解码 | **15次** |
| 6 | LC 56. 合并区间 | **14次** |
| 7 | LC 206. 反转链表 | **14次** |

---

<a id="attachment-top20"></a>

## 附件 TOP20 对照（独立统计）

来源：用户提供的《华为手撕题TOP20.xlsx》，工作表标题为“华为正式岗面试手撕算法题 TOP20（基于1148篇面经统计）”。附件基于 **1148 篇面经**，剔除 **OD、机考、笔试**，仅统计面试现场手撕；共 **89 道题、639 次记录**，以下 TOP20 合计 **323 次**。

这份附件与上文 **6139 篇 / 累计 646 次**是独立口径，样本是否重叠未知，频次**不相加、不覆盖**。原 38 题分类表、原频次和历史快排 5 次记录保持原口径。附件中 18 道 LC 题已有练习入口；本次补充 LC179 和无 LC 题号的手写快速排序讲解，不受原 38 题范围限制。

| 排名 | LC 题号 | 题目 | 附件频次 | 练习 / 讲解入口 |
|------|---------|------|----------|-----------------|
| 1 | LC 200 | 岛屿数量 | 36次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=200) |
| 2 | LC 3 | 无重复字符的最长子串 | 34次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=3) |
| 3 | — | 手写快速排序 | 27次 | [原地三路快排讲解](#handwritten-quicksort)，无 LC 题号 |
| 4 | LC 20 | 有效的括号 | 25次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=20) |
| 5 | LC 146 | LRU 缓存 | 20次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=146) |
| 6 | LC 56 | 合并区间 | 18次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=56) |
| 7 | LC 42 | 接雨水 | 15次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=42) |
| 8 | LC 15 | 三数之和 | 14次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=15) |
| 9 | LC 215 | 数组中的第 K 个最大元素 | 13次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=215)；[快速选择 + 堆双解](#lc215-two-methods) |
| 10 | LC 102 | 二叉树的层序遍历 | 13次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=102) |
| 11 | LC 70 | 爬楼梯 | 13次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=70) |
| 12 | LC 394 | 字符串解码 | 12次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=394) |
| 13 | LC 1 | 两数之和 | 11次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=1) |
| 14 | LC 739 | 每日温度 | 11次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=739) |
| 15 | LC 206 | 反转链表 | 11次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=206) |
| 16 | LC 11 | 盛最多水的容器 | 10次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=11) |
| 17 | LC 179 | 最大数 | 10次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=179)；[拼接比较题解](#lc179-largest-number) |
| 18 | LC 53 | 最大子数组和 | 10次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=53) |
| 19 | LC 21 | 合并两个有序链表 | 10次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=21) |
| 20 | LC 46 | 全排列 | 10次 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=46) |

---

<a id="sept-oct-supplement"></a>

## 9.1-10.12「49 场面试手撕汇总」补充（用户转录，独立口径）

来源为**用户提供的转录**，原文链接未提供；未经独立核验「49 场」面试次数。以下按题目或主题去重整理为三组，共 14 / 8 / 8 项；这是题目清单，**无原始统计频次，不参与 TOP20 排序**，表中先后也不代表面试频率。并查集的局部次数描述见组3，不能据此推算其他题目的次数。

**三来源统计边界**：历史 **6139 篇 / 累计 646 次**（已含此前 2027 届已有题目的增量）、附件 TOP20 的 **1148 篇 / 639 次记录**与本次「49 场」转录分别保留。三来源样本是否重叠未知，频次**不相加、不覆盖**，本次不调整原 38 题分类频次、TOP20 排名或附件频次。

收录到本文不代表已有本地练习。下表的「练习」仅指当前页面已注册且有测试用例的题目；其余 LC 题使用「官方题页」。题号题名错配时同时保留原文与官方对照，候选题不视为已确认原题。

### 组1：常见 LC 补漏（14 项）

| LC 题号 | 题目 | 备考要点 | 入口 |
|---------|------|----------|------|
| LC 141 | 环形链表 | 快慢指针；判断是否有环，与 LC142 寻找入环点区分 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=141) |
| LC 104 | 二叉树的最大深度 | DFS；递归返回子树深度 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=104) |
| LC 101 | 对称二叉树 | 成对比较镜像位置；注意空节点 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=101) |
| LC 124 | 二叉树中的最大路径和 | 偏难；区分向父节点返回的单侧贡献与经过当前节点的路径和 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=124) |
| LC 64 | 最小路径和 | DP；状态转移与首行、首列初始化 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=64) |
| LC 62 | 不同路径 | DP；计数状态与边界 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=62) |
| LC 32 | 最长有效括号 | DP / 栈；有效区间衔接与下标边界 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=32) |
| LC 560 | 和为 K 的子数组 | 前缀和 + 哈希计数；求子数组个数，与组2的「最长」描述区分 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=560) |
| LC 55 | 跳跃游戏 | 贪心；维护最远可达位置 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=55) |
| LC 238 | 除自身以外数组的乘积 | 前后缀乘积；注意零元素 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=238) |
| LC 35 | 搜索插入位置 | 二分；寻找第一个不小于目标的位置 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=35) |
| LC 153 | 寻找旋转排序数组中的最小值 | 二分；判断最小值所在区间 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=153) |
| LC 4 | 寻找两个正序数组的中位数 | 难；二分划分，处理空侧与奇偶总长度 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=4) |
| LC 295 | 数据流的中位数 | 双堆；维护两侧大小及堆顶顺序 | [官方题页](https://leetcode.cn/problems/find-median-from-data-stream/) |

### 组2：扩展 LC 题与原文疑点（8 项）

题号和题名按用户转录保留，尤其不能将下面两处错配静默改成另一道题。

| 原文题号 | 原文题名 | 备考要点 / 对照说明 | 入口 |
|----------|----------|--------------------|------|
| 原文 LC 135 | 分发糖果 | 贪心；分别满足左右相邻约束 | [官方题页](https://leetcode.cn/problems/candy/) |
| 原文 LC 997 | 小镇法官 | 图的入度 / 出度，或哈希计数 | [官方题页](https://leetcode.cn/problems/find-the-town-judge/) |
| 原文 LC 673 | 最长递增子序列个数 | DP；同时维护以当前位置结尾的最长长度和方案数 | [官方题页](https://leetcode.cn/problems/number-of-longest-increasing-subsequence/) |
| 原文 LC 443 | 压缩字符串 | 双指针；读写位置与连续字符计数 | [官方题页](https://leetcode.cn/problems/string-compression/) |
| 原文 LC 209 | 长度最小子数组 | 滑动窗口；官方题目中的数组元素为正整数 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=209) |
| 原文 LC 1004 | 删掉一个元素后全为1最长子数组 | **题号题名错配**：按题名对应官方 LC1493「删掉一个元素以后全为 1 的最长子数组」，要求删除一个元素；官方 LC1004 是「最大连续1个数III」，允许至多翻转 k 个零。按实际题意准备滑动窗口，保留原文记录 | [官方 LC1493 题页](https://leetcode.cn/problems/longest-subarray-of-1s-after-deleting-one-element/)；[官方 LC1004 对照](https://leetcode.cn/problems/max-consecutive-ones-iii/) |
| 原文 LC 930 | 和为K最长子数组 | **题号题名错配**：官方 LC930 是「和相同的二元子数组」（求个数），并非求最长长度；「最长和等于 k」更接近 LC325，**仅为候选，待原题确认**，不能擅自确定。若确为一般数组的最长长度问题，可准备前缀和 + 哈希记录最早下标 | [官方 LC930 题页](https://leetcode.cn/problems/binary-subarrays-with-sum/description)；[官方 LC325 候选题页](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/) |
| 原文 LC 315 | 计算右侧小于当前元素个数 | 树状数组 / 归并排序计数。保留原文备注「斐波那契 O(logn)」：此备注与题意无关，不作为本题算法结论 | [官方题页](https://leetcode.cn/problems/count-of-smaller-numbers-after-self/) |

### 组3：非 LC / 基础算法主题（8 项）

这些转录条目缺少完整题面，不分配 LC 题号；下表仅给复习方向，具体模型和输入输出以原题为准。

| 原文主题 | 复习方向 / 待确认信息 |
|----------|----------------------|
| 环形石子合并 | 区间 DP；考虑断环成链，合并代价与求最小还是最大待原题确认 |
| 整数拆分方案数 | DP；约束未明，需先确认可用整数、是否计顺序、是否允许重复及是否取模，不据题名虚构题意 |
| 相同字母排列数 | 组合数学；约束待确认，先核对重复字母计数规则、排列限制及是否取模 |
| 命令行参数解析 | 字符串模拟；空格、引号和转义规则需按原题确认 |
| 找质因数 | 数论；试除分解方向，确认输入范围及输出是否保留重复因子 |
| Top N 元素平均值 | 堆；N 的范围待确认，先确认取最大还是最小 N 个、重复元素计数及输出精度 |
| 子集和能否凑出目标 | 回溯 / DP；根据数值范围、负数与元素能否重复使用选择模型 |
| 并查集 | 路径压缩 + 按秩或按大小合并；用户转录称「Agent 一面 3 次」，仅为局部原文描述，不转成全局频次，也不加入 TOP20 |

### 如何安排补漏

**TOP20 前 5 题优先**：岛屿数量、无重复字符的最长子串、手写快速排序、有效的括号、LRU 缓存，顺序沿用附件排名。完成后再按薄弱点选择本补充区的题目。

**LC215 准备快速选择 + 堆双解**，能说明是否修改输入、复杂度与流式场景，见[已有双解讲解](#lc215-two-methods)。同时练习 **ACM 模式 I/O**，自己完成读入、调用与输出，可使用[ACM 模拟 IDE]({{ site.baseurl }}/acm-playground.html)。补上**并查集的路径压缩与按大小合并**，会解释连通性查询和集合合并；这些是复习建议，不由局部次数推导全局排名。

<!-- huawei-sept-oct:end -->

---

## 附件题目讲解

<a id="handwritten-quicksort"></a>

### 手写快速排序：随机枢轴 + 原地三路划分

任务是将数组按非降序排列。例如 `[3,1,3,2]` 排序后为 `[1,2,3,3]`。这是基础算法手撕，没有 LC 题号。面试时应能解释划分过程、递归边界、重复值和最坏复杂度。

每轮随机选择枢轴，将当前区间划为小于、等于、大于枢轴三段。扫描时维护 `[left, lt)` 小于枢轴、`[lt, i)` 等于枢轴、`(gt, right]` 大于枢轴；`[i, gt]` 待处理。从右侧换来的元素尚未判断，必须保留 `i` 继续检查。等值段无需再排序，全相等输入也只需一次扫描。

下面只递归较短的一侧，较长一侧用循环处理，避免有序大数组触发线性深度的递归栈。

```python
from random import randint


def quick_sort(nums):
    def sort(left, right):
        while left < right:
            pivot = nums[randint(left, right)]
            lt = i = left
            gt = right
            while i <= gt:
                if nums[i] < pivot:
                    nums[lt], nums[i] = nums[i], nums[lt]
                    lt += 1
                    i += 1
                elif nums[i] > pivot:
                    nums[i], nums[gt] = nums[gt], nums[i]
                    gt -= 1
                else:
                    i += 1
            if lt - left < right - gt:
                sort(left, lt - 1)
                left = gt + 1
            else:
                sort(gt + 1, right)
                right = lt - 1

    sort(0, len(nums) - 1)
```

期望时间 **O(n log n)**，最坏仍为 **O(n²)**；每层只递归短区间，辅助栈空间上界 **O(log n)**。算法原地修改数组，不稳定；空数组、单元素、负数与重复值都适用。随机化降低退化概率，不能宣称消除了最坏情况。

<a id="lc215-two-methods"></a>

### LC215：快速选择和堆都要准备

[练习入口](https://onefly.top/zero2Leetcode/playground.html?id=215)。第 K 大按排序位置计数，不去重，例如 `[3,2,3,1]` 中第 2 大仍是 `3`，且 `1 <= k <= len(nums)`。

**快速选择**：目标是升序下标 `len(nums)-k`。三路划分后，若目标落在等值段就返回，否则只保留目标所在的一侧。这一步与完整快排的区别在于只处理一个子区间。

```python
from random import randint


def find_kth_largest_quickselect(nums, k):
    target = len(nums) - k
    left, right = 0, len(nums) - 1
    while left <= right:
        pivot = nums[randint(left, right)]
        lt = i = left
        gt = right
        while i <= gt:
            if nums[i] < pivot:
                nums[lt], nums[i] = nums[i], nums[lt]
                lt += 1
                i += 1
            elif nums[i] > pivot:
                nums[i], nums[gt] = nums[gt], nums[i]
                gt -= 1
            else:
                i += 1
        if target < lt:
            right = lt - 1
        elif target > gt:
            left = gt + 1
        else:
            return nums[target]
```

期望时间 **O(n)**，最坏 **O(n²)**，额外空间 **O(1)**，会修改输入数组。

**大小为 K 的最小堆**：堆中始终保留已扫描元素中最大的 K 个，堆顶就是它们中最小的数。新元素比堆顶大时才替换，扫描结束后堆顶为全局第 K 大。

```python
import heapq


def find_kth_largest_heap(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)
    for i in range(k, len(nums)):
        if nums[i] > heap[0]:
            heapq.heapreplace(heap, nums[i])
    return heap[0]
```

建堆 **O(k)**，后续维护 **O((n-k) log k)**，整体可写作 **O(n log(k+1))**，额外空间 **O(k)**；不修改输入，也适合流式数据。要点是最小堆保留最大 K 个，不能把堆的方向写反。

<a id="lc179-largest-number"></a>

### LC179 最大数：比较拼接后的顺序

[本地练习](https://onefly.top/zero2Leetcode/playground.html?id=179) · [原题与约束](https://leetcode.com/problems/largest-number/description/)

给定非负整数数组，调整排列使拼接出的数字最大，返回字符串。例如 `[10,2]` 得到 `"210"`，`[3,30,34,5,9]` 得到 `"9534330"`。约束：`1 <= nums.length <= 100`，`0 <= nums[i] <= 10^9`。

不能按整数大小或单个字符串的字典序排序。对于字符串 `a`、`b`，比较 `a+b` 和 `b+a`；若前者大，`a` 就应排在前面。例如 `"3"+"30" > "30"+"3"`，所以 `3` 在 `30` 前面。相邻交换不会改变其他位置的拼接，按这个比较器排列即可得到最大结果。比较结果相等时两种顺序等价。

```python
from functools import cmp_to_key


def largest_number(nums):
    def compare(a, b):
        ab, ba = a + b, b + a
        return (ba > ab) - (ba < ab)

    parts = sorted(map(str, nums), key=cmp_to_key(compare))
    return "0" if parts[0] == "0" else "".join(parts)
```

全零输入必须返回 `"0"`，不能返回 `"00"`。设元素最大位数为 L，时间 **O(n log n · L)**，空间 **O(nL)**，结果始终保留为字符串。

<a id="lc451-frequency-sort"></a>

### LC451 根据字符出现频率排序（原统计 8 次）

[本地练习](https://onefly.top/zero2Leetcode/playground.html?id=451) · [原题与约束](https://leetcode.com/problems/sort-characters-by-frequency/description/)

将字符串按字符出现频率从高到低重排，同一字符必须连续，同频字符可任意排列，大小写视为不同字符。例如 `"tree"` 可返回 `"eert"` 或 `"eetr"`；`"cccaaa"` 可返回 `"cccaaa"` 或 `"aaaccc"`，但 `"cacaca"` 不合法；`"Aabb"` 可返回 `"bbAa"`。约束：`1 <= s.length <= 5*10^5`，仅含大小写英文字母和数字。

先用哈希表计数，再按频率排序不同字符，最后一次性拼接各字符块。不要逐字符反复拼接不可变字符串。

```python
from collections import Counter


def frequency_sort(s):
    counts = Counter(s)
    return "".join(c * counts[c] for c in sorted(counts, key=counts.get, reverse=True))
```

设长度为 n、不同字符数为 m，时间 **O(n + m log m)**，包含返回字符串的空间为 **O(n + m)**。也可按频率建桶，将排序部分降为线性扫描。本地判题验证原字符多重集、同字符分组连续、组频率非升序，不固定比较某一个答案字符串。

<a id="lc406-reconstruct-queue"></a>

### LC406 根据身高重建队列（原统计 5 次）

[本地练习](https://onefly.top/zero2Leetcode/playground.html?id=406) · [原题与约束](https://leetcode.com/problems/queue-reconstruction-by-height/description/)

每个人用 `[h,k]` 表示，`h` 为身高，`k` 是队列前方身高**大于等于 h**的人数。给定打乱顺序的人员数组，返回符合条件的队列。例如 `[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]` 可还原为 `[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]`；`[[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]` 可还原为 `[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]`。约束：`1 <= people.length <= 2000`，每项恰有两个整数，`0 <= h <= 10^6`，`0 <= k < people.length`，保证存在解。

按身高降序，同身高按 k 升序处理。插入当前人时，已处理的人都不矮于他，因此在下标 k 插入，前方恰有 k 个满足条件的人。同高者须按 k 升序，否则可能在队列还不够长时插入，破坏计数。后来插入的矮个子不会影响已放置高个子的约束。

```python
def reconstruct_queue(people):
    queue = []
    for person in sorted(people, key=lambda p: (-p[0], p[1])):
        queue.insert(person[1], person)
    return queue
```

排序 **O(n log n)**，列表插入累计 **O(n²)**，整体时间 **O(n²)**，空间 **O(n)**。本地判题先核对输出与输入的人员多重集，再逐人计算前方身高大于等于其身高的人数；不会通过忽略顺序的排序比较来验收。

---

## 华为特色：追问文化

华为面试与字节、腾讯最大的差异在于**追问**。字节通常是一道题写完再出第二道，华为面试官喜欢在同一道题上反复追问：

| 追问类型 | 示例 |
|----------|------|
| 换解法 | 岛屿数量写完 DFS → 要求用 BFS 重写；接雨水写完双指针 → 追问单调栈解法 |
| 复杂度优化 | "还有没有更好的方案？空间能不能优化到 O(1)？" |
| 边界条件 | "如果输入为空怎么处理？如果只有一个节点呢？" |

**结论**：准备华为面试，每道高频题不能只会一种写法。**双解是标配，不是加分项。**

---

## 华为特色：原创手撕题

华为有部分 LC 上找不到直接对应的原创题，频次不高但值得准备：

| 题目 | 频次 | 考点 |
|------|------|------|
| 手写快速排序 | 5 | 完整实现 + 复杂度分析 |
| 手写单例模式 | 4 | volatile 原理 + 设计模式 |
| 分月饼 | 2 | 三维 DP + 滚动数组 |
| 颜色反转（r/g 归位） | 2 | 前缀和 / 枚举分界点 |
| 最大合法时间 | 2 | 枚举 / DFS（给 4 个数字凑 HH:MM） |

---

## AI 岗 ML/DL 手撕频次

> 仅算法岗 / AI 方向 / 大模型岗需要准备，软件开发岗不考

| 题目 | 频次 |
|------|------|
| Self-Attention | **18 次** |
| MHA（Multi-Head Attention） | **15 次** |
| K-Means | **14 次** |
| 反向传播（Backpropagation） | 6 次 |
| Conv2d 手写 | 6 次 |
| Linear Layer | 4 次 |
| LSTM | 2 次 |

> 随着大模型岗位增多，Attention 机制手撕频次在快速上升。要求从零手写 PyTorch 代码，不是伪代码。

---

## 与腾讯、字节的对比

| 维度 | 华为 | 腾讯 | 字节 |
|------|------|------|------|
| 面经数量 | 6139 篇 | 3784 篇 | — |
| LC 手撕频次 | 646 次（仅累加已有题目） | 1833 次 | — |
| 第一高频题 | LC3（32次） | LRU（123次） | — |
| 非 LC 题占比 | 约 12% | 25% | 7% |
| 追问强度 | ★★★★★ | ★★★ | ★★ |
| 整体难度 | Medium 为主 | Medium 为主 | Medium~Hard |
| 特色 | 岗位分化 / 追问文化 | LRU / 场景原创题 | 原创题 / Hard |

---

## 完整手撕题单

### 26 届实习 + 秋招

#### AI 算法方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 9月底 | AI工程师一面 | [480. 滑动窗口中位数](https://leetcode.cn/problems/sliding-window-median/) |
| 9月底 | AI相关岗位一面 | [20. 有效的括号](https://onefly.top/zero2Leetcode/playground.html?id=20) |
| 9月底 | 海思AI工程师一面 | [986. 区间列表的交集](https://onefly.top/zero2Leetcode/playground.html?id=986) |
| 10月初 | AI工程师一面 | [46. 全排列](https://onefly.top/zero2Leetcode/playground.html?id=46) |
| 10月初 | AI一面 | [46. 全排列](https://onefly.top/zero2Leetcode/playground.html?id=46) |
| 10月初 | 计算机视觉一面 | [155. 最小栈](https://onefly.top/zero2Leetcode/playground.html?id=155) |
| 10月初 | AI一面 | 搜索二维矩阵 |
| 10月初 | AI工程师一面 | 字符串前缀后缀子串提取（自定义题） |
| 10月初 | AI计算一面 | 实现 L2 loss 梯度下降算法 |
| 10月中 | 终端云AI一面 | PyTorch 实现 XGBoost 调用、反向传播、NN |
| 10月中 | 媒体算法一面 | 两个矩形相交面积 |
| 10月中 | 推荐算法一面 | [456. 132 模式](https://onefly.top/zero2Leetcode/playground.html?id=456) |
| 10月底 | AI工程师一面 | 字符串前缀后缀子串提取（自定义题） |

#### 通软方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 9月底 | 通软一面 | 数组中对数字和字母分别排序 |
| 9月底 | 一面 | [3. 无重复字符的最长子串](https://onefly.top/zero2Leetcode/playground.html?id=3) |
| 10月初 | 一面 | [2. 两数相加](https://onefly.top/zero2Leetcode/playground.html?id=2)（需自己写 ListNode） |
| 10月初 | 通软一面 | 类似爬楼梯的 DP + 求区间权值第 k 大 |
| 10月中 | 通软一面 | 数字字符串插入使新数值最大 |
| 10月中 | AI软件开发一面 | 按 BMI 排序结构体数组 |
| 10月底 | 通软一面 | [1. 两数之和](https://onefly.top/zero2Leetcode/playground.html?id=1) |
| 10月底 | 2012通软一面 | [200. 岛屿数量](https://onefly.top/zero2Leetcode/playground.html?id=200) |
| 10月中 | 通软一面 | [1. 两数之和](https://onefly.top/zero2Leetcode/playground.html?id=1) + [3. 最长无重复子串](https://onefly.top/zero2Leetcode/playground.html?id=3) |

#### 其他方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 9月底 | 智能终端一面 | 找出 8bit 数组中最大的 8 个 |
| 9月初 | 通信算法一面 | 背包问题 |
| 9月底 | 无线一面 | [200. 岛屿数量](https://onefly.top/zero2Leetcode/playground.html?id=200) |
| 9月初 | 车BU一面 | [240. 搜索二维矩阵 II](https://onefly.top/zero2Leetcode/playground.html?id=240) |
| 9月初 | 终端BG一面 | [394. 字符串解码](https://onefly.top/zero2Leetcode/playground.html?id=394) |

### 25 届秋招

#### AI 算法方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 10月中 | AI算法工程师一面 | LC 位运算原题（Mid） |
| 10月中 | AI算法工程师二面 | 排序模拟题（Easy~Mid） |
| 11月初 | 通信算法一面 | [394. 字符串解码](https://onefly.top/zero2Leetcode/playground.html?id=394) |
| 11月初 | 通信算法二面 | 哈希表 + 取模判断分组 |
| 9月底 | 算法工程师二面 | [739. 每日温度](https://onefly.top/zero2Leetcode/playground.html?id=739) |

#### 通软方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 10月中 | 终端一面 | [104. 最大深度](https://onefly.top/zero2Leetcode/playground.html?id=104) + [102. 层序遍历](https://onefly.top/zero2Leetcode/playground.html?id=102) + [139. 单词拆分](https://onefly.top/zero2Leetcode/playground.html?id=139) + [20. 有效的括号](https://onefly.top/zero2Leetcode/playground.html?id=20) |
| 10月中 | 终端二面 | [200. 岛屿数量](https://onefly.top/zero2Leetcode/playground.html?id=200) |
| 10月中 | 海思通软一面 | [11. 盛最多水的容器](https://onefly.top/zero2Leetcode/playground.html?id=11) |
| 10月下 | 微服务一面 | [1624. 两个相同字符之间的最长子串](https://leetcode.cn/problems/largest-substring-between-two-equal-characters/) |
| 10月下 | 微服务二面 | [71. 简化路径](https://onefly.top/zero2Leetcode/playground.html?id=71) |
| 10月中 | 通软一面 | [49. 字母异位词分组](https://onefly.top/zero2Leetcode/playground.html?id=49) |
| 10月中 | 通软二面 | [LCR 020. 回文子串](https://leetcode.cn/problems/a7VOhD/) |
| 10月中 | 通软一面 | [面试题 02.02. 倒数第k个节点](https://leetcode.cn/problems/kth-node-from-end-of-list-lcci/) |
| 10月中 | 通软二面 | [1302. 层数最深叶子节点的和](https://leetcode.cn/problems/deepest-leaves-sum/) |
| 9月下 | 通软一面 | [20. 有效的括号](https://onefly.top/zero2Leetcode/playground.html?id=20) |
| 9月下 | 通软二面 | [152. 乘积最大子数组](https://onefly.top/zero2Leetcode/playground.html?id=152) |
| 9月下 | 终端通软一面 | [LCR 007. 三数之和](https://leetcode.cn/problems/1fGaJU/) |
| 9月 | 计算产品线一面 | [1011. 在D天内送达包裹的能力](https://leetcode.cn/problems/capacity-to-ship-packages-within-d-days/) |
| 9月 | 计算产品线二面 | [LCR 021. 删除链表的倒数第N个结点](https://leetcode.cn/problems/SLwz0R/) |
| 9月下 | 通软一面 | [718. 最长重复子数组](https://onefly.top/zero2Leetcode/playground.html?id=718) |
| 9月下 | 通软二面 | [20. 有效的括号](https://onefly.top/zero2Leetcode/playground.html?id=20) |
| 9月下 | 通软一面 | [113. 路径总和 II](https://leetcode.cn/problems/path-sum-ii/) + [690. 员工的重要性](https://leetcode.cn/problems/employee-importance/) |
| 9月下 | 通软二面 | 1到n的最小公倍数 + 英文平均单词长度 |
| 9月下 | 终端BG二面 | [64. 最小路径和](https://onefly.top/zero2Leetcode/playground.html?id=64) |
| 9月下 | 光产品线一面 | [1423. 可获得的最大点数](https://onefly.top/zero2Leetcode/playground.html?id=1423) |
| 9月 | 车BU座舱一面 | [56. 合并区间](https://onefly.top/zero2Leetcode/playground.html?id=56) + [151. 反转字符串中的单词](https://leetcode.cn/problems/reverse-words-in-a-string/) |
| 9月 | ICT一面 | [LCR 008. 长度最小的子数组](https://leetcode.cn/problems/2VG8Kg/) |
| 9月 | ICT二面 | [17. 电话号码的字母组合](https://onefly.top/zero2Leetcode/playground.html?id=17) |
| 9月初 | ICT光产品线一面 | [102. 二叉树的层序遍历](https://onefly.top/zero2Leetcode/playground.html?id=102) |
| 9月 | 通软一面 | [LCR 078. 合并K个升序链表](https://leetcode.cn/problems/vvXgSW/) + [994. 腐烂的橘子](https://onefly.top/zero2Leetcode/playground.html?id=994) + [46. 全排列](https://onefly.top/zero2Leetcode/playground.html?id=46) + [1423. 最大点数](https://onefly.top/zero2Leetcode/playground.html?id=1423) + [42. 接雨水](https://onefly.top/zero2Leetcode/playground.html?id=42) |
| 9月 | 通软三面 | [204. 计数质数](https://leetcode.cn/problems/count-primes/) |
| 9月 | 通软一面 | [LCR 029. 循环有序列表的插入](https://leetcode.cn/problems/4ueAj6/) |
| 9月 | 通软二面 | [692. 前K个高频单词](https://leetcode.cn/problems/top-k-frequent-words/) |
| 9月底 | 服务与软件一面 | [582. 杀掉进程](https://leetcode.cn/problems/kill-process/) |
| 9月底 | 服务与软件二面 | [735. 小行星碰撞](https://leetcode.cn/problems/asteroid-collision/) |
| 9月底 | 服务与软件三面 | [679. 24 点游戏](https://leetcode.cn/problems/24-game/) |
| 9月中 | 终端二面 | [739. 每日温度](https://onefly.top/zero2Leetcode/playground.html?id=739) |
| 9月中 | 终端BG通软一面 | [LCR 078. 合并K个升序链表](https://leetcode.cn/problems/vvXgSW/) |
| 9月中 | 终端BG通软二面 | [994. 腐烂的橘子](https://onefly.top/zero2Leetcode/playground.html?id=994) |
| 9月下 | 终端一面 | [134. 加油站](https://onefly.top/zero2Leetcode/playground.html?id=134) |
| 9月下 | 终端二面 | [5. 最长回文子串](https://onefly.top/zero2Leetcode/playground.html?id=5) |
| 9月中 | 华为云一面 | [217. 存在重复元素](https://onefly.top/zero2Leetcode/playground.html?id=217) |
| 9月中 | 华为云二面 | 二进制补码数组转十进制 |
| 9月初 | 后端通软一面 | [面试题 17.24. 最大子矩阵](https://leetcode.cn/problems/max-submatrix-lcci/) |
| 9月初 | 流程IT一面 | [14. 最长公共前缀](https://leetcode.cn/problems/longest-common-prefix/) |
| 9月初 | 终端一面 | [56. 合并区间](https://onefly.top/zero2Leetcode/playground.html?id=56) + [200. 岛屿数量](https://onefly.top/zero2Leetcode/playground.html?id=200) |
| 9月初 | 终端通软一面 | [415. 字符串相加](https://onefly.top/zero2Leetcode/playground.html?id=415) |
| 9月 | 终端BG一面 | [1985. 找出数组中的第K大整数](https://leetcode.cn/problems/find-the-kth-largest-integer-in-the-array/) |
| 9月 | 终端BG二面 | [64. 最小路径和](https://onefly.top/zero2Leetcode/playground.html?id=64) |
| 9月底 | 终端软件部二面 | [LCR 138. 有效数字](https://leetcode.cn/problems/biao-shi-shu-zhi-de-zi-fu-chuan-lcof/) |
| 9月初 | ICT计算产品线 | [994. 腐烂的橘子](https://onefly.top/zero2Leetcode/playground.html?id=994) + [91. 解码方法](https://onefly.top/zero2Leetcode/playground.html?id=91) + [678. 有效的括号字符串](https://leetcode.cn/problems/valid-parenthesis-string/) + [316. 去除重复字母](https://leetcode.cn/problems/remove-duplicate-letters/) |
| 9月中 | ICT光产品线二面 | 十进制小数转任意 m 进制 |

#### 其他方向

| 时间 | 面试轮次 | 题目 |
|------|----------|------|
| 9月下 | 嵌入式一面 | 提取合法 MAC 地址并计数 |
| 9月下 | 嵌入式二面 | [2094. 找出3位偶数](https://leetcode.cn/problems/finding-3-digit-even-numbers/) |
| 10月中 | 一面 | [704. 二分查找](https://onefly.top/zero2Leetcode/playground.html?id=704) |
| 10月中 | 二面 | [21. 合并两个有序链表](https://onefly.top/zero2Leetcode/playground.html?id=21) |
| 9月初 | ICT光产品线一面 | [223. 矩形面积](https://leetcode.cn/problems/rectangle-area/) |
| 9月初 | ICT光产品线二面 | [134. 加油站](https://onefly.top/zero2Leetcode/playground.html?id=134) |

---

## 10 天备考速通规划

> 刷题顺序按手撕高频考点从高到低排列。AI 岗与非 AI 岗共用 Day 1~9，AI 岗额外完成 Day 10。刷题注重质量，一定自己写一遍代码。刷得快可以一天多个 Day，刷得慢适当抛弃 Hard 题。

### Day 1：哈希 + 数组技巧 + 矩阵

| 知识点 | 题解/教程 |
|--------|----------|
| 哈希 | [Hot 100 哈希专题](https://codefun2000.com/codenote/hot100/P0017) |
| 普通数组 - 数组技巧 | [Hot 100 数组技巧](https://codefun2000.com/codenote/hot100/P0019) |
| 矩阵四题 | [Hot 100 矩阵专题](https://codefun2000.com/codenote/hot100/P0021) |

### Day 2：栈与双指针

| 知识点 | 题解/教程 |
|--------|----------|
| 栈 - 基础题 | [Hot 100 栈基础](https://codefun2000.com/codenote/hot100/P0030) |
| 单调栈 | [Hot 100 单调栈](https://codefun2000.com/codenote/hot100/P0032) |
| 双指针 - 快慢指针 | [Hot 100 快慢指针](https://codefun2000.com/codenote/hot100/P0015) |
| 双指针 - 同向双指针 | [Hot 100 同向双指针](https://codefun2000.com/codenote/hot100/P0016) |
| 双指针 - 相向双指针 | [Hot 100 相向双指针](https://codefun2000.com/codenote/hot100/P0013) |

### Day 3：回溯

| 知识点 | 题解/教程 |
|--------|----------|
| 组合型回溯 | [Hot 100 组合回溯](https://codefun2000.com/codenote/hot100/P0022) |
| 排列型回溯 | [Hot 100 排列回溯](https://codefun2000.com/codenote/hot100/P0024#leetcode-46.-%E5%85%A8%E6%8E%92%E5%88%97) |

### Day 4：BFS + 动态规划基础

| 知识点 | 题解/教程 |
|--------|----------|
| 图论基础 | [Hot 100 图论基础](https://codefun2000.com/codenote/hot100/P0034) |
| BFS 入门 | [Hot 100 BFS 入门](https://codefun2000.com/codenote/hot100/P0035) |
| 动态规划入门 | [Hot 100 DP 入门](https://codefun2000.com/codenote/hot100/P0025) |

### Day 5：动态规划进阶

| 知识点 | 题解/教程 |
|--------|----------|
| 背包模型 | [Hot 100 背包模型](https://codefun2000.com/codenote/hot100/P0027) |
| 多维动态规划 | [Hot 100 多维 DP](https://codefun2000.com/codenote/hot100/P0028) |

### Day 6：贪心 + 二叉树基础

| 题目 | 链接 |
|------|------|
| LC 121. 买卖股票的最佳时机 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=121) |
| LC 55. 跳跃游戏 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=55) |
| LC 45. 跳跃游戏 II | [练习](https://onefly.top/zero2Leetcode/playground.html?id=45) |
| LC 763. 划分字母区间 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=763) |
| LC 94. 二叉树的中序遍历 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=94) |
| LC 104. 二叉树的最大深度 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=104) |
| LC 102. 二叉树的层序遍历 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=102) |

### Day 7：二分查找与堆

| 题目 | 链接 |
|------|------|
| LC 704. 二分查找 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=704) |
| LC 35. 搜索插入位置 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=35) |
| LC 34. 排序数组中查找元素的首尾位置 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=34) |
| LC 33. 搜索旋转排序数组 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=33) |
| LC 153. 旋转排序数组的最小值 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=153) |
| LC 215. 数组中的第K个最大元素 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=215) |
| LC 347. 前K个高频元素 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=347) |
| LC 703. 数据流中的第K大元素 | [LeetCode](https://leetcode.cn/problems/kth-largest-element-in-a-stream/) |

### Day 8：技巧 + 数学

| 题目 | 链接 |
|------|------|
| LC 136. 只出现一次的数字 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=136) |
| LC 169. 多数元素 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=169) |
| LC 287. 寻找重复数 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=287) |
| LC 238. 除自身以外数组的乘积 | [LeetCode](https://leetcode.cn/problems/product-of-array-except-self/) |
| LC 75. 颜色分类 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=75) |

### Day 9：链表

| 题目 | 链接 |
|------|------|
| LC 206. 反转链表 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=206) |
| LC 141. 环形链表 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=141) |
| LC 142. 环形链表 II | [练习](https://onefly.top/zero2Leetcode/playground.html?id=142) |
| LC 21. 合并两个有序链表 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=21) |
| LC 2. 两数相加 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=2) |
| LC 19. 删除链表的倒数第N个结点 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=19) |
| LC 234. 回文链表 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=234) |
| LC 160. 相交链表 | [练习](https://onefly.top/zero2Leetcode/playground.html?id=160) |

### Day 10：AI 岗专题（非 AI 岗跳过）

| 方向 | 题目 | 题解 |
|------|------|------|
| 机器学习 | 手撕 KMeans | [题解](https://codefun2000.com/codenote/coding/P4483) |
| 机器学习 | 手撕 KNN | [题解](https://codefun2000.com/codenote/coding/P4499) |
| 机器学习 | 手撕线性回归 | [题解](https://codefun2000.com/codenote/coding/P4484) |
| 深度学习 | 手撕反向传播 | [题解](https://codefun2000.com/codenote/coding/P4486) |
| 深度学习 | SoftMax 计算 | [题解](https://codefun2000.com/codenote/coding/P4501) |
| Transformer | Self-Attention 机制 | [题解](https://codefun2000.com/codenote/coding/P4489) |
| Transformer | 多头注意力机制 (MHA) | [题解](https://codefun2000.com/codenote/coding/P4496) |

### 必备前置知识

| 主题 | 链接 |
|------|------|
| 华为面试基本流程 | [流程详解](https://codefun2000.com/codenote/hw_note/P4512) |
| 面试手撕刷题方法论 | [方法论](https://codefun2000.com/codenote/hw_note/P5103) |
| Hot 100 速通笔记（完整） | [Hot 100 笔记](https://codefun2000.com/codenote/hot100/P0026) |

---

## 手撕代码模板（ACM 模式）

华为面试手撕是 ACM 模式，需要自己处理输入输出。面试官看重**解耦 + 抽象 + 规范命名**。

```python
import sys
input = sys.stdin.readline


class Solution:
    def solve(self, arr):
        """核心逻辑函数，与输入输出解耦"""
        # 实现算法逻辑
        return result


if __name__ == "__main__":
    sol = Solution()
    # 处理输入
    n = int(input())
    arr = list(map(int, input().split()))
    # 调用解法并输出
    print(sol.solve(arr))
```

**要点**：
- 逻辑函数与 I/O 分离，体现解耦思想
- 变量命名规范，不用单字母（除循环变量 `i, j`）
- 面试时先和面试官确认输入格式，再动手写

---

## 常见问题

| 问题 | 回答 |
|------|------|
| 撕不出来会直接挂吗？ | 综合评估。BG好+项目对口会放宽；通常有一次换题机会（换为更简单的 Easy 题） |
| 手撕是 ACM 还是核心代码模式？ | 线上是 ACM 模式（自行写+跑样例）；线下白板编程相对宽松 |
| 代码规范重要吗？ | 重要！面试官看重解耦+命名规范，代码不规范容易被 diss |
| 机试复盘是什么？ | 一面面试官拿到你机考代码，交流思路和设计。代码重复率高时必定出现 |

---

## 小结

1. **Top 3 必刷**：无重复字符最长子串（32次）、岛屿数量（31次）、有效的括号（22次）— 断层高频
2. **每道高频题准备双解**：追问换解法是华为面试文化。岛屿数量（DFS+BFS）、接雨水（双指针+单调栈）、反转链表（递归+迭代）、数组第K大（堆+快速选择）尤其要备双解
3. **Hot100 之外的补漏**：LC 451、LC 300、LC 93、LC 406 共 4 道题不在 Hot100，加上手写快排/单例 2 道原创题，需专门补一遍
4. **LRU 必须手写数据结构**：17 次排第 4，面试时会明确禁用内置 LinkedHashMap/OrderedDict，双向链表+哈希表需完整手写
5. **BFS/DFS 是华为最爱**：岛屿数量、腐烂的橘子、层序遍历、课程表反复出现
6. **栈类题高频**：有效的括号、字符串解码、每日温度、最小栈
7. **AI 岗额外准备 ML 手撕**：Self-Attention（18次）、MHA（15次）、KMeans（14次）是 Top 3
8. **ACM 模式 + 规范命名**：面试官看重代码质量，提前练好模板
