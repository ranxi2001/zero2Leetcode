const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const article = read('05_interview/coding/huawei.md');
const start = '<a id="sept-oct-supplement"></a>';
const end = '<!-- huawei-sept-oct:end -->';
const supplement = article.split(start)[1]?.split(end)[0] || '';

function group(number) {
  const section = supplement.split(`### 组${number}：`)[1]?.split('\n### ')[0];
  assert.ok(section, `Missing supplement group ${number}`);
  return section.split('\n').filter(line => line.startsWith('|')).slice(2)
    .map(line => line.slice(1, -1).split('|').map(cell => cell.trim()));
}

test('September–October transcript is a separate section below the unchanged TOP20', () => {
  assert.ok(supplement, 'Missing independent September–October supplement');
  assert.ok(article.includes(end), 'Supplement must have a bounded end');
  assert.ok(article.indexOf(start) > article.indexOf('| 20 | LC 46 |'));
  assert.ok(article.indexOf(end) < article.indexOf('<a id="handwritten-quicksort"></a>'));
  assert.match(supplement, /9\.1[-–]10\.12/);
  assert.match(supplement, /用户提供的转录/);
  assert.match(supplement, /原文链接未提供/);
  assert.match(supplement, /未经独立核验.*49\s*场/);
  assert.match(supplement, /无原始统计频次/);
  assert.match(supplement, /不参与\s*TOP20\s*排序/);
  for (const boundary of ['三来源', '6139', '646', '1148', '639', '不相加', '样本是否重叠未知']) {
    assert.ok(supplement.includes(boundary), boundary);
  }
  assert.match(supplement, /收录.*不代表.*已有.*练习/);
});

test('group 1 contains all 14 unique LC topics and preparation methods', () => {
  const expected = [
    [141, '环形链表', /快慢指针/], [104, '最大深度', /DFS/],
    [101, '对称二叉树', /对称|镜像/], [124, '最大路径和', /偏难/],
    [64, '最小路径和', /DP/], [62, '不同路径', /DP/],
    [32, '最长有效括号', /DP.*栈/], [560, '和为 K 的子数组', /前缀和.*哈希/],
    [55, '跳跃游戏', /贪心/], [238, '除自身以外数组的乘积', /前后缀/],
    [35, '搜索插入位置', /二分/], [153, '寻找旋转排序数组中的最小值', /二分/],
    [4, '两个正序数组的中位数', /难/], [295, '数据流的中位数', /双堆/],
  ];
  const rows = group(1);
  assert.equal(rows.length, 14);
  assert.deepEqual(rows.map(row => row[0]), expected.map(([id]) => `LC ${id}`));
  expected.forEach(([, title, method], i) => {
    assert.equal(rows[i].length, 4);
    assert.ok(rows[i][1].includes(title), title);
    assert.match(rows[i][2], method);
  });
});

test('group 2 retains all eight original IDs, names and their algorithms', () => {
  const rows = group(2);
  assert.equal(rows.length, 8);
  const expected = [
    [135, '分发糖果', /贪心/], [997, '小镇法官', /图.*哈希/],
    [673, '最长递增子序列个数', /DP/], [443, '压缩字符串', /双指针/],
    [209, '长度最小子数组', /滑动窗口/], [1004, '删掉一个元素后全为1最长子数组', /错配/],
    [930, '和为K最长子数组', /错配/], [315, '计算右侧小于当前元素个数', /树状数组.*归并/],
  ];
  assert.deepEqual(rows.map(row => row[0]), expected.map(([id]) => `原文 LC ${id}`));
  expected.forEach(([, title, method], i) => {
    assert.equal(rows[i].length, 4);
    assert.equal(rows[i][1], title);
    assert.match(rows[i][2], method);
  });
  assert.equal(new Set([...group(1), ...rows].map(row => row[0].replace('原文 ', ''))).size, 22);
});

test('mismatches preserve the transcript and distinguish official statements from candidates', () => {
  const rows = group(2);
  const deletion = rows.find(row => row[0] === '原文 LC 1004').join(' ');
  assert.match(deletion, /1493.*删掉一个元素以后全为\s*1\s*的最长子数组/);
  assert.match(deletion, /1004.*最大连续\s*1\s*个数\s*III/);
  assert.ok(deletion.includes('https://leetcode.cn/problems/longest-subarray-of-1s-after-deleting-one-element/'));
  assert.ok(deletion.includes('https://leetcode.cn/problems/max-consecutive-ones-iii/'));
  const sum = rows.find(row => row[0] === '原文 LC 930').join(' ');
  assert.match(sum, /930.*和相同的二元子数组.*求个数/);
  assert.match(sum, /325.*候选.*待原题确认/);
  assert.ok(sum.includes('https://leetcode.cn/problems/binary-subarrays-with-sum/description'));
  const countSmaller = rows.find(row => row[0] === '原文 LC 315').join(' ');
  assert.match(countSmaller, /原文备注.*斐波那契\s*O\(logn\)/);
  assert.match(countSmaller, /与题意无关.*不作为.*算法结论/);
});

test('group 3 keeps all eight non-LC topics, unresolved constraints and the local union-find note', () => {
  const rows = group(3);
  assert.equal(rows.length, 8);
  assert.deepEqual(rows.map(row => row[0]), [
    '环形石子合并', '整数拆分方案数', '相同字母排列数', '命令行参数解析',
    '找质因数', 'Top N 元素平均值', '子集和能否凑出目标', '并查集',
  ]);
  const checks = [/区间\s*DP/, /DP.*约束未明/, /组合数学.*约束待确认/,
    /字符串模拟/, /数论/, /堆.*N.*范围待确认/, /回溯.*DP/,
    /Agent\s*一面\s*3\s*次.*局部原文描述.*不.*全局频次/];
  rows.forEach((row, i) => {
    assert.equal(row.length, 2);
    assert.match(row[1], checks[i]);
    assert.doesNotMatch(row.join(' '), /playground\.html\?id=/);
  });
  assert.equal(new Set(rows.map(row => row[0])).size, 8);
});

test('supplement practice links resolve to real problems loaded by the page, never metadata fallbacks', () => {
  assert.ok(supplement, 'Supplement required for link validation');
  const context = {
    URLSearchParams, console,
    document: { readyState: 'loading', addEventListener() {}, getElementById() { return null; } },
    localStorage: { getItem() { return null; } },
    window: { addEventListener() {}, location: { search: '' } },
  };
  vm.createContext(context);
  const scripts = [...read('playground.html').matchAll(/<script\s+src="(assets\/js\/(?:problems-data|playground(?:-languages|-extra\/batch-\d+)?)\.js)(?:\?[^\"]*)?"/g)];
  assert.ok(scripts.length > 2);
  for (const [, file] of scripts) vm.runInContext(read(file), context, { filename: file });
  vm.runInContext('syncProblemRegistry()', context);
  const links = [...supplement.matchAll(/playground\.html\?id=(\d+)/g)];
  assert.ok(links.length > 0, 'Reuse available real practice links');
  for (const [, id] of links) {
    const problem = context.window.PROBLEMS.find(problem => problem.id === Number(id));
    assert.ok(problem && !problem.isFallback && problem.testCases?.length, `LC ${id}: no real practice`);
  }
  for (const row of [...group(1), ...group(2)]) {
    assert.match(row[3], /https:\/\/(?:onefly\.top\/zero2Leetcode\/playground\.html\?id=\d+|leetcode\.(?:cn|com)\/problems\/)/);
    if (!row[3].includes('playground.html')) assert.match(row[3], /官方/);
  }
  const median = group(1).find(row => row[0] === 'LC 295');
  assert.ok(median[3].includes('https://leetcode.cn/problems/find-median-from-data-stream/'));
  assert.doesNotMatch(median[3], /playground\.html/);
});

test('preparation reminders prioritize TOP20 first five, LC215 dual methods, ACM I/O and union-find', () => {
  assert.match(supplement, /TOP20\s*前\s*5.*优先/);
  assert.match(supplement, /LC\s*215.*快速选择.*堆/);
  assert.ok(supplement.includes('#lc215-two-methods'));
  assert.match(supplement, /ACM.*I\/O/);
  assert.match(supplement, /并查集.*路径压缩.*按秩|并查集.*路径压缩.*按大小/);
});

test('original TOP20 ranking, frequencies and links plus historical 38 classification remain byte-for-byte intact', () => {
  // Frozen before adding the transcript: includes every original row and link.
  const hash = block => crypto.createHash('sha256').update(block.trim()).digest('hex');
  const table = article.slice(article.indexOf('| 排名 | LC 题号 |')).split('\n\n')[0];
  assert.equal(hash(table), 'c38ac65f57958558c637c51115d923aa7a9fcadb29da2d58a70a9f1e2cbed036');
  const historical = article.slice(article.indexOf('## 高频手撕题 Top 38（分类详解）'), article.indexOf('### Hot100'));
  assert.equal(hash(historical), '01ed0ee9fde58a5824ecd5fa2239f2823cd43e9fdd617f7bd1ef7055bd76f5dc');
});
