---
layout: default
title: 存储层次、Cache 与局部性
description: 理解寄存器到磁盘的层次、缓存行、映射、命中、写策略和 TLB
eyebrow: 组成原理 / 03
permalink: /05_interview/fundamentals/cs-core/computer-organization/03-memory-cache/
---

# 存储层次、Cache 与局部性

## 为什么需要层次结构

理想存储器希望同时做到：

- 容量大。
- 延迟低。
- 带宽高。
- 成本低。
- 断电不丢失。

现实中无法全部满足，于是形成层次：

```text
快、小、贵
寄存器
L1 Cache
L2 Cache
L3 Cache
主存 DRAM
SSD
HDD / 远端存储
慢、大、便宜
```

上层缓存下层近期可能使用的数据。

## 局部性原理

### 时间局部性

最近访问的数据可能很快再次访问，例如循环计数器、热点对象。

### 空间局部性

访问某地址后，附近地址可能很快被访问，例如顺序遍历数组。

### 为什么数组通常比链表缓存友好

数组元素连续，加载一个缓存行会带来多个后续元素。链表节点可能分散，next 还形成必须等待前一步结果的指针依赖。

复杂度同为 O(n)，实际常数可能差很多。

## Cache 以缓存行为单位

CPU 不是只加载一个 int，而是加载一整条 cache line，常见大小如 64 byte。

若 int 为 4 byte，一条 64-byte 缓存行可容纳 16 个连续 int。

这解释了：

- 顺序扫描为什么快。
- 矩阵按行或按列遍历为何可能不同。
- false sharing 为什么发生在不同变量上。

具体缓存行大小由平台决定，不应写死为所有机器都相同。

## 地址怎样查 Cache

可把地址概念上分成：

```text
Tag | Set Index | Block Offset
```

- Offset：定位缓存行内的字节。
- Set Index：选择哪一组。
- Tag：判断这一行是不是目标内存块。

### 三种映射

| 映射 | 一个内存块能放哪里 | 特点 |
|------|-------------------|------|
| 直接映射 | 固定一个位置 | 简单，但冲突多 |
| 全相联 | 任意位置 | 冲突少，硬件查找复杂 |
| 组相联 | 固定组内任意路 | 常见折中 |

现代 CPU Cache 多使用组相联。

## Cache 命中与未命中

- Hit：目标缓存行在当前层，直接读取。
- Miss：当前层没有，要访问下一层并填充。

常见 miss 原因：

1. Compulsory：第一次访问。
2. Capacity：工作集超过容量。
3. Conflict：多个块竞争同一组。

多核还可能因一致性失效产生额外 miss。

## 平均访存时间

简化公式：

```text
AMAT = 命中时间 + miss rate × miss penalty
```

示例：

- L1 命中 1 ns。
- miss rate 5%。
- miss 额外代价 50 ns。

```text
AMAT = 1 + 0.05 × 50 = 3.5 ns
```

很小的 miss rate 也可能显著影响平均时间。

## 替换策略

一组满后需要选择淘汰项。理论上常讨论：

- LRU：淘汰最久未使用。
- FIFO：淘汰最早进入。
- Random：随机淘汰。
- 近似 LRU：用较少硬件状态逼近。

真实硬件往往使用近似策略，不能简单等同软件 LRU Cache。

## 写策略

### Write-through

写 Cache 时同时写下一层。逻辑简单，但写流量较大。

### Write-back

只修改 Cache 并标记 dirty，淘汰时才写回。减少写流量，但状态更复杂。

### Write-allocate

写 miss 时先把缓存行读入 Cache 再修改。

### No-write-allocate

写 miss 直接写下一层，不填充 Cache。

常见组合与工作负载和层级设计有关。

## 矩阵遍历示例

行优先存储语言中：

```python
for row in range(rows):
    for col in range(cols):
        total += matrix[row][col]
```

通常比交换循环顺序更符合空间局部性。Python 列表的内存模型与 C 连续二维数组不同，但“顺序访问、减少随机跳转”的原则仍成立。

## Cache 与 TLB 不一样

- Cache 缓存内存中的数据或指令。
- TLB 缓存虚拟页到物理页的地址翻译。

一次内存访问可能同时经历：

```text
虚拟地址
  -> TLB 查地址翻译
  -> 得到物理地址
  -> Cache 查数据
```

TLB miss 可能通过页表遍历得到有效映射；Page Fault 表示当前页表状态无法完成访问，需要操作系统处理。两者不能等同。

虚拟内存会在操作系统课程展开。

## 预取

硬件预取器尝试识别顺序或固定步长访问，提前加载缓存行。软件也可在部分平台给出预取提示。

预取过多会：

- 占用带宽。
- 污染 Cache。
- 加载不会使用的数据。

## 动手实验

可比较顺序访问和随机访问大数组：

1. 创建超过 L3 容量的数据。
2. 顺序求和并计时。
3. 打乱下标后按随机顺序求和。
4. 使用 `perf stat` 比较 cache-misses。

应多次运行、预热，并避免把随机数生成时间算入遍历。

## 常见误区

- Cache 不是 Python/Redis 那种业务缓存，但共享“以额外空间换访问速度”的思想。
- L1/L2/L3 不保证每层严格包含上一层，具体看架构。
- Cache miss 不等于 Page Fault。
- 大 O 相同不代表缓存行为相同。
- 缓存行带来空间局部性，也可能带来 false sharing。

## 面试表达

**为什么数组遍历通常比链表快？**

> 数组连续，顺序访问能充分利用缓存行、硬件预取和较少的地址依赖；链表节点可能分散，每一步要先取到 next 才知道下一地址，容易产生 Cache/TLB miss 和串行等待。两者遍历复杂度都是 O(n)，但微架构成本不同。

**追问链**

1. Cache line 是什么？
2. 直接映射和组相联有什么差异？
3. write-through 与 write-back 如何权衡？
4. TLB 和 Cache 分别缓存什么？
5. 工作集超过 Cache 后会发生什么？

## 理解检查

1. 解释时间与空间局部性。
2. 使用 AMAT 计算一个两层简化例子。
3. 解释 tag、set 和 offset。
4. 说明 TLB miss 与 Cache miss 可以怎样同时发生。

---

[上一课：CPU 与流水线](../02-cpu-pipeline-performance/index.html) | [下一课：I/O 与多核 →](../04-io-multicore/index.html)

