const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const expected = {
  '双指针/滑动窗口': [3,42,15,11,209,239],
  '图论': [200,207,695],
  '栈系列': [20,394,739,155],
  '链表': [146,206,19,21,142,2,23,92],
  '二叉树': [102,124],
  '排序/二分': [56,215,704],
  '动态规划': [300,53,70,64,72],
  '回溯': [46,93],
  '哈希': [1,451],
  '贪心': [55,406],
  '矩阵模拟': [54],
};

test('Huawei topic tables place each problem once and agree with overview counts', () => {
  const md = fs.readFileSync(path.join(__dirname, '../05_interview/coding/huawei.md'), 'utf8');
  const block = md.split('### 分类总览')[1].split('### Hot100')[0];
  const seen = [];
  for (const [category, ids] of Object.entries(expected)) {
    const section = block.split(`### ${category}（`)[1];
    assert.ok(section, `Missing category ${category}`);
    const count = Number(section.match(/^(\d+) 道）/)[1]);
    const rows = section.split(/\n### /)[0];
    const actual = [...rows.matchAll(/\[LC (\d+)\./g)].map(m => Number(m[1]));
    assert.deepEqual(actual, ids, category);
    assert.equal(count, actual.length, category);
    assert.ok(block.includes(`| ${category} | ${count} 道 |`), `Overview count for ${category}`);
    seen.push(...actual);
  }
  assert.equal(seen.length, 38);
  assert.equal(new Set(seen).size, 38);
});
