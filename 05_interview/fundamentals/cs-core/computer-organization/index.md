---
layout: default
title: 计算机组成原理导学
description: 从程序、指令、CPU、存储层次到 I/O 和多核的组成原理学习路线
eyebrow: 系统课 / 组成原理
permalink: /05_interview/fundamentals/cs-core/computer-organization/
---

# 计算机组成原理：程序怎样在硬件上运行

组成原理不是背 CPU 名词，而是回答：

```text
一行高级语言
  -> 机器指令
  -> CPU 取指、译码、执行
  -> 访问寄存器、Cache、内存
  -> 必要时与磁盘、网卡等设备交互
```

## 四个核心部件

| 部件 | 职责 |
|------|------|
| CPU | 执行指令、进行计算和控制 |
| 主存 | 保存当前运行程序和数据 |
| I/O 设备 | 与磁盘、网卡、键盘等外设交换数据 |
| 总线/互连 | 在部件之间传输地址、数据和控制信息 |

## 课程地图

1. [数据表示、指令与程序执行](./01-data-and-instructions/index.html)
2. [CPU、流水线与性能](./02-cpu-pipeline-performance/index.html)
3. [存储层次、Cache 与局部性](./03-memory-cache/index.html)
4. [中断、DMA、多核与缓存一致性](./04-io-multicore/index.html)

## 一条运行主线

执行 `total += values[index]` 时，至少涉及：

1. 程序计数器给出下一条指令地址。
2. CPU 取得并译码加载指令。
3. 地址生成单元计算 values[index] 的虚拟地址。
4. TLB/页表参与地址转换。
5. Cache 查找对应缓存行，未命中时访问更低层。
6. ALU 完成加法。
7. 结果写回寄存器或缓存。

高级语言的一行并不对应一次硬件动作。

## 面试中的典型连接

- 为什么数组通常比链表缓存友好？
- CPU 主频高为什么程序不一定更快？
- TLB miss 与 Cache miss 有什么关系？
- DMA 为什么能减少 CPU 搬运，但不能完全不需要 CPU？
- CAS 为什么能实现原子更新？
- 多核修改同一变量时，其他核心怎样看到新值？

这些问题会在操作系统的虚拟内存、锁和 I/O 中再次出现。

## 学习要求

每节都尝试回答：

- 数据当前在哪一层？
- 谁发起下一步动作？
- 状态保存在哪里？
- 发生 miss、冲突或异常后怎样恢复？
- 优化的是延迟、吞吐还是资源利用率？

---

[返回系统课总览](../index.html) | [第一课：数据表示与指令 →](./01-data-and-instructions/index.html)

