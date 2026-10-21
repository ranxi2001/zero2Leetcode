# Third-Party Notices

## Interview Answer References

The 2026 summer interview answers added on 2026-08-28 were independently written and checked against these primary references:

- [Python language reference: Calls](https://docs.python.org/3/reference/expressions.html#calls) and [Data model](https://docs.python.org/3/reference/datamodel.html) — callable objects, function arguments, closures, and bound methods.
- [Celery Tasks](https://docs.celeryq.dev/en/stable/userguide/tasks.html) — task retry, acknowledgement, result backends, and idempotency boundaries.
- [MyBatis Configuration](https://mybatis.org/mybatis-3/configuration) — environments, mappers, type handlers, transactions, and caches.
- [React `useEffect`](https://react.dev/reference/react/useEffect) — setup, cleanup, reactive dependencies, and development Strict Mode behavior.
- [MDN Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) and [`ReadableStream`](https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream) — browser streaming events, framing, cancellation, and incremental consumption.
- [RFC 9111: HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html) — freshness, validation, cache directives, and validators.

No upstream prose or examples are reproduced. Version-specific behavior remains subject to the linked projects' current documentation.

## Interview Answer References (2026-09-21)

The additional 2026-09-15 through 2026-09-21 backend interview answers were independently written from public Nowcoder recollections. Framework-specific claims were checked against [Spring AI Reference](https://docs.spring.io/spring-ai/reference/), [NVIDIA Nsight Compute Documentation](https://docs.nvidia.com/nsight-compute/NsightCompute/index.html), and [NVIDIA Nsight Systems User Guide](https://docs.nvidia.com/nsight-systems/UserGuide/index.html). No upstream prose or code is reproduced.

## Interview Answer References (2026-09-02)

The interview answers added from the 2026-08-29 through 2026-09-02 audit were independently written and checked against these primary references:

- [Intel SGX EPC oversubscription](https://cdrdv2-public.intel.com/671471/sgx-oversubscription.pdf) - protected EPC paging and oversubscribed working-set behavior.
- [WHATWG Fetch CORS protocol](https://fetch.spec.whatwg.org/#http-cors-protocol) - browser-enforced cross-origin requests and preflight semantics.
- [Spring BeanFactory](https://docs.spring.io/spring-framework/reference/core/beans/beanfactory.html) and [Environment abstraction](https://docs.spring.io/spring-framework/reference/core/beans/environment.html) - IoC container boundaries, ordered property sources, and application configuration.
- [Apache RocketMQ delay messages](https://rocketmq.apache.org/docs/featureBehavior/02delaymessage/) - current delayed-delivery lifecycle, limits, persistence, and retry behavior.
- [Java SE 25 Selector](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/nio/channels/Selector.html) and [Oracle G1 GC](https://docs.oracle.com/en/java/javase/25/gctuning/garbage-first-g1-garbage-collector1.html) - NIO readiness selection and collector-specific concurrent-start marking.
- [Microsoft Windows container isolation](https://learn.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container) and [Docker Desktop VMM](https://docs.docker.com/desktop/features/vmm/) - process isolation, Hyper-V isolation, and Linux VM backends on Windows.
- [fio documentation](https://fio.readthedocs.io/en/master/fio_doc.html) and [FastAPI async guidance](https://fastapi.tiangolo.com/async/) - reproducible I/O workload parameters and event-loop versus blocking execution boundaries.
- [React Render and Commit](https://react.dev/learn/render-and-commit) and [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state) - component render/commit phases and state identity in the UI tree.

No upstream prose, code, or benchmark numbers are reproduced. Hardware results and version-specific framework behavior remain subject to the linked documentation.

## CheerpJ 4.3

Java 17 runs in the visitor's browser using CheerpJ Core loaded from the official
Leaning Technologies CDN. CheerpJ is used under the CheerpJ Community License;
the runtime is not redistributed or self-hosted by this repository.

- Project: https://cheerpj.com/
- License: https://cheerpj.com/docs/licensing
- Runtime: https://cjrtnc.leaningtech.com/4.3/loader.js

## Eclipse Compiler for Java 3.42.0

`assets/vendor/zero2leetcode-java-runner-20260803.jar` contains the Eclipse Compiler for
Java (ECJ) 3.42.0 and the Zero2Leetcode browser runner bridge. ECJ is distributed
under the Eclipse Public License 2.0. The complete license text is included at
[`LICENSE-EPL-2.0.txt`](LICENSE-EPL-2.0.txt).

- Project: https://github.com/eclipse-jdt/eclipse.jdt.core
- Source revision: `079cb7d18d40ad6a21f8b5e711366404d56fe71f`
- License: https://www.eclipse.org/legal/epl-2.0/
- Original artifact: https://repo.maven.apache.org/maven2/org/eclipse/jdt/ecj/3.42.0/ecj-3.42.0.jar
- Original SHA-256: `29F6D3918EE02DB4400C103BC25DD90A22491C3A395867D9393070CB96A7DD29`

## Eclipse Temurin 21.0.12+8 / OpenJDK API Signatures

`assets/vendor/zero2leetcode-java-runner-20260803.jar` contains compile-time
Java 17 API signature data derived from `lib/ct.sym` in Eclipse Temurin
21.0.12+8. The GitHub Pages build uses the Linux x64 JDK. The build extracts
the `H` release entries (Java 17) from every module represented in `ct.sym`,
omits module descriptors, and packages the remaining `.sig` files for ECJ's
platform class path. These files are compiler signatures only; the Temurin JVM
is not embedded or executed by the site.

The Temurin distribution and the derived OpenJDK signature data are provided
under the GNU General Public License, version 2, with the Classpath Exception
(`GPL-2.0 WITH Classpath-exception-2.0`). The original Temurin notice, release
metadata, GPLv2 with Classpath Exception text, and the complete legal notices
for all modules in the source JDK are preserved under
[`third_party/temurin-21.0.12+8/`](third_party/temurin-21.0.12+8/).

- Project: https://adoptium.net/temurin/
- Release: https://github.com/adoptium/temurin21-binaries/releases/tag/jdk-21.0.12%2B8
- CI source archive: [OpenJDK21U-jdk_x64_linux_hotspot_21.0.12_8.tar.gz](https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.12%2B8/OpenJDK21U-jdk_x64_linux_hotspot_21.0.12_8.tar.gz)
- CI source archive size: `207486543` bytes
- CI source archive SHA-256: `E4446FF06A276155697597CC0F1B15DA004FF083F4964A35271ECEE567177370`
- CI checksum record: https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.12%2B8/OpenJDK21U-jdk_x64_linux_hotspot_21.0.12_8.tar.gz.sha256.txt
- CI `lib/ct.sym` size: `10715134` bytes
- CI `lib/ct.sym` SHA-256: `5448AC59687B76A2F2A08F87B59B2DEEAE5CDC904914B5674510114E7ADF84B3`
- Cross-platform check: all `4692` extracted Java 17 signature entries are byte-identical in the Linux x64 and Windows x64 Temurin archives for this release.
- JDK source revision: https://github.com/adoptium/jdk21u/commit/04806bcb1d50b35efc1c22a4d3b082c9a9a47563
- Temurin build revision: https://github.com/adoptium/temurin-build/commit/e6ba7dec3d07654074559310376a3ae89da5f4ac
- Original notice: [`NOTICE`](third_party/temurin-21.0.12+8/NOTICE)
- Original release metadata: [`release`](third_party/temurin-21.0.12+8/release)
- Complete module notices: [`legal/`](third_party/temurin-21.0.12+8/legal/)

## Interview Answer References (2026-10-07)

The incremental answers from the September 23 through October 7 interview review were independently written using these primary references:

- [jcmd](https://docs.oracle.com/en/java/javase/25/docs/specs/man/jcmd.html)
- [TCP 标准](https://www.rfc-editor.org/rfc/rfc9293.html#section-3.5)
- [MySQL InnoDB 文档](https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html)
- [Redis 分布式锁文档](https://redis.io/docs/latest/develop/clients/patterns/distributed-locks/)
- [OpenAPI](https://spec.openapis.org/oas/latest.html#operation-object)
- [MySQL 索引文档](https://dev.mysql.com/doc/refman/8.4/en/optimization-indexes.html)
- [Druid 配置文档](https://github.com/alibaba/druid/wiki/DruidDataSource%E9%85%8D%E7%BD%AE%E5%B1%9E%E6%80%A7%E5%88%97%E8%A1%A8)
- [Oracle OOM 排查文档](https://docs.oracle.com/en/java/javase/25/troubleshoot/troubleshooting-memory-leaks.html)
- [请求处理文档](https://nginx.org/en/docs/http/request_processing.html)
- [proxy_pass](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)
- [Docker 容器概念](https://docs.docker.com/get-started/docker-concepts/the-basics/what-is-a-container/)
- [CLI 文档](https://docs.docker.com/reference/cli/docker/)
- [Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy)
- [Android Activity lifecycle](https://developer.android.com/guide/components/activities/activity-lifecycle)


No upstream prose, code, figures, or datasets are reproduced. Protocol and implementation facts are attributed at the relevant answer; architecture, evaluation, and operational recommendations are independent engineering analysis. Public interview links document question provenance only.


## Weekly Interview Answer References (2026-10-13)

The answers updated from the October 7–13 interview review were independently written and checked against these primary references:

- [HTTP 语义 RFC 9110](https://datatracker.ietf.org/doc/html/rfc9110)
- [MySQL EXPLAIN 文档](https://dev.mysql.com/doc/refman/8.4/en/explain-output.html)
- [ReentrantLock 文档](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/concurrent/locks/ReentrantLock.html)
- [Python free-threading 文档](https://docs.python.org/3/howto/free-threading-python.html)
- [Spring @Transactional 文档](https://docs.spring.io/spring-framework/reference/data-access/transaction/declarative/annotations.html)
- [Spring Task Execution](https://docs.spring.io/spring-framework/reference/integration/scheduling.html)
- [FastAPI SQL 数据库教程](https://fastapi.tiangolo.com/tutorial/sql-databases/)
- [ODB 官方仓库](https://github.com/codesynthesis-com/odb)
- [Drogon 官方仓库](https://github.com/drogonframework/drogon)
- [Linux sendfile 手册](https://man7.org/linux/man-pages/man2/sendfile.2.html)
- [Redis Lua 文档](https://redis.io/docs/latest/develop/programmability/eval-intro/)
- [Redis keyspace notifications 文档](https://redis.io/docs/latest/develop/pubsub/keyspace-notifications/)
- [Redis 内存淘汰文档](https://redis.io/docs/latest/develop/reference/eviction/)
- [Redis Pipeline 文档](https://redis.io/docs/latest/develop/using-commands/pipelining/)
- [《TCP 拥塞控制 RFC 5681》](https://www.rfc-editor.org/info/rfc5681)
- [PATCH RFC 5789](https://www.rfc-editor.org/rfc/rfc5789)
- [WebSocket 协议 RFC 6455](https://www.rfc-editor.org/rfc/rfc6455)
- [OAuth 2.0 安全最佳实践](https://www.rfc-editor.org/rfc/rfc9700)

No upstream prose, code, diagrams, or datasets are reproduced. Interview links establish question provenance; the linked specifications, papers, and official implementations establish answer facts. Architecture, testing, deployment, and evaluation recommendations are independent engineering analysis.


## Interview Answer References (2026-10-22)

The October 13–22 question-bank update independently explains mechanisms and engineering tradeoffs using these primary references:

- [NIST ABAC 指南](https://csrc.nist.gov/pubs/sp/800/162/upd2/final)
- [MySQL 文档](https://dev.mysql.com/doc/refman/8.4/en/explain-output.html)
- [JLS 对象创建过程](https://docs.oracle.com/javase/specs/jls/se25/html/jls-12.html#jls-12.5)
- [Java 方法调用规范](https://docs.oracle.com/javase/specs/jls/se25/html/jls-15.html#jls-15.12)
- [Spring Boot 启动跟踪文档](https://docs.spring.io/spring-boot/reference/features/spring-application.html#features.spring-application.startup-tracking)
- [FastAPI ASGI Server 文档](https://fastapi.tiangolo.com/deployment/manually/)
- [Google Benchmark 指南](https://github.com/google/benchmark/blob/main/docs/user_guide.md)
- [React Hooks 当前实现](https://github.com/react/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js)
- [HTML Shared Workers 规范](https://html.spec.whatwg.org/multipage/workers.html#shared-workers-introduction)
- [C++ Core Guidelines RAII](https://isocpp.github.io/CppCoreGuidelines/CppCoreGuidelines#Rr-raii)
- [Linux wait/waitpid 手册](https://man7.org/linux/man-pages/man2/waitpid.2.html)
- [Playwright 自动等待](https://playwright.dev/docs/actionability)
- [React Hooks 调用规则](https://react.dev/reference/eslint-plugin-react-hooks/lints/rules-of-hooks)
- [Redis EXPIRE 文档](https://redis.io/docs/latest/commands/expire/)
- [Uvicorn 部署文档](https://uvicorn.dev/deployment/)
- [Chromium 多进程架构](https://www.chromium.org/developers/design-documents/multi-process-architecture/)
- [Electron Process Model](https://www.electronjs.org/docs/latest/tutorial/process-model)
- [UDP RFC 768](https://www.rfc-editor.org/info/rfc768/)

Interview links in the articles establish question provenance. These references establish specific answer facts; deployment, evaluation, and testing recommendations are independent engineering analysis. No upstream article, source code, figure, or dataset is reproduced.
