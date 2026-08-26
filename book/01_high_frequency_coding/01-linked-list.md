# 链表

本文件维护第一章第一类题目的题解与面试追问。字节题单决定本类的核心范围和顺序，其他资料只用于覆盖数量参考与新增题补充。

## 字节核心题单

“其他统计覆盖”表示华为、美团、腾讯和 Hot 100 综合榜四份补充资料中，有多少份也记录了该题；不是可直接相加的考频。

| 顺序 | 题目 | 字节频次 | 数据版本 | 其他统计覆盖 |
|------|------|----------|----------|--------------|
| 1 | LC 206 反转链表 | 55 | 08 更新 | 4/4 |
| 2 | LC 25 K 个一组翻转链表 | 55 | 08 更新 | 2/4 |
| 3 | LC 19 删除链表的倒数第 N 个结点 | 43 | 08 更新 | 4/4 |
| 4 | LC 23 合并 K 个升序链表 | 36 | 08 更新 | 4/4 |
| 5 | LC 21 合并两个有序链表 | 29 | 08 更新 | 4/4 |
| 6 | LC 141 环形链表 | 14 | 04 基线 | 4/4 |
| 7 | LC 148 排序链表 | 13 | 04 基线 | 1/4 |
| 8 | LC 92 反转链表 II | 15 | 08 推算 | 2/4 |
| 9 | LC 2 两数相加 | 11 | 04 基线 | 2/4 |

LC 92 的频次沿用字节原文推算值，不与其他来源频次相加。

## 其他来源新增题

| 题目 | 发现来源 |
|------|----------|
| LC 24 两两交换链表中的节点 | 腾讯 |
| LC 82 删除排序链表中的重复元素 II | 美团、腾讯 |
| LC 138 随机链表的复制 | Hot 100 综合榜 |
| LC 142 环形链表 II | 华为、美团、腾讯、Hot 100 综合榜 |
| LC 143 重排链表 | 美团 |
| LC 160 相交链表 | 华为、腾讯、Hot 100 综合榜 |
| LC 234 回文链表 | 华为 |

## 题解与追问重点

- 反转类题目同时讲迭代、递归和区间反转，统一指针重连术语。
- 判环、找环入口和相交链表先给哈希表直观解法，再推导快慢指针或双指针的常数空间解法。
- 合并 K 个链表比较顺序合并、分治合并和最小堆。
- 删除、分组和重排题必须画清楚断链与重连位置，并覆盖头节点变化、空链表和不足一组等边界。

## LC 206 反转链表

**考频与考点**　字节 55 次，其他统计覆盖 4/4。考查指针重连、原地修改，以及能否准确维护“上一结点、当前结点、下一结点”。

**写代码前确认**　确认是返回反转后的头结点；空链表和单结点链表应原样返回。若题目要求保留原链表，则不能使用下面的原地算法。

**思路与解法**

1. 迭代：先保存 `cur.next`，再令 `cur.next = prev`，最后整体向后移动。任一时刻，`prev` 都是已反转部分的头结点。
2. 递归：先反转后缀，再把后继结点指回当前结点。必须将原来的 `head.next` 置空，否则会形成环。

```python
class Solution:
    def reverseList(self, head):
        prev, cur = None, head
        while cur:
            nxt = cur.next
            cur.next = prev
            prev, cur = cur, nxt
        return prev

    def reverseListRecursive(self, head):
        if head is None or head.next is None:
            return head
        new_head = self.reverseListRecursive(head.next)
        head.next.next = head
        head.next = None
        return new_head
```

**复杂度**　两种解法均为 `O(n)` 时间；迭代为 `O(1)` 额外空间，递归调用栈为 `O(n)`。

**边界与易错点**　不能在保存 `nxt` 前覆盖 `cur.next`；递归回溯时不能漏掉断开原指针；返回值是 `prev` 或递归得到的 `new_head`，不是原头结点。

**面试追问**　如何反转区间 `[left, right]`？如何只反转前 `k` 个结点并返回下一段起点？若链表极长，为什么迭代版本更稳妥？

## LC 25 K 个一组翻转链表

**考频与考点**　字节 55 次，其他统计覆盖 2/4。重点是分组边界、局部反转和多段链表的正确拼接。

**写代码前确认**　不足 `k` 个结点的尾段保持原顺序；只能改变结点连接，不能交换结点值；通常可认为 `k >= 1`。

**思路与解法**

用哑结点统一处理头结点变化。`group_prev` 指向本组之前，先向后找到本组末尾 `kth`；找不到说明剩余不足一组。保存下一组起点 `group_next`，把区间 `[group_prev.next, group_next)` 原地反转，再将前后两段接回。递归也可按同样边界处理，但调用栈为 `O(n/k)`，面试更推荐迭代。

```python
class Solution:
    def reverseKGroup(self, head, k):
        dummy = ListNode(0, head)
        group_prev = dummy

        while True:
            kth = group_prev
            for _ in range(k):
                kth = kth.next
                if kth is None:
                    return dummy.next

            group_next = kth.next
            prev, cur = group_next, group_prev.next
            while cur is not group_next:
                nxt = cur.next
                cur.next = prev
                prev, cur = cur, nxt

            old_head = group_prev.next
            group_prev.next = kth
            group_prev = old_head
```

**复杂度**　每个结点至多被定位和反转各一次，时间 `O(n)`，额外空间 `O(1)`。

**边界与易错点**　必须先保存 `group_next`；反转时把 `prev` 初始化为 `group_next`，可直接接好尾部；下一轮的 `group_prev` 是本组反转前的头结点；`k = 1` 不应死循环。

**面试追问**　若不足 `k` 个也要反转，终止条件如何调整？如何抽象一个反转半开区间的函数？递归写法的栈深是多少？

## LC 19 删除链表的倒数第 N 个结点

**考频与考点**　字节 43 次，其他统计覆盖 4/4。考查哑结点、固定间距双指针和一次遍历。

**写代码前确认**　通常保证 `n` 合法；删除的可能是头结点。若输入可能非法，需要约定返回原链表还是报错。

**思路与解法**

1. 两遍扫描：先求长度 `L`，再走到第 `L-n` 个前驱，逻辑直观。
2. 一遍双指针：从哑结点出发，让 `fast` 先走 `n+1` 步，使 `slow` 最终停在待删结点的前驱。哑结点消除了删除头结点的特判。

```python
class Solution:
    def removeNthFromEnd(self, head, n):
        dummy = ListNode(0, head)
        fast = slow = dummy
        for _ in range(n + 1):
            fast = fast.next
        while fast:
            fast = fast.next
            slow = slow.next
        slow.next = slow.next.next
        return dummy.next
```

**复杂度**　两遍和双指针均为 `O(n)` 时间、`O(1)` 空间；双指针只扫描一轮。

**边界与易错点**　从 `dummy` 走 `n+1` 步与从 `head` 走 `n` 步是两套等价写法，不能混用；删除头结点时必须返回 `dummy.next`。

**面试追问**　若 `n` 可能大于链表长度怎样防御？只给待删结点而不给头结点能否完成删除？为什么尾结点不能用“复制后继值”的办法？

## LC 23 合并 K 个升序链表

**考频与考点**　字节 36 次，其他统计覆盖 4/4。考查多路归并、最小堆、分治，以及 Python 堆中相同键的比较问题。

**写代码前确认**　输入可含空链表；结点总数记为 `N`、链表数记为 `k`；允许重用原结点。

**思路与解法**

1. 最小堆：每条非空链表只把当前头结点入堆。弹出最小结点后，再把它的后继入堆，堆大小不超过 `k`。元组中加入唯一序号，避免值相等时比较 `ListNode`。
2. 分治：两两合并，每轮链表数减半；每个结点参与 `log k` 层合并。它不依赖堆，且空间开销更低。

```python
import heapq
from itertools import count


class Solution:
    def mergeKLists(self, lists):
        heap = []
        serial = count()
        for node in lists:
            if node:
                heapq.heappush(heap, (node.val, next(serial), node))

        dummy = tail = ListNode()
        while heap:
            _, _, node = heapq.heappop(heap)
            tail.next = node
            tail = node
            if node.next:
                heapq.heappush(
                    heap, (node.next.val, next(serial), node.next)
                )
        return dummy.next
```

**复杂度**　堆解法为 `O(N log k)` 时间、`O(k)` 空间；分治同为 `O(N log k)` 时间，迭代实现的辅助空间可为 `O(1)`。

**边界与易错点**　不要一次把全部 `N` 个结点放入堆；Python 中不能依赖 `ListNode` 直接比较；输入 `lists=[]` 或全为空时返回 `None`。

**面试追问**　顺序逐条合并为何最坏可达 `O(Nk)`？若链表来自流式数据如何处理？什么情况下分治比堆更合适？

## LC 21 合并两个有序链表

**考频与考点**　字节 29 次，其他统计覆盖 4/4。考查链表基本操作、哑结点和归并排序的基础组件。

**写代码前确认**　链表按非递减顺序排列；可复用原结点；相等时先取哪一条链表不影响有序性，但应保持规则一致。

**思路与解法**

1. 迭代：用 `tail` 指向结果尾部，每次接入较小结点，最后一次性接入剩余链表。
2. 递归：较小头结点的 `next` 指向两条剩余链表的合并结果，代码短，但栈深可达 `m+n`。

```python
class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = tail = ListNode()
        while list1 and list2:
            if list1.val <= list2.val:
                tail.next, list1 = list1, list1.next
            else:
                tail.next, list2 = list2, list2.next
            tail = tail.next
        tail.next = list1 or list2
        return dummy.next

    def mergeTwoListsRecursive(self, list1, list2):
        if not list1 or not list2:
            return list1 or list2
        if list1.val <= list2.val:
            list1.next = self.mergeTwoListsRecursive(list1.next, list2)
            return list1
        list2.next = self.mergeTwoListsRecursive(list1, list2.next)
        return list2
```

**复杂度**　时间 `O(m+n)`；迭代额外空间 `O(1)`，递归栈空间 `O(m+n)`。

**边界与易错点**　循环结束后不要逐个复制剩余结点；连接结点后要同步移动来源指针和 `tail`；空链表应直接接入另一条。

**面试追问**　如何改为降序合并？怎样合并数组形式的有序序列？这段逻辑如何复用于链表归并排序？

## LC 141 环形链表

**考频与考点**　字节 14 次，其他统计覆盖 4/4。考查哈希判重和 Floyd 快慢指针。

**写代码前确认**　只需判断是否有环，不需要返回入口；不能通过结点值判断是否重复，因为值可以相同。

**思路与解法**

1. 哈希表：沿链表记录结点对象；再次遇到同一对象即有环。它最直观，时间 `O(n)`、空间 `O(n)`。
2. 快慢指针：慢指针每次一步、快指针每次两步。若无环，快指针到达空；若有环，两者进入环后相对距离每轮缩短一格，必然相遇。

```python
class Solution:
    def hasCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                return True
        return False

    def hasCycleWithHash(self, head):
        seen = set()
        while head:
            if head in seen:
                return True
            seen.add(head)
            head = head.next
        return False
```

**复杂度**　两种解法时间均为 `O(n)`；哈希表空间 `O(n)`，快慢指针空间 `O(1)`。

**边界与易错点**　循环条件必须同时检查 `fast` 和 `fast.next`；比较的是结点身份；先移动再判断可自然处理自环。

**面试追问**　如何找环入口和环长？为什么快指针速度取两倍即可？若快指针每次走三步，是否一定能检测到环？

## LC 148 排序链表

**考频与考点**　字节 13 次，其他统计覆盖 1/4。要求在 `O(n log n)` 时间完成链表排序，核心是快慢指针找中点和归并。

**写代码前确认**　允许修改链表连接；若严格要求 `O(1)` 额外空间，应使用自底向上的迭代归并，递归版有 `O(log n)` 调用栈。

**思路与解法**

递归归并排序：用 `slow`、`fast` 找到中点前驱并断链，将左右两半分别排序，再用 LC 21 的逻辑合并。分割时让 `fast = head.next`，可使双结点链表的 `slow` 停在第一个结点。

```python
class Solution:
    def sortList(self, head):
        if head is None or head.next is None:
            return head

        slow, fast = head, head.next
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
        right = slow.next
        slow.next = None

        left = self.sortList(head)
        right = self.sortList(right)
        dummy = tail = ListNode()
        while left and right:
            if left.val <= right.val:
                tail.next, left = left, left.next
            else:
                tail.next, right = right, right.next
            tail = tail.next
        tail.next = left or right
        return dummy.next
```

**复杂度**　时间 `O(n log n)`，递归栈 `O(log n)`；自底向上归并可将额外空间降到 `O(1)`。

**边界与易错点**　递归前必须断开左右链表，否则无法收敛；归并时要移动 `tail`；不要把链表转数组排序，那会使用 `O(n)` 额外空间。

**面试追问**　如何写自底向上归并？为什么链表适合归并排序而不适合常规快速排序？排序是否稳定？

## LC 92 反转链表 II

**考频与考点**　字节推算 15 次，其他统计覆盖 2/4。考查局部反转、哑结点和区间边界。

**写代码前确认**　位置从 1 开始且 `left <= right`；区间可能包含头结点；通常保证位置合法。

**思路与解法**

头插法只扫描一次：先令 `prev` 停在第 `left-1` 个结点，`cur` 是区间首结点。之后每轮摘下 `cur.next`，插到 `prev` 后面。`cur` 始终是已反转区间的尾部，共执行 `right-left` 次。

```python
class Solution:
    def reverseBetween(self, head, left, right):
        dummy = ListNode(0, head)
        prev = dummy
        for _ in range(left - 1):
            prev = prev.next

        cur = prev.next
        for _ in range(right - left):
            moved = cur.next
            cur.next = moved.next
            moved.next = prev.next
            prev.next = moved
        return dummy.next
```

**复杂度**　时间 `O(n)`，额外空间 `O(1)`。

**边界与易错点**　`left == right` 时不进入反转循环；包含头结点时依赖哑结点；头插过程中 `cur` 不移动，移动的是它的后继。

**面试追问**　如何用“反转半开区间”实现？怎样扩展为每 `k` 个一组反转？若区间位置可能越界，应如何处理已修改的前缀？

## LC 2 两数相加

**考频与考点**　字节 11 次，其他统计覆盖 2/4。考查链表同步遍历、逐位进位和不同长度输入。

**写代码前确认**　数字按逆序保存，头结点是个位；每个结点是一位十进制数字；结果也按逆序返回。若题目改为正序存储，解法会不同。

**思路与解法**

同时遍历两条链表，把缺失位视为 0。每轮用 `divmod(x + y + carry, 10)` 得到新进位与当前位。循环条件包含 `carry`，因此最高位进位无需单独补结点。也可原地复用较长链表，但分支更多，面试中通常新建结果更清晰。

```python
class Solution:
    def addTwoNumbers(self, l1, l2):
        dummy = tail = ListNode()
        carry = 0
        while l1 or l2 or carry:
            x = l1.val if l1 else 0
            y = l2.val if l2 else 0
            carry, digit = divmod(x + y + carry, 10)
            tail.next = ListNode(digit)
            tail = tail.next
            l1 = l1.next if l1 else None
            l2 = l2.next if l2 else None
        return dummy.next
```

**复杂度**　时间 `O(max(m,n))`，新结果链表占 `O(max(m,n))`；除返回结果外额外空间 `O(1)`。

**边界与易错点**　不要提前结束较长链表；最后可能多一位进位；`divmod` 返回顺序是商、余数；输入中的前导零规则应以题意为准。

**面试追问**　若数字正序存储如何用栈处理？若不允许修改输入且要求 `O(1)` 辅助空间能否完成？如何扩展到任意进制？

## LC 24 两两交换链表中的节点

**考频与考点**　新增来源为腾讯。考查局部三指针重连，也是 K 组反转的最小特例。

**写代码前确认**　只能交换结点，不能只交换值；奇数长度链表的最后一个结点保持不动。

**思路与解法**

使用哑结点，令 `prev` 指向待交换二元组之前，`first`、`second` 是组内两个结点。按“`first` 接后段、`second` 接 `first`、`prev` 接 `second`”的顺序重连，再把 `prev` 移到 `first`。

```python
class Solution:
    def swapPairs(self, head):
        dummy = ListNode(0, head)
        prev = dummy
        while prev.next and prev.next.next:
            first = prev.next
            second = first.next
            first.next = second.next
            second.next = first
            prev.next = second
            prev = first
        return dummy.next
```

**复杂度**　时间 `O(n)`，额外空间 `O(1)`。

**边界与易错点**　重连前保留两个结点；循环条件要保证一组有两个结点；交换后 `first` 成为该组尾部。

**面试追问**　递归版本的终止条件是什么？这题如何退化自 LC 25？若要求每三个结点循环右移一次如何修改？

## LC 82 删除排序链表中的重复元素 II

**考频与考点**　新增来源为美团、腾讯。考查有序性、连续重复段识别和删除头部重复段。

**写代码前确认**　要删除所有出现重复的值，而不是每组保留一个；链表已经排序，因此相同值连续出现。

**思路与解法**

用哑结点和前驱 `prev`。若 `cur` 与后继值相同，记录该值并跳过整段；否则 `prev`、`cur` 同时前进。这样无需哈希表即可利用有序性完成原地删除。哈希计数也能做，但需两遍扫描和 `O(n)` 空间，没有利用题目条件。

```python
class Solution:
    def deleteDuplicates(self, head):
        dummy = ListNode(0, head)
        prev, cur = dummy, head
        while cur:
            if cur.next and cur.val == cur.next.val:
                duplicate = cur.val
                while cur and cur.val == duplicate:
                    cur = cur.next
                prev.next = cur
            else:
                prev, cur = cur, cur.next
        return dummy.next
```

**复杂度**　时间 `O(n)`，额外空间 `O(1)`。

**边界与易错点**　发现重复后不能保留第一个；删除重复段时 `prev` 不移动；全重复或头部重复都依赖哑结点正确处理。

**面试追问**　若改为每个值保留一个怎样写？无序链表删除全部重复值需要什么额外结构？如何在不可修改原链表时返回新链表？

## LC 138 随机链表的复制

**考频与考点**　新增来源为 Hot 100 综合榜。考查对象映射、深拷贝和利用链表结构进行空间优化。

**写代码前确认**　`random` 可指向任意结点或空；深拷贝要求新旧链表没有共享结点；结点值不保证唯一。

**思路与解法**

1. 哈希表：第一遍建立“原结点 → 新结点”映射，第二遍连接 `next` 和 `random`，最直观。
2. 穿插复制：把复制结点插在对应原结点之后，于是原结点 `x` 的复制结点是 `x.next`，其随机指针应指向 `x.random.next`；最后拆分两条链表，可省映射空间。

```python
class Solution:
    def copyRandomList(self, head):
        if head is None:
            return None

        cur = head
        while cur:
            cur.next = Node(cur.val, cur.next)
            cur = cur.next.next

        cur = head
        while cur:
            if cur.random:
                cur.next.random = cur.random.next
            cur = cur.next.next

        copy_head = head.next
        cur = head
        while cur:
            copy = cur.next
            cur.next = copy.next
            copy.next = copy.next.next if copy.next else None
            cur = cur.next
        return copy_head
```

**复杂度**　两种解法时间均为 `O(n)`；哈希表空间 `O(n)`，穿插法额外空间 `O(1)`（不计返回链表）。

**边界与易错点**　映射键必须是结点对象而不是值；穿插法第三步必须恢复原链表；设置随机指针时要判断 `random` 是否为空。

**面试追问**　若链表含 `next` 环，穿插法还能否直接使用？如何复制一般有向图？为什么本题可以把映射关系编码在相邻位置？

## LC 142 环形链表 II

**考频与考点**　新增来源覆盖 4/4。考查哈希定位、Floyd 判环及环入口的数学推导。

**写代码前确认**　无环返回 `None`；返回入口结点对象而非下标；不能修改链表。

**思路与解法**

1. 哈希表：第一个再次访问的结点就是环入口，直观但占 `O(n)` 空间。
2. Floyd：快慢指针相遇后，从头结点再出发一个指针；它与相遇点指针都每次走一步，首次相遇处就是入口。若头到入口距离为 `a`、入口到首次相遇距离为 `b`、环长为 `c`，相遇时有 `2(a+b)=a+b+kc`，故 `a=(k-1)c+(c-b)`。

```python
class Solution:
    def detectCycle(self, head):
        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                seeker = head
                while seeker is not slow:
                    seeker = seeker.next
                    slow = slow.next
                return seeker
        return None
```

**复杂度**　哈希解法 `O(n)` 时间和空间；Floyd 解法 `O(n)` 时间、`O(1)` 空间。

**边界与易错点**　第二阶段两个指针都走一步；不要在相遇后把快指针继续走两步；自环和入口为头结点都应正确返回。

**面试追问**　如何求环长？如何断开环？两条可能带环的链表如何判断是否相交？

## LC 143 重排链表

**考频与考点**　新增来源为美团。考查找中点、反转后半段和交替合并三种链表基本操作的组合。

**写代码前确认**　要求原地重排为首、尾、次首、次尾的次序；不能改变结点值；函数通常不返回新头结点。

**思路与解法**

先用快慢指针找到前半段尾部并断链，再反转后半段，最后交替连接两条链表。数组保存全部结点后双指针重连更直观，但要 `O(n)` 空间；三阶段写法只用常数空间。

```python
class Solution:
    def reorderList(self, head):
        if head is None or head.next is None:
            return

        slow = fast = head
        while fast.next and fast.next.next:
            slow = slow.next
            fast = fast.next.next

        second = slow.next
        slow.next = None
        prev = None
        while second:
            nxt = second.next
            second.next = prev
            prev, second = second, nxt

        first, second = head, prev
        while second:
            next_first, next_second = first.next, second.next
            first.next = second
            second.next = next_first
            first, second = next_first, next_second
```

**复杂度**　时间 `O(n)`，额外空间 `O(1)`。

**边界与易错点**　反转前必须断开前半段；合并前保存双方后继；奇数长度时前半段多一个结点，可自然成为末尾。

**面试追问**　如何恢复原链表？若要求从中间向两端交替排列怎样处理？为什么这里选择前半段多一个结点更方便？

## LC 160 相交链表

**考频与考点**　新增来源为华为、腾讯、Hot 100 综合榜。考查结点身份、哈希表和消除长度差的双指针技巧。

**写代码前确认**　相交指共享同一结点及其后缀，不是值相同；通常保证链表无环且结构不被修改。

**思路与解法**

1. 哈希表：记录 A 的所有结点，再遍历 B，首个命中的结点就是交点，便于直观说明。
2. 双指针：`pa` 走完 A 后转到 B，`pb` 走完 B 后转到 A。两者都走过 `m+n` 的组合路径，长度差被抵消；相交则在入口相遇，不相交则同时为 `None`。

```python
class Solution:
    def getIntersectionNode(self, headA, headB):
        pa, pb = headA, headB
        while pa is not pb:
            pa = pa.next if pa else headB
            pb = pb.next if pb else headA
        return pa

    def getIntersectionNodeWithHash(self, headA, headB):
        seen = set()
        while headA:
            seen.add(headA)
            headA = headA.next
        while headB:
            if headB in seen:
                return headB
            headB = headB.next
        return None
```

**复杂度**　两者时间均为 `O(m+n)`；哈希表空间 `O(m)`，双指针空间 `O(1)`。

**边界与易错点**　使用 `is` 比较结点身份；切换链表发生在当前指针为空时；不相交时循环也会终止。

**面试追问**　如何先求长度再对齐？若链表可能有环，如何分类讨论相交？为什么交换路径不会无限循环？

## LC 234 回文链表

**考频与考点**　新增来源为华为。考查中点、原地反转和链表结构恢复。

**写代码前确认**　空链表是否视为回文通常为是；是否允许修改输入链表；结点值可能重复或为负。

**思路与解法**

将值复制到数组后双指针比较最直观，时间、空间均为 `O(n)`。空间优化做法是快慢指针找中点，反转后半段，再从两端逐项比较。工程中宜在比较后再次反转，以恢复输入结构。

```python
class Solution:
    def isPalindrome(self, head):
        if head is None or head.next is None:
            return True

        slow = fast = head
        while fast and fast.next:
            slow = slow.next
            fast = fast.next.next

        prev = None
        cur = slow
        while cur:
            nxt = cur.next
            cur.next = prev
            prev, cur = cur, nxt

        left, right = head, prev
        answer = True
        while right:
            if left.val != right.val:
                answer = False
                break
            left, right = left.next, right.next

        cur, prev = prev, None
        while cur:
            nxt = cur.next
            cur.next = prev
            prev, cur = cur, nxt
        return answer
```

**复杂度**　数组法为 `O(n)` 时间、`O(n)` 空间；反转法为 `O(n)` 时间、`O(1)` 空间。

**边界与易错点**　奇数长度时后半段可包含中点，不影响比较；提前发现不等也应恢复链表；不要用字符串拼接代替结点遍历。

**面试追问**　如何避免恢复时丢失后半段头结点？递归从两端比较为何仍需 `O(n)` 栈空间？只允许一次遍历是否可行？
