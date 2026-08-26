# Zero2Leetcode 蓝皮书

本目录用于蓝皮书的选题、编写、审校与出版，不直接改写网站原始资料。

PDF 出版命令与依赖说明见 [`publish-pdf/README.md`](../publish-pdf/README.md)。

## 全书结构

1. [面试高频手撕](01_high_frequency_coding/README.md)
2. 八股文：编译时读取 [`05_interview/fundamentals`](../05_interview/fundamentals)
3. 大厂笔试真题：编译时读取 [`04_real_interviews`](../04_real_interviews)
4. [其他知识](04_other/README.md)

## 编写原则

- 高频手撕与其他知识在本目录中独立整理。
- 八股文和大厂笔试真题由编译脚本直接解析网站原文，不在 `book` 中复制文档或建立文件系统软链接。
- 编译复用的章节只做选取与审校，不在书稿目录另建副本。
- 新编高频题解必须经过统一改写、代码验证和交叉审校后才能进入定稿。
- 不同统计样本的原始频次不能直接相加；其他公司数据主要用于优先级参考和补充新题。
- 书稿中的代码、复杂度、边界条件和样例必须相互一致。
