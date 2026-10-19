const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const batchPath = path.join(root, 'assets/js/playground-extra/batch-8.js');
const htmlPath = path.join(root, 'playground.html');

function loadProblem() {
  const context = { window: {}, document: { readyState: 'loading' }, BINARY_TREE_SETUP: '' };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(batchPath, 'utf8'), context, { filename: batchPath });
  return context.window.PLAYGROUND_EXTRA_PROBLEMS.find(problem => problem.id === 93);
}

test('LC 93 is registered in the playground and its script is cache-busted', () => {
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert.ok(html.includes('assets/js/playground-extra/batch-8.js'), 'LC 93 batch must be loaded');
  const problem = loadProblem();
  assert.ok(problem, 'LC 93 must be available in the local problem bank');
  assert.equal(problem.title, 'LC 93 - 复原 IP 地址');
  assert.equal(problem.difficulty, 'Medium');
  assert.equal(problem.functionName, 'restore_ip_addresses');
  assert.deepEqual(JSON.parse(JSON.stringify(problem.testCases)), [
    { input: ['25525511135'], expected: ['255.255.11.135', '255.255.111.35'] },
    { input: ['0000'], expected: ['0.0.0.0'] },
    { input: ['101023'], expected: ['1.0.10.23', '1.0.102.3', '10.1.0.23', '10.10.2.3', '101.0.2.3'] },
  ]);
});
