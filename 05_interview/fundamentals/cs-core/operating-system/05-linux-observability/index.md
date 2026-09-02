---
layout: default
title: Linux 观测与故障定位
description: 用 CPU、内存、I/O、系统调用和网络指标建立系统化排障路径
eyebrow: 操作系统 / 05
permalink: /05_interview/fundamentals/cs-core/operating-system/05-linux-observability/
---

# Linux 观测与故障定位

系统知识最终要能解释真实现象。排障不是背命令，而是根据症状建立假设，再用证据排除。

## 从四个问题开始

1. **影响是什么**：延迟、吞吐、错误率还是资源耗尽？
2. **范围多大**：单请求、单进程、单机、某机房还是全局？
3. **何时开始**：与发布、流量、配置、依赖变化是否相关？
4. **瓶颈在哪层**：CPU、内存、磁盘、网络、锁、下游还是业务逻辑？

先保留现场和时间线，再做可能改变现象的操作。

## USE 方法

对每种资源检查：

- Utilization：利用率。
- Saturation：是否有排队或等待。
- Errors：错误。

例如 CPU 不能只看使用率，还要看运行队列、steal、上下文切换和硬件错误。

## CPU

### 快速观察

```bash
uptime
top
mpstat -P ALL 1
pidstat -u -p <pid> 1
```

关注：

- user/system/iowait/steal。
- 每核是否均衡。
- load average 与可运行/不可中断任务。
- 进程和线程 CPU。

load average 不是纯 CPU 使用率，它通常包含可运行和不可中断等待任务。

### 找热点

```bash
perf top
perf record -g -p <pid> -- sleep 30
perf report
```

高 CPU 可能来自：

- 正常计算热点。
- 无限循环。
- 锁自旋。
- 频繁系统调用。
- GC。
- 序列化或压缩。

## 上下文切换与调度

```bash
vmstat 1
pidstat -w -p <pid> 1
ps -eLo pid,tid,psr,stat,pcpu,comm
```

线程太多可能增加：

- 上下文切换。
- 运行队列。
- 栈内存。
- 锁竞争。
- Cache 扰动。

不要只因为“CPU 没满”就继续加线程。

## 内存

```bash
free -h
vmstat 1
cat /proc/meminfo
pmap -x <pid>
cat /proc/<pid>/smaps
```

需要区分：

- 虚拟地址空间 VSZ。
- 驻留物理页 RSS。
- 匿名内存。
- 文件映射和共享页。
- page cache。
- Swap 与换入换出。

Linux 的 free 很小不一定内存不足，available 和可回收缓存更有意义。

### 内存问题模式

- RSS 持续增长：泄漏、缓存无界、工作集增长。
- major fault 增多：频繁从存储调页。
- swap in/out 持续：内存压力和抖动。
- OOM kill：查看内核日志和 cgroup 限制。

容器内存限制与宿主机总内存是不同边界。

## 磁盘与文件 I/O

```bash
iostat -xz 1
pidstat -d -p <pid> 1
iotop
lsof -p <pid>
df -h
df -i
```

关注：

- 吞吐和 IOPS。
- 平均/尾延迟。
- 队列深度。
- 设备利用率。
- 文件系统空间与 inode。

高 iowait 表示 CPU 有时间在等待 I/O 的任务，但解释需结合运行队列和设备指标。

## 系统调用

```bash
strace -c -p <pid>
strace -ttT -f -p <pid>
```

- `-c` 汇总次数和耗时。
- `-T` 显示单次调用时间。
- `-f` 跟踪线程/子进程。

strace 有开销，生产环境需控制时间和范围。

典型发现：

- 小块 read/write 过多。
- 重复 open/stat。
- 锁等待 futex。
- DNS 或网络 connect 超时。
- epoll_wait 与业务处理比例异常。

## 文件描述符

```bash
ls /proc/<pid>/fd | wc -l
cat /proc/<pid>/limits
lsof -p <pid>
```

fd 持续增长可能是文件、Socket、pipe 或 eventfd 泄漏。达到上限会出现 too many open files。

## 网络相关系统视角

```bash
ss -s
ss -tanp
ip -s link
ethtool -S <interface>
```

关注连接状态、listen/accept 队列、重传、丢包和网卡错误。完整网络排障在网络课程展开。

## 日志和时间线

```bash
journalctl --since "10 minutes ago"
dmesg -T
```

检查：

- OOM。
- 磁盘/文件系统错误。
- 网卡 link reset。
- 进程崩溃。
- 内核限流或 cgroup 事件。

所有节点时钟需要同步，否则跨服务时间线会误导。

## 一个“接口突然变慢”的排查顺序

1. 看监控确认延迟分位数、错误率、流量变化。
2. 判断单实例还是全局，是否与发布重合。
3. 看 CPU、load、运行队列、GC 和线程。
4. 看内存、fault、Swap、OOM。
5. 看磁盘延迟、队列和空间。
6. 看连接池、下游依赖、DNS、重传。
7. 用 profile、trace 或 strace 定位具体等待。
8. 做单变量对照实验验证假设。

不要一上来重启；重启可能清除最有价值的现场。

## 观测的边界

- 平均值会掩盖尾延迟。
- 高相关不等于因果。
- 工具本身有采样和探针开销。
- 容器指标、进程指标、宿主机指标口径不同。
- 单次快照无法解释趋势。

## 常见误区

- load average 高不等于 CPU 一定已满。
- free 很少不等于可用内存已经耗尽，应结合 available 和回收能力。
- iowait 高只能说明存在等待 I/O 的 CPU 时间，不能单独定位具体设备或进程。
- 单个时间点的 top 截图不能代替趋势和对照实验。
- 看到相关指标同时变化不能直接认定因果关系。
- 重启可能暂时恢复服务，也可能清除泄漏、队列和锁竞争等关键现场。

## 面试表达

**Linux 服务 CPU 很高怎样排查？**

> 先确认影响范围、流量和发布时间，再区分 user、system、iowait、steal 以及是否单核热点；用 pidstat/top 找进程线程，用 perf/profile 定位热点函数，同时看上下文切换、锁竞争、GC 和系统调用。最后用相同负载复现并验证优化，不能只凭 top 直接下结论。

**追问链**

1. load 很高但 CPU 不高可能是什么？
2. free 很少为什么不一定内存不足？
3. RSS 与 VSZ 有什么区别？
4. iowait 高说明什么，不能说明什么？
5. strace 和 perf 分别观察什么？
6. fd 泄漏怎样确认？

## 实战练习

1. 启动一个 CPU 密集程序，用 top、pidstat、perf 建立证据链。
2. 分配并触碰大块内存，观察 VSZ、RSS 和 page fault。
3. 创建大量小文件读写，观察 iostat 与系统调用。
4. 打开大量 Socket 后观察 fd 与 ss。

---

[上一课：文件系统与 I/O](../04-filesystem-io/index.html) | [下一门：计算机网络 →](../../computer-network/index.html)
