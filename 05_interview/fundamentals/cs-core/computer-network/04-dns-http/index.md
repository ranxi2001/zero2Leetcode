---
layout: default
title: DNS、HTTP、缓存与连接演进
description: 理解 DNS 解析、CDN、HTTP 语义、缓存、Cookie 及 HTTP 1/2/3
eyebrow: 计算机网络 / 04
permalink: /05_interview/fundamentals/cs-core/computer-network/04-dns-http/
---

# DNS、HTTP、缓存与连接演进

## DNS 解决什么问题

应用使用域名，人和服务不应依赖固定 IP。DNS 是分层、分布式命名系统，把域名解析为地址或其他记录。

常见记录：

- A：IPv4 地址。
- AAAA：IPv6 地址。
- CNAME：别名。
- MX：邮件服务器。
- TXT：文本验证和策略。
- NS：权威服务器。

## 解析过程

简化：

```text
应用/浏览器缓存
  -> 操作系统缓存与 hosts
  -> 递归解析器
       -> 根服务器
       -> 顶级域服务器
       -> 权威 DNS
  -> 缓存结果并返回
```

客户端通常向递归解析器发起递归请求；解析器代表客户端执行迭代查询。

实际还可能有本地代理、企业 DNS、DoH/DoT 和多级缓存。

## TTL 与缓存

DNS 记录 TTL 指示缓存时长。权衡：

- TTL 长：查询少、切换生效慢。
- TTL 短：切换更快、查询压力和依赖更高。

缓存不是保证严格在某时刻同时过期，递归器和客户端实现会影响观察。

## DNS 使用 UDP 还是 TCP

传统 DNS 常先用 UDP 53，响应截断、区域传送或其他需要时使用 TCP。现代还可能使用 DoT、DoH，或基于新传输。

不要回答“DNS 只使用 UDP”。

## CDN

CDN 把内容和计算部署到靠近用户的边缘节点。调度可能结合：

- DNS。
- Anycast。
- 用户网络和地理位置。
- 节点健康与负载。
- 内容缓存状态。

CDN 缓存命中能减少回源延迟与带宽；动态请求仍可能回源或在边缘执行。

## HTTP 是应用层协议

HTTP 定义请求与响应语义：

```text
请求：
method path version
headers

body

响应：
version status
headers

body
```

HTTP 可运行在 TCP+TLS 或 QUIC+TLS 等传输之上。

## 方法语义

| 方法 | 常见语义 | Safe | Idempotent |
|------|----------|------|------------|
| GET | 获取表示 | 是 | 是 |
| HEAD | 只取响应元数据 | 是 | 是 |
| POST | 提交处理/创建子资源 | 否 | 通常否 |
| PUT | 用完整表示创建或替换目标 | 否 | 是 |
| PATCH | 部分修改 | 否 | 不一定 |
| DELETE | 删除目标 | 否 | 语义上是 |

幂等表示执行一次或多次的预期资源效果相同，不代表每次响应码、日志和副作用完全相同。

GET 参数在 URL、POST body 不在地址栏，不构成安全边界；两者都应使用 HTTPS 保护传输。

## 状态码按职责理解

- 1xx：过程信息。
- 2xx：请求成功处理。
- 3xx：重定向或缓存协商。
- 4xx：客户端请求、认证或权限问题。
- 5xx：服务端处理或上游问题。

典型区别：

- 401：缺少/无效认证。
- 403：服务器理解身份但拒绝权限。
- 404：资源不可见或不存在。
- 429：请求过多。
- 502：网关从上游得到无效响应。
- 503：暂不可用。
- 504：网关等待上游超时。

## HTTP 缓存

### 新鲜度

`Cache-Control: max-age` 等指示响应在一定时间内可直接复用。

### 条件请求

缓存过期后可带：

- If-None-Match / ETag。
- If-Modified-Since / Last-Modified。

服务器确认未改变时返回 304，无需传完整 body。

### 缓存键与 Vary

不同请求头可能得到不同表示。`Vary` 告诉缓存哪些请求头参与区分。

错误缓存可能泄漏用户数据，认证响应和共享缓存需谨慎。

## Cookie 与 Session

Cookie 是浏览器按域、路径等规则保存并随请求发送的小数据。

常见属性：

- Secure：只通过安全连接发送。
- HttpOnly：JavaScript 不可读取。
- SameSite：限制跨站发送。
- Max-Age/Expires。

Session 通常指服务端会话状态，Cookie 可保存 session id。两者不是互斥概念。

分布式部署需考虑 session 共享、粘性路由或无状态 token 的权衡。

## HTTP/1.1

主要能力：

- 持久连接。
- Host 支持虚拟主机。
- 分块传输。
- 缓存控制。

可使用流水线，但浏览器支持和队头阻塞限制使其实际使用有限；通常通过多个 TCP 连接提高并发。

## HTTP/2

- 二进制帧。
- 一个连接上多路复用多个 stream。
- HPACK 头部压缩。
- stream 优先级/流控等机制。

它解决应用层请求串行问题，但多个 stream 仍共享一个 TCP 字节流；底层丢包恢复期间可能影响连接上的多个 stream。

## HTTP/3

HTTP/3 基于 QUIC（通常承载于 UDP）：

- 传输层提供独立 stream。
- TLS 1.3 集成。
- 连接迁移。
- 用户态更易演进。

某个 stream 丢包通常不会像 TCP 字节流那样阻塞其他已完整 stream，但共享拥塞控制和网络资源仍会互相影响。

## Keep-Alive 的两个含义

- HTTP persistent connection：多个 HTTP 请求复用连接。
- TCP keepalive：内核在长时间空闲后探测连接是否还活着。

目的、配置和时间尺度不同。

## 动手观察

```bash
dig example.com
dig +trace example.com
curl -v https://example.com/
curl -I https://example.com/
curl --http2 -I https://example.com/
```

观察 DNS 记录、响应头、缓存字段、连接复用和协议版本。

## 常见误区

- DNS 不只使用 UDP。
- POST 不因参数在 body 就更安全。
- HTTP 幂等不等于每次响应完全相同。
- Cookie 在客户端，Session 状态通常在服务端，两者可配合。
- HTTP/2 多路复用没有消除 TCP 层丢包影响。
- CDN 不只是“复制静态文件”，也包含调度、回源和边缘能力。

## 面试表达

**HTTP/1.1、HTTP/2、HTTP/3 怎样演进？**

> HTTP/1.1 通过持久连接等改进复用，但并发常依赖多连接；HTTP/2 用二进制帧和 stream 在单 TCP 连接多路复用，并压缩头部，但仍受 TCP 连接级丢包恢复影响；HTTP/3 基于 QUIC，把 stream、TLS 1.3 和连接迁移整合到用户态传输，减少跨 stream 队头阻塞并便于演进。

**追问链**

1. 递归 DNS 和迭代查询分别是谁做？
2. TTL 长短怎样权衡？
3. 304 与 200 from cache 有什么差异？
4. 幂等与重试有什么关系？
5. HTTP keep-alive 与 TCP keepalive 有什么区别？

## 理解检查

1. 画出递归解析器查询权威 DNS 的过程。
2. 判断一组方法的 safe/idempotent 属性。
3. 设计带 ETag 的条件请求。
4. 解释 HTTP/2 stream 与 TCP 字节流的关系。

---

[上一课：UDP 与 TCP](../03-transport-tcp/index.html) | [下一课：TLS 与排障 →](../05-tls-debugging/index.html)

