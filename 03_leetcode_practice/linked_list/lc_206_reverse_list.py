"""
LeetCode 206. 反转链表 (Reverse Linked List)

难度: Easy
分类: 链表
链接: https://leetcode.cn/problems/reverse-linked-list/

题目描述:
给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。

思路:
1. 迭代法: 使用三个指针 prev, curr, next
2. 递归法: 先反转后面的，再处理当前节点

复杂度:
- 时间: O(n)
- 空间: O(1) 迭代 / O(n) 递归
"""

from typing import Optional


# 链表节点定义
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def reverseList_iterative(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        迭代法（推荐）
        
        图解：
        原始: 1 -> 2 -> 3 -> None
        步骤1: None <- 1    2 -> 3 -> None
        步骤2: None <- 1 <- 2    3 -> None
        步骤3: None <- 1 <- 2 <- 3
        """
        prev = None
        curr = head
        
        while curr:
            next_temp = curr.next  # 保存下一个节点
            curr.next = prev       # 反转指针
            prev = curr            # prev 前进
            curr = next_temp       # curr 前进
        
        return prev
    
    def reverseList_recursive(self, head: Optional[ListNode]) -> Optional[ListNode]:
        """
        递归法
        
        思路：先反转 head.next 及之后的部分，再让原 head.next 指向 head
        """
        # 空链表或只有一个节点
        if not head or not head.next:
            return head
        
        # 递归反转后面的部分
        new_head = self.reverseList_recursive(head.next)
        
        # 让 head.next 指向 head
        head.next.next = head
        head.next = None
        
        return new_head


# ===== 辅助函数 =====
def create_linked_list(arr):
    """从数组创建链表"""
    if not arr:
        return None
    head = ListNode(arr[0])
    curr = head
    for val in arr[1:]:
        curr.next = ListNode(val)
        curr = curr.next
    return head


def print_linked_list(head):
    """打印链表"""
    result = []
    while head:
        result.append(str(head.val))
        head = head.next
    return " -> ".join(result) + " -> None"


# ===== 测试 =====
if __name__ == "__main__":
    sol = Solution()
    
    # 测试用例 1
    head1 = create_linked_list([1, 2, 3, 4, 5])
    print(f"原链表: {print_linked_list(head1)}")
    reversed1 = sol.reverseList_iterative(head1)
    print(f"反转后: {print_linked_list(reversed1)}")
    
    print()
    
    # 测试用例 2 (递归法)
    head2 = create_linked_list([1, 2])
    print(f"原链表: {print_linked_list(head2)}")
    reversed2 = sol.reverseList_recursive(head2)
    print(f"反转后: {print_linked_list(reversed2)}")
