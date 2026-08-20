---
layout: default
title: 蚂蚁 AI Coding 8.20：医院门诊排队叫号系统
description: 蚂蚁 2026 年 8 月 20 日 AI Coding 笔试另一道工程题：医院门诊排队叫号系统，整理可确认题面、系统设计、状态机、排队策略、终端协作与 CodeFuse 作答方法
keywords: 蚂蚁AI Coding, 蚂蚁笔试, 医院门诊排队叫号系统, 排队系统, 状态机, CodeFuse, Agent工程
eyebrow: 大厂真题 / 蚂蚁
permalink: /04_real_interviews/ant/ai-coding-hospital-20260820/
---

# 蚂蚁 AI Coding 8.20 真题解析：医院门诊排队叫号系统

## 题面说明

这是 2026 年 8 月 20 日蚂蚁 AI Coding 笔试中披露的另一道工程题。当前能确认的题面来自考试环境截图，截图只展示了 README 前半部分；患者来源、完整业务规则、输出要求、验收命令和隐藏测试规则均未完整展示。

因此本文分成两部分：

- **题面还原**：只记录截图中能够确认的内容；
- **解题建议**：参考同类医院排队系统给出可落地的工程设计，但不会把推测内容包装成官方固定要求。

---

## 一、截图中可以确认的题面

### 项目标题

```text
医院门诊排队叫号系统
```

### 背景

某医院门诊部需要一套信息化排队系统，替代现有的手工叫号方式。医院业务涉及多科室协作、多种患者类型和复杂的就诊流程，系统需要能够灵活应对实际运营中的各种情况。

### 开发时间

题面标注的开发时间为 **2 小时**。

### 系统需要支持的终端

医院方面要求系统支持以下角色。终端形式、访问方式、通信协议和部署方案由开发者自行设计：

- **患者端**：供来院就诊的患者使用；
- **医生端**：供各科室医生使用；
- **护士端**：供分诊护士使用；
- **显示端**：供候诊区展示信息；
- **管理端**：供医院管理人员使用。

### 业务场景

医院有多个科室，每个科室有若干诊室和医生。患者来院后需要取号、排队和就诊。

题面当前可见的科室情况包括：

- **综合科室**：患者流量较大，号源类型多样；
- **专科**：可能有特殊就诊规则；
- **急诊**：需要快速响应；
- **其他类型科室**。

截图中“患者来源”标题下能够看到的条目是：

- 直接来院的患者。

患者来源部分在截图底部被截断，是否还有其他来源，不能仅根据当前图片确定。完整规则必须以考试环境中的 README 为准。

---

## 二、这道题的核心难点

这不是简单的“维护一个先进先出队列”。真正的难点在于：多个角色同时操作多个科室，患者可能有不同类型，医生和护士对队列的操作权限也不同。

### 1. 角色多，但核心状态应该统一

患者端、医生端、护士端、显示端和管理端只是不同视图与操作入口，不能为每个端维护一套独立状态。推荐由一个中心服务保存业务状态，所有终端通过 API 或事件订阅访问它。

```text
患者端 ─┐
医生端 ─┤
护士端 ─┼─> 排队服务 ─> 数据库/事件流
显示端 ─┤       │
管理端 ─┘       └─> 状态变更通知
```

2 小时考试中，优先选择一个简单可靠的中心化架构，不要为了“高级”而引入不熟悉的微服务、消息队列或复杂权限系统。

### 2. 排队规则不能散落在界面代码里

患者取号、护士分诊、医生叫号、过号、完成就诊、取消和转科等行为都属于业务规则。它们应该由队列服务统一校验，而不是让患者端、医生端各自判断一遍。

### 3. 显示端需要看到稳定的状态

候诊区显示屏通常需要展示：当前科室、诊室、正在就诊号码、下一位或候诊列表。显示端不能通过“猜测最后一次操作”来更新画面，而应读取服务端的当前状态或订阅明确的状态变更事件。

---

## 三、推荐的最小可行架构

### 技术选型

在 2 小时限制下，可以采用：

- Python；
- FastAPI 或 Flask；
- SQLite；
- 简单 HTML/终端界面，或使用现成 TUI 库；
- HTTP API + 短轮询。

如果候选人更熟悉 Node.js，也可以使用 Express/NestJS + SQLite。技术栈不应成为重点，重点是核心流程能运行、状态可验证、异常不会破坏队列。

### 推荐目录

```text
hospital_queue/
├── app.py                 # 服务启动与路由注册
├── models.py              # 患者、科室、医生、队列模型
├── queue_service.py       # 取号、叫号、过号、完成等业务逻辑
├── repository.py          # SQLite 或内存存储
├── schemas.py             # API 请求和响应结构
├── permissions.py         # 角色权限校验
├── display_client.py      # 显示端客户端（可选）
├── tests/
│   ├── test_queue.py
│   └── test_permissions.py
└── README.md
```

考试时间不足时，可以将多个文件合并，但不要把所有规则都写在路由函数里。至少要把“存储”“队列规则”和“接口”分开。

### 最小闭环

第一版只需要打通这条链路：

```text
患者取号
  -> 护士分诊到科室/号源类型
  -> 医生叫下一位
  -> 显示端刷新
  -> 医生开始接诊
  -> 医生完成或标记过号
  -> 队列进入下一位
```

先保证这个闭环可运行，再补急诊优先级、转科、预约患者、统计报表等扩展能力。

---

## 四、核心领域模型

以下模型是解题建议，不代表截图中已经明确给出了这些字段。实际实现时要根据完整 README 调整字段名和接口格式。

### 患者与就诊记录

```python
from dataclasses import dataclass
from enum import Enum
from typing import Optional


class PatientType(str, Enum):
    NORMAL = "normal"
    EMERGENCY = "emergency"
    APPOINTMENT = "appointment"
    PRIORITY = "priority"


class VisitStatus(str, Enum):
    WAITING = "waiting"
    CALLED = "called"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    SKIPPED = "skipped"
    CANCELLED = "cancelled"


@dataclass
class Visit:
    visit_id: str
    queue_number: str
    patient_type: PatientType
    department_id: str
    room_id: Optional[str]
    doctor_id: Optional[str]
    status: VisitStatus = VisitStatus.WAITING
    priority: int = 0
    created_at: str = ""
```

实现中还可以增加挂号类型、预约时间、创建时间和来源渠道。不要一开始添加无法验证用途的大量字段。

### 科室、诊室和医生

```python
@dataclass
class Department:
    department_id: str
    name: str
    department_type: str
    enabled: bool = True


@dataclass
class Room:
    room_id: str
    department_id: str
    name: str
    doctor_id: Optional[str] = None
    enabled: bool = True


@dataclass
class Doctor:
    doctor_id: str
    name: str
    department_id: str
    room_id: Optional[str] = None
    online: bool = True
```

实际考试中，医生是否固定绑定诊室、一个医生能否服务多个科室，需要继续阅读 README 或通过业务规则确认，不应直接假设。

---

## 五、排队策略：先把规则显式化

### 基础 FIFO 队列

普通患者可以按照取号时间先进先出：

```python
from collections import deque


class SimpleQueue:
    def __init__(self):
        self.items = deque()

    def push(self, visit_id: str) -> None:
        self.items.append(visit_id)

    def pop(self) -> str | None:
        return self.items.popleft() if self.items else None
```

但医院场景通常不只有一个普通队列。更好的抽象是“队列 + 调度策略”：

```python
class QueuePolicy:
    def choose_next(self, waiting_visits):
        raise NotImplementedError


class PriorityPolicy(QueuePolicy):
    def choose_next(self, waiting_visits):
        return min(
            waiting_visits,
            key=lambda item: (-item.priority, item.created_at),
        )
```

### 优先级不能只写在前端

急诊优先、预约优先或特殊患者优先，都必须在服务端统一计算。否则患者端显示的下一位和医生端叫出的下一位可能不一致。

建议将调度规则抽成可测试函数：

```python
def choose_next(visits):
    waiting = [v for v in visits if v.status == VisitStatus.WAITING]
    if not waiting:
        return None
    return max(
        waiting,
        key=lambda v: (v.priority, -int(v.created_at_timestamp)),
    )
```

考试实现时，需要特别注意时间戳比较方式。不要把格式不统一的时间字符串直接拿来排序。

### 防止普通患者无限等待

如果题面没有明确要求，不要擅自设计复杂的动态优先级。但可以在设计说明中指出：若急诊持续插队，普通患者可能饥饿；可通过优先级老化、每若干位优先患者服务一位普通患者等规则改善。

---

## 六、状态机设计

一个就诊记录的最小状态可以设计为：

```text
WAITING
   ├── CALLED
   │     ├── IN_PROGRESS
   │     │      └── COMPLETED
   │     └── SKIPPED
   ├── CANCELLED
   └── TRANSFERRED（如果题面要求转科）
```

不要允许任意状态互相跳转。例如：

- 已完成的就诊不能再次变成等待中；
- 未叫号的患者不能直接完成就诊；
- 已取消的记录不能被医生叫号；
- 一个患者不能同时出现在两个科室的等待队列中。

### 状态转换表

```python
VALID_TRANSITIONS = {
    "waiting": {"called", "cancelled"},
    "called": {"in_progress", "skipped", "cancelled"},
    "in_progress": {"completed", "skipped"},
    "completed": set(),
    "skipped": {"called", "cancelled"},
    "cancelled": set(),
}


def can_transition(current: str, target: str) -> bool:
    return target in VALID_TRANSITIONS.get(current, set())
```

`skipped -> called` 是否允许，需要由完整题面决定。如果题面没有说明，可以选择“过号后重新排队”，并在 README 中明确记录该设计决策。

### 状态更新必须原子化

叫号操作至少应完成三件事：

1. 找到符合规则的下一位等待患者；
2. 将其状态改为 `called`；
3. 记录诊室、医生和操作时间。

这三步不能被多个医生请求交错执行，否则两个医生可能叫到同一个患者。SQLite 场景下可使用事务或服务层锁；单进程考试实现中至少要用互斥锁保护“选择 + 更新”过程。

---

## 七、API 设计建议

以下是推荐的最小接口集合，具体路径和字段以完整 README 为准。

| Method | Path | 作用 |
|---|---|---|
| `GET` | `/departments` | 查询启用的科室 |
| `GET` | `/departments/{id}/queue` | 查看候诊队列 |
| `POST` | `/visits` | 患者取号或创建就诊记录 |
| `POST` | `/visits/{id}/triage` | 护士分诊 |
| `POST` | `/departments/{id}/call-next` | 医生叫下一位 |
| `POST` | `/visits/{id}/start` | 开始接诊 |
| `POST` | `/visits/{id}/complete` | 完成就诊 |
| `POST` | `/visits/{id}/skip` | 过号 |
| `GET` | `/display/{department_id}` | 获取显示端数据 |
| `GET` | `/health` | 健康检查 |

### 取号接口

```python
@app.post("/visits")
def create_visit(request: CreateVisitRequest):
    department = department_repo.get(request.department_id)
    if department is None or not department.enabled:
        raise HTTPException(status_code=404, detail="department not found")

    visit = queue_service.register(
        department_id=request.department_id,
        patient_type=request.patient_type,
    )
    return visit
```

### 叫号接口

```python
@app.post("/departments/{department_id}/call-next")
def call_next(department_id: str, user=Depends(require_doctor)):
    visit = queue_service.call_next(
        department_id=department_id,
        doctor_id=user.doctor_id,
    )
    if visit is None:
        raise HTTPException(status_code=404, detail="no waiting patient")
    return visit
```

不要把角色权限只放在前端按钮上。隐藏测试可以直接调用 API，服务端必须再次校验。

---

## 八、五类终端怎么做

### 1. 患者端

最小功能：

- 选择科室或就诊类型；
- 取号；
- 查看自己的号码、前方等待人数和当前叫号；
- 取消或确认就诊，若题面要求则实现。

患者端不应直接修改队列顺序，也不应决定自己的优先级。

### 2. 护士端

最小功能：

- 查看待分诊患者；
- 将患者分配到科室、诊室或号源类型；
- 修正明显的登记信息；
- 查看队列异常。

护士端是多科室协作的关键入口。分诊动作应记录操作者和时间，便于追溯。

### 3. 医生端

最小功能：

- 查看当前诊室队列；
- 叫下一位；
- 开始接诊；
- 完成、过号或转诊。

医生只能操作自己有权限的科室或诊室，不能从其他科室队列叫号。

### 4. 显示端

显示端优先保证清晰、稳定和自动刷新：

```text
综合科 3 诊室
当前就诊：A023
请 A024 到 3 诊室
候诊人数：12
```

可以先用 2—5 秒轮询实现，避免在考试中为 WebSocket 处理连接管理、断线重连和广播一致性。

### 5. 管理端

最小功能：

- 配置科室、诊室和医生；
- 启停号源或诊室；
- 查询当日队列和就诊记录；
- 查看操作日志。

管理端不需要一开始就做完整后台页面。命令行或简易表单也可以，只要能证明核心管理能力。

---

## 九、数据存储与一致性

### SQLite 优先

2 小时内，SQLite 通常比手写 JSON 文件更稳妥：

- 支持事务；
- 重启后数据仍在；
- 可以用唯一约束防止重复号；
- 查询和统计比内存结构更容易验证。

建议至少保存：

- 患者/就诊记录；
- 科室、诊室和医生配置；
- 状态变更记录；
- 取号和操作时间。

### 操作日志

```python
@dataclass
class AuditLog:
    log_id: str
    actor_id: str
    actor_role: str
    action: str
    target_id: str
    before_status: str | None
    after_status: str | None
    created_at: str
```

出现“叫号后显示端没刷新”“过号后又被叫到”等问题时，没有操作日志就很难定位。

### 幂等性

网络重试可能导致同一个请求发送两次。例如患者端重复点击“取号”，应该通过请求 ID、业务唯一键或服务端去重，避免生成两个号码。

医生完成就诊的请求也应该尽量幂等：对已经完成的记录重复提交，不应产生第二次完成事件或重复扣减统计。

---

## 十、测试重点

### 队列基础测试

```python
def test_normal_patient_gets_number():
    visit = service.register("general", "normal")
    assert visit.status == VisitStatus.WAITING
    assert visit.queue_number


def test_call_next_returns_waiting_patient():
    first = service.register("general", "normal")
    second = service.register("general", "normal")

    called = service.call_next("general", "doctor-1")
    assert called.visit_id == first.visit_id
    assert called.status == VisitStatus.CALLED


def test_completed_visit_is_not_called_again():
    visit = service.register("general", "normal")
    service.call_next("general", "doctor-1")
    service.start(visit.visit_id, "doctor-1")
    service.complete(visit.visit_id, "doctor-1")

    assert service.call_next("general", "doctor-1") is None
```

### 优先级测试

- 急诊患者是否按题面规则优先；
- 普通患者是否仍能进入队列；
- 同优先级是否按取号时间稳定排序；
- 医生叫号后，其他医生是否不能重复领取同一患者。

### 权限测试

- 患者不能调用医生的完成接口；
- 医生不能操作不属于自己的科室；
- 普通医生不能修改科室配置；
- 管理员权限不能通过修改请求体伪造。

### 异常测试

- 不存在的科室；
- 已停用的诊室；
- 空队列叫号；
- 重复完成；
- 非法状态跳转；
- 患者重复取号；
- 并发叫号；
- 服务重启后的数据恢复。

### 显示端测试

显示端不应显示已取消或已完成的患者，也不应因为一个接口请求失败而退出。可以对读取接口做有限重试，并在页面上显示“服务暂时不可用”。

---

## 十一、两小时作答安排

### 0—10 分钟：读 README 和盘点规则

- 找出完整角色、患者来源、科室类型和状态要求；
- 确认交付物、启动方式、测试命令和接口格式；
- 把不明确的规则列成“待确认项”，不要让 Agent 自行脑补。

### 10—25 分钟：确定架构和状态机

- 选中心化服务；
- 定义就诊记录和角色；
- 画出合法状态流转；
- 确定队列调度规则和数据存储。

### 25—65 分钟：实现核心服务

优先完成：

1. 科室和诊室配置；
2. 患者取号；
3. 护士分诊；
4. 医生叫号；
5. 开始接诊、完成和过号；
6. 队列查询。

此时不做复杂页面，先用 API 或命令行验证闭环。

### 65—85 分钟：接入终端

先做最简单的患者端、医生端和显示端。护士端、管理端可以先用 API 或简易界面，只要功能可演示、权限可验证。

### 85—105 分钟：补一致性和权限

- 状态转换校验；
- 并发叫号保护；
- 角色权限；
- 重复请求幂等；
- 操作日志。

### 105—115 分钟：测试和文档

按 README 的命令完整运行，补充正常流程、空队列、非法状态和权限测试。

### 115—120 分钟：交付检查

- 服务能启动；
- 数据库或数据文件路径正确；
- README 中的命令可复现；
- 没有调试输出、硬编码密钥和无关临时文件；
- 确认“完成任务”前先运行最后一遍测试。

---

## 十二、CodeFuse Prompt 模板

### Prompt 1：先读题和盘点业务

```text
请先完整阅读当前目录的 README.md，不要修改任何文件。

请输出：
1. 所有终端、角色和权限；
2. 患者来源、科室类型、诊室和医生关系；
3. 患者从取号到完成就诊的完整状态流转；
4. 排队、优先级、过号、取消和转诊规则；
5. 题目要求的接口、输出字段、启动命令和验收命令；
6. README 中没有明确说明、需要我做设计决策的地方。

所有结论必须来自当前 README 或项目文件。无法确认的内容请标记为“待确认”，不要自行补全。
```

### Prompt 2：实现核心领域服务

```text
基于已经确认的题面，实现医院门诊排队系统的核心领域服务。

要求：
- 先定义患者、就诊记录、科室、诊室、医生和状态模型；
- 将排队和优先级规则放在服务层，不要散落在接口或界面代码中；
- 所有状态转换必须校验合法性；
- 叫号的“选择下一位 + 更新状态”必须是原子操作；
- 不允许同一就诊记录同时被两个医生叫到；
- 对空队列、非法科室、重复请求和非法状态返回明确错误；
- 遵守 README 中实际指定的字段和接口，不要新增无依据的固定规则。

先实现可测试的核心服务，再接入终端。
```

### Prompt 3：接入终端和显示端

```text
核心服务已经完成。请分别实现患者端、护士端、医生端、显示端和管理端的最小可用功能。

要求：
- 每个终端只展示和操作自己有权限的功能；
- 所有写操作必须由服务端再次校验权限；
- 显示端只读取服务端当前状态，不在本地复制一套队列；
- 优先使用简单 HTTP 轮询，不引入不必要的复杂基础设施；
- 网络错误时界面不崩溃，并显示可理解的错误；
- 先列出每个终端的验收步骤，再逐个实现。
```

### Prompt 4：隐藏测试审查

```text
请对当前项目做一次面向隐藏测试的审查，不要整体重写。

重点检查：
1. 多个科室、多个诊室和多个医生是否相互隔离；
2. 急诊、预约或其他患者类型是否按 README 规则处理；
3. 两个医生同时叫号时是否可能拿到同一患者；
4. 过号、取消、转诊和完成是否存在非法状态跳转；
5. 患者、医生、护士、显示端和管理员权限是否正确；
6. 重复点击取号或重复提交是否产生重复记录；
7. 服务重启后数据是否丢失；
8. 显示端是否会展示已完成或已取消的记录；
9. 空队列、无效 ID、停用科室和网络失败是否有明确处理；
10. 代码、测试和 README 的启动命令是否一致。

先输出问题列表和最小修复方案，再逐项修改并运行相关测试。
```

---

## 十三、常见失分点

1. **把所有患者放进一个全局队列**：多科室场景下会造成跨科室叫号。
2. **只在前端做权限控制**：隐藏测试直接请求服务端时会失效。
3. **医生端各自维护本地队列**：多个医生之间会出现重复叫号。
4. **用数组下标表示状态**：删除、过号和转诊后很容易产生错位。
5. **任意状态都能修改**：缺少状态机，完成后的记录可能再次被叫号。
6. **先做复杂界面**：2 小时内应优先完成服务层和核心流程。
7. **没有明确优先级规则**：急诊或特殊患者的调度会变成随机行为。
8. **没有操作日志**：出现叫号异常时无法复盘。
9. **没有测试并发和重复请求**：这是排队系统最容易暴露的问题。
10. **根据截图补全不可见题面**：截图之外的字段、患者来源和验收标准必须回到完整 README 确认。

---

## 小结

医院门诊排队系统的稳定解法可以概括为：

```text
读 README
  -> 明确角色和业务规则
  -> 建模就诊状态
  -> 中心化存储队列
  -> 服务端统一调度与鉴权
  -> 终端按角色读取和操作
  -> 用状态机、并发和异常测试验收
```

这道题考的不是页面做得多漂亮，而是能否在 2 小时内把一个多角色、多科室、带状态流转的业务系统做出最小闭环。候选人应让 Agent 负责代码产出，但自己必须掌握状态模型、排队规则、权限边界和验收标准。
