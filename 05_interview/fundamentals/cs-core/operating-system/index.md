---
layout: default
title: 操作系统导学
description: 从内核、进程和虚拟内存到文件、I/O 与系统排障的学习路线
eyebrow: 系统课 / 操作系统
permalink: /05_interview/fundamentals/cs-core/operating-system/
---

# 操作系统：让多个程序安全共享硬件

组成原理解释硬件有什么能力，操作系统利用这些能力提供抽象、隔离和资源管理。

```text
应用程序看到：
进程、线程、虚拟内存、文件、Socket

内核管理：
CPU、物理内存、磁盘、网卡、权限和设备
```

## 操作系统的三个角色

### 抽象

- 把 CPU 时间抽象成线程可以持续执行。
- 把物理内存抽象成独立虚拟地址空间。
- 把磁盘块和设备抽象成文件与文件描述符。

### 隔离

一个进程默认不能随意读取另一个进程内存，也不能直接执行特权指令。

### 仲裁

多个程序竞争 CPU、内存和 I/O 时，内核决定谁先用、用多少、何时回收。

## 课程地图

1. [内核、系统调用、进程与线程](./01-kernel-process-thread/index.html)
2. [调度、同步、锁与死锁](./02-scheduling-concurrency/index.html)
3. [地址空间、分页、TLB 与缺页](./03-virtual-memory/index.html)
4. [文件系统、I/O、epoll 与零拷贝](./04-filesystem-io/index.html)
5. [Linux 观测与故障定位](./05-linux-observability/index.html)

## 一条主线

执行 `data = file.read()` 时：

1. 运行时准备参数并发起 read 系统调用。
2. CPU 从用户态进入内核态。
3. 内核根据文件描述符找到打开文件对象。
4. 先检查 page cache。
5. 若数据不在内存，文件系统和块层提交设备 I/O。
6. 设备可通过 DMA 把数据传入内存并触发完成通知。
7. 内核把结果交给进程，返回用户态。

一句代码跨越了语言运行时、系统调用、文件系统、内存和硬件设备。

## 面试中的关键连接

- 系统调用一定会切换进程吗？
- 进程与线程共享和独占什么？
- 锁竞争时线程在用户态还是内核态等待？
- malloc 返回地址后物理页是否已经存在？
- TLB miss、minor fault、major fault 有什么区别？
- read、mmap 和 sendfile 的数据路径怎样不同？
- epoll 为什么避免重复扫描，却不能让业务处理自动变快？

## 学习方式

每个机制都从四个角度理解：

1. 内核维护什么状态。
2. 谁触发状态变化。
3. 线程可能在哪些队列等待。
4. 哪些命令和指标能观察到。

---

[返回系统课总览](../index.html) | [第一课：内核、进程与线程 →](./01-kernel-process-thread/index.html)

