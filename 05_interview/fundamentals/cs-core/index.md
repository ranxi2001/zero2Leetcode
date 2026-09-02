---
layout: default
title: 计算机基础系统课
description: 面向转码与非科班读者的计算机组成原理、操作系统、计算机网络系统教程
eyebrow: 计算机基础系统课
permalink: /05_interview/fundamentals/cs-core/
---

# 计算机基础系统课

> 目标不是背完 408，而是建立一套能解释程序运行、系统性能和网络请求的知识模型，能够应对面试连续追问。

## 为什么需要系统课

八股题库擅长告诉你“面试会问什么”，但不能代替知识依赖：

```text
为什么需要虚拟内存？
  -> 虚拟地址怎样转换？
  -> TLB 在哪里？
  -> TLB miss 为什么不等于缺页？
  -> 缺页时 CPU 和内核分别做什么？
  -> malloc 成功是否已经占用物理内存？
```

如果只记住第一层定义，追问一变就容易失去逻辑。本课程先解释机制，再训练表达。

## 一条主线串起三门课

假设一个 Python 程序向 HTTPS 服务发送请求：

```text
Python 代码
  -> CPU 执行指令并访问 Cache / 内存
  -> 进程通过系统调用进入内核
  -> 内核使用 Socket、缓冲区和网卡
  -> 数据经过 TCP/IP、路由、TLS 和 HTTP
  -> 服务器返回响应
```

三门课分别回答：

| 课程 | 核心问题 |
|------|----------|
| 计算机组成原理 | 指令怎样执行，数据怎样在寄存器、Cache、内存和设备间移动 |
| 操作系统 | 多个程序怎样安全共享 CPU、内存、文件和 I/O 设备 |
| 计算机网络 | 数据怎样跨主机可靠传输并变成一次 HTTP 请求 |

## 推荐学习顺序

### 第一阶段：计算机组成原理

1. [导学：程序如何在硬件上运行](./computer-organization/index.html)
2. [数据表示、指令与程序执行](./computer-organization/01-data-and-instructions/index.html)
3. [CPU、流水线与性能](./computer-organization/02-cpu-pipeline-performance/index.html)
4. [存储层次、Cache 与局部性](./computer-organization/03-memory-cache/index.html)
5. [中断、DMA、多核与缓存一致性](./computer-organization/04-io-multicore/index.html)

### 第二阶段：操作系统

1. [导学：操作系统怎样管理程序](./operating-system/index.html)
2. [内核、系统调用、进程与线程](./operating-system/01-kernel-process-thread/index.html)
3. [调度、同步、锁与死锁](./operating-system/02-scheduling-concurrency/index.html)
4. [地址空间、分页、TLB 与缺页](./operating-system/03-virtual-memory/index.html)
5. [文件系统、I/O、epoll 与零拷贝](./operating-system/04-filesystem-io/index.html)
6. [Linux 观测与故障定位](./operating-system/05-linux-observability/index.html)

### 第三阶段：计算机网络

1. [导学：一次请求怎样到达服务器](./computer-network/index.html)
2. [分层、以太网、MAC 与 ARP](./computer-network/01-layers-link/index.html)
3. [IP、子网、路由、ICMP 与 NAT](./computer-network/02-ip-routing/index.html)
4. [UDP、TCP 与可靠传输](./computer-network/03-transport-tcp/index.html)
5. [DNS、HTTP、缓存与连接演进](./computer-network/04-dns-http/index.html)
6. [TLS、完整请求链路与网络排障](./computer-network/05-tls-debugging/index.html)

## 每篇课怎样学

所有章节尽量按同一结构组织：

1. **问题**：为什么需要这项机制。
2. **模型**：先画组件和数据流，不急着背术语。
3. **过程**：按时间顺序解释每一步。
4. **量化**：用地址、时延、吞吐或容量做一个计算。
5. **实验**：用系统工具看到真实现象。
6. **误区**：区分容易混淆的概念。
7. **面试表达**：30 秒结论和 2 分钟展开。
8. **追问树**：从定义追到实现与权衡。

## 三层掌握标准

### 第一层：能复述

知道名词定义和基本流程。例如能说出 TCP 三次握手。

### 第二层：能解释

知道为什么这样设计、替代方案有什么问题。例如能解释为什么两次握手不足。

### 第三层：能诊断

能把原理用于场景。例如连接建立慢时，知道区分 DNS、TCP、TLS、服务端排队和丢包重传。

面试追问通常在第二、第三层。

## 学习记录模板

每学一节，用自己的话填写：

| 项目 | 内容 |
|------|------|
| 它解决的问题 | 没有它会发生什么 |
| 核心状态 | 哪些表、队列、寄存器或字段在变化 |
| 主流程 | 按时间顺序写 5–8 步 |
| 关键权衡 | 时间、空间、吞吐、延迟、隔离或可靠性 |
| 可观察证据 | 什么命令、指标或抓包能看到 |
| 高频追问 | 面试官会从哪里继续问 |

## 不需要先学什么

这是面试向系统课，不要求先掌握：

- 卡诺图和复杂数字电路化简。
- 某一种汇编语言的完整语法。
- 408 考研中的大量公式型计算。
- Linux 内核全部源码实现。
- 网络协议每个字段的机械记忆。

但会讲清支撑操作系统、并发、性能和网络 I/O 的必要硬件与协议机制。

## 学完后的综合问题

你应该能沿一条因果链回答：

1. 程序从源码到进程经历什么。
2. 一次内存访问可能经过哪些缓存和地址转换。
3. 系统调用为什么需要进入内核，但不一定切换进程。
4. 页面为什么会缺页，TLB miss 为什么不是缺页。
5. 多线程为什么需要锁，锁最终依赖什么硬件能力。
6. Socket 写入的数据怎样到达网卡。
7. TCP 怎样同时处理可靠性、接收方速度和网络拥塞。
8. 输入 URL 后 DNS、TCP、TLS、HTTP 分别做什么。

## 系统课与题库的关系

学习顺序建议：

```text
系统课章节
  -> 文末理解检查
  -> 操作系统 / 网络速查题库
  -> 公司岗位八股
  -> 真实面经追问复盘
```

题库用于检验和复习，不再承担第一次讲清概念的职责。

---

[返回面试备战](../../index.html) | [开始学习：计算机组成原理 →](./computer-organization/index.html)
