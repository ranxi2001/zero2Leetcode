# 蓝皮书 PDF 编译

本目录参考 `zero2agent` 绿皮书的 Pandoc + XeLaTeX 链路，但不维护第二章和第三章的 Markdown 副本。编译时由 `prepare.py` 直接读取网站原始资料并在临时目录组装。

## 内容来源

| 章节 | 编译来源 |
|------|----------|
| 面试高频手撕 | `book/01_high_frequency_coding/0[1-6]-*.md` |
| 八股文 | `05_interview/fundamentals/*.md` |
| 大厂笔试真题 | `04_real_interviews/<company>/*.md` |
| 其他知识 | Python、数据结构、算法、测评、备考与 AI Coding 原文 |

## 编译命令

完整编译：

```bash
./publish-pdf/build.sh
```

只编译指定章节进行快速检查：

```bash
./publish-pdf/build.sh --chapters 1 --output bluebook-chapter-1-preview
./publish-pdf/build.sh --chapters 2,4 --output bluebook-knowledge-preview
```

最终 PDF 和构建日志写入 `output/pdf/`。暂存稿默认在构建结束后删除；调试时可增加 `--keep-staging`。

## 依赖

```bash
brew install pandoc poppler
brew install --cask mactex-no-gui font-inter font-tex-gyre-heros
```

构建分为三步：组装 Markdown、使用 Pandoc AST 检查公式与特殊字符、调用 XeLaTeX 生成 PDF。代码运行验证由本机 Python 环境单独完成，不依赖 LeetCode 在线判题。
