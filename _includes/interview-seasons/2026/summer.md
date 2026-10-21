## Java、JVM 与 Spring

### 1. 类加载的过程是什么？

> 来源：字节 AI 应用开发一面，7 月 21 日；本轮追问：JVM 的类加载完整过程以及双亲委派模型的核心逻辑是什么？ / JVM 通过什么具体机制保证核心类库不被自定义类加载篡改？ / 双亲委派的层级委托逻辑是什么？自定义一个与核心类库完全同名的类（如 java.lang.String），会被 JVM 加载吗？（[27秋招-恒生电子AI面试-AI应用开发岗-26.9.23](https://www.nowcoder.com/feed/main/detail/e7981675c7a44b098d97e90a854f9c3c)）；[移动卓望AI面10.17](https://www.nowcoder.com/feed/main/detail/2dcc16b1678d42beac2c7f5270f6ff0c)

JVM 经加载、验证、准备、解析、初始化得到可用类。加载读取字节码并创建 `Class` 元数据；验证保证格式和类型安全；准备为静态字段分配内存并设默认值；解析把符号引用转为直接引用；初始化执行类初始化方法。双亲委派减少核心类被重复或恶意替换，但 SPI、容器隔离等场景会有受控打破。

**追问补充**：静态字段与静态块按初始化规则执行；在常见的 super 调用置于首位的构造形式中，父类构造之后执行本类实例字段、实例块，再执行后续构造语句。Java 25 允许受限的构造前置语句，不能把所有构造语句均在父构造之后当作无版本边界的规则，见 [JLS 对象创建过程](https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.5)。

---


双亲委派是先让父加载器按层级向上尝试，父加载器找不到时才由子加载；启动类加载器负责核心类库，且禁止非启动加载器定义 `java.*` 类。自定义 `java.lang.String` 会在定义阶段失败，通常抛出 `SecurityException`，不会替换核心类。
### 2. Spring AOP 在哪些情况下会失效？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日；[10.15 金蝶软件 软开（Ai）一面](https://www.nowcoder.com/discuss/939924708173037568)

典型情况包括同类内部 `this.method()` 自调用绕过代理、目标方法不可被代理覆盖、对象不是 Spring 管理的 Bean、切点表达式未命中，以及代理类型与调用方式不匹配。排查先确认注入的是代理对象、实际调用路径和事务/切面日志；自调用可通过拆分 Bean 或显式走代理解决，但不要为套 AOP 扭曲类职责。

**追问补充**：Spring AOP 的 MethodInterceptor 属于方法调用代理链，Servlet Filter 作用于请求链，MVC HandlerInterceptor 作用于处理器调度，这三者不是同一层。多个切面的顺序可用明确的排序规则控制，同优先级不依赖偶然顺序；排查时先确认实际经过哪条调用链。

---

### 3. Spring 如何处理循环依赖？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日；[移动卓望AI面10.17](https://www.nowcoder.com/feed/main/detail/2dcc16b1678d42beac2c7f5270f6ff0c)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)

单例 Bean 的 setter/字段循环依赖可通过提前暴露对象工厂和早期引用解决，三级缓存还要保证 AOP 场景拿到一致代理。构造器循环依赖在对象实例化前就互相等待，无法用早期引用解决。更重要的工程结论是：循环依赖通常提示职责边界不清，应优先重构，而不是依赖容器开关掩盖设计问题。

**追问补充**：IoC 是由容器负责 Bean 的创建、依赖注入和生命周期管理；AOP 通常通过代理织入事务、日志等横切逻辑。循环依赖时应确保提前暴露的是最终代理语义，避免一方持有原对象、一方持有代理。

---

### 4. Spring MVC 的请求处理流程是什么？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日；[宏图智能一面](https://www.nowcoder.com/discuss/934206754898866176)

请求进入 `DispatcherServlet`，通过 `HandlerMapping` 找到处理器和拦截器链，再由 `HandlerAdapter` 完成参数解析并调用 Controller。返回值经消息转换器写 JSON，或由视图解析器渲染；异常交给异常解析器。过滤器位于 Servlet 容器层，拦截器位于 MVC 调用链，两者边界不同。

---

### 5. CMS 垃圾收集器的流程和问题是什么？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日；[淘天 AI应用研发 一面](https://www.nowcoder.com/discuss/942091198347345920)

CMS 经初始标记、并发标记、重新标记和并发清除，目标是缩短停顿。它与应用并发工作会消耗 CPU，清除阶段产生空间碎片，并发期间新产生的垃圾要到下次处理；预留空间不足可能发生并发模式失败并退化为长停顿。新版本 JDK 已移除 CMS，面试时应同时了解 G1/ZGC 的替代背景。

---

### 6. 面向对象的三大特性是什么？抽象类和接口怎么选？

> 来源：某 Java 岗，8 月 12 日；[科大讯飞面试挺有意思，不考八股不问项目](https://www.nowcoder.com/feed/main/detail/773d1337e7314a7d90985fd81510974d)

- **封装**：隐藏内部状态，通过稳定接口维护对象不变量。
- **继承**：复用和扩展已有行为，但会形成较强的父子耦合。
- **多态**：面向抽象编程，由运行时实际类型决定具体行为。

抽象类适合表达“同一类对象的共同状态和默认实现”，可以有构造器、成员变量和非抽象方法；接口适合表达“能力契约”，支持一个类实现多个接口。工程上优先组合和接口，只有确实存在稳定的 `is-a` 关系、需要共享状态或模板方法时再使用继承。

---

### 7. Java 运行过程中 GC 越来越频繁，如何排查？

> 来源：某 Java 岗，8 月 12 日；字节 Agent 开发一面，8 月 9 日；[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)

先区分是 Young GC 频繁还是 Full GC 频繁，再用数据定位：

1. 查看 GC 日志和监控中的分配速率、晋升速率、停顿时间、堆各区域占用。
2. 用 `jstat` 观察趋势，用 `jcmd`/`jmap` 导出堆快照，用 MAT 分析大对象、引用链和疑似泄漏点。
3. Young GC 频繁通常是对象分配过快或新生代太小；Full GC 频繁还要检查老年代增长、元空间、直接内存、显式 `System.gc()` 和晋升失败。
4. 先修复对象生命周期、无界缓存、监听器未释放等代码问题，再考虑调整堆大小、分代比例或选择 G1/ZGC。只扩大堆会延后问题，不会消除泄漏。

**追问补充**：`jps` 列出 Java 进程及 PID；`jstat` 查看 GC、各代容量和变化趋势；`jmap` 查看堆直方图或导出堆快照，需注意暂停与线上风险；`jstack` 导出线程栈，用于定位死锁、阻塞和热点线程。 工具能力与影响需按运行 JDK 核对，也可用 [jcmd](https://docs.oracle.com/en/java/javase/25/docs/specs/man/jcmd.html) 的诊断命令；堆转储前确认磁盘与停顿预算。

**追问补充**：GC/JVM 治理是围绕稳定性、延迟和资源成本建立持续管理闭环：统一监控 GC、堆、线程和类加载基线，制定告警与容量边界，结合日志和快照定位问题，变更后压测验证，并沉淀参数、发布和故障处置规范。

---

### 8. JVM 为什么要划分新生代和老年代？

> 来源：字节 Agent 开发一面，8 月 9 日；本轮追问：JVM 垃圾回收是怎样的？（[CVTE 一面](https://www.nowcoder.com/discuss/932319671578030080)）

依据是**弱分代假说**：绝大多数对象朝生夕死，少数对象会长期存活。新生代使用复制算法，回收频繁但只复制少量存活对象；经过多次回收仍存活的对象晋升老年代，老年代用标记整理等算法降低空间浪费。

分代的价值是让回收策略匹配对象生命周期，避免每次都扫描整个堆。需要补充的是，超大对象可能直接进入老年代，跨代引用还要靠记忆集和写屏障避免全堆扫描。

---


GC 通常从 GC Roots 出发做可达性分析，回收不可达对象；复制式收集会搬迁存活对象，标记整理会清除垃圾并压缩空间。部分收集器把标记、清扫或整理并发化，但仍需在安全点短暂停顿，并通过写屏障维护跨代或并发标记的正确性。
### 9. HashMap 在 JDK 7 和 JDK 8 中有哪些关键差异？

> 来源：百度内容营销与广告一面，8 月 12 日；[字节 AI 全栈一面（飞书）](https://www.nowcoder.com/discuss/931555466247700480)；[携程AI 面试复盘](https://www.nowcoder.com/discuss/932274641865887744)；[九方智投 一面凉经](https://www.nowcoder.com/feed/main/detail/92efed84eb68493d82132e03b7e43ae0)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)

JDK 7 的桶内结构主要是数组 + 链表，扩容迁移使用头插，在并发误用时可能形成环；JDK 8 改为尾插，并在冲突严重时把链表树化为红黑树，降低极端查询复杂度。JDK 8 还重写了扰动和扩容迁移逻辑，节点迁移时可根据新增的高位直接分到原位置或 `原位置 + oldCap`。

无论哪个版本，`HashMap` 都不是线程安全容器。并发读写应使用 `ConcurrentHashMap`，而不是因为 JDK 8 不易形成环就把它当成线程安全。

**追问补充**：put 时先计算哈希并定位桶，空桶直接放入，冲突则遍历链表或树并覆盖相同 key；元素数超过容量与负载因子乘积时扩容，通常容量翻倍并按高位规则迁移到原位置或原位置加旧容量。

---

## 并发与语言运行时

### 10. Java 线程池的执行流程是什么？

> 来源：字节 AI 应用开发一面，7 月 21 日；本轮追问：线程池的7个参数是什么？ / 线程池的3大方法是什么？（[浙江未讯科技](https://www.nowcoder.com/feed/main/detail/b6822699408a4ab1906c32a1e0fc7517)）；[字节跳动Agent开发1面凉经](https://www.nowcoder.com/discuss/929406267141914624)；本轮追问：拒绝策略中的主线程执行，这个主线程指的是什么？（[字节全栈一面](https://www.nowcoder.com/feed/main/detail/a01aeac81ad342d88252f899c47f2dc4)）；[9.14字节推荐架构一面](https://www.nowcoder.com/feed/main/detail/467d01beed8a40b89ac414b90fc7fb85)；本轮追问：线程池有几种创建方式？Executor 有几种方式？（[迅雷 Agent一面](https://www.nowcoder.com/discuss/932392798559432704)）；[美的一面](https://www.nowcoder.com/feed/main/detail/ae2e686858614c5d88e20b9b6a7f77b3)；[小红书产品工程师agent开发一面](https://www.nowcoder.com/feed/main/detail/f0950469136e47b0828373cfeefd82ce)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)

提交任务后，工作线程少于 `corePoolSize` 时先创建核心线程；否则尝试入队；队列满后再创建非核心线程，直到 `maximumPoolSize`；仍无法接收时执行拒绝策略。设计时必须说明队列是否有界、任务是否允许阻塞、拒绝后如何降级，以及如何监控活跃线程、队列等待和任务耗时。

---


七个参数是 corePoolSize、maximumPoolSize、keepAliveTime、TimeUnit、BlockingQueue、ThreadFactory 和 RejectedExecutionHandler。常说的三大方法通常指 execute、submit、shutdown（分别提交任务、获取 Future、停止接收任务）；面试时应先确认题目口径。

拒绝策略中的“主线程”通常是提交任务的调用方线程，不是线程池内部固定线程；CallerRuns 会让它同步执行任务，既能背压，也可能拖慢请求线程。创建方式可用 ThreadPoolExecutor 手动配置，也可用 Executors 的固定、单线程、缓存、定时等工厂方法；后者需警惕无界队列或线程数失控。
### 11. 如果重新设计线程池，要考虑哪些模块？

> 来源：字节 AI 应用开发一面，7 月 21 日；本轮追问：线程池涉及哪些参数？线程池的线程数如何确定？ / CPU密集型任务的核心线程数是核数+1，为什么要+1？ / 拒绝策略都有哪些？你觉得这四种拒绝策略分别适用于哪些场景？ / 有哪些典型的场景会用到“主线程”这个拒绝策略？在这种拒绝策略下会不会造成主线程被压的问题？（[字节全栈一面](https://www.nowcoder.com/feed/main/detail/a01aeac81ad342d88252f899c47f2dc4)）；本轮追问：为什么每个数据源使用独立线程池，能否共享一个召回线程池？ / I/O 型与 CPU 型任务哪个需要更多线程，线程池参数怎样确定？（[9.14字节推荐架构一面](https://www.nowcoder.com/feed/main/detail/467d01beed8a40b89ac414b90fc7fb85)）；本轮追问：第二个实习多数据源并发召回为什么用专用线程池，不共享会防住什么问题？（[9.15秋招东方财富AI应用一面](https://www.nowcoder.com/feed/main/detail/d406314e733c4fc8945637ce5d06cdcf)）；本轮追问：说说你对线程池、生产者消费者和任务队列的理解。（[腾讯 TEG 云架构平台部一面、二面面经](https://www.nowcoder.com/feed/main/detail/6aa13bf7472441bb9c5174ee8e7af078)）；[小红书产品工程师agent开发一面](https://www.nowcoder.com/feed/main/detail/f0950469136e47b0828373cfeefd82ce)

需要任务队列、Worker 生命周期、核心/最大线程数、空闲回收、拒绝策略、异常隔离和关闭状态机。生产实现还要有背压、优先级/公平性、上下文传播、超时取消、指标与动态配置。难点不在“能启动线程”，而在竞争条件、任务丢失、关闭时序和过载保护。

---


线程数应按任务性质和实测调参：CPU 型通常接近核数，+1用于线程偶发阻塞时维持利用率；I/O 型可更多，但受等待比例、队列和下游容量约束。拒绝策略包括抛异常、调用方执行、丢弃、丢弃最旧任务；调用方执行会让提交线程变慢，形成背压，可能压住主线程。多数据源宜独立线程池隔离队列和故障，共享池则需配额、优先级与超时。
### 12. 双重检查单例为什么需要 `volatile`？

> 来源：字节 AI 应用开发一面，7 月 21 日；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)

对象创建可抽象为分配内存、执行构造和发布引用。没有 `volatile` 时，发布引用可能被重排序到构造完成之前，其他线程读到非 null 引用却看到未初始化状态。`volatile` 提供可见性并禁止相关重排序；锁保证只有一个线程创建。更简单可靠的实现通常是枚举或静态内部类。

**追问补充**：`volatile`适用于状态标志、配置发布和单次引用发布等场景；它只保证读写可见性及有序性，不保证 `count++` 等复合操作的原子性。需要原子类或锁保护“读—改—写”全过程；排查应检查共享变量是否存在复合更新。

---

### 13. Go 的 Channel 和 `Mutex` 怎么选？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日；[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60)

Channel 适合传递数据所有权、编排流水线和事件通知；`Mutex` 适合保护共享内存中的短临界区。Channel 并不天然更快，也可能阻塞、泄漏 goroutine 或形成死锁。能把状态归属到单个 goroutine 时优先消息传递；简单计数器或共享结构用锁通常更直接。

**追问补充**：除 GMP 外，还可用原子操作、`RWMutex`、`WaitGroup`、`Once`、`Context` 和 `select` 实现同步、取消与超时。Goroutine 配合 Channel 适合流水线、worker pool、fan-out/fan-in 和事件通知；若只是保护简单共享状态，直接使用锁更清晰。

---

### 14. GMP 调度中 P 没有本地任务时怎么办？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日；本轮追问：介绍一下Go的GMP调度原理。（[度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368)）；[【面经】字节/AI 应用工程师 一面挂经……](https://www.nowcoder.com/discuss/933023499399024640)；[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60)

P 优先从本地队列取 G，也会周期性检查全局队列；本地为空时尝试从其他 P 偷取一半任务，再检查全局队列、网络轮询器和定时器。系统调用阻塞时，M 可与 P 分离，让 P 绑定其他 M 继续运行。`GOMAXPROCS` 控制同时执行 Go 代码的 P 数量，而不是 goroutine 总数。

**追问补充**：Go 的并发机制还包括 goroutine、channel、`Mutex/RWMutex`、原子操作，以及 `WaitGroup`、`Once`、`Cond`、`Context` 和 `select` 等。它们分别用于并发执行、消息传递、共享状态保护、同步等待、取消和超时控制。

---

### 15. Java 中常见的锁有哪些？`synchronized` 的锁升级怎么理解？

> 来源：字节 Agent 开发一面，8 月 9 日；四维纵横三面，8 月 12 日；本轮追问：Java锁的实现方法有哪些？（[九方智投 一面凉经](https://www.nowcoder.com/feed/main/detail/92efed84eb68493d82132e03b7e43ae0)）；[字节AI全栈二面](https://www.nowcoder.com/discuss/938145178114592768)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)

常见同步手段包括 `synchronized`、基于 AQS 的 `ReentrantLock`/读写锁、CAS 原子类、`StampedLock`。选型先看是否需要可中断、超时、公平性、多个条件队列或乐观读；普通互斥场景优先使用语义简单、自动释放的 `synchronized`。

经典 HotSpot 实现会根据竞争程度使用偏向、轻量级和重量级形态，但偏向锁已经在新版本 JDK 中移除。回答时不要把“锁升级路径”背成永远不变的语言规范，它是 JVM 实现细节；核心是低竞争时尽量用 CAS 和栈上锁记录，高竞争时膨胀为监视器，避免持续自旋浪费 CPU。

**追问补充**：ReentrantLock 支持重入，通常用 AQS 的 state 记录持有次数，并记录当前 owner；同一线程再次加锁只递增 state。每次 unlock 递减计数，归零后清除 owner 并唤醒等待线程；非持有线程释放会失败，必须保证加锁与释放次数匹配。 重入和释放契约见 [ReentrantLock 文档](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)。

`synchronized`基于对象监视器实现互斥，同一对象的临界区同一时刻仅一个线程进入，并支持可重入。进入时获取监视器，退出或异常时释放；解锁还建立后续线程可见性，保证临界区内共享数据的内存语义。

---

### 16. 双重检查单例为什么必须配合 `volatile`？

> 来源：四维纵横三面，8 月 12 日

```java
public final class Singleton {
    private static volatile Singleton instance;

    private Singleton() {}

    public static Singleton getInstance() {
        Singleton local = instance;
        if (local == null) {
            synchronized (Singleton.class) {
                local = instance;
                if (local == null) {
                    local = new Singleton();
                    instance = local;
                }
            }
        }
        return local;
    }
}
```

创建对象可抽象为分配内存、执行构造、发布引用。没有 `volatile` 时，发布引用可能被重排序到构造完成之前，其他线程便可能读到“非 null 但未完成初始化”的对象。`volatile` 同时提供可见性和禁止相关重排序的内存语义。更简洁的实现是静态内部类或枚举单例。

---

## 操作系统与 Linux

### 17. 进程、线程、协程有什么区别？

> 来源：百度后端一面，8 月 6 日；百度 Agent 开发二面，8 月 12 日；[百度 Agent 二面（FastAPI 异步追问）](https://www.nowcoder.com/feed/main/detail/bca7dc14bd654e91b89792608111b211)；本轮追问：进程和线程有什么区别？浏览器为什么采用多进程架构？（[度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368)）；本轮追问：Goroutine跟Java线程池中的线程两者相比有什么区别？（[字节跳动Agent开发1面凉经](https://www.nowcoder.com/discuss/929406267141914624)）；[字节 aime 一面 9.10](https://www.nowcoder.com/feed/main/detail/ed5e9d17f26e489da94afbf1241b885e)；本轮追问：阻塞状态的 goroutine 是怎么处理的？和线程有什么不同？ / goroutine 和线程切换的时候，有什么不同？（[【面经】字节/AI 应用工程师 一面挂经……](https://www.nowcoder.com/discuss/933023499399024640)）；[阿里云 Agent开发 一二面](https://www.nowcoder.com/feed/main/detail/fee780e1140147fbbad0f23a74e265c6)；[字节 260907 一面面经](https://www.nowcoder.com/discuss/935858952644939776)；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)；[水滴AI全栈一面](https://www.nowcoder.com/feed/main/detail/ae70e9823b9f40cead0f8016b949b7c2)；[网易互娱｜AI应用开发实习一面](https://www.nowcoder.com/feed/main/detail/2d982457b8b94da09fab383e275de93d)

| 维度 | 进程 | 线程 | 协程 |
|------|------|------|------|
| 资源 | 独立地址空间和系统资源 | 共享进程资源，有独立栈和寄存器 | 在线程内共享资源，有独立执行状态 |
| 调度者 | 内核 | 内核 | 用户态运行时/事件循环 |
| 切换成本 | 最高 | 中等 | 最低 |
| 隔离性 | 最强 | 较弱 | 最弱 |

协程适合大量 IO 等待任务，因为 `await` 时主动让出执行权，少量线程就能管理大量连接；CPU 密集任务仍需要多进程、原生线程或任务下沉，协程本身不会让单核代码并行。

FastAPI 中 `async def` 路由只有在等待真正的异步 IO 时，`await` 才会把执行权还给事件循环；如果在其中直接调用阻塞 SDK、`time.sleep` 或重 CPU 函数，事件循环线程仍会被卡住。普通 `def` 路由会由框架放入线程池，但在 `async def` 内调用同步函数不会自动下沉。优先使用异步客户端；无法替换的阻塞 IO 显式送线程池，CPU 密集任务送进程池或独立服务。这一边界可对照 [FastAPI 官方并发说明](https://fastapi.tiangolo.com/async/)。

**追问补充**：以常见 JVM 实现为例，堆和方法区由线程共享，虚拟机栈、程序计数器等是线程执行状态。同步与异步描述调用方如何等待或获取结果，并发与并行描述任务推进和同时执行；单线程也能异步并发等待 I/O，CPU 并行程度才与工作线程、核心及资源配额有关。

---


浏览器采用多进程可隔离标签页、渲染器和插件，单个页面崩溃或被攻击时不会直接拖垮整个浏览器，但会增加内存与进程通信开销。Goroutine由运行时复用少量线程调度，创建和切换轻；Java线程池管理的是内核线程，通常通过有界队列、拒绝策略控制并发，线程被阻塞时会占用池中资源。

Goroutine 阻塞在 channel、锁或网络 IO 时会被运行时标记为等待，调度器可让出其所在线程去运行其他可运行 goroutine；若调用不可抢占的阻塞系统调用，可能占住线程，需异步化或隔离。切换主要保存用户态执行上下文，由运行时调度，通常不涉及线程级内核调度；线程阻塞则直接占用该线程并触发内核调度。
### 18. 一个进程的内存布局是什么？哪些区域容易溢出？

> 来源：百度后端一面，8 月 6 日；百度内容营销与广告一面，8 月 12 日；[字节 AI Agent 研发一面](https://www.nowcoder.com/feed/main/detail/2ba7e96d48634777990b28c2cb322f40)

典型进程包含代码段、只读数据、已初始化数据段、BSS、堆、内存映射区和线程栈。堆通常向高地址增长，栈通常反向增长，动态库和 `mmap` 文件位于映射区，但具体布局受操作系统、架构和 ASLR 影响。

- 栈溢出：递归过深或单帧局部数据过大。
- 堆耗尽：泄漏、无界缓存或大对象持续分配。
- 元空间/类加载区耗尽：动态生成类或类加载器泄漏。
- 直接内存耗尽：NIO/本地库分配未受 Java 堆上限直接约束。

---

### 19. `malloc` 和 `free` 的内部原理是什么？

> 来源：百度后端一面，8 月 6 日；[阿里千问平台开发复活赛一面](https://www.nowcoder.com/feed/main/detail/141447389dab4e8e9ca6db742a514f39)

`malloc` 通常先从用户态分配器维护的空闲链表或 size class 中找合适块，小块复用 arena 中的内存，大块可能通过 `mmap` 单独映射；不足时再向内核申请页。`free` 不是简单“把内存清零”，而是把块归还分配器，尝试与相邻空闲块合并，满足条件时才把页归还操作系统。

主要问题包括内部/外部碎片、多线程锁竞争、double free、use-after-free。面试时可进一步说明 jemalloc/tcmalloc 通过线程缓存、分级空闲链表等方式降低竞争和碎片。

---

### 20. 进程间通信有哪些方式？共享内存为什么快、难点是什么？

> 来源：百度后端一面，8 月 6 日；[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)；[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60)

IPC 包括管道/FIFO、消息队列、共享内存、信号、Socket、内存映射文件等。共享内存建立映射后，多个进程直接访问同一物理页，传输大块数据时避免反复在内核缓冲和用户缓冲之间复制，因此吞吐高。

但共享内存只解决“共享”，不解决“一致性”。还需要互斥锁、信号量、无锁协议或版本号处理并发访问，并设计对象布局、生命周期和崩溃恢复。小消息或跨机器通信通常更适合 Socket/消息队列。

**追问补充**：终端直接输入 ls 本身不是一种 IPC：终端模拟器通常通过伪终端（PTY）把输入交给 shell，shell 再 fork/exec 启动 ls；若命令写成 ls | grep，则进程间的数据传递明确使用管道。

**追问补充**：共享内存可由约定的所有者创建，参与进程按协议映射，并通过信号或控制通道结束工作；退出时分别关闭本进程句柄、解除映射，再按引用与所有权规则删除命名对象。超时、异常退出和重复清理均需处理，不能把所有 IPC 都假定为父进程创建、子进程退出后才可释放的单一模式。

---

### 21. `select`、`poll`、`epoll` 的区别是什么？

> 来源：百度后端一面，8 月 6 日；字节后端社招二面，8 月 6 日；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)；[字节跳动 - Agent 研发 - 一面](https://www.nowcoder.com/feed/main/detail/0b91e9f5fbba4af4865c6fadc9a790e8)

`select` 使用固定大小位图，每次调用都要复制集合并线性扫描；`poll` 改成数组，去掉固定上限，但仍需复制和 O(n) 扫描。`epoll` 通过内核维护关注集合和就绪队列，事件到达时回调加入就绪链表，应用只处理活跃 FD，适合连接多但同时活跃少的场景。

`epoll` 不是所有场景都更快：FD 很少或几乎全部活跃时，维护红黑树、回调和事件结构也有成本。还要能解释 LT/ET：边沿触发通常要求非阻塞 IO，并持续读写到 `EAGAIN`。

---

## 网络、HTTP 与实时通信

### 22. HTTP 和 RPC 有什么区别？

> 来源：百度后端一面，7 月 30 日；[拼多多 AI 全栈两轮技术面](https://www.nowcoder.com/discuss/921104232256675840)

HTTP 是协议，RPC 是远程调用抽象，两者不在同一分类层级。RPC 框架通常提供 IDL、代码生成、负载均衡、超时、重试和服务发现，并可使用 HTTP/2；HTTP API 更通用、易调试、浏览器生态友好。选型要看跨组织兼容、性能、治理和版本演进。

---

### 23. WebSocket 和 SSE 有什么区别？分别适合哪些通信场景？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日；[字节跳动火山引擎方舟 Managed Agent 一面，8 月 13 日](https://www.nowcoder.com/discuss/917561494512861184)；[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)；本轮追问：除了 WebSocket 还可以用什么？除了 SSE 还可以用什么？（[cvte应用软件开发一面](https://www.nowcoder.com/feed/main/detail/c2155d2308de452c8a6e3cf2bbb482f3)）；本轮追问：使用 WebSocket 会引发什么其他问题？（[(秋招) 9.16 字节中交广 - 交易与广告业务 - AI全栈开发工程师](https://www.nowcoder.com/discuss/932587389027962880)）；[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)；[字节跳动 - Agent 研发 - 一面](https://www.nowcoder.com/feed/main/detail/0b91e9f5fbba4af4865c6fadc9a790e8)

WebSocket 通常先通过 HTTP Upgrade 握手，再使用持久连接和独立帧协议，客户端与服务端都能主动发送文本或二进制消息。SSE 则是 `Content-Type: text/event-stream` 的长 HTTP 响应，只支持服务端向客户端推送 UTF-8 文本；客户端上行仍使用普通 HTTP 请求。

浏览器的 `EventSource` 原生支持断线重连，并可通过事件 `id` 和 `Last-Event-ID` 请求续传，但服务端仍要保存可重放事件并处理重复消费。WebSocket 协议提供 Ping/Pong 控制帧，但浏览器 JavaScript 不暴露这些底层控制帧，业务保活、重连、鉴权续期、消息序号和断线补偿通常仍由应用层自行设计。

LLM Token 流、任务进度、通知和日志等单向事件流通常优先 SSE；聊天室、协同编辑、实时控制以及高频双向或二进制交互更适合 WebSocket。SSE 更容易复用 HTTP 网关和观测链路，但要关闭代理缓冲并协调空闲超时；WebSocket 则要确认代理升级、长连接路由和多节点扩展。两者都要处理背压、连接上限和慢消费者。

---


WebSocket 之外可选 HTTP 短轮询、长轮询、WebTransport 或 WebRTC，按实时性、双向性和网络兼容性取舍；SSE 之外可用 WebSocket、长轮询、短轮询或 gRPC 流式调用，需补充重连、顺序、心跳与断点续传设计。
### 24. TCP 如何保证可靠？三次握手和四次挥手分别解决什么问题？

> 来源：百度后端一面，8 月 6 日；知乎后端一面，8 月 4 日；小红书数据库智能化二面，8 月 3 日；[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)；[度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368)；[腾讯 TEG 云架构平台部一面、二面面经](https://www.nowcoder.com/feed/main/detail/6aa13bf7472441bb9c5174ee8e7af078)；[字节 260907 一面面经](https://www.nowcoder.com/discuss/935858952644939776)；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)；[水滴AI全栈一面](https://www.nowcoder.com/feed/main/detail/ae70e9823b9f40cead0f8016b949b7c2)

TCP 靠序列号、确认应答、校验和、超时重传、快速重传、滑动窗口、流量控制和拥塞控制共同提供可靠有序字节流。

三次握手让双方确认收发能力并同步初始序列号；两次无法让服务端确认客户端已收到自己的序列号，也更难排除历史连接请求。四次挥手是因为 TCP 全双工，两端发送方向要分别关闭，收到 FIN 的一端可能还有数据未发完，所以 ACK 和自己的 FIN 不一定能合并。

**追问补充**：[TCP 标准](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.5)说明三次握手用于防止旧重复连接初始化造成混淆。若服务端仅收到旧 SYN 并发出响应就认定连接成立，会为客户端并未确认的新连接保留状态；第三次确认让服务端验证对方已收到自己的初始序列号。

**追问补充**：四次握手并非不可行，只是会把服务端的 SYN 与对客户端 SYN 的 ACK 拆成两个报文，增加一次报文交互；三次已足以让双方确认收发能力并同步序列号，第四次没有新增确认信息。

---

### 25. TCP 粘包是什么？怎么解决？

> 来源：百度后端一面，8 月 6 日；[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)

TCP 是字节流协议，没有消息边界。发送方多次 `write` 可能被合并，单次大消息也可能被拆分；这不是 TCP 出错，而是应用层协议没有定义帧。

常见方案：固定长度、特殊分隔符、消息头携带长度、或使用已有协议的 framing。生产中通常采用 `magic/version/type/length/body/checksum`，读取端先收固定头，再按长度循环读取完整 body，同时限制最大长度防止恶意包导致内存耗尽。

---

### 26. `TIME_WAIT` 为什么存在？数量过多怎么排查？

> 来源：百度后端一面，8 月 6 日

主动关闭方进入 `TIME_WAIT`，通常等待 2MSL：一是保证最后一个 ACK 丢失时还能重发，二是让旧连接的延迟报文从网络中消失，避免污染相同四元组的新连接。

数量过多通常说明服务频繁主动建立和关闭短连接。优先排查连接池、HTTP keep-alive、上游超时和负载均衡健康检查，而不是直接缩短内核等待时间。扩充可用端口、复用连接和调整架构通常比粗暴修改 TCP 参数更可靠。

---

### 27. 浏览器输入 URL 到页面返回，DNS 如何解析，局域网里怎么找到目标 MAC？

> 来源：百度后端一面，8 月 6 日；[字节业务中台AI全栈面经——日常实习](https://www.nowcoder.com/feed/main/detail/6ac5ba31705a4b64a407b087f39d5447)；[字节跳动火山引擎agent开发秋招二面](https://www.nowcoder.com/feed/main/detail/329a57a7469045058209b214e387e32c)

主要链路是 URL 解析和缓存检查、DNS 解析、路由选择、ARP/NDP 获取下一跳链路地址、建立 TCP（HTTPS 还要 TLS）、发送 HTTP 请求、服务端经网关/应用/存储处理后返回，浏览器再解析渲染并加载子资源。

以 IPv4 为例，主机根据子网掩码判断目标是否同网段：同网段就 ARP 查询目标 IP 对应的 MAC；不同网段则查询默认网关的 MAC，把以太网帧交给网关。IP 目标地址端到端基本不变，二层源/目标 MAC 会在每一跳重新封装。

DNS 通常先查浏览器/系统缓存，再交给递归解析器；缓存未命中时，解析器按根、顶级域和权威服务器逐级查询，并按 TTL 缓存 A/AAAA/CNAME 等结果。前端生产请求一般先到同源 BFF、API Gateway 或 Ingress，由这一层完成 TLS 终止、身份、限流、路由和观测，再访问内部服务；让浏览器直接发现并调用每个微服务会暴露拓扑、凭证与跨域边界。

**追问补充**：DNS 优化可采用浏览器、系统、递归解析器的分层缓存，并合理设置 TTL；对热点域名预取或预解析，选择就近且具备故障切换能力的递归服务，必要时并行查询 A/AAAA。应监控缓存命中率、解析延迟和失败率，权衡缓存新鲜度与查询次数。

---

### 28. HTTP/2 相比 HTTP/1.1 做了什么优化？SSE 和普通 HTTP 有什么关系？

> 来源：百度后端一面，8 月 6 日；MetaApp 前端一面，8 月 12 日；本轮追问：HTTP 有什么缺点？如何改进？（[cvte应用软件开发一面](https://www.nowcoder.com/feed/main/detail/c2155d2308de452c8a6e3cf2bbb482f3)）；[字节业务中台AI全栈面经——日常实习](https://www.nowcoder.com/feed/main/detail/6ac5ba31705a4b64a407b087f39d5447)

HTTP/2 使用二进制分帧，在一个 TCP 连接上多路复用多个流，并提供 HPACK 头部压缩和流优先级等能力，解决 HTTP/1.1 应用层队头阻塞和大量重复头部问题。但它仍运行在单个 TCP 连接上，丢包时可能产生传输层队头阻塞，这也是 HTTP/3 改用 QUIC 的原因之一。

SSE 不是独立传输协议，而是长期保持的 HTTP 响应，服务端以 `text/event-stream` 持续推送事件。它适合服务端到浏览器的单向文本流；需要高频全双工交互、二进制或自定义消息协议时再考虑 WebSocket。

**追问补充**：浏览器通常按源限制并发连接，具体上限取决于协议和实现；HTTP/1.0通常每请求独立连接，若显式 Keep-Alive 可复用但仍受连接数限制。HTTP/2通常少量连接承载多路请求，但仍受浏览器、服务器并发流和带宽限制。

---

## MySQL 与数据一致性


HTTP 的常见问题包括无状态导致重复认证、连接建立开销、文本头部冗余，以及高并发下的队头阻塞和实时推送能力不足。可通过缓存与压缩、Keep-Alive，升级 HTTP/2 多路复用，或使用 HTTP/3/QUIC 降低传输层阻塞来改进。
### 29. undo log、redo log 和 binlog 分别做什么？

> 来源：字节 AI 应用开发一面，7 月 21 日；[阿里云一面](https://www.nowcoder.com/feed/main/detail/ceade00d742046d0bef6bee7fe7a7aad)；[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)

undo log 记录旧版本，用于事务回滚和 MVCC；redo log 是 InnoDB 的物理/页级重做日志，用 WAL 保证崩溃恢复；binlog 是 Server 层逻辑日志，用于复制和增量恢复。提交时通过两阶段提交协调 redo 与 binlog，避免主库恢复状态和复制日志不一致。

---

### 30. MySQL 两阶段提交解决什么问题？

> 来源：字节 AI 应用开发一面，7 月 21 日

事务先写 redo prepare，再写 binlog，最后把 redo 标记 commit。恢复时根据 redo 状态和对应 binlog 是否完整决定提交或回滚，从而维持引擎数据与 binlog 一致。它不是分布式业务的 2PC，而是 MySQL 内部协调两套日志的提交协议。

---

### 31. MVCC 如何实现可重复读？

> 来源：滴滴后端二面，7 月 28 日；本轮追问：读已提交和可重复读的区别？ / 如果要放弃可重复读，退到读已提交，你会怎么判断与取舍？（[【面经】字节/AI 应用工程师 一面挂经……](https://www.nowcoder.com/discuss/933023499399024640)）；[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)；[10.14 字节跳动 AI全栈开发实习一面](https://www.nowcoder.com/feed/main/detail/27b05099955e43d5a6a66013a2dea2c6)

记录包含事务 ID 和回滚指针，更新生成 undo 版本链；ReadView 根据活跃事务集合判断版本是否可见。InnoDB 可重复读下，同一事务的快照读通常复用 ReadView，因此多次看到一致版本；当前读仍需锁。RC 每条语句生成新的 ReadView，所以能看到其他事务后续提交。

**追问补充**：[MySQL InnoDB 文档](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html)列出的默认隔离级别为可重复读，但连接或实例可以覆盖配置。MVCC 结合记录版本、undo 版本链和 ReadView，让一致性快照读按可见性规则读取历史版本；锁定读不能直接套用相同快照语义。

---


取舍看业务是否需要事务内重复读一致：报表、校验等依赖稳定快照时保留 RR；单条查询更关注读取较新已提交数据、并发写入多且可接受前后读不同，可用 RC。降级前检查是否依赖一致快照，并验证不可重复读、幻读和锁等待对业务的影响。
### 32. 索引为什么快，哪些场景会失效？

> 来源：滴滴、字节、快手面经，7 月 23–30 日；本轮追问：联合索引在哪些场景下会失效？（[字节跳动 AI Agent研发工程师｜AI算力基础设施 27秋招面经](https://www.nowcoder.com/discuss/930155293864914944)）；[拼多多AI Agent一面，双机位，全程严肃](https://www.nowcoder.com/feed/main/detail/3cb8b70b192f4051b3c19ace4dda1beb)；本轮追问：联合索引 (A, B, C)，如果条件只有A和B的等值条件，还可以使用这个索引吗？ / 如果只有B = 某值 AND C = 某值，索引会怎么走？ / 如果条件是A = 某值 AND C = 某值，中间没有B，索引怎么走？（[携程AI应用开发实习一面（OC）](https://www.nowcoder.com/discuss/933058120102739968)）；本轮追问：最左前缀匹配是什么原理？为什么会失效？（[【面经】字节/AI 应用工程师 一面挂经……](https://www.nowcoder.com/discuss/933023499399024640)）；[字节AI全栈二面](https://www.nowcoder.com/discuss/938145178114592768)；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)；[字节AI Agent开发工程师（质量方向）TikTok Shop一面](https://www.nowcoder.com/feed/main/detail/57326acc86fb4f72a21d09e1410e5121)；[满帮ai全栈](https://www.nowcoder.com/discuss/941738854376087552)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)；[字节跳动 - Agent 研发 - 一面](https://www.nowcoder.com/feed/main/detail/0b91e9f5fbba4af4865c6fadc9a790e8)

B+ 树降低磁盘页访问并支持有序范围扫描。常见无法有效利用索引的情况包括对列做函数/运算、隐式类型转换、`LIKE '%x'`、不满足联合索引最左前缀、选择性太差导致优化器主动全表扫。`IS NULL`、`!=`、`OR` 不是绝对失效，必须结合数据分布和执行计划判断。

**追问补充**：多个索引时，优化器会基于统计信息估算各路径的选择性、扫描行数和回表成本，统计信息来自索引基数、采样等；估算偏差会导致选错。独立索引可用 Index Merge 做交并集，但通常增加合并与回表成本，且难同时满足过滤和有序输出，常需 filesort；应结合 EXPLAIN 与更新统计信息排查。

**追问补充**：EXPLAIN 可检查访问类型、候选与实际索引、估算扫描行数及 Extra，再结合真实执行统计判断偏差；字段含义见 [MySQL 文档](https://dev.mysql.com/doc/refman/8.4/en/explain-output.html)。单列与联合索引描述的是键的定义，不能简单说一个索引只能服务一种查询；是否支持过滤、覆盖或排序以执行计划为准。

---


联合索引通常按最左前缀使用：跳过首列、首列使用范围或不等式后再依赖后列、列间断条件，都会使后续列难以用于定位；排序顺序不匹配时也可能无法充分利用。最终应以 EXPLAIN 的 key、key_len、rows 和 Extra 验证。
### 33. 两个请求并发更新同一行会怎样？

> 来源：百度后端一面，7 月 30 日；[小红书/百度 Agent 开发实习一面](https://www.nowcoder.com/feed/main/detail/e319aadc79a9479397a6661a7f5ca088)；[快手大模型agent研发一面](https://www.nowcoder.com/discuss/932315325276618752)

普通当前写会获取行级排他锁，后到事务等待、超时或遇到死锁回滚。如果没有正确锁定目标行，读改写可能发生丢失更新。可使用条件更新的乐观锁 `WHERE version=?`、原子 SQL、自增/累加表达式或串行化业务 key；应用必须处理冲突重试并设置上限。

---

### 34. 一条 SQL 在 MySQL 中如何执行？

> 来源：小红书数据库智能化一面，8 月 10 日；[阿里云一面](https://www.nowcoder.com/feed/main/detail/ceade00d742046d0bef6bee7fe7a7aad)；本轮追问：如何利用EXPLAIN分析执行计划？（[9.20 汇川技术 数字化全栈工程师 一面](https://www.nowcoder.com/feed/main/detail/28032c48a90c4f69827704deb3fae34c)）；[字节AI全栈二面](https://www.nowcoder.com/discuss/938145178114592768)

连接层完成认证和会话管理；Server 层解析 SQL、做语义检查和优化，生成执行计划；执行器按计划调用存储引擎接口；InnoDB 再通过索引、Buffer Pool、锁和 MVCC 读取或修改记录。写事务还会涉及 undo log、redo log 和 binlog，并通过两阶段提交维持 redo/binlog 一致性。

面试时不要只背组件名称，最好用 `EXPLAIN` 说明优化器会决定访问顺序、索引、连接算法和预估行数，慢查询定位也从实际执行计划开始。

**追问补充**：`filtered`是优化器估计经过当前表条件过滤后仍满足的行比例，单位为百分比；可用`rows`乘以该比例粗略估算输出行数。它是估算值，需结合`EXPLAIN ANALYZE`核对实际行数，不能当作真实命中率。 字段定义见 [MySQL EXPLAIN 文档](https://dev.mysql.com/doc/refman/8.4/en/explain-output.html)。

---


使用 EXPLAIN 重点看 type、possible_keys、key、key_len、rows、filtered、Extra 及连接顺序，关注全表扫描、估算行数偏差、临时表和文件排序；再用 EXPLAIN ANALYZE 对比实际行数与耗时，结合表统计信息、索引和 SQL 改写验证优化是否生效。
### 35. `CHAR`、`VARCHAR` 和 JSON 怎么选？

> 来源：百度后端一面，8 月 6 日

`CHAR(n)` 定长，适合长度稳定且经常比较的值；`VARCHAR(n)` 按实际长度存储，适合长度变化大的字符串。选择时还要考虑字符集：`n` 是字符数，实际字节数受 utf8mb4 等编码影响。

JSON 类型适合结构有弹性、不是每个字段都参与关系约束的扩展属性。高频过滤、排序、关联字段应提升为普通列，或通过生成列/函数索引建立可用索引；不要把核心关系模型全部塞进 JSON 逃避表设计。

---

### 36. InnoDB 如何实现 ACID 和事务隔离？

> 来源：百度后端一面，8 月 6 日；百度内容营销与广告一面，8 月 12 日；[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)；[字节跳动 AI Agent研发工程师｜AI算力基础设施 27秋招面经](https://www.nowcoder.com/discuss/930155293864914944)；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)；[字节跳动 - Agent 研发 - 一面](https://www.nowcoder.com/feed/main/detail/0b91e9f5fbba4af4865c6fadc9a790e8)

- 原子性：undo log 支持回滚。
- 一致性：由原子性、隔离性、持久性以及业务约束共同保证。
- 隔离性：锁 + MVCC；一致性读通过 ReadView 选择可见版本。
- 持久性：redo log 的 WAL 机制，提交策略决定断电时的耐久程度。

InnoDB 默认可重复读。快照读主要靠 MVCC，当前读会加记录锁、间隙锁或临键锁。回答“隔离级别解决了什么”时，应同时区分 SQL 标准定义与 InnoDB 的具体实现。

**追问补充**：Redis 的 MULTI/EXEC 将命令批量排队并连续执行，通常保证这段执行不被其他命令插入，但不提供 MySQL 式回滚、MVCC 隔离或完整持久性；WATCH 可做乐观并发控制，失败后需重试。其原子性主要限于单实例或同一集群槽位。

---

### 37. B 树和 B+ 树有什么区别？MySQL 为什么用 B+ 树索引？

> 来源：百度后端一面，8 月 6 日；[字节 AI 全栈一面（飞书）](https://www.nowcoder.com/discuss/931555466247700480)；[度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368)；[美团ai全栈一面](https://www.nowcoder.com/feed/main/detail/a5b8c6571f94441a8af10cd6af07ac3a)；[拼多多AI Agent一面，双机位，全程严肃](https://www.nowcoder.com/feed/main/detail/3cb8b70b192f4051b3c19ace4dda1beb)；[字节 Agent 秋招一面](https://www.nowcoder.com/discuss/929731481189044224)；[【面经】字节/AI 应用工程师 一面挂经……](https://www.nowcoder.com/discuss/933023499399024640)；本轮追问：相比没有索引，查询效率提高多少？如何从复杂度角度计算？（[字节剪映AI应用开发一面](https://www.nowcoder.com/feed/main/detail/7211e82c75284d23a89b569cd9dc289d)）；[记录最爽，不折腰的一次面试：小红书秋招一面](https://www.nowcoder.com/feed/main/detail/bebc8a5d22d141d09efc4e0a74031365)；[0924恒生电子｜AI 应用开发工程师 ｜AI面](https://www.nowcoder.com/feed/main/detail/5e0a75e9cf4941a9861b1948fb7f4e60)；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)；[字节 AI Agent 开发一面](https://www.nowcoder.com/feed/main/detail/9cd459d87a754e07a490ba7f1c03b495)；[10.14 字节跳动 AI全栈开发实习一面](https://www.nowcoder.com/feed/main/detail/27b05099955e43d5a6a66013a2dea2c6)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)

B 树的内部节点和叶子都可保存记录；B+ 树的内部节点只存键和子指针，完整记录集中在叶子，叶子还按顺序相连。同样页大小下，B+ 树内部节点能容纳更多键，树更矮、随机 IO 更少；叶子链表又适合范围扫描和排序。

InnoDB 聚簇索引叶子存整行，二级索引叶子存主键，因此通过二级索引查非覆盖列通常需要回表。联合索引遵循按索引定义顺序排列的最左前缀规律。

**追问补充**：平衡二叉搜索树查找通常为 O(log N)，主要是内存中的节点比较；B+ 树为 O(log_B N) 次页级访问，B 更大且节点按页组织，通常能减少磁盘 IO，但需区分比较次数、页访问和缓存命中。

**追问补充**：建索引优先考虑高频出现在 WHERE、JOIN、ORDER BY 或 GROUP BY 中且选择性较好的字段；低基数字段单独建索引收益通常有限。联合索引按查询条件和排序需求安排列顺序，并权衡额外存储及写入维护成本。

---


复杂度上，含索引的等值或范围定位通常约为 O(log_B N)，B 为每页可容纳的键数；全表扫描约为 O(N)。实际收益还取决于选择性、数据是否在缓存、回表次数及是否覆盖索引，不能仅由复杂度直接换算成固定倍数。
### 38. MySQL 主从复制和高可用怎么设计？

> 来源：百度后端一面、字节后端社招一面，8 月 6 日；[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)；[移动卓望AI面10.17](https://www.nowcoder.com/feed/main/detail/2dcc16b1678d42beac2c7f5270f6ff0c)

主库提交事务并写 binlog，从库 IO 线程拉取日志写 relay log，SQL/applier 线程重放。并行复制可以提高回放速度，但复制通常存在延迟，因此读写分离要处理“写后立刻读”的一致性需求，例如关键读回主、GTID/位点等待或会话粘滞。

高可用还需要故障探测、选主、流量切换和脑裂防护。仅有一主一从不是完整高可用：要明确 RPO/RTO、半同步或组复制策略、fencing、自动化切换以及故障恢复后的数据校验。

**追问补充**：主从延迟常见原因包括：主库写入或 binlog 刷盘压力大；网络抖动或带宽不足；从库磁盘 I/O、CPU、锁竞争；单线程或并行复制配置不当；大事务、DDL、热点表导致回放慢；从库查询占用资源。应结合复制位点、线程状态、事务大小、I/O 与资源监控定位。

---

### 39. 两个请求并发更新同一条记录，除了行锁还能怎么处理？

> 来源：百度秋招后端一面，7 月 30 日；[小红书/百度 Agent 开发实习一面](https://www.nowcoder.com/feed/main/detail/e319aadc79a9479397a6661a7f5ca088)；本轮追问：文档在线自动更新时，如何保证并发更新的幂等性，避免多个任务相互覆盖？（[字节 Agent 秋招一面](https://www.nowcoder.com/discuss/929731481189044224)）；[10.10 无锡赫玛科技](https://www.nowcoder.com/feed/main/detail/24a0ee8b5d2c4d65aaf5fc1e18bfcc23)

悲观方案是在事务中 `SELECT ... FOR UPDATE`，适合冲突高、操作短的场景。乐观方案增加 `version` 字段，执行 `UPDATE ... WHERE id=? AND version=?`，影响行数为 0 时重读并重试；也可以用唯一约束、幂等键、串行消息队列或按业务键分区降低冲突。

关键是先说清一致性目标。金额扣减可以用原子条件更新 `stock >= amount`，不必先读后写；跨服务操作则需要幂等、事件表或 Saga，而不是幻想一个数据库行锁覆盖所有系统。

**追问补充**：悲观锁先加锁再操作，冲突高且临界区短时更稳；乐观锁先执行并用版本或条件校验，冲突低时并发度更高。锁粒度越细并发越好但管理和死锁风险上升，粒度越粗实现简单却更易阻塞，应结合冲突率、事务时长和一致性要求压测权衡。

---

## Redis 与缓存

### 40. Redis 常见数据结构与适用场景是什么？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日；[招银网络科技9.16 二面+HR面](https://www.nowcoder.com/discuss/929765743787274240)；本轮追问：Redis 除了缓存还能做什么？（[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)）；[字节剪映AI应用开发一面](https://www.nowcoder.com/feed/main/detail/7211e82c75284d23a89b569cd9dc289d)；[九方智投 一面凉经](https://www.nowcoder.com/feed/main/detail/92efed84eb68493d82132e03b7e43ae0)；[恒生电子AI应用开发（杭州）一面面经](https://www.nowcoder.com/feed/main/detail/f674f0f958c644629f024f95c7c104b6)；[智加 自动驾驶软件工程师](https://www.nowcoder.com/feed/main/detail/26812880d26248e5a34b4358902509e8)；[美团Agent一面凉经](https://www.nowcoder.com/feed/main/detail/18fa4134edb14e8c901787ee5cd33ace)；[10.14 字节跳动 AI全栈开发实习一面](https://www.nowcoder.com/feed/main/detail/27b05099955e43d5a6a66013a2dea2c6)

String 用于缓存、计数和位图；Hash 存对象字段；List 适合顺序队列但可靠消息更宜用 Streams/MQ；Set 做去重和集合运算；ZSet 用分数排序，适合排行榜和延迟任务。选择时要看访问模式和元素规模，不能把一个超大集合塞进单 Key。

**追问补充**：常用命令包括 String 的 GET/SET/INCR、Hash 的 HGET/HSET、List 的 LPUSH/BRPOP、Set 的 SADD/SISMEMBER、ZSet 的 ZADD/ZRANGE。Java 中通常通过 Lettuce 或 Jedis 访问，并关注序列化、连接池、Pipeline、Lua 原子性及缓存穿透、击穿和雪崩。

---


Redis 还可用于分布式锁、限流、会话与临时状态、发布订阅，以及用 Streams 做可确认、可重放的消息流。使用时需关注持久化、过期策略、故障转移和消息可靠性，不能默认等同于专业 MQ。
### 41. Redis 单线程为什么仍然快？阻塞会造成什么影响？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日；[字节中国交易与广告 AI 应用开发一面](https://www.nowcoder.com/feed/main/detail/b34f6902e8544fe2953696ed52e49dba)；本轮追问：项目中使用过什么缓存？Redis为什么快？（[度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368)）；[阿里云一面](https://www.nowcoder.com/feed/main/detail/ceade00d742046d0bef6bee7fe7a7aad)；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)

内存访问、高效结构和 IO 多路复用让单线程事件循环可以高效处理大量短命令，并避免命令执行时的锁竞争。一旦执行大 Key 操作、复杂集合命令、同步删除或 fork/磁盘抖动，后续请求会排队，尾延迟迅速升高。治理依赖慢日志、拆 Key、渐进式操作、`UNLINK` 和实例隔离。

**追问补充**：串行只保证单条命令执行不并发，多个客户端的读改写仍可能交错，形成丢失更新或检查后失效；应使用原子命令、Lua、MULTI/EXEC 或 WATCH。Redis 6 的 I/O 多线程主要处理网络读写，命令执行和 Key 修改仍由主线程串行完成，并非多个线程并发改同一 Key。

---

### 42. Redis `ZSet` 的底层结构是什么？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日；[算能科技 Agent 开发一面](https://www.nowcoder.com/feed/main/detail/f832cb9f9c494fbfad7e492bada7ec19)

小规模集合可使用紧凑编码；达到阈值后通常由哈希表和跳表组成。哈希表支持按成员 O(1) 找分数，跳表支持按分数排序和范围查询，平均 O(log n) 插入删除。两套结构保存相同成员，是用空间换取两类查询效率。

跳表查找从最高层向右移动，越过目标前停下后逐层下沉；插入先记录每层前驱，再按随机层高接入多层 forward 指针；删除使用同一组前驱摘除目标，并在最高层变空时降低当前层数。随机层高让期望查找、插入和删除为 O(log n)，但最坏仍可能退化为 O(n)。ZSet 还要按 `score + member` 保持稳定顺序，并同步维护字典，不能把跳表单独当成完整 ZSet。

---

### 43. Redis 哨兵模式如何完成故障转移？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日；[中兴软开一面](https://www.nowcoder.com/feed/main/detail/0b39815babfb47108464ffabdf929eba)；本轮追问：设计一个由 10 个 Redis 机器构成的集群，内部存储普通的 K-V，K 是 UID，V 是一个二进制文件，要求考虑单点故障、负载均衡等，实现高可用、低延迟。（[奇怪の字节二面面经（大概率凉经）](https://www.nowcoder.com/feed/main/detail/bcf0b8497fcb4982b2292cafbcb08d69)）

Sentinel 周期探测实例，单个 Sentinel 判定主观下线后，与其他 Sentinel 协商形成客观下线，再选举领导者挑选从库晋升，并让其他从库复制新主。客户端要能发现拓扑变化并重连。Sentinel 提供高可用而不是数据零丢失，异步复制仍有故障窗口。

---


若是 10 台机器承载普通 KV，应采用 Redis Cluster 分片而非仅靠 Sentinel：例如 5 个主节点、每主 1 个从节点，按哈希槽分布 UID；客户端按槽路由并在拓扑变更后刷新。用副本、故障转移、跨故障域部署和容量压测处理单点与负载；二进制文件过大时应评估对象存储，Redis 只存元数据或小对象。
### 44. 大 Key 有什么风险？如何处理？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日

风险包括单次命令阻塞、网络包过大、内存不均、迁移和过期删除抖动。用 `--bigkeys`、`MEMORY USAGE`、慢日志和采样监控发现；按业务维度拆分集合、分页/渐进读取，删除时使用 `UNLINK`。拆分后必须同步设计路由和批量访问，避免把一次请求变成无界 fan-out。

---

### 45. 缓存穿透、击穿和雪崩如何区分？

> 来源：滴滴国际化后端二面、百度后端一面，7 月 28–30 日；[度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368)；本轮追问：你写的首页高性能接口中的多层缓存、缓存击穿和缓存雪崩，是真实遇到过的问题吗？你是如何考虑并设计的？（[飞书深诺（全栈AI应用开发方向）](https://www.nowcoder.com/feed/main/detail/46a9336c7ead4586bae34e521d4f61d0)）；[恒生电子技术岗ai面](https://www.nowcoder.com/feed/main/detail/49a60657cf63400897542e731c3feae4)；[10.10 无锡赫玛科技](https://www.nowcoder.com/feed/main/detail/24a0ee8b5d2c4d65aaf5fc1e18bfcc23)；[字节 AI Agent 开发一面](https://www.nowcoder.com/feed/main/detail/9cd459d87a754e07a490ba7f1c03b495)

穿透是查询不存在数据，使用校验、空值缓存和布隆过滤器；击穿是单个热点失效，大量请求同时回源，可用互斥重建、逻辑过期或热点永不过期；雪崩是大量 Key 同时失效或缓存集群故障，要随机化 TTL、多级缓存、限流降级和高可用。三者都要防止重试进一步放大流量。

---


是否真实发生不能只靠方案描述判断，应核对访问日志、命中率、回源 QPS、重建耗时和告警时间线。设计上先基线测量，再用压测或故障演练验证：热点失效只放行一个重建请求，批量失效时通过随机 TTL、限流和降级控制回源流量。
### 46. 缓存与数据库如何保证最终一致？

> 来源：滴滴国际化、拼多多、百度后端面经，7 月 28–30 日；[小红书 Agent 平台研发一面](https://www.nowcoder.com/discuss/931189826643066880)；[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)；[携程 AI 应用开发一面（已oc）](https://www.nowcoder.com/feed/main/detail/2b1c35eace4a4bb3bd88ee669f163793)；本轮追问：多屏场景下，怎么保证信息一致性？（[蔚来——大模型算法岗（智能座舱/自动驾驶）实习一面](https://www.nowcoder.com/discuss/930755708008558592)）；[赛诺贝斯 面经 一面过 笔试过 hc无](https://www.nowcoder.com/discuss/930126120177926144)；本轮追问：延迟双删相对“先更新数据库，再删除缓存”，具体加强在哪里？解决了什么问题？（[携程AI应用开发实习一面（OC）](https://www.nowcoder.com/discuss/933058120102739968)）；[(秋招) 9.16 字节中交广 - 交易与广告业务 - AI全栈开发工程师](https://www.nowcoder.com/discuss/932587389027962880)；本轮追问：本地缓存怎样处理一致性？（[9.14字节推荐架构一面](https://www.nowcoder.com/feed/main/detail/467d01beed8a40b89ac414b90fc7fb85)）；本轮追问：本地缓存一致性是否需要考虑，当前如何处理？（[9.15科大讯飞AI应用一面](https://www.nowcoder.com/feed/main/detail/aece93373f9c47ea95c831aef6471886)）；本轮追问：Guava/Tair 两级缓存如何处理一致性？（[9.15秋招东方财富AI应用一面](https://www.nowcoder.com/feed/main/detail/d406314e733c4fc8945637ce5d06cdcf)）；[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)；[10.10 无锡赫玛科技](https://www.nowcoder.com/feed/main/detail/24a0ee8b5d2c4d65aaf5fc1e18bfcc23)；[字节跳动 - Agent 研发 - 一面](https://www.nowcoder.com/feed/main/detail/0b91e9f5fbba4af4865c6fadc9a790e8)

常用方案是先提交数据库，再删除缓存；删除失败进入重试队列或通过 binlog/CDC 补偿。读回填时可携带版本，防止旧请求覆盖新值；强一致要求更高时，可串行化热点写或直接绕过缓存。不要承诺缓存和数据库天然强一致，先明确业务允许的不一致窗口。

**追问补充**：binlog 方案应在数据库事务提交后由 CDC 消费变更，按主键和版本幂等删除或更新缓存，失败进入重试与对账。定时更新也走同一链路；读回填比较版本并用 CAS，旧读结果不得覆盖新值，必要时对热点键加分布式锁。

---


多屏以服务端数据库为唯一事实源，每次变更携带单调递增版本号或序列号，通过消息推送或长轮询同步；客户端按版本丢弃旧事件，断线后按游标补拉，冲突按业务规则合并或以服务端结果覆盖，并保证处理幂等。

延迟双删是在更新数据库并删除缓存后，等待一段时间再次删除，主要压缩并发读回旧值后回填的窗口，但不能替代重试和版本校验。本地缓存需配合TTL、版本号及发布失效通知；两级缓存应按版本校验并同步失效，避免L1覆盖L2或数据库的新值。
### 47. Redis 常见数据结构有哪些？String 和 Hash 底层如何实现？

> 来源：百度后端一面，8 月 6 日；快手测开一面，8 月 12 日；[字节 AI Agent 开发一面](https://www.nowcoder.com/feed/main/detail/9cd459d87a754e07a490ba7f1c03b495)

常用类型包括 String、Hash、List、Set、Sorted Set、Bitmap、HyperLogLog、Stream 和地理位置索引。底层编码会根据数据规模动态选择：String 使用 SDS 或整数编码；Hash 在元素少且较小时使用紧凑的 listpack，超过阈值转为哈希表。

选型要从访问模式出发：唯一集合用 Set，排行榜用 Sorted Set，消息流用 Stream，用户对象少量字段读写可用 Hash。不要只背类型，还要说明大 Key、热 Key 和编码转换的内存影响。

---

### 48. 缓存失效后大量请求打到数据库，怎么解决？缓存一致性怎么保证？

> 来源：百度秋招后端一面，7 月 30 日；拼多多提前批一面，7 月 30 日；本轮追问：在线文档正文缓存十分钟，如果管理员在缓存有效期内取消了某个用户的访问权限，该用户再次访问并命中缓存时，系统能否直接返回正文？这个功能怎么设计？ / 权限被取消时，是否应该立即让正文缓存失效？还可以采用哪些方案保证权限及时生效？（[9.14小红书 PE（产品工程师/全栈方向--实习）二面 (流程泡到9.21挂)](https://www.nowcoder.com/discuss/929891805049421824)）；[(秋招) 9.16 字节中交广 - 交易与广告业务 - AI全栈开发工程师](https://www.nowcoder.com/discuss/932587389027962880)；[度小满 AI 全栈二面](https://www.nowcoder.com/discuss/931952631340077056)；[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)

热点 Key 同时失效是缓存击穿。可用互斥重建/单飞、逻辑过期异步刷新、热点永不过期配合主动更新，并给 TTL 加随机抖动。还要用限流、熔断和数据库保护防止缓存故障拖垮下游。

一致性常用 Cache Aside：读未命中查库回填；写时先更新数据库，再删除缓存。删除失败要通过重试队列、binlog/CDC 或消息最终补偿。对强一致要求高的少数读可直接走数据库或版本校验，不能宣称普通缓存方案能提供无代价强一致。

**追问补充**：多实例下需使用分布式锁或租约实现跨节点单飞：获取锁后再次检查缓存，只有持锁者查库并回填；设置租约超时、续租和随机退避，避免节点故障长期占锁。必要时用令牌校验，防止旧持锁者覆盖新值。

---

## 消息队列与分布式系统


权限校验不能依赖正文缓存命中：每次请求仍先校验当前权限，通过后才返回缓存正文。取消权限时可主动删除用户维度缓存；也可采用权限版本号、短 TTL、黑名单或网关实时鉴权，按一致性要求取舍。
### 49. Kafka 如何避免重复消费？

> 来源：滴滴国际化后端二面、拼多多后端一面，7 月 28–30 日；[淘天供应链ai应用研发一面](https://www.nowcoder.com/feed/main/detail/8656f1483ebd441bac7c17c313e5394a)；[10.21小红书一面面经](https://www.nowcoder.com/feed/main/detail/bab2ccabb366403492901c712278329e)

重复通常来自处理成功但 offset 未提交、消费者重平衡或生产者重试。端到端治理依赖业务幂等：唯一事件 ID + 数据库唯一键、状态机或幂等表；消费成功后再提交 offset。Kafka 事务能覆盖 Kafka 内部的 consume-transform-produce，但写外部数据库仍需 Outbox、幂等或事务协调。

---

### 50. 如何保证消息有序且不丢失？

> 来源：拼多多后端一面，7 月 30 日

同一业务 key 路由到同一 partition，分区内按顺序消费；失败重试若进入独立队列，需要设计业务序号或阻塞同 key 后续消息。防丢失要覆盖生产者确认与幂等、Broker 多副本与刷盘、消费者处理成功后提交，以及失败后的重试/死信/对账。不能只回答“设置 ack=all”。

---

### 51. MQ 积压如何排查？

> 来源：百度后端一面，7 月 30 日；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)；[字节 AI Agent 开发一面](https://www.nowcoder.com/feed/main/detail/9cd459d87a754e07a490ba7f1c03b495)

先确认生产速率、消费速率和 lag 的时间趋势，再定位是否单分区热点、消费者异常、重平衡、慢消息或下游 DB/RPC 变慢。临时扩容消费者受 partition 数限制；长期要优化单条处理、批量与异步并发，并为失败消息隔离。扩容前先止住错误重试，否则只会放大下游压力。

**追问补充**：设计时持续采集各队列或分区的 lag、最老消息年龄、生产与消费速率、消费者存活和重平衡次数，并按阈值及增长趋势告警；同时监测分区倾斜和下游耗时，告警需关联队列、消费者组和实例。

---

### 52. 微服务注册、发现和负载均衡如何协作？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日

服务实例启动后注册地址和元数据并通过心跳/租约保活；消费者从注册中心获取实例列表并监听变化，再由客户端或网关按轮询、权重、一致性哈希等策略选择实例。健康检查要区分进程存活和业务就绪，摘除需防抖，客户端还要处理缓存列表过期和注册中心不可用。

---

### 53. 消息队列如何处理顺序、重复和丢失？

> 来源：拼多多提前批一面，7 月 30 日；快手测开一面，8 月 12 日；[美团AI全栈一面，AICoding把我整不会了](https://www.nowcoder.com/discuss/929871920625963008)；[(秋招) 9.16 字节中交广 - 交易与广告业务 - AI全栈开发工程师](https://www.nowcoder.com/discuss/932587389027962880)；本轮追问：消息队列重复消息怎么解决？如何使用幂等 ID，并给出伪代码？能不能用布隆过滤器？（[淘天供应链ai应用研发一面](https://www.nowcoder.com/feed/main/detail/8656f1483ebd441bac7c17c313e5394a)）；[度小满 - AI 全栈研发 - 二面](https://www.nowcoder.com/feed/main/detail/0bed1f22b62145f480d2c10c5ffd7951)；[虾皮秋招 研发工程师](https://www.nowcoder.com/feed/main/detail/dcb2bf1c6b7c4b6a9f4c095ba9329bce)；[(秋招) 10.15 - 银泰百货 - 银泰星AI工程师 - 一面](https://www.nowcoder.com/discuss/942055584050733056)

- **顺序**：同一业务键路由到同一分区/队列，分区内单消费者或严格串行；全局顺序会牺牲吞吐。
- **重复**：MQ 通常只能提供至少一次，消费端用业务唯一键、去重表或状态机实现幂等。
- **丢失**：生产端确认和重试，Broker 持久化和副本，消费端处理成功后再提交 offset/ACK，失败进入重试与死信队列。

“Exactly Once”需要限定范围。消息系统内部的事务语义不等于数据库、缓存和外部 API 的跨系统严格一次，业务最终仍要依赖幂等与补偿。

**追问补充**：上报端可采用本地持久化队列、批量发送、超时重试和指数退避，并为每条数据生成全局幂等 ID、序列号和校验信息；服务端按幂等 ID 去重、按序列号校验缺口，结合成功率、延迟、积压和丢弃量告警。ACK 丢失时允许重传，由接收端幂等处理。

**追问补充**：可在测试环境注入生产确认丢失、Broker不可用、网络延迟、消费者处理后崩溃及重复投递等故障；以全局幂等ID对发送、接收、落库和最终对账计数，区分重复、缺失与未完成消息，计算重复率和丢失率。

---


消费时以业务幂等 ID 建唯一约束，伪代码：`if insert_if_absent(id): handle(msg); commit(); ACK`，失败则回滚重试；布隆过滤器只能作前置加速，存在误判且不能防并发，不能替代持久化去重表。
### 54. MQ 突然积压，怎么定位？消息队列在架构中承担什么职责？

> 来源：百度秋招后端一面，7 月 30 日；快手测开一面，8 月 12 日；[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)

先比较生产速率和消费速率，再看消费者实例、分区分配、单条耗时、下游依赖、失败重试和大消息。短期可扩消费者、增加分区、批量处理或临时降级非核心逻辑，但消费者数量超过有效分区数不会继续提升并行度。

MQ 的核心职责是异步解耦、削峰填谷、广播事件和失败重试。代价是引入最终一致性、重复/乱序、积压和可观测性成本；同步且必须立即返回结果的短链路不应为了“架构高级”强行上 MQ。

---

## 系统设计与故障排查

### 55. 实时搜索联想和提交后搜索有什么区别？

> 来源：滴滴 AI Agent 后端面经，7 月 23 日

输入联想请求频率高、前缀短、容忍近似结果，需要防抖、取消旧请求、前缀索引/Trie、热点缓存和严格延迟预算；提交搜索强调相关性、过滤、排序和分页，可执行更重的召回与精排。两者可以复用搜索引擎，但索引、缓存和 SLA 不应完全相同。

---

### 56. 线上接口从 200ms 升到 5s 且 CPU 飙升，怎么排查？

> 来源：拼多多后端一面，7 月 30 日；本轮追问：SQL 已从 800 毫秒优化到 50 毫秒，但整体接口仍然很慢，如何继续定位和优化？ / 接口总耗时 80 毫秒、单次 SQL 只有 10 毫秒，如果还要继续优化，你会从哪些方面分析？项目中是否使用过缓存或并发手段？（[字节 AI 全栈一面（飞书）](https://www.nowcoder.com/discuss/931555466247700480)）；[【面经】字节/AI 应用工程师 一面挂经……](https://www.nowcoder.com/discuss/933023499399024640)；[科大讯飞面试挺有意思，不考八股不问项目](https://www.nowcoder.com/feed/main/detail/773d1337e7314a7d90985fd81510974d)；本轮追问：主链路耗时较长，为什么并行改造后只优化了一小段？（[9.14字节推荐架构一面](https://www.nowcoder.com/feed/main/detail/467d01beed8a40b89ac414b90fc7fb85)）；[百度agent harness一面](https://www.nowcoder.com/discuss/937747584578310144)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)

先止损：限流、熔断、降级、暂停可疑发布并保护 DB/Redis/ES。再按变更时间线和 trace 判断延迟在哪一跳，检查 CPU 火焰图、线程池队列、GC、锁、慢 SQL、缓存命中、下游超时和重试量。定位后灰度修复，并通过容量压测、告警阈值和复盘防止重现。不要一看到 CPU 高就先扩容，重试风暴会让扩容也失效。

**追问补充**：输入规模放大而耗时超线性，优先怀疑 O(n²) 嵌套遍历、重复排序或查找、字符串拼接与序列化拷贝，以及缓存失效导致的分支变化。用不同规模基准、CPU 火焰图、内存分配、GC、锁与 I/O 观测拆分增长来源；确认后改用哈希索引、批处理或流式处理，并验证内存峰值。

**追问补充**：对于 JVM 平台线程，可先用 `top -H -p PID` 或采样分析器定位高 CPU 线程，将线程 ID 转为十六进制后与 `jstack` 的 `nid` 对照。再结合重复栈、GC 和 CPU profile 区分循环计算、锁竞争与运行时开销；虚拟线程不能直接套用一线程一操作系统线程的对应关系。

---


继续按 trace 拆分序列化、网络、线程池、锁、GC、下游调用和重试，区分排队时间与执行时间；低于单 SQL 的部分可用热点缓存、批量/异步或受控并发，但要校验一致性、缓存击穿、连接池和下游容量，并以基准压测确认收益。

并行收益受关键路径和串行部分限制，可用 trace 瀑布图按 Amdahl 思路定位：依赖未拆开、汇聚等待、线程池排队、连接池瓶颈或 fan-out 过大，都会让并行收益很小。应比较改造前后的关键路径、排队时间和下游容量，而非只看单个调用耗时。
### 57. 短链系统如何设计？

> 来源：滴滴国际化后端二面，7 月 28 日；[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)

写入时生成全局唯一 ID，再做 Base62 编码得到短码，保存短码到长 URL 的映射；读取路径通过缓存加速并返回 301/302。需处理自定义短码冲突、恶意网址、安全扫描、过期、热点 Key、统计异步化和防枚举。随机码也可以，但要评估冲突重试和数据库唯一约束。

---

### 58. 接口平均延迟从 200ms 涨到 5s，同时 CPU 飙升，怎么排查？

> 来源：拼多多提前批一面，7 月 30 日；百度秋招后端一面，7 月 30 日；[10.12字节推荐算法实习](https://www.nowcoder.com/feed/main/detail/b1c21204dc174dab82206bb3a2f94902)

1. 先确认影响范围、变更时间线和核心 SLI，必要时回滚、限流、熔断，先止损。
2. 按 Trace 拆分网关、应用、DB、Redis、ES、RPC 各段耗时，区分排队、计算、锁等待、GC 和下游慢。
3. CPU 高时抓火焰图/线程栈，检查死循环、序列化、正则、压缩、锁竞争和 GC；同时看容器 throttling，避免把 CPU 配额限制误判成机器满载。
4. 用慢 SQL、连接池、缓存命中率、MQ lag 和下游错误率交叉验证根因；修复后回放流量并补监控、压测和回归用例。

排障顺序是**止损 → 定界 → 定位 → 验证 → 防复发**，不能一看到 CPU 高就直接扩容。

**追问补充**：先按请求解析、规则匹配、模型推理、融合和返回等阶段埋点，给出各段分布与关键路径，不能凭总耗时倒推。8:2 需要先确认是请求、样本、标签还是资源比例；若确实是流量分配，再记录路由规则与分桶，分别比较两路效果、排队时间和错误率，不能默认它代表随机灰度。

---

### 59. QPS 突增 10 倍，系统如何保证不崩？

> 来源：小红书数据库智能化一面，8 月 10 日；百度秋招后端一面，7 月 30 日；本轮追问：设计一个能够支撑 10 万 QPS、并可继续水平扩展的商品详情查询服务。底层只有一张存储商品详情的 MySQL 表，直播间用户点击商品后会调用该服务；管理端修改价格后，C 端用户也需要看到新价格。（[小红书 Agent 平台研发一面](https://www.nowcoder.com/discuss/931189826643066880)）；本轮追问：十万、百万 QPS 下的业务架构如何设计（[携程AI 面试复盘](https://www.nowcoder.com/discuss/932274641865887744)）；[字节 260907 一面面经](https://www.nowcoder.com/discuss/935858952644939776)

入口层做鉴权、令牌桶限流和请求优先级；无状态服务水平扩容；热点读使用多级缓存和请求合并；慢任务进入队列削峰；DB 通过索引、连接池上限、读写分离和批处理保护。每个下游都要有超时、熔断和隔离舱，避免一个依赖拖垮全部线程。

容量规划要从瓶颈反推，而不是只给应用加机器：确认单实例安全 QPS、缓存命中率、数据库连接和写入上限、队列可承受积压以及降级后仍需保留的核心功能。

**追问补充**：一亿用户不等于一亿并发，先按活跃率、峰值请求和地域分布换算容量，并区分读写及热点比例；再用 CDN、分区分片和多地域接入扩展，按压测结果设置限流、排队和降级边界，避免按用户总数盲目扩容。

---


商品详情采用 Redis 多级缓存加本地热点缓存，缓存未命中用 singleflight 合并请求，避免击穿；价格修改以 MySQL 为准，事务提交后发布失效或版本消息，删除相关缓存并校验版本，必要时短 TTL 兜底。热点商品可预热和分片，缓存集群、应用层和网关均可水平扩展，同时监控命中率、延迟、回源 QPS 与过期消息积压。

十万到百万 QPS 应让 CDN、网关和多级缓存承接绝大多数读流量，应用按分片无状态扩展，热点 key 独立隔离；数据库只承担可控回源和异步写入，并通过压测校准分片、缓存、连接池和降级容量，避免把流量直接压到 MySQL。
### 60. Nginx 能不能做限流？常见策略是什么？

> 来源：小红书数据库智能化一面，8 月 10 日

可以。Nginx 常用 `limit_req` 基于漏桶思想限制请求速率，配置 `burst` 吸收短时突发，`nodelay` 决定突发请求是立即通过还是排队；`limit_conn` 控制并发连接数。Key 可按 IP、用户或 API 维度选择。

边缘限流能尽早挡住洪峰，但它看不到完整业务配额。生产系统通常采用网关粗限流 + 服务端按租户/接口精细限流，并把限流状态码、重试提示、白名单和监控一起设计。

---

### 61. 如何设计微信朋友圈或类似 Feed 系统？

> 来源：字节后端社招二面，8 月 6 日

先明确读写比、好友规模、时间线延迟和隐私规则。普通用户可采用写扩散：发布时把动态 ID 推入好友收件箱，读延迟低；大 V 采用读扩散，避免一次写入百万份；实际系统通常混合两者。

核心组件包括内容存储、关系图、Timeline 服务、缓存、异步 fan-out、排序和权限过滤。删除、拉黑和权限变更不能只依赖旧收件箱数据，读路径仍需做最终权限校验；还要考虑热点、游标分页、去重、补偿任务和多机房一致性。

---

## 前端与测试开发

### 62. `Promise.all` 和 `Promise.allSettled` 有什么区别？

> 来源：MetaApp 前端一面，8 月 12 日

`Promise.all` 在任一任务拒绝时立即返回拒绝，适合结果缺一不可的并行依赖；其他 Promise 不会因此自动取消。`Promise.allSettled` 等全部任务结束，返回每项的 `fulfilled/rejected` 状态，适合批量任务、允许部分失败并需要汇总结果的场景。

需要真正取消网络请求时应配合 `AbortController`。大量任务还要限制并发，直接把上千请求交给 `Promise.all` 可能耗尽连接和内存。

---

### 63. Vue 3 响应式原理是什么？多次同步修改为什么通常只渲染一次？

> 来源：MetaApp 前端一面，8 月 12 日；[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60)

Vue 3 用 Proxy 拦截对象属性访问和修改，通过 `track` 收集当前 effect 依赖，通过 `trigger` 通知相关 effect。`ref` 用 `.value` 包装单值并可持有基本类型，`reactive` 返回对象代理；从 reactive 对象直接解构可能丢失响应式，需要 `toRefs` 等方式保持关联。

多次同步修改会触发多次调度，但组件更新任务会进入队列并按 job 去重，在微任务阶段统一 flush，所以通常只渲染一次。`nextTick` 等待的就是当前更新队列刷新完成后的时机，不是任意固定延迟。

---

### 64. 前端构建和运行时如何优化图片？FCP 应该怎么看？

> 来源：4399 前端一面，7 月 29 日；MetaApp 前端一面，8 月 12 日；[字节业务中台AI全栈面经——日常实习](https://www.nowcoder.com/feed/main/detail/6ac5ba31705a4b64a407b087f39d5447)

构建阶段做尺寸裁剪、WebP/AVIF 转换、质量压缩、响应式 `srcset` 和内容哈希；运行时对首屏关键图预加载并设置明确尺寸，非首屏使用懒加载，静态资源走 CDN 和长期缓存。小图是否内联要看请求开销与缓存复用，不能统一转 base64。

FCP 表示首次绘制 DOM 内容的时间，目标应结合真实用户数据、设备和网络分位数，而不是只报一个实验室数字。优化路径包括减少阻塞 CSS/JS、服务端渲染或预渲染、字体策略、首屏资源优先级和后端 TTFB。

**追问补充**：100 张不同图片不应同时首屏加载：按视口分批懒加载或分页，列表场景配合虚拟化；仅预加载关键图，其余通过 CDN、缓存和 HTTP/2 多路复用传输，并用 Network 面板验证请求数、优先级和瀑布图。

---

### 65. 自动化测试框架的基本原理是什么？人和 AI 的职责边界在哪里？

> 来源：快手测开一面，8 月 12 日；本轮追问：测试框架里除了单测，还有没有别的验证能力？有没有考虑端到端测试？（[阿里虎鲸文娱 - AI 基础设施 - 一面](https://www.nowcoder.com/feed/main/detail/9c2e1794ccc14448a6fc43d596f60f00)）

传统框架负责用例组织、驱动执行、断言、数据/环境管理、Mock、报告与失败重试。接口测试重点校验协议、状态码、Schema、业务副作用和幂等；UI 自动化通过稳定定位符和页面对象封装操作，并保留截图、日志、网络和 Trace 证据。

AI 适合从需求生成候选用例、补边界、维护脆弱定位符、聚类失败和辅助定位根因；确定性执行、关键断言、权限与副作用控制仍应由代码和人负责。高风险发布不能以“模型觉得通过”作为唯一门禁。

---

## Python 与语言设计

### 66. Python 函数参数有哪些类型？`*args` 和 `**kwargs` 分别做什么？

> 来源：阿里云 AI 全栈开发一面；[0924恒生电子｜AI 应用开发工程师 ｜AI面](https://www.nowcoder.com/feed/main/detail/5e0a75e9cf4941a9861b1948fb7f4e60)

Python 参数包括仅限位置参数（`/` 之前）、位置或关键字参数、可变位置参数 `*args`、仅限关键字参数和可变关键字参数 `**kwargs`。调用时，`*iterable` 把可迭代对象展开为位置参数，`**mapping` 把字符串键映射展开为关键字参数；重复绑定、缺少必需参数或出现未接收的关键字都会报错。

默认值在函数定义时求值，而不是每次调用时求值，因此不要用可变对象作默认值。接口设计应把稳定、必需的参数显式写出，避免用 `*args`、`**kwargs` 隐藏契约。

**追问补充**：装饰器应定义 wrapper(*args, **kwargs)，用 functools.wraps 保留元信息，再原样调用 func(*args, **kwargs) 并返回结果；若需校验或重排参数，可用 inspect.signature(...).bind(*args, **kwargs) 明确处理绑定错误。

---

### 67. Python 的鸭子类型是什么？如何兼顾灵活性和可维护性？

> 来源：阿里云 AI 全栈开发一面

鸭子类型关注对象是否提供所需行为，而不是它是否继承某个指定类。它降低了模块耦合，便于替换实现、测试替身和接入第三方对象，但错误往往到运行时才暴露，接口也可能不易发现。

工程上可用清晰的最小协议、类型注解和 `typing.Protocol` 描述能力边界，在外部输入处做校验，并用契约测试覆盖不同实现。不要把鸭子类型理解为完全不需要类型设计。

---

### 68. Python 的迭代器和生成器有什么区别？底层如何保持执行状态？

> 来源：阿里云 AI 全栈开发一面；[ai面试](https://www.nowcoder.com/feed/main/detail/9042487b33c54921982d86614598d7ae)

可迭代对象通过 `__iter__()` 返回迭代器，迭代器用 `__next__()` 逐项产出并在结束时抛出 `StopIteration`。生成器是由含 `yield` 的函数或生成器表达式创建的一类迭代器；每次 `yield` 会挂起执行，并保存指令位置、局部变量和异常处理状态，下次迭代再恢复。

两者都适合惰性处理数据，但迭代器通常只能单次消费，生成器也不会自动缓存已产出的值。处理文件、游标或网络流时还要明确关闭和异常清理路径，不能只依赖垃圾回收。

**追问补充**：普通函数调用时立即执行并返回一个具体结果；含 yield 的生成器函数调用时只返回生成器对象，函数体尚未执行，需通过 next() 或 for 驱动，结束时以 StopIteration 携带 return 值。

---

### 69. 托管语言不暴露裸指针和指针算术，有哪些收益与代价？

> 来源：视频 b 二面

不允许任意地址读写和指针算术，可以减少越界访问、悬空指针、重复释放等内存安全问题，也让 GC 能移动对象并保持跨平台对象模型。代价是开发者难以精确控制布局、生命周期和零拷贝路径，FFI、设备内存及高性能系统代码需要额外抽象，GC 还可能带来延迟波动。

这不代表语言内部没有引用或地址。成熟运行时通常提供数组切片、安全句柄和受控的 `unsafe`/FFI 边界；工程原则是把不安全代码压缩到少量、可审计且有基准测试的模块中。

---

## AI Infra、网络与协作工具

### 70. NPU 和 GPU 在硬件架构与编程模型上有什么区别？

> 来源：百度 AI Infra 一面；本轮追问：描述一个你熟悉的 GPU 或 DCU 的架构（[0915 百度二面](https://www.nowcoder.com/feed/main/detail/d4397071257a4ea69735f7f0a8f7dc1e)）

GPU 是面向图形与通用并行计算的可编程处理器，生态成熟、算子覆盖广，适合训练和包含动态控制流的混合负载。NPU 通常围绕矩阵乘、卷积和量化算子设计数据流、片上存储及专用执行单元，单位功耗吞吐可能更高，但算子支持、动态形状、编译器和调试能力更依赖具体平台。

选型不能只比较峰值 FLOPS/TOPS。还要用真实模型衡量算子回退、编译时间、显存/片上内存、数据搬运、精度、批量大小、端到端延迟和部署生态。

---


以典型 GPU 为例，其计算单元由多个 SM 组成，每个 SM 包含标量核心、矩阵/专用计算单元、寄存器和共享内存，并通过 warp 以 SIMT 方式执行线程块；各 SM 共享更大容量的缓存和显存。内核由线程块映射到 SM，性能取决于并行度、访存合并、占用率和同步开销。
### 71. 扫码登录的完整流程是什么？如何防止二维码被重放？

> 来源：快手 Agent 开发一面；[美团AI全栈一面，AICoding把我整不会了](https://www.nowcoder.com/discuss/929871920625963008)

网页先向服务端申请短期、随机、只使用一次的二维码 ID，并把它与当前浏览器会话绑定。已登录的移动端扫码后只上报该 ID，服务端先把状态改为已扫描；用户在手机上确认后，网页通过轮询、SSE 或 WebSocket 收到结果，再原子消费该 ID 并建立自己的登录会话。

二维码中不应直接包含长期凭据。系统还要设置过期时间、一次性消费、设备和业务信息确认、速率限制及审计，校验请求来源并防止并发确认。已过期、已取消或已消费的 ID 必须拒绝再次兑换。

---

### 72. HTTP Keep-Alive 和 HTTP 连接池是什么关系？

> 来源：信服 Agent 开发一面

HTTP Keep-Alive 是协议层允许多个请求复用同一 TCP 连接的能力；连接池是客户端对一组可复用连接的资源管理，包括按目标地址分池、最大连接数、空闲队列、存活检查、空闲超时和最大寿命。只有 Keep-Alive 而没有合理的池化，仍可能频繁建连或产生无界连接。

HTTP/1.1 中一条连接通常同时承载一个在途请求，连接池靠多条连接提供并发；HTTP/2 可以在一条连接上多路复用多个流。池的超时应与服务端、代理和负载均衡器协调，否则复用到已被对端关闭的连接会产生间歇性失败。

---

### 73. TCP/HTTP 抓包该选什么工具？HTTPS 内容在什么条件下可以解密？

> 来源：视频 b 二面

链路和传输层问题可用 `tcpdump` 抓取、Wireshark 分析；浏览器请求先看 DevTools，需要观察或改写应用层流量时可在授权测试环境使用 Charles、Fiddler 或 mitmproxy。先按问题选择观测层级，不要为了看一个 HTTP Header 就抓整机流量。

HTTPS 抓包默认只能看到地址、握手和流量特征，看不到明文。受控环境可使用客户端导出的 TLS 会话密钥，或让测试设备信任调试代理的 CA；证书固定、mTLS、QUIC 和不支持导出密钥的客户端会限制这种方式。不得在未授权设备上安装根证书，也不应通过收集生产私钥来绕过安全边界。

---

### 74. `git merge` 和 `git rebase` 有什么区别？项目中如何选择？

> 来源：视频 b 二面

`merge` 保留原有提交和分叉关系，并用合并提交连接两条历史；`rebase` 把一组提交重新播放到新基线，提交 ID 会改变，但历史更线性。两者最终都能整合代码，区别主要在历史语义和协作风险。

尚未共享的个人分支可在合入前 rebase，便于整理提交；已经发布、多人依赖或受保护的分支通常用 merge，避免改写他人历史。确需更新共享分支时要先协调，并使用 `--force-with-lease` 而不是无条件强推；复杂 rebase 还要逐提交解决冲突并重新测试。

---

## 前端、搜索与业务一致性

### 75. 虚拟列表的基本原理是什么？实现时有哪些容易忽略的问题？

> 来源：税友开发实习一面；[国药控股广东生物科技AI agent](https://www.nowcoder.com/feed/main/detail/18d271f86bda4d81afb30f02164352f1)

虚拟列表只渲染视口附近的元素，用占位容器保持总滚动高度，再通过偏移量把可见节点放到正确位置；上下多渲染少量 overscan 可降低快速滚动时的白屏。固定高度列表可直接按索引计算，动态高度列表需要测量、缓存并在高度变化后修正偏移。

实现时要保持稳定 key，处理滚动、窗口缩放、焦点和键盘访问，并避免频繁测量触发布局抖动。虚拟化只减少 DOM 和渲染成本，不会自动减少后端数据量，仍要配合分页、取消旧请求和缓存。

---

### 76. SSR 和 CSR 有什么区别？如何选择渲染方式？

> 来源：税友开发实习一面

SSR 在服务端生成可直接展示的 HTML，通常有利于首屏和搜索引擎抓取，但会增加服务端计算、缓存及部署复杂度，交互前还要完成 hydration。CSR 由浏览器下载 JavaScript、获取数据并渲染，静态托管和前后端解耦更简单，但弱网或低端设备上的首屏可能更慢。

选择应看 SEO、首屏 SLA、交互复杂度、个性化程度和基础设施，而不是全站二选一。常见方案是营销和内容页使用 SSR/SSG，登录后的高交互页面使用 CSR；SSR 还要避免服务端与客户端状态不一致导致 hydration mismatch，并安全序列化初始数据。

---

### 77. 页面出现卡顿时，应该如何定位和优化？

> 来源：OPPO AI 全栈开发一面

先固定设备、网络、操作路径和性能指标，区分加载慢、交互响应慢、滚动掉帧还是内存持续增长。使用浏览器 Performance 面板查看长任务、脚本、样式计算、布局和绘制，结合 Network、Memory、FPS、Web Vitals 以及组件 profiler 定位真正的主线程或资源瓶颈。

优化要对应证据：拆分长任务或移到 Worker，批量 DOM 读写避免强制同步布局，对高频事件节流，长列表虚拟化，减少无效渲染并优化图片和缓存。完成后用相同场景复测，并关注真实用户的 P75 INP、LCP、CLS，而不是只比较一次本机录屏。

---

### 78. Elasticsearch 的查询流程是什么？倒排索引如何参与检索？

> 来源：小红书开发实习一面

协调节点解析并重写查询，把请求路由到相关分片；每个分片在 query 阶段利用词典和倒排表找到包含 term 的文档，执行过滤、评分并返回局部 Top K；协调节点归并排序后，再进入 fetch 阶段从命中分片取回 `_source` 或所需字段。

精确过滤尽量放在 filter 上下文以避免无意义评分并利用缓存，排序和聚合通常依赖 doc values。排查慢查询还要关注分词和映射、深分页、脚本、聚合基数、分片扇出及 fetch 数据量，不能把所有延迟都归因于倒排索引。

---

### 79. Elasticsearch 有 12 个分片、QPS 只有 1 仍然很慢，如何排查并重建索引？

> 来源：小红书开发实习一面

先用 slow log、Profile API 和分段耗时确认慢在协调、query 还是 fetch，再检查查询 DSL、映射、分片数据倾斜、冷缓存、磁盘、合并、刷新、GC 和线程池队列。低 QPS 不代表低成本；过多小分片会让每次请求扇出到更多 Lucene 实例，增加协调、文件句柄和堆开销。

重建时创建具有正确 mapping、分片数和刷新策略的新索引，通过 reindex 或 CDC 回放数据，校验数量、关键查询和抽样哈希后原子切换 alias。迁移期间要处理增量写入并保留回滚窗口，不能直接删除旧索引，也不能期待原地修改主分片数解决所有问题。

---

### 80. DDD 和 MVC 有什么区别？为什么 Domain 层不应依赖 Infrastructure 层？

> 来源：小红书开发实习一面

MVC 主要组织交互和展示职责，DDD 关注复杂业务的领域建模、限界上下文、聚合及不变量，两者不在同一抽象层级，也可以同时使用。常见分层是接口/展示层、应用层、领域层和基础设施层：应用层编排用例，领域层表达业务规则，基础设施层实现数据库、消息和外部服务适配。

Domain 通过自己定义的仓储等接口依赖抽象，Infrastructure 反向实现这些接口，使核心规则可独立测试和演进。充血模型把行为和不变量放进领域对象；简单 CRUD 若没有复杂规则，强行套完整 DDD 只会增加映射和调用层级。

---

### 81. MySQL 同步 Elasticsearch 时，如何防止订单状态被乱序事件回退？

> 来源：小红书开发实习一面

数据库事务提交后通过 outbox 或 binlog CDC 发布变更，每条订单事件携带单调递增的版本号。消费者按订单 ID 分区以保持局部有序，并在写 ES 时使用外部版本或条件更新，只接受比当前版本新的事件；重复消费要幂等，失败进入有界重试和死信队列。

不需要为了一个订单的顺序牺牲全局并行度，也不应每条事件都回查 MySQL。可用 singleflight、短期缓存或批量合并保留每个订单的最新版本，并用定期对账修复漏事件；完成态能否再变化应由显式状态机和合法迁移规则决定，而不是只比较状态字符串。

---

## 分布式执行与稳定性

### 82. ZooKeeper 的 QPS 应该如何压测？常见瓶颈在哪里？

> 来源：小舒一面；[百度 Agent 一面](https://www.nowcoder.com/feed/main/detail/53542e2dcfd44b1d84b0ae55b4fc1b35)

ZooKeeper 没有脱离环境的固定 QPS。结果取决于读写比例、数据大小、watcher 数量、会话创建、客户端并发、磁盘同步、网络时延、集群规模和一致性要求。压测应使用与生产接近的读写及 watch 模型，预热后逐步增加并发，同时记录吞吐、P50/P95/P99、错误率、未完成请求和节点资源。

写请求要经过 Leader 排序、事务日志落盘和多数派确认，常受磁盘及 quorum 时延限制；读请求通常可由本地节点处理，但大对象、watch 风暴、会话抖动和请求队列同样会拖慢系统。回答一个背来的 QPS 数字没有意义，应解释测试条件、饱和点和延迟拐点。

---

### 83. 特征依赖形成 DAG 时，如何处理超时、降级、缓存和请求去重？

> 来源：小舒一面；本轮追问：串行改并行后是否应调整各 RPC 和整条分支的超时？（[9.14字节推荐架构一面](https://www.nowcoder.com/feed/main/detail/467d01beed8a40b89ac414b90fc7fb85)）；本轮追问：工具之间有依赖，怎么并行执行并处理错误？（[9.15秋招东方财富AI应用一面](https://www.nowcoder.com/feed/main/detail/d406314e733c4fc8945637ce5d06cdcf)）；[虾皮秋招 研发工程师](https://www.nowcoder.com/feed/main/detail/dcb2bf1c6b7c4b6a9f4c095ba9329bce)

先把特征计算建模为有向无环图，显式标记依赖、关键性和每个节点的预算。调度器并行执行互不依赖的节点并传播全局 deadline；关键前置失败时取消无意义的下游任务，非关键特征超时则使用默认值、最近一次成功值或降级模型，同时把降级信息传给最终结果。

缓存键必须包含实体、特征版本和影响结果的上下文，避免跨用户或跨版本误用。相同在途计算可用 singleflight 合并，已完成结果按新鲜度和业务容忍度复用；重试只用于幂等、可恢复错误且不得突破剩余预算。监控应展示关键路径、节点命中率、去重率、超时和降级比例，便于区分单节点慢与 DAG 放大效应。

**追问补充**：Reranker 超时时返回超时前的召回或粗排结果，并保留候选顺序；结果中显式标记reranker_timeout、fallback_stage和降级原因，便于调用方区分正常精排与降级结果，并分别统计质量和超时率。

---

## 身份认证与会话

### 84. Cookie、Session 和 JWT 有什么区别？JWT 的结构和验签流程是什么？

> 来源：[字节跳动火山引擎方舟 Managed Agent 一面，8 月 13 日](https://www.nowcoder.com/discuss/917561494512861184)；本轮追问：用户信息 Token 放在 Header 还是 Cookie？（[cvte应用软件开发一面](https://www.nowcoder.com/feed/main/detail/c2155d2308de452c8a6e3cf2bbb482f3)）

Cookie 是浏览器按域、路径等规则保存并随请求发送的小型键值载体，不等于认证方案；Session 是服务端保存的会话状态，客户端通常只在 Cookie 中携带随机 Session ID；JWT 是一种 Token 格式，既可以放在 `Authorization` 请求头，也可以放进 Cookie。因此三者不在同一层级，`Session ID + Cookie` 和 `JWT + Cookie` 都成立。Session 容易即时撤销，但分布式部署需要共享会话；JWT 便于多个服务本地验证，但体积更大，令牌中的权限也可能过时。

常见的签名 JWT 由 `header.payload.signature` 三段组成。Header 声明算法和 `kid`，Payload 保存 `sub`、`iss`、`aud`、`exp`、`nbf`、`jti` 等 claims；前两段只是 Base64URL 编码，并未加密。Signature 对前两段的原始编码结果签名：HMAC 使用共享密钥，RSA、ECDSA 等算法使用私钥签发、公钥验证。

服务端不能直接相信解码后的 Payload，而应固定允许的算法，按受信任的 `kid` 选择密钥，验证签名后再校验 `exp`、`nbf`、`iss`、`aud`、主体和令牌用途。验签通过只说明来源可信且内容未被篡改，不代表当前请求一定有业务权限；授权规则仍要单独检查。

JWT 所谓无状态，是因为身份声明和完整性证明都随 Token 携带，服务端验证 access token 时不必像随机 Session ID 那样查询会话记录，并不表示整个认证系统没有状态。生产中通常使用短寿命 access token 和可轮换、可撤销的 refresh token；需要立即失效时，可查询 `jti` denylist、会话版本或最后登出时间，代价是重新引入状态。计划内轮换应通过 `kid` 并行发布新旧验证密钥，并将旧验证密钥保留到已签发 Token 过期；密钥泄漏时则应立即下线旧密钥，并通过拒绝列表、会话版本或强制重新登录处置受影响令牌。

签名不等于加密，Payload 不应存放秘密；服务端不得接受 `alg=none`，也不能让 Token 自己决定允许的算法。Token 放在 `localStorage` 容易被 XSS 读取；放在 `HttpOnly`、`Secure`、`SameSite` Cookie 中可以降低脚本窃取风险，但仍要根据跨站场景防范 CSRF。JWT 本身并不天然比服务端 Session 更安全。

---

## 近期新增：语言、云原生与稳定性

### 85. JavaScript 的事件循环是怎么工作的？

> 来源：拼多多 AI 全栈两轮技术面，8 月 23 日

JavaScript 主线程执行当前调用栈；异步 API 由宿主环境处理，完成后把回调放入任务队列。一次宏任务结束且调用栈清空后，运行时会清空微任务队列，再进入渲染和下一轮宏任务。`Promise.then`、`queueMicrotask` 属于微任务，`setTimeout`、I/O 回调通常属于宏任务；Node.js 还按 timers、poll、check 等阶段推进，并有 `process.nextTick` 等更高优先队列。持续追加微任务会让定时器和渲染饥饿，不能只背“微任务先于宏任务”。

---

### 86. TypeScript 中 `interface` 和 `type` 应该怎么选？

> 来源：拼多多 AI 全栈两轮技术面，8 月 23 日

两者都能描述对象并支持扩展。`interface` 支持声明合并，适合公开、可扩展的对象契约和类实现；`type` 能表达联合、交叉、条件类型、元组及映射类型，组合能力更强。工程上对稳定对象 API 可优先 `interface`，对联合状态和类型运算用 `type`。选择应服务于可读性和团队规范，不应声称二者存在普遍的性能差异。

---

### 87. Node.js 如何读取大文件，避免一次性占满内存？

> 来源：拼多多 AI 全栈两轮技术面，8 月 23 日

使用 `createReadStream` 分块读取，并通过 `pipe` 或 `pipeline` 把数据传给转换和写入流。背压会在下游缓冲区达到高水位时暂停上游，待 `drain` 后继续，避免生产速度长期高于消费速度。还要处理流错误、取消、文件描述符关闭和不完整输出；按行解析时需保留跨 chunk 的残片。`readFile` 适合可控的小文件，不适合把未知体积内容整体放入堆。

---

### 88. `kubectl create pod` 后，Kubernetes 各组件如何协作？

> 来源：[字节社招一面](https://www.nowcoder.com/feed/main/detail/a385d6cc457d47c99c03cb8ea752ab89)，8 月 23 日

`kubectl` 向 API Server 提交对象；API Server 完成认证、授权、准入和 schema 校验后把期望状态写入 etcd。Scheduler 监听未绑定 Pod，经过过滤和打分选择节点并写回绑定结果；目标节点的 kubelet 发现任务后通过 CRI 请求容器运行时拉镜像、创建 sandbox 和容器，通过 CNI 配置网络、CSI 挂载存储。kubelet 持续上报状态，控制器负责副本和故障收敛。API Server 是控制面的入口，不应描述为各组件直接读写 etcd。

---

### 89. Pod、Service 和 Ingress 在请求流量路径中分别承担什么角色？

> 来源：字节社招一面，8 月 23 日

Pod 是实际运行工作负载的最小调度单元，IP 会随重建变化；Service 提供稳定虚拟地址和服务发现，并把流量转发到匹配标签的健康 Pod；Ingress 描述集群入口的 HTTP/HTTPS 路由规则，必须由 Ingress Controller 实现。典型外部链路是负载均衡器或节点入口到 Ingress Controller，再到 Service 和 Pod。网络策略、就绪探针、会话保持及 CNI 实现会影响实际路径，不能把 Ingress 当成自动存在的代理进程。

---

### 90. 多租户系统如何同时实现数据隔离和资源隔离？

> 来源：杭州某小厂实习面经，8 月 19 日；本轮追问：多租户场景下，不同租户怎么做资源隔离、并发限制？（[阿里云一面](https://www.nowcoder.com/feed/main/detail/ceade00d742046d0bef6bee7fe7a7aad)）；[长鑫存储agent开发实习一面](https://www.nowcoder.com/feed/main/detail/6b5af9c0f2cd4cd68709a0932656afd4)

数据层可按风险和规模选择独立库、独立 schema 或共享表加 `tenant_id`。共享表不能只依赖开发者手写 `WHERE tenant_id`，应在认证后形成不可伪造的租户上下文，由 ORM 全局过滤、数据库行级安全和唯一索引共同约束；缓存、对象存储、消息和搜索索引也必须把租户纳入命名空间。资源层再设置连接池、线程池、队列、QPS、存储和成本配额，防止热点租户拖垮他人。审计日志应记录租户、操作者和请求链路。

**追问补充**：多租户的价值在于让多个客户共享一套产品和运维体系，降低部署、升级与资源成本，同时通过租户边界避免数据泄露和相互影响。它不是单纯的平台概念，而是共享基础设施下的隔离与计费模型；若租户规模或合规风险较高，也可升级为独立实例。

---


并发控制可按租户维护信号量或令牌桶，分别限制并发请求、队列长度和 QPS；超限排队、限流或快速失败，并设置租户级连接池、线程池及任务配额。用隔离压测验证单个租户突发流量不会挤占其他租户资源。
### 91. Python 装饰器的原理是什么？常见工程用途有哪些？

> 来源：燧原软件解决方案一面，8 月 21 日；本轮追问：如果要给一个带位置参数、关键字参数，还有返回值的业务函数加统计执行耗时的装饰器，你会怎么处理被装饰函数的参数传递和返回值透传问题？ / Python中用来实现装饰器时，能自动保留被装饰函数源信息，比如函数名、文档字符串的标准库装饰器是什么？（[27秋招-恒生电子AI面试-AI应用开发岗-26.9.23](https://www.nowcoder.com/feed/main/detail/724b6bc0f02b42e58ff7397be51df3b5)）；[0924恒生电子｜AI 应用开发工程师 ｜AI面](https://www.nowcoder.com/feed/main/detail/5e0a75e9cf4941a9861b1948fb7f4e60)

函数是对象，装饰器接收函数并返回新的可调用对象；`@decorator` 等价于定义后执行 `func = decorator(func)`。带参数装饰器会再增加一层闭包。工程中常用于日志、指标、鉴权、缓存、重试和事务边界。实现时用 `functools.wraps` 保留函数名、文档和签名，并谨慎处理同步/异步函数、异常语义和共享可变状态，避免装饰器悄悄改变原函数契约。

---


可用 `@functools.wraps(func)` 定义 `wrapper(*args, **kwargs)`，原样调用 `result = func(*args, **kwargs)`，记录耗时后返回 `result`；异常应继续抛出，避免改变调用方契约。
### 92. `mmap` 是什么？适合哪些文件和进程通信场景？

> 来源：拼多多 AI Agent 岗技术面，8 月 19 日；[百度agent harness一面](https://www.nowcoder.com/discuss/937747584578310144)

`mmap` 把文件或匿名内存映射到进程虚拟地址空间，访问时由缺页机制按需装入页面，省去显式 `read/write` 的一层用户缓冲区复制，也便于随机访问和多进程共享。它适合大文件随机读取、索引和共享内存，但不是无成本：缺页、脏页回写、地址空间、文件截断和一致性都要处理；小文件顺序读取未必比缓冲 I/O 更快。多进程写共享映射仍需锁或无锁协议。

**追问补充**：处理大文件时，read 通常按固定大小循环读入用户缓冲区，适合顺序流式处理并可控制内存；mmap 通过缺页按访问位置装入，适合随机访问或共享，但要处理页抖动、地址空间、文件截断和写回。两者都应分块做真实基准测试，不能假定 mmap 必然更快。

---

### 93. ZGC 相比 G1/CMS 的核心设计和适用场景是什么？

> 来源：途游 Agent 二面，8 月 18 日

ZGC 以超低停顿为目标，把标记、重定位和引用处理的大部分工作与应用并发执行，并通过染色指针和加载屏障维护对象转移期间的正确访问。它适合大堆、对尾延迟敏感的服务，停顿通常不随堆大小线性增长；代价是并发 GC 线程、屏障和额外内存带来的吞吐开销。选择前应基于延迟 SLO、堆规模、分配速率和 CPU 余量压测，而不是看到低停顿就无条件替换 G1。

---

### 94. 为什么 CSRF 请求能自动携带 Cookie？应该如何防御？

> 来源：字节抖音 Agent 一面，8 月 18 日

浏览器是否发送 Cookie 主要依据目标域、路径、Secure 和 SameSite 等属性，而不是依据发起页面是否可信。攻击页面可以诱导浏览器向已登录站点发请求，浏览器便可能附带该站点 Cookie。防御应组合使用 `SameSite=Lax/Strict`、不可预测的 CSRF Token、Origin/Referer 校验和对敏感操作的重新认证；同时避免用 GET 修改状态。CORS 主要限制脚本读取响应，不等价于 CSRF 防护。

---

### 95. MySQL B+ 树索引页分裂会造成什么影响？如何降低写放大？

> 来源：多益网络 AI 应用开发一面，8 月 17 日

目标页空间不足时，InnoDB 需要分配新页、移动部分记录并更新父节点；分裂会增加随机 I/O、redo、页碎片和缓存扰动，连续发生还可能向上级传播。随机主键和在中间位置频繁插入更容易触发分裂。可优先使用趋势递增且不过宽的主键，控制索引数量和字段宽度，批量排序写入，并根据真实碎片和空间利用率选择重建索引。盲目把填充率压得很低会浪费缓存，仍需按写入模式权衡。

---

### 96. Next-Key Lock 如何防止幻读？为什么仍可能引发死锁？

> 来源：多益网络 AI 应用开发一面，8 月 17 日；本轮追问：有没有看过间隙锁的实现？（[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)）

InnoDB 在可重复读下对索引记录及其前方间隙加锁，阻止其他事务在查询范围内插入新记录，从而保护当前读的范围结果。锁定范围取决于索引和查询条件；缺少合适索引可能扫描并锁住更大区间。两个事务若以不同顺序锁多个记录或间隙，或插入意向锁与范围锁形成等待环，仍会死锁。治理要统一访问顺序、缩小事务和扫描范围、建立合适索引，并让应用捕获死锁后有界重试。

---


实现上，间隙锁不是独立的“空记录”，而是索引页上记录锁语义的范围标记，锁住相邻索引值之间的区间；具体边界由扫描访问路径决定。可结合源码中的锁对象与加锁路径，并用 SHOW ENGINE INNODB STATUS、性能模式锁表验证实际锁范围。
### 97. 数据库事务已提交，但消息发送失败，如何保证任务不丢失？

> 来源：多益网络 AI 应用开发一面，8 月 17 日；本轮追问：用户扣积分场景：如何保证积分扣减的一致性？比如图片生成失败，积分需要回退。有人说消息队列也不可靠，消息可能投递失败，你怎么处理？（[上海代码一行科技公司 - 9月10日- 一面-秋招](https://www.nowcoder.com/discuss/929791548588294144)）

常用 Transactional Outbox：业务更新和待发布事件在同一个本地数据库事务中提交，后台发布器轮询或由 CDC 读取 outbox，发送成功后标记状态。发布器崩溃可能导致重复发送，因此消费者必须按 event ID 幂等；失败需要有界重试、告警和死信处理。直接“先写库再发 MQ”存在崩溃窗口，先发消息再提交又可能让消费者看到不存在的业务状态；分布式事务只在确有强一致需求且基础设施支持时采用。

---


积分可采用“冻结—成功扣除—失败退款”的状态机，扣减、任务单和 outbox 在同一事务落库；消费端按任务号幂等，生成失败发布退款事件并重试，配合定时对账扫描异常状态，避免依赖消息队列一次投递成功。
### 98. Java 服务 Full GC 频繁但堆使用量并不高，如何排查？

> 来源：阿里 Agent 开发一面，8 月 17 日

先从 GC 日志和 JFR 确认触发原因、回收前后占用、停顿阶段和分配速率，而不是只看监控截图。低堆占用仍可能由元空间耗尽、直接内存压力、显式 `System.gc()`、Humongous 对象、晋升失败、类加载器泄漏、JNI 或 GC 参数触发。再结合 native memory tracking、类直方图、线程栈和容器内存限制定位堆外来源。修复根因后再调堆和收集器；单纯扩大 `-Xmx` 对元空间或直接内存问题无效。

---

## 近期新增：工程平台与语言运行时

### 99. Go `context` 如何传播取消、超时和请求级数据？

> 来源：视频一面，8 月 9 日

`context` 形成父子树，父节点取消或 deadline 到期会关闭所有后代的 `Done`；调用链应把 `ctx` 作为首个参数显式传递，I/O、RPC 和 goroutine 同时监听取消信号。`WithValue` 只放请求 ID 等少量请求级元数据，不用于业务参数；创建的 cancel 必须调用，避免定时器和子节点泄漏。后台任务若需脱离请求，应显式创建新生命周期并复制必要元数据。

---

### 100. Go 定时器和 Ticker 的运行时机制与常见泄漏是什么？

> 来源：视频一面，8 月 9 日

运行时维护按时间排序的定时器结构，由调度器和网络轮询共同唤醒到期任务。`Timer` 单次触发，`Ticker` 周期触发；复用时正确处理 `Stop/Reset` 和通道中可能残留的事件。长期循环应停止 Ticker，不能反复 `time.After` 制造大量短命定时器；回调耗时超过周期时还要明确跳过、串行还是并发策略。

---

### 101. 单个 Pod CPU 或内存异常时，如何定位到进程和代码？

> 来源：视频一面，8 月 9 日

先确认 request/limit、throttling、OOMKilled、重启和节点压力，再比较同版本 Pod 判断是流量倾斜还是实例异常。进入容器查看进程、线程、文件描述符和 cgroup 指标；Java 用 JFR/jstack/heap dump，Go 用 pprof，通用场景用 top、pidstat、perf。结合请求 trace、GC、分配率和发布变更定位根因，避免只重启或盲目扩容。

---

### 102. OAuth 2.0 授权码流程如何工作？PKCE、state 和 redirect URI 分别防什么？

> 来源：小红书数据库智能化实习一面，8 月 10 日

客户端把用户引导到授权端点，携带 client、固定 redirect URI、scope、state 和 PKCE challenge；用户授权后返回短寿命 code，客户端后端用 code、client 身份和 verifier 换 Token。`state` 绑定发起会话防 CSRF，PKCE 防 code 被截获后换 Token，redirect URI 必须精确白名单防跳转劫持。Access Token 短寿命，Refresh Token 轮换并可撤销；OAuth 是授权框架，不等于登录协议，登录通常由 OIDC 补充身份声明。

---

### 103. CI/CD 流水线应包含哪些阶段和质量门禁？

> 来源：松延动力科技测试实习面试，8 月 12 日；米哈游开发一面，8 月 12 日；[美团AI全栈一面，AICoding把我整不会了](https://www.nowcoder.com/discuss/929871920625963008)

典型流程是依赖锁定与构建、静态检查、单元测试、制品签名、集成/安全测试、部署预发布、冒烟与回归、审批/自动发布。制品应一次构建、多环境晋级，不能每个环境重新编译。门禁按风险设置，失败默认阻断；不稳定测试先隔离并告警，不能静默重跑到通过。发布绑定版本、配置、迁移和回滚目标，并用金丝雀指标决定扩量。

---

### 104. 线上真实流量如何安全录制、脱敏和回放？

> 来源：益善一面，8 月 11 日；本轮追问：如果用户数据要上传云端，怎么脱敏？（[蔚来——大模型算法岗（智能座舱/自动驾驶）实习一面](https://www.nowcoder.com/discuss/930755708008558592)）

在网关或服务边界采样请求及必要上下文，删除凭据、PII 和不可复现字段，使用稳定映射保持关联关系。回放必须进入隔离影子环境，写操作替换为 Mock、影子库或强制只读，并重写时间、ID 和外部依赖。按原始节奏或受控倍速施压，对比响应、状态和副作用；记录数据版本和覆盖范围，不能把生产请求直接重放到真实下游。

---


上传前先做字段盘点和分级：直接标识符删除或不可逆替换，准标识符按业务聚合，敏感字段使用与生产隔离的密钥做令牌化；云端只接收必要字段。通过重识别抽样、规则扫描和人工复核验证脱敏效果，映射表不随数据上传。
### 105. Python 浮点数为什么不精确？金额计算应该怎么做？

> 来源：益善一面，8 月 11 日

二进制浮点无法有限表示许多十进制小数，运算还会累积舍入误差，因此 `0.1 + 0.2 != 0.3`。比较使用容差而非直接相等；金额优先用最小货币单位整数或 `Decimal`，并明确舍入模式和精度。字符串转换为 Decimal，避免先经过 float；数据库、JSON 和跨服务协议也应统一金额单位。

---

### 106. 大文件分片上传和断点续传如何设计？

> 来源：华为通用软件开发一面，8 月 12 日；[字节 AI 全栈一面（飞书）](https://www.nowcoder.com/discuss/931555466247700480)；[cherrystudio面试](https://www.nowcoder.com/feed/main/detail/84ecd256fe4d4a1597a0f29f18f853fb)；[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)

初始化任务后返回 upload ID、分片大小和已存在分片；每片携带序号、长度、哈希和幂等键，可并行上传并查询缺失列表。服务端保存位图/状态，校验单片后落临时存储，全部到齐再按序合并并校验整体哈希，最后原子发布。重复、乱序和客户端重连不能产生重复数据；过期任务清理临时分片，合并与业务记录更新需要可恢复状态机。

**追问补充**：支持文件上传：分片内容通常写入对象存储或临时文件，上传 ID、分片序号、哈希和状态放在数据库；完成校验后通过对象存储合并或生成最终对象，并保存文件元数据与访问权限。

---

### 107. 手动创建的对象如何纳入 Spring 容器？注入方式应该怎么选？

> 来源：华为通用软件开发二面，8 月 12 日

容器外 `new` 的对象不会自动经历依赖注入和完整 Bean 生命周期。可通过 `@Bean` 工厂方法、组件扫描或 `registerBean` 注册；确需对现有对象注入可使用 BeanFactory 的受控 API，但通常应重构创建边界。构造器注入能表达必需依赖、便于不可变和测试，应优先；setter 适合可选依赖，字段注入隐藏依赖且难测试。

---

### 108. Redis Stream、Pub/Sub 和 RabbitMQ 应该如何选择？

> 来源：华为通用软件开发二面，8 月 12 日；[中兴软开一面](https://www.nowcoder.com/feed/main/detail/0b39815babfb47108464ffabdf929eba)；本轮追问：rabbitmq的作用是什么，如何削峰，具体怎么用到（[赛诺贝斯 面经 一面过 笔试过 hc无](https://www.nowcoder.com/discuss/930126120177926144)）

Pub/Sub 不持久化、无确认，消费者离线会丢消息，适合瞬时通知；Stream 有持久记录、消费组、pending 和确认，适合轻量可靠队列，但治理能力有限；RabbitMQ 提供路由、确认、持久化、死信、重试和成熟运维。选择应看可靠性、堆积、路由、顺序和团队基础设施，不要因为已有 Redis 就默认承担关键业务消息。

---


RabbitMQ可把突发请求先写入持久化队列，生产者快速返回，消费者按固定并发和prefetch逐步处理，从而削峰；处理成功后ack，失败可重试或进入死信队列。例如下单后将发券、通知等耗时任务投递到队列，业务消费者异步执行并监控堆积。
### 109. Java 虚拟线程、平台线程和异步编程应该怎么选？

> 来源：华为通用软件开发二面，8 月 12 日

虚拟线程由 JVM 调度，适合大量阻塞式 I/O，让同步代码保持可读；CPU 密集任务不会因线程更多而变快。平台线程适合数量受控、需要线程亲和或依赖 ThreadLocal/Native 行为的场景。回调/响应式异步能精确控制资源但增加传播和调试复杂度。上线前检查 pinning、连接池瓶颈、ThreadLocal 占用和限流，虚拟线程不能替代下游容量控制。

---

### 110. Git merge 和 rebase 有什么区别？已共享提交为什么不能随意 rebase？

> 来源：米哈游开发一面，8 月 12 日

merge 保留两条历史并创建合并提交；rebase 把提交复制到新基线，形成线性历史，但提交哈希会改变。只在本地未共享分支上自由 rebase；远端已被他人基于其开发时重写会造成重复提交和困难冲突。确需整理共享分支应先协调、使用 `--force-with-lease` 并留恢复点，主干通常用 merge/revert 保持可追溯。

---

### 111. 构建或 CI 概率失败时，如何判断应该阻断还是重试？

> 来源：米哈游开发一面，8 月 12 日

先按依赖下载、环境差异、资源争用、测试竞态和外部服务分类，并保存日志、制品、随机种子和环境指纹。重跑只用于确认 flaky，不能把“重试后通过”当成功；门禁应阻断并把不稳定用例隔离到负责人和修复 SLA 下。依赖锁定、Hermetic build、测试隔离和可重复环境消除根因；关键发布不得依赖概率通过。

---

### 112. Python list、tuple 和 dict 的语义、复杂度与大对象风险是什么？

> 来源：米哈游开发一面，8 月 12 日；[滴滴 java 一面 10.15](https://www.nowcoder.com/feed/main/detail/5b57de7f52e94f3f8985ee51f1f78a43)；[佰聆数据 助理AI应用开发工程师](https://www.nowcoder.com/feed/main/detail/3e95d47e9d4d40e09b1e5f2e8daf06c9)

list 是可变连续引用数组，尾部追加摊销 O(1)，中间插删 O(n)；tuple 不可变、可哈希取决于元素，适合作稳定记录；dict 是哈希表，平均查改 O(1)，但有扩容和哈希退化风险。大 dict 会因稀疏桶、对象头和引用产生显著额外内存，并增加 GC 与缓存压力；应评估紧凑结构、分片、外部存储或批处理。

**追问补充**：元组不可变是指其元素引用及长度不能被替换、增删，并非递归冻结；若元组包含列表等可变对象，列表内容仍可修改。元素全部可哈希时元组才可作为字典键或集合元素。

---

### 113. Python 多线程之间如何通信和安全终止？

> 来源：米哈游开发一面，8 月 12 日

优先使用 `queue.Queue` 传递任务和结果，它提供同步和背压；共享状态用 Lock/Condition/Event 保护，避免忙等。用 sentinel、Event 或取消协议通知退出，主线程 join 并处理未完成任务。GIL 不保证复合业务操作原子，也不适合 CPU 密集并行；CPU 任务用多进程或原生扩展。

---

### 114. 撤销/重做系统如何设计？

> 来源：米哈游开发一面，8 月 12 日

将用户动作建模为 Command，保存 `execute/undo` 所需的最小状态；已执行命令压入 undo 栈，撤销后移入 redo 栈，新动作会清空 redo 分支。大对象使用增量 diff、事件日志或快照 + 日志，不能每步复制全量状态。外部副作用需补偿命令且可能不可完全逆，必须明确失败与持久化恢复。

---

### 115. 冷热数据如何识别并分层存储？

> 来源：浦金科一面，8 月 12 日；[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)

依据访问频率、最近访问、业务价值、合规保留和恢复 SLA 分类，而非只按时间。热数据放高性能存储/缓存，温数据放低成本在线层，冷数据压缩归档到对象存储；迁移通过生命周期任务执行并保留索引。读取冷数据要支持异步恢复和回迁，删除/归档需审计。持续监控命中率、迁移成本和误判，避免热点突发时雪崩回源。

---

### 116. Raft 如何保证一致性？etcd 如何基于租约实现服务发现？

> 来源：成都晓多科技 Agent 开发岗二面，8 月 12 日

Raft 通过 Leader 选举、日志复制和多数派提交保证已提交日志不会被后续 Leader 覆盖；term 和日志新旧规则防止落后节点当选。服务实例把带租约的 key 写入 etcd 并周期续租，消费者 watch 前缀获得增删变化；租约过期会删除 key。客户端仍需处理 watch 断线、revision 压缩和全量重建，不能只依赖本地缓存。

---

### 117. Go `sync.Map` 适合什么场景？为什么不能替代普通 map + 锁？

> 来源：成都晓多科技 Agent 开发岗二面，8 月 12 日

`sync.Map` 适合写一次读多、或不同 goroutine 操作相互独立 key 的场景，通过只读快照和 dirty map 降低常见读取竞争。频繁覆盖同一 key、需要复合原子操作或类型安全时，普通 map + Mutex/RWMutex 更清晰可控。选型要基于读写比例和 benchmark，不因“并发安全”就默认使用。

---

### 118. Go 内存逃逸、泄漏和 pprof 应该如何联合排查？

> 来源：成都晓多科技 Agent 开发岗二面，8 月 12 日

逃逸是编译器决定对象需在堆上分配，不等于泄漏；用 `-gcflags=-m` 查看原因。泄漏表现为可达对象持续增长，常见于 goroutine、timer、缓存、切片底层数组和未关闭资源。用 pprof 的 heap、allocs、goroutine 与 diff 对比定位增长路径，结合 GC 和业务指标复现；修复生命周期和引用后再考虑池化，避免用 `sync.Pool` 掩盖泄漏。

---

### 119. 虚拟机、容器和 Kubernetes 分别解决什么问题？

> 来源：小舒一面；本轮追问：gVisor 与 Docker 容器、虚拟机有何不同？（[9.15科大讯飞AI应用一面](https://www.nowcoder.com/feed/main/detail/aece93373f9c47ea95c831aef6471886)）

虚拟机虚拟整套硬件和内核，隔离强但启动和资源成本高；容器共享宿主内核，通过 namespace/cgroup 隔离，启动快但安全边界更薄；Kubernetes 不是另一种容器，而是编排平台，负责调度、服务发现、声明式收敛和故障恢复。强隔离/异构内核用 VM，大量一致应用用容器，规模化运维再引入 K8s；也可用 microVM 组合边界与速度。

因此“容器内程序”和“宿主机普通进程”本质上都由宿主内核调度，但容器进程看到的是受限的 PID、Mount、Network、User 等 namespace 视图，并受 cgroup 配额、镜像文件系统和 capability/seccomp 约束。容器不是天然安全边界，特权容器、宿主挂载和共享设备会主动打穿隔离；Windows/WSL2/Hyper-V 还要区分是否存在额外 VM 和独立内核。

---


gVisor 位于容器运行时与宿主内核之间，以用户态 Sentry 拦截并实现部分系统调用；容器仍共享宿主内核，但攻击面和隔离通常强于普通 Docker，兼容性与性能开销也更高，不能等同完整 VM。
### 120. `writev` 如何通过聚合缓冲区减少系统调用？

> 来源：拼多多 AI Agent 岗技术面

`writev` 接收多个 iovec，在一次系统调用中把分散缓冲区按序写出，避免先拷贝到一个连续用户缓冲区，并减少用户态/内核态切换。它不保证一次写完，非阻塞 socket 仍需处理部分写入并推进各 iovec；数量受系统上限约束。适合协议头+正文、日志批量和网络聚合，但要控制批量等待延迟与单次大小。

---

### 121. JWT 如何支持权限变更后的即时失效？

> 来源：小厂 Agent 全栈实习面经

短寿命 access token 降低过期窗口，refresh token 由服务端会话记录管理并轮换。需要即时失效时校验 `jti` denylist、用户 session/version 或 `permissions_updated_at`，使旧版本 Token 拒绝；高风险接口可每次查集中授权服务。这样会重新引入状态和可用性成本，应按风险分级，而不是声称 JWT 天然无法撤销或完全无状态。

---

### 122. cgroup 如何限制容器的 CPU、内存和进程资源？

> 来源：B站 Agent 一面

cgroup v2 通过统一层级控制 CPU weight/max、memory max/high、pids max 和 I/O 等资源。达到 CPU 配额会 throttling，超过内存上限可能触发 cgroup 内 OOM，进程数限制可防 fork bomb。它负责计量与限制，不负责文件/网络/进程视图隔离，后者由 namespace 和安全策略完成。排查应读取 cgroup 指标而非只看宿主机 top。

---

### 123. Java 类卸载需要满足哪些条件？为什么类加载器泄漏会阻止卸载？

> 来源：淘天 AI 应用开发一面

类通常只有在其定义 ClassLoader 不再可达、该加载器加载的 Class 无实例且对应 `Class` 对象不可达时才可卸载，并依赖 GC 策略。线程上下文加载器、静态集合、ThreadLocal、JDBC Driver、日志框架或回调注册若持有应用 ClassLoader，会让整批类和元空间无法回收。用 class histogram、JFR/heap dump 查看加载器保留链，修复注册与生命周期，而不是只扩大 Metaspace。

---

### 124. SSRF 的攻击面和防御方案是什么？

> 来源：字节抖音 Agent 一面

SSRF 诱导服务端请求攻击者指定地址，可访问云元数据、内网管理面或绕过网络边界。防御要解析并规范化 URL，只允许受信协议/域名/端口；DNS 解析后校验所有 IP，阻止私网、环回、链路本地和重绑定，重定向后再次校验。请求通过受控代理与网络 egress 策略执行，限制响应大小/时间并隔离凭据。黑名单字符串匹配不足以抵御编码和 DNS 变化。

---

### 125. Aerospike 与 Redis 的存储机制和适用场景有什么区别？

> 来源：字节抖音 Agent 一面

Redis 以丰富数据结构和内存操作见长，可配置持久化与集群，适合缓存、计数、队列和实时结构操作。Aerospike 面向大规模低延迟 KV，索引常驻内存、数据可放 SSD，强调分区、高可用和可预测延迟，查询与数据结构能力相对受限。选型看数据规模、访问模型、持久性、尾延迟、运维和成本，不能简单理解为“磁盘版 Redis”。

---

### 126. HTTP Keep-Alive 和客户端连接池是什么关系？

> 来源：深信服 Agent 开发一面

Keep-Alive 表示一个 TCP/QUIC 连接可承载多个 HTTP 请求；连接池是客户端管理多个可复用连接的资源策略，负责上限、空闲超时、健康检查、排队和按目标分组。没有池会频繁握手，有 Keep-Alive 但池无限也会耗尽端口/下游连接。HTTP/2/3 还可在单连接多路复用，但仍需处理连接级故障、并发流限制和负载均衡。

---

### 127. HTTP/1.1、HTTP/2 和 HTTP/3 的核心差异是什么？

> 来源：深信服 Agent 开发一面；[字节业务中台AI全栈面经——日常实习](https://www.nowcoder.com/feed/main/detail/6ac5ba31705a4b64a407b087f39d5447)

HTTP/1.1 文本协议，持久连接但并发常需多连接；HTTP/2 二进制帧、头部压缩和流多路复用，但 TCP 丢包会阻塞同连接所有流；HTTP/3 基于 QUIC/UDP，每个流独立可靠传输，降低传输层队头阻塞并支持更快握手和连接迁移。HTTP/3 不是不可靠 UDP 直传，可靠性由 QUIC 实现；选型还受代理、网络和 CPU 成本影响。

---

### 128. 旧数据如何在线迁移并保证双写一致与可回滚？

> 来源：深信服 Agent 开发一面

先建立新旧 schema 映射和幂等迁移键，离线回填历史并校验数量、哈希和业务不变量；增量阶段通过 CDC 或事务 outbox 同步。切流前先双读比对，再小流量读新写双；双写要有明确主事实源、失败补偿和对账，不能假设两个写原子完成。切换使用版本开关，保留旧数据和反向同步窗口，确认稳定后再停止旧链路。

---

### 129. Docker/Kubernetes 中 bridge、host、overlay 和 CNI 网络模式如何选择？

> 来源：字节社招一面，2026 年 8 月 23 日

Docker bridge 在单机上通过 Linux bridge、veth 和 NAT 连接容器，隔离性与通用性较好，但跨主机需要额外网络；host 模式让容器直接共享宿主机网络命名空间，少一层转发且便于使用宿主端口，却会削弱隔离、产生端口冲突，也不等于绕过所有协议栈开销。overlay 用隧道把多台宿主机上的容器组成逻辑二层或三层网络，部署灵活，但封装会带来 MTU、排障和性能成本。

Kubernetes 的 CNI 不是一种固定网络模式，而是节点侧配置 Pod 网络的接口规范及插件生态。应根据是否跨节点、网络策略、吞吐与尾延迟、云厂商路由能力、IP 数量和运维复杂度选择插件及数据平面：普通隔离容器可用 bridge，极致性能或必须绑定宿主网络的系统组件才考虑 host，跨主机容器网络可用 overlay；具备可路由 Pod CIDR 或云原生网卡时可选无隧道路由方案。最终还要验证 MTU、NetworkPolicy、Service 转发、可观测性和故障恢复，不能只按理论带宽选型。

---

### 130. TLS 根证书如何建立对服务端身份的信任？

> 来源：字节抖音电商一面，2026 年 8 月 24 日；本轮追问：HTTPS端到端链路是怎样的？（[字节数据中台Agent全栈面经](https://www.nowcoder.com/feed/main/detail/fe77496948f74b4091ab4bb6e8156c8b)）；本轮追问：HTTPS 是什么？（[CVTE 一面](https://www.nowcoder.com/discuss/932319671578030080)）；[网易互娱｜AI应用开发实习一面](https://www.nowcoder.com/feed/main/detail/2d982457b8b94da09fab383e275de93d)

客户端本地信任库预置的是受信根 CA 证书或信任锚，而不是所有网站证书。服务端在握手中发送叶子证书和通常所需的中间证书；客户端逐级验证签名，直到链条连接到本地信任锚，同时检查证书有效期、用途约束、Basic Constraints、Name Constraints 等规则。根证书通常是自签名的，它之所以可信来自操作系统、浏览器或组织的分发与治理，而不是“自签名本身证明可信”。

完成证书链验证后，客户端还必须校验访问主机名是否匹配叶子证书 SAN，并在策略要求下检查吊销状态；握手中的 CertificateVerify 则证明服务端持有叶子证书对应的私钥。任一环节失败都不能建立服务端身份信任。企业私有 CA 需把根证书安全地下发到受控信任库，并处理轮换和撤销，不能通过关闭证书校验解决自签名证书问题。

---


典型链路是客户端解析域名后建立 TCP 连接，进行 TLS 握手并协商版本、密码套件与会话密钥；服务端完成身份证明后，双方用对称密钥加密传输 HTTP 请求和响应。若中间代理终止 TLS，则需分别验证两段连接。
### 131. MyBatis 的 `#{}` 与 `${}` 有什么区别？如何防止 SQL 注入？

> 来源：小公司 AI Agent 开发一面，2026 年 8 月 24 日；[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)

`#{}` 会生成 JDBC `PreparedStatement` 的参数占位符，值由驱动绑定并按类型转义，数据不会被解释为 SQL 结构；`${}` 是在 SQL 解析前进行原始字符串替换，可用于无法参数化的表名、列名或排序方向，但用户输入一旦直接进入其中就可能改变 SQL 语义。`#{}` 还能结合 TypeHandler 处理类型，但不能把列名当作绑定值，因此不能机械地用它替换所有 `${}`。

防注入的默认策略是所有数据值使用 `#{}`，动态结构通过代码枚举或白名单映射为固定 SQL 片段，例如把客户端的排序字段映射到允许的列名，并限制 `ASC/DESC`。同时使用最小权限数据库账号、限制批量与多语句执行、记录异常查询并测试边界输入。手工转义、正则黑名单和“前端已校验”都不能替代参数绑定与结构白名单。

---

### 132. 实时热点榜单在高并发下如何设计数据结构、缓存、数据库与一致性？

> 来源：字节 Agent 开发一面，2026 年 8 月 24 日；本轮追问：历史访问预热若热点变化，有什么副作用，怎样识别新热点？ / 你提到的近似统计结构怎样工作，能不能找出 Top K 热点 Key？（[9.15秋招东方财富AI应用一面](https://www.nowcoder.com/feed/main/detail/d406314e733c4fc8945637ce5d06cdcf)）；[字节 260907 一面面经](https://www.nowcoder.com/discuss/935858952644939776)

先定义榜单窗口、分数函数、去重口径、更新延迟和精确度要求。写入链路把浏览、点赞等事件追加到消息队列，由流处理按内容 ID 聚合并计算时间衰减分数；热点候选可按时间分桶维护，在线 Top-N 使用 Redis Sorted Set 或分片 Top-K，避免每次请求扫描全量数据。读侧通过本地缓存/CDN 和 Redis 提供版本化榜单，数据库或数据湖保存事件与聚合结果，承担审计、重算和容灾，而不是让关系库直接承受每次排行更新。

高并发下可按业务、地域或哈希分片计算局部 Top-K，再由归并层生成全局榜单；热 key 通过分片计数、批量合并和读副本缓解。事件使用唯一 ID 幂等消费，乱序事件按事件时间和水位线处理，分数更新用 Lua、事务或版本比较保证单 key 原子性。缓存与持久层通常选择最终一致：先可靠记录事件，再异步更新榜单，定期从事实数据校准；发布榜单时用新版本构建完成后原子切换，避免读到半成品，并明确允许的陈旧窗口、降级快照和重放恢复方案。

**追问补充**：订单事件按订单号幂等，按用户与自然日聚合购买次数、金额等原始事实；榜单计算携带评分函数版本，先生成用户分数再取 Top K 并发布日榜快照。评分规则变化时保留原始数据，按新版本离线重算并原子替换，退款等修正通过事件回放处理。

---


预热可能把旧热点带来的流量和内存占用延续到新周期，造成缓存污染，应设置衰减、TTL和准入阈值，并监控命中率、访问频次和新 Key 增长识别突发热点。近似计数可用 Count-Min Sketch 估频，但它不能枚举 Key，需配合候选堆或 Space-Saving 保留候选，再对候选做精确计数和 Top-K 校验。
### 133. 只有 1 GB 物理内存且没有 swap，进程能否打开或访问 2 GB 文件？

> 来源：字节抖音电商一面，2026 年 8 月 24 日

可以“打开”文件：`open` 主要创建文件描述符，并不把文件内容全部载入内存。也可以用 `read` 分块顺序处理，内核页缓存中的旧页可回收，因此文件大小不受物理内存容量直接限制。若使用 `mmap`，映射先占用一段虚拟地址空间，页面在首次访问时按需缺页并从文件加载；干净的文件页在内存压力下可以丢弃，之后再次从文件读取，所以也不要求 2 GB 页面同时驻留物理内存。

边界取决于进程虚拟地址空间、映射长度、内存限制和访问方式：32 位进程可能找不到足够连续虚拟地址，容器/cgroup 或 `RLIMIT_AS` 可能拒绝映射；大量随机访问会频繁缺页并产生抖动。没有 swap 不妨碍回收干净文件页，但匿名内存和脏的私有页缺少换出空间，更容易触发分配失败或 OOM。若把 2 GB 文件一次性读入匿名缓冲区，或使用会产生大量 copy-on-write 脏页的 `MAP_PRIVATE` 写入，就很可能失败；稳妥方案是分块读取或窗口化映射，并处理 `mmap`/缺页期间的 I/O 错误以及文件被截断导致的 `SIGBUS`。

---

### 134. Maven 的传递依赖冲突如何发现和治理？

> 来源：滴滴 AI Agent 后端面经，2026 年 7 月

Maven 会沿依赖图引入非 optional 的传递依赖，并按 scope 规则决定是否进入编译、测试或运行时 classpath。同一构件出现多个版本时，默认采用“路径最近者优先”；深度相同则通常由声明顺序决定。构建成功不代表版本兼容，冲突可能直到运行时才表现为 `NoSuchMethodError`、`ClassNotFoundException` 或行为变化，因此先用 `mvn dependency:tree -Dverbose`、IDE 依赖分析或有效 POM 找出版本来源、scope 和被省略节点。

治理时在父 POM 的 `dependencyManagement` 中集中锁定版本，或通过 `type=pom`、`scope=import` 导入经过验证的 BOM；它只管理版本和默认属性，不会自动把依赖加入项目。对不需要或明显冲突的传递依赖，在直接依赖上使用 `exclusions`，再显式声明真正需要的版本。排除应尽量靠近引入源且说明原因，不能全局大面积排除后靠偶然的 classpath 通过。

持续治理可在 CI 使用 Maven Enforcer 的 dependency convergence、upper-bound 等规则，并配合锁定插件版本、依赖漏洞扫描和集成测试。升级前检查二进制兼容、框架 BOM 支持范围以及同一依赖的成组组件，发布产物还应核对实际打包内容。最终目标不是让依赖树只有一个版本号，而是让选中的版本明确、可重复构建且经过运行路径验证。

---

### 135. Python 的 `Lock`、`RLock` 和 `Semaphore` 有什么区别？分别适合什么场景？

> 来源：字节 Agent 开发一面，2026 年 7 月

`threading.Lock` 是不记录递归层级的互斥锁，同一时刻只允许一个线程进入临界区；持锁线程再次 acquire 会把自己阻塞，因此适合无嵌套获取的短小共享状态保护。`RLock` 记录拥有者和重入计数，同一线程可以多次获取，但必须对应释放相同次数后其他线程才能进入；适合公共方法与内部方法都会获取同一把锁的递归或分层调用，代价是状态更复杂，不应拿它掩盖不清晰的锁边界。

`Semaphore(n)` 维护许可计数，最多允许 n 个线程同时通过，适合限制数据库连接、外部接口或工作槽位等有限资源的并发量，而不是保护必须严格单写的对象；`BoundedSemaphore` 还能在释放次数超过初始值时尽早暴露错误。三者都支持 `with`，应利用上下文管理保证异常路径释放，并避免持锁执行慢 I/O、无序获取多把锁或无限等待。

GIL 不能替代这些同步原语，因为线程可能在 I/O、扩展代码或字节码切换点交错执行。需要等待某个状态条件时使用 `Condition`，只做一次性通知可用 `Event`，生产者消费者优先使用 `queue.Queue`，不要用锁加轮询自行拼装。选择标准是要保护“不变量”、允许“同一拥有者重入”，还是限制“同时使用资源的数量”。

---

### 136. 如何用 Shell 安全、确定性地合并目录中的多个文件？

> 来源：[蔚来自动驾驶 Infra 实习面经](https://www.nowcoder.com/feed/main/detail/56a04cec4404407198dc9627a7fa887c)

先明确合并顺序、文件类型和输出格式。不要直接依赖 shell glob 的偶然顺序，也不要用 `for f in $(find ...)`，因为空格、换行和通配符会破坏文件名边界。Linux 下可以用 NUL 分隔传递路径，例如先把输出写到目录外的临时文件，再执行 `find "$dir" -maxdepth 1 -type f -print0 | LC_ALL=C sort -z | xargs -0 cat -- > "$tmp"`，成功后原子移动到目标位置。

还要处理空目录、权限失败、合并过程中源文件变化和输出文件被再次读入。文本文件若要求文件间换行或标头，应显式插入分隔符；二进制文件只能按字节拼接，能否得到有效文件取决于格式本身。生产脚本应启用严格错误处理、检查退出码，并在失败时清理临时文件，不能留下看似成功的半成品。

---

### 137. 操作系统如何管理内存？为什么要把虚拟内存与物理内存分开？

> 来源：[蔚来自动驾驶 Infra 实习面经](https://www.nowcoder.com/feed/main/detail/56a04cec4404407198dc9627a7fa887c)、[荣耀 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/60ab2e3a45074b7391199acb9b5c6ca3)、[字节 AI Infra 实习面经](https://www.nowcoder.com/feed/main/detail/2163c739242f4f8d82b35c906f0a69a9)、[AI Infra 应届春招面经](https://www.nowcoder.com/feed/main/detail/9ec1d6e590a04b16b9ea40ade8d180bd)、字节 AML / 火山方舟 AI Infra 一面；本轮追问：缺页发生后，操作系统如何选择需要换出的页面？（[字节 aime 一面 9.10](https://www.nowcoder.com/feed/main/detail/ed5e9d17f26e489da94afbf1241b885e)）

操作系统同时管理物理页分配、每个进程的虚拟地址空间与页表、匿名页和文件映射、页缓存、共享内存、回收/Swap、NUMA 放置以及 cgroup 限额。分配路径先满足虚拟地址和权限，再在访问或预取时建立物理页映射；内核根据工作集和内存压力回收页面，而不是让应用直接持有固定物理地址。

虚拟地址与物理地址分开带来四个核心能力：进程隔离和权限保护；程序可在统一地址布局运行而无需知道物理位置；按需分页、页面置换和 overcommit 提高物理内存利用率；多个进程可共享只读代码、页缓存或显式共享内存。页表把虚拟页映射到物理页并记录读写、执行和用户/内核权限，TLB 缓存近期转换；Fork 后常以写时复制共享页面，只有写入时才复制。

访问没有有效映射或页面尚未驻留时会触发缺页异常：匿名零页、文件页可按需建立映射，已换出的匿名页或未缓存的文件页可能需要磁盘 I/O。内存压力下内核按近似 LRU 等策略回收干净文件页、回写脏页或把匿名页换到 Swap；若可回收页不足、Swap 不可用或受 cgroup/进程限制，分配可能失败并触发 OOM 处理。排障要结合缺页率、工作集、换入换出、页缓存、RSS、cgroup 限额和 OOM 日志，而不是只看 free memory。

---


换出页通常由近似 LRU 的回收策略选择：优先考虑近期未访问、活跃度低且回收代价小的页，干净文件页可直接丢弃，脏页需先回写，匿名页则需换入 Swap。实际还会结合活跃/非活跃链表、访问位、内存优先级及 cgroup 限制，并通过回收扫描和换入换出统计验证效果。
### 138. TCP 与 UDP 的差异、适用场景和可靠性边界是什么？

> 来源：[蔚来自动驾驶 Infra 实习面经](https://www.nowcoder.com/feed/main/detail/56a04cec4404407198dc9627a7fa887c)、[腾讯 CDG AI Infra 框架侧面经](https://www.nowcoder.com/feed/main/detail/6bbfaca62dc64d45851f3ea6c48ff168)；[字节 AI Agent 研发一面](https://www.nowcoder.com/feed/main/detail/2ba7e96d48634777990b28c2cb322f40)；[CVTE 一面](https://www.nowcoder.com/discuss/932319671578030080)；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)

TCP 是面向连接的可靠字节流，通过序列号、确认、重传、流量控制和拥塞控制提供按序、无重复的传输；应用必须自行做消息分帧。UDP 保留报文边界，无连接状态，协议本身不保证送达、顺序或去重，也没有 TCP 式拥塞控制，但头部和连接管理开销更小，允许应用按业务自行选择可靠性策略。

文件传输、数据库连接和多数 HTTP/1.1、HTTP/2 流量通常选择 TCP；DNS 查询、实时音视频和游戏状态同步常使用 UDP，以容忍少量丢包换取更及时的数据。UDP 不等于“不可靠应用”：QUIC 在 UDP 之上实现可靠流、拥塞控制和加密。选型应看消息边界、丢包语义、时延、网络公平性、NAT/防火墙和实现复杂度，不能只回答“TCP 慢、UDP 快”。

**追问补充**：在 UDP 之上实现可靠传输，需在应用层定义会话标识、序列号与确认号，维护发送窗口和接收重排缓存；对超时或选择性确认的缺失分片重传，并做去重、流量控制、拥塞控制和连接保活。

---

### 139. 哈希表如何处理冲突和扩容？`std::map` 与 `std::unordered_map` 如何选择？

> 来源：[小鹏汽车 AI Infra 面经](https://www.nowcoder.com/feed/main/detail/a79383aa92f64e8eb4e85959bf2660a0)、[阿里云 AI Infra 一面](https://www.nowcoder.com/discuss/877526070033989632)、[沐曦 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/5f3629b12be346de8dbc954a75d0990f)

哈希表用哈希函数把 key 映射到桶，冲突可用链地址法、开放寻址等方式处理；负载因子过高时通常扩桶并重新分布元素。理想散列下查找和插入平均为 O(1)，但冲突严重时可能退化，扩容还会产生一次 O(n) 的搬迁成本。`std::unordered_map` 保证平均常数复杂度，但标准不承诺具体桶结构，也不保证迭代顺序；rehash 会使迭代器失效。

`std::map` 是有序关联容器，标准保证查找、插入和删除为 O(log n)，常见实现是红黑树，但具体树型仍属于实现细节。需要有序遍历、范围查询、稳定的最坏复杂度或频繁使用 `lower_bound` 时选 `map`；追求平均查找吞吐且有可靠哈希函数时选 `unordered_map`。还要比较内存开销、缓存局部性、key 分布、迭代器失效和拒绝服务场景，不能只背复杂度表。

---

### 140. C++ 的 `new/delete` 与 `malloc/free` 有什么区别？对象构造和分配器如何衔接？

> 来源：[沐曦 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/5f3629b12be346de8dbc954a75d0990f)、[太初 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/45c0b82115024f16a88ad9a37f2ab398)、[文远知行 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/cc35269c89d645c3a510c22504355ce0)

`new T(args...)` 是 C++ 表达式：先调用相应的 `operator new` 获得原始存储，再在其中构造对象；`delete` 先调用析构函数，再把存储交给 `operator delete`。普通 `new` 失败默认抛出 `std::bad_alloc`，`new (std::nothrow)` 才返回空指针。`malloc` 只按字节分配原始内存并返回 `void*`，失败返回空指针，不知道类型，也不会调用构造或析构函数。

分配和释放必须成对：`new/delete`、`new[]/delete[]`、`malloc/free` 不能混用，否则行为未定义。Placement new 只在给定地址构造对象，调用方仍负责显式析构和底层存储释放。工程代码优先用值语义、容器和 RAII；确需定制时再使用 allocator、内存池或重载 `operator new`，并用 sanitizer 检查越界、重复释放和 use-after-free。

---

### 141. C++ 智能指针如何管理所有权？控制块、数组和循环引用有哪些边界？

> 来源：[沐曦 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/5f3629b12be346de8dbc954a75d0990f)、[太初 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/45c0b82115024f16a88ad9a37f2ab398)

`unique_ptr` 表示独占所有权，只能移动，通常只保存指针和删除器；`shared_ptr` 让多个句柄共享对象，其控制块维护强引用、弱引用和删除器等状态；`weak_ptr` 不增加强引用，可用 `lock()` 临时取得有效的 `shared_ptr`，用于打破双向图中的循环引用。`make_shared` 常把对象和控制块一次分配，减少分配次数，但对象内存要等弱引用也释放后才完全归还。

连续数组应使用 `unique_ptr<T[]>`、标准库支持的 `shared_ptr<T[]>` 或更优先的 `std::vector<T>`，不能让普通 `unique_ptr<T>` 用错误的 `delete` 释放 `new T[n]`。管理文件、socket、GPU buffer 等非 `new` 资源时要提供匹配删除器。引用计数的同步只保护控制块生命周期，不自动保护被指对象；多个线程修改对象或同一个智能指针变量仍需同步。

---

### 142. C++ 多态和虚函数通常如何实现？构造、析构期间调用虚函数会怎样？

> 来源：[飞腾 AI Infra 二面](https://www.nowcoder.com/feed/main/detail/90c405df0a0f4dd99298768496b0c942)、[沐曦 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/5f3629b12be346de8dbc954a75d0990f)、[太初 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/45c0b82115024f16a88ad9a37f2ab398)；[阿里虎鲸文娱 - AI 基础设施 - 一面](https://www.nowcoder.com/feed/main/detail/9c2e1794ccc14448a6fc43d596f60f00)

C++ 的函数重载、模板和 CRTP 属于编译期多态；通过基类指针或引用调用虚函数属于运行期多态。常见 ABI 为含虚函数的对象保存 vptr，指向记录虚函数入口的 vtable，调用时按动态类型间接分派；但标准只规定可观察行为，不强制虚表的具体内存布局。多态基类若可能通过基类指针删除派生对象，析构函数通常必须是 virtual。

在基类构造期间，派生部分尚未构造；在基类析构期间，派生部分已经销毁，因此虚调用只分派到当前正在构造或析构的类，不会调用更派生类覆盖。依赖派生状态会破坏对象生命周期不变量，调用纯虚函数还可能导致未定义行为或链接/运行时错误。工程上应避免在构造和析构函数中依赖虚分派，改用构造后初始化、工厂函数或非虚私有初始化步骤。

---

### 143. C++ lambda 的捕获、闭包对象和生命周期风险是什么？

> 来源：[沐曦 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/5f3629b12be346de8dbc954a75d0990f)

lambda 表达式会生成一个匿名闭包类型，对捕获变量形成数据成员，并以 `operator()` 执行函数体。`[=]` 和 `[&]` 分别默认按值和按引用捕获，显式捕获更容易审计；按值捕获默认不能修改副本，加入 `mutable` 后可以修改闭包内部状态。初始化捕获可移动资源，泛型 lambda 的 `auto` 参数则让调用运算符成为模板。

最大风险是生命周期：按引用捕获的局部变量离开作用域后会悬空，异步任务捕获 `this` 也可能在对象销毁后访问无效地址。可以捕获值、`shared_ptr`，或捕获 `weak_ptr` 后在执行时检查存活状态。无捕获 lambda 可转换为函数指针；`std::function` 能类型擦除不同可调用对象，但可能引入间接调用、复制和动态分配开销，热点路径应以基准决定是否使用模板回调。

---

### 144. C++ 四种 Cast 有什么区别？父类向子类转换何时安全？

> 来源：[小鹏汽车 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/e4e725793a3f4c9197c36645bc63cf32)、[蔚来汽车 AI Infra 面经](https://www.nowcoder.com/feed/main/detail/738d29de77ef4675bbac0a7d18ed1371)

`static_cast` 用于编译期可检查的数值转换、上行转换及开发者能证明安全的下行转换；它不验证对象运行时真实类型。`dynamic_cast` 借助 RTTI 在多态继承层次中检查转换，指针失败返回空，引用失败抛 `std::bad_cast`。`const_cast` 只改变 cv 限定，若底层对象本来就是 const，再通过结果写入仍是未定义行为；`reinterpret_cast` 进行低层表示转换，不能凭转换本身建立对象、对齐或别名访问的合法性。

父类指针向子类转换只有在对象真实动态类型确实是目标子类或其派生类时才可安全使用。类型不确定时用 `dynamic_cast` 或重新设计接口；`static_cast` 下行只适合已有外部不变量保证的性能敏感边界。多继承下指针值还可能需要调整，因此不能用 C 风格强转或假设基类子对象总在对象起始地址。

---

### 145. 动态链接库如何解析依赖和符号？依赖顺序为什么可能导致链接或加载失败？

> 来源：[小鹏汽车 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/e4e725793a3f4c9197c36645bc63cf32)

编译器先生成目标文件，其中可以保留未解析符号；链接器再从目标文件、静态库和共享库中解析引用并生成可执行文件。静态归档常按命令行从左到右扫描，只抽取当时能解决未定义符号的成员，因此依赖方通常放在被依赖库之前，循环依赖需要重复列出、使用 group 选项或消除结构问题。`--as-needed` 等选项也会让看似无用的共享库不进入依赖表。

运行时加载器依据记录的动态依赖、SONAME 和受控搜索路径装载共享对象，再完成重定位和符号绑定。常见失败包括库文件找不到、ABI/版本不兼容、符号被隐藏、依赖未声明及同名符号覆盖。排障使用链接器 map、`readelf`、`objdump`、`ldd` 或加载器调试输出；不要把静态库顺序规则笼统套到所有平台，也不要依赖不受控的全局环境搜索路径修复生产部署。

---

### 146. C/C++ 回调有哪些实现方式？如何管理上下文、生命周期和异常边界？

> 来源：[科大讯飞 AI Infra 面经](https://www.nowcoder.com/feed/main/detail/140a45bc0b314798a0d94b512cb7ea90)

C 接口常用函数指针加 `void* context`，由回调把 context 转回业务对象；C++ 还可用成员函数适配器、函数对象、lambda、模板可调用参数和 `std::function`。模板或具体闭包类型有利于内联，`std::function` 便于统一存储不同回调，但类型擦除可能带来间接调用、复制和堆分配。成员函数还需要对象实例，不能直接当作普通 C 函数指针。

异步回调的重点不是语法，而是所有权：注册方与执行方要约定 context 谁持有、何时注销、取消后是否仍可能在途执行。跨线程访问共享状态需要同步，捕获引用或 `this` 必须保证生命周期；跨 C ABI 边界不能让 C++ 异常逃逸，应在边界捕获并转成错误码。还要防止回调重入、注销与执行竞态及在持锁状态下调用未知业务代码。

---

### 147. C/C++ 从预处理到链接经历哪些阶段？每阶段常见错误如何定位？

> 来源：[飞腾 AI Infra 二面](https://www.nowcoder.com/feed/main/detail/90c405df0a0f4dd99298768496b0c942)

预处理阶段展开宏、处理条件编译并包含头文件；编译阶段完成词法语法、类型检查和优化，生成汇编或中间表示；汇编阶段把汇编转成含符号表与重定位信息的目标文件；链接阶段合并目标文件和库、解析符号与重定位，生成可执行文件或共享库。实际工具链可能把多个阶段合并执行，但职责仍可区分。

宏展开、缺头文件通常在预处理阶段暴露；类型和模板实例化问题多为编译错误；非法指令或汇编语法属于汇编阶段；undefined reference、重复定义和 ABI 不兼容属于链接问题。定位时先保留完整命令行和第一处错误，再用 `-E`、`-S`、`-c` 分阶段输出，结合 `nm/readelf/objdump` 检查符号，不要把所有构建失败都归为“编译器报错”。

---

### 148. 单例模式和工厂模式分别解决什么问题？在 C++ 中如何避免生命周期陷阱？

> 来源：[飞腾 AI Infra 二面](https://www.nowcoder.com/feed/main/detail/90c405df0a0f4dd99298768496b0c942)

单例约束某类在指定作用域内只有一个实例并提供访问点，但它会引入全局状态、隐藏依赖和测试隔离困难。C++11 起函数内静态对象的初始化具备线程安全保证，Meyers Singleton 比手写双重检查更稳妥；仍要处理析构顺序、动态库卸载和实例内部状态的并发安全，单例“创建安全”不等于业务方法线程安全。

工厂把“选择并构造具体实现”从调用方抽离：简单工厂集中分支，工厂方法把创建推迟给子类或策略，抽象工厂创建一组相互匹配的对象。它适合实现可替换、构造复杂或需要插件注册的场景，但产品很少时会徒增层次。工程上优先显式依赖注入和 RAII 返回值，例如 `unique_ptr<Interface>`，避免工厂偷偷持有全局单例并制造不清晰的销毁顺序。

---

### 149. CPython 的引用计数、循环垃圾回收和对象生命周期如何工作？

> 来源：[爱奇艺 AI 平台研发 Infra 面经](https://www.nowcoder.com/discuss/918635351327924224)

CPython 主要通过引用计数管理对象：强引用增加计数，引用释放后计数减少，降到零时对象通常立即进入销毁流程。这使多数对象的回收时机较可预测，但彼此强引用的容器可能形成环，即使外部已不可达，计数仍不为零；CPython 因此还使用分代的循环垃圾回收器追踪可形成引用环的容器并识别不可达环。

`del x` 只删除一个名字绑定，不保证对象立即销毁；弱引用不会维持对象存活，适合缓存和观察者关系。带终结逻辑的对象、跨线程引用和 C 扩展会让生命周期更复杂，具体代数和调度策略也可能随 CPython 版本变化。文件、锁、数据库连接等外部资源不应依赖 GC 时机，应使用 `with`、`try/finally` 或显式 `close()` 管理。

---

### 150. Python 为什么通常比编译型语言慢？如何定位并选择优化路径？

> 来源：[爱奇艺 AI 平台研发 Infra 面经](https://www.nowcoder.com/discuss/918635351327924224)；[滴滴 java 一面 10.15](https://www.nowcoder.com/feed/main/detail/5b57de7f52e94f3f8985ee51f1f78a43)；[10.15 阶跃星辰 开发者关系技术向实习一面](https://www.nowcoder.com/feed/main/detail/277091082aa9484a96a15d49af4b047a)

以常见 CPython 执行为例，动态类型需要在运行时解析对象和操作，数值通常是带元数据的对象，字节码解释分派、引用计数和间接访问也增加指令与内存开销；对象布局分散还会影响缓存局部性。GIL 会限制单进程纯 Python CPU 密集线程的并行扩展，但它不是单线程代码慢的唯一原因，也不能据此断言所有 Python 实现或所有负载都慢。

优化先用 profiler 找到真实热点，再依次考虑更好的算法和数据结构、减少 Python 层循环、批量化/向量化、缓存和降低对象分配。仍不足时可把热点交给 NumPy 等原生库、C/C++/Rust 扩展、JIT 或独立计算服务；CPU 并行可评估多进程，I/O 并发可用线程或异步。选择要用目标数据和端到端基准验证，不能为了局部微基准牺牲可维护性和序列化成本。

**追问补充**：C++ 通常静态类型、编译为本地机器码，强调手动或确定性资源管理；Python 动态类型、运行时解释或由虚拟机执行，开发效率高但运行时开销更大。Java 通常编译为字节码并由 JVM 执行，依靠 GC、JIT 和成熟运行时，跨平台性与工程生态较强。

---

### 151. etcd 与 Redis 的索引和存储结构有什么差异？设计目标为什么不同？

> 来源：[百度 AI Infra 校招面经](https://www.nowcoder.com/feed/main/detail/436228d68ccb4ec78d08644bc9227dec)；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)

以典型 etcd v3 实现为例，键值更新形成带全局 revision 的 MVCC 版本；内存索引把 key 映射到版本信息，持久化后端保存 revision 对应的数据，写入还要经过 Raft 复制和提交。这套结构服务于线性一致读写、事务比较、按 key 范围查询和从指定 revision 开始的 watch，历史版本会通过 compaction 控制。具体 B-tree 与后端实现属于版本细节，回答时应区分逻辑契约和当前实现。

Redis 的顶层 keyspace 通常使用哈希字典，单 key 的值再按 String、Hash、ZSet、Stream 等类型采用不同编码和数据结构，并通过 RDB/AOF 与复制提供持久化和高可用选项。它优先追求低延迟和丰富数据操作，不默认提供 etcd 的 Raft 线性一致语义；etcd 也不是通用缓存。比较两者不能简化成“B+ 树对哈希表”，应从一致性、版本/watch、查询模型、数据规模、延迟和故障语义选择。

**追问补充**：Redis 没有内置通用的数据库式二级索引。可用 Set、ZSet 或 Hash 维护“属性到主键”的辅助索引，或使用搜索模块；但索引更新需由应用保证与主数据的一致性，删除、修改和故障重试都要处理，查询能力也受数据结构限制。

---

### 152. `Callable`、`Future` 和 `CompletableFuture` 有什么区别？如何等待多个任务全部完成？

> 来源：影石 Java 后端一面，2026 年 8 月 11 日；本轮追问：并发后是否仍要等全部结果，最终耗时由什么决定？（[9.14字节推荐架构一面](https://www.nowcoder.com/feed/main/detail/467d01beed8a40b89ac414b90fc7fb85)）

`Callable<V>` 描述一个可返回结果并抛出受检异常的任务；提交给 `ExecutorService` 后得到 `Future<V>`，后者表示异步结果，可查询状态、取消或通过 `get()` 等待。`Future` 的组合能力较弱；`CompletableFuture` 同时是结果容器和异步阶段，支持串行、并行、异常恢复与 `allOf/anyOf` 组合，但默认线程池和阻塞调用必须显式治理。

等待全部任务可用 `invokeAll`、`CompletableFuture.allOf` 或 `CountDownLatch`。选择取决于是否需要返回值、动态组合和超时取消。不能在同一个容量不足的线程池中让父任务阻塞等待其子任务，否则可能线程饥饿死锁；生产代码还要传播 Deadline、处理部分失败并回收未完成任务。

---


是否等待全部结果取决于业务聚合方式：需要完整拼装时必须等最慢任务，最终耗时约为最长任务耗时加排队、调度和网络开销；只需任一成功或达到阈值时可提前返回，并取消或隔离剩余任务。
### 153. Java 反射如何工作？反射为什么可能破坏单例，应该怎样防护？

> 来源：影石 Java 后端一面，2026 年 8 月 11 日

反射通过 `Class` 元数据在运行时检查构造器、字段、方法和注解，并可在权限允许时动态创建对象或调用成员。它支撑依赖注入、序列化和测试框架，但会弱化编译期约束，带来访问控制、可维护性和一定调用开销；模块强封装环境下，深反射还可能被拒绝。

私有构造器、双重检查锁或静态内部类只控制普通创建路径，若构造器被反射调用仍可能产生第二个实例。可在构造器中检测重复初始化，但要处理并发和反序列化；更稳妥的是使用 `enum` 单例，JVM 禁止反射创建枚举实例，并天然处理序列化。单例实例唯一不代表内部可变状态线程安全。

---

### 154. InnoDB 的聚簇索引和二级索引分别存什么？主键与普通索引查询如何回表？

> 来源：影石 Java 后端一面，2026 年 8 月 11 日；[美团ai全栈一面](https://www.nowcoder.com/feed/main/detail/a5b8c6571f94441a8af10cd6af07ac3a)；[字节跳动Agent开发1面凉经](https://www.nowcoder.com/discuss/929406267141914624)；[字节广告团队agent面经（一二面）](https://www.nowcoder.com/discuss/930870582843805696)；本轮追问：上述查询在索引树上具体是什么流程？（[携程AI应用开发实习一面（OC）](https://www.nowcoder.com/discuss/933058120102739968)）；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)；[10.14 字节跳动 AI全栈开发实习一面](https://www.nowcoder.com/feed/main/detail/27b05099955e43d5a6a66013a2dea2c6)

InnoDB 的聚簇索引叶子节点保存整行数据，一张表只有一个聚簇组织顺序，通常由主键承担；没有合适主键时会选择可用唯一键或生成隐藏行 ID。二级索引叶子保存索引列和主键值，因此通过普通电话号码索引查询未覆盖字段时，要先取得主键，再访问聚簇索引完成回表。

按主键 `id` 查询直接走聚簇索引；按电话索引查询走二级索引。若查询字段都在二级索引中，可使用覆盖索引避免回表。索引是否实际采用还取决于选择性、统计信息、条件写法和成本估算，不能只看“建了索引”。

**追问补充**：每个独立索引都有自己的一棵 B+ 树，叶子分别保存该索引键和主键；若定义联合索引，则是按多个列组成的元组建立另一棵 B+ 树，不会把两个独立索引合并成一棵树。

---


索引树查询从根页开始，按键值比较定位到下一层，逐层读取非叶子页直到叶子页；二级索引叶子得到主键后，再以主键从聚簇索引根页重复定位并读取整行，这就是回表。
### 155. InnoDB 中普通 `SELECT`、锁定读和 `UPDATE` 分别会加什么锁？范围条件为什么影响插入？

> 来源：影石 Java 后端一面，2026 年 8 月 11 日；[小红书/百度 Agent 开发实习一面](https://www.nowcoder.com/feed/main/detail/e319aadc79a9479397a6661a7f5ca088)；本轮追问：间隙锁的产生原因和作用是什么？（[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)）；本轮追问：InnoDB 执行 update 语句，条件分别是主键、唯一键、普通非索引字段时，加锁逻辑有什么区别？ / InnoDB 全表扫描更新时，为什么不会做锁优化、无法只精准锁定符合条件的记录？ / 普通非索引字段作为 update 条件，会扫描全表加聚簇索引记录锁，在可重复读隔离级别下，会额外锁住哪些不存在的间隙范围？（[27秋招-恒生电子AI面试-AI应用开发岗-26.9.23](https://www.nowcoder.com/feed/main/detail/e7981675c7a44b098d97e90a854f9c3c)）；[0924恒生电子｜AI 应用开发工程师 ｜AI面](https://www.nowcoder.com/feed/main/detail/5e0a75e9cf4941a9861b1948fb7f4e60)；[淘天 AI应用研发 一面](https://www.nowcoder.com/discuss/942091198347345920)

普通一致性 `SELECT` 在常见 MVCC 场景下读取快照，通常不加记录锁；`SELECT ... FOR UPDATE/SHARE` 和 `UPDATE/DELETE` 属于当前读。使用唯一索引等值命中时通常锁定目标记录；非唯一索引或范围扫描在可重复读下可能使用 Record、Gap 或 Next-Key Lock，以锁住扫描到的索引范围并抑制幻读。

锁定范围由隔离级别、执行计划、索引、边界是否命中和实际扫描路径共同决定。例如条件落在已有键 3 与 5 之间，即使没有匹配行，也可能锁住对应间隙并阻止插入 4。回答前应说明表结构和索引，再用 `EXPLAIN`、事务隔离级别及 `performance_schema.data_locks` 验证，不能只从 SQL 文本猜锁。

---


间隙锁本质上锁住索引记录之间的区间，而非某条已存在的记录；其作用是让当前读的范围在事务期间不能被插入新索引值，从而避免幻读并维护范围判断的一致性。它通常与 Next-Key Lock 结合，具体是否出现仍取决于隔离级别、索引和执行计划。

主键等值通常锁命中的聚簇记录；唯一索引等值命中时锁唯一索引记录及对应聚簇记录，范围或非唯一索引会锁扫描范围。非索引条件需扫描聚簇索引并锁住扫描到的记录，RR 下还可能以 Next-Key 锁覆盖记录间隙，阻塞范围内插入；最终应以执行计划和 `data_locks` 为准。
### 156. CDC 分别从 MySQL 和 PostgreSQL 的什么日志读取变更？如何保证快照与增量衔接？

> 来源：影石 Java 后端一面，2026 年 8 月 11 日

MySQL CDC 通常读取 binlog，Row 格式可提供行级变更，并通过 file/position 或 GTID 维护位点。PostgreSQL 底层写 WAL，CDC 通常通过 logical decoding 和 replication slot 把 WAL 解码为逻辑变更；WAL 本身服务崩溃恢复，不能把“直接解析 WAL 文件”和稳定的逻辑复制协议混为一谈。

全量初始化要在一致性快照边界记录增量位点，再回放该点之后的日志；消费侧按事件 ID、表主键和版本幂等，处理事务边界、DDL、心跳、乱序和 Schema 演进。PostgreSQL slot 或 MySQL 日志长期积压会占用存储，必须监控 lag、保留期和下游背压。

---

### 157. Spring 的 IoC 与 DI 是什么？Bean 可以通过哪些方式注册和注入？

> 来源：影石 Java 后端一面，2026 年 8 月 11 日；本轮追问：Spring自动装配（[浙江未讯科技](https://www.nowcoder.com/feed/main/detail/b6822699408a4ab1906c32a1e0fc7517)）；[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)

IoC 表示对象创建、依赖装配和生命周期从业务代码交给容器；DI 是实现 IoC 的主要方式。Bean 可通过组件扫描、`@Bean` 工厂方法、`@Import`、XML 或程序化 `registerBean` 注册。依赖可用构造器、Setter 或字段注入；构造器注入能表达必需依赖、支持不可变对象和测试，通常应优先。

容器外手动 `new` 的对象不会自动经历依赖注入、AOP 和完整 Bean 生命周期。确需接管现有对象时可使用受控的 BeanFactory API，但更好的做法是把创建边界放回容器。回答“如何创建 Bean”时要区分注册 BeanDefinition、实例化对象和依赖注入三个阶段。

**追问补充**：AOP 是面向切面的横向关注点机制，把日志、事务、鉴权等逻辑从业务代码中抽离，在匹配的连接点通过切面织入通知。Spring AOP 通常基于代理，只拦截经代理对象的调用；同类内部调用、非 Spring 管理对象可能不生效，应结合代理类型和调用路径排查。

---


自动装配是容器按类型、名称或限定符等候选规则解析依赖并注入；可用 @Autowired、@Resource、@Inject，也可配合 @Primary、@Qualifier 消除多个候选。无候选或多候选且未消歧会启动失败，应通过构造器和容器日志验证实际装配结果。
### 158. Redis 的 RDB、AOF 和混合持久化分别如何工作？线上怎样选？

> 来源：京东后端开发一面，2026 年 8 月 20 日；[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)；本轮追问：Redis 宕机会丢失状态，这个弊端怎么处理？（[淘天AI应用开发二面](https://www.nowcoder.com/feed/main/detail/d5d1f688dae5496abbce783aa28d6731)）；本轮追问：Redis 断电了、数据丢了怎么办？（[智谱ai native builder实习一面](https://www.nowcoder.com/discuss/929419257438302208)）；本轮追问：Redis宕机如何恢复？（[九方智投 一面凉经](https://www.nowcoder.com/feed/main/detail/92efed84eb68493d82132e03b7e43ae0)）；[恒生电子AI应用开发（杭州）一面面经](https://www.nowcoder.com/feed/main/detail/f674f0f958c644629f024f95c7c104b6)；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)；[字节跳动 - Agent 研发 - 一面](https://www.nowcoder.com/feed/main/detail/0b91e9f5fbba4af4865c6fadc9a790e8)

RDB 在指定时机生成数据快照，文件紧凑、恢复快，适合备份和全量恢复，但可能丢失最近一次快照后的写入；生成快照通常依赖 fork 与 Copy-on-Write，大内存和高写入下要关注 fork 延迟与额外内存。AOF 追加写命令并按 `appendfsync` 策略刷盘，数据丢失窗口更小，但文件和恢复成本通常更高，并需要后台重写压缩历史。

混合持久化在 AOF 重写时使用 RDB 前缀加后续增量，兼顾恢复速度和数据新鲜度。线上选型先定义 RPO、RTO、磁盘与 fork 预算，并结合复制、哨兵/集群和异地备份；开启两者也不等于不会丢数据，仍要演练崩溃恢复并验证持久化文件。

**追问补充**：AOF 仍可能丢数据：进程崩溃或断电时，尚未写入 AOF 的命令会丢失；appendfsync 为 everysec 时通常存在约一秒刷盘窗口，always 也受操作系统和存储设备异常影响。还要注意重写期间的增量写入及磁盘故障。

---


Redis 应定位为缓存还是事实源：关键状态需落在数据库或消息日志，Redis 仅作加速，并通过主从、哨兵或集群故障转移降低宕机影响。断电后按 RPO 从 AOF、RDB 或异地备份恢复，必要时从业务库重建，并校验校验和、时间点与数据一致性；恢复写入要保证幂等。
### 159. 网络安全中的四层与七层防御有什么区别？SQL 注入为什么属于应用层攻击？

> 来源：影石 Java 后端二面，2026 年 8 月 11 日

四层防御主要依据 IP、端口、协议和连接状态处理流量，例如 SYN Flood 防护、连接限速和四层负载均衡；七层防御理解 HTTP、RPC 等应用协议和业务语义，可检查 URL、Header、Body、身份与调用行为。层级越高信息越丰富，但解析成本、误报和被绕过的复杂度也更高。

SQL 注入发生在应用把不可信输入拼成 SQL 语义的边界，因此属于应用层问题。根治手段是参数化查询、最小数据库权限、输入约束和安全 ORM 用法；WAF 可拦截已知模式，但不能替代代码修复。四层设备看不到解密后的 SQL 语义，也无法单独解决注入。

---

### 160. Nacos 的注册发现链路是什么？它在 CAP 中到底属于 CP 还是 AP？

> 来源：影石 Java 后端二面，2026 年 8 月 11 日；[10.10 无锡赫玛科技](https://www.nowcoder.com/feed/main/detail/24a0ee8b5d2c4d65aaf5fc1e18bfcc23)

服务实例向 Nacos 注册服务名、分组、集群、地址和元数据，客户端通过查询、订阅和本地缓存获得实例列表，再结合负载均衡发起调用。临时实例通常依赖心跳或连接状态维持，失联后被摘除；客户端还要处理推送丢失、服务端不可用和缓存过期，不能把注册中心当成永不失败的实时真相。

“Nacos 属于 CP 还是 AP”不能只背一个字母。不同版本和数据类型可采用不同一致性路径：临时服务实例更偏可用性的 Distro/AP 语义，持久实例或配置数据可能使用 Raft/CP 语义。回答时应锁定 Nacos 版本、实例类型和业务数据，再说明网络分区时希望保可用还是保强一致。

**追问补充**：n8n 二开通常补充业务 API、任务查询、状态回调、鉴权和通知等自定义节点，统一输入输出并处理超时与重试。接入 Nacos 是为了让这些节点调用的后端服务支持注册发现、动态实例变更和故障摘除，避免在工作流中写死地址。

---

### 161. TCP 已建立连接后，一端突然掉电或断网，另一端的连接状态会怎样变化？

> 来源：[字节 AML / 火山方舟 AI Infra 一面](https://www.nowcoder.com/discuss/921927475611869184)，2026 年 8 月 26 日

掉电一端来不及发送 FIN 或 RST，另一端内核不会凭空知道对端消失，连接可能继续保持 `ESTABLISHED`。若应用继续发送数据，TCP 会重传并按系统重试策略最终超时；若连接长期完全空闲且未启用探测，它可能保持很久。对端重启后旧连接状态已经不存在，收到旧连接报文时通常会返回 RST。

生产系统不能依赖默认 TCP 超时及时发现故障。应设置应用请求 Deadline、读写超时和业务心跳，必要时启用并调优 TCP Keepalive；连接池发现超时或 RST 后移除连接并按幂等语义重连。Keepalive 默认周期往往很长，而且只能证明网络路径和对端协议栈存活，不能证明应用线程健康，因此应用层健康语义仍不可少。

---

### 162. Python 高阶函数、闭包与回调中的参数和生命周期如何流转？

> 来源：[大方云图研发实习一面](https://www.nowcoder.com/feed/main/detail/a9a40feb4e1e4d0ca7c3f8c3ba67d487)；本轮追问：闭包会带来内存泄漏，实际开发中你会用什么方法解决闭包导致的内存问题？（[恒生电子技术岗ai面](https://www.nowcoder.com/feed/main/detail/49a60657cf63400897542e731c3feae4)）

Python 函数本身是对象，可以作为参数传入、作为返回值返回，实例也可通过 `__call__` 变成可调用对象。调用高阶函数时，传入的是函数对象引用；包装器收集 `*args/**kwargs` 后再次调用它，Python 再按位置参数、关键字参数和默认值把实参绑定到形参。[Python 调用表达式](https://docs.python.org/3/reference/expressions.html#calls)定义了绑定规则，[数据模型](https://docs.python.org/3/reference/datamodel.html)则描述了函数、绑定方法和 callable 对象。

闭包保存的是自由变量所在的 cell，而不是创建闭包那一刻的值副本，因此循环里创建 lambda 容易出现 late binding；可通过默认参数或局部工厂冻结当轮值。绑定方法会持有实例，回调注册表也可能延长对象生命周期，注销不及时会造成资源泄漏。异步回调还要处理异常、取消、超时和调用方已销毁等边界，不能只会把函数当参数传进去。

---


实际可通过注销回调、避免闭包强引用 self，或用 weakref.ref/WeakMethod 保存对象；对长期注册表设置生命周期和上限。用 tracemalloc 或对象引用链定位未释放对象，确认解绑、任务结束和异常路径都能执行清理。
### 163. Celery 在异步任务平台中负责什么？Broker、Worker、Result Backend、Retry 与幂等如何协作？

> 来源：[大方云图研发实习一面](https://www.nowcoder.com/feed/main/detail/a9a40feb4e1e4d0ca7c3f8c3ba67d487)；[虾皮秋招 研发工程师](https://www.nowcoder.com/feed/main/detail/dcb2bf1c6b7c4b6a9f4c095ba9329bce)；[10.21小红书一面面经](https://www.nowcoder.com/feed/main/detail/bab2ccabb366403492901c712278329e)；[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60)

生产者把任务消息发到 Broker，Worker 消费并执行；Result Backend 是可选的状态/结果存储，不等于 Broker。Celery 负责分发、路由、重试和任务状态抽象，但数据库事务、业务幂等和 exactly-once 仍由应用保证。[Celery Tasks 文档](https://docs.celeryq.dev/en/stable/userguide/tasks.html)也将 retry、ack 和 result backend 作为不同机制。

默认早确认降低重复执行概率，但 Worker 确认后宕机会丢失任务；`acks_late` 把确认推迟到执行后，恢复能力更强，却可能重复执行。Celery 还有一个容易漏掉的边界：执行任务的子进程被信号终止或异常退出时，即使开启 `acks_late`，默认仍可能确认消息；只有明确评估并启用 `task_reject_on_worker_lost` 才要求这类消息重投，而它也可能制造持续失败的重投循环。任务应携带稳定业务幂等键，按异常类型决定 retry，设置指数退避、上限和 Dead Letter 路径。结果不需要查询时不要无条件持久化；需要状态时明确过期和清理，否则 Result Backend 会成为隐性存储瓶颈。

**追问补充**：不能预先承诺固定耗时，应按 Broker 类型、持久化和集群规模实测。演练重启并记录从服务恢复、连接重建、积压开始消费到队列追平的时间，同时核对消息是否丢失、重复及重试情况。

**追问补充**：多个 Worker 可竞争消费同一队列中的任务，以分担吞吐；一次投递交给某个消费者不等于业务只执行一次，失败、确认与重投策略仍可能造成重复或乱序。API、调度器、Broker、Worker 和结果存储可分别部署与扩缩容，业务写入使用幂等键及状态条件更新，广播则显式设计各订阅者的投递。

---

### 164. MyBatis 接入项目需要配置哪些组件？Mapper、映射、TypeHandler、事务和缓存如何分工？

> 来源：[小公司 AI Agent 开发一面](https://www.nowcoder.com/feed/main/detail/de422815aacc45b48beb150ce44c0197)

MyBatis 的核心入口是 `SqlSessionFactory`，底层环境包含 DataSource 和事务管理；Mapper 接口与 XML/注解中的 statement 定义 SQL 和参数/结果映射，`ResultMap` 解决列到对象的复杂映射，`TypeHandler` 负责 JDBC 类型与 Java 类型转换。插件、别名、数据库厂商选择和 Mapper 注册都属于配置层。[MyBatis 官方配置结构](https://mybatis.org/mybatis-3/configuration)明确列出了这些组件。

一级缓存属于 `SqlSession`，二级缓存绑定 Mapper namespace，不能把它当通用分布式缓存；写操作、事务边界和脏数据风险要一起评估。接入 Spring 后事务通常由 Spring 模块接管，不应再假设 mybatis-config 中的 TransactionManager 决定最终事务语义。排查时区分“Mapper 未注册”“statement ID/namespace 不匹配”“参数映射错误”和“事务未提交”，不要都归为 SQL 写错。

---

### 165. `useEffect` 何时运行和清理？依赖数组、闭包陈旧、竞态与 Strict Mode 重放如何处理？

> 来源：[拼多多 AI 全栈两轮技术面](https://www.nowcoder.com/discuss/921104232256675840)

`useEffect` 用来把组件与外部系统同步。组件提交后执行 setup；依赖变化时先用旧值执行 cleanup，再用新值执行 setup；卸载时最后清理一次。省略依赖数组会在每次 commit 后运行，空数组表示不因响应式值变化而重跑，但开发环境的 Strict Mode 会额外执行一次 setup→cleanup→setup，用来暴露清理不完整的问题。这些语义以 [React 官方 `useEffect` 文档](https://react.dev/reference/react/useEffect)为准。

依赖项必须覆盖 effect 使用的所有响应式值，不能为了“只跑一次”故意漏写。函数/对象每次渲染都创建会导致重复执行；异步请求则要在 cleanup 中取消，或用 ignore/generation 标志拒绝晚到结果，防止旧请求覆盖新状态。若逻辑不在同步外部系统，通常不需要 Effect，应在事件处理或渲染计算中完成。

---

### 166. AI 对话流式接口如何约定事件、错误和重放？前端如何增量解析并避免频繁重渲染？

> 来源：[拼多多 AI 全栈两轮技术面](https://www.nowcoder.com/discuss/921104232256675840)

协议先定义事件 envelope，例如 `run_id/event_id/seq/type/payload/error/final`，区分 token、Tool 状态、Artifact、错误和结束事件。SSE 原生支持 `event`、`data`、`id` 和重连时间；`id` 可配合持久事件日志做断线续传，[MDN SSE 文档](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)说明了这些字段。需要 POST、自定义 Header 或二进制流时，可用 Fetch 的 [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream)，但重连和事件 framing 要自行实现。

网络 chunk 不等于一个完整 JSON。前端用流式 `TextDecoder` 处理 UTF-8 边界，按协议分隔符组帧后再解析，并用 `seq` 去重、检测缺口。渲染层把短时间内的 token 合并后按 animation frame 或固定间隔刷新，Tool/错误/final 事件立即提交，避免每个 token 都触发整棵消息树重渲染。取消要传播到服务端任务；重连只重放尚未确认的事件，不能重新执行已有副作用。

---

### 167. 浏览器强缓存与协商缓存如何工作？`Cache-Control`、`ETag`、`Last-Modified` 与 CDN 如何协作？

> 来源：[拼多多 AI 全栈两轮技术面](https://www.nowcoder.com/discuss/921104232256675840)；[字节内部跨转二面-抖音开放平台](https://www.nowcoder.com/feed/main/detail/0f9c6347a3f1421a876ee2ff2854de06)

“强缓存”通常指响应仍新鲜时直接复用本地副本而不联系源站，主要由 `Cache-Control: max-age`/`s-maxage`、`Expires` 和缓存键决定；“协商缓存”实质是过期后发条件请求，用 `ETag + If-None-Match` 或 `Last-Modified + If-Modified-Since` 验证，未变化返回 304 并复用正文。[RFC 9111](https://www.rfc-editor.org/rfc/rfc9111.html)定义了新鲜度、重验证和缓存指令，`ETag` 通常比秒级时间戳更适合精确验证。

带内容哈希的 JS/CSS/图片可设置长 `max-age, immutable`；HTML 或配置入口通常要求重验证；用户私有或敏感响应使用 `private`/`no-store` 并把身份维度纳入缓存键。CDN 属共享缓存，可用 `s-maxage` 独立控制边缘新鲜度，还要正确设置 `Vary`，否则压缩格式、语言或身份响应可能串用。更新策略必须与文件名版本化和失效机制配套，不能只把过期时间设得很长。

---

### 168. C++ 的 `struct` 和 `class` 有什么区别？应该如何选择？

> 来源：[BIGO 音频算法工程师一面](https://www.nowcoder.com/discuss/924359576990781440)

两者都能定义成员变量、成员函数、构造析构、虚函数、模板和继承。语言层面的关键默认值只有两个：`struct` 成员和基类继承默认 `public`，`class` 默认 `private`；显式写出访问控制后，二者在这些能力上没有本质差异，也不能据此断言 ABI、性能或内存布局不同。

工程约定通常用 `struct` 表达简单数据载体、聚合值或公开字段，用 `class` 表达需要维护不变量和封装边界的对象，但这是风格，不是编译器强制规则。是否仍为 aggregate 取决于构造函数、虚函数、基类和访问控制等完整定义，不能看到 `struct` 就默认可聚合初始化。公共接口中应显式写 `public/private`，减少后续改 `struct/class` 时的隐式语义变化。

---

### 169. `std::vector` 和数组有什么区别？

> 来源：[BIGO 音频算法工程师一面](https://www.nowcoder.com/discuss/924359576990781440)

C 数组的长度属于类型且固定，传入函数时经常退化为指针，长度信息和边界检查不会自动保留；`std::array<T, N>` 封装固定长度连续存储，具有值语义、迭代器和 `size()`；`std::vector<T>` 用 RAII 管理动态连续存储，区分 `size` 与 `capacity`，支持运行期增长。

`vector` 扩容会重新分配并搬移元素，使原有指针、引用和迭代器全部失效；未扩容的插入/删除也可能使操作点及其后的迭代器失效。`reserve` 可以降低扩容次数，但不能把 `capacity` 当有效元素个数。`array` 适合编译期固定且需要值语义的缓冲区，`vector` 适合动态数量，C 数组主要用于 C ABI、底层固定对象或已有接口；边界敏感代码优先传 `span` 或容器引用，避免只传裸指针。

---

### 170. 如何设计多租户 Intel SGX 机密计算服务？EPC 超额换页时怎样诊断容量瓶颈？

> 来源：[阿里云 Agent Infra 一面](https://www.nowcoder.com/discuss/924245733962719232)

先定义威胁模型：SGX 保护 enclave 内存和执行免受宿主高权限软件直接读取，但不会自动解决业务授权、侧信道、拒绝服务、回滚、租户间逻辑越权或有漏洞的 enclave 代码。租户身份、enclave 度量值、远程证明、密钥发放、输入输出加密和审计必须形成完整信任链，EPC 也要按租户设置预算与 admission control，防止单租户工作集挤压他人。

EPC 是受保护但有限的内存资源；工作集超出后会发生受保护页面换出/换入，带来加密、完整性和管理开销。[Intel SGX EPC oversubscription 文档](https://cdrdv2-public.intel.com/671471/sgx-oversubscription.pdf)给出了相应机制与性能背景。容量诊断应同时看 enclave 工作集、EPC paging/fault、CPU、内存带宽、锁竞争、外部 I/O 和队列等待；“PV 变 4 倍但吞吐不变”可能是入口没打到服务、并发受限或已经被 EPC/其他串行瓶颈封顶，不能仅凭一个比例下结论。

治理上将大对象、缓存和可验证的非敏感计算留在 enclave 外，只把必须保密的最小状态放入 enclave；对租户做并发和 EPC 配额，按测得的工作集分池或调度。压测使用真实页面访问模式并报告吞吐、P95/P99、换页率和每租户公平性，不背固定 EPC 容量或硬件延迟。

---

### 171. CORS 为什么会触发预检？服务端响应头和反向代理分别解决什么？

> 来源：[英迈软件面试复盘](https://www.nowcoder.com/feed/main/detail/355e6818b7e7418ba6f2c88c6bc50351)；本轮追问：什么是跨域，为什么会有跨域，有哪些解决方案？（[度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368)）

CORS 是浏览器在同源策略之上执行的跨源 HTTP 访问协议，不是后端服务之间的通用网络限制。对非 safelisted 方法、请求头或 Content-Type，浏览器先发送 `OPTIONS` 预检，携带 Origin、计划使用的方法和请求头；服务端用允许来源、方法、请求头和凭证策略响应，浏览器通过后才发送实际请求。详细判断以 Fetch 标准的 [HTTP CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol) 为准。

前端自行添加 `Access-Control-Allow-Origin` 没用，这些是服务端响应头；携带凭证时也不能把允许来源写成通配符。反向代理可以让浏览器只访问同源网关，再由网关转发后端，因此消除浏览器看到的跨源边界，但它不替代身份认证、CSRF 防护、目标白名单和 Header 清洗。生产配置应精确允许已知来源并设置 `Vary: Origin`，不能无条件回显任意 Origin。

---


跨域是页面与目标地址的协议、域名或端口任一不同；同源策略用于限制恶意页面读取其他站点数据，不能简单理解为网络不可达。常见方案包括服务端 CORS、同源反向代理、跨窗口 postMessage；JSONP 仅支持 GET，WebSocket 需单独校验 Origin。
### 172. `BeanFactory` 与 `ApplicationContext` 的职责和使用边界是什么？

> 来源：[字节中国交易与广告 AI 应用开发一面](https://www.nowcoder.com/feed/main/detail/b34f6902e8544fe2953696ed52e49dba)

`BeanFactory` 是 Spring IoC 容器的核心 SPI，负责 BeanDefinition、对象创建、依赖解析和生命周期；`ApplicationContext` 在其上组合资源加载、Environment、事件发布、国际化等应用级能力，并约定自动发现/注册常见容器扩展。Spring 官方也把 [BeanFactory](https://docs.spring.io/spring-framework/reference/core/beans/beanfactory.html)定位为底层基础，普通应用通常面向 `ApplicationContext`。

不能机械背成“BeanFactory 一定懒加载、ApplicationContext 一定饿加载”。是否预实例化取决于 Bean scope、lazy 配置、容器刷新和具体实现。业务代码不应频繁调用 `getBean` 充当 Service Locator；优先构造器注入。只有框架集成、容器扩展、动态插件或测试基础设施才通常需要直接操作 BeanFactory SPI。

---

### 173. RocketMQ 延时消息如何工作？没有 MQ 时怎样实现可靠的持久调度？

> 来源：[字节中国交易与广告 AI 应用开发一面](https://www.nowcoder.com/feed/main/detail/b34f6902e8544fe2953696ed52e49dba)

RocketMQ 5.x 的定时/延时消息由生产者设置投递时间，消息在到期前不可被正常消费，到期后进入可投递状态；它保证的是“不早于目标时间进入消费”，不是实时系统的精确唤醒。[RocketMQ 5.0 延时消息文档](https://rocketmq.apache.org/docs/featureBehavior/02delaymessage/)还要求关注支持的时间范围、重试和消费幂等，不能继续背旧版本固定 18 个 delay level 当作所有版本契约。

没有 MQ 时可用数据库任务表：保存 `task_id、next_run_at、status、attempt、payload_ref、version`，按 `next_run_at` 建索引；多个 Worker 用租约或 `SELECT ... FOR UPDATE SKIP LOCKED` 抢占到期任务，先条件更新状态再执行。任务必须有业务幂等键，失败按错误类型退避重试并进入死信/人工处理，Worker 崩溃后由 lease 超时回收。数据库轮询适合中小规模和较宽松精度；规模、精度或扇出上升后再评估时间轮、分片调度器或专用队列。

---

### 174. NIO Reactor 的事件循环、线程模型和背压应该如何设计？

> 来源：[字节中国交易与广告 AI 应用开发一面](https://www.nowcoder.com/feed/main/detail/b34f6902e8544fe2953696ed52e49dba)

Reactor 把非阻塞 Channel 注册到 Selector，事件循环调用 `select` 获取就绪键，再处理 accept、connect、read、write。Java [Selector API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/nio/channels/Selector.html)只报告“操作可能就绪”，并不保证一次读写完成；处理器必须维护连接状态、半包/粘包、部分写和 interest set。

单 Reactor 可负责接受和 I/O，业务逻辑下沉有界 Worker 池；连接和核数上升时可采用 Acceptor + 多个 I/O Reactor，但 Channel 归属和任务提交必须明确。事件循环里禁止阻塞数据库、远程 RPC 或重 CPU 任务，否则一个慢连接会拖住整组连接。

背压从读写两侧做：Worker 队列或下游水位过高时暂停读 interest，待容量恢复再启用；写队列超过上限时限流、丢弃可降级消息或关闭慢连接，不能无界缓存。监控每轮事件数、事件循环延迟、队列深度、单连接积压和 Selector 空转，避免只看总 QPS。

---

### 175. Spring 配置源优先级、动态刷新和配置中心故障降级如何设计？

> 来源：[字节中国交易与广告 AI 应用开发一面](https://www.nowcoder.com/feed/main/detail/b34f6902e8544fe2953696ed52e49dba)

Spring 的 `Environment` 聚合有序 PropertySources，并通过当前顺序解析同名属性；[Spring Environment 文档](https://docs.spring.io/spring-framework/reference/core/beans/environment.html)说明了 profile、属性源和占位符能力。具体优先级还受 Spring Boot 版本、启动参数和团队添加的配置源影响，不能背一张脱离版本的固定顺序表；启动时应输出脱敏后的来源和最终生效版本，便于审计覆盖关系。

动态刷新不是“监听到一条变更就逐字段改 Bean”。配置先作为完整候选版本拉取，做 schema、范围、跨字段和权限校验，再原子切换不可变快照并发布版本事件；消费者只接受更新后的完整版本。监听器失败时保留 last-known-good，记录失败并告警，不能让部分组件读取新值、部分组件仍读旧值。线程池、连接池等无法安全热改的参数应走重建/排空或重启。

配置中心不可用时，启动策略按风险区分：关键且无安全默认值的配置 fail closed；允许陈旧的配置从本地加密快照恢复并标记 stale；非关键项使用代码默认值。运行期继续使用内存中已验证版本，后台有界重连；恢复后先校验版本和变化范围再切换，不能把远端瞬时错误覆盖到本地稳定快照。

---

### 176. 红黑树删除后如何通过旋转和变色恢复不变量？

> 来源：[阿里千问平台开发一面](https://www.nowcoder.com/feed/main/detail/141447389dab4e8e9ca6db742a514f39)

红黑树要维持：根为黑、空叶视为黑、红节点不能有红孩子、任一路径黑高相同。删除时应看**物理移除节点的原始颜色**：移除红节点不改变黑高；移除黑节点后，若替代节点为红，染黑即可结束；替代节点为黑或 NIL 时才进入通常所说的“双黑”修复。实现一般用 sentinel 统一空节点，并沿父链修复。

以缺口在左侧为例分情况处理，右侧完全对称：兄弟为红时，先把兄弟染黑、父染红并左旋，把问题转成黑兄弟；黑兄弟两个孩子都黑时，兄弟染红，缺口上移到父；黑兄弟远侄为黑、近侄为红时，先对兄弟右旋并交换颜色，转成远侄为红；最后令兄弟继承父颜色、父染黑、远侄染黑并左旋，消除缺口。结束时把当前节点和根染黑。

面试回答应先说不变量和“黑高亏损”目标，再说对称 case；生产实现优先使用标准库，手写时重点测试删除根、黑叶、只有一个孩子、连续向上修复和随机序列不变量，不能只背旋转口令。

---

### 177. SSD 与机械硬盘访问延迟由什么组成？如何用 fio 做正确压测？

> 来源：[阿里云可观测存储 AI Agent 工程岗一面](https://www.nowcoder.com/discuss/923528884249710592)

HDD 随机访问主要包含排队、寻道、旋转等待和传输；SSD 没有机械寻道，但仍有主机队列、控制器/FTL 映射、NAND 访问、写放大、垃圾回收和介质缓存。文件系统、页缓存、设备队列、块大小、读写比例、并发深度和数据是否预热都会改变结果，因此不能背一个“SSD/HDD 固定多少毫秒”的数字。

用 [fio 官方文档](https://fio.readthedocs.io/en/master/fio_doc.html)明确 `rw、bs、iodepth、numjobs、ioengine、runtime、time_based` 等参数；要测介质而非页缓存时使用适合平台的 direct I/O，先预置数据并让设备进入稳定状态。随机写可能破坏数据，只能在明确的测试盘或受控文件上执行，不能对生产块设备直接跑。

报告同时给 IOPS、带宽、平均值与 P50/P95/P99 延迟、队列深度和 CPU，并注明设备型号、固件、文件系统、容量水位与读写模式。对比 HDD/SSD 时保持 workload 相同，但也要分别测试符合实际业务的随机/顺序和同步/异步路径。

---

### 178. Windows 上 Docker、WSL2 和 Hyper-V 隔离的边界是什么？

> 来源：[百度 Agent 二面](https://www.nowcoder.com/feed/main/detail/bca7dc14bd654e91b89792608111b211)；本轮追问：microVM 是什么？与普通 VM、Docker 的区别以及隔离强度如何理解？（[9.15科大讯飞AI应用一面](https://www.nowcoder.com/feed/main/detail/aece93373f9c47ea95c831aef6471886)）

先区分工作负载。Windows 容器的 process isolation 与宿主共享 Windows 内核；Hyper-V isolation 会为每个容器提供轻量虚拟机和独立内核，隔离更强，也有额外启动和资源成本。Microsoft 的 [Windows 容器隔离文档](https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)还说明了宿主/镜像版本兼容和两种模式的选择边界。

Docker Desktop 的 WSL2 backend 在 WSL2 的轻量 VM 中运行 Linux 内核和 Linux 容器；这些容器共享该 Linux 内核，但不等于直接共享 Windows 内核。Hyper-V backend 则使用由 Hyper-V 管理的隔离 Linux VM。[Docker Desktop 官方 VMM 文档](https://docs.docker.com/desktop/features/vmm/)说明了两种后端的边界。无论哪种 backend，容器隔离、VM 边界和 Windows 宿主之间都还要分别考虑文件共享、网络、凭证、资源上限和调试入口。

选择时看镜像 OS、内核兼容、隔离强度、启动/密度、GPU/设备支持和运维基线。不要把“用了 Docker”当成没有 VM，也不要把 WSL2 发行版、Windows 容器和 Hyper-V-isolated container 混成同一种执行环境。

---


microVM 由虚拟化硬件提供独立内核和较小的虚拟机边界，通常比完整 VM 更轻、更快；Docker 容器共享宿主内核，隔离弱于 microVM。实际强度还取决于设备、共享目录、管理面和权限配置，不能只按名称判断。
### 179. 并发标记开始前为什么需要 Initial Mark / Concurrent Start STW？这一阶段做什么？

> 来源：[去哪儿 AI 全栈自动面](https://www.nowcoder.com/feed/main/detail/9cf516b3c2404100baeac52564e40709)

这道题应先确认收集器，不能把 CMS、旧版 G1 和现代 G1 的阶段名称与工作内容混成一套。以下以 G1 为例：旧版资料常把开始标记称为 Initial Mark，现代 JDK 文档把对应暂停称为 Concurrent Start。G1 在一次 STW 的年轻代收集中启动 SATB 标记，并以这次暂停为虚拟堆快照的边界；随后并发标记才与应用线程共同推进。[Oracle G1 文档](https://docs.oracle.com/en/java/javase/25/gctuning/garbage-first-g1-garbage-collector1.html)描述了这一阶段与后续 Remark/Cleanup 的关系。

必须暂停应用，是因为收集器要处理 GC Roots、年轻代转移后的引用和标记起始状态；如果应用同时任意修改引用而没有已建立的并发标记协议，根集合会不一致。Initial Mark 不会在这次暂停中遍历完整老年代，也不等于完成三色标记；主要堆遍历发生在并发阶段，后续 Remark 再以 STW 处理并发期间尚未闭合的标记信息。

回答时应区分 G1 的 Young-only/Space-reclamation 阶段和 Concurrent Start、Concurrent Mark、Remark、Cleanup，避免把 CMS、G1、ZGC 的暂停阶段混用同一套术语，并按具体 JDK 版本解释日志标签。

---

### 180. React 的核心工作模型是什么？组件、State、渲染与 Effect 如何协作？

> 来源：[字节中国交易与广告 AI 应用开发一面](https://www.nowcoder.com/feed/main/detail/b34f6902e8544fe2953696ed52e49dba)；[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60)

React 用组件把 UI 声明为 `props + state` 的函数结果。一次更新经过触发、Render、Commit：Render 计算下一棵元素树并要求保持纯函数语义，React 比较前后树后在 Commit 阶段最小化更新 DOM；浏览器随后布局和绘制。官方 [Render and Commit](https://react.dev/learn/render-and-commit)文档明确区分了计算 UI 与提交 DOM 两个阶段。

State 由组件在树中的位置、组件类型和 `key` 共同绑定，不是存在组件函数里的普通局部变量；批量更新和函数式 updater 用来处理同一事件中的多次状态变更。列表 `key` 应稳定表达业务身份，不能依赖会变化的索引，否则重排时可能错误复用 State。

Effect 用于与网络、订阅、计时器、DOM 或第三方组件等**外部系统同步**，不应承担可在 Render 中直接计算的派生值。依赖变化时先清理旧 Effect 再建立新同步，卸载时必须释放资源；事件处理属于用户动作，Effect 属于渲染结果引发的同步，两者不能混用。性能优化先定位无效 Render，再选择状态下沉、拆分组件、稳定 props 或 memo，不能把 `useMemo/useCallback` 当默认正确性工具。

---

### 181. 什么情况下会发生 `StackOverflowError`？如何定位和修复？

> 来源：[去哪儿旅行 AI 全栈一面](https://www.nowcoder.com/discuss/926507047238078464)

每个线程的调用栈容量有限。无限递归、递归终止条件错误、正常但深度过大的递归，以及两个方法循环调用都会不断创建栈帧，最终抛出 `StackOverflowError`；它是 `Error`，不应把“捕获后继续运行”当作修复方案。定位先看异常栈是否重复出现同一组方法，再检查终止条件、输入规模和隐式递归；能改迭代就使用显式栈，增大 `-Xss` 只能作为容量权衡。

---

### 182. 多机环境如何生成全局唯一、趋势递增且高可用的 ID？

> 来源：[拼多多 Agent 开发岗一面](https://www.nowcoder.com/discuss/926273867092430848)

数据库自增或集中号段服务顺序清晰但可能成为瓶颈；UUID 去中心化但不递增；Snowflake 类方案吞吐高且趋势递增，却要处理节点号唯一、时钟回拨和序列溢出。生产上应结合号段租约、机房位宽、故障转移和重复率监控；严格连续序列必须接受串行化和可用性代价。

---

### 183. 子网与 VLAN 分别解决什么问题？它们是什么关系？

> 来源：[百度 Agent 一面](https://www.nowcoder.com/feed/main/detail/72858aade19d443facc870fea8bb134f)

IP 子网是三层地址与路由边界；VLAN 是二层广播域隔离。一个 VLAN 常配置一个或多个 IP 子网，但两者不是同一概念。跨 VLAN 通常需要三层网关。排障时分别检查 VLAN membership/trunk、MAC 表、ARP、掩码与路由，不能把“不同网段”当作完整解释。

---

### 184. SQLite 适合什么项目场景？什么时候应该换成客户端-服务器数据库？

> 来源：[跨设备多 Agent 项目一面](https://www.nowcoder.com/feed/main/detail/9b1329caf4b64389a0ab666585bda045)

SQLite 适合移动/桌面应用、本地缓存、离线数据、边缘设备、测试和小型单机服务。WAL 可改善读写并发，但多实例写入、细粒度权限、跨机高可用、CDC 或复杂运维需求出现时，应考虑 PostgreSQL/MySQL 等服务端数据库。选型要基于写并发、故障域和一致性，而不是只看文件大小。

---

### 185. `ping` 能检测端口吗？端口“开放”和服务进程“监听”有什么区别？

> 来源：[跨设备多 Agent 项目一面](https://www.nowcoder.com/feed/main/detail/9b1329caf4b64389a0ab666585bda045)

普通 `ping` 使用 ICMP，不携带 TCP/UDP 端口，不能证明应用端口可用；端口检测应使用 `nc`、`Test-NetConnection`、`curl` 或协议客户端。进程监听只表示本机 Socket 已绑定并接收，外部可访问还取决于绑定地址、防火墙、安全组、NAT、路由和应用健康。

---

### 186. SHA 与 Base64 有什么区别？密码应该如何存储？

> 来源：[小厂技术一面](https://www.nowcoder.com/feed/main/detail/0aaf90e0710140f486fb71ca2625bec3)

Base64 是可逆编码，不提供保密性；SHA 是单向哈希，但普通 SHA 速度太快，不适合直接存密码。密码应使用 Argon2id、scrypt、bcrypt 或 PBKDF2，配合每密码随机 salt、恒定时间比较和参数升级；需要恢复原文的数据才使用带认证的加密。

---

### 187. MP4 边下边播如何实现？HTTP `Range` 请求有哪些关键语义？

> 来源：[百度具身研发一面](https://www.nowcoder.com/feed/main/detail/258695ecdfbb464790fc8ae55c9f1661)

播放器按时间轴请求字节区间，服务端支持 Range 时返回 `206 Partial Content` 与 `Content-Range`；不支持时返回完整 `200`，越界返回 `416`。MP4 发布时将 `moov` 元数据前移可更快首播和 Seek；CDN 缓存、ETag、鉴权和文件版本必须保持一致，避免范围拼接到不同版本。

---

### 188. ES6 常见遍历机制有什么区别？如何按数据结构和控制流选择？

> 来源：[去哪儿旅行前端一面](https://www.nowcoder.com/feed/main/detail/2ed12b3fa1d4491f8bb029f99cf9de73)

`for...of` 消费 Iterable，支持值遍历、`break` 和异步控制；`for...in` 枚举可枚举字符串键，通常不用于数组。`forEach` 不能提前 `break`，也不会等待异步回调；串行 `await` 用 `for...of`，并发则显式组合 `Promise.all`。`map/filter/reduce` 更适合表达数据变换，不应只为副作用滥用。

---

### 189. CPU 经典五级流水线是什么？乱序执行如何保证结果正确？

> 来源：[昆仑芯 AI 高性能开发一面](https://www.nowcoder.com/feed/main/detail/65b9990e774a4331bb603f0cf1ca4a88)

经典模型包括 IF、ID、EX、MEM、WB 五级，真实 CPU 还会处理结构、数据和控制冒险。乱序核心用寄存器重命名消除假依赖，用调度队列等待操作数，结果进入 Reorder Buffer，只有到队头才按程序顺序提交；分支误预测或精确异常时丢弃未提交结果，因此内部乱序而架构状态仍保持顺序语义。

## 近期新增：2026-09-13 面经补充

### 190. Python 闭包的延迟绑定代码会输出什么？如何修复？

> 来源：[寒武纪 AI 应用开发一面](https://www.nowcoder.com/feed/main/detail/64868531af8d424b8aa55f46e313b478)

Python 闭包捕获的是变量绑定而非当次循环的值；函数真正调用时才查找自由变量，因此循环创建的回调常全部读取最后一个值。可用默认参数 `lambda x=x: ...`、工厂函数或 `functools.partial` 固定当前值。回答时要区分词法作用域、闭包单元格和调用时机，并说明可变对象仍可能共享同一引用。

### 191. 数据量很大时，深分页应该如何设计？

> 来源：[去哪儿旅行 AI 面试+笔试](https://www.nowcoder.com/discuss/926507047238078464)；[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)；[满帮ai全栈](https://www.nowcoder.com/discuss/941738854376087552)

大 offset 会让数据库扫描并丢弃前面大量记录，页码越深延迟越高。优先用稳定排序键（例如 `(created_at, id)`）和 `WHERE` 游标条件做 keyset pagination；跨分片时各分片执行有界查询，再由聚合层 k-way merge。若产品必须跳到任意页，应维护可接受的索引快照或异步生成结果，并处理数据变更造成的重复与漏项。

**追问补充**：首次查询记录末尾的 `(created_at,id)` 作为游标，下一页用 `created_at > 上次时间 OR (created_at = 上次时间 AND id > 上次id)`（升序）过滤。id 必须唯一且稳定，用于打破时间相同的并列，避免重复或漏项。

**追问补充**：游标分页通常不天然支持按任意页码跳转，调用方需要回传稳定排序位置；总数可另行统计，但需单独评估成本和快照一致性。它的主要收益是减少深分页扫描并丢弃前置记录的工作，仍要处理排序键重复、并发写入和版本边界。





### 192. 一对一私聊应使用第三方服务还是自建消息表？

> 来源：[小厂 AI Agent 工程师一面](https://www.nowcoder.com/feed/main/detail/4f486761a999482fa6819b3e45ae3346)

先按可靠性、合规、实时性、离线消息和运维能力做选型。第三方 IM 能快速获得长连接、推送、回执和多端同步；自建消息表便于业务数据隔离、审计和定制，但需要补齐连接网关、顺序、幂等、重试、离线拉取和存储扩展。无论哪种方案，消息都应有全局或会话内递增序号、客户端幂等键、服务端持久化状态和可重放的 ACK 语义。

### 193. 原子切换时如何避免请求丢失或读到旧版本响应？

> 来源：[知识科技数据平台二面](https://www.nowcoder.com/feed/main/detail/8aa09d879bfc408fae7442565fd25fbe)；[美团AI全栈一面，AICoding把我整不会了](https://www.nowcoder.com/discuss/929871920625963008)

切换配置、模型或路由版本时，为每次请求绑定不可变的 `version`，由读路径使用同一版本的快照；发布采用双版本并行、原子指针切换和短暂排空。旧请求允许完成但响应必须带版本，调用方发现版本过期时丢弃或按策略重试。切换记录、健康检查、超时、回滚和幂等发布一起设计，不能只依赖一个进程内布尔开关。

### 194. 变更节点导致下游输出分化，如何定位？

> 来源：[知识科技数据平台二面](https://www.nowcoder.com/feed/main/detail/c478feeef29340caac7b8c44d5a6c5e4)

先固定输入、数据版本、模型/代码版本和随机种子，比较变更前后的节点输入、输出、耗时和错误计数。沿 DAG 找到第一个差异节点，再用单节点回放、契约校验和二分禁用排除并发时序、缓存命中、下游依赖等干扰。线上保留 trace、版本和关键中间摘要；确认根因后用小流量灰度、回归集和可回滚制品验证，避免把下游差异直接归因给最后一个节点。

### 195. C++ 中哪些资源适合用 RAII 管理？

> 来源：[沐曦 AI Infra 一面](https://www.nowcoder.com/discuss/927223254320676864)

RAII 适合管理具有明确取得/释放边界的资源：文件描述符、锁、Socket、数据库连接、临时目录、GPU/设备句柄和事务作用域。构造函数取得资源，析构函数释放；移动语义转移所有权，拷贝应被禁止或定义为深拷贝。析构函数不应抛异常，跨异步任务或跨线程的资源要显式表达所有权与生命周期，不能用 RAII 掩盖泄漏、循环引用或错误的共享所有权。

## 近期新增：2026-09-21 面经补充

### 196. 应用层与传输层的职责、核心协议和协作方式是什么？

> 来源：[字节数据中台Agent全栈面经](https://www.nowcoder.com/feed/main/detail/fe77496948f74b4091ab4bb6e8156c8b)

应用层面向业务，定义请求语义、数据格式和交互协议，例如 HTTP、DNS、SMTP；传输层负责端到端进程通信，提供端口复用、分段重组、流量控制、拥塞控制及可靠性能力，典型协议是 TCP 和 UDP。两层通过套接字协作：应用产生消息，传输层封装并交付，接收端反向解封装。选型要看可靠性、时延、顺序和连接成本；排查时可分别检查应用响应码与日志、TCP 握手重传、UDP 丢包及端口和防火墙。重试必须配合超时、幂等键和限流，不能把传输层可靠误认为业务一定成功。

### 197. Python 静态类型与动态类型有什么区别？类型转换如何处理？

> 来源：[千问AI研发一面凉经](https://www.nowcoder.com/feed/main/detail/ebf0ec03e5ee4fa8a140cc8d247b1e20)

Python 是动态类型语言：变量在运行时绑定到对象，赋值时通常不要求提前声明固定类型；静态类型则在编译或检查阶段约束变量和接口，较早发现类型错误。Python 的类型注解主要服务于 IDE、静态检查和文档，默认不会替代运行时校验。类型转换应优先显式调用 int、float、str、bytes 等，并处理格式错误、溢出、空值和编码问题；不要把强制转换当作校验，例如字符串转数字仍可能失败。跨边界接收用户输入、JSON 或数据库数据时，应先校验结构与范围，再转换并记录异常。

### 198. 视频合并失败后的临时文件与资源清理如何保证幂等和一致性？

> 来源：[字节 AI 全栈一面（飞书）](https://www.nowcoder.com/discuss/931555466247700480)

为每次合并创建唯一任务目录和资源清单，用状态机记录 INIT、RUNNING、SUCCEEDED、FAILED；所有临时文件、进程、句柄和对象存储分片都纳入清单。清理放在 finally，并设计为可重入：删除前校验任务归属，文件不存在视为成功，外部删除失败则记录并按退避重试。成功结果先原子落盘再更新状态，避免误删产物；数据库状态与文件系统无法一次提交时，用补偿任务、租约和定时清扫兜底，同时保留告警、审计和幂等键，防止并发清理或重试破坏其他任务。

### 199. 慢 SQL 如何定位瓶颈并进行优化？

> 来源：[字节 AI 全栈一面（飞书）](https://www.nowcoder.com/discuss/931555466247700480)；[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)；[(秋招) 9.16 字节中交广 - 交易与广告业务 - AI全栈开发工程师](https://www.nowcoder.com/discuss/932587389027962880)；[9.20 汇川技术 数字化全栈工程师 一面](https://www.nowcoder.com/feed/main/detail/28032c48a90c4f69827704deb3fae34c)；[宏图智能一面](https://www.nowcoder.com/discuss/934206754898866176)；[满帮ai全栈](https://www.nowcoder.com/discuss/941738854376087552)

先确认慢的是数据库执行还是网络、连接池或锁等待，并用慢查询日志、请求参数、耗时分布和链路追踪复现。对 SQL 查看执行计划，重点看扫描行数与实际返回量、索引命中、连接顺序、排序临时表、回表及锁等待；再结合表统计信息和数据分布判断原因。优化可能包括联合索引、改写不可索引条件、减少列和结果集、调整分页、拆分复杂查询或避免无效关联。修改前后用相同参数和数据对比执行计划、P95/P99、CPU、IO及锁指标，并验证写入一致性；不要只凭单次耗时或盲目加索引。

### 200. 一致性哈希的原理、虚拟节点与应用场景是什么？

> 来源：[字节 AI 全栈一面（飞书）](https://www.nowcoder.com/discuss/931555466247700480)

一致性哈希把节点和 key 映射到同一个哈希环，key 顺时针落到第一个节点；增删节点时通常只影响相邻区间，减少整体迁移。实际会为每个物理节点设置多个虚拟节点，使区间更均匀，并可按容量设置权重。工程上还要处理哈希碰撞、节点故障、成员列表一致、数据复制和扩缩容迁移；虚拟节点越多越均匀，但路由表和变更成本也会上升。它适合缓存、分片路由和部分无状态服务，不会自动提供事务一致性，需配合副本、失效策略和监控验证热点与迁移效果。

### 201. HTTP 301 和 302 重定向有什么区别？分别适合什么场景？

> 来源：[度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368)

301 和 302 都是 3xx 重定向，客户端通常会根据 Location 发起新请求。301 表示资源已永久迁移，适合站点或接口长期换地址，搜索引擎和客户端可能缓存或更新目标，因此误配后回滚影响更大。302 表示临时跳转，适合短期维护、登录流程或按条件路由，通常不应让调用方永久替换原地址。实际还要注意方法处理：历史客户端可能把 POST 重写为 GET；若需明确保持方法和请求体，应评估 307/308。服务端应避免重定向循环，控制缓存策略，并验证认证信息、跨域、幂等性及客户端兼容性。

### 202. Redis 分布式锁如何实现？有哪些安全性和可靠性问题？

> 来源：[字节广告团队agent面经（一二面）](https://www.nowcoder.com/discuss/930870582843805696)；[浙江未讯科技](https://www.nowcoder.com/feed/main/detail/b6822699408a4ab1906c32a1e0fc7517)；本轮追问：分布式场景下，本地锁限制并发为什么会失效？ / 为什么永不过期的热点 key 方案相比分布式锁，有更低的一致性风险？（[恒生电子技术岗ai面](https://www.nowcoder.com/feed/main/detail/49a60657cf63400897542e731c3feae4)）；[9.24 普通の快手一面（发券）](https://www.nowcoder.com/feed/main/detail/02dac811205448be9c3b0f146dd68f8b)；[记录最爽，不折腰的一次面试：小红书秋招一面](https://www.nowcoder.com/feed/main/detail/bebc8a5d22d141d09efc4e0a74031365)；[智加 自动驾驶软件工程师](https://www.nowcoder.com/feed/main/detail/26812880d26248e5a34b4358902509e8)；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)

常见实现是给锁设置随机值，用 `SET key value NX PX ttl` 原子抢锁；释放时必须用 Lua 脚本校验 value 仍属于当前客户端后再删除，不能直接 `DEL`。续租要有看门狗和超时边界，业务还应具备幂等性。Redis 故障转移、网络分区或客户端暂停可能造成锁过期、重复执行和脑裂，因此不能把它当作绝对互斥保证；关键写入可配合 fencing token，在资源端拒绝旧令牌，并根据一致性要求评估单实例、哨兵或集群方案。


本地锁只在单进程内生效，多进程或多实例仍会并发访问共享资源。若热点 key 用作长期有效的共享状态，可避免锁过期、误删和续租失效带来的一致性问题；但需通过原子更新或版本校验处理显式失效与数据新鲜度。

**追问补充**：分布式锁也可通过数据库唯一约束、条件更新或协调服务实现；选择前先明确故障模型。无论用哪种租约，过期后的旧持有者仍可能继续执行，资源端应配合版本或 fencing 校验，业务还需幂等。参见 [Redis 分布式锁文档](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)。

**追问补充**：例如库存扣减可拆为“校验库存—扣减—记录流水”，仅靠多条命令会被并发交错破坏。GET后再SET存在竞态，SET NX以原子方式完成“不存在才写入”；业务超时后应停止提交或用fencing token拒绝旧请求，并依靠幂等重试和补偿收敛。




### 203. 支付接口如何设计幂等性？

> 来源：[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)；[9.14小红书 PE（产品工程师/全栈方向--实习）二面 (流程泡到9.21挂)](https://www.nowcoder.com/discuss/929891805049421824)；[同花顺一面 10.9](https://www.nowcoder.com/feed/main/detail/9bcb709926ff4fbdb522179049d5b6da)；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)；[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)

以业务请求生成唯一幂等键，服务端在持久化层建立唯一约束，并记录处理中、成功、失败及响应摘要；重复请求返回同一业务结果，处理中则查询或等待，不能仅靠内存锁。扣款、订单状态变更等外部调用还要使用幂等号、状态机和可重试策略，处理超时但实际成功的未知状态。数据库写入与幂等记录应保证原子性，必要时用事务、消息表或可靠事件投递。 “先删除再创建”通常不合理，会产生短暂不存在、并发覆盖、历史丢失和重试失效；应先按业务键查询并基于版本或状态条件更新，只有明确要求替换且具备事务保护时才考虑删除重建。

### 204. 支付订单超时自动取消如何设计？

> 来源：[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)

为订单保存创建时间、过期时间和可取消状态，由延迟队列、时间轮或定时扫描触发取消；触发时必须执行带条件的原子更新，例如仅允许“待支付”转为“已取消”，避免覆盖已支付、已关闭等状态。支付回调与超时任务并发时依赖数据库条件更新、版本号或状态机竞争，谁先成功谁生效；回调还应可重试且幂等。延迟消息可能重复、丢失或提前/延后，因此要有扫描补偿、监控和告警。取消后若支付已发生，应走对账和退款流程，不能简单删除订单。

### 205. TCP 的流量控制和滑动窗口是怎样的？

> 来源：[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)；[【面经】字节/AI 应用工程师 一面挂经……](https://www.nowcoder.com/discuss/933023499399024640)

TCP 通过接收端通告窗口实现流量控制，发送端未确认的数据量不能超过接收窗口；滑动窗口则允许多个报文段连续发送，收到 ACK 后窗口向前滑动，提高链路利用率。实际发送量通常受接收窗口和拥塞窗口共同限制，取两者较小值。接收方缓冲区变小会通告更小窗口，甚至出现零窗口，发送方需等待窗口更新；丢包或超时会触发重传，并可能收缩拥塞窗口。窗口扩大能提高吞吐，但会增加缓存、乱序和拥塞风险。排查时结合抓包查看 Seq、Ack、Window、重传及 RTT，区分接收端受限、网络拥塞和应用读取缓慢。

### 206. 分库分表的原理、路由策略与常见问题是什么？

> 来源：[美团ai全栈一面](https://www.nowcoder.com/feed/main/detail/a5b8c6571f94441a8af10cd6af07ac3a)；[阿里云 ai应用开发 一面](https://www.nowcoder.com/feed/main/detail/7e27cf4dedb142d9b643471ba31276ed)

分库分表是按分片键把数据路由到不同数据库或物理表，分库解决容量、连接数和写入压力，分表解决单表过大及索引效率问题。路由可按用户、商品等业务键做哈希、范围或一致性哈希，但必须处理热点、扩容迁移和无分片键查询。跨分片事务、排序分页、聚合、唯一约束会变复杂，通常用本地事务加消息最终一致、汇总表或搜索系统承接。没有固定数据量阈值，应结合单表大小、QPS、增长速度和运维能力压测决定；设计时还要保证分片键稳定、ID全局唯一、写入幂等，并准备双写校验、校验和及回滚方案。

### 207. 关系型数据库与非关系型数据库有什么区别？如何根据场景选型？

> 来源：[淘天AI应用开发二面](https://www.nowcoder.com/feed/main/detail/d5d1f688dae5496abbce783aa28d6731)；[字节 Agent 秋招一面](https://www.nowcoder.com/discuss/929731481189044224)；[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)

关系型数据库以表、主外键和 SQL 组织数据，通常强调事务、一致性与复杂关联查询；非关系型数据库包括键值、文档、列式和图数据库，常用灵活结构或分布式扩展换取特定访问模式下的性能。选型先看数据关系、读写模式、一致性、查询复杂度、规模、可运维性和团队经验，而不是简单按性能二选一。订单扣款等强事务场景偏向关系型；缓存、海量日志、文档聚合或图关系可考虑非关系型。还要验证备份恢复、故障切换、热点、分片、幂等和数据迁移成本；必要时采用多存储，但必须明确唯一事实源，避免跨库一致性失控。

**追问补充**：行情和资金曲线通常是按时间范围聚合、扫描大量记录，ClickHouse 的列式存储和分析执行更匹配；关系数据若需多跳关系遍历，Neo4j 的图模型更直接。Redis 偏内存键值访问，持久化、复杂查询、海量历史数据和多条件分析并非强项，因此不能替代这类存储。



### 208. Linux 常用命令有哪些？如何查看和排查进程状态？

> 来源：[9.18 虾皮shopee chatbot研发实习一面凉经](https://www.nowcoder.com/feed/main/detail/9f02a7f8009d4aca9fc730a18b9f96cc)；[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)；[移动卓望AI面10.17](https://www.nowcoder.com/feed/main/detail/2dcc16b1678d42beac2c7f5270f6ff0c)；[10.14 字节跳动 AI全栈开发实习一面](https://www.nowcoder.com/feed/main/detail/27b05099955e43d5a6a66013a2dea2c6)

常用命令可按目的记：文件与目录用 ls、find、du、df，文本处理用 grep、awk、sed，网络用 ss、curl，日志用 journalctl。排查进程先用 ps aux 或 pgrep 查看 PID、状态、CPU、内存和启动命令，再用 top/htop、pidstat 观察变化，lsof 查文件与端口，strace 查系统调用。遇到异常要区分 CPU、内存、I/O、锁等待和僵尸进程，并结合 dmesg、服务日志确认原因；kill 应先温和终止，避免直接 -9 留下数据或锁未清理。

**追问补充**：实时追日志可用 tail -F 文件名，文件轮转时仍能继续跟踪；systemd 服务可用 journalctl -f -u 服务名，配合 grep 过滤关键词。CPU 和内存可用 top/htop 观察实时占用，free -h 查看内存概况，vmstat 观察运行队列、换页和 I/O，必要时结合 pidstat 定位具体进程。



### 209. Java 多线程模型、线程生命周期与并发机制是什么？

> 来源：[顺丰线下面（成都）ai开发工程师](https://www.nowcoder.com/feed/main/detail/f78bce27d42f44e096061f183350f3c2)；本轮追问：你说主线程与子线程有关联，这种关联具体体现在哪里？（[携程AI应用开发实习一面（OC）](https://www.nowcoder.com/discuss/933058120102739968)）

Java线程通常由 Thread 承载任务，由 JVM 调度到底层操作系统线程；生命周期包括 NEW、RUNNABLE、BLOCKED、WAITING、TIMED_WAITING 和 TERMINATED。创建可直接继承 Thread，但工程上常用 Runnable、Callable 配合 ExecutorService 线程池，避免频繁创建线程。synchronized、Lock 和原子类分别用于互斥、可控锁管理及无锁原子更新，volatile只保证可见性与部分有序性，不保证复合操作原子性。排查并发问题要关注死锁、饥饿、线程泄漏、队列堆积和上下文切换，并通过线程转储、监控与压力测试验证；线程池大小需按CPU密集或IO密集、任务耗时和下游承载能力设置，关闭线程池和处理中断也不能遗漏。


主线程与子线程没有天然的父子生命周期绑定；主线程结束不等于子线程结束。非守护子线程仍可阻止JVM退出，守护线程则不会；需要等待结果时用join、Future或结构化的任务管理，并处理中断。
### 210. MySQL 与 Doris 的定位差异及选型依据是什么？

> 来源：[搜狐畅游 Agent 开发一面（已oc）](https://www.nowcoder.com/feed/main/detail/f0648c2e373f4f03a10dd0fffbd235cd)；本轮追问：存储介质为什么用 Doris，不用 Hive 或 ES？Doris 的优势在哪里？如何做技术选型？（[(秋招) 9.16 字节中交广 - 交易与广告业务 - AI全栈开发工程师](https://www.nowcoder.com/discuss/932587389027962880)）

MySQL 更适合在线事务处理，强调行级增删改、事务一致性、索引查询和高并发小请求；Doris 更适合分析型场景，面向明细或聚合查询，通常通过列式存储、向量化执行和分布式计算提升扫描分析效率。选型应看访问模式、数据规模与增长、延迟目标、写入更新比例、JOIN 和聚合复杂度、事务需求、运维能力及成本。常见做法是 MySQL 承载核心业务事实，Doris 通过同步或批流一体链路承载报表分析，而不是把两者简单当作互相替代。需验证真实 SQL、并发、数据新鲜度、故障恢复和资源隔离；同步延迟、重复写入、跨库一致性和复杂事务都是边界。


Hive 更适合低成本离线批处理和数仓底座，ES 更适合全文检索与倒排查询；Doris 侧重高并发、低延迟的交互式 OLAP。选型需用真实查询、写入、更新、数据新鲜度、聚合复杂度和运维成本压测验证，避免按产品名片面决策。
### 211. Java ThreadLocal 的作用、实现原理与使用注意事项是什么？

> 来源：[携程 AI 应用开发一面（已oc）](https://www.nowcoder.com/feed/main/detail/2b1c35eace4a4bb3bd88ee669f163793)；[阿里云一面](https://www.nowcoder.com/feed/main/detail/ceade00d742046d0bef6bee7fe7a7aad)；[恒生电子AI应用开发（杭州）一面面经](https://www.nowcoder.com/feed/main/detail/f674f0f958c644629f024f95c7c104b6)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)

ThreadLocal 为每个线程保存独立变量，常用于请求上下文、事务标记等：通过 ThreadLocal.withInitial、set、get、remove 操作。其数据实际挂在线程对象的 ThreadLocalMap 中，以 ThreadLocal 实例为弱引用键、值为强引用；线程池线程长期复用时，任务结束必须在 finally 中 remove，避免上下文串用和过期值占用内存。它不等于线程安全共享，也不适合跨线程传递；异步场景应显式传参或使用经过验证的上下文传播方案，并测试异常、嵌套调用和线程池复用。

**追问补充**：可在任务提交入口统一使用 try/finally 清理；异步上下文传播可采用 Spring 的 TaskDecorator，或使用 TransmittableThreadLocal 等方案，但必须配置任务结束后的清理，避免把调用线程上下文和线程池线程状态长期绑定。 装饰器入口见 [Spring Task Execution](https://docs.spring.io/spring-framework/reference/integration/scheduling.html)。



### 212. Java 中如何在线程或异步任务之间传递上下文？ThreadLocal、InheritableThreadLocal 与线程池场景有什么区别？

> 来源：[携程 AI 应用开发一面（已oc）](https://www.nowcoder.com/feed/main/detail/2b1c35eace4a4bb3bd88ee669f163793)；[恒生电子AI应用开发（杭州）一面面经](https://www.nowcoder.com/feed/main/detail/f674f0f958c644629f024f95c7c104b6)

ThreadLocal 默认只在线程内可见。InheritableThreadLocal 在线程创建时把父线程值复制或传递给新线程，但不是持续同步；在线程池中，工作线程通常只创建一次，后续任务会继续看到创建时的旧上下文，导致租户、用户或链路信息串用。应在任务提交或执行边界显式捕获、设置并 finally 清理上下文，明确复制是快照还是共享对象，并验证拒绝执行、异常、嵌套异步和取消路径。不要把可变对象直接跨线程共享；必要时采用经过审计的上下文传播组件。

### 213. 什么是覆盖索引？它为什么能避免回表，使用时有哪些限制？

> 来源：[携程 AI 应用开发一面（已oc）](https://www.nowcoder.com/feed/main/detail/2b1c35eace4a4bb3bd88ee669f163793)；本轮追问：联合索引 (A, B, C)，假设WHERE条件已经满足要求，SELECT后面写什么可以不回表？（[携程AI应用开发实习一面（OC）](https://www.nowcoder.com/discuss/933058120102739968)）；本轮追问：联合索引在减少回表方面是如何发挥作用的？（[9.20 汇川技术 数字化全栈工程师 一面](https://www.nowcoder.com/feed/main/detail/28032c48a90c4f69827704deb3fae34c)）；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)

覆盖索引是指查询所需的过滤、排序及返回列都包含在同一个索引中，存储引擎可直接从索引记录返回结果，通常无需按主键再访问聚簇数据行，即避免回表。组合索引 ABC 能否覆盖，不要求查询列一定连续或符合最左前缀；只要 SELECT 等所需列都在 A、B、C 中即可覆盖，但谓词能否高效定位仍受最左前缀、等值和范围条件影响。索引过宽会增加写放大和空间，需用执行计划、实际数据分布及回表统计验证；SELECT * 通常难以覆盖。

**追问补充**：联合索引应将过滤、排序所需列置于合适前缀，并把返回的 id、amount 作为覆盖列纳入索引；若 id 是聚簇主键，二级索引中通常已隐含它。列越多索引越宽，需权衡回表收益、存储和写入维护成本。



### 214. WHERE 条件的书写顺序会影响组合索引的使用吗？为什么？

> 来源：[携程 AI 应用开发一面（已oc）](https://www.nowcoder.com/feed/main/detail/2b1c35eace4a4bb3bd88ee669f163793)；[携程AI应用开发实习一面（OC）](https://www.nowcoder.com/discuss/933058120102739968)；本轮追问：创建联合索引时字段的放置顺序，会不会影响查询效率？为什么？ / 如果有一个联合索引abc，查询条件是b等于1 and c等于2，这个查询能用到这个联合索引吗？ / 联合索引在B+树中存储时，是按照什么规则来组织键值顺序，从而支撑最左匹配特性的？（[27秋招-恒生电子AI面试-AI应用开发岗-26.9.23](https://www.nowcoder.com/feed/main/detail/724b6bc0f02b42e58ff7397be51df3b5)）；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)

优化器通常会把 WHERE 条件按索引访问规则分析，因此书写顺序一般不决定组合索引能否使用。B、C 都缺少 A 时，普通 B+Tree 组合索引通常不能按最左前缀高效定位，只能考虑其他索引或扫描；不要仅凭 SQL 文本顺序判断。只有 A、C 时可利用 A 定位，C 因缺少中间列通常不能作为连续索引查找条件，可能通过索引条件下推或过滤参与，是否回表取决于返回列是否被索引覆盖。A 为范围条件后，后续列的定位能力也会受限；应结合 EXPLAIN、实际基数和数据分布选择索引。


联合索引按元组键的字典序组织：先比较首列，首列相同时再比较下一列，以此类推。因此只有连续满足左侧列时才能在树上缩小查找范围，跳过前列后无法直接按后列定位。

**追问补充**：该查询可建联合索引（订单列、状态列、createdat），先用前两列等值定位，再按 createdat 的索引顺序取最新若干行；同一排序方向通常可反向扫描，不必强制写 DESC，混合方向才需结合索引定义和 EXPLAIN 验证。


### 215. MQ、线程池加 HTTP/RPC 等异步方案有什么区别？如何进行技术选型？

> 来源：[携程 AI 应用开发一面（已oc）](https://www.nowcoder.com/feed/main/detail/2b1c35eace4a4bb3bd88ee669f163793)；[携程AI应用开发实习一面（OC）](https://www.nowcoder.com/discuss/933058120102739968)

子线程加 HTTP/RPC 适合服务内或服务间的低延迟一次调用：任务通常随进程生命周期管理，失败、重试、限流和结果回传由业务负责。MQ 通过 broker 持久化和缓冲消息，发送方与消费方解耦，适合削峰、跨服务异步和可重放处理，但会引入消息重复、延迟、顺序、积压及运维成本。选型先看是否允许丢失、延迟上限、流量突发、消费时长和故障隔离；必须设计幂等、超时、重试退避、死信、监控和容量压测。不要仅因“异步”就上 MQ，简单短任务可用线程池，跨进程且需可靠投递时再选 MQ。

### 216. MySQL 索引从逻辑角度有哪些类型？

> 来源：[字节跳动 AI Agent研发工程师｜AI算力基础设施 27秋招面经](https://www.nowcoder.com/discuss/930155293864914944)；[10.14 字节跳动 AI全栈开发实习一面](https://www.nowcoder.com/feed/main/detail/27b05099955e43d5a6a66013a2dea2c6)

从逻辑用途看，MySQL 索引通常包括普通索引、唯一索引、主键索引、全文索引和空间索引；普通索引只用于加速检索，唯一索引额外约束非空值不重复，主键索引要求非空且唯一。一个索引还可以是单列或联合索引，这属于列组织形式，不是独立的逻辑类别。实际选型要结合查询条件、排序、唯一性约束和写入成本，不能只按索引数量判断性能。

**追问补充**：以 InnoDB 为例，索引主要基于 B+Tree：叶子节点有序并通过链表连接，适合等值、范围和排序；主键索引是聚簇结构，二级索引叶子保存索引列及主键值，回表会增加成本。联合索引遵循最左匹配，选择性、树高和维护成本共同影响收益。



### 217. MySQL 唯一索引允许多个 NULL 吗？为什么？

> 来源：[字节跳动 AI Agent研发工程师｜AI算力基础设施 27秋招面经](https://www.nowcoder.com/discuss/930155293864914944)

通常允许在唯一索引中插入多个 NULL。原因是唯一性主要约束非 NULL 值，而 NULL 表示未知或缺失，数据库不会把多个 NULL 当作相同的普通值进行重复校验。联合唯一索引还要分析各列组合：只要组合中存在 NULL，往往可能出现多行；若业务要求最多一个缺失值，应使用非空约束、默认值或显式的业务校验，并通过并发测试确认实际行为。

### 218. 继承与组合有什么区别？实际开发中如何选择？

> 来源：[脑利一面](https://www.nowcoder.com/feed/main/detail/4002450a24194b4eaa759a2450cab7f5)；[ai面试](https://www.nowcoder.com/feed/main/detail/9042487b33c54921982d86614598d7ae)

继承表达“是一个”，子类复用父类实现并获得多态能力，但会形成较强耦合，父类变化可能影响所有子类，还必须满足可替换性。组合表达“拥有一个”，通过成员对象委托功能，边界更清晰、替换和测试更容易。若确实存在稳定的类型层次且需要统一多态接口，可考虑继承；若只是复用代码或行为可替换，通常优先组合。

**追问补充**：可将 Person 作为稳定基类，仅放姓名、身份等共同属性和行为；Student、Teacher 分别扩展学习或授课职责。若教师兼学生，优先组合角色对象，或明确多重继承的初始化与方法冲突，避免把偶然共性塞进基类。



### 219. 服务部署上线后如何系统化排查问题？

> 来源：[9.17 润科通用一面](https://www.nowcoder.com/feed/main/detail/f426a93495c34fd7a66a91d1e59bf2e7)；本轮追问：训练完成后是否做过模型部署和测试？遇到过哪些问题？（[9.22 阿里千问二面](https://www.nowcoder.com/feed/main/detail/5ff7b7fde8bc49eb960d5badde3ac623)）；[9.24 普通の快手一面（发券）](https://www.nowcoder.com/feed/main/detail/02dac811205448be9c3b0f146dd68f8b)

先确认影响范围和现象，保留请求错误率、延迟、日志、链路追踪及主机资源等证据，再按时间线对比最近发布、配置、流量和依赖变化。通过健康检查、单接口复现、依赖连通性和数据库慢查询定位故障边界；优先止损，如回滚、摘流或降级，并保护数据避免重复写入。修复后做回归、并发和故障恢复验证，最后补充监控、告警、幂等与复盘项。


模型部署还需验证训练与推理的预处理、特征和后处理一致性，检查模型加载、算子兼容、显存、吞吐与超时。用离线集、接口回归和并发压测对比离线结果；常见问题包括精度漂移、冷启动慢、显存不足和批处理导致延迟升高。

**追问补充**：主站故障先按 DNS/CDN、网关、应用、数据库和第三方依赖分层，结合监控时间线、错误码、日志和链路追踪确认影响范围；恢复时优先摘流、回滚或切备用依赖。是否影响团队应以实际告警、请求失败率和用户反馈为证据，不能凭空归因。


### 220. 常见设计模式有哪些？分别解决什么问题？

> 来源：[9.17 润科通用一面](https://www.nowcoder.com/feed/main/detail/f426a93495c34fd7a66a91d1e59bf2e7)；[27秋招-恒生电子AI面试-AI应用开发岗-26.9.23](https://www.nowcoder.com/feed/main/detail/724b6bc0f02b42e58ff7397be51df3b5)

常见设计模式可按问题分类：创建型如工厂、建造者，解决对象创建复杂或需要解耦；结构型如适配器、装饰器、代理，解决接口兼容、功能扩展和访问控制；行为型如策略、观察者、模板方法、责任链，解决算法替换、事件通知、流程复用等。选型不能只看模式名称，应结合变化点、对象生命周期、并发与可测试性，避免为简单逻辑引入过多抽象。

### 221. 模板方法模式是什么？如何实现？

> 来源：[9.17 润科通用一面](https://www.nowcoder.com/feed/main/detail/f426a93495c34fd7a66a91d1e59bf2e7)

模板方法模式把稳定的业务流程放在基类或公共组件中，将可变步骤定义为抽象方法或钩子，由子类实现差异逻辑。例如统一处理校验、执行、记录和清理。实现时要控制继承层级，优先通过组合或策略注入变化点；钩子应有明确默认行为，避免子类破坏流程顺序。还要关注异常、资源释放和幂等，测试公共流程及各个扩展点。

### 222. 数据库数据量多大算大？如何判断数据规模是否需要专项优化？

> 来源：[9.17 润科通用一面](https://www.nowcoder.com/feed/main/detail/f426a93495c34fd7a66a91d1e59bf2e7)；本轮追问：对于几亿、几十亿规模的数据量，你在处理过程中遇到过什么问题？如何解决？（[(秋招) 9.16 字节中交广 - 交易与广告业务 - AI全栈开发工程师](https://www.nowcoder.com/discuss/932587389027962880)）

数据库没有统一的“大数据量”阈值，不能只看表的行数或磁盘大小。应结合查询延迟、并发、索引命中率、写入吞吐、锁等待、备份恢复时间、增长速度以及单表和单分区热点判断。当慢查询、维护窗口、容量余量或恢复目标无法满足时，才需要专项优化。优化前先用监控和执行计划定位，再选择索引、归档、分区、读写分离或分库分表，并验证收益与一致性代价。


几亿到几十亿时，常见问题是索引膨胀、深分页变慢、写入与查询争用及备份恢复过久；可按时间或业务键分区归档，改游标分页，拆分热点读写，并用执行计划、压测和恢复演练验证。
### 223. 正文缓存与权限校验如何协同设计，才能避免返回已无权访问的缓存内容？

> 来源：[9.14小红书 PE（产品工程师/全栈方向--实习）二面 (流程泡到9.21挂)](https://www.nowcoder.com/discuss/929891805049421824)

权限校验必须先于返回正文，缓存不能替代鉴权。公开内容可使用统一缓存键；私有内容应将稳定的资源标识与租户、用户或权限版本隔离，或只缓存正文、每次请求单独校验权限。权限撤销时要通过删除缓存、版本号或较短有效期降低旧内容暴露窗口，并采用默认拒绝和鉴权服务失败即不返回正文。还需防止缓存穿透、越权键构造、并发击穿及日志泄露，发布前用跨租户和权限变更用例验证。

### 224. 多线程环境下如何保证线程安全？

> 来源：[拼多多AI Agent一面，双机位，全程严肃](https://www.nowcoder.com/feed/main/detail/3cb8b70b192f4051b3c19ace4dda1beb)；[同花顺一面 10.9](https://www.nowcoder.com/feed/main/detail/9bcb709926ff4fbdb522179049d5b6da)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)

线程安全不是简单地“加锁”，而是先识别共享可变状态，再选择互斥锁、读写锁、原子操作、不可变对象或消息传递。锁要覆盖完整不变量，避免锁顺序不一致、长事务、锁泄漏和过度竞争；原子操作也不能自动保证多步逻辑安全。排查应结合代码审查、并发测试、竞态检测、超时与线程转储，验证正确性、吞吐、延迟和故障恢复。无锁方案通常更复杂，数据库或缓存还要额外考虑事务、隔离级别及幂等。

**追问补充**：HashMap 旧实现扩容时并发头插可能让两个线程改写 next，形成环，get 可能死循环；可选 ConcurrentHashMap、同步包装或不可变 Map。ConcurrentHashMap 通过 volatile 读、CAS、桶级锁或节点同步和扩容协作实现并发访问，但复合业务操作仍需原子 API 或外部锁。



### 225. 如何设计多容器部署方案？容器之间如何通信、编排和管理？

> 来源：[cherrystudio面试](https://www.nowcoder.com/feed/main/detail/84ecd256fe4d4a1597a0f29f18f853fb)；[顺丰科技27届AI开发工程师 一面面经](https://www.nowcoder.com/feed/main/detail/463a64c7df7e4efaac8c6ad32648b454)

多容器部署应按职责拆分服务，例如网关、应用、任务 worker、数据库和缓存，并通过编排工具定义网络、配置、密钥、健康检查、资源限制和滚动更新。容器间通常使用服务发现和内部网络通信，不应依赖固定 IP；持久数据必须使用外部存储或可靠卷。生产设计还要处理启动顺序不等于就绪、重启风暴、日志与指标、优雅下线、镜像安全和版本回滚。验证重点是故障注入、扩缩容、数据恢复及跨服务超时、重试和幂等。

**追问补充**：以 Docker 为例，先用 Dockerfile 固化应用依赖并构建带版本的镜像，再用 Docker Compose 或编排平台声明多个服务、网络、环境变量、密钥、卷和健康检查；服务通过 Compose 服务名通信，发布时采用镜像版本切换并保留回滚版本。



### 226. 文件上传任务队列如何设计？

> 来源：[cherrystudio面试](https://www.nowcoder.com/feed/main/detail/84ecd256fe4d4a1597a0f29f18f853fb)；本轮追问：DB 队列具体如何设计和执行？（[9.15科大讯飞AI应用一面](https://www.nowcoder.com/feed/main/detail/aece93373f9c47ea95c831aef6471886)）

通常由上传接口负责鉴权、校验元数据并生成幂等任务，再把文件放入对象存储、任务写入消息队列，由Worker异步完成校验、病毒扫描、转码或入库。任务应采用可持久化状态机，支持超时重试、退避、死信和进度查询；用文件哈希、任务ID及数据库唯一约束避免重复处理。生产中还要限制大小、类型、配额和权限，避免路径穿越及恶意文件。排查应结合队列积压、消费延迟、失败原因和对象存储状态，并处理数据库与消息发送不一致问题。


DB 队列可建任务表，包含任务ID、文件ID、状态、重试次数、下一次执行时间、租约截止时间和错误信息，并以唯一业务键保证幂等。Worker 用事务按状态和时间筛选任务，结合行锁或乐观锁原子抢占并写入租约；处理成功更新完成，失败递增重试并退避，超限转死信，定时任务回收过期租约。
### 227. Spring Bean 的生命周期有哪些阶段？各阶段涉及哪些扩展点？

> 来源：[浙江未讯科技](https://www.nowcoder.com/feed/main/detail/b6822699408a4ab1906c32a1e0fc7517)；[迅雷 Agent一面](https://www.nowcoder.com/discuss/932392798559432704)

Spring Bean 通常经历实例化、属性注入、Aware 回调、BeanPostProcessor 前置处理、初始化、后置处理和销毁。初始化阶段可用 @PostConstruct、InitializingBean 或 init-method；后置处理器还可包装代理。原型 Bean 默认由容器创建但不负责完整销毁。实际排查应结合日志、依赖关系和代理类型确认顺序，并避免在构造器中依赖尚未注入的 Bean。

### 228. 如何防御 XSS 和中间人攻击，保护用户信息传输安全？

> 来源：[cvte应用软件开发一面](https://www.nowcoder.com/feed/main/detail/c2155d2308de452c8a6e3cf2bbb482f3)；[移动卓望AI面10.17](https://www.nowcoder.com/feed/main/detail/2dcc16b1678d42beac2c7f5270f6ff0c)

防 XSS 应按输出上下文做 HTML、属性、URL 或 JavaScript 编码，输入校验只能辅助，并配置 CSP；Cookie 设置 HttpOnly、Secure、SameSite，避免把敏感信息放入页面。防中间人攻击应全链路使用 HTTPS，正确校验证书和主机名，启用 HSTS，禁止忽略证书错误，并安全管理密钥。排查时检查混合内容、代理终止 TLS、日志和敏感数据泄露；还需配合 CSRF 防护，不能把“加密”当作授权。

**追问补充**：XSS 是攻击者将恶意脚本注入页面并在受害者浏览器执行，常见分为持久型（存储型）、反射型和 DOM 型。排查时分别检查服务端持久化与回显点、参数反射链路，以及前端对 URL、HTML 或 DOM API 的不安全拼接。



### 229. 高频数据访问场景下，如何通过缓存、索引、批量化和并发控制进行优化？

> 来源：[cvte应用软件开发一面](https://www.nowcoder.com/feed/main/detail/c2155d2308de452c8a6e3cf2bbb482f3)；本轮追问：有没有考虑过不用倒排索引，选择其他方案进行优化？比如通过业务分析或者数据分析？ / 现在有一个场景，对几十亿数据进行筛选和过滤，但是加索引之后效果还是不好，这个时候你会怎么优化整个链路？底表数据量可能上千亿，加索引查询后仍然有几亿条数据返回。（[(秋招) 9.16 字节中交广 - 交易与广告业务 - AI全栈开发工程师](https://www.nowcoder.com/discuss/932587389027962880)）；[10.10 无锡赫玛科技](https://www.nowcoder.com/feed/main/detail/24a0ee8b5d2c4d65aaf5fc1e18bfcc23)

可先用监控确认热点、命中率、慢查询和锁等待，再组合优化：热点读采用旁路缓存并设计 TTL、失效和穿透/击穿/雪崩保护；数据库按查询条件建合适索引，用 EXPLAIN 验证，避免低选择性或冗余索引；批量读写、分页和合并请求减少往返。并发场景控制连接池、限流和锁粒度，必要时用 singleflight 防重复回源。需明确缓存一致性、容量、淘汰和降级策略，压测验证而非只看平均延迟。


不必默认倒排索引：先按业务拆分高频条件，建立宽表、物化结果或位图/布隆过滤等摘要。几十亿乃至千亿筛选应使用分区裁剪、列式存储和谓词下推，先缩小候选集再分层查询，禁止把几亿结果回传应用层，并以扫描量、峰值内存和端到端耗时验证。

**追问补充**：40万规模可采用关系型数据库，按高频过滤、排序和唯一键建联合索引，更新用分批事务、临时表校验后切换，避免长事务；读多写少可用 MVCC，通常无需全表锁，仅对冲突行加行锁。Redis缓存热点查询结果，采用版本号或更新时间校验、TTL、互斥回源，批量更新后按影响范围失效并保留数据库降级路径。


### 230. 高并发抢票系统如何设计？如何防止超卖并保证库存一致性？

> 来源：[智谱ai native builder实习一面](https://www.nowcoder.com/discuss/929419257438302208)；[秋招第二挂 小红书](https://www.nowcoder.com/feed/main/detail/90c05c87e0414708976ab28b20a51d36)；[启元机器人 机器人软件平台开发](https://www.nowcoder.com/feed/main/detail/c01e635722d14d30b075667f721e56ff)

先限流和排队，避免所有请求直接冲击库存服务；库存扣减必须由单一权威存储原子完成，例如数据库条件更新“库存大于 0”或具备原子扣减语义的缓存，并以订单库最终确认。扣减、下单、支付应拆分状态机，使用请求号和订单号幂等，超时关闭订单并回补库存。缓存只能做削峰或预扣，不能脱离持久化校验；还要处理重复请求、消息重试、服务宕机和缓存与数据库不一致。通过压测、并发竞态测试、库存对账和故障演练验证“不超卖、不少卖”及恢复能力。

**追问补充**：可按库存桶分散原子扣减负载，但要保证各桶配额总和不超权威库存，并记录可恢复的预扣流水；订单库最终确认成功后再结算。幂等、超时释放与对账必须针对同一订单状态机，不能将未持久化的缓存流水当作最终订单事实。

Lua 脚本把“读取库存、判断大于零、扣减并记录结果”等步骤放在 Redis 内一次执行，避免客户端多次往返和并发交错；但仍需处理脚本超时、主从切换及与订单库的最终一致性，并用竞态压测验证。

**追问补充**：固定初始库存并构造并发、重复和超时请求，记录请求号、订单状态与库存流水。断言有效订单扣减不超过可售库存、同一幂等请求不会重复扣减，限购数量按实际业务规则校验。注入消息重复、服务宕机和缓存故障后，对账订单与库存，检查尾延迟和未释放预扣量。





### 231. Java 和 Go 在后端服务开发中的核心差异是什么？

> 来源：[字节跳动Agent开发1面凉经](https://www.nowcoder.com/discuss/929406267141914624)

Java 依托 JVM、成熟生态和 JIT，适合复杂企业系统；线程、线程池和锁等并发抽象较丰富，但运行时和内存占用通常更重。Go 编译为原生程序，语法和部署更简洁，以 goroutine、channel 及 sync 原语提供轻量并发，适合网络服务和云原生场景。两者都支持静态类型和垃圾回收，但 Go 更强调显式错误处理，Java 生态与框架体系通常更完善。选型不能只看语言性能，应结合团队经验、依赖生态、延迟目标、可观测性、故障排查和招聘维护成本；并发优势仍需通过真实负载压测验证。

### 232. Go 内存模型中的可见性、内存顺序与 happens-before 规则是什么？

> 来源：[字节跳动Agent开发1面凉经](https://www.nowcoder.com/discuss/929406267141914624)

Go 内存模型关注一个 goroutine 对内存的写入何时能被另一个 goroutine 可靠观察。仅靠普通变量并发读写会产生数据竞争，结果不应依赖；需要用 mutex、channel、WaitGroup 或 sync/atomic 建立同步关系。同步操作会形成 happens-before：例如解锁先于后续加锁成功，channel 发送先于对应接收完成，goroutine 结束也可通过 WaitGroup 等待后再观察结果。原子操作还提供规定的顺序语义，但不能替代多个字段组成的不变量保护。应使用 -race 做动态检测，并结合代码审查、压力测试和故障测试；竞态检测不是形式化证明，也覆盖不了所有执行路径。

### 233. 线程之间有哪些通信与同步机制？各自适用什么场景？

> 来源：[字节 aime 一面 9.10](https://www.nowcoder.com/feed/main/detail/ed5e9d17f26e489da94afbf1241b885e)

线程通常通过共享内存中的变量、队列或环形缓冲区传递数据，再用互斥锁、读写锁、信号量、条件变量、屏障和原子操作协调访问。互斥锁适合保护临界区，读写锁适合读多写少，条件变量适合等待状态变化，信号量适合资源计数，原子操作适合简单状态或无锁结构。需关注可见性、竞态、死锁、饥饿和虚假唤醒；排查时结合锁顺序、超时、线程转储和压力测试。

### 234. C++ 中 inline 的作用、实现机制和使用限制是什么？

> 来源：[0921 新紫光一面（算子工程师）](https://www.nowcoder.com/feed/main/detail/3c301f1ae6594998aedb25dcd98b7a1b)；[1009 苏州睿芯一面（算子开发）](https://www.nowcoder.com/feed/main/detail/e364b45f08e24699865b8f19a56f49c4)

inline 首先是语言层面的 ODR 规则：同一函数或变量可在多个翻译单元中定义，只要定义满足一致性要求，链接时视为同一个实体；它并不保证编译器一定内联，是否展开由优化器结合函数大小、调用频率和调试选项决定。适合把短函数定义放入头文件，也可用于 inline 变量；类内定义的成员函数通常隐式 inline。限制包括定义不一致会产生未定义行为，强制内联并不能解决虚调用、函数指针等场景，还可能造成代码膨胀、指令缓存压力和编译变慢。应以优化报告、反汇编及基准测试验证，而不是凭关键字判断收益。

**追问补充**：Makefile 通常不需要为 inline 设置专用开关；应保证头文件定义可见，并按场景配置优化级别，如发布构建启用适当优化，必要时评估 LTO。是否真正内联仍需结合编译器优化报告或反汇编验证。



### 235. HTTP 500、502、503、504 分别表示什么？如何定位这些 5xx 错误？

> 来源：[度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368)；[字节 aime 一面 9.10](https://www.nowcoder.com/feed/main/detail/ed5e9d17f26e489da94afbf1241b885e)；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)

500通常表示服务端执行请求时发生未处理异常；502表示网关或反向代理从上游收到无效响应、连接失败等；503表示服务暂时不可用，常见于过载、维护或无可用实例；504表示网关等待上游响应超时。定位时先按请求链路确定产生状态码的组件，再结合代理、应用、上游服务日志及 traceId，检查连接池、实例健康、超时配置和资源指标。还要区分客户端重试、代理重试与应用实际执行次数；重试只适用于明确幂等的请求，并防止重试风暴。

**追问补充**：常见状态码还包括 200（成功）、201（创建）、204（无内容）、400（请求错误）、401（未认证）、403（无权限）、404（不存在）和 429（请求过多）。429 通常由限流触发，应结合 Retry-After、限流规则和调用方重试策略排查。



### 236. CSS 中 flex: 1 是哪些属性的缩写？分别表示什么？

> 来源：[度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368)

flex: 1 是 flex-grow、flex-shrink、flex-basis 三个属性的简写，通常等价于 flex: 1 1 0%：允许项目按剩余空间放大，也允许收缩，初始主轴尺寸为 0%。它不等同于按内容宽度平分；多个项目还会受到 min-width、min-height、width 等约束，默认 min-width:auto 可能导致文本撑破容器。排查布局时检查主轴方向、容器是否有可用尺寸，以及子项的最小尺寸和溢出规则。

### 237. 限流、熔断、降级分别是什么？有什么区别？

> 来源：[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)

限流是在入口按用户、租户、接口或资源控制请求速率和并发，防止流量压垮系统；熔断是在依赖连续失败、超时或错误率过高时暂时停止调用，快速失败并定期探测恢复；降级是在资源不足或依赖不可用时关闭非核心功能、返回缓存或简化结果。三者关注点不同：限流控流量，熔断隔离故障，降级保核心体验。实现时要明确指标窗口、状态恢复、超时和舱壁隔离，并保证降级结果可识别、写操作幂等；否则可能丢数据、形成重试风暴或把故障隐藏。压测和故障演练应验证边界、恢复及告警。

### 238. 什么是写时复制（Copy-on-Write）？有哪些应用场景？

> 来源：[度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574)；本轮追问：Copy-on-Write 管理具体是怎么设计的？（[阿里虎鲸文娱 - AI 基础设施 - 一面](https://www.nowcoder.com/feed/main/detail/9c2e1794ccc14448a6fc43d596f60f00)）

写时复制（CoW）是让多个主体先共享同一份数据，只有某一方真正写入时，系统才复制将被修改的页或对象，从而延迟并减少复制成本。典型场景包括进程 fork 后共享地址空间、虚拟机或存储快照、不可变字符串与容器优化。它不是“零成本共享”：首次写入会产生缺页、复制和额外延迟，频繁修改可能放大内存占用；并发场景还需另行保证同步，不能把 CoW 当作线程安全机制。排查时应观察脏页、缺页、内存峰值和写入延迟。


具体设计可按页或对象维护共享元数据，并在写入时通过缺页异常或版本检查拦截；写线程复制目标数据、更新映射后再写入。并发下需保证复制与元数据更新的原子性，配合锁或版本校验避免丢写。
### 239. CAS 是什么？ABA 问题如何产生，如何解决？

> 来源：[携程 AI 应用开发一面（已oc）](https://www.nowcoder.com/feed/main/detail/2b1c35eace4a4bb3bd88ee669f163793)；[字节 Agent 日常一面](https://www.nowcoder.com/feed/main/detail/0ee160a2d38f4b5daaf1965cf975a8f0)

CAS（Compare-And-Swap）是原子地比较内存值与期望值，相等才更新为新值，否则失败并由调用方重试，常用于无锁计数器和队列。ABA 问题是值先从 A 改为 B 又改回 A，CAS 只比较当前值时会误认为期间没有变化，常见于指针和无锁结构。解决办法包括给值附加递增版本号或时间戳，使用带标记指针；涉及节点回收时还需配合 hazard pointer、epoch reclamation 等安全回收机制，或直接使用锁。CAS 并不保证整体操作无阻塞：高竞争会导致重试和 CPU 消耗，且要确认内存序、溢出和对象生命周期。验证应覆盖竞争、回收、异常重试和压力下的线性化正确性。

**追问补充**：数据库中通常用版本列实现乐观 CAS：读取数据及 version，更新时执行“WHERE 主键=? AND version=旧值”，同时将 version 加一；受影响行数为 0 表示竞争失败并重读或重试。需在事务中校验结果，避免仅依赖应用层先读后写。



### 240. AQS 是什么？底层同步队列和数据结构如何组织？

> 来源：[携程 AI 应用开发一面（已oc）](https://www.nowcoder.com/feed/main/detail/2b1c35eace4a4bb3bd88ee669f163793)；[携程AI 面试复盘](https://www.nowcoder.com/discuss/932274641865887744)；本轮追问：Java的AQS和CAS分别是什么？（[携程AI应用开发实习一面（OC）](https://www.nowcoder.com/discuss/933058120102739968)）；[字节AI全栈二面](https://www.nowcoder.com/discuss/938145178114592768)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512)

AQS（AbstractQueuedSynchronizer）是 Java 并发工具的基础框架，用一个 volatile state 表示同步状态，并通过 CAS 与队列管理竞争线程。获取失败的线程通常封装为节点，加入基于双向链表的 CLH 风格同步队列，前驱释放或状态变化时通过 unpark 唤醒后继；节点还记录独占/共享模式、等待状态和取消状态。子类只需实现 tryAcquire、tryRelease 等钩子即可构造锁、信号量或倒计时器。AQS 还维护独立的 Condition 等待队列，条件满足后节点再转入同步队列。实现时要处理中断、超时、取消、伪唤醒和内存可见性；公平性、吞吐量与延迟之间存在权衡，不能仅凭队列结构断言严格公平。排查应结合线程栈、state 变化和锁竞争数据验证。


CAS 是基于比较并交换的原子操作：仅当内存值仍等于预期值时才写入新值，否则失败并重试；它常用于 AQS 的 state 更新。AQS 在此基础上负责排队、阻塞和唤醒，CAS 本身不提供线程排队或公平性，且需注意 ABA、自旋开销和内存可见性。

**追问补充**：ReentrantLock 的内部 Sync 继承 AQS：加锁时先在 tryAcquire 中 CAS 将 state 从 0 改为 1 并记录独占线程；同一线程再次获取则递增 state。释放时递减 state，归零后清除 owner，并由 AQS 唤醒队列中的后继线程；获取失败的线程会入队并阻塞，公平实现还会先检查前驱节点。 重入和释放契约见 [ReentrantLock 文档](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)。

**追问补充**：以 Java 的 ReentrantReadWriteLock 为例，其实现利用 AQS 维护读写状态，写锁独占且可重入，读锁支持共享获取。获取、等待与释放要分别检查共享和独占路径，以及公平性、锁降级和线程持有信息；不能把这种具体实现推广为所有读写锁的通用内部结构。




### 241. 实现 LRU 缓存时为什么不直接继承 LinkedHashMap？

> 来源：[脑利一面](https://www.nowcoder.com/feed/main/detail/4002450a24194b4eaa759a2450cab7f5)

LinkedHashMap 适合做基础实现，但直接继承会把缓存策略、并发控制和业务接口耦合在一起。它的 accessOrder 只能提供访问顺序，容量淘汰仍需重写 removeEldestEntry；高并发下还要额外加锁，缓存未命中、加载、过期和统计也不由它解决。工程上通常组合 LinkedHashMap，封装 get/put、容量和淘汰策略，或直接选用成熟缓存组件；排查时重点验证并发安全、热点键、内存占用和淘汰命中率。

### 242. 图片生成与积分扣减业务如何设计数据库表及事务流程？

> 来源：[上海代码一行科技公司 - 9月10日- 一面-秋招](https://www.nowcoder.com/discuss/929791548588294144)

可拆为 generation_order、style、user_credit_account、credit_ledger、generation_task 和 generated_asset。订单记录用户、风格、提示词、参数、积分、状态、幂等键及时间；流水记录扣减/退款、业务单号和唯一约束；任务记录队列状态、重试次数与错误，资产记录对象存储地址和校验信息。创建订单、校验风格、冻结或扣减积分、写流水应放在本地事务中，提交后再投递任务；消费者凭唯一任务号幂等执行，成功出图后更新状态，失败按策略退款。不要把外部生成服务放进数据库事务，需用 outbox、状态机和补偿对账，并校验用户权限、提示词和回调签名。

### 243. 交易流程设计需要重点保证哪些能力？

> 来源：[美团AI Agent一面](https://www.nowcoder.com/feed/main/detail/50bcdc47e7754aa7be59b6318fea514b)

交易流程首先要保证状态机清晰、状态迁移可追踪，并围绕下单、支付、库存、履约和退款定义边界。核心能力包括幂等、防重复扣款、并发下库存与金额一致性、超时重试、异步最终一致性、对账与补偿，以及权限、风控和审计。还要明确失败可恢复、人工介入和数据可观测性，避免只依赖单体事务或客户端状态。

### 244. 操作系统页面置换算法有哪些？分别适用于什么场景？

> 来源：[字节 aime 一面 9.10](https://www.nowcoder.com/feed/main/detail/ed5e9d17f26e489da94afbf1241b885e)；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)

常见算法包括最佳置换 OPT、先进先出 FIFO、最近最少使用 LRU，以及近似 LRU 的时钟算法。OPT 需要预知未来，只用于理论上界和评估；FIFO 实现简单但可能出现 Belady 异常；LRU 利用局部性，适合通用缓存，但维护访问顺序有成本；时钟算法以较低开销近似 LRU，常用于操作系统。实际选择还要结合访问模式、内存压力、实现开销，并通过缺页率、抖动和吞吐验证。

### 245. Spring AI 的核心架构与底层调用机制是什么？

> 来源：[赛诺贝斯 面经 一面过 笔试过 hc无](https://www.nowcoder.com/discuss/930126120177926144)；本轮追问：主流 AI 应用开发框架的核心价值是什么？以 Spring AI 为例，其核心设计巧思、解决的行业痛点、落地适用场景有哪些？ / Spring AI 针对大模型工具调用，核心抽象层的设计原理是什么？如何屏蔽各家大模型的 API 差异？ / Spring AI 在复杂 RAG、多 Agent 场景下存在哪些原生短板？实际落地会踩哪些核心坑？（[27秋招-恒生电子AI面试-AI应用开发岗-26.9.23](https://www.nowcoder.com/feed/main/detail/e7981675c7a44b098d97e90a854f9c3c)）

Spring AI 不是模型本身，而是对不同厂商模型调用的 Java 抽象层：应用可通过 ChatClient/Model API 发起同步或流式请求，并用 Advisors 组织提示词、日志、重试等横切逻辑；Tools、Memory 和 Vector Store 分别连接函数调用、会话状态与检索系统。底层仍由对应 provider 的 SDK 或 HTTP API 完成推理，框架负责适配、消息转换和生命周期编排，具体能力取决于供应商。其架构与组件边界可参考 [Spring AI Reference](https://docs.spring.io/spring-ai/reference/)。生产环境还需自行配置超时、限流、重试、幂等、密钥保护、脱敏和可观测性，并验证流式中断、供应商错误及检索数据质量。

## 近期新增：2026-09-29 面经补充


这类框架的价值在于统一消息、工具、记忆和模型适配接口，降低接入与切换成本，适合企业问答、工作流和轻量 Agent。复杂 RAG 中仍需自行处理查询改写、混合检索、引用校验和上下文预算；多 Agent 的状态共享、并发编排、循环终止、权限隔离与故障恢复也不是原生完整解决方案，落地前应做链路压测和失败回放。
### 246. 数据库表结构变更与新增表时如何设计平滑演进？

> 来源：[【面经】字节/AI 应用工程师 一面挂经……](https://www.nowcoder.com/discuss/933023499399024640)

采用“扩展—迁移—收缩”的兼容演进。先新增可空字段、索引或新表，代码同时兼容旧旧结构；发布双写或通过事务消息、Outbox 保证新表同步，再分批回填并校验总量、校验和与业务口径。确认读流量已切换且监控稳定后，停止旧写入，最后删除旧字段。需控制回填批量、锁范围和主从延迟，所有写入必须幂等；发布前准备反向切流、暂停回填和恢复备份等回滚方案。

### 247. CPU 利用率低的原因如何排查与优化？

> 来源：[科大讯飞面试挺有意思，不考八股不问项目](https://www.nowcoder.com/feed/main/detail/773d1337e7314a7d90985fd81510974d)

CPU 利用率低不等于系统空闲，常见原因是线程在等待磁盘、网络、锁或数据库连接，也可能是单线程瓶颈、请求量不足、CPU 限频或容器配额受限。先结合 uptime、vmstat、iostat、pidstat、线程栈和链路追踪区分 user、system、iowait、阻塞与调度等待，再定位具体资源。优化应针对根因：异步化和合理并发、缩短锁范围、批量 I/O、连接池与缓存调优，避免盲目加线程，并用压测、延迟分位数、吞吐和错误率验证收益。

### 248. Python async/await 的实现原理是什么？事件循环如何驱动协程？

> 来源：[阿里云一面](https://www.nowcoder.com/feed/main/detail/ceade00d742046d0bef6bee7fe7a7aad)

`async def`调用后得到协程对象，真正执行由`Task`包装并交给事件循环。遇到`await`时，协程通过`__await__`让出控制权，事件循环保存其状态，等待IO、定时器或其他任务完成；条件满足后，再通过`send`把结果送回协程，异常或取消则通过`throw`注入。事件循环通常结合就绪队列和IO多路复用器反复调度，因此协程是协作式并发：协程不主动让出、执行同步阻塞调用或CPU密集计算，整个循环都会被卡住。生产中还需处理取消传播、超时、任务异常和资源清理，并用事件循环调试、超时日志及阻塞检测验证行为。

### 249. Java 方法参数传递是值传递还是引用传递？对象参数的修改和重新赋值分别有什么效果？

> 来源：[字节全栈一面](https://www.nowcoder.com/feed/main/detail/a01aeac81ad342d88252f899c47f2dc4)

Java 只有值传递。基本类型参数传入的是值的副本，方法内修改不会影响调用方；对象参数传入的是对象引用的副本，因此通过该引用修改对象字段或集合内容，调用方能看到变化。但若在方法内让参数指向新对象，只改变局部副本，不会改变调用方变量的指向。String 等不可变对象看似修改，实际通常是重新创建并重新绑定局部变量。排查时应区分“修改对象状态”和“修改引用指向”，必要时返回新对象或通过可变对象、包装结果传递变化。

### 250. 遍历 HashMap 时如何安全删除元素？不同删除方式有什么区别？

> 来源：[字节全栈一面](https://www.nowcoder.com/feed/main/detail/a01aeac81ad342d88252f899c47f2dc4)

遍历 HashMap 时，推荐使用迭代器的 `remove()` 删除当前元素，例如通过 `Iterator<Map.Entry<K,V>>` 遍历 `entrySet()`，满足条件后调用 `iterator.remove()`。直接调用 `map.remove(key)` 会修改结构，通常导致后续迭代抛出 `ConcurrentModificationException`。也可用 `map.entrySet().removeIf(...)` 表达批量条件删除。若需删除多个已知键，可先复制键集合再删除；并发场景不能仅依赖 HashMap，需根据一致性要求选择并发容器或加锁，同时处理线程安全与复合操作的原子性。

### 251. 用户态线程与内核态线程的调度和切换为什么存在性能差异？

> 来源：[【面经】字节/AI 应用工程师 一面挂经……](https://www.nowcoder.com/discuss/933023499399024640)；[阿里云 Agent开发 一二面](https://www.nowcoder.com/feed/main/detail/fee780e1140147fbbad0f23a74e265c6)；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)

用户态线程由运行库在进程内保存寄存器、栈和调度队列，切换通常只需少量用户态指令，不必进入内核，因而开销低；内核线程切换需陷入内核，由调度器选择任务，保存/恢复内核上下文，可能引发地址空间、缓存和调度器相关开销。但用户态线程阻塞在系统调用、缺页或同步原语上时，整个承载进程可能受影响，且难利用多核；内核线程能被抢占并真正并行。选型应结合阻塞模型、CPU并行度和隔离需求，压测切换、尾延迟、吞吐及阻塞场景，而不能只比较空载切换次数。

**追问补充**：可用用户态协程或 Fiber 作为轻量调度单元，仅保存栈指针、寄存器和少量运行状态，由运行库维护队列；遇阻塞需配合异步 I/O 或线程池。进程切换还可能涉及地址空间和页表切换、TLB 失效、内核栈切换，以及缓存、调度器和 IPC 开销。

**追问补充**：创建方面，进程需建立独立地址空间、页表、文件描述符等资源，线程通常只需分配线程控制块、栈并挂入调度队列，因此进程创建更重；切换时进程还可能切换地址空间和刷新 TLB，线程若同进程可复用地址空间，但仍需保存寄存器、栈和调度状态。





### 252. 性能插桩系统如何采集、聚合并展示运行时性能数据？

> 来源：[阿里虎鲸文娱 - AI 基础设施 - 一面](https://www.nowcoder.com/feed/main/detail/9c2e1794ccc14448a6fc43d596f60f00)；[字节内部跨转-飞书基建二面](https://www.nowcoder.com/feed/main/detail/7e53073808f94e8790ab0d1dfd1a7841)

性能插桩通常在函数、请求、数据库调用或渲染生命周期等关键点埋点，采集耗时、次数、错误率、资源消耗和上下文标识；数据先在进程内异步缓冲，再批量上报到采集端，经过清洗、采样、聚合后写入时序库或分析存储，前端按服务、版本、接口和时间范围展示趋势、分位数与火焰图。设计时要控制插桩开销、标签基数和敏感信息泄漏，并接受网络异常造成的数据丢失。应通过开关、压测、对照实验和端到端校验验证准确性。

### 253. 计算机网络五层模型分别是什么？数据链路层负责什么，常见协议和机制有哪些？

> 来源：[阿里虎鲸文娱 - AI 基础设施 - 一面](https://www.nowcoder.com/feed/main/detail/9c2e1794ccc14448a6fc43d596f60f00)；[携程AI 面试复盘](https://www.nowcoder.com/discuss/932274641865887744)；[字节跳动 - Agent 研发 - 一面](https://www.nowcoder.com/feed/main/detail/0b91e9f5fbba4af4865c6fadc9a790e8)

常说的五层模型从下到上是物理层、数据链路层、网络层、传输层和应用层，分别关注比特传输、同一链路通信、跨网络寻址与路由、端到端传输，以及具体业务协议；OSI 七层模型还将会话层、表示层单独划出。数据链路层负责帧封装、MAC 寻址、介质访问、差错检测，常见机制包括以太网、Wi-Fi、VLAN、交换机转发、CRC 和 ARP（通常被视为二层与三层之间的协议）。排查时应结合抓包判断是物理丢包、链路冲突、地址解析还是上层超时，不能把分层当成绝对隔离。

### 254. 点赞等互动数据应如何选择缓存、数据库与持久化策略？

> 来源：[字节剪映AI应用开发一面](https://www.nowcoder.com/feed/main/detail/7211e82c75284d23a89b569cd9dc289d)

点赞这类数据通常应以数据库持久化为准，缓存用于降低热点读取压力，而不是唯一事实来源。写入路径可先校验用户与目标对象，再通过唯一键约束或幂等接口保证同一用户只能点赞一次；高并发场景可采用消息队列异步落库，但要处理重复消费、乱序、积压和最终一致性。缓存更新可采用旁路缓存、失效后回源，或按业务容忍度使用计数器并定期与数据库校正。取消点赞、删除用户、数据库故障和缓存丢失都应有补偿策略；展示数字应明确是实时值还是近似值，并监控延迟、失败率和对账差异。

### 255. Java 中 sleep、wait 与 notify 的区别及适用场景是什么？

> 来源：[九方智投 一面凉经](https://www.nowcoder.com/feed/main/detail/92efed84eb68493d82132e03b7e43ae0)

sleep 是线程的定时阻塞，通常不会释放已持有的锁；wait 用于线程间协作，必须在对应对象监视器内调用，进入等待后会释放该对象的锁，待被唤醒后重新竞争锁。notify 只唤醒一个等待线程，调用后也不会立即释放锁，锁仍在退出同步块时释放。wait 需放在 while 条件循环中，防止虚假唤醒和条件变化；生产代码还应处理 InterruptedException，并优先考虑并发工具类或阻塞队列。

### 256. 什么是内存泄漏？常见原因、影响与排查方法有哪些？

> 来源：[九方智投 一面凉经](https://www.nowcoder.com/feed/main/detail/92efed84eb68493d82132e03b7e43ae0)

内存泄漏是对象已无业务意义、却仍被可达引用链持有，导致垃圾回收无法回收；在 Java 中通常表现为堆占用持续增长、频繁 GC，严重时触发 OOM。常见原因包括静态集合长期累积、缓存无上限或无过期、监听器未注销、ThreadLocal 未清理，以及连接、文件等资源未关闭。排查应结合趋势监控、GC 日志、堆转储和 MAT 等工具，比较多次快照中的增长对象及其 GC Roots；还要区分真正泄漏与正常缓存、瞬时流量或单纯堆配置不足。修复后需通过压测和回归观察占用是否稳定。

### 257. 面向不同用户需求的个性化缓存如何设计？

> 来源：[小红书 Product Engineer（AI与全栈方向）-社区工程 一面面经](https://www.nowcoder.com/feed/main/detail/70ad5ead2f784676b0b399eab877d3d4)

个性化缓存应先确定命中边界：把真正影响结果的用户属性、租户、权限、语言、地区或版本纳入 key，不能只用资源 ID，否则会串数据；但不要把高基数、易变字段无脑拼入 key，避免命中率低和空间爆炸。可采用分层设计：公共内容共享缓存，个性化部分按稳定画像或策略版本缓存，极少数结果直接计算。设置 TTL、容量上限和淘汰策略，并在画像、权限或内容变更时按版本号失效。需防缓存穿透、击穿、雪崩，保护敏感数据并校验访问权限；通过命中率、延迟、内存占用、错误率和跨用户隔离测试验证方案。

### 258. 分析型数据库中倒排索引的适用场景、引入依据与性能瓶颈如何排查？

> 来源：[(秋招) 9.16 字节中交广 - 交易与广告业务 - AI全栈开发工程师](https://www.nowcoder.com/discuss/932587389027962880)

倒排索引适合高选择性的文本词项、短语或关键词过滤，不应因为“查询慢”就直接引入。先用慢查询、Profile、执行计划和基线对比判断瓶颈是在扫描、过滤、网络还是聚合，再观察词频、命中率、索引构建与写入开销。验证时用代表性数据和查询集做压测，比较延迟、吞吐、存储及写入放大；还要覆盖分词、低频词、模糊查询和冷热数据。若查询选择性低，倒排收益有限，可能增加维护成本。

### 259. 如何设计本地缓存与分布式缓存组成的两级缓存，并评估命中率和一致性？

> 来源：[9.14字节推荐架构一面](https://www.nowcoder.com/feed/main/detail/467d01beed8a40b89ac414b90fc7fb85)；[秋招第二挂 小红书](https://www.nowcoder.com/feed/main/detail/90c05c87e0414708976ab28b20a51d36)；[小红书产品工程师agent开发一面](https://www.nowcoder.com/feed/main/detail/f0950469136e47b0828373cfeefd82ce)

两级缓存通常是进程内 Guava 在前、Tair 等分布式缓存为后：先查本地，未命中再查 Tair，仍未命中才访问数据库，并回填两级。命中率不能直接给固定数字，应分别统计本地命中、分布式命中和最终回源率，按请求量加权，同时观察 P95 延迟、回源流量和热点分布。一致性可按业务容忍度选择 TTL、主动失效或版本号；更新时要防止本地旧值、缓存击穿、雪崩和穿透，必要时加随机过期、单飞/互斥、空值缓存，并保证回源与回填的超时、降级和幂等。

**追问补充**：可采用写库成功后失效 Redis，再通过消息广播或订阅失效各实例本地缓存；并发更新用版本号或 CAS 防止旧值回填，必要时延迟双删。读路径以 DB 为最终事实源，缓存 miss 回源并校验版本，删除、超时和消息丢失需可重试且幂等。

**追问补充**：分布式锁用于同一资源的并发互斥，例如限制只有一个请求回源重建缓存；可用 Redis 原子加锁、唯一标识和过期时间，释放时校验持有者，避免误删他人锁。锁只缓解击穿，仍需设置超时、续期、降级和幂等。





### 260. 不依赖 Spring AI 时，Java 如何对接大模型与向量数据库？核心适配痛点有哪些？

> 来源：[27秋招-恒生电子AI面试-AI应用开发岗-26.9.23](https://www.nowcoder.com/feed/main/detail/e7981675c7a44b098d97e90a854f9c3c)

不依赖 Spring AI 时，Java 通常需要自行封装模型 HTTP/SSE 客户端、鉴权、超时、重试、流式响应和错误码，再分别适配聊天、Embedding、重排及向量库 SDK。核心痛点是不同厂商的请求协议、异步模型、Token 统计和结构化输出不一致，向量维度、距离度量、批量写入与过滤语法也可能不兼容。应定义内部接口、统一 DTO 与可观测字段，并对重试和写入设计幂等，避免重复扣费或重复数据；密钥、提示词和用户内容还需脱敏及权限隔离。可将 [Spring AI Reference](https://docs.spring.io/spring-ai/reference/) 作为抽象层设计的对照，但自研仍需用契约测试、故障注入和真实查询集验证。

### 261. 离线大数据架构中的常用组件分别解决什么问题？如何协同工作？

> 来源：[奇怪の字节二面面经（大概率凉经）](https://www.nowcoder.com/feed/main/detail/bcf0b8497fcb4982b2292cafbcb08d69)

离线大数据通常由存储、计算、资源调度、元数据、调度编排和数据质量组件协同组成：HDFS 或对象存储保存数据，Parquet/ORC 等格式降低扫描成本，Hive/Spark 负责批处理，YARN 或 Kubernetes 提供资源隔离，Metastore 管理表和分区，Airflow 等编排依赖。数据按“采集入湖—分层加工—质量校验—产出服务”流转。生产中还要关注小文件、分区倾斜、Schema 演进、失败重试的幂等性、权限审计和成本监控，不能只看任务是否成功。

### 262. Flink State 持续膨胀时如何治理其存储、性能与可维护性？

> 来源：[奇怪の字节二面面经（大概率凉经）](https://www.nowcoder.com/feed/main/detail/bcf0b8497fcb4982b2292cafbcb08d69)

先区分 State 变大是 Key 数量、单 Key 数据、窗口长度还是定时器增长，并通过 State、checkpoint 时延、增量大小、反压和 RocksDB/磁盘指标定位。治理上设置合理 TTL、窗口和状态粒度，及时清理无效 Key，避免把高基数维度直接放入状态；TTL 只解决逻辑过期，物理空间回收和 compaction 仍需观察。再选择合适的 State Backend、增量 checkpoint 和本地磁盘，控制 checkpoint 并发与保留数。变更前用 savepoint 做迁移演练，验证恢复、扩缩容、Exactly-once 语义及历史结果，防止清理策略造成重复或数据丢失。

### 263. Java concurrent 包包含哪些核心组件？分别解决什么并发问题？

> 来源：[迅雷 Agent一面](https://www.nowcoder.com/discuss/932392798559432704)

Java 的 java.util.concurrent 主要包括线程池与 Executor、Future/CompletableFuture，负责任务调度和异步编排；Lock、ReadWriteLock、Condition、Semaphore、CountDownLatch、CyclicBarrier 等同步工具，解决互斥、限流和阶段协作；Atomic 类与 LongAdder 提供低锁或无锁的原子更新；ConcurrentHashMap、BlockingQueue 等并发容器降低共享数据竞争。ForkJoinPool 适合可拆分任务。选型还要结合可见性、顺序性、取消传播、线程池隔离和队列饱和策略，并排查死锁、活锁、线程泄漏、异常丢失和上下文传递问题。

### 264. Fencing Token 的作用是什么？引入它会带来哪些额外开销，如何权衡？

> 来源：[快手大模型agent研发一面](https://www.nowcoder.com/discuss/932315325276618752)

Fencing Token 不是重复加锁，而是由协调者为每次成功获取 Lease 分配递增的任期号。Worker 执行写入时携带该号，下游资源保存已接受的最大值并拒绝更小的请求，因此即使旧 Worker 因暂停或网络分区在 Lease 过期后恢复，也不能覆盖新 Worker 的结果。Lease 负责判断持有权和回收，Token 负责隔离陈旧请求，二者可以放在同一租约记录中，但语义仍应分开。代价包括生成并持久化序号、将 Token 传递到每个写路径、下游改造和额外比较；对纯幂等或无共享写入的任务可能不值得。应按资源风险、故障窗口和改造成本选择。

### 265. 从键盘输入到字符显示在屏幕上，操作系统和硬件经历了哪些完整过程？

> 来源：[腾讯 TEG 云架构平台部一面、二面面经](https://www.nowcoder.com/feed/main/detail/6aa13bf7472441bb9c5174ee8e7af078)

按键后，键盘控制器把物理动作编码成扫描码，经 USB 或其他接口传给内核驱动；驱动处理中断并转换为按键事件，输入子系统再交给终端、桌面环境或应用。应用依据键盘布局、修饰键和编码规则把事件解析为字符 A，写入终端或窗口系统。随后应用更新文本缓冲区，图形栈将字符栅格化为字形，合成器把窗口内容写入显存，显示控制器通过帧缓冲和显示接口刷新屏幕。过程中还可能受焦点、输入法、权限、驱动异常和丢失事件影响，排查应分层检查硬件事件、内核日志、应用输入和最终渲染。

### 266. 如何设计一个消息队列？有锁和无锁实现分别需要考虑什么？

> 来源：[腾讯 TEG 云架构平台部一面、二面面经](https://www.nowcoder.com/feed/main/detail/6aa13bf7472441bb9c5174ee8e7af078)

可将消息队列拆为生产、存储、消费、确认和重试模块：消息需有唯一 ID、分区或路由键、持久化策略、可见性超时、死信队列和监控。锁实现简单，适合保护队列头尾、容量和消费状态，但要防止竞争、死锁及锁粒度过大；无锁实现通常用原子 CAS 和环形缓冲区，要求清晰的内存序、槽位所有权和 ABA 防护，调试与扩展更难。无论哪种方案，都不能只依赖“成功返回”保证不丢消息，应明确至少一次或其他投递语义，消费者必须幂等，重试还要避免消息风暴，并通过并发、宕机、重复确认和压力测试验证。

### 267. 一次 HTTP 请求从客户端发起到服务端返回的完整执行链路是什么？

> 来源：[度小满 AI 全栈二面](https://www.nowcoder.com/discuss/931952631340077056)；[字节跳动火山引擎agent开发秋招二面](https://www.nowcoder.com/feed/main/detail/329a57a7469045058209b214e387e32c)

一次请求通常先经过客户端配置的 DNS、代理或网关，建立 TCP 连接；HTTPS 还会进行 TLS 握手。随后请求经负载均衡转发，服务端解析 HTTP、执行鉴权和中间件逻辑，访问缓存、数据库或其他服务，生成状态码、响应头和响应体，再沿连接返回客户端。排查时应按 DNS、连接、TLS、网关、应用、下游依次看日志和耗时。还要关注连接复用、超时、限流、重试和幂等性：重试非幂等请求可能造成重复写入，不能只依赖客户端重试解决故障。

### 268. 异构数据库节点如何在 TypeScript 工作流平台中集成？驱动、连接池与跨平台适配有哪些工程难点？

> 来源：[9.20 汇川技术 数字化全栈工程师 一面](https://www.nowcoder.com/feed/main/detail/28032c48a90c4f69827704deb3fae34c)

通常 Hive 集成难度更高：它往往涉及 JDBC/Thrift 驱动、Kerberos 或配置文件、远程作业提交、长耗时查询和结果流式读取；Neo4j 主要是 Bolt/HTTP 协议、事务与图查询封装。平台应定义统一节点接口，将驱动适配、连接池、超时、取消、重试和资源释放隔离；连接池需按租户与数据源隔离，凭证放密钥系统。跨平台要避免硬编码路径和本地命令，并在容器、代理、TLS 场景测试。重试只用于明确幂等操作，需通过集成测试、故障注入和连接泄漏监控验证。

### 269. ArrayList 和 LinkedList 的底层结构、复杂度与适用场景有什么区别？

> 来源：[百度 AIGC 多模态智能体算法工程师二面](https://www.nowcoder.com/feed/main/detail/2d033fd6daa04e2aaad2282b75531bbc)

ArrayList 基于可扩容数组，按下标访问平均 O(1)，尾部追加摊销 O(1)，中间插入或删除通常需搬移元素，约 O(n)。LinkedList 是双向链表，按下标查找为 O(n)，若已拿到节点或迭代器，局部插入删除可为 O(1)，但定位节点仍可能耗时。ArrayList 连续内存、缓存局部性好且额外开销小，通常是默认选择；LinkedList 只有在频繁的已定位节点操作、且确实需要链表语义时才适合，不能仅因“插入快”就选它。

### 270. 渠道入口归因如何设计与实现？

> 来源：[快手电商大模型应用开发一面（已offer）](https://www.nowcoder.com/feed/main/detail/acc9c99b46e7489386bab12b47b56c11)

入口归因通常在渠道链接中携带渠道、活动和点击标识，首次访问时写入 Cookie 或服务端会话，注册、下单等转化事件再关联该标识。设计时要先明确首次触点、末次触点或多触点规则，并设置有效期、跨域传递和覆盖优先级。服务端应校验参数、避免开放重定向，事件写入要有唯一键以去重，处理重放和延迟上报；对账时比较点击、落地、注册和支付数据，监控缺失率。还要最小化采集并提供删除、权限和审计能力，具体合规要求需由专业人员判断。

### 271. 浅拷贝和深拷贝有什么区别？分别适用于什么场景？

> 来源：[阿里云一面](https://www.nowcoder.com/feed/main/detail/ceade00d742046d0bef6bee7fe7a7aad)；[shopee ai基础设施一面](https://www.nowcoder.com/discuss/939225085016031232)；[ai面试](https://www.nowcoder.com/feed/main/detail/9042487b33c54921982d86614598d7ae)；[滴滴 java 一面 10.15](https://www.nowcoder.com/feed/main/detail/5b57de7f52e94f3f8985ee51f1f78a43)；[移动卓望AI面10.17](https://www.nowcoder.com/feed/main/detail/2dcc16b1678d42beac2c7f5270f6ff0c)

浅拷贝只复制对象本身，内部仍共享嵌套的可变对象；深拷贝会递归复制嵌套对象，修改副本通常不影响原对象。浅拷贝适合对象层级浅、内部数据不可变或明确允许共享的场景，成本低；深拷贝适合需要完全隔离状态的场景，但更耗时耗内存，还可能遇到循环引用、不可复制对象或自定义资源。Python 中可用 copy.copy 和 copy.deepcopy，并应通过修改嵌套字段验证实际隔离效果。

### 272. Java 中使用 `+` 拼接 String 有什么问题？底层如何实现？

> 来源：[字节全栈一面](https://www.nowcoder.com/feed/main/detail/a01aeac81ad342d88252f899c47f2dc4)

String 不可变，使用 + 会产生新的字符串；编译器通常会把同一表达式中的拼接优化为类似 StringBuilder 的过程，但循环中反复拼接仍可能不断创建对象、复制内容，造成时间和内存开销。大量或动态拼接应优先使用 StringBuilder；多段固定内容可考虑 String.join。还要注意 null 会被转成字符串文本，不能把这种语法层面的便利当作性能保证，最终应结合编译产物或基准测试确认。

### 273. Java 中 try-finally 都有 return 时最终返回哪个？为什么？

> 来源：[字节全栈一面](https://www.nowcoder.com/feed/main/detail/a01aeac81ad342d88252f899c47f2dc4)

try 和 finally 都执行 return 时，最终返回 finally 中的值。执行 try 的 return 表达式时，结果会先保存；随后进入 finally，若 finally 再 return，就会覆盖之前的返回值。若 finally 抛出异常，则异常覆盖返回结果。即使 finally 只有修改返回对象内部状态，也可能影响观察结果，但不会改变已经保存的基本类型值。通常不应在 finally 中 return，否则会吞掉异常并降低可读性；资源释放应放在 finally 或使用 try-with-resources。

### 274. Java 中 `equals()` 和 `==` 有什么区别？

> 来源：[字节全栈一面](https://www.nowcoder.com/feed/main/detail/a01aeac81ad342d88252f899c47f2dc4)

基本类型使用`==`比较数值；引用类型使用`==`比较是否指向同一个对象，而`equals()`用于表达对象的逻辑相等，默认实现通常仍接近引用比较，是否按字段比较取决于类的重写。重写`equals()`时必须同时满足自反、对称、传递、一致和非空，并保持与`hashCode()`一致，否则放入HashMap或HashSet会出现查找失败。比较字符串应使用`equals()`，并注意空值，可写成常量在前或使用`Objects.equals()`。还要留意自动装箱、缓存和拆箱导致的边界行为。

### 275. 一个数据包从服务器网卡到应用程序的完整处理流程是什么？

> 来源：[【面经】字节/AI 应用工程师 一面挂经……](https://www.nowcoder.com/discuss/933023499399024640)

数据包到达网卡后，网卡通过DMA写入内核缓冲区并触发中断或NAPI轮询；驱动把数据交给内核协议栈，依次完成链路层、IP、TCP/UDP处理。TCP还要校验、排序、重组并放入socket接收队列，监听线程通过阻塞、select、epoll等机制被唤醒，应用再从socket读取，必要时经过TLS解密和HTTP解析。实际排查应区分丢包、队列溢出、连接建立、协议栈拥塞和应用消费慢，可结合网卡统计、抓包、内核指标及应用日志定位；零拷贝能减少复制，但会增加生命周期和兼容性约束。

### 276. 多人协作开发时，如何制定、落地并持续治理团队开发规范？

> 来源：[迅雷 Agent一面](https://www.nowcoder.com/discuss/932392798559432704)

先把规范限定在能降低风险的范围内，按代码风格、分支与提交、接口契约、测试、日志和安全边界分类，由团队共同评审并形成短文档。落地依靠格式化、静态检查、类型检查、单元测试和 CI 门禁，关键规则尽量自动化，例外必须记录原因。AI Native 场景还要约束生成代码的依赖、敏感信息、许可证风险和人工评审责任，不能把 AI 输出直接视为可信。持续治理看缺陷率、回滚率、检查误报和交付效率，定期复盘删减无效规则。

### 277. Python 中 is 和 == 有什么区别？分别适用于什么场景？

> 来源：[华为AI开发一面](https://www.nowcoder.com/feed/main/detail/bb07b66e5c434b08992bf8747dd7bd3e)；[shopee ai基础设施一面](https://www.nowcoder.com/discuss/939225085016031232)

is 判断两个对象是否为同一对象，即身份比较；== 调用对象的相等性规则，判断值或语义是否相等。通常用 is 判断单例，最典型是 `value is None`，不用 `== None`；业务数据、字符串和数字的内容比较应使用 `==`。不要依赖小整数或字符串驻留等实现细节，两个内容相同的对象不保证身份相同。自定义类还可以通过 `__eq__` 改变 == 的语义，因此比较结果可能受类型实现影响。

### 278. 面向对象设计中的开闭原则是什么？如何通过抽象和扩展实现对修改关闭、对扩展开放？

> 来源：[CVTE 一面](https://www.nowcoder.com/discuss/932319671578030080)；[字节AI全栈二面](https://www.nowcoder.com/discuss/938145178114592768)

开闭原则是对已有稳定代码尽量关闭修改、对新需求开放扩展，核心是把变化点隔离到抽象之后。可以定义接口、策略、模板方法或插件协议，让调用方依赖稳定抽象，新增实现通过注册或组合接入，而不是不断修改条件分支。它不是绝对禁止修改：需求变化或抽象设计错误时仍需重构。抽象过早会增加复杂度，因此应结合变化频率、测试覆盖和扩展成本判断；通过单元测试、契约测试和真实用例验证扩展不破坏既有行为。

**追问补充**：例如新增支付渠道时，领域层继续依赖稳定的支付接口，应用层只组合调用，基础设施层新增渠道实现并通过注册表或配置接入；通常只改新增实现、注册配置和对应测试，避免修改核心流程分支。



### 279. 原码、反码和补码分别是什么？补码为什么适合计算机表示有符号整数？

> 来源：[腾讯 TEG 云架构平台部一面、二面面经](https://www.nowcoder.com/feed/main/detail/6aa13bf7472441bb9c5174ee8e7af078)

原码用最高位表示符号，其余位表示绝对值；反码中正数不变，负数按位取反；补码中正数不变，负数是在反码基础上加一。现代计算机通常采用补码表示有符号整数，因为加减可以统一使用加法器，符号扩展规则也较自然，并且只有一个零。需要注意固定字长会发生溢出，结果按位截断后可能改变符号；最小负数通常没有对应的正数，因此取绝对值、取负和类型转换都要检查边界。

### 280. 如何设计可复用的运营活动开发框架以降低代码重复？

> 来源：[【社招】腾讯三面面经](https://www.nowcoder.com/feed/main/detail/431b4ca35c7f43909219d31aebba5b56)

可以建设“活动脚手架+领域组件+配置驱动”的框架：脚手架统一登录、权限、路由、发布和监控，领域组件复用报名、优惠、库存、抽奖等能力，活动差异通过配置和受控扩展点实现。框架应定义生命周期、数据校验、幂等键、状态机、超时与回滚边界，避免演变成难以修改的大一统平台。通过模板测试、契约测试和线上指标验证复用效果；对高风险操作保留审批、审计和灰度发布。

## 近期新增：2026-10-07 面经补充

### 281. 接口文档应如何设计和生成，设计先行与代码生成分别有什么取舍？

> 来源：[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)

先按业务用例约定路径、方法、参数、响应 Schema、鉴权、错误码和幂等行为，再让调用方评审。可用 [OpenAPI](https://spec.openapis.org/oas/latest.html#operation-object)表达操作契约。设计先行便于并行开发和提前发现破坏性变更，但必须以契约测试防止实现漂移；代码生成文档贴近实现，却容易遗漏业务语义。工程上把契约、示例和兼容性检查纳入同一 PR，文档中的成功与失败案例都要能验证。

---

### 282. 数据库表结构、表关系与索引应如何设计？

> 来源：[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)；[宏图智能一面](https://www.nowcoder.com/discuss/934206754898866176)；[字节AI全栈二面](https://www.nowcoder.com/discuss/938145178114592768)

先识别实体、主键、唯一性、关系基数和事务边界，例如用户—订单为一对多，订单—商品通过明细表达，并保存交易时的价格快照。字段类型、金额精度、空值和关联约束须明确；不要只画表而不列读写路径。根据过滤、连接、排序及数据分布设计索引，用执行计划和代表性负载验证。按 [MySQL 索引文档](https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html)，索引也会增加写入维护和存储成本，因此不能给每列盲目建索引。

**追问补充**：ER图先列实体及属性，再标注主键、唯一性、实体间基数和参与是否可选；多对多关系拆成关联实体并放置双方外键，一对多通常将外键放在多的一方。随后按实体、关系映射为表，并校验外键、删除策略与业务约束。

**追问补充**：索引可按数据结构分为B+树、哈希、全文等，也可按单列或联合索引划分。设计时围绕高频过滤、连接、排序选择列，联合索引遵循最左匹配，控制索引数量，避免冗余并评估选择性、覆盖收益与写入成本。

---

### 283. 数据库连接池为什么需要，核心参数应如何配置和调优？

> 来源：[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)

连接池复用物理连接，减少反复连接和认证开销，并以有界并发保护数据库。Druid 的 `initialSize`、`minIdle`、`maxActive`、`maxWait` 分别约束初始化、最小空闲、最大活跃连接与借用等待，具体语义见 [Druid 配置文档](https://github.com/alibaba/druid/wiki/DruidDataSource%E9%85%8D%E7%BD%AE%E5%B1%9E%E6%80%A7%E5%88%97%E8%A1%A8)。应按全部服务副本合计的连接预算压测，观察借用等待、活跃数、慢 SQL 和长事务；通过 try-with-resources 归还连接。池越大不一定越快，也不能靠扩大连接池掩盖连接泄漏。

---

### 284. Java 项目发生 OOM 时如何定位原因并排查？

> 来源：[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)

先保留完整异常、GC 日志、容器/宿主内存指标和最近变更，按 `Java heap space`、Metaspace、直接内存或线程创建失败分流。OOM 不一定是泄漏，也可能是容量不足或一次超大分配，参见 [Oracle OOM 排查文档](https://docs.oracle.com/en/java/javase/25/troubleshoot/troubleshooting-memory-leaks.html)。堆问题结合直方图、转储和引用链找保留对象；元空间看类加载器，堆外看本地内存，线程问题看数量与系统限制。容器被 OOM Kill 可能没有 Java 异常，应查退出事件。先止损，再用可复现负载验证修复，避免只加堆。

---

### 285. Nginx 是什么？反向代理的原理和作用是什么？

> 来源：[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)

Nginx 可作为客户端与上游应用之间的反向代理，统一接入请求并转发给 Spring Boot 等服务。`server` 定义监听与虚拟主机，`location` 选择路径处理规则；匹配顺序见 [请求处理文档](https://nginx.org/en/docs/http/request_processing.html)。`proxy_pass` 指定上游，例如在 `/api/` 下配置 `http://127.0.0.1:8080/` 会把匹配前缀替换为 `/`，不带该 URI 部分时通常保留原请求路径，详见 [proxy_pass](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)。部署时验证路径、Host、超时和转发头的信任边界，执行配置检查并用真实请求验证。

---

### 286. Docker 的基本使用场景和常用命令有哪些？

> 来源：[合肥某头部企业软件开发实习生面试问题汇总（时长1个小时）](https://www.nowcoder.com/feed/main/detail/d2c3a96201704d98b060db827c0ca808)

Docker 常用于把应用与依赖打包成镜像，并以配置一致的容器运行；容器是隔离的进程，不等于拥有独立内核的虚拟机，见 [Docker 容器概念](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)。常见流程是 `docker build` 构建、`docker run` 启动、`docker ps` 看状态、`docker logs` 看日志、`docker exec` 诊断、`docker inspect` 核对配置、`docker stop` 停止；命令以 [CLI 文档](https://docs.docker.com/reference/cli/docker/)为准。端口映射、网络、卷、资源限制和非 root 身份要显式设计，凭证不能打进镜像；数据应放在持久化存储中。

---

### 287. Web 前端与原生客户端开发有哪些运行环境和工程约束差异？

> 来源：[美团ai全栈二面](https://www.nowcoder.com/feed/main/detail/064725eb6da14cda9efabb2a51a68681)

Web 前端与原生客户端都包含界面、状态与网络交互，区别主要在运行环境和交付约束。Web 受浏览器沙箱及[同源策略](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)约束，还需处理浏览器兼容和资源加载；原生客户端需适配平台 API、设备权限、应用生命周期和版本分布，例如 [Android Activity 生命周期](https://developer.android.com/guide/components/activities/activity-lifecycle)。这不是绝对二分：PWA、混合应用与跨平台框架会交叉。使用 AI 生成代码时，应提供目标平台规范，并分别验证响应式布局、无障碍、离线恢复和真机行为。

---

## 近期新增：2026-10-13 面经补充

### 288. 如何设计电商下单与购物车功能的测试用例？

> 来源：[快手二面](https://www.nowcoder.com/feed/main/detail/2e044b336930429a9667909a27026382)

建议覆盖功能、边界、并发、异常、安全和性能。购物车需测新增、修改数量、删除、合并购物车、库存不足、上下架、限购、价格和优惠变更；下单需测地址、运费、优惠、库存锁定、支付超时、重复提交、取消和退款。重点验证金额由服务端计算，订单接口具备幂等键，库存扣减在并发下不超卖，失败可回滚或补偿。再用接口、集成和端到端测试覆盖消息重试、数据库异常、权限越权、限流，并检查日志、告警和链路追踪。

---

### 289. 什么是微服务？如何判断服务拆分是否合理？

> 来源：[智加 自动驾驶软件工程师](https://www.nowcoder.com/feed/main/detail/26812880d26248e5a34b4358902509e8)；[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)

两个服务不一定就是微服务；关键在于是否按稳定的业务边界拆分，并能独立开发、部署、扩缩容和治理。判断拆分是否合理，要看服务是否高内聚、低耦合，数据和事务边界是否清晰，跨服务调用是否可接受，以及故障隔离、超时重试、幂等、监控和权限是否完善。工程上建议结合调用链、发布频率、团队职责和故障影响评估，避免把单体机械切成分布式单体；拆分后若大量同步调用、共享数据库或必须联动发布，通常说明边界仍不合理。

---

### 290. C++ Web 服务端有哪些主流框架、数据库访问库和 ORM 方案？如何选型？

> 来源：[智加 自动驾驶软件工程师](https://www.nowcoder.com/feed/main/detail/26812880d26248e5a34b4358902509e8)

C++ 有 Web 服务生态，但通常不像 Java Spring 那样由单一平台统一覆盖，常见组合是 HTTP 框架、JSON 库、连接池、数据库驱动、配置与可观测性组件。比如 [Drogon 官方仓库](https://github.com/drogonframework/drogon)可作为 HTTP、异步数据库接口和 ORM 能力的实例；[ODB 官方仓库](https://github.com/codesynthesis-com/odb)体现了通过代码生成完成对象映射的 ORM 路线。选型建议关注协议与性能需求、异步模型、数据库兼容性、社区维护、调试和部署成本；生产验证应覆盖连接耗尽、超时、事务回滚、SQL 注入防护、依赖升级和故障恢复，而不是只看 Demo 吞吐。

---

### 291. 如何用 C++ 设计一个 ORM 框架？需要哪些核心技术？

> 来源：[智加 自动驾驶软件工程师](https://www.nowcoder.com/feed/main/detail/26812880d26248e5a34b4358902509e8)

自研 ORM 至少要解决实体与表字段映射、类型转换、查询构造、参数绑定、结果集 materialize、事务和连接生命周期。C++ 可用模板与 traits 做静态映射，或采用代码生成；不能把标准 C++ 反射当作普遍可移植能力。[ODB 官方仓库](https://github.com/codesynthesis-com/odb)展示了代码生成路线。工程上应通过 RAII 管理连接和事务，使用参数化 SQL 防注入，处理空值、批量操作、分页、并发和迁移；还要明确懒加载、缓存、N+1 查询及错误传播边界。建议用 SQL 对照测试、事务回滚测试、并发和故障注入验证，避免 ORM 隐藏昂贵查询。

---

### 292. Python GIL 的原理、影响与绕过方式是什么？

> 来源：[shopee ai基础设施一面](https://www.nowcoder.com/discuss/939225085016031232)；[滴滴 java 一面 10.15](https://www.nowcoder.com/feed/main/detail/5b57de7f52e94f3f8985ee51f1f78a43)；[网易互娱｜AI应用开发实习一面](https://www.nowcoder.com/feed/main/detail/2d982457b8b94da09fab383e275de93d)

在传统 CPython 构建中，GIL 是保护解释器内部状态的互斥机制，同一进程内通常只有一个线程执行 Python 字节码，因此 CPU 密集型线程难以获得真正的并行加速；I/O 等待或扩展主动释放 GIL 时仍可并发。常见绕过方式是多进程、把计算下沉到能释放 GIL 的原生扩展，或评估 free-threaded 构建。根据 [Python free-threading 文档](https://docs.python.org/3/howto/free-threading-python.html)，第三方扩展可能重新启用 GIL；且 GIL 不等于业务锁。选型应通过基准、线程安全测试、内存和部署验证，不能只看示例结果。

---

### 293. 基于 Access Token 与 Refresh Token 的登录认证机制如何设计？

> 来源：[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)

登录成功后签发短期 Access Token，用于接口鉴权；Refresh Token 保存更久，只能访问刷新接口并应受到更严格保护。建议将 Refresh Token 放在 HttpOnly、Secure、合适 SameSite 的 Cookie 中，服务端保存会话或令牌哈希，刷新时轮换并检测重放，退出登录或风险事件发生时撤销会话。Access Token 过期前通常不能被服务端即时收回，因此高风险操作还需服务端会话校验或重新认证。双 Token 只是分离使用场景，并不自动安全；还要校验签发者、受众、过期时间、权限和 CSRF 风险。相关安全边界见 [OAuth 2.0 安全最佳实践](https://www.rfc-editor.org/rfc/rfc9700)。

---

### 294. WebSocket 的握手流程、协议头与数据帧机制是什么？

> 来源：[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)

典型 WebSocket 握手使用 HTTP/1.1：客户端发送 GET，并带 Upgrade: websocket、Connection: Upgrade、Sec-WebSocket-Key 和 Sec-WebSocket-Version；服务端校验后返回 101 Switching Protocols，并用 Key 加固定 GUID 计算 Sec-WebSocket-Accept。升级后数据按帧传输，包含 FIN、RSV、opcode、MASK 和长度字段，长度过大时使用扩展长度；客户端发往服务端的帧必须掩码，但掩码不是加密。opcode 区分文本、二进制、Ping、Pong 和 Close，消息还可能分片。生产上应使用 TLS、校验 Origin 和认证信息，并处理心跳、超时、断线重连及关闭码；具体格式见 [WebSocket 协议 RFC 6455](https://www.rfc-editor.org/rfc/rfc6455)。

---

### 295. 如何针对新需求设计测试报告和测试用例，并在缺少历史问题单时保证测试覆盖？

> 来源：[美团Agent一面凉经](https://www.nowcoder.com/feed/main/detail/18fa4134edb14e8c901787ee5cd33ace)；[腾讯面经 腾讯大模型算法岗面经-04](https://www.nowcoder.com/discuss/940391665104064512)

先把需求拆成可验证的验收条件，并建立“需求—用例—结果—缺陷”的追踪关系，明确本次改动范围、依赖模块和不变行为。用例覆盖正常流、等价类、边界值、异常与权限、重复提交、并发、兼容性及回滚；高风险接口还应验证幂等、数据一致性和安全限制。没有历史问题单时，建议结合需求评审、接口契约、状态转换、威胁建模和风险矩阵补齐场景，再增加探索性测试。报告应记录版本、环境、数据、执行范围、通过率、阻塞项、缺陷及残余风险；不要把“全通过”等同于无缺陷，应说明未覆盖项及判断依据。

**追问补充**：覆盖时应将文本回答与工具调用分开设计：文本任务检查事实性、相关性、格式和拒答；工具任务检查工具选择、参数、调用顺序、超时重试、权限及结果回填，并分别统计成功率、错误调用率和端到端结果。

---

### 296. Python/FastAPI 项目如何接入数据库并设计数据访问层？

> 来源：[美团Agent一面凉经](https://www.nowcoder.com/feed/main/detail/18fa4134edb14e8c901787ee5cd33ace)

建议将配置、连接池、事务边界与数据访问代码分层：应用启动时创建连接池，请求或任务获得并释放 Session，仓储层封装查询，服务层负责业务事务，避免路由直接拼 SQL。FastAPI 教程展示了依赖注入创建和释放 Session 的做法，SQLModel 只是示例，并非唯一方案：[FastAPI SQL 数据库教程](https://fastapi.tiangolo.com/tutorial/sql-databases/)。同步驱动不要直接放进 async 热路径，可改用异步驱动或线程池；表结构应通过迁移工具版本化，不能只依赖启动时自动建表。设计表时重点确认主键、唯一约束、索引、外键、软删除和分页边界，并用集成测试验证事务回滚、并发写入、连接泄漏和慢查询。

---

### 297. JDK 对象从创建到销毁经历哪些生命周期阶段？

> 来源：[传化智联一面](https://www.nowcoder.com/feed/main/detail/52fbdc53e752443e8d261246c7bcc491)

对象通常经历创建、初始化、使用、变为不可达以及被垃圾回收器回收几个阶段。创建时分配内存并完成默认初始化，随后执行构造器；对象只要仍可从 GC Roots 到达就能使用。没有引用指向后只是具备回收资格，并不代表立即销毁，具体回收时机由 JVM 垃圾收集器决定。不要把 finalize 当作可靠生命周期步骤；资源应通过 try-with-resources 或显式 close 释放。

---

### 298. 微服务调用链中的错误透传如何治理？如何拆解问题并进行方案选型？

> 来源：[途虎AI面（10.10）](https://www.nowcoder.com/feed/main/detail/a361f94bef3e45cab4adff6ffa3b8d9f)

建议先把问题拆成错误分类、边界转换、重试与超时、日志追踪和告警归因几部分。服务内部保留异常上下文，跨服务只传递稳定的错误码、可安全展示的消息和 traceId，避免把堆栈、SQL 或敏感信息直接透传。按错误是否临时、是否幂等决定重试，并设置超时、熔断和限流；同步调用适合低延迟强一致场景，消息队列适合异步解耦但要处理重复消费和最终一致。选型用故障演练、链路日志、指标和契约测试验证，重点观察错误可定位性、兼容性、延迟与运维复杂度。

---

### 299. Spring 事务注解的原理、代理机制与事务拦截流程是什么？

> 来源：[美的一面](https://www.nowcoder.com/feed/main/detail/ae2e686858614c5d88e20b9b6a7f77b3)

Spring通常通过代理把带有@Transactional的方法拦截为事务边界：调用进入时由TransactionInterceptor解析事务属性，向事务管理器申请或加入事务，执行目标方法后提交；发生符合规则的异常则回滚，最后清理线程绑定资源。默认代理模式下，自调用不会经过代理，因此注解可能不生效；异步切换线程也不会自动继承事务。工程上建议检查代理类型、异常规则和调用链，并用提交、回滚、自调用、异步场景做集成测试。具体边界见[Spring @Transactional 文档](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)。

---

### 300. 缺少历史数据时，如何建立系统性能基线、设计压测方案并制定验收标准？

> 来源：[虾皮秋招 研发工程师](https://www.nowcoder.com/feed/main/detail/dcb2bf1c6b7c4b6a9f4c095ba9329bce)；[启元机器人 机器人软件平台开发](https://www.nowcoder.com/feed/main/detail/c01e635722d14d30b075667f721e56ff)；[字节一面和二面汇总面经](https://www.nowcoder.com/discuss/941992971027636224)

建议先用真实或代表性请求建立基线：记录吞吐、延迟分位数（如P50、P95、P99）、错误率、资源利用率、队列长度和依赖耗时，并固定数据规模、并发模型与环境。压测应包含预热、阶梯加压、稳定持续、峰值和故障场景，重复运行并保留版本与配置。验收标准要事先量化，例如目标吞吐下P99延迟、错误率和资源上限，同时明确降级、超时、重试放大和数据污染的失败边界。无历史数据时，阈值属于初始工程假设，应通过线上灰度和持续监控校准。

**追问补充**：JMeter 中可用线程组模拟并发，配置线程数、启动梯度、循环次数和持续时间，并用参数化数据避免请求完全相同。让 AI 生成压测脚本或分析报告时，Prompt 要限定场景、指标和输出格式；通过人工复核、脚本回放、结果与监控数据交叉验证，不能直接采信模型结论。

---

### 301. 不依赖消息中间件的异步数据存取系统如何设计？

> 来源：[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)

可用数据库表充当任务队列：请求先以幂等键开启事务，写入业务数据或待处理任务，并提交后立即返回任务编号；后台进程持续轮询未处理任务，使用状态字段和租约抢占，完成后更新为成功，失败则按次数重试并记录错误。查询接口按任务编号读取状态或结果。必须处理进程崩溃、重复执行、租约超时和并发更新，写操作应具备幂等性。该方案依赖数据库可用性，轮询会增加负载，吞吐和实时性通常不如专业消息系统；这是简化场景的工程建议，需用压测和故障注入验证。

---

### 302. 用户态和内核态有什么区别？

> 来源：[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)

用户态运行普通应用，权限受限，不能直接执行特权指令或访问任意硬件；内核态运行操作系统核心代码，拥有受保护资源的访问权限。应用通过系统调用、异常或中断进入内核，完成后再返回用户态，这会涉及参数校验、特权级切换和一定开销；特权级切换不等于切换进程或线程。用户态故障一般只影响进程，内核态错误可能导致系统级故障；具体隔离还依赖 CPU、内存管理单元和操作系统实现。排查性能问题时，应区分用户态 CPU、内核态 CPU、系统调用频率和 I/O 等待，不能把所有耗时都归因于上下文切换。

---

### 303. TCP 拥塞控制有哪些机制？它们如何根据网络状态调整发送速率？

> 来源：[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)

TCP 拥塞控制通过发送方的拥塞窗口 cwnd 限制在途数据，实际发送窗口还受接收窗口 rwnd 约束。经典机制包括慢启动、拥塞避免、快速重传和快速恢复：建立连接或确认网络可用时逐步增大发送速率，检测到重复 ACK 或超时则降低 cwnd，分别采取较快恢复或更保守的退避。具体规则可参考[《TCP 拥塞控制 RFC 5681》](https://www.rfc-editor.org/info/rfc5681)；其中描述的是经典范围，不能直接代表所有现代拥塞控制算法。排查时应结合 RTT、丢包、重传、cwnd 与 rwnd，区分网络拥塞和接收端限速。

---

### 304. 什么是零拷贝？如何减少数据拷贝并提升 I/O 性能？

> 来源：[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)

零拷贝是尽量避免数据在内核态、用户态和网络缓冲区之间重复搬运，例如文件发送可使用 `sendfile`，让内核直接完成文件到 socket 的传输。具体路径仍受内核实现、网卡、TLS 加密和协议影响，并不等于完全不拷贝或不占 CPU。工程上应先用系统调用统计、CPU/吞吐/延迟压测验证收益，再结合大文件、加密、限速和异常重试评估；这是优化建议，不应脱离实际瓶颈盲目采用。[Linux sendfile 手册](https://man7.org/linux/man-pages/man2/sendfile.2.html)

---

### 305. 客户端认为请求成功但服务端未收到时，如何系统化排查？

> 来源：[百度agent harness一面](https://www.nowcoder.com/discuss/937747584578310144)

先定义“成功”是客户端写入成功、收到服务端响应，还是业务已落库；TCP 写成功只代表交给本机协议栈，不代表服务端应用处理。建议用请求 ID 串联客户端日志、DNS 解析、连接建立、TLS、代理或负载均衡访问日志、服务端接入日志和业务日志，逐跳核对时间、目标地址、端口、状态码及超时。再抓包确认是否发出、是否被重置或重传，并检查连接池、网关路由、限流和版本发布。若重试可能造成重复处理，应使用幂等键；排查结论须以可观测证据而非单方日志为准。

---

### 306. 分层数据查询中的历史数据回溯如何设计并保证一致性？

> 来源：[秋招第二挂 小红书](https://www.nowcoder.com/feed/main/detail/90c05c87e0414708976ab28b20a51d36)

建议把三级数据设计为带版本或有效时间的不可变历史记录，而不是直接覆盖当前值；一次回溯先确定统一的业务时间点或快照版本，再按该版本查询各层，避免每层使用不同时间导致“拼接出不存在的状态”。写入时在同一事务内更新主数据、版本索引和变更记录，跨库场景使用可靠消息或 CDC，并通过幂等键、顺序版本和重试补偿保证最终一致。查询需明确读已提交、快照读及允许的延迟，配合校验任务发现缺口；这是工程设计建议，不能用缓存一致性替代数据库事实。

---

### 307. 如何将 Redis 请求聚合后批量写入数据库，并可靠感知数据变更？

> 来源：[秋招第二挂 小红书](https://www.nowcoder.com/feed/main/detail/90c05c87e0414708976ab28b20a51d36)

建议在应用侧用队列按业务键聚合，按条数或时间窗口批量写库；批次必须有唯一 ID，数据库用幂等键或版本条件更新，提交成功后再确认，失败则重试或进入补偿队列，避免丢失和重复写入。Redis Keyspace Notifications 本质是 Pub/Sub，断连期间事件可能丢失，因此不能作为可靠 CDC 或唯一数据源；应以 Redis Stream、可靠消息、数据库日志或定期扫描补偿为准。[Redis keyspace notifications 文档](https://redis.io/docs/latest/develop/pubsub/keyspace-notifications/)。聚合会增加延迟，需监控积压、批量耗时和丢失率。

---

### 308. Redis Pipeline 与 Lua 脚本如何实现批量操作？原子性边界有什么区别？

> 来源：[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)

Pipeline 主要把多条命令批量发送、集中读取结果，减少网络往返，但批次内命令仍可能被其他客户端穿插执行，并不自动提供事务原子性；批次过大还会增加客户端和服务端缓冲压力。可参考 [Redis Pipeline 文档](https://redis.io/docs/latest/develop/using-commands/pipelining/)。Lua 则把逻辑和读写放在服务端一次执行，执行期间具有原子阻塞语义，适合条件检查与更新必须连续的场景；但脚本运行时出错不会回滚此前已完成的写入，且脚本应保持短小，可参考 [Redis Lua 文档](https://redis.io/docs/latest/develop/programmability/eval-intro/)。工程上建议按原子性、耗时和批量规模分别选型，并验证超时、重试和幂等行为。

---

### 309. Redis 内存淘汰策略有哪些？如何根据业务场景进行选择？

> 来源：[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)

Redis 达到 maxmemory 后，可按候选范围和规则选择淘汰：allkeys 面向全部键，volatile 只面向设置过过期时间的键；规则包括 LRU、LFU、随机、按 TTL，以及 noeviction。LRU 优先淘汰近期少访问的数据，LFU 更适合按访问频率保留热点，random 成本低但命中不稳定，TTL 可优先清理更快到期数据；noeviction 则让会增加内存占用且无法满足限额的写操作报错。具体策略应结合命中率、访问分布和数据重要性压测验证。按 [Redis 内存淘汰文档](https://redis.io/docs/latest/develop/reference/eviction/) 的边界，淘汰不等于过期；工程上建议不要把唯一权威数据只放在可淘汰缓存中，并监控淘汰率、内存碎片和延迟。

---

### 310. 面向对象中方法重载和重写有什么区别？

> 来源：[乐堡AI应用开发岗四面面经，面试官非常nice！](https://www.nowcoder.com/discuss/939480702876123136)

重载可出现在同一类或继承层次中，方法名相同但参数列表不同，属于编译期按静态类型选择，返回值不能单独构成重载。重写发生在子类继承父类方法时，方法签名兼容，运行期按对象实际类型动态分派；访问权限不能收窄，静态方法不参与真正重写。排查时先看编译期引用类型、参数类型和注解，再确认是否误写成重载。选型上，用重载表达同一操作的不同参数形式，用重写实现子类多态；避免签名相近导致调用歧义。

---

### 311. HTTP 的 POST、PUT、PATCH 方法有什么区别？分别适用于什么场景？

> 来源：[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)

POST通常把请求交给目标资源处理，常用于创建子资源或触发动作，是否幂等取决于业务设计；PUT用于客户端指定资源标识的创建或完整替换，天然要求重复请求效果一致；PATCH用于部分修改，但补丁格式可能是增量操作而非简单字段覆盖，不能默认幂等。设计时要明确重试语义、资源版本和并发控制：更新关键数据可配合ETag与If-Match，避免覆盖他人修改；创建接口则应使用幂等键或业务唯一约束防止重试重复。以上语义可参考[HTTP 语义 RFC 9110](https://datatracker.ietf.org/doc/html/rfc9110)和[PATCH RFC 5789](https://www.rfc-editor.org/rfc/rfc5789)。

---

### 312. 风控系统主要解决什么问题？典型系统架构如何设计？

> 来源：[秋招第二挂 小红书](https://www.nowcoder.com/feed/main/detail/90c05c87e0414708976ab28b20a51d36)

风控系统通过识别欺诈、盗用、套现、异常交易和合规风险，在尽量不误伤正常用户的前提下决定放行、拦截、人工审核或限额。典型架构包括事件接入、特征计算、规则与模型决策、策略编排、处置执行、案例/审核、名单与配置管理，以及日志、监控和离线评估。在线链路要控制延迟并支持超时降级，特征和规则需有版本、回溯与灰度能力；决策结果应记录证据，便于解释、复盘和申诉。工程上建议用幂等事件、权限隔离、加密和最小化数据访问降低安全风险，并用漏放、误杀、召回率、通过率、延迟和人工审核量持续评估，而不是只看单一准确率。具体阈值和处置策略应结合业务损失、数据质量与合规要求验证。

---

### 313. 服务端为什么选择 C++？如何从性能、并发、生态和开发成本进行语言选型？

> 来源：[智加 自动驾驶软件工程师](https://www.nowcoder.com/feed/main/detail/26812880d26248e5a34b4358902509e8)

服务端选择 C++ 通常是因为需要可控的延迟、较高吞吐、低运行时开销，或已有成熟的 C/C++ 库与团队能力。它适合高性能网络、存储、计算密集和资源受限场景，但并非默认优于 Go、Java 或 Rust：内存安全风险、构建部署复杂度、开发效率和招聘成本都要纳入评估。建议先用真实负载定义延迟、吞吐、内存、可用性和交付周期目标，再做可重复基准与故障演练；同时评估工具链、异步模型、依赖治理、审计和运维能力。若瓶颈主要在数据库或外部服务，换 C++ 往往收益有限，反而增加维护成本。

---

### 314. API Gateway 负责什么？通常承担哪些路由、鉴权、限流和流量治理职责？

> 来源：[美团一面全栈开发日常实习面经](https://www.nowcoder.com/feed/main/detail/95e9fc44397d4118ba3946ef0d33b6da)

API Gateway 是客户端与后端服务之间的统一入口，通常负责请求路由、协议转换、TLS 终止、认证鉴权、限流熔断、灰度发布和基础观测。它应只做通用治理，不承载复杂业务逻辑。鉴权失败、路由配置错误、限流误伤、网关单点和下游超时都需考虑；配置应版本化、可回滚，策略变更要审计。限流通常按用户、租户、接口或来源划分，并配合幂等键、超时、重试预算，避免重试放大流量。建议用契约测试、压测、故障演练和指标告警验证效果。集中治理便于统一控制，但也会增加延迟、复杂度和故障影响范围。

---

## 近期新增：2026-10-22 面经补充

### 315. 服务端接口如何设计参数、范围、资源存在性和权限校验？

> 来源：[10.21小红书一面面经](https://www.nowcoder.com/feed/main/detail/bab2ccabb366403492901c712278329e)

要做，而且必须在服务端完成，不能信任客户端。先校验类型、格式、必填项和范围，再校验资源是否存在、状态是否允许操作，最后依据当前登录身份、租户和资源归属做权限判断。错误信息应避免泄露资源是否存在等敏感信息；更新和扣款等操作还要考虑幂等、并发和事务一致性。校验逻辑应覆盖绕过客户端、越权访问、异常边界值，并通过单元测试、接口测试和安全测试验证。

---

### 316. 上位机与嵌入式端之间的 UDP 通信如何设计与实现？

> 来源：[小米预测算法一面](https://www.nowcoder.com/feed/main/detail/f4e8f2bb1f254bc29b2e22d2b9dfadaa)

通常采用“自定义报文 + 状态机”：固定头包含魔数、版本、消息类型、序号、长度和请求标识，载荷使用明确编码，并做长度边界与校验。UDP保留数据报边界，但不保证到达、顺序、去重或可靠交付（见 [UDP RFC 768](https://www.rfc-editor.org/info/rfc768/)），因此应用层应按消息类型设计ACK、超时、有限重试、去重和必要的重排；重试必须配合幂等键。控制报文需限制大小以避免分片，增加心跳、断线恢复、日志和统计。校验和不等于身份认证，敏感场景还要设计认证与加密，并通过丢包、乱序、重复、重启和异常长度测试验证。

---

### 317. FastAPI 基于什么 Web 服务架构运行？Uvicorn、Gunicorn 等组件如何协作？

> 来源：[佰聆数据 助理AI应用开发工程师](https://www.nowcoder.com/feed/main/detail/3e95d47e9d4d40e09b1e5f2e8daf06c9)

FastAPI本身是ASGI框架，负责路由、请求处理和数据校验，通常由Uvicorn作为ASGI服务器承载；相关关系可参考 [FastAPI ASGI Server 文档](https://fastapi.tiangolo.com/deployment/manually/)。Uvicorn负责事件循环、连接和协议处理，可自行管理多个worker；Gunicorn不是必需组件，若使用它管理进程，必须匹配对应的Uvicorn worker集成，不能照搬已弃用的旧启动方式（见 [Uvicorn 部署文档](https://uvicorn.dev/deployment/)）。异步接口中不能直接执行阻塞的磁盘、数据库或CPU密集任务，应使用异步驱动、线程池或任务队列，并配置超时、优雅退出、日志和健康检查。

---

### 318. React Hooks 如何保存组件状态，为什么普通 Hook 不能在循环或条件分支中调用？

> 来源：[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60)

React 会把 Hook 状态挂在 Fiber 对应的 Hook 链表上，组件每次渲染按调用顺序读取和更新节点；因此 useState、useEffect 等若放进条件或循环，某次渲染改变调用顺序就会把状态错配。规则的核心是稳定顺序，不是链表本身；链表属于当前实现细节，不能当作公共 API。[React Hooks 调用规则](https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks) [React Hooks 当前实现](https://github.com/react/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js) 普通 Hook 可移到稳定的组件或自定义 Hook 顶层，循环部分拆为子组件；React 的 `use` API 有可在条件与循环中调用的例外，仍须遵守其上下文和异常处理约束。

---

### 319. Electron 的多进程架构如何划分？主进程、渲染进程与进程间通信如何协作？

> 来源：[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60)

Electron 通常由主进程管理应用生命周期、窗口和原生能力，渲染进程负责网页界面；preload 在隔离边界内通过 contextBridge 暴露最小化 API，双方用 IPC 传递请求和结果。生产实现应校验 IPC 参数、限制通道和权限，不能把 Node 能力整体交给不可信页面；还要处理窗口销毁、超时、重复请求和异常传播。[Electron Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model)

---

### 320. 浏览器的多进程架构如何设计？浏览器、渲染、GPU 与网络进程分别负责什么？

> 来源：[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60)

浏览器通常将浏览器主进程、渲染进程、GPU 进程和网络等服务进程分工：主进程管理窗口与协调，渲染进程执行网页，GPU 处理图形，网络进程承接网络服务。实际划分取决于浏览器和站点隔离策略，不能假设每个标签页固定对应一个进程；进程间通信还需考虑崩溃恢复、权限边界和资源竞争。[Chromium 多进程架构](https://www.chromium.org/developers/design-documents/multi-process-architecture/)

---

### 321. Microbenchmark 中如何隔离环境噪声并提高测量结果的稳定性？

> 来源：[字节tiktok ad infra 业务四面](https://www.nowcoder.com/feed/main/detail/e67a7683c6584c4e95e93cfa71957380)

先固定测试条件：减少后台负载，尽量绑定 CPU，记录机器、系统和编译参数，并分别处理冷、热缓存及同步、异步场景。每个用例先预热，再重复运行到足够时长，报告均值、分位数和离散程度，而不是只看一次最快值。避免编译器删除无效工作，可使用 `DoNotOptimize`、`ClobberMemory`；同时注意 CPU 频率变化、分配器和 I/O 的影响。Google Benchmark 也强调重复测量、预热、最小运行时间及这些边界： [Google Benchmark 指南](https://github.com/google/benchmark/blob/main/docs/user_guide.md)。噪声无法完全消除，应通过多轮对照、置信区间或稳定性阈值判断回归。

---

### 322. C++ 和 Java 在内存管理、运行时、多态实现与工程生态方面有哪些区别？

> 来源：[10.15 阶跃星辰 开发者关系技术向实习一面](https://www.nowcoder.com/feed/main/detail/277091082aa9484a96a15d49af4b047a)

C++通常编译为本地代码，支持值语义、模板和虚函数，资源管理可用RAII，让对象生命周期与文件、锁等资源绑定；并非只能手动`new/delete`，但错误管理仍可能造成悬空指针或未定义行为。Java运行在JVM上，字节码可由JIT优化，对象内存由GC回收，但文件、连接等外部资源仍需显式关闭。多态方面，C++可通过虚函数动态分派，也有模板等静态多态；Java实例方法通常运行时分派，但`static`、`private`等调用有边界。两者都拥有成熟生态，选型还要看延迟、部署、团队和本地互操作需求。相关机制可参考 [C++ Core Guidelines RAII](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-raii) 与 [Java 方法调用规范](https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12)。

---

### 323. 仅用 Linux 和 Nginx 基础命令，如何统计高频 IP 并排查异常访问？

> 来源：[字节Agent全三轮面经](https://www.nowcoder.com/feed/main/detail/b4fb3bee56134c3d9bcde6a3166a1711)

在无前导空格、空格分隔且首列确为 IP 的日志中，可用 `cut -d ' ' -f1 access.log | sort | uniq -c | sort -nr | head -n 10` 统计最高频 IP，无需编写程序。先核对 Nginx 日志格式、可信代理与所选时间范围，再按 IP 查请求路径、状态码、请求速率和错误日志。高频不等于攻击，还需排除 NAT、健康检查和合法批量访问；限流或封禁应有证据、作用范围和误判回滚。

---

### 324. 浏览器自动化中如何可靠等待页面节点和异步渲染完成？

> 来源：[国药控股广东生物科技AI agent](https://www.nowcoder.com/feed/main/detail/18d271f86bda4d81afb30f02164352f1)

固定 sleep 只能假设某个时刻完成，网络抖动、机器负载或异步接口变慢时会出现过早操作；等待过久又拖慢测试。应等待可观测条件：用定位器动作的自动检查等待可见、稳定、可交互和启用状态，并对接口响应、业务状态或目标文本使用带超时的轮询和可重试断言。Playwright 的自动等待不等于所有异步任务完成，也不能把 networkidle 当作业务完成保证；超时后应保留日志、截图和请求信息排查。参考：[Playwright 自动等待](https://playwright.dev/docs/actionability)。

---

### 325. Redis 过期键的删除机制有哪些？

> 来源：[字节跳动 - Agent 研发 - 一面](https://www.nowcoder.com/feed/main/detail/0b91e9f5fbba4af4865c6fadc9a790e8)

Redis 通过访问时的被动过期检查与周期性的主动清理处理过期键，见 [Redis EXPIRE 文档](https://redis.io/docs/latest/commands/expire/)。在主节点正常处理访问时，过期键按不存在处理；这不意味着到期瞬间已释放全部物理内存，二者不能混淆。过期也不同于 maxmemory 下的淘汰。容量规划应监控过期、内存与延迟，业务不能把过期通知当作可靠任务队列；跨缓存副本、并发更新及数据库的一致性仍需独立设计。

---

### 326. 项目文档如何分阶段设计、维护并借助 AI 生成？

> 来源：[10.13 上海初创小厂面经](https://www.nowcoder.com/discuss/939554787337441280)

文档流程应与交付阶段绑定：立项时记录目标、范围、约束和风险；设计阶段维护架构、接口、数据模型及决策记录；开发阶段补充部署、配置、测试和运维说明；上线后记录变更、故障复盘和版本差异。为每类文档设负责人、评审点、模板、版本归属和失效检查，避免只生成不维护。AI 可根据仓库、接口定义和会议记录生成初稿、目录、变更摘要与检查清单，但必须限制输入权限，标注不确定内容，并由开发者核对事实、示例、敏感信息和可执行性；发布前用链接检查、示例测试和人工评审验收。

---

### 327. 通用业务系统的用户权限模型应该如何设计？

> 来源：[小公司校招面试](https://www.nowcoder.com/feed/main/detail/1e0150a1940e4a09a90e0a6bfa12bbfe)

先定义主体、资源、操作和租户范围，再选择模型：稳定的岗位权限可用 RBAC，资源归属、地域、时间、风险等级等动态条件可用 ABAC，实际系统常组合使用。策略应默认拒绝、最小权限，并在后端每次请求同时校验身份、操作权限、对象归属和 tenant scope，不能只依赖前端隐藏按钮。权限变更要考虑缓存失效、并发与撤权时效；高风险操作增加二次确认或审批。记录授权决策和管理变更审计，测试允许与拒绝、越权、跨租户和失效场景；策略应可版本化、回滚和定期清理。ABAC 可按主体、资源、操作、环境属性制定策略，参考：[NIST ABAC 指南](https://csrc.nist.gov/pubs/sp/800/162/upd2/final)。

---

### 328. 僵尸进程是如何产生的？父进程应该如何回收？

> 来源：[网易互娱｜AI应用开发实习一面](https://www.nowcoder.com/feed/main/detail/2d982457b8b94da09fab383e275de93d)

子进程退出后，内核仍保留其退出码等少量信息，等待父进程调用 wait 或 waitpid 回收；在此期间它就是僵尸，已不再执行，直接 kill 通常无效。父进程应处理 SIGCHLD，并循环调用 waitpid，配合 WNOHANG、检查 EINTR，避免漏收并防止阻塞。若父进程先退出，子进程会被适当的 reaper 收养，并在终止后回收；容器中的 PID 1 也应具备 reap 逻辑。可用 ps、/proc 和进程树定位父子关系，再检查父进程的回收路径与异常退出。详见 [Linux wait/waitpid 手册](https://man7.org/linux/man-pages/man2/waitpid.2.html)。

---

### 329. 如何让多个浏览器标签页共享一个 WebSocket 连接？

> 来源：[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60)

同源且处于相容分区的标签页，可用一致的脚本 URL 与名称连接同一个 SharedWorker，由它管理 WebSocket，各页面通过 MessagePort 提交订阅并接收结果，参见 [HTML Shared Workers 规范](https://html.spec.whatwg.org/multipage/workers.html#shared-workers-introduction)。连接管理还需处理鉴权续期、重连、订阅隔离和幂等；用心跳或租约识别页面失联，不能依赖卸载事件必达。验证浏览器支持与隐私分区行为，无法共享时提供独立连接等降级方案，避免把不同账号的数据广播给所有页面。

---

### 330. 如何从 Spring 容器、Bean 初始化和依赖加载等方面优化应用启动时间？

> 来源：[淘天 AI应用研发 一面](https://www.nowcoder.com/discuss/942091198347345920)

先测量再优化：使用 Spring Boot 的启动跟踪能力定位慢 Bean、classpath 扫描、数据库迁移和外部初始化等步骤，避免凭感觉删依赖。[Spring Boot 启动跟踪文档](https://docs.spring.io/spring-boot/reference/features/spring-application.html#features.spring-application.startup-tracking) 在保证条件成立时精简自动配置、缩小扫描范围、移除无用依赖，并把非关键初始化移出启动主路径。懒加载可缩短启动，但会把错误和耗时转移到首请求，不能替代就绪检查。应分别验证冷启动、就绪耗时、首请求、失败恢复和资源占用，确保迁移、连接池等关键依赖完成后才对外服务。

---

## 算法与手撕题单

以下题目来自本篇归档的面经来源，单独列出，不计入正文技术题数量。跨半年出现的同一题保留完整来源，按已标注的最早月份归档。

| 题目 | 来源 |
|------|------|
| 最大子数组和 | 拼多多提前批一面，7 月 30 日；[字节数据平台 Agent 一面](https://www.nowcoder.com/feed/main/detail/f5f840632a19417b91b8987762427a6a)；[敦煌网推荐算法](https://www.nowcoder.com/feed/main/detail/915613d6a3274e87b815a85ca8002a45) |
| 二叉树前序遍历、层序遍历 | 知乎后端一面，8 月 4 日；小红书数据库智能化一面，8 月 10 日；视频 b 二面；[阿里实习 AI Infra 面经](https://www.nowcoder.com/feed/main/detail/31edaaa47197404a8647601612312786)；[百度大模型研发一面](https://www.nowcoder.com/discuss/921590204903723008)；[奇怪の字节二面面经（大概率凉经）](https://www.nowcoder.com/feed/main/detail/bcf0b8497fcb4982b2292cafbcb08d69)；[字节 AI Agent 开发一面](https://www.nowcoder.com/feed/main/detail/9cd459d87a754e07a490ba7f1c03b495) |
| 两两交换链表节点 | 拼多多服务端三面，8 月 4 日；百度内容营销与广告一面，8 月 12 日 |
| 奇偶链表 | 字节后端社招一面，8 月 6 日 |
| 最长有效括号 | 字节后端社招二面，8 月 6 日；[虾皮 AI Infra 二面](https://www.nowcoder.com/feed/main/detail/62b9123e4b7f497285e7d6f68844cdd6)；[百度 Coding Agent 三面](https://www.nowcoder.com/feed/main/detail/b9521e2b51e04afeac0a3a32e13f4da9)；[美团 Agent 一面](https://www.nowcoder.com/feed/main/detail/58159306df52463ab75d72daa80d66df) |
| 数组第 K 大元素 / 中位数等顺序统计量 | 字节后端社招三面，8 月 6 日；[快手 AI 全栈一面](https://www.nowcoder.com/discuss/921807075905130496)；[淘宝闪购 AI 应用研发二面](https://www.nowcoder.com/feed/main/detail/09ec7c36a2774223a93044a02b2c3ec0)（超大数组中位数追问，原帖未给内存/外存约束）；[9.18 虾皮shopee chatbot研发实习一面凉经](https://www.nowcoder.com/feed/main/detail/9f02a7f8009d4aca9fc730a18b9f96cc)；[字节多模态大模型面经一面](https://www.nowcoder.com/discuss/932594519835443200)；[虾皮秋招 研发工程师](https://www.nowcoder.com/feed/main/detail/dcb2bf1c6b7c4b6a9f4c095ba9329bce) |
| 删除重复字符并保持字典序最小 | 字节 Agent 开发一面，8 月 9 日 |
| 有效括号字符串、最长递增子序列 | 小红书数据库智能化面经，8 月 10 日；[小红书/百度 Agent 开发实习一面](https://www.nowcoder.com/feed/main/detail/e319aadc79a9479397a6661a7f5ca088)；[阿里云 SOC Agent Infra 一面（LIS）](https://www.nowcoder.com/feed/main/detail/1bde9ba913d74ca6847962f679865f7e)；[字节剪映AI应用开发一面](https://www.nowcoder.com/feed/main/detail/7211e82c75284d23a89b569cd9dc289d) |
| SQL：查询平均工资最高部门的管理者 | 快手测开一面，8 月 12 日 |
| 最多 K 个重复元素的最长子数组（LC 2958） | 阿里云 AI 全栈开发一面 |
| 限制最大并发数为 3，批量调用外部接口 | 快手 Agent 开发一面 |
| 将扁平 List 转换为树形 JSON | 字节跳动 AI Agent 开发一面 |
| 合并两个有序数组 | 影石创新 AI Agent 一面；[多益三面](https://www.nowcoder.com/discuss/922801355649974272) |
| LRU Cache | 懂车帝 Agent 开发一面；[阶跃星辰 AI Infra 实习面经](https://www.nowcoder.com/feed/main/detail/320def38cd484da3bb26b01932996ef2)；[快手 AI Infra 校招面经](https://www.nowcoder.com/feed/main/detail/eccb5cafdfce452c8d56374ef070685d)；[虾皮一面](https://www.nowcoder.com/feed/main/detail/e133c2610bde4adc812bba66c62e1641)；[算能科技 Agent 开发一面](https://www.nowcoder.com/feed/main/detail/f832cb9f9c494fbfad7e492bada7ec19)；[字节跳动 AI Agent研发工程师｜AI算力基础设施 27秋招面经](https://www.nowcoder.com/discuss/930155293864914944)；[脑利一面](https://www.nowcoder.com/feed/main/detail/4002450a24194b4eaa759a2450cab7f5)；[拼多多AI Agent一面，双机位，全程严肃](https://www.nowcoder.com/feed/main/detail/3cb8b70b192f4051b3c19ace4dda1beb)；[cvte应用软件开发一面](https://www.nowcoder.com/feed/main/detail/c2155d2308de452c8a6e3cf2bbb482f3)；[字节业务中台AI全栈面经——日常实习](https://www.nowcoder.com/feed/main/detail/6ac5ba31705a4b64a407b087f39d5447)；[字节跳动火山引擎agent开发秋招一面](https://www.nowcoder.com/feed/main/detail/3ae147c4caaf40b580071ef9da71da2e)；[秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424)；[字节跳动 - Agent 研发 - 一面](https://www.nowcoder.com/feed/main/detail/0b91e9f5fbba4af4865c6fadc9a790e8) |
| 二叉树锯齿形层序遍历 | 字节跳动 AI Agent 开发一面；[字节AI全栈二面](https://www.nowcoder.com/discuss/938145178114592768) |
| 手写多头注意力（MHA） | 小鹏 VLA 大模型算法工程师一面；[滴滴一些面经合集（算法）](https://www.nowcoder.com/feed/main/detail/37cae17c5f2a49ee81375721f53bbf9b)；[9.14日美团多模态生成大模型二面](https://www.nowcoder.com/discuss/930520072370606080)；[淘天集团 Agent算法 一面](https://www.nowcoder.com/discuss/931957859154132992) |
| 顺时针旋转矩阵 90° / 旋转图像 | 小鹏 VLA 大模型算法工程师一面；[蔚来 AI Infra 一面（Python）](https://www.nowcoder.com/feed/main/detail/7cb7ccbb4a3145cf99dbb05aff767299)；[字节 AI 应用开发二面](https://www.nowcoder.com/feed/main/detail/7e8a821479a649fd914e449d312eeb95)；[小红书多模态秋招二面](https://www.nowcoder.com/discuss/930755993066041344)；[南方基金 AI应用大模型方向 笔面试梳理](https://www.nowcoder.com/feed/main/detail/0d707380326e4d8cbd3fa310c3f6f441) |
| 查找会议静默区间及多人重叠区间 | 字节跳动 AI Agent 一面 |
| 判断链表是否有环 | 视频 b 二面；[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60) |
| 实现平方根函数 | 文库相关岗位一面；[9.15 小红书 AI应用研发 一面](https://www.nowcoder.com/discuss/929475914579136512)；[滴滴一些面经合集（算法）](https://www.nowcoder.com/feed/main/detail/37cae17c5f2a49ee81375721f53bbf9b)；[传感器融合算法面试记录](https://www.nowcoder.com/feed/main/detail/3260e4c62b3c46fb89896f0371856f1d) |
| 岛屿数量（LC 200） | [蔚来 AI Infra 二面](https://www.nowcoder.com/feed/main/detail/74ccddd071f448809b56710c9f4e8730) |
| 按层交替方向旋转矩阵外圈一格 | [多公司 Infra 面经](https://www.nowcoder.com/feed/main/detail/2f0bb2d59bda4642a4ddab56ec1f210f) |
| 反转单链表 / 反转链表 II（LC 206/92） | [多公司 Infra 面经（LC 92）](https://www.nowcoder.com/feed/main/detail/2f0bb2d59bda4642a4ddab56ec1f210f)；[快手 AI 应用开发一面](https://www.nowcoder.com/feed/main/detail/631e9b79e433415ca3dea24642f94b4c)；[虾皮 Agent 开发一面](https://www.nowcoder.com/feed/main/detail/79fe3fc8f8cb4c4d9beca478f4279e3a)；[秋招第二挂 小红书](https://www.nowcoder.com/feed/main/detail/90c05c87e0414708976ab28b20a51d36) |
| 区间排序：合并区间（LC 56）/最多不重叠区间 | [阶跃星辰 AI Infra 实习面经（区间调度）](https://www.nowcoder.com/feed/main/detail/320def38cd484da3bb26b01932996ef2)；[快手大模型应用算法一面（合并区间）](https://www.nowcoder.com/feed/main/detail/026cc0d9002949dbbfd4570575039f9f)；[美团ai全栈一面](https://www.nowcoder.com/feed/main/detail/a5b8c6571f94441a8af10cd6af07ac3a)；[美团 正式批 二面 自动驾驶算法工程师](https://www.nowcoder.com/feed/main/detail/e8d80550c54142998826415f0de258a0)；[10.14 字节跳动 AI全栈开发实习一面](https://www.nowcoder.com/feed/main/detail/27b05099955e43d5a6a66013a2dea2c6) |
| K 个一组翻转链表（LC 25） | [美团北斗 AI Infra 校招面经](https://www.nowcoder.com/feed/main/detail/841452f926a140babb84585de97c04aa)；[阿里云 Agent开发 一二面](https://www.nowcoder.com/feed/main/detail/fee780e1140147fbbad0f23a74e265c6) |
| Pow(x, n)，计算数值的整数次方（LC 50） | [字节 AI Infra 实习面经](https://www.nowcoder.com/feed/main/detail/b99b6a7c7ff54453a2451d43488ade5a) |
| 合并两个或 K 个升序链表（LC 21/23） | [百度 AI Infra 实习面经（LC 23）](https://www.nowcoder.com/feed/main/detail/4a848f5616cf4f8783020b3143a68fbc)；[美团 AI Infra 实习面经（LC 23）](https://www.nowcoder.com/feed/main/detail/c94734d67c9f461ab950bf1d800c5643)；[美团 Agent 一面（LC 21）](https://www.nowcoder.com/feed/main/detail/58159306df52463ab75d72daa80d66df) |
| 二叉树右视图（LC 199） | [百度 AI Infra 实习面经](https://www.nowcoder.com/feed/main/detail/4a848f5616cf4f8783020b3143a68fbc)；[字节数据中台Agent全栈面经](https://www.nowcoder.com/feed/main/detail/fe77496948f74b4091ab4bb6e8156c8b) |
| 阶乘末尾零的个数（LC 172） | [快手 AI Infra 校招面经](https://www.nowcoder.com/feed/main/detail/c582fdfbc29d4c93ac9044005ad0a311) |
| 数组中连续相同数字的最大出现次数 | [字节 AI Infra 实习面经](https://www.nowcoder.com/feed/main/detail/2163c739242f4f8d82b35c906f0a69a9) |
| 10 点环上走 N 步回到原点的方案数 | [字节 AI Infra 后端面经](https://www.nowcoder.com/feed/main/detail/45814e935b894c4fb13d5a72c81e23a6) |
| 0-1 背包与完全背包 | [蔚来 AI Infra 面经](https://www.nowcoder.com/feed/main/detail/738d29de77ef4675bbac0a7d18ed1371) |
| 两数之和（LC 1） | [沐曦 AI Infra 一面](https://www.nowcoder.com/feed/main/detail/5f3629b12be346de8dbc954a75d0990f)；[字节 AML / 火山方舟 AI Infra 一面](https://www.nowcoder.com/discuss/921927475611869184)（数组可重复、元素不可复用、复杂度与原地排序追问） |
| 矩阵第 K 小元素（原帖有序约束未完整记录） | [腾讯 CDG AI Infra 框架侧面经](https://www.nowcoder.com/feed/main/detail/6bbfaca62dc64d45851f3ea6c48ff168) |
| 爬楼梯（递归、记忆化与动态规划，LC 70） | 字节火山引擎 Managed Agent 一面，2026 年 8 月 13 日；[阿里云 ai应用开发 一面](https://www.nowcoder.com/feed/main/detail/7e27cf4dedb142d9b643471ba31276ed)；[零一万物 知识图谱算法实习生一面](https://www.nowcoder.com/feed/main/detail/de81855bb25447bda52e11fe4d6af61d) |
| 最近 T 秒访问日志：按用户最后访问时间降序返回 | [百度 Coding Agent 一面](https://www.nowcoder.com/feed/main/detail/b9521e2b51e04afeac0a3a32e13f4da9) |
| 统计包含数组全部不同值的连续子数组数量 | [拼多多大模型算法一面](https://www.nowcoder.com/discuss/922592377364041728) |
| 递归合并嵌套 JSON（dict/list/数值/字符串/布尔规则，且不修改输入） | [字节 Agent 开发一面](https://www.nowcoder.com/feed/main/detail/d2cf5165d1184b59879eff5793b7b453)；[字节 AI Agent 开发 一面（抖音电商 · 一面掉池子里面了）](https://www.nowcoder.com/discuss/932407145864130560) |
| 最长回文子串（LC 5） | [字节数据平台 Agent 一面](https://www.nowcoder.com/feed/main/detail/f5f840632a19417b91b8987762427a6a)；[百度 AI 测开一面](https://www.nowcoder.com/feed/main/detail/cd8e446a6ec14edfa53cf4c7b6864c4d)；[字节 AI Agent 研发一面](https://www.nowcoder.com/feed/main/detail/2ba7e96d48634777990b28c2cb322f40)；[小红书 Agent 平台研发一面](https://www.nowcoder.com/discuss/931189826643066880)；[字节广告团队agent面经（一二面）](https://www.nowcoder.com/discuss/930870582843805696)；[字节跳动火山引擎agent开发秋招二面](https://www.nowcoder.com/feed/main/detail/329a57a7469045058209b214e387e32c) |
| 最长公共前缀 | [元石科技后端/Agent 一面](https://www.nowcoder.com/discuss/921742843704549376)；[美团agent一面](https://www.nowcoder.com/feed/main/detail/554bdcc695ae42f8b0d78e3c44dd17d5) |
| 大数乘法 | [腾讯 WXG 微信读书一面](https://www.nowcoder.com/feed/main/detail/3ffc762437274543b6a8f5e2ea6fb535) |
| URL 查询参数解析为 Map | [大方云图研发实习一面](https://www.nowcoder.com/feed/main/detail/a9a40feb4e1e4d0ca7c3f8c3ba67d487) |
| 两个栈实现队列，并追问线程安全 | [字节 Agent 开发一面](https://www.nowcoder.com/discuss/921444774287003648)；[字节算法（Agent）凉经](https://www.nowcoder.com/feed/main/detail/6d80836574e647d39eb9842dc4131ace)；[字节AI Agent开发工程师（质量方向）TikTok Shop一面](https://www.nowcoder.com/feed/main/detail/57326acc86fb4f72a21d09e1410e5121) |
| 所有连续数字子串的十进制数值之和 | [京东 8 月 22 日笔试](https://www.nowcoder.com/feed/main/detail/37e060c563034371aba1a42da88822d7) |
| 手写防抖函数（leading/trailing、取消、参数与异步竞态） | [拼多多 AI 全栈两轮技术面](https://www.nowcoder.com/discuss/921104232256675840)；[度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368) |
| 网格中最多破坏 k 面墙的最短路径（状态扩展 BFS） | [拼多多大模型算法二面](https://www.nowcoder.com/discuss/924420940409081856) |
| 编辑距离（LC 72） | [蔚来座舱大模型后训练/Agentic 算法一面](https://www.nowcoder.com/discuss/924316280604086272) |
| 嵌套字符串解码（如 `3[ab2[c]]`） | [阿里云 Agent Infra 一面](https://www.nowcoder.com/discuss/924245733962719232) |
| SQL：查询每个部门工资最高员工，并保留并列最高 | [字节中国交易与广告 AI 应用开发一面](https://www.nowcoder.com/feed/main/detail/b34f6902e8544fe2953696ed52e49dba) |
| 三维接雨水（LC 407） | [字节中国交易与广告 AI 应用开发一面](https://www.nowcoder.com/feed/main/detail/b34f6902e8544fe2953696ed52e49dba) |
| KeyedExecutor：同 key 串行、跨 key 并行，并保证提交/消费线程安全 | [字节中国交易与广告 AI 应用开发一面](https://www.nowcoder.com/feed/main/detail/b34f6902e8544fe2953696ed52e49dba) |
| 和为 K 的最长连续子数组 | [快手广告大模型一面](https://www.nowcoder.com/discuss/923996140154953728)；[华为 一面 车BU 多模态大模型 AI算法工程师](https://www.nowcoder.com/feed/main/detail/3f64d287fcab43979808e9441d130ef0) |
| 数组中出现频率 Top-K 的数字 | [快手广告大模型一面](https://www.nowcoder.com/discuss/923996140154953728) |
| 有序 `1..N` 序列删除一个元素后找缺失值（多种解法） | [快手 AI 全栈一面](https://www.nowcoder.com/feed/main/detail/a30242712e8d456c839ff4223470f491) |
| 最长相邻字符不同子串 | [PDD AI Infra 笔试](https://www.nowcoder.com/discuss/923681250647232512) |
| 单栈排列：按 `1..n` 输出并给出 In/Out 操作 | [PDD AI Infra 笔试](https://www.nowcoder.com/discuss/923681250647232512) |
| 城市加油：`(city, fuel)` 分层图最短路 | [PDD AI Infra 笔试](https://www.nowcoder.com/discuss/923681250647232512) |
| 删除每个时段后判断区间可选顾客能否完美匹配 | [PDD AI Infra 笔试](https://www.nowcoder.com/discuss/923681250647232512) |
| 模 m 配对：最小化 `sum((a_i + b_pi) mod m)` | [滴滴 2026-08-30 算法笔试](https://www.nowcoder.com/discuss/923680192650809344) |
| 构造 `a_i >= b_i` 且每个长度 L 窗口和模 m 为 0，使总增量最小 | [滴滴 2026-08-30 算法笔试](https://www.nowcoder.com/discuss/923680192650809344) |
| 数组多数元素（LC 169） | [算能科技 Agent 开发一面](https://www.nowcoder.com/feed/main/detail/f832cb9f9c494fbfad7e492bada7ec19) |
| 手写整数转字符串 | [阿里云可观测存储 AI Agent 工程岗一面](https://www.nowcoder.com/discuss/923528884249710592) |
| 已知明文以 `CHICKEN` 开头、使用固定整数 key 的逐字符 XOR 解密 | [蔚来 NIO 算法大模型笔试](https://www.nowcoder.com/discuss/923280565447426048) |
| 反复对 `2x2` 子矩阵取第二大，直到剩一个数 | [蔚来 NIO 算法大模型笔试](https://www.nowcoder.com/discuss/923280565447426048) |
| SQL：指定日期新注册用户中，各登录端口的最早登录者 | [蔚来 NIO 算法大模型笔试](https://www.nowcoder.com/discuss/923280565447426048) |

| Top-K 高频单词 | [华为 二面 车BU 多模态大模型 AI算法工程师](https://www.nowcoder.com/feed/main/detail/9b4891bbe3004b62b13772e2662f1486) |
| 实现前缀树（Trie） | [字节数据中台Agent全栈面经](https://www.nowcoder.com/feed/main/detail/fe77496948f74b4091ab4bb6e8156c8b) |
| 大整数加法 | [字节 AI 全栈一面（飞书）](https://www.nowcoder.com/discuss/931555466247700480)；[字节算法（Agent）凉经](https://www.nowcoder.com/feed/main/detail/6d80836574e647d39eb9842dc4131ace) |
| O(n) 时间 O(1) 空间寻找递增三元组 | [pdd 9.19 线下面试](https://www.nowcoder.com/feed/main/detail/7c13db0617cd41f49ed495cebfe04482) |
| 使用 wait/notify 实现生产者消费者栈 | [阿里云 ai应用开发 一面](https://www.nowcoder.com/feed/main/detail/7e27cf4dedb142d9b643471ba31276ed) |
| 删除最短连续子数组使剩余和被 K 整除 | [pdd ai infra 提前批 一面面经](https://www.nowcoder.com/discuss/930808011218571264) |
| 重排链表为首尾交替顺序 | [度小满一面](https://www.nowcoder.com/feed/main/detail/41baab8c631647568203ebfaf3898574) |
| 三数之和 | [搜狐畅游 Agent 开发一面（已oc）](https://www.nowcoder.com/feed/main/detail/f0648c2e373f4f03a10dd0fffbd235cd)；[9.18号合合信息多模态大模型算法研究员-一面](https://www.nowcoder.com/discuss/933406132259868672)；[10.8 pdd秋招 agent 一面](https://www.nowcoder.com/feed/main/detail/b7c5a262265f41e6ab95c008f7dd31de) |
| 支持泛型与过期时间的 LRU Cache | [拼多多AI Agent一面，双机位，全程严肃](https://www.nowcoder.com/feed/main/detail/3cb8b70b192f4051b3c19ace4dda1beb)；[字节 AI Agent全栈开发 面经](https://www.nowcoder.com/feed/main/detail/88e22e99028942bcbac1ed57395f2e60) |
| 除一个元素外其余元素均出现三次时找唯一元素 | [快手AI全栈三面](https://www.nowcoder.com/discuss/929747739645136896) |
| 求两个有序列表的交集 | [字节 Agent 秋招一面](https://www.nowcoder.com/discuss/929731481189044224) |
| 复原 IP 地址 | [度小满AI全栈一面](https://www.nowcoder.com/discuss/931241025345978368) |
| 搜索旋转排序数组 | [pdd 9.19 线下面试](https://www.nowcoder.com/feed/main/detail/7c13db0617cd41f49ed495cebfe04482)；[9.18号合合信息多模态大模型算法研究员-一面](https://www.nowcoder.com/discuss/933406132259868672) |
| 分割数组使两部分总价值差最小 | [pdd 9.19 线下面试](https://www.nowcoder.com/feed/main/detail/7c13db0617cd41f49ed495cebfe04482) |
| 买卖股票的最佳时机：不限交易次数 | [字节agent一面凉经](https://www.nowcoder.com/feed/main/detail/e0790151fa6a4f619654531a840080c6) |
| 买卖股票的最佳时机：最多两次交易 | [字节agent一面凉经](https://www.nowcoder.com/feed/main/detail/e0790151fa6a4f619654531a840080c6) |
| 买卖股票的最佳时机 IV：最多进行 k 次交易 | [字节agent一面凉经](https://www.nowcoder.com/feed/main/detail/e0790151fa6a4f619654531a840080c6) |
| 用给定数字组成小于 num 的最大数字 | [字节广告团队agent面经（一二面）](https://www.nowcoder.com/discuss/930870582843805696) |
| 全排列 | [蔚来——大模型算法岗（智能座舱/自动驾驶）实习一面](https://www.nowcoder.com/discuss/930755708008558592)；[HW技术一面（10.13）](https://www.nowcoder.com/feed/main/detail/978bed84f8f74b31b7f3798a71f67f5a) |
| 快速排序 | [9.18 虾皮shopee chatbot研发实习一面凉经](https://www.nowcoder.com/feed/main/detail/9f02a7f8009d4aca9fc730a18b9f96cc)；[网易互娱｜AI应用开发实习一面](https://www.nowcoder.com/feed/main/detail/2d982457b8b94da09fab383e275de93d) |
| 判断二叉树是否为另一棵二叉树的子结构 | [字节 Agent 秋招一面](https://www.nowcoder.com/discuss/929731481189044224)；[字节Agent全三轮面经](https://www.nowcoder.com/feed/main/detail/b4fb3bee56134c3d9bcde6a3166a1711) |

| 滑动窗口最大值 | [百度 AIGC 多模态智能体算法工程师二面](https://www.nowcoder.com/feed/main/detail/2d033fd6daa04e2aaad2282b75531bbc) |
| 和为 K 的连续子数组数量 | [百度 AIGC 多模态智能体算法工程师二面](https://www.nowcoder.com/feed/main/detail/2d033fd6daa04e2aaad2282b75531bbc)；[小红书 Product Engineer（AI与全栈方向）-社区工程 一面面经](https://www.nowcoder.com/feed/main/detail/70ad5ead2f784676b0b399eab877d3d4)；[10.12字节推荐算法实习](https://www.nowcoder.com/feed/main/detail/b1c21204dc174dab82206bb3a2f94902) |
| 最大乘积子数组（O(1)额外空间） | [百度 AIGC 多模态智能体算法工程师一面](https://www.nowcoder.com/feed/main/detail/5b720bd1dbb3489986697d6bcd0747f3) |
| 网格不同路径 | [小红书广告交易算法日常实习面经](https://www.nowcoder.com/feed/main/detail/e91bea35822a44cda5192ea9c5efea0d) |
| 最长公共子序列 | [字节多模态大模型面经一面](https://www.nowcoder.com/discuss/932594519835443200)；[记录最爽，不折腰的一次面试：小红书秋招一面](https://www.nowcoder.com/feed/main/detail/bebc8a5d22d141d09efc4e0a74031365) |
| 有父指针的二叉树最近公共祖先 | [9.14字节推荐架构一面](https://www.nowcoder.com/feed/main/detail/467d01beed8a40b89ac414b90fc7fb85) |
| 矩阵对角线 Z 字形遍历 | [腾讯 TEG 云架构平台部一面、二面面经](https://www.nowcoder.com/feed/main/detail/6aa13bf7472441bb9c5174ee8e7af078) |
| 海量数据中查找只出现一次的元素 | [腾讯 TEG 云架构平台部一面、二面面经](https://www.nowcoder.com/feed/main/detail/6aa13bf7472441bb9c5174ee8e7af078) |
| 生成所有有效括号组合 | [拼多多 agent 一面凉经](https://www.nowcoder.com/feed/main/detail/4dd4b979b1f74625aaef3e7b975142ba) |
| 组合 | [【面经】字节/AI 应用工程师 一面挂经……](https://www.nowcoder.com/discuss/933023499399024640) |
| 约瑟夫环 | [阿里虎鲸文娱 - AI 基础设施 - 一面](https://www.nowcoder.com/feed/main/detail/9c2e1794ccc14448a6fc43d596f60f00) |
| 用 random5 实现等概率 random7 | [字节 Agent 秋招二面](https://www.nowcoder.com/discuss/932657562825027584)；[字节Agent全三轮面经](https://www.nowcoder.com/feed/main/detail/b4fb3bee56134c3d9bcde6a3166a1711) |
| 不用取余判断整数奇偶 | [腾讯 TEG 云架构平台部一面、二面面经](https://www.nowcoder.com/feed/main/detail/6aa13bf7472441bb9c5174ee8e7af078) |
| 目标和 | [字节全栈一面](https://www.nowcoder.com/feed/main/detail/a01aeac81ad342d88252f899c47f2dc4) |
| 最小路径和：网格中仅向右或向下走 | [字节 260907 一面面经](https://www.nowcoder.com/discuss/935858952644939776) |
| 字符流中的第一个唯一字符 | [度小满 - AI 全栈研发 - 一面](https://www.nowcoder.com/feed/main/detail/f9c29fa841664294b8ab7e9921072afd) |
| 数组最大下降幅度：求 i < j 时 a[i] - a[j] 的最大值 | [美团 正式批 一面 自动驾驶算法工程师](https://www.nowcoder.com/feed/main/detail/4065102c270e40758437b32297f58836) |
| 完全平方数（LC 279） | [海底捞AI工程师实习生一面](https://www.nowcoder.com/feed/main/detail/17ac832a4f644705a52b007f351bd485) |
| 二叉树非递归中序遍历 | [虾皮秋招 研发工程师](https://www.nowcoder.com/feed/main/detail/dcb2bf1c6b7c4b6a9f4c095ba9329bce) |
| 最短无序连续子数组 | [秋招-字节跳动-抖音电商-Agent开发一/二/三面](https://www.nowcoder.com/discuss/937314680270311424) |
| 点分段字符串通配符匹配 | [虾皮秋招 研发工程师](https://www.nowcoder.com/feed/main/detail/dcb2bf1c6b7c4b6a9f4c095ba9329bce) |
| 轮转数组 | [10.8 pdd秋招 agent 一面](https://www.nowcoder.com/feed/main/detail/b7c5a262265f41e6ab95c008f7dd31de) |
| 存取款账户余额模拟 | [9.30 binance AI全栈开发实习一面](https://www.nowcoder.com/feed/main/detail/e2194645f6a44f68ab131372025297c1) |
| 余额不足取款的延迟处理 | [9.30 binance AI全栈开发实习一面](https://www.nowcoder.com/feed/main/detail/e2194645f6a44f68ab131372025297c1) |
| 删除链表倒数第 N 个节点 | [字节 Agent 日常一面](https://www.nowcoder.com/feed/main/detail/0ee160a2d38f4b5daaf1965cf975a8f0)；[快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512) |
| 带禁行位置的加减步最短路 | [华为 线下二面+主管面](https://www.nowcoder.com/discuss/941801097880952832) |
| 四数之和 | [理想智能应用研发一面](https://www.nowcoder.com/discuss/941713098040221696) |
| 拼接形成最大数 | [字节Agent全三轮面经](https://www.nowcoder.com/feed/main/detail/b4fb3bee56134c3d9bcde6a3166a1711) |
| 带步数限制的爬楼梯方案数 | [小红书产品工程师agent开发一面](https://www.nowcoder.com/feed/main/detail/f0950469136e47b0828373cfeefd82ce) |
| 按用户透视科目分数并填充缺失值 | [快手ai全栈一面](https://www.nowcoder.com/discuss/939918937486016512) |
| 接雨水 | [字节AI Agent开发工程师（质量方向）TikTok Shop一面](https://www.nowcoder.com/feed/main/detail/57326acc86fb4f72a21d09e1410e5121) |
| 解数独 | [华为2027应届生秋招｜10.20 AI模型工程师](https://www.nowcoder.com/feed/main/detail/65b5b2830923462b8ae291bab665881c) |
| 最大正方形（LC 221） | [10.12字节推荐算法实习](https://www.nowcoder.com/feed/main/detail/b1c21204dc174dab82206bb3a2f94902) |
| 八皇后问题 | [小红书ai agent一面](https://www.nowcoder.com/discuss/940294942633504768) |
