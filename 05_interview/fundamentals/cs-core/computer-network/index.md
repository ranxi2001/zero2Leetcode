---
layout: default
title: 计算机网络导学
description: 从网卡、交换与路由到 TCP、DNS、HTTP、TLS 的系统学习路线
eyebrow: 系统课 / 计算机网络
permalink: /05_interview/fundamentals/cs-core/computer-network/
---

# 计算机网络：一次请求怎样到达服务器

网络把不同主机上的进程连接起来。学习主线不是从协议名词出发，而是追踪一个应用字节怎样跨层封装、转发、确认并还原。

```text
应用数据
  -> Socket
  -> TCP/UDP
  -> IP
  -> Ethernet/Wi-Fi
  -> 路由器与链路
  -> 对端逐层解封装
```

## 课程地图

1. [分层、以太网、MAC 与 ARP](./01-layers-link/index.html)
2. [IP、子网、路由、ICMP 与 NAT](./02-ip-routing/index.html)
3. [UDP、TCP 与可靠传输](./03-transport-tcp/index.html)
4. [DNS、HTTP、缓存与连接演进](./04-dns-http/index.html)
5. [TLS、完整请求链路与网络排障](./05-tls-debugging/index.html)

## 一次 HTTPS 请求的阶段

```text
解析 URL
  -> DNS 得到目标 IP
  -> 查询路由和下一跳
  -> ARP/邻居发现得到链路地址
  -> 建立 TCP 或 QUIC 连接
  -> TLS 认证并协商密钥
  -> 发送 HTTP 请求
  -> 服务端处理并响应
  -> 客户端缓存、解析和展示
```

每一步都可能产生独立延迟和故障。

## 分层的价值

- 应用不必关心每种网卡如何发信号。
- TCP 可以运行在多种 IP 链路之上。
- IP 可以承载 TCP、UDP、ICMP 等上层协议。
- 每层只承诺自己的职责，便于演进和替换。

分层是模型，不代表系统实现严格按教科书函数一层层复制数据；卸载、内核合并和硬件加速会优化实际路径。

## 面试中的关键连接

- DNS 使用 UDP 还是 TCP？
- TCP 可靠，为什么应用仍可能重复处理请求？
- 流量控制和拥塞控制分别保护谁？
- HTTP/2 多路复用为什么仍受 TCP 丢包影响？
- HTTPS 加密后代理和 CDN 怎样工作？
- ping 通为什么不代表端口可访问？
- connect 慢要怎样区分路由、丢包、队列和服务端问题？

---

[返回系统课总览](../index.html) | [第一课：分层与链路 →](./01-layers-link/index.html)

