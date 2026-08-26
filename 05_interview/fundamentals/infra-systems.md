---
layout: default
title: AI Infra 系统面试八股文：云计算、训推系统、分布式系统与 Agent Runtime
description: 面向 AI Infra、机器学习平台和 Agent 基础设施岗位的系统面试题，覆盖 OS 与网络底座、云计算、训练与推理、分布式系统、Agent Runtime、安全沙箱和故障排查
keyconcepts: [AI Infra, Cloud Computing, Training System, Inference System, Distributed System, Agent Runtime, Sandbox]
eyebrow: 八股文 / AI Infra 系统
permalink: /05_interview/fundamentals/infra-systems/
---

# AI Infra 系统面试八股文

> 适用岗位：云计算基础设施、AI Infra、机器学习平台、训练调度、模型推理、Agent Runtime 与 Sandbox。面试时先给结论，再讲机制，最后补边界、取舍和故障定位。

## 复习优先级

| 优先级 | 主题 | 目标 |
|---|---|---|
| P0 | OS、内存、TCP、云计算基础 | 能从应用一路讲到内核、网络和云资源 |
| P1 | 容器、Kubernetes、训推系统 | 能解释资源如何被隔离、调度和高效使用 |
| P1 | Agent Runtime 与 Sandbox | 能设计可靠执行链路和不可信代码边界 |
| P2 | 分布式正确性 | 能处理重试、幂等、一致性、选主和过载 |

建议把整条知识链记成：

    Application / Agent
            ↓
    User Mode / Kernel Mode
            ↓
    Virtual Memory / TCP / Storage
            ↓
    VM / namespace / cgroup / Sandbox
            ↓
    Cloud Control Plane / Kubernetes
            ↓
    Training Scheduler / Model Serving
            ↓
    GPU / RDMA / Distributed System

本文是总纲。Kubernetes、Volcano、GPU、推理与 Sandbox 的组件级追问，继续看 [Kubernetes 与 Agent 基础设施专题]({{ site.baseurl }}/05_interview/fundamentals/kubernetes-agent-infra/)。

---

## 一、P0 系统底座：OS、内存与 TCP

### Q1：为什么要区分用户态和内核态？

**30 秒回答**：内核管理物理内存、页表、设备和调度器等全局资源，不能让普通应用任意修改。CPU 用不同特权级执行代码，应用在用户态运行，需要文件、网络、进程或内存映射服务时，通过受控入口进入内核。核心目的就是安全隔离、资源仲裁和稳定的系统接口。

**继续追问**：进入内核主要由系统调用、同步异常和硬件中断触发。进入内核不一定切换进程，同一个线程可以先执行用户代码，再在自己的内核上下文中处理系统调用。

**易错点**：用户态/内核态切换不等于进程上下文切换；后者还涉及调度实体、寄存器、内核栈和可能的地址空间切换。

---

### Q2：一次系统调用发生了什么？

**30 秒回答**：用户代码通常先调用 libc 包装函数，包装函数准备系统调用号和参数，再执行体系结构规定的陷入指令。CPU 切换特权级并进入内核入口，内核保存必要上下文、校验参数和权限、分派到对应处理函数，完成后恢复现场并返回用户态。

**继续追问**：普通函数调用只在同一特权级内跳转；系统调用跨越保护边界。系统调用处理中如果阻塞或时间片耗尽，调度器可能切到另一个线程，此时才额外发生上下文切换。

**易错点**：不要把所有系统调用都说成一定很慢。是否阻塞、是否复制数据、是否命中缓存以及是否发生调度，往往比单次特权级切换更重要。

---

### Q3：为什么需要虚拟内存？

**30 秒回答**：虚拟内存为每个进程提供独立地址空间，通过页表映射到物理页。它同时提供进程隔离、连续地址抽象、按需分配、页面保护以及共享能力；Swap 只是内存压力下的一种可选后备机制，不是虚拟内存存在的唯一原因。

**继续追问**：共享库、文件映射和共享内存可以让不同虚拟地址指向同一物理页；只读、可执行和用户/内核权限位则由页表映射参与实施。

**易错点**：虚拟地址空间很大不代表物理内存已分配，也不代表内存承诺一定能在未来兑现。

---

### Q4：虚拟地址如何变成物理地址？

**30 秒回答**：CPU 先用虚拟页号查询 TLB。命中后得到物理页号并加上页内偏移；未命中时由硬件或软件执行页表遍历。若页表项有效，映射会被缓存到 TLB；若映射不存在、权限不符或页面不在内存，则触发缺页异常，由内核处理。

    Virtual Address
          ↓
         TLB
       ↙ hit  ↘ miss
    Physical   Page Table Walk
                   ↓
             mapping / fault

**继续追问**：多级页表节省稀疏地址空间的页表内存，TLB 缓存近期地址转换以避免每次数据访问前再做多次内存访问。TLB miss 不等于 Page Fault。

---

### Q5：什么是 Page Fault？

**30 秒回答**：CPU 发现当前访问无法由现有页表项完成时，会陷入内核。合法场景包括匿名页首次写入、文件映射首次访问、页面被换出和 Copy-On-Write；内核准备物理页、读入数据或复制页面、更新页表后，通常重新执行原指令。非法地址或权限错误则可能向进程发送 SIGSEGV。

**继续追问**：不需要磁盘 I/O 的通常称 minor fault，需要从存储读入页面的通常称 major fault。Page Fault 是正常的按需分页机制，但大量 major fault 会显著增加尾延迟。

---

### Q6：malloc 1 GB 会立刻占用 1 GB 物理内存吗？

**30 秒回答**：通常不会。内存分配器可能通过已有 arena、brk 或 mmap 获得一段虚拟地址，物理页往往在首次读写时按页建立。Linux 的 overcommit、透明大页、锁页和分配器实现会改变细节，因此要分别观察虚拟地址规模、RSS、匿名页和提交量。

**继续追问**：只申请不触碰时 VSZ 可能增加而 RSS 增长很小；逐页写入后 RSS 才明显上升。申请成功也不保证未来每个页面都能成功兑现。

**易错点**：不要把 malloc 简化成“只分配虚拟内存”。小对象可能直接来自已经驻留的 allocator arena，释放也不一定立刻归还操作系统。

---

### Q7：mmap 和 Page Cache 是什么关系？

**30 秒回答**：mmap 把文件或匿名对象映射进进程虚拟地址空间。文件映射首次访问时可通过缺页把 Page Cache 中的文件页映射进来；普通 read/write 也通常经过 Page Cache，所以 mmap 的价值不是简单地“永远零拷贝”，而是用地址访问替代显式读写并减少部分复制和系统调用。

**继续追问**：MAP_SHARED 的修改可对其他映射者可见并最终回写文件；MAP_PRIVATE 的写入通常通过 Copy-On-Write 形成私有页。脏页回写、fsync 和持久化保证是不同层次的问题。

---

### Q8：Linux 内存不足时会怎样？

**30 秒回答**：内核会在后台或分配路径上回收可回收页面，例如文件页和部分内核缓存；启用 Swap 时也可换出匿名页，还可能进行内存规整。若特定内存域或整机最终无法满足分配，才可能进入 OOM 选择受害进程。

**继续追问**：回收没有一条对所有内核版本和工作负载都固定的简单顺序。应观察内存压力、匿名页/文件页、工作集、Swap、direct reclaim、major fault 和 PSI，而不只看 free。

**易错点**：Page Cache 占用高不天然是泄漏；它通常可回收，并用于降低后续 I/O 延迟。

---

### Q9：Kubernetes Pod 为什么会 OOMKilled？

**30 秒回答**：Kubernetes 声明资源限制，kubelet 和容器运行时将配置下沉为 cgroup，Linux 内核负责记账、回收和 OOM。以 cgroup v2 为例，内存接近 memory.max 且无法回收时可能触发该 cgroup 内的 OOM kill；运行时把进程退出原因上报，Kubernetes 才显示 OOMKilled。

    Kubernetes limit
          ↓
    kubelet / runtime
          ↓
       cgroup
          ↓
    Linux reclaim / OOM

**继续追问**：容器级 OOM、节点级系统 OOM 和 kubelet 的 node-pressure eviction 是不同路径。Exit Code 137 只表示收到 SIGKILL，不能单凭它断言一定是 OOM。

---

### Q10：TCP 已建立，一端突然断电，另一端会怎样？

**30 秒回答**：对端不会立刻知道，因为断电方没有机会发送 FIN 或 RST。若存活方继续发送，会经历 ACK 缺失、RTO、重传和最终超时并向应用报错；若连接长期空闲且没有 TCP Keepalive、应用层心跳或业务 deadline，状态可能保持很久。TCP 不会因为没收到 ACK 自动重新三次握手。

**继续追问**：FIN 表示该方向正常结束发送，TCP 全双工方向分别关闭，所以常见流程是四次挥手；RST 表示连接被立即复位。Keepalive 是内核级空闲探测，应用心跳能携带业务健康语义并设置更可控的超时。

**易错点**：TIME_WAIT 由主动关闭方承担，主要用于重发最后 ACK，并让旧四元组的延迟报文在网络中消失；不能简单归因于“服务端设计问题”。

---

## 二、P0 云计算基础

### 云计算术语速记

| 概念 | 面试一句话 |
|---|---|
| 公有云 / 私有云 / 混合云 | 区别在资源所有权、运营边界和连接方式；多云则同时使用多个云提供商，复杂度通常高于混合云 |
| Scalability / Elasticity | 前者是系统扩大处理能力的能力，后者强调容量随需求自动增减 |
| High Availability / Disaster Recovery | HA 降低日常故障中断，DR 在重大故障后按 RTO/RPO 恢复 |
| Multi-tenancy | 多租户共享资源池但必须隔离身份、数据、网络、资源与故障影响 |
| Noisy Neighbor | 某租户争用 CPU、缓存、内存带宽、磁盘或网络，导致其他租户性能退化 |
| Shared Responsibility | 云厂商保护云基础设施，用户仍需保护自己的身份、配置、数据和工作负载；边界随 IaaS/PaaS/SaaS 改变 |
| Serverless | 用户提交函数或服务，平台管理实例、伸缩和计量；服务器仍存在，只是基础设施责任被平台隐藏 |
| North-South / East-West | 前者通常指集群或数据中心进出流量，后者指内部服务或节点间流量 |

### Q11：云计算的核心价值是什么？IaaS、PaaS、SaaS 如何区分？

**30 秒回答**：云计算把计算、网络、存储和平台能力做成可编程、按需、弹性且可计量的服务。IaaS 提供 VM、VPC、磁盘等基础资源；PaaS 进一步托管运行时、中间件和伸缩；SaaS 直接交付业务功能。层级越高，用户运维责任越少，但定制空间和底层控制通常也越少。

**继续追问**：云不是“别人的服务器”这么简单，关键还包括 API 驱动、资源池化、多租户隔离、自动化交付、故障域设计和按使用量计费。

---

### Q12：什么是控制面、数据面和管理面？

**30 秒回答**：控制面保存期望状态并做决策，例如创建 VM、调度 Pod、下发路由和策略；数据面承载实际业务流量和计算，例如转发数据包、执行模型和读写存储；管理面面向运维者，负责配置、审计、升级和故障操作。不同系统命名可能重叠，答题时要先定义边界。

**继续追问**：控制面短暂不可用时，已建立的数据面通常应尽量继续服务；但创建资源、扩缩容和变更策略会受影响。控制面必须幂等、可重试并通过 reconciliation 收敛。

---

### Q13：Region、Availability Zone 和故障域是什么？

**30 秒回答**：Region 是地理区域，Zone 是区域内相对独立的基础设施故障域。多 Zone 部署用于抵抗单机房、电力或局部网络故障；跨 Region 用于更大范围容灾和接近用户，但会增加网络延迟、复制成本与一致性复杂度。

**继续追问**：高可用不是“副本数大于一”，而是副本没有落在同一机架、Zone、交换机、存储阵列或控制面故障域。RTO 决定允许恢复多久，RPO 决定允许丢多少数据。

---

### Q14：Hypervisor 如何实现虚拟化？

**30 秒回答**：Hypervisor 向 Guest OS 提供虚拟 CPU、内存和设备，并在多个 VM 之间隔离和调度物理资源。现代 CPU 的硬件虚拟化扩展帮助执行敏感指令和切换 Guest；二级地址转换把 Guest Virtual Address 经过 Guest 页表和 Hypervisor 管理的映射落到 Host Physical Memory。

**继续追问**：Type 1 更贴近裸机，Type 2 运行在宿主操作系统之上；virtio 等半虚拟化设备让 Guest 使用约定接口，减少完整设备模拟开销。

**易错点**：不要承诺 VM 性能一定比容器差。实际取决于 CPU 虚拟化、设备直通、I/O 路径、NUMA 和工作负载。

---

### Q15：VM 和 Container 的本质区别是什么？

**30 秒回答**：VM 通常拥有独立 Guest Kernel 和虚拟硬件，隔离边界较强，也能运行不同内核；Linux 容器通常是宿主机上的进程，共享 Host Kernel，靠 namespace、cgroup、文件系统和安全策略形成隔离视图。容器启动快、密度高，VM 的内核边界更清晰。

**继续追问**：生产中 VM 内运行容器很常见；前者承担基础设施和租户边界，后者承担应用交付与编排。

---

### Q16：namespace、cgroup 和安全机制分别解决什么？

**30 秒回答**：namespace 控制进程“看见什么”，例如 PID、Network、Mount、IPC、UTS 和 User 视图；cgroup 控制和统计“能用多少”，例如 CPU、Memory、I/O 和 PIDs；capability、seccomp、SELinux/AppArmor、只读文件系统和最小权限控制“允许做什么”。

**继续追问**：这些机制组合后仍共享宿主内核。特权容器、hostPath、宿主 namespace、危险 capability 和过宽设备访问都会显著扩大逃逸面。

---

### Q17：Docker、OCI、containerd、runc 和 CRI 是什么关系？

**30 秒回答**：OCI 定义镜像和低层运行时等开放规范；containerd 管理镜像、快照和容器生命周期；runc 等低层 runtime 根据 OCI bundle 创建 namespace、cgroup、mount 并启动进程；CRI 是 kubelet 请求高层容器运行时的接口。典型链路是 kubelet → CRI/containerd → runc → Linux Kernel。

**继续追问**：Docker 是更上层的构建、分发和运行工具链。Kubernetes 移除 dockershim 不等于不能使用 Dockerfile 或 OCI 兼容镜像。

---

### Q18：Kata、gVisor 和普通容器如何选择？

**30 秒回答**：普通容器共享宿主内核，兼容性和性能通常最好；gVisor 用用户态应用内核拦截并实现大部分系统接口，以更小宿主内核暴露面换取兼容性和系统调用开销；Kata 把工作负载放进轻量 VM，用 Guest Kernel 和硬件虚拟化增强隔离，但会增加启动、内存和设备接入成本。

**继续追问**：选择依据是威胁模型、兼容性、启动时延、密度、GPU/设备支持和运维能力。运行不可信 Agent 代码时，普通 namespace 加 limit 通常不足以单独作为强租户边界。

---

### Q19：VPC、子网、路由表、Security Group 分别是什么？

**30 秒回答**：VPC 提供租户级逻辑网络边界；子网划分地址和可用区范围；路由表决定目标网段的下一跳；Security Group 或网络 ACL 根据实现对流量做有状态或无状态过滤。底层可能用 VLAN、VXLAN、Geneve 或 SDN 流表实现，但用户看到的是稳定的逻辑网络。

**继续追问**：Overlay 提供灵活租户网络，Underlay 提供真实物理连通。排障时要沿 DNS、应用监听、策略、安全组、路由、NAT、隧道和物理网络逐层定位。

---

### Q20：四层和七层负载均衡有什么区别？NAT 在哪里出现？

**30 秒回答**：L4 LB 主要基于 IP、端口和传输层连接转发，协议通用且开销低；L7 LB 理解 HTTP/gRPC 等应用协议，可按 Host、Path、Header、身份或权重路由，并做 TLS 终止。NAT 修改源或目标地址，常用于公网出口、服务暴露和地址复用。

**继续追问**：负载均衡健康检查只说明检查路径健康，不等于真实业务依赖健康。要考虑连接保持、重试放大、慢启动、跨 Zone 流量成本和源地址保留。

---

### Q21：块存储、文件存储和对象存储如何选择？

| 类型 | 接口与语义 | 常见场景 |
|---|---|---|
| 块存储 | 暴露块设备，由上层建立文件系统 | 数据库盘、VM 系统盘、低延迟随机 I/O |
| 文件存储 | 提供目录和文件共享语义 | 多实例共享文件、传统 POSIX 应用 |
| 对象存储 | 通过 Key/API 访问对象，规模大、耐久性高 | 模型、数据集、Checkpoint、日志归档 |

**继续追问**：对象存储不是可直接替代本地 POSIX 文件系统的“无限硬盘”。它的 rename、append、小文件、列表一致性、延迟和请求成本都需要按具体产品确认。

---

### Q22：云存储如何实现可靠性？

**30 秒回答**：可靠存储通常通过多副本或纠删码、校验和、故障检测、后台修复和跨故障域放置降低数据丢失概率。持久性描述数据不丢，Availability 描述当前能否访问，两者不是同一个指标。

**继续追问**：本地盘性能高但节点故障后不可依赖；远端块存储有独立持久化边界但增加网络路径。Checkpoint 应写到独立可靠存储，并用临时对象加 manifest 或原子可见标记避免半成品。

---

### Q23：IAM 的认证、授权和临时凭据是什么关系？

**30 秒回答**：认证确认调用者是谁，授权判断它能对哪个资源执行什么动作，审计记录谁在何时做了什么。生产系统应采用最小权限、短期凭据、工作负载身份和集中密钥托管，避免把长期云密钥写进镜像、环境日志或 Agent Prompt。

**继续追问**：RBAC 适合按角色授权，ABAC/策略引擎可结合租户、资源标签、任务和环境做细粒度判断。允许调用工具不等于允许工具访问任意资源。

---

### Q24：Kubernetes 如何通过声明式控制实现最终一致？

**30 秒回答**：用户向 API Server 提交期望状态，经认证、鉴权、准入和校验后写入 etcd。控制器通过 list/watch 观察对象，持续比较期望与实际状态并执行 reconciliation；scheduler 选择节点，kubelet 通过 CRI、CNI、CSI 等在节点落地。

**继续追问**：watch 不是 exactly-once 消息队列，可能断开或丢失中间事件。控制器应基于当前状态做 level-based、幂等、可重试的收敛。

---

### Q25：Pod 从提交到 Running 的调度链路是什么？

    client
      ↓
    API Server → etcd
      ↓
    Scheduler: queue → filter → score → reserve/bind
      ↓
    Kubelet
      ↓
    CRI / CNI / CSI
      ↓
    Pod Running

**30 秒回答**：Scheduler 只决定 Pod 去哪个 Node，不负责真正创建容器。Filter 排除资源、亲和、污点、拓扑或存储不满足的节点，Score 对可行节点排序；绑定后由目标节点 kubelet 调用运行时和插件完成启动。

**易错点**：默认调度器主要根据 requests 和 allocatable 做容量判断，不是简单挑实时 CPU 使用率最低的节点。

---

### Q26：requests、limits、QoS 和 OOM 有什么关系？

**30 秒回答**：request 主要用于调度容量承诺和争用时的资源权重；CPU limit 通常通过 cgroup 带宽控制表现为 throttling，内存 limit 是不可压缩硬边界，超过且回收失败时可能 OOM。Kubernetes 根据 request/limit 组合形成 QoS，影响节点压力下的驱逐和 OOM 风险，但不提供绝对不被杀承诺。

**继续追问**：request 过低会过度装箱并放大尾延迟，过高会浪费容量。GPU 等扩展资源通常按实例数量调度，默认不代表 GPU 利用率、显存带宽或互联质量。

---

### Q27：云平台如何同时做弹性、高可用和成本治理？

**30 秒回答**：水平伸缩改变副本数，垂直伸缩改变单实例资源，节点伸缩改变底层容量；三者是有延迟的反馈环，必须设置稳定窗口、冷却、上下界和降级策略。高可用要求跨故障域放置、容量余量和可恢复状态；成本治理则通过合适规格、装箱、预留/竞价资源、空闲回收和单位业务成本指标约束。

**继续追问**：只按平均 CPU 扩缩容经常失效。在线推理还应关注队列长度、并发、TTFT、KV Cache 压力和 GPU 饱和度；训练队列则更适合按 Pending 资源和优先级驱动容量。

---

## 三、P1 训练与推理系统

### Q28：训练平台的端到端链路是什么？

**30 秒回答**：典型链路是提交 Job Spec → 准入与配额 → 队列 → 资源调度 → 环境和数据准备 → Worker 启动与 rendezvous → 训练与指标采集 → Checkpoint → 故障恢复 → 模型注册。平台控制面管理状态、策略和生命周期，数据面承担数据读取、GPU 计算和集合通信。

**继续追问**：训练成功不能只看 Pod Running，还要验证所有 rank 加入、step 前进、loss 有效、checkpoint 可恢复以及产物版本完整。

---

### Q29：训练控制面和训练数据面为什么要分开？

**30 秒回答**：控制面处理 Job、队列、配额、调度、重试、元数据和审计，追求正确性与可恢复；数据面处理高吞吐数据加载、GPU kernel 和通信，追求性能与低干扰。分开后可以独立扩缩、缩小权限和故障域，并避免高频训练流量压垮元数据服务。

**继续追问**：两面通过带版本的 Job Spec、状态和事件交互。控制面必须处理重复事件和迟到状态，数据面不应持有平台级长期凭据。

---

### Q30：PyTorch DDP 如何工作？

**30 秒回答**：每个进程持有完整模型副本，读取不同数据分片，独立完成 forward 和 backward。梯度就绪后按 bucket 触发 AllReduce，使各 rank 获得一致的聚合梯度，再各自执行相同 optimizer step，从而保持模型副本同步。

**继续追问**：DDP 不会自动替用户切分输入，通常需 DistributedSampler；各 rank 必须按兼容顺序参与 collective，否则会错误或 hang。梯度 bucket 可让通信与反向计算重叠。

---

### Q31：DP、TP、PP、ZeRO/FSDP 和 EP 如何选择？

| 策略 | 切分对象 | 主要代价 |
|---|---|---|
| Data Parallel | 数据；每卡完整模型 | 梯度同步 |
| Tensor Parallel | 单层张量计算 | 高频集合通信，对互联敏感 |
| Pipeline Parallel | 不同层或 stage | pipeline bubble 与调度复杂度 |
| ZeRO/FSDP | 参数、梯度、优化器状态 | gather/reduce 通信与实现复杂度 |
| Expert Parallel | MoE experts | all-to-all 与负载不均 |

**继续追问**：模型放得下时先用数据并行最简单；放不下再组合分片。并行策略不是越多越好，要根据显存、计算/通信比、拓扑和故障恢复成本选择。

---

### Q32：为什么 DDP 需要高性能网络？

**30 秒回答**：同步训练每一步都包含 collective，step time 近似由最慢 rank 的计算和通信共同决定。GPU 计算越快，梯度规模越大，网络带宽、延迟和拓扑越容易成为瓶颈；一个慢节点还会让所有 rank 在同步点等待。

**继续追问**：常见 collective 包括 AllReduce、AllGather、ReduceScatter 和 AllToAll。应同时看算法带宽、总线带宽、通信计算重叠和 tail rank，而不只看网卡标称带宽。

---

### Q33：RDMA、GPUDirect RDMA、NVLink 分别解决什么？

**30 秒回答**：RDMA 允许远端内存访问绕过传统内核数据路径，减少 CPU 参与和复制；GPUDirect RDMA 在硬件和拓扑允许时缩短 GPU 与远端 NIC 的数据路径；NVLink/NVSwitch 提供节点内 GPU 间高带宽互联。三者处在不同范围，不能互相替代。

**继续追问**：实际性能还取决于 PCIe/NUMA、GPU-NIC 亲和、IOMMU、驱动、MTU、拥塞控制和 collective 库。必须用通信基准和真实模型共同验证。

---

### Q34：什么是 Gang Scheduling？

**30 秒回答**：同步分布式 Job 只有达到最小成员和资源条件才可运行。逐 Pod 调度可能让多个 Job 各占一部分 GPU 却都等不到剩余成员；Gang Scheduling 以 Job/PodGroup 为单位准入，满足最小条件时整体推进，否则等待或回滚预留。

**继续追问**：Gang 保证的是成组资源准入，不是进程在同一纳秒启动，也不替代 rendezvous、超时、健康检查和 checkpoint。

---

### Q35：Queue、Quota、Priority、Preemption 和 DRF 各解决什么？

**30 秒回答**：Queue 组织团队或业务工作负载；Quota 定义保障和上限；Priority 表达重要性；Preemption 在资源不足时让高优任务回收低优资源；DRF 按多维资源中的 dominant share 做相对公平。目标是多租户公平、SLA、利用率和饥饿防护的平衡。

**继续追问**：抢占只释放资源，不提供无损恢复。训练任务必须有 checkpoint，并把已运行时长、保存成本和恢复时间纳入 victim 选择。

---

### Q36：为什么训练调度需要 topology-aware？

**30 秒回答**：同样数量和型号的 GPU，可能位于同一 NVSwitch、同一 PCIe Switch、跨 NUMA、跨节点或跨机架，通信性能差异巨大。调度器需要结合 GPU-GPU、GPU-NIC、CPU NUMA、RDMA 网络和存储拓扑，为通信密集 Job 选择高带宽、低跳数的 placement。

    GPU
      ↓
    NVLink / NVSwitch
      ↓
    PCIe / NUMA
      ↓
    RDMA NIC
      ↓
    Switch / Rack / Zone

**易错点**：拓扑标签正确不代表运行时绑定正确，还需检查进程 CPU 亲和、NIC 选择和 collective 实际路径。

---

### Q37：什么是 GPU 碎片？为什么常用 Binpack？

**30 秒回答**：集群总空闲 GPU 足够，不代表满足 Job 的形状。例如两台机器各空闲 4 卡，无法容纳单机 8 卡任务。Binpack 倾向填满部分节点，为大 Job 保留完整节点并减少活跃机器数；Spread 更利于故障隔离和部分在线服务。

**继续追问**：装箱目标不能只看卡数，还要看型号、显存、MIG profile、互联 clique、CPU、内存和 NIC。过度 Binpack 可能造成热点、故障影响扩大或低质量拓扑。

---

### Q38：训练 Checkpoint 应保存什么？如何保证可恢复？

**30 秒回答**：除模型权重外，严格续训通常还需 optimizer、LR scheduler、随机数状态、dataloader 位置、global step、分片布局和版本元数据。大模型可按 rank 分片、异步写对象存储，并通过临时前缀加 manifest/commit marker 保证完整 checkpoint 才可见。

**继续追问**：保存频率在写入开销和最大重算量之间取舍。节点断电没有优雅终止窗口，因此不能只依赖 preStop 时保存；恢复后还要重新 rendezvous，并验证 world size 变化是否改变训练语义。

---

### Q39：什么是 Straggler？如何定位？

**30 秒回答**：同步训练 step 由最慢 rank 决定，持续较慢或偶发长尾的 rank 就是 straggler。原因可能是数据倾斜、CPU/DataLoader、存储、GPU 降频或错误、NUMA、网络丢包、collective 拥塞和其他租户争用。

**排查顺序**：先按 rank 对齐 step 时间，再拆成 data、forward、backward、collective 和 checkpoint 阶段；比较慢 rank 的 GPU、CPU、I/O、网络和拓扑，最后做换机、换卡或缩小 world 的对照实验。

---

### Q40：训练输入流水线为什么会让 GPU 吃不满？

**30 秒回答**：数据读取、解码、增强、shuffle、batch、Host-to-Device 复制任何一段跟不上，GPU 都会等待。常见优化是数据分片与顺序读、本地缓存、并行预取、pinned memory、异步复制、合理 worker 数和把部分预处理移到 GPU。

**继续追问**：worker 越多不一定越快，可能放大随机 I/O、内存和上下文切换。要用端到端 step time 与 GPU idle gap 验证，不要只看单阶段吞吐。

---

### Q41：在线推理中的 prefill 和 decode 有何不同？

**30 秒回答**：prefill 一次处理输入 token，矩阵运算并行度高，通常更偏 compute-bound；decode 每轮为每个请求生成少量 token，需要反复读取模型参数和 KV Cache，通常更偏 memory-bandwidth-bound。长 Prompt 主要拉高 TTFT，长输出主要拉高生成阶段时延和 KV 占用。

**继续追问**：prefill/decode 的资源特征不同，因此可以采用 chunked prefill、优先级调度，规模足够时还可考虑 disaggregated serving，但会增加 KV 传输和系统复杂度。

---

### Q42：KV Cache 保存什么？为什么是容量瓶颈？

**30 秒回答**：自回归解码缓存历史 token 在各层的 Key/Value，避免每生成一个 token 都重新计算完整上下文。其容量随并发、上下文长度、层数、KV head、head dimension 和数据类型增长，直接限制可并发序列数。

**继续追问**：常见手段包括 paged/block 管理、prefix caching、量化、滑动窗口、请求准入和卸载。优化不能只看命中率，还要评估查找开销、碎片、传输和租户数据隔离。

---

### Q43：Continuous Batching 为什么优于静态 Batching？

**30 秒回答**：静态 batching 常等待整批请求全部结束，短请求会被长请求拖住；continuous batching 可在迭代边界移出已完成请求并加入新请求，提高 GPU 利用率和吞吐。代价是调度、KV 分配和公平性更复杂。

**继续追问**：吞吐最大不等于用户体验最好。要用 token budget、最大并发、优先级、deadline 和 preemption，在吞吐、TTFT、TPOT 与尾延迟之间取舍。

---

### Q44：大模型推理并行与模型放置如何选择？

**30 秒回答**：单卡放得下优先单卡，故障域和调度最简单；Tensor Parallel 跨卡延迟低但每层通信频繁，宜放在高速节点内互联；Pipeline Parallel 降低单阶段显存但有 bubble；跨节点并行需要更谨慎评估网络。多个副本提供吞吐和故障隔离。

**继续追问**：模型放置还应考虑权重加载、KV Cache、本地缓存、GPU 架构、量化格式和拓扑。扩容不是 Pod Running 就结束，模型加载和 warmup 完成后才能接流量。

---

### Q45：如何衡量和扩缩一个推理服务？

**30 秒回答**：核心指标包括 TTFT、TPOT/ITL、端到端延迟、输入/输出 token 吞吐、队列时间、并发、错误率、KV Cache 使用率和 GPU 利用率。扩缩容应以排队和 SLO 为主，结合每种模型/硬件的离线容量曲线，而不是只看平均 GPU 利用率。

**继续追问**：缩容前要停止新流量、排空已有请求并处理长流式连接；扩容要计入镜像、权重下载和 warmup 的冷启动时间。突发流量还需要准入、限流、降级和小型 warm pool。

---

### Q46：模型发布如何避免“服务正常但答案错误”？

**30 秒回答**：模型、Tokenizer、推理参数、量化格式、Prompt 模板和服务代码要作为一个版本化发布单元。先做离线质量与兼容验证，再灰度/canary 或 shadow，对比质量、延迟和错误；异常时快速回滚流量和制品。

**继续追问**：健康检查只能证明进程可服务，不能证明模型语义正确。应加入固定 golden cases、分布监控、业务指标和模型版本标签，保证每个响应可追溯。

---

## 四、P2 分布式系统

### Q47：CAP 定理到底说了什么？

**30 秒回答**：当网络分区发生时，系统无法同时对所有请求保证线性一致性和可用响应。P 不是随意选择是否需要的功能，而是必须面对的故障条件；系统需要对不同操作决定在分区时拒绝、等待，还是返回可能较旧或冲突的数据。

**易错点**：CAP 不是平时只能三选二，也不能直接把整个复杂系统永久贴成 CP 或 AP。真实系统常按数据和操作做不同取舍。

---

### Q48：强一致、线性一致和最终一致是什么关系？

**30 秒回答**：线性一致要求每个操作看起来在调用与返回之间某一时刻原子生效，并尊重实时先后；最终一致允许副本暂时不同，在没有新写入且复制持续工作时最终收敛。“强一致”是口语化总称，面试时应明确指线性一致、顺序一致还是读己之写等具体保证。

**继续追问**：更强语义通常增加跨节点协调和尾延迟。配置、配额扣减、锁和任务所有权常需要强保证，日志搜索和部分统计可以接受较弱一致。

---

### Q49：复制和共识有什么区别？

**30 秒回答**：复制是把数据放到多个节点以提高可用性、读取能力或持久性；共识是在节点故障和消息延迟下，让参与者对同一有序决策达成一致。主从复制不自动等于共识，若选主和日志提交没有 quorum/term 等约束，网络分区时可能出现双主和数据分叉。

**继续追问**：Raft/Paxos 解决复制状态机的决策一致，不自动解决业务幂等、跨系统事务或错误数据写入。

---

### Q50：Quorum 读写为什么常写成 W + R > N？

**30 秒回答**：N 个副本中写入 W 个、读取 R 个，W + R > N 使读写集合必有交集，有机会读到最新成功写入；W > N/2 可让两个成功写集合相交。但这只是必要的集合条件之一，还需要版本、冲突解决、失败重试和明确的成功语义。

**易错点**：满足公式不自动得到线性一致；并发写、旧主、异步修复和客户端路由都可能改变结果。

---

### Q51：Lease、Epoch/Term 和 Fencing Token 为什么要一起用？

**30 秒回答**：Lease 用超时判断某个持有者暂时拥有权；但旧持有者可能因 GC pause 或网络分区在租约过期后恢复。每次所有权变更生成单调递增的 epoch/fencing token，下游只接受不小于已见 token 的写入，才能拒绝旧 worker 的迟到操作。

**继续追问**：仅依赖本地时钟和“我觉得租约还有效”不足以阻止双写。Agent task、训练 Job controller 和分布式锁都需要考虑 fencing。

---

### Q52：分布式系统能依赖精确时钟吗？

**30 秒回答**：物理时钟会漂移、跳变和同步误差，适合展示时间和粗粒度过期；进程内计算 duration 应优先单调时钟。跨节点事件顺序通常依赖日志位置、term/index、逻辑时钟或因果元数据，而不是直接比较 wall clock。

**继续追问**：超时是故障怀疑器，不是失败证明。请求超时可能是未执行、执行中、执行成功但响应丢失三种状态。

---

### Q53：为什么重试必须结合幂等？

**30 秒回答**：网络超时不等于服务端没有执行。客户端重试可能把同一副作用执行多次，所以请求应带稳定 idempotency key，服务端持久化去重状态，并让相同键返回同一业务结果。重试还需 deadline、指数退避、jitter、最大次数和错误分类。

**继续追问**：set status = Running 通常容易幂等，balance -= 100 不是天然幂等。去重窗口过短会让迟到重试再次生效，窗口过长则增加存储成本。

---

### Q54：Exactly-once 能做到吗？

**30 秒回答**：网络投递通常实现 at-most-once 或 at-least-once；端到端 exactly-once 需要把消费进度与业务副作用放进同一事务边界，或通过幂等、去重和事务协议组合出“效果一次”。消息 ACK 本身只证明消息系统状态，不证明外部业务动作只执行一次。

**继续追问**：向数据库写记录再 ACK 可以事务化；但同时发邮件、调用支付和写另一数据库时，仍要 outbox、幂等接口或补偿流程。

---

### Q55：Outbox、Saga 和两阶段提交如何选择？

**30 秒回答**：Transactional Outbox 在本地事务中同时写业务数据和待发布事件，再异步投递，解决数据库提交与发消息的原子间隙；Saga 把长事务拆成一组本地事务和补偿动作，适合跨服务业务流程；2PC 通过协调者统一 prepare/commit，语义更强但参与者、阻塞和可用性成本更高。

**继续追问**：补偿不是数据库回滚，可能失败且需要幂等；Outbox 仍可能重复发布，消费者仍要去重。

---

### Q56：如何做过载保护和背压？

**30 秒回答**：系统应该在入口按租户和优先级做有界队列、并发限制、token/资源预算和 admission control；下游变慢时传播 deadline、减少并发、快速失败或降级，而不是无限堆积。熔断器限制持续失败调用，重试预算防止重试风暴。

**继续追问**：Little's Law 说明在吞吐一定时，排队时间增加会积累更多在途请求。无界队列把显式拒绝变成内存爆炸和更差尾延迟。

---

### Q57：分布式故障如何建立可观测性？

**30 秒回答**：Metrics 告诉你规模和趋势，Logs 提供离散事件细节，Traces 串起跨服务因果链。所有任务、请求、attempt、model、tool 和 sandbox 应带稳定关联 ID；同时记录 SLI、资源、状态转换、重试原因和版本，才能重放一次失败。

**继续追问**：不要只采成功率和平均延迟。还要看 p95/p99、队列时间、被限流量、取消传播、错误分类和饱和度，并用高基数标签控制成本。

---

## 五、P1 Agent Runtime 系统

### Q58：Agent Runtime 的控制面和执行面如何划分？

**30 秒回答**：控制面负责任务接收、身份策略、模型与工具注册、状态机、调度、预算、审批、重试、审计和观测；执行面负责模型调用、工具调用、代码、浏览器、文件和环境交互。模型服务可独立部署，但“谁决定允许做什么”和“谁真正执行”必须分开。

    Client / API
         ↓
    Task Control Plane
      ├─ state / policy / budget / scheduler
      └─ event log / audit / approval
         ↓
    Execution Plane
      ├─ model gateway
      ├─ tool gateway
      └─ sandbox pool

**继续追问**：执行 worker 不应持有平台级长期密钥，控制面也不能把工具返回的自然语言直接当可信控制指令。

---

### Q59：可靠 Agent 任务状态机应有什么状态？

**30 秒回答**：至少区分 queued、leased/running、waiting、succeeded、failed、cancelled 和 timed-out；每个 step/attempt 保存输入版本、输出、错误、消耗、因果关系和副作用状态。waiting 还应区分等待模型、工具、人工审批或外部事件。

**继续追问**：终态应单向收敛；重试创建新 attempt 而不是覆盖旧历史。恢复时必须固定或记录模型、Prompt、工具 schema、Sandbox 镜像和策略版本。

---

### Q60：长任务如何避免两个 Worker 同时执行？

**30 秒回答**：Worker 通过原子领取获得带过期时间的 lease，执行中 heartbeat 续约；控制面在租约过期后可重派。每次领取带递增 attempt/epoch，下游状态更新必须校验 fencing token，从而拒绝旧 Worker 恢复后的迟到写入。

**继续追问**：分布式投递通常是 at-least-once，不能只靠消息队列 ACK 实现单次副作用。取消和 deadline 也要传播到模型请求、工具进程与 sandbox。

---

### Q61：Agent 工具协议最重要的设计点是什么？

**30 秒回答**：工具需要稳定名称和版本、强类型输入输出 schema、明确副作用等级、超时、结果大小上限、幂等键和结构化错误。但 schema 只验证数据形状，不负责授权；每次调用仍需根据主体、任务、资源范围和有效期做策略检查。

**继续追问**：Tool gateway 应统一执行鉴权、凭据注入、审计、限流、重试和输出净化。支付、删除、发布或发送消息等高风险动作需要 preview、二次确认或人工审批。

---

### Q62：如何防 Prompt Injection 和凭据泄漏？

**30 秒回答**：网页、文件、邮件和工具输出都属于不可信数据，不能因为出现在上下文里就提升为系统指令。权限判断必须在模型外由策略系统完成；凭据由 broker 在工具调用时按最小范围临时注入，不能进入 Prompt、轨迹、日志或任意 shell 环境。

**继续追问**：还要防 SSRF、路径穿越、命令注入、DNS rebinding、过宽网络出口和结果中的二次注入。内容过滤不能替代真实授权和 sandbox。

---

### Q63：Agent Sandbox 首先要定义什么？

**30 秒回答**：先定义威胁模型：代码是否恶意、是否多租户、能否联网、能访问哪些文件和密钥、允许哪些系统调用、最大 CPU/内存/PID/磁盘/时长，以及逃逸后最坏影响。之后才选择 namespace、gVisor、Kata/microVM 或专用 VM。

**继续追问**：Sandbox 边界还包括控制 API、镜像供应链、宿主 agent、网络代理和持久化存储。任何一层持有过宽凭据都会绕过执行隔离。

---

### Q64：普通容器、gVisor 和 microVM 用于 Agent 时如何取舍？

**30 秒回答**：可信内部工具可用加固容器获得最高兼容性和密度；不可信但系统调用相对通用的代码可考虑 gVisor；强多租户或更高对抗场景可用 Kata/microVM/VM。隔离越强，通常启动、内存、设备兼容和运维成本越高。

**继续追问**：GPU Agent 或需要特殊内核接口的 workload 要单独验证兼容性。安全结论必须基于具体配置和攻击面，不能只凭产品名字。

---

### Q65：Sandbox 池化为什么难？如何防止跨任务污染？

**30 秒回答**：warm pool 能降低冷启动，但复用会残留进程、文件、挂载、网络连接、缓存、凭据和内核状态。安全默认应是任务后销毁；若确需复用，必须建立可验证 reset 协议，并在租户切换时采用更强销毁边界。

**继续追问**：生命周期通常是 allocate → prepare → execute → collect → scrub/destroy。控制面应有 TTL、僵尸回收、容量上限和泄漏检测，销毁失败的实例不能重新入池。

---

### Q66：Agent 的 Context 和 Memory 应怎样分层？

**30 秒回答**：短期 context 服务当前推理，任务状态保存可恢复的结构化事实，长期 memory 保存跨会话信息，artifact store 保存大文件和产物。摘要和向量检索是派生索引，不应成为唯一真相；关键状态应结构化、版本化并可审计。

**继续追问**：检索结果要带来源、租户、权限和时间；写入 memory 前要做数据分类、去敏和保留策略。模型生成的摘要可能丢信息，恢复不能只依赖自然语言摘要。

---

### Q67：Model Gateway 在 Agent Runtime 中负责什么？

**30 秒回答**：Model Gateway 统一模型路由、认证、限流、预算、重试、fallback、流式协议、版本记录和用量计费。它应区分调用失败、限流、超时、内容拒绝和不确定结果，并把 provider request ID 与 task/step 关联。

**继续追问**：模型超时但服务端可能已生成或计费，不能无条件重试。Fallback 模型可能改变工具调用格式和质量，必须经过策略允许并记录实际模型版本。

---

### Q68：多租户 Agent 如何做调度与预算？

**30 秒回答**：同时约束并发 task、模型 token/费用、工具 QPS、sandbox CPU/内存和队列长度；按租户 Queue、Quota、Priority 和 deadline 做 admission 与公平调度。资源不足时优先排队、降级或拒绝，不能让单个递归 Agent 无限生成子任务。

**继续追问**：预算必须在每一步执行前保留、完成后结算，超时或取消后释放；父子任务要共享或分配预算，避免 fan-out 绕过租户上限。

---

### Q69：Agent 如何实现可观测、评测与重放？

**30 秒回答**：记录 task → attempt → model call/tool call → sandbox action 的因果图，以及输入引用、版本、结构化结果、延迟、token、费用、策略决定和人工审批。线上用 SLO、错误分类和安全事件监控，离线用固定数据集、模拟工具和 judge/verifier 做回归。

**继续追问**：可重放不等于一定可复现。外部网页、非确定模型、时间、随机数和副作用都会变化；应保存快照或引用、随机种子、版本和 mock，并禁止重放再次执行真实危险副作用。

---

### Q70：Agentic RL 的运行时为什么比普通训练更复杂？

**30 秒回答**：普通训练样本通常已存在，Agentic RL 需要模型与浏览器、代码、游戏或服务环境多轮交互生成 trajectory。系统同时承担 rollout 调度、环境隔离与重置、模型版本固定、工具调用、Reward/Verifier、轨迹存储和训练消费。

**继续追问**：环境必须可重置、可并行、可超时和防污染；trajectory 要保存 observation、action、tool result、reward、done、版本和因果关系。训练与 rollout 的模型/Tokenizer/Prompt 不一致会导致错误的概率比或优势估计。

---

## 六、系统设计答题骨架

### 1. 设计一个多租户云上训练平台

先明确租户数、GPU 规模、Job 类型、SLA、训练框架、单 Job 最大卡数和故障恢复目标，再按以下链路回答：

    API / Job CRD
        ↓
    Auth + Admission + Queue + Quota
        ↓
    Gang + Topology-aware Scheduler
        ↓
    Kubelet / Runtime / Device Plugin
        ↓
    Data Cache + RDMA + GPU Workers
        ↓
    Metrics + Checkpoint + Model Registry

关键取舍：公平与利用率、Binpack 与故障域、抢占收益与 Checkpoint 成本、共享存储与本地缓存、静态集群与云上弹性。

### 2. 设计一个大模型在线推理平台

    Gateway
      ↓ routing / auth / rate limit
    Admission Queue
      ↓ token budget / priority
    Replica Scheduler
      ↓ cache affinity / load / model version
    Model Worker
      ↓ continuous batching / KV Cache
    GPU

关键指标：TTFT、TPOT、端到端 p99、token throughput、queue time、KV 使用率和错误率。必须补充模型版本、灰度、冷启动、流式取消、过载降级和容量模型。

### 3. 设计一个 Agent Runtime

    Task API → Durable State Machine → Scheduler
                         ↓
                 Model / Tool Gateway
                         ↓
                  Sandbox Allocator
                         ↓
              Event Log / Artifact / Audit

关键正确性：lease + fencing、step 幂等、取消传播、工具授权、临时凭据、预算预留、Sandbox 销毁、人工审批和可重放审计。

### 4. 设计云平台高可用方案

先定义 SLI/SLO、RTO、RPO 和故障假设，再逐层回答：多副本是否跨机架/Zone、控制面是否 quorum、数据如何复制和备份、流量如何切换、容量是否有冗余、依赖如何降级、灾备是否定期演练。

---

## 七、故障排查高频题

### 1. Pod 一直 Pending

按事件和 scheduler 原因排查：requests/allocatable → taint/toleration → selector/affinity → PVC/Zone → GPU/拓扑 → Queue/Gang/Quota → Priority/Preemption → 节点伸缩与云配额。不要先盲目重启 Pod。

### 2. Pod OOMKilled

先确认 lastState、事件和 cgroup memory events，再区分容器 OOM、节点压力驱逐和系统 OOM；分析 RSS、匿名页、Page Cache、tmpfs、进程数和峰值；最后调整泄漏、缓存、并发、request/limit 或容量，而不是只把 limit 无限调大。

### 3. 分布式训练 hang

先确定所有 rank 是否存活和处在同一 step/collective，再核对 world size、rank、collective 顺序和 shape；之后检查 GPU error、NCCL 日志、NIC/路由/RDMA、端口策略和 straggler。任一 rank 退出都可能让其他 rank 看起来只是卡住。

### 4. 推理 p99 突然升高

把端到端延迟拆成网关、排队、prefill、decode 和输出传输；对齐流量、输入/输出长度、batch、KV Cache、GPU、模型版本和扩缩容事件；检查是否发生重试放大、冷实例接流量、长请求抢占或跨节点并行退化。

### 5. Agent 任务重复执行工具

检查消息投递、lease 过期、heartbeat、attempt/epoch、状态提交与 ACK 顺序；确认工具是否使用业务幂等键和去重表；对有副作用动作查询外部真实状态，再决定补偿或重试。

---

## 八、面试前只背这 15 个

1. 用户态/内核态切换不等于进程上下文切换。
2. 虚拟内存的核心是隔离、抽象、按需分配、保护与共享。
3. TLB miss 不等于 Page Fault；malloc 成功不等于物理页已兑现。
4. K8s 定义 limit，runtime 配置 cgroup，Linux 内核实施回收和 OOM。
5. TCP 对端断电时不会立刻知道，也不会自动重新握手。
6. 云计算的关键是 API 驱动、资源池化、多租户、弹性、计量和故障域。
7. 控制面做决策和收敛，数据面承载真实计算与流量。
8. Container 共享 Host Kernel；Kata 用轻量 VM 增强隔离。
9. Scheduler 决定放哪，kubelet 和 runtime 负责真正启动。
10. DDP 每个 Worker 有模型副本，通过 AllReduce 同步梯度。
11. Gang 解决分布式 Job 部分占卡却无法运行的问题。
12. GPU 调度既要看数量，也要看 NVLink、NUMA、RDMA 和机架拓扑。
13. timeout 不等于失败，重试必须结合幂等、去重和 deadline。
14. Agent Runtime 要有持久状态机、lease + fencing、工具授权和预算。
15. Sandbox 从威胁模型出发，安全边界不只是一层容器。

---

## 官方资料

- [Linux cgroup v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)
- [Kubernetes Pod 与 Container 资源管理](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/)
- [Kubernetes Scheduling、Preemption 与 Eviction](https://kubernetes.io/docs/concepts/scheduling-eviction/)
- [OCI Runtime Specification](https://specs.opencontainers.org/runtime-spec/runtime/)
- [PyTorch DistributedDataParallel](https://docs.pytorch.org/docs/stable/generated/torch.nn.parallel.DistributedDataParallel.html)
- [NVIDIA GPUDirect RDMA](https://docs.nvidia.com/cuda/gpudirect-rdma/)
- [gVisor Architecture Guide](https://gvisor.dev/docs/architecture_guide/intro/)
- [Kata Containers](https://katacontainers.io/)
