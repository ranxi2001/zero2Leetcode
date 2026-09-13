"""Deterministic independent oracles for the exact published solution blocks.
Run: python tests/huawei-20260911-differential.py
Only reviewed repository Python fences are executed, never cached source code.
"""
import ast
import itertools
from pathlib import Path
import random
import re
import subprocess
import sys
import tempfile

ROOT = Path(__file__).resolve().parents[1]

# A sample fence must not consume a meaningful empty first input line.
import runpy
validator = runpy.run_path(str(ROOT / '.agents/skills/interview-article-writer/scripts/validate_article.py'))
fixture = '**输入**\n\n```\n\n0\n1\n```\n\n**输出**\n\n```\n0\n```\n'
assert validator['SAMPLE_RE'].search(fixture).group(1) == '\n0\n1\n'
assert "input: (input || '').trimEnd()" in (ROOT / 'assets/js/acm-bridge.js').read_text()


def load(role):
    text = (ROOT / f'04_real_interviews/huawei/{role}-20260911.md').read_text()
    assert text.startswith('---\n')
    for forbidden in ('mp.weixin', 'feishu.cn', 'docs.qq.com', 'AK机', '原始题目来源'):
        assert forbidden not in text
    result = []
    for code in re.findall(r'```python\n(.*?)\n```', text, re.S):
        ast.parse(code)
        namespace = {'__name__': 'article_test'}
        exec(compile(code, '<reviewed article>', 'exec'), namespace)
        result.append(namespace)
    return result


ai = load('ai')
dev_all = load('dev')
jump = dev_all[0]['can_reach']
dev = dev_all[1:]
rng = random.Random(20260911)
counts = dict(pruning=0, clustering_queries=0, scheduling=0, designs=0, jumps=0)


def jump_oracle(nums):
    n = len(nums)
    reach = [[i == j for j in range(n)] for i in range(n)]
    for i, value in enumerate(nums):
        for p in range(2, value + 1):
            if value % p == 0 and all(p % d for d in range(2, p)):
                for j in (i - p, i + p):
                    if 0 <= j < n:
                        reach[i][j] = True
    for k in range(n):
        for i in range(n):
            for j in range(n):
                reach[i][j] |= reach[i][k] and reach[k][j]
    return reach[0][-1]


for n in range(1, 6):
    for nums in itertools.product((1, 2, 3, 6), repeat=n):
        assert jump(nums) == jump_oracle(nums), nums
        counts['jumps'] += 1
for _ in range(500):
    nums = [rng.randrange(1, 1001) for _ in range(rng.randrange(1, 13))]
    assert jump(nums) == jump_oracle(nums), nums
    counts['jumps'] += 1


def check_pruning(a, b, budget):
    plain = compressed = 0
    for left in range(len(a)):
        for right in range(left + 1, len(a) + 1):
            score, memory = sum(a[left:right]), sum(b[left:right])
            if memory <= budget:
                plain = max(plain, score)
                compressed = max(compressed, score)
            minimum = min(a[left:right])
            for p in range(left, right):
                if a[p] == minimum and memory - b[p] + b[p] // 2 <= budget:
                    compressed = max(compressed, score - a[p])
    assert ai[0]['maximize'](a, b, budget) == (plain, compressed), (a, b, budget)
    counts['pruning'] += 1


for n in range(1, 5):
    for a in itertools.product((1, 2), repeat=n):
        for b in itertools.product((1, 2, 3), repeat=n):
            for budget in range(1, sum(b) + 1):
                check_pruning(a, b, budget)
for _ in range(1000):
    n = rng.randrange(1, 12)
    check_pruning([rng.randrange(1, 10) for _ in range(n)],
                  [rng.randrange(1, 20) for _ in range(n)], rng.randrange(1, 60))

for _ in range(300):
    n = rng.randrange(1, 12)
    points = [(rng.randrange(-5, 6), rng.randrange(-5, 6)) for _ in range(n)]
    radius, threshold = rng.randrange(5), rng.randrange(1, n + 2)
    nb = [[j for j in range(n) if sum((points[i][k] - points[j][k]) ** 2
                                    for k in (0, 1)) <= radius ** 2] for i in range(n)]
    core = [len(row) >= threshold for row in nb]
    reachable = []
    for start in range(n):
        if not core[start]:
            continue
        seen, stack = {start}, [start]
        while stack:
            i = stack.pop()
            if core[i]:
                for j in nb[i]:
                    if j not in seen:
                        seen.add(j)
                        stack.append(j)
        reachable.append(seen)
    got = ai[1]['cluster_memberships'](points, radius, threshold)
    for a in range(n):
        for b in range(n):
            expected = any(a in row and b in row for row in reachable)
            assert bool(got[a] & got[b]) == expected
            counts['clustering_queries'] += 1
assert ai[1]['scaled'](['0.10', '-1.25', '2e-3']) == [100, -1250, 2]
# A border point touches two core components but cannot merge them.
points = [(-10, 0)] * 4 + [(10, 0)] * 4 + [(-5, 0), (5, 0), (0, 0)]
sets = ai[1]['cluster_memberships'](points, 5, 4)
assert len(sets[-1]) == 2 and not (sets[0] & sets[4])

for n in range(9):
    for _ in range(25):
        costs = [rng.randrange(1, 20) for _ in range(n)]
        for k in range(n + 2):
            for skip in range(n + 2):
                candidates = []
                for combo in itertools.combinations(range(n), k):
                    boundaries = (-1,) + combo + (n,)
                    if all(b - a - 1 <= skip for a, b in zip(boundaries, boundaries[1:])):
                        candidates.append(sum(costs[i] for i in combo))
                expected = min(candidates, default=-1)
                assert dev[0]['min_total_time'](costs, k, skip) == expected
                counts['scheduling'] += 1

for n in range(1, 11):
    for _ in range(100):
        difficulty = [rng.randrange(1, 15) for _ in range(n)]
        k, d = rng.randrange(n + 2), rng.randrange(4)
        low = rng.randrange(1, 50)
        high = low + rng.randrange(50)
        plans = [list(c) for c in itertools.combinations(range(1, n + 1), k)
                 if all(b - a > d for a, b in zip(c, c[1:]))
                 and low <= sum(difficulty[i - 1] for i in c) <= high]
        assert dev[1]['design_plans'](difficulty, k, d, low, high) == (len(plans), plans[:3])
        counts['designs'] += 1
# Exercise the exact published scripts as subprocesses, including their I/O.
subprocess_cases = 0
with tempfile.TemporaryDirectory(prefix='huawei-0911-') as directory:
    scripts = {}
    for role in ('ai', 'dev'):
        text = (ROOT / f'04_real_interviews/huawei/{role}-20260911.md').read_text()
        for number, code in enumerate(re.findall(r'```python\n(.*?)\n```', text, re.S)):
            path = Path(directory) / f'{role}-{number}.py'
            path.write_text(code)
            scripts[role, number - 1 if role == 'dev' else number] = path

    def run(role, number, data, expected):
        global subprocess_cases
        result = subprocess.run([sys.executable, str(scripts[role, number])],
                                input=data, text=True, capture_output=True, timeout=5)
        assert result.returncode == 0 and not result.stderr
        assert result.stdout.strip() == expected.strip(), (data, result.stdout, expected)
        subprocess_cases += 1

    for _ in range(50):
        n = rng.randrange(1, 8)
        a = [rng.randrange(1, 10) for _ in range(n)]
        b = [rng.randrange(1, 10) for _ in range(n)]
        budget = rng.randrange(1, 20)
        check_pruning(a, b, budget)
        expected = ai[0]['maximize'](a, b, budget)
        run('ai', 0, f'{n} {budget}\n' + ' '.join(map(str, a)) + '\n'
            + ' '.join(map(str, b)) + '\n', ' '.join(map(str, expected)))
        k, skip = rng.randrange(n + 2), rng.randrange(n + 1)
        run('dev', 0, ' '.join(map(str, a)) + f'\n{k}\n{skip}\n',
            str(dev[0]['min_total_time'](a, k, skip)))
        count, plans = dev[1]['design_plans'](a, k, 1, 2, 30)
        run('dev', 1, f'{n} {k} 1 2 30\n' + ' '.join(map(str, a)) + '\n',
            '\n'.join([str(count)] + [' '.join(map(str, p)) for p in plans]))
    run('dev', 0, '\n0\n0\n', '0')
    run('ai', 1, '2 2 0.1 2\n0 0\n0.100000001 0\n0 1\n0 0\n', '0\n0')
    run('ai', 1, '2 2 0.1 2\n0 0\n0.1 0\n0 1\n0 0\n', '1\n1')
print('PASS', counts, 'subprocess_cases=', subprocess_cases)
