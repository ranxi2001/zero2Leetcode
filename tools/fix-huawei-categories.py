"""Reclassify the existing Huawei topic tables without altering problem data."""
import re
from pathlib import Path

p = Path(__file__).resolve().parents[1] / '05_interview/coding/huawei.md'
text = p.read_text()
start = text.index('### 分类总览')
end = text.index('### Hot100', start)
old = text[start:end]
rows = {}
for line in old.splitlines():
    m = re.search(r'\[LC (\d+)\.', line)
    if m:
        cells = [x.strip() for x in line.strip('|').split('|')]
        if cells[0].startswith('[LC'):
            title, freq = cells[:2]
        else:
            title, freq = cells[1:3]
        rows[int(m[1])] = (title, freq)
groups = [
    ('双指针/滑动窗口', [3,42,15,11,209,239], '无重复字符最长子串（**32次**）、接雨水（11次）'),
    ('图论', [200,207,695], '岛屿数量（**31次**）、课程表（6次）'),
    ('栈系列', [20,394,739,155], '有效括号（**22次**）、字符串解码（15次）'),
    ('链表', [146,206,19,21,142,2,23,92], 'LRU 缓存（17次）、反转链表（14次）'),
    ('二叉树', [102,124], '层序遍历（10次）、最大路径和（5次）'),
    ('排序/二分', [56,215,704], '合并区间（14次）、数组第 K 大元素（10次）'),
    ('动态规划', [300,53,70,64,72], '最长递增子序列（9次）、最大子数组和（7次）'),
    ('回溯', [46,93], '全排列（10次）、复原 IP 地址（8次）'),
    ('哈希', [1,451], '两数之和（11次）、根据字符出现频率排序（8次）'),
    ('贪心', [55,406], '跳跃游戏（8次）、根据身高重建队列（5次）'),
    ('矩阵模拟', [54], '螺旋矩阵（5次）'),
]
ids = [i for _, items, _ in groups for i in items]
assert len(ids) == len(set(ids)) == len(rows) == 38
assert set(ids) == set(rows)
parts = ['### 分类总览', '', '> 按主要数据结构或核心解法单一归类，每题只计一次；同一题仍可能有多种解法。LC 300 归入动态规划（也可用贪心 + 二分），LC 142 归入链表（快慢指针），LC 23 归入链表（堆 / 分治合并），LC 451 归入哈希（计数 + 排序 / 桶排序）。', '', '| 分类 | 高频题数 | 代表高频题（频次） |', '|------|---------|-------------------|']
for name, items, summary in groups:
    parts.append(f'| {name} | {len(items)} 道 | {summary} |')
for name, items, _ in groups:
    parts.extend(['', f'### {name}（{len(items)} 道）', '', '| # | 题目 | 频次 |', '|---|------|------|'])
    for n, i in enumerate(items, 1):
        title, freq = rows[i]
        parts.append(f'| {n} | {title} | {freq} |')
parts.extend(['', ''])
new = '\n'.join(parts)
# Every linked title and frequency must survive exactly, even when categories change.
for title, freq in rows.values():
    assert new.count(title) == 1
    assert f'| {title} | {freq} |' in new
p.write_text(text[:start] + new + text[end:])
print(f'Reclassified {len(ids)} problems in {len(groups)} groups; titles, links and frequencies preserved.')
