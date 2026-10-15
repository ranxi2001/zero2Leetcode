const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const batchPath = path.join(root, 'assets/js/playground-extra/batch-2.js');

function loadProblem() {
  const context = {
    window: {},
    document: { readyState: 'loading' },
    LINKED_LIST_SETUP: '',
    BINARY_TREE_SETUP: '',
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(batchPath, 'utf8'), context, { filename: batchPath });
  return context.window.PLAYGROUND_EXTRA_PROBLEMS.find((item) => item.id === 23);
}

test('LeetCode 23 description shows regular and empty-input examples', () => {
  const problem = loadProblem();

  assert.ok(problem, 'LC 23 must have a detailed local playground configuration');
  assert.equal((problem.description.match(/<h4>示例 \d<\/h4>/g) || []).length, 3);
  assert.equal((problem.description.match(/<pre>/g) || []).length, 3);
  const examples = Array.from(
    problem.description.matchAll(/<pre>输入：lists = ([^\n]+)\n输出：([^<]+)<\/pre>/g),
    ([, input, expected]) => ({ input: [JSON.parse(input)], expected: JSON.parse(expected) }),
  );
  assert.deepEqual(examples, [
    { input: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
    { input: [[]], expected: [] },
    { input: [[[]]], expected: [] },
  ]);

  const configuredCases = JSON.parse(JSON.stringify(problem.testCases));
  for (const example of examples) {
    assert.ok(
      configuredCases.some((configured) => JSON.stringify(configured) === JSON.stringify(example)),
      `Displayed example must be runnable locally: ${JSON.stringify(example)}`,
    );
  }
});
