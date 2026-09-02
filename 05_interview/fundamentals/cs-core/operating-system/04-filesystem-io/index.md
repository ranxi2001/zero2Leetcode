---
layout: default
title: 文件系统、I/O、epoll 与零拷贝
description: 理解文件描述符、inode、page cache、同步语义、I/O 模型、epoll 和零拷贝
eyebrow: 操作系统 / 04
permalink: /05_interview/fundamentals/cs-core/operating-system/04-filesystem-io/
---

# 文件系统、I/O、epoll 与零拷贝

## 一切皆文件的边界

Unix 用文件描述符统一表示很多内核对象：

- 普通文件。
- 目录。
- 管道。
- Socket。
- 设备。
- epoll 实例。

这不表示它们内部实现完全相同，而是共享 read/write/close 等接口抽象。

## 文件描述符

文件描述符是进程内的小整数索引。

```text
进程 fd 表
0 -> 标准输入
1 -> 标准输出
2 -> 标准错误
3 -> 打开文件对象 -> inode / socket
```

多个 fd 可以指向同一个打开文件对象，并可能共享文件偏移；fork、dup 的语义需要具体分析。

## 路径解析与 inode

简化路径：

```text
/home/user/data.txt
  -> 从根目录开始查目录项
  -> 找到 home inode
  -> 找到 user inode
  -> 找到 data.txt inode
  -> 检查权限并创建打开文件对象
```

- 目录项把名称映射到 inode。
- inode 保存文件类型、权限、大小、时间和数据块位置等元数据。
- 文件名主要存在目录项中，不是 inode 的唯一名称。

## 硬链接与软链接

### 硬链接

另一个目录项指向同一 inode。删除一个名称，只减少链接计数；还有链接或打开引用时数据不一定立即释放。

### 软链接

独立文件，内容是另一个路径。目标删除后可能成为悬空链接，可以跨文件系统。

## page cache

普通文件 read 通常先经过 page cache：

```text
read(fd)
  -> page cache hit：从内存提供
  -> miss：提交存储 I/O，数据进入 page cache
  -> 复制/映射给用户
```

page cache：

- 加速重复读。
- 合并和延迟写。
- 让文件 I/O 与虚拟内存共享页面机制。

应用缓存、数据库 buffer pool 与 page cache 可能形成双重缓存，需要结合访问和持久化语义设计。

## write 不等于已经落盘

write 成功通常表示数据已进入内核可管理缓冲/缓存，不保证介质已经持久化。

可能涉及：

- 脏页延迟写回。
- 文件系统日志。
- 设备写缓存。
- fsync/fdatasync。
- 存储设备自己的持久化保证。

数据库 WAL 的正确性依赖明确理解刷盘和顺序约束。

## 日志文件系统

崩溃可能发生在多步元数据更新之间。日志先记录事务意图或变更，恢复时重放或回滚，避免结构处于任意半完成状态。

日志不自动保证每个应用数据都已按业务期望持久化，仍需正确使用 fsync、原子重命名等协议。

## 阻塞与非阻塞

- 阻塞：操作不能立即完成时，调用线程睡眠等待。
- 非阻塞：不能立即完成就返回 EAGAIN/EWOULDBLOCK。

非阻塞不等于异步。调用者可能仍需要循环等待事件并主动再次 read/write。

## 同步与异步

常用区分：

- 同步 I/O：调用方参与等待或再次发起完成操作。
- 异步 I/O：提交请求后，完成由系统通过回调、完成队列等通知。

术语在不同 API/语境可能略有差异，回答时明确“等待数据就绪”和“数据复制完成”由谁负责。

## select、poll、epoll

### select

- 用位图传递关注 fd。
- fd 数量有实现限制。
- 每次调用复制和扫描集合。

### poll

- 使用 fd 数组，取消位图上限问题。
- 仍需每次传递并线性扫描。

### epoll

- interest list 保存在内核。
- 注册关注事件，等待时主要返回 ready 事件。
- 避免每次把全部 fd 集合传入并扫描。

epoll 的优势在“大量连接、少量活跃”场景明显；如果所有连接都活跃，仍要处理所有事件。

## Level Trigger 与 Edge Trigger

- LT：只要仍满足条件，后续 wait 还会报告。
- ET：状态从未就绪变为就绪时通知，通常要把数据读到 EAGAIN。

ET 不是必然更快；实现错误容易漏处理。LT 更容易写正确。

## 惊群

多个线程/进程等待同一事件时，全部被唤醒但只有一个获得工作，会造成无效调度和竞争。

内核和服务器框架通过 exclusive wakeup、reuseport、任务分发等方式缓解，具体取决于模型。

## 零拷贝

传统文件发送概念路径：

```text
磁盘 -> page cache
page cache -> 用户缓冲区
用户缓冲区 -> socket 内核缓冲区
socket -> 网卡
```

sendfile 等机制可避免数据往返用户空间：

```text
文件/page cache -> socket/网卡路径
```

“零拷贝”通常表示减少 CPU 参与的内存复制和上下文切换，不代表：

- 没有任何数据移动。
- 不需要 DMA。
- 没有系统调用。
- 适合所有需要应用修改数据的场景。

## mmap、sendfile 与 read/write

| 方式 | 适合 |
|------|------|
| read/write | 应用需要解析或修改数据，接口通用 |
| mmap | 随机访问、共享、按需映射 |
| sendfile | 文件内容直接发送到 Socket |

选择要看数据是否需要进入用户逻辑、访问模式、文件大小和平台实现。

## Direct I/O

部分场景绕过 page cache，让应用自己管理缓存与对齐。数据库可能使用，但会增加：

- 对齐要求。
- 缓存管理复杂度。
- 小 I/O 成本。

不是“绕过一层一定更快”。

## 动手观察

```bash
lsof -p <pid>
ls -l /proc/<pid>/fd
strace -e trace=openat,read,write,fsync ./program
cat /proc/meminfo
```

网络服务还可观察：

```bash
strace -e trace=epoll_wait,accept,recvfrom,sendto -p <pid>
```

## 常见误区

- fd 是进程内索引，不是 inode。
- write 返回不等于数据已持久化。
- 非阻塞不等于异步。
- epoll 不会让业务处理本身变快。
- ET 必须正确排空数据，不能只读一次。
- 零拷贝不是零数据移动。

## 面试表达

**epoll 为什么适合大量连接？**

> epoll 把关注集合保存在内核，注册和等待分离，wait 主要返回已就绪事件，避免 select/poll 每次复制并线性扫描全部 fd。在大量连接但少量活跃时能显著减少无效工作；如果所有连接都活跃，应用仍要处理全部事件。

**追问链**

1. fd、打开文件对象和 inode 什么关系？
2. write 与 fsync 的语义差异是什么？
3. LT 与 ET 怎样选择？
4. 非阻塞和异步 I/O 有什么区别？
5. sendfile 减少了哪些复制？
6. page cache 与数据库 buffer pool 为什么可能冲突？

## 理解检查

1. 画出 open 到 inode 的简化路径。
2. 解释硬链接删除后文件为何可能仍存在。
3. 对比 select、poll、epoll 的集合管理方式。
4. 画出传统发送和 sendfile 数据路径。

---

[上一课：虚拟内存](../03-virtual-memory/index.html) | [下一课：Linux 故障定位 →](../05-linux-observability/index.html)

