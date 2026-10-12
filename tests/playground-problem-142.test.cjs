const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');

const context = { window: {}, document: { readyState: 'loading' } };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(__dirname, '../assets/js/playground-extra/batch-1.js'), 'utf8'), context);
const problem = context.window.PLAYGROUND_EXTRA_PROBLEMS.find(p => p.id === 142);

function runPython(source) {
  const result = spawnSync('python', ['-c', problem.setup + '\n' + source], { encoding: 'utf8', timeout: 10000 });
  assert.equal(result.status, 0, result.stderr || String(result.error));
}

test('LC 142 runs Floyd detection on every configured local case', () => {
  assert.ok(problem.testCases.length >= 8);
  runPython(`
import json
def detect_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            slow = head
            while slow is not fast:
                slow = slow.next
                fast = fast.next
            return slow
    return None
cases = json.loads(${JSON.stringify(JSON.stringify(problem.testCases))})
for case in cases:
    assert ${problem.functionName}(*case['input']) == case['expected'], case
`);
});

test('LC 142 rejects values, indices, copied nodes, and modified links', () => {
  runPython(`
def expect_invalid(solution):
    global detect_cycle
    detect_cycle = solution
    try:
        ${problem.functionName}([7, 7, 7], 1)
    except ValueError:
        return
    raise AssertionError('Invalid solution accepted')
expect_invalid(lambda head: 7)
expect_invalid(lambda head: 1)
expect_invalid(lambda head: ListNode(7))
def mutate(head):
    result = head.next
    head.next = None
    return result
expect_invalid(mutate)
def mutate_value(head):
    head.val = 0
    return head.next
expect_invalid(mutate_value)
detect_cycle = lambda head: head
assert ${problem.functionName}([7, 7, 7], 1) != 1
detect_cycle = lambda head: None
assert ${problem.functionName}([7, 7, 7], 1) != 1
`);
});
