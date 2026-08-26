---
layout: default
title: Kubernetes 与 Agent 基础设施面试八股文：容器、调度、推理、Sandbox 与 Agentic RL
description: Kubernetes 与 Agent 基础设施高频面试题，覆盖容器、K8s 核心、Volcano、GPU 调度、Agent Runtime、LLM 推理、Sandbox 与 Agentic RL
keyconcepts: [Kubernetes, Container, Volcano, GPU Scheduling, Agent Runtime, LLM Inference, Sandbox, Agentic RL]
eyebrow: 八股文 / Agent 基础设施
permalink: /05_interview/fundamentals/kubernetes-agent-infra/
---

# Kubernetes 与 Agent 基础设施面试八股文：容器、调度、推理、Sandbox 与 Agentic RL

> 面试时先给结论，再讲机制、边界和工程取舍。本文涉及 API 字段、默认策略、硬件能力和组件内部实现的内容均有版本边界：应以目标集群、组件、驱动及硬件代际的实际配置为准，不能把某一版本的实现当作永久契约。

> 如果要先建立 OS、云计算、训推、分布式与 Agent Runtime 的完整知识链，先看 [AI Infra 系统面试总纲]({{ site.baseurl }}/05_interview/fundamentals/infra-systems/)。

---

## 一、虚拟机与容器

### Q1：虚拟机和容器的本质差异是什么？

虚拟机由 Hypervisor 提供虚拟硬件，每台 VM 通常运行独立的 Guest Kernel；容器则通常只是宿主机上的一组进程，共享 Host Kernel，依靠 namespace 隔离资源视图、cgroup 计量和限制资源，再叠加 capability、seccomp、LSM 和文件系统权限控制。因而 VM 的隔离边界通常更强，容器的启动速度、镜像分发效率和部署密度通常更好。

选择依据不是“谁一定更先进”，而是威胁模型和工作负载。可信服务可用普通容器；运行不可信多租户代码时，可考虑用户态内核、轻量 VM 或普通 VM。生产中“VM 内跑容器”很常见，它同时利用基础设施隔离和容器交付能力。

**常见追问**：容器是不是轻量虚拟机？只能作类比，机制上容器通常没有自己的内核。Type 1/Type 2 Hypervisor 的部署位置不同；virtio 等半虚拟化设备主要减少完整硬件模拟的开销。

**易错点**：不要断言 VM 必然慢或容器必然不安全。启动、I/O 和隔离结论取决于 VMM、设备模型、内核、配置与负载，必须给出测试边界。

---

### Q2：namespace 与 cgroup 能否构成完整安全边界？

不能。namespace 隔离进程看到的 PID、挂载点、网络、IPC、主机名、用户等视图；cgroup 负责资源分组、统计和限制。它们分别解决“看见什么”和“能用多少”，并不完整解决“允许做什么”。普通容器仍共享宿主内核，内核漏洞、特权模式、危险 capability、hostPath、宿主 namespace、设备直通和未过滤系统调用都可能扩大逃逸面。

工程上要组合最小权限、非 root/user namespace、drop capabilities、seccomp、SELinux/AppArmor、只读根文件系统、禁止提权、资源配额、网络策略和供应链控制。主动恶意代码还应增加 gVisor、Kata 或 microVM 一类边界，并限制管理面；这仍然不是绝对安全。

**常见追问**：user namespace 把容器内 UID 映射到宿主非特权 UID，可降低“容器内 root”的权力；`CAP_SYS_ADMIN` 覆盖能力过宽，通常应移除。Pod Security Admission 主要约束 Pod 配置，不会消除内核漏洞或替代网络与镜像安全。

**易错点**：rootless、资源 limit 或 Kubernetes namespace 都不是单独成立的强多租户边界。

---

### Q3：Docker、OCI、containerd、runc 和 CRI 是什么关系？

Docker 是面向构建、分发和运行容器的产品与工具链；OCI 定义镜像、运行时和分发等开放规范，本身不是守护进程。containerd 是管理镜像、快照和容器生命周期的高层运行时守护进程，通常调用符合 OCI Runtime Spec 的低层运行时，例如 runc，后者最终设置 namespace、cgroup 并启动进程。

CRI 是 kubelet 与高层容器运行时之间的 gRPC 接口。典型链路是 `kubelet → CRI 插件/containerd → runc → Linux 内核`。Kubernetes 停用的是 kubelet 内置的 dockershim，不是禁止 Dockerfile，也不是不能运行 Docker 构建出的兼容 OCI 镜像。

**常见追问**：Kubernetes 不直接调用 runc，是因为 kubelet 还需要 sandbox、镜像、日志及完整生命周期管理；OCI 规定可移植格式和行为，CRI 规定 Kubernetes 如何请求运行时，两者层级不同。

**版本边界**：dockershim 的移除发生在特定 Kubernetes 演进阶段；实际节点链路还可能使用 CRI-O、RuntimeClass 和其他低层运行时，应以集群配置为准。

---

### Q4：OCI 镜像为什么能跨运行时？镜像和容器有什么区别？

镜像由 manifest、config 和按 digest 寻址的只读 layer 描述，是可分发的静态内容；运行时组合这些 layer 得到 rootfs，再叠加可写层、运行配置和内核隔离，才得到容器实例。多个容器可共享只读层，写入通常通过联合文件系统的 copy-on-write 落到各自可写层。

“跨运行时”来自对同一规范的实现，但有明确边界：CPU 架构、操作系统、内核功能、镜像媒体类型和运行时扩展必须兼容。多架构 image index 可为不同平台指向不同 manifest；tag 是可变名字，digest 才是内容身份，生产发布宜固定 digest 并校验签名。

**常见追问**：第一次修改只读层中的文件会触发 copy-up，可能放大 I/O；镜像层不是每启动一个容器就完整复制一遍。

**易错点**：Linux 用户态镜像不能脱离兼容 Linux 内核直接在 Windows 内核上运行；“符合 OCI”也不保证任意设备、驱动和扩展都可移植。

---

## 二、K8s 核心

### Q5：Kubernetes 控制面如何实现声明式与最终一致？

用户向 API Server 提交期望状态；API Server 完成认证、鉴权、准入和校验后写入 etcd。控制器通过 list/watch 观察对象，反复比较期望与实际状态并执行 reconciliation；scheduler 给未绑定 Pod 选节点，kubelet 再通过 CRI、CNI、CSI 等在节点落地。API Server 接受对象不等于工作负载已经运行。

关键是 level-based、可重试、尽量幂等：控制器根据当前状态收敛，而不是假定每个事件恰好到达一次。watch 会断开、事件可能合并，控制器要用 resourceVersion、重新 list 和工作队列恢复。最终一致也不等于最终成功；配额不足、策略拒绝、镜像错误或硬件缺失会使对象长期 Pending 或 Degraded。

**常见追问**：leader election 避免多个 active controller 同时推进同一职责，但业务操作仍要幂等；etcd 是控制面状态存储，不应被普通业务绕过 API Server 任意读写。

**易错点**：不要把 watch 当可靠消息队列，也不要说 API Server 会直接创建容器。

---

### Q6：Pod 为什么是 Kubernetes 最小调度单位，而不是容器？

Pod 表达一组必须共置、共同调度的容器。它们共享 network namespace，因此共享 IP 和端口空间，可通过 localhost 通信；也可共享显式声明的 volume。调度器给整个 Pod 选择一个节点，不能把其中容器拆到不同节点。

这种设计支持 init container 做顺序初始化、辅助容器承载代理或日志等协作角色。资源核算也按 Pod 语义进行：常规应用容器的请求通常求和；init container 因顺序执行，计算有效请求时通常取其最大值，再结合 Pod 级开销。具体 sidecar 与 Pod 级资源语义随 Kubernetes 版本和 feature gate 演进，必须按目标版本确认。

**常见追问**：pause/sandbox container 持有 Pod 共享的网络等 namespace；ephemeral container 主要用于诊断，不是常规业务副本。

**易错点**：共享网络不代表共享所有文件；两个容器不能在同一 IP 上重复绑定同一端口；Pod IP 通常不是应被长期依赖的稳定身份。

---

### Q7：requests、limits、QoS 与 OOM、CPU throttling 的关系是什么？

调度器主要依据 requests 与节点 allocatable 做容量核算，而不是依据容器此刻的 CPU/GPU 利用率。CPU request 是调度与相对权重信号，CPU limit 通常通过带宽控制，超出后表现为 throttling；内存不可压缩，超过 cgroup limit 时可能触发 OOM kill。request 配得过低会过度装箱，造成争用和尾延迟；配得过高则降低利用率。

Kubernetes 根据 requests/limits 形成 Guaranteed、Burstable、BestEffort QoS。节点压力下，QoS、优先级和相对超用情况会影响驱逐或 OOM 风险，但 Guaranteed 不是永不被杀的承诺。指标管线可供 HPA 或观测使用，那是独立反馈闭环。

**常见追问**：HPA 通常改副本数，VPA 通常建议或修改 request；两者直接同时控制同一资源时可能相互干扰。临时存储同样可请求、限制并触发调度或驱逐。

**版本边界**：CPU manager、MemoryQoS、cgroup v1/v2 及 Pod 级资源的行为随版本、feature gate 和节点配置不同，回答时应锁定环境。

---

### Q8：Deployment、StatefulSet、DaemonSet 和 Job 如何选择？

Deployment 适合无状态、Pod 可互换且需要滚动更新的长期服务；StatefulSet 提供稳定 ordinal、稳定网络身份和按副本关联的持久卷，适合身份或启动顺序有意义的系统；DaemonSet 保证匹配节点运行守护 Pod，常用于日志、网络和设备 agent；Job 表达有完成条件的批任务，CronJob 负责按计划创建 Job。

选择标准是身份、完成语义、拓扑和升级方式，不是简单按“有没有磁盘”。StatefulSet 不会替数据库复制、选主或一致性协议；Job 的重试也可能导致业务动作重复，副作用必须幂等。CronJob 不是严格 exactly-once 定时器。

**常见追问**：固定 rank 的训练可由专用训练控制器或批作业对象管理，不应只因需要多个副本就用 Deployment。StatefulSet 的 Pod 管理策略、PVC 保留策略以及 Job 的 indexed mode 均有版本边界，应按目标 API 确认。

**易错点**：控制器保证的是对象生命周期语义，不保证应用自身的数据正确性。

---

### Q9：Service、Ingress/Gateway 与 CNI 各解决什么问题？

CNI 插件负责给 Pod 配置网络，使 Kubernetes 的 Pod 网络模型落地。Service 用稳定虚拟 IP/DNS 指向动态 Pod 集合，并提供四层流量分发；EndpointSlice 保存可扩展的后端端点。Ingress 描述有限的 HTTP(S) 入口规则，必须有对应 controller 才会生效；Gateway API 进一步提供角色分离和更可扩展的路由模型。

Service 数据面可能由 iptables、IPVS、eBPF 或云平台实现，Service 对象本身不是一个固定代理进程。readiness 会影响 Pod 是否进入可服务端点。NetworkPolicy 声明 L3/L4 允许规则，只有 CNI 支持并执行时才有效，也不能代替 L7 身份鉴权。

**常见追问**：NetworkPolicy 不是创建后全局默认拒绝；通常要有选择目标 Pod 的 ingress/egress 策略，方向才进入隔离。入口实现、Gateway API 成熟度和数据面细节均有版本边界。

**易错点**：不要把 CNI、Service Mesh 和 Ingress Controller 混成同一层。

---

### Q10：PV、PVC、StorageClass 和 CSI 的职责边界是什么？

PVC 是用户对容量、访问模式和存储类别的需求声明；PV 是集群存储资源抽象；StorageClass 定义动态供给类别与参数；CSI 是 Kubernetes 调用存储驱动执行 provision、attach、mount 等操作的标准接口。动态供给时，PVC 驱动 provisioner 创建后端卷和 PV，绑定后由节点侧完成挂载。

存储拓扑也会约束调度。`WaitForFirstConsumer` 将供给或绑定推迟到已知 Pod 候选拓扑后，避免卷创建在不可达可用区。访问模式表示驱动支持的挂载能力，不是应用级一致性协议；RWX 不会自动提供分布式锁。

**常见追问**：删除 PVC 后数据保留还是删除由 reclaim policy、控制器和后端共同决定；快照也不天然等同应用一致备份。RWO、RWOP 等精确行为及支持状态有版本与 CSI 驱动边界。

**易错点**：PV 不是“宿主机目录”的同义词，CSI 也不负责容器网络。

---

### Q11：liveness、readiness 和 startup probe 有什么区别？

liveness 回答“进程是否卡死且重启可能修复”，失败会触发容器重启；readiness 回答“现在能否接新流量”，失败通常只将 Pod 从就绪端点移除；startup probe 给慢启动应用单独的启动窗口，在成功前抑制其他探针。三者不应不加区分地复用同一路径和阈值。

liveness 不宜强依赖所有下游，否则数据库短暂故障可能让所有实例重启；readiness 也不能过敏，否则轻微波动会让容量整体消失。优雅终止通常要先停止接流量，再执行 preStop 或处理 SIGTERM，并在 termination grace period 内排空。

**常见追问**：readiness 失败不会自动把 Pod 迁移到别的节点。HTTP、TCP、exec、gRPC 探针的功能与限制有版本边界，尤其要核对目标 kubelet 行为。

**易错点**：探针只能观察设计好的健康语义，不能替应用做状态恢复或分布式故障判定。

---

### Q12：Kubernetes 中认证、鉴权和 Admission 的顺序与职责是什么？

请求先经认证确认主体，再由鉴权判断该主体是否可对资源执行某个 verb，之后 Admission 对创建、更新等请求做变更或校验，最后才持久化。RBAC 管的是 Kubernetes API 行为，不等于容器内 Linux 权限；ServiceAccount 凭据应限制权限、受众和生命周期。

Role/ClusterRole 描述权限，RoleBinding/ClusterRoleBinding 将权限绑定给主体；前者作用域和组合方式必须区分。Admission Webhook 在 API 写路径上，超时和 failure policy 会直接影响安全或可用性，应设置短超时、充分容量和明确降级策略。Pod Security Admission 可约束 Pod 安全配置，但不能替代运行时隔离、网络策略和节点加固。

**常见追问**：mutating 与 validating 的调用轮次、重入和匹配能力随 Kubernetes 版本演进，不能背某一版本的固定顺序当永久保证。

**易错点**：namespace 是组织与策略作用域，不天然是对抗恶意租户的强隔离边界。

---

## 三、调度与 Volcano

### Q13：kube-scheduler 的一次调度周期做什么？依据是实时利用率吗？

调度器从队列取出未绑定 Pod，在 scheduling cycle 中依次执行预处理、过滤和打分以选定节点，随后执行 Reserve、Permit 等扩展点；通过后进入 binding cycle，执行 PreBind、Bind、PostBind 等动作。Scheduling cycle 通常串行执行，而多个 binding cycle 可以并发，这是为了在正确性与吞吐之间折中。

默认容量判断主要比较 Pod requests 与 Node allocatable，并考虑亲和、污点、卷等约束，不会每次查询 metrics-server 选“实时最闲”节点。实时指标可以通过额外插件或外部系统引入，但指标延迟和短期抖动可能造成调度振荡，必须做平滑、回退和容量兜底。

**常见追问**：节点物理上很空仍报 `Insufficient CPU`，通常是已承诺 request 太多，而非瞬时利用率高。limit 也不是默认放置的唯一依据。

**版本边界**：队列、扩展点和默认插件组合会随 Kubernetes 版本变化，应以目标 scheduler profile 为准。

---

### Q14：Scheduling Framework 的关键扩展点和状态语义是什么？

Filter 判断节点是否可行，Score 只在可行集合中排序；PostFilter 可尝试抢占等补救；Reserve 先做假定或资源预留，后续失败必须由 Unreserve 回滚；Permit 可允许、拒绝或有限等待；PreBind/Bind 完成绑定前处理和最终绑定。QueueSort、PreFilter、PreScore 等分别服务队列和计算复用。

插件可通过 CycleState 在同一次尝试中传递状态，但不能把长时间外部事务无界塞入关键路径。否则一个慢插件会降低全局调度吞吐并扩大故障域。外部调用要有缓存、超时、熔断，预留要可回滚，Bind 要处理幂等和并发竞态。

**常见追问**：Permit 适合协同调度的有限等待；超时或拒绝后必须释放 Reserve 状态。Filter 里做偏好会错误淘汰节点，Score 里做硬约束则可能选出不合法节点。

**版本边界**：扩展点集合、MultiPoint 配置和插件参数属于版本敏感接口。

---

### Q15：常见调度约束如何组合？硬约束和软偏好有什么区别？

资源可容纳性、nodeSelector、required node affinity、required pod affinity/anti-affinity、不可容忍 taint 和卷拓扑通常形成硬过滤条件；preferred affinity、软拓扑分布等参与打分。硬约束保证不违反条件，但组合过强会让候选集为空；软偏好提升可调度性，却不能作为业务正确性保证。

Taint 表示节点排斥，toleration 只表示 Pod 能容忍，并不保证它一定去该节点；node affinity 根据节点标签选位置，pod affinity 根据其他 Pod 的标签和 topologyKey 表达共置或分散。大规模复杂 inter-pod affinity 成本较高，常可用 topology spread 表达更直接的分布目标。

**常见追问**：`NoSchedule` 阻止新放置，`PreferNoSchedule` 是软排斥，`NoExecute` 还可能驱逐不容忍的现有 Pod。

**版本边界**：拓扑分布的默认值、minDomains 等字段和特性状态随版本变化，需核对目标集群。

---

### Q16：Kubernetes 抢占如何工作？是否保证高优任务立即成功？

高优先级 Pod 无法调度时，PostFilter 阶段可寻找一个节点及一组低优先级 victim；若假设移除它们后该 Pod 可行，调度器会提名节点并发起驱逐。victim 仍可能优雅终止，期间节点和集群状态也可能变化，因此 `nominatedNodeName` 不是绑定保证，高优任务也不一定立即启动。

抢占只负责资源重分配，不会保存训练状态。PDB 通常是尽量遵守而非对所有抢占和故障的绝对禁止。GPU 长任务要将抢占成本纳入优先级设计，并配 checkpoint、终止信号处理和可接受的 grace period；否则释放资源容易，恢复业务很难。

**常见追问**：`preemptionPolicy: Never` 表示 Pod 自己不抢占低优 Pod，但仍按优先级参与排队，且自身仍可能成为更高优任务的 victim。

**版本边界**：抢占候选选择和 PDB 处理属于调度器实现细节，不应承诺严格最优或固定顺序。

---

### Q17：为什么分布式训练需要 Gang Scheduling？

同步分布式作业通常要达到最小成员数才可有效运行。普通逐 Pod 调度可能让多个作业各占一部分 GPU 并等待剩余成员，形成“资源被占却无计算”的碎片甚至死锁。Gang/Co-scheduling 以 PodGroup 为准入单位：资源能满足 `minMember` 或最小资源时整体推进，否则等待或回滚预留。

它保证的是成组准入，不是所有进程纳秒级同时启动，也不保证镜像拉取、网络初始化和训练框架都成功。应用仍需 rendezvous、超时、成员发现、故障恢复和 checkpoint。弹性训练可降低最小成员数，但仍应定义一个真正可运行的下限。

**常见追问**：all-or-nothing 通常要求全部成员，min-available 允许达到下限后启动；下限必须计入 chief、parameter server 等关键角色，而不能只数 worker。

**易错点**：StatefulSet 提供身份和顺序，不天然提供 Gang 语义。

---

### Q18：Volcano 的核心架构和调度循环是什么？

Volcano 面向 Batch、HPC 和 AI 作业，核心包含 scheduler、controller 和 admission 等组件。它不仅替换某个 Score 函数，而是引入 Job、PodGroup、Queue 等批调度语义。调度器通常按 session 执行一系列 action，再由 plugin 注入 Gang、公平性、binpack、拓扑等策略。

Action 表示调度流程阶段，例如入队、分配、回填、回收或抢占；plugin 表示这些阶段使用的策略。生产接入应通过 `schedulerName` 等方式明确选择调度器，先对独立命名空间和队列灰度，监控 Pending 原因、队列份额与回收影响，避免与默认调度器重复负责同一 Pod。

**常见追问**：Batch scheduler 必须同时建模 Job 和 Queue，因为单 Pod 最优不等于整作业可运行，也不等于租户间公平。

**版本边界**：action/plugin 名称、默认顺序、配置字段和 CRD API 版本会变化，必须以部署版本为准。

---

### Q19：Volcano Queue 解决什么问题？

Queue 是批资源治理对象，用于承载作业并表达队列权重、优先级、保障、容量和状态。调度器可结合 capacity、proportion、DRF 等策略在队列间分配、借用和回收资源。它解决的是多租户份额与公平，而不只是 FIFO 排队。

Queue 不等于 Kubernetes Namespace：Namespace 是 API 组织和策略作用域，Queue 是调度资源域。平台需要用准入策略建立账号、namespace 到 queue 的合法映射，并明确保障份额、上限、空闲借用、资源回收和饥饿防护。允许借用可提高利用率，但原队列恢复时 reclaim 会给借用方带来中断成本。

**常见追问**：weight 往往参与相对份额计算，不天然等于硬上限；DRF 关注多维资源的 dominant share，capacity 更强调预设容量语义。

**版本边界**：层级队列、deserved/capability 等具体字段及策略行为随 Volcano 版本和插件配置不同。

---

### Q20：Volcano PodGroup 是什么？如何理解 `minMember`？

PodGroup 是一组 Pod 的协同调度描述，是 Gang 语义的载体；它可关联队列、优先级、最小成员和最小资源。PodGroup 本身不创建业务 Pod，Pod 需通过控制器或约定关联到它。达到准入条件后，组内成员才应整体推进。

`minMember` 是最低可运行成员数，不必等于总副本数。设得太低，作业虽然被准入却可能在应用层无法运行；设得太高，则容易长期等待。仅看成员数还可能误判，例如不同角色申请不同 GPU/CPU，因此最小资源可帮助表达真实资源下限。

**常见追问**：PodGroup 的 Running 只表示调度状态推进，不代表所有进程业务健康；创建者可以是 VCJob controller、其他训练控制器或显式配置。

**版本边界**：状态枚举、关联标签/annotation 和 minResources schema 以部署的 Volcano API 版本为准。

---

### Q21：Volcano Job 比原生 Job 多了什么？

VCJob 是 Volcano API 组中的批作业对象，可用多个 task/role 组织作业，每个 task 定义 replicas 和 Pod template，并可配置 `minAvailable`、queue、schedulerName、生命周期 policy 及分布式辅助 plugin。它比原生 `batch/v1 Job` 更适合 MPI、参数服务器或多角色训练。

生命周期 policy 能在 Pod、Task 或 Job 事件后触发重启、终止、完成等动作，但“重启整个 Job”不等于无损续训；训练框架仍要可靠 checkpoint。辅助 ssh、service、env 的 VCJob plugin 也不要与调度器 plugin 混淆。若已有专用训练控制器，应比较其框架语义、弹性能力、生态和运维复杂度再选择。

**常见追问**：`minAvailable` 应覆盖业务真正可运行的角色组合，不只是把所有 task replicas 相加后随意取值。

**版本边界**：Kind 名称可能同为 `Job`，必须结合 API group；字段、事件和 policy 动作按安装版本核对。

---

### Q22：Kubernetes 如何发现和分配 GPU？为什么默认不看 GPU 利用率？

厂商 device plugin 向 kubelet 注册并上报扩展资源，例如 `nvidia.com/gpu`。Pod 申请整数扩展资源后，scheduler 按 allocatable 与已请求数量选择节点；节点侧由 kubelet 和 device plugin 完成具体设备分配、环境或设备注入。传统扩展资源通常不可超卖，request/limit 规则也不同于普通 CPU。

默认 scheduler 知道“还有几个资源实例”，不知道实时 SM 利用率、显存带宽或业务吞吐。指标可由 GPU 监控组件采集，再供观测、自定义调度或扩缩容使用；但将瞬时利用率直接用于放置容易受采样延迟和任务阶段波动影响。型号、显存、互联和健康状态应通过资源命名、标签、DRA 或额外插件表达。

**常见追问**：ListAndWatch 持续报告设备状态，Allocate 在选定设备后返回运行所需配置。整数 GPU 资源不等于共享 GPU。

**版本边界**：DRA 的 API、feature gate 与驱动支持持续演进；扩展资源 request/limit 的精确校验以目标 Kubernetes 版本为准。

---

### Q23：GPU 拓扑为什么显著影响分布式训练和推理性能？

相同数量、相同型号的 GPU，可能经 NVLink/NVSwitch、同一 PCIe Switch、跨 CPU Socket/NUMA 或跨节点网络连接，带宽和延迟差异很大。Tensor/Model Parallel 每层常有 collective，对拓扑最敏感；Data Parallel 的 all-reduce 也依赖 GPU-NIC 亲和与网络能力。

调度不能只数卡，还应按通信模式联合考虑 GPU-GPU、GPU-NIC、CPU NUMA、本地存储和网络拓扑，尽量形成高带宽 clique，同时控制碎片。运行时仍需正确发现 NCCL 拓扑、绑定 CPU 和选择网卡。binpack 可提高卡利用率，却可能把通信密集任务塞入低质量连接，最终有效吞吐反而下降。

**常见追问**：GPUDirect RDMA 主要缩短 GPU 到远端网卡的数据路径；NVLink 提升节点内 GPU 互联。最终要用 collective benchmark 和真实模型验证，不能只看标签。

**版本边界**：P2P、NVLink 和 RDMA 能力取决于 GPU 代际、主板、驱动、IOMMU 与网络配置。

---

### Q24：MIG 与 time-slicing、MPS 有什么不同？

MIG 在支持的 NVIDIA GPU 上将一张卡划成具有专属计算、显存和部分硬件资源的实例，性能与故障隔离通常强于纯时间复用。time-slicing 让多个负载轮转共享 GPU，通常没有独立显存和强 QoS；MPS 让兼容 CUDA 进程并发共享执行资源，其隔离和调度模型又不同。

MIG 适合形状相对稳定的小模型或多租户推理，但 profile 固定、重切分有运维成本，也会限制需要整卡显存或多卡并行的负载。time-slicing 提高可见并发不等于增加物理容量，过载时延迟和 OOM 风险仍需治理。任何方案都不能消除驱动攻击面和全部侧信道。

**常见追问**：Kubernetes 中暴露何种资源名、能否混用整卡和 MIG，取决于 device plugin/operator 配置。

**版本边界**：MIG 支持矩阵、实例 profile、跨实例 P2P/NVLink 能力随 GPU 代际、驱动和固件变化，不能跨代概括。

---

### Q25：GPU 分布式作业的抢占与故障恢复应怎样设计？

调度层抢占只释放资源，应用层要把恢复点持久化。可靠 checkpoint 不仅有模型权重，还可能包括 optimizer、scheduler、随机数、dataloader、全局步数和分片元数据。终止信号到来时可触发保存，但节点断电时没有优雅窗口，所以仍要周期保存到独立可靠存储。

大模型 checkpoint 可按 rank 分片、异步落盘，并用临时目录加原子提交或 manifest 避免读取半成品；由协调者生成最终可见标记，防止所有 worker 争写同一文件。保存频率是在 I/O 写放大和可接受重算量之间取舍。恢复时还要重新 rendezvous、建立 rank，并保证副作用幂等。

**常见追问**：弹性 world size 变化会影响全局 batch、学习率和数据分片语义，不能仅让进程重新加入就宣称等价续训。

**易错点**：`restartPolicy`、preStop 和仅保存 weights 都不足以保证严格续训，更不保证 bitwise 一致。

---

## 四、Agent 运行时

### Q26：Agent Runtime 的控制面与执行面如何划分？

控制面负责接收任务、身份与策略、模型/工具注册、状态机、调度、预算、审批、审计、重试和观测；执行面负责具体模型调用、工具调用、代码、浏览器、文件和环境交互。模型服务物理上可独立部署，但“谁决定可调用什么”和“谁实际执行”必须分开。

两面之间应使用带版本的 task/step spec、结构化 event/result、幂等键和短期 capability。执行 worker 不应持有平台级长期密钥，也不应直接任意改全局状态；控制面不能把执行面返回的自然语言当可信控制指令。拆分的价值是缩小权限、故障和租户影响域，而不只是分别扩容。

**常见追问**：长任务由 lease 与 heartbeat 判断所有权；租约过期后可重派，但必须用单调 attempt/epoch 做 fencing，拒绝旧 worker 的迟到写入，避免双执行。

**易错点**：控制面/执行面不等同于前端/后端；只保存最终回答会丢失恢复和审计所需的步骤因果链。

---

### Q27：可靠 Agent Runtime 的任务状态机应具备什么？

至少区分 queued、leased/running、waiting、succeeded、failed、cancelled 和 timed-out，并为每次 attempt/step 保存输入版本、输出、错误、消耗和因果关系。waiting 还应区分等待模型、工具、人工审批或外部事件，避免把“不占执行资源的等待”伪装成长时间 running。

分布式投递通常只能端到端做到 at-least-once。带副作用的支付、发信、提交代码等动作要使用业务幂等键、去重表、事务性 outbox，必要时先查询再执行。重试要按限流、瞬时网络、确定性校验失败等分类，配截止时间、指数退避、最大次数与预算；取消必须传播到模型请求、工具和 Sandbox。

**常见追问**：消息 ACK 只说明消息被消费，不保证业务 exactly-once。模型调用超时但服务端已计费时，应记录“不确定结果”，用供应商请求 ID 查询或对账，不能盲目重试。

**易错点**：只用 task_id 去重会误杀合法新 attempt；恢复必须固定模型、Prompt 和工具版本。

---

### Q28：Agent 工具调用的安全边界和协议设计重点是什么？

工具定义需要强类型 schema、严格输入校验、明确副作用等级、超时和输出上限，但 schema 只保证形状，不代表授权。真正授权应绑定“主体—任务—工具—参数或资源范围—有效期”，模型即使生成合法 JSON，也必须经过策略引擎；删除、支付、发布等高风险动作应二次确认或人工审批。

网页、文件和工具结果都可能包含 Prompt Injection，应当作不可信数据，不可提升为系统指令。凭据由 broker 在调用时按最小范围临时注入，不能写进 Prompt、轨迹或允许任意 shell 读取的全局环境。网关还要防 SSRF、路径穿越、命令注入，限制网络目的地并记录审计事件。

**常见追问**：MCP 一类协议解决工具互操作，不自动解决工具是否可信、用户是否有权和参数是否安全。读操作也可能泄密或造成昂贵扫描，仍需范围与配额。

**易错点**：不要相信工具 description 能阻止越权，也不要把工具返回内容重新解释为高优先级指令。

---

## 五、LLM 推理与 Sandbox

### Q29：LLM 在线推理中的 prefill 和 decode 有何不同？

prefill 对整段输入并行计算各层表示并建立 KV cache，通常更偏计算密集，直接影响首 Token 延迟 TTFT；decode 每一步生成一个或少量 Token，复用历史 KV，但每步仍需读取大量 KV 并执行 attention，通常更受显存带宽、同步和逐 Token 串行性影响，决定 TPOT。

长 prefill 会占用算力并阻塞已有 decode，系统可用 chunked prefill、优先级、token budget，或将 prefill/decode 分离部署来隔离干扰。分离也会增加 KV 传输、路由和容错复杂度，只有传输成本低于隔离收益时才值得。

**常见追问**：长上下文同时增加 prefill 计算、KV 容量并降低可并发序列数；decode 不是“不再做 attention”，只是避免重算历史 K/V。

**易错点**：不能只看总 tokens/s；交互服务要同时衡量排队、TTFT、TPOT、完成延迟和尾部 SLO。

---

### Q30：KV Cache 保存什么？为什么会成为容量瓶颈？

自回归 Transformer 在每层保存历史 Token 的 Key 和 Value，使后续 Token 不必重算完整前缀。容量近似随并发序列数、上下文长度、层数、KV Head 数、Head Dimension 和数据类型线性增长。模型权重能装入显存，不代表还容得下目标并发所需 KV 与算子 workspace。

分页式 KV 管理减少连续大块预留和碎片；GQA/MQA、KV 量化、前缀复用和卸载可进一步省容量，但分别带来模型结构、精度、命中率、带宽或延迟取舍。活跃 decode 依赖 KV，驱逐后只能重算、换出或终止，不能把它当普通可随意淘汰的结果缓存。

**常见追问**：前缀缓存键至少要覆盖 Token 序列、模型/adapter、位置与模板等影响语义的版本；跨租户共享还要防数据存在性侧信道和内容泄露。

**易错点**：KV Cache 不是模型权重；只按 request 数而不按 Token 数做准入会严重误判容量。

---

### Q31：Continuous Batching 比静态 Batching 好在哪里？

静态 batch 往往等待一批序列整体结束，短请求完成后的槽位会被长请求占住。Continuous/In-flight Batching 在迭代边界加入新请求、移除已完成请求，结合分页 KV 管理，可显著提升 GPU 利用率和吞吐，特别适合输出长度差异大的在线流量。

代价是调度与内存管理更复杂，性能也更难预测。无界增大 batch 会让单轮执行变长，恶化 TPOT 与排队尾延迟；prefill/decode 混批还会互相干扰。因此需要按 Token 的 admission control、最大 batched tokens、优先级、取消回收和 SLO-aware 调度，而不是只设请求数上限。

**常见追问**：吞吐最大化和尾延迟优化通常冲突，可按服务等级分队列、预留 decode 配额，并对长 Prompt 做 chunking。

**版本边界**：不同推理引擎对调度迭代、chunked prefill 和 KV 回收的实现不同，参数不可直接照搬。

---

### Q32：大模型推理并行策略如何选择？

Tensor Parallel 把单层算子切到多卡，每层需要 collective，低延迟场景偏好节点内高带宽互联；Pipeline Parallel 按层切分，降低单卡权重压力，但有级间传输和 pipeline bubble；Data Parallel/Replica 复制模型处理不同请求，扩总吞吐简单，却让每份权重重复占显存；Expert Parallel 用于 MoE 专家分布，通常引入 all-to-all。

选择由模型能否单卡容纳、KV 容量、请求长度分布、拓扑和 TTFT/TPOT SLO 共同决定。卡数增加不保证单请求更快：通信成本可能超过算力收益。通常优先在高带宽域内做 TP，跨节点谨慎扩展；有足够显存时，用更多 replica 往往比扩大单实例并行度更利于吞吐和故障隔离。

**常见追问**：prefill 计算密集，decode 常受带宽限制，两者最优并行度可能不同；MoE 放置要重点考虑专家负载不均和 all-to-all 网络。

**易错点**：不要混淆训练数据并行与推理副本，也不要只给权重留显存而漏掉 KV、通信 buffer 和 workspace。

---

### Q33：Sandbox 设计首先要回答什么威胁模型？

先定义攻击者、资产和允许能力：执行的是可信内部代码、模型偶然生成的错误代码，还是主动恶意的多租户代码；要保护的是宿主内核、邻居租户、控制面凭据、数据、网络还是计费资源；允许哪些 syscall、文件、网络目的地、设备和执行时长。没有这些边界，“用容器还是 microVM”没有可验证答案。

随后组合身份与短期凭据、只读或临时文件系统、最小 syscall/capability、网络默认拒绝与 allowlist、CPU/内存/PID/磁盘/inode/墙钟/输出限制、镜像供应链、销毁和审计。禁公网仍要检查 DNS、metadata service、Unix socket、宿主挂载等通道；资源隔离还要防 fork bomb、写满磁盘和超大 stdout。

**常见追问**：普通容器适合较可信负载；高对抗多租户通常需要用户态内核或独立 Guest Kernel，并隔离管理面。

**易错点**：任何 Sandbox 都有逃逸、侧信道、DoS 和控制面漏洞的剩余风险，不能声称绝对安全。

---

### Q34：gVisor、Firecracker 与 Kata Containers 如何比较？

gVisor 用用户态 Application Kernel 拦截并实现大量 Linux 系统调用，减少工作负载直接触达 Host Kernel 的攻击面，但 syscall 密集、文件或网络 I/O 和兼容性需实测。Firecracker 是基于 KVM 的精简 VMM，用 microVM 提供独立 Guest Kernel 和较小设备模型；隔离通常更强，但平台要管理 Guest、镜像、启动和生命周期。

Kata Containers 是“用轻量 VM 承载 Pod/容器并接入 OCI/CRI/Kubernetes”的集成方案，底层可使用不同 Hypervisor/VMM；它不是 Firecracker 的同义词。选择时要权衡冷启动、内存密度、兼容性、设备/GPU、可观测性和团队运维能力，而不只是比较宣传中的启动数字。

**常见追问**：gVisor 不是传统 VM，Firecracker 也不是完整容器平台；独立 Guest Kernel 降低共享 Host Kernel 风险，却仍暴露 VMM、KVM、设备模型和管理面。

**版本边界**：Kata 可选 VMM、gVisor syscall 支持、快照和设备能力持续变化，必须在目标内核与工作负载上验证。

---

### Q35：代码 Sandbox 的生命周期与数据面应怎样设计？

优先按任务或较窄信任域创建短生命周期环境：从不可变并验证签名的基础镜像启动，只挂载必要输入，注入短期且范围受限的凭据，执行时实施 CPU、内存、PID、磁盘、inode、墙钟和输出配额；默认拒绝网络，只放行业务需要的域名、IP 和协议；收集结构化结果与审计后销毁环境及密钥。

warm pool 可降低冷启动，但跨租户复用前必须可信地清理内存、进程、文件、挂载、网络连接和缓存，`rm -rf` 工作目录远远不够。snapshot/restore 还可能复制随机数状态、机器身份、过期 Token 或连接，应在恢复后重新生成和注入。外网 allowlist 需防 DNS rebinding，并在实际连接处再次校验解析结果。

**常见追问**：低冷启动和强隔离可通过预启动无密钥基线、快照后再注入身份、分租户池和容量预测折中。

**易错点**：绝不把 Docker Socket、特权模式或任意 hostPath 暴露给不可信 Sandbox；只限 CPU/内存也不足以防资源型 DoS。

---

## 六、Agentic RL 训练环境

### Q36：Agentic RL 的端到端基础设施流水线是什么？

训练侧发布带版本的 policy；rollout worker 从环境池获取任务，调用推理服务执行多步模型—工具—环境交互，生成轨迹；reward/verifier 对终局或过程评分；系统完成过滤、分组、优势估计后送入训练；新 checkpoint 经评估再发布，形成 `policy → rollout → environment → trajectory → reward → train → publish` 闭环。

瓶颈不是单一 GPU tokens/s。Episode 有长尾，环境依赖 CPU、I/O 或浏览器，verifier 也可能昂贵；系统应解耦训练 GPU、推理 GPU 与环境资源，用异步队列、背压、并发预算和取消机制提高“有效 Episode/正确轨迹吞吐”。还要把环境故障、平台超时和模型失败分开标记，不能一律给零奖励。

**常见追问**：on-policy 要求轨迹接近当前策略；异步虽提高利用率，却增加 policy lag。near/off-policy 是否可用取决于算法及其校正假设。

**易错点**：Agentic RL 不是简单的“生成最终答案、打分、再做 SFT”，多步动作和环境状态是训练信号的一部分。

---

### Q37：为什么环境池是 Agentic RL 的核心？

Agent Episode 常需要浏览器、Shell、代码仓库、数据库或游戏等有状态环境。环境池负责镜像与数据版本、预热、租约、reset、seed、快照、并发上限、健康检查、隔离和销毁，让大量 rollout worker 可以稳定使用昂贵环境。每个 Episode 必须获得逻辑独立状态，reset 后还要验证基线，不能只假设进程退出就干净。

调度的核心矛盾是 GPU 推理快而环境 step 可能慢且长尾。可用异步 actor、有限预取和背压减少 GPU 空转；若交互频繁且状态大，可将 actor 与环境共置以减少 RPC，但会降低独立扩缩容和故障隔离。预取过多则会积压旧 policy 轨迹。

**常见追问**：step RPC 适合轻状态和独立伸缩；共置适合高频低延迟交互。snapshot 恢复还要控制 seed、时钟、并发和外部服务，通常只能做到定义边界内可复现。

**易错点**：必须记录镜像 digest、数据版本和 seed；环境 crash、任务不可解、模型主动终止要使用不同终止原因。

---

### Q38：轨迹、Reward 和 Verifier 应如何设计与存储？

轨迹应逐步保存 observation、模型实际可见上下文、action/tool call、tool result、时间与资源消耗、终止原因，以及 policy、tokenizer、Prompt、工具、环境和 verifier 版本。按算法需要，还要保存 Token ID、采样参数、行为策略 logprob、value 和 mask。只存 Prompt 与最终回答，无法重放多步 Agent，也无法解释错误发生在哪一层。

Reward 可是稀疏终局分数、过程分数或多目标向量；Verifier 优先采用可执行测试、形式检查或可信规则，但测试也可能 flaky、超时或被泄露。应将 verifier 放在独立只读测试环境，区分基础设施失败与任务失败，并通过隐藏测试、污染检测、对抗评估和人工抽检降低 reward hacking。

**常见追问**：可执行 verifier 不是天然正确；需对测试版本、超时策略和不确定结果建模。工具输出截断也必须记录，否则训练看到的上下文与执行时不一致。

**易错点**：Reward Model 分数是代理目标而非客观真值；不能让 Agent 修改 verifier 的测试文件或评分程序。

---

### Q39：如何保证训练与推理版本一致，避免算错 Ratio 或优势？

每条 rollout 必须固定并记录权重 checkpoint/digest、adapter、tokenizer、chat template、system prompt、tool schema、采样配置、推理引擎及数值配置、环境和 verifier 版本。PPO 类方法的 importance ratio 必须让“生成该 Token 的 behavior-policy old logprob”与当前策略在同一 Token、mask 和概率定义下对齐。

即使权重相同，tokenization、截断、stop token、temperature、量化、算子精度和推理引擎差异也会使 logprob 不同。异步系统应限制最大 policy lag，按 policy version 分桶并设置轨迹 TTL；无法验证或过旧的数据应丢弃，或仅交给明确支持相应 off-policy correction 的算法，不能静默混入 on-policy batch。

**常见追问**：训练侧重算 old logprob 与推理服务返回值可能因模板、采样后处理和数值实现不同而偏离；LoRA 热切换和 speculative decoding 还要求记录实际生效 adapter、最终采样分布与接受路径。

**易错点**：只记录模型名称远远不够；也不能用新 tokenizer 重新解释旧轨迹，或把 temperature 后的行为分布与未经同样变换的 logits 混算。
