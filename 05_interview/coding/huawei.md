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
