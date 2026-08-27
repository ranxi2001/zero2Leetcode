const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const languageSource = fs.readFileSync(path.join(root, 'assets/js/playground-languages.js'), 'utf8');
const playgroundSource = fs.readFileSync(path.join(root, 'assets/js/playground.js'), 'utf8');
const batchDirectory = path.join(root, 'assets/js/playground-extra');

function createContext(search = '') {
    const storage = new Map();
    const context = {
        AbortController,
        TextDecoder,
        TextEncoder,
        URLSearchParams,
        Worker: class {},
        atob,
        btoa,
        clearTimeout,
        console,
        document: {
            addEventListener() {},
            createElement() { return {}; },
            getElementById() { return null; }
        },
        fetch: async () => { throw new Error('Unexpected network request'); },
        localStorage: {
            getItem(key) { return storage.has(key) ? storage.get(key) : null; },
            removeItem(key) { storage.delete(key); },
            setItem(key, value) { storage.set(key, String(value)); }
        },
        performance: { now: () => 0 },
        setTimeout,
        testStorage: storage,
        window: {
            addEventListener() {},
            history: { replaceState() {} },
            location: { hash: '', pathname: '/playground.html', search }
        }
    };
    context.window.window = context.window;
    vm.createContext(context);
    vm.runInContext(languageSource, context, { filename: 'playground-languages.js' });
    vm.runInContext(playgroundSource, context, { filename: 'playground.js' });
    for (const file of fs.readdirSync(batchDirectory).sort()) {
        vm.runInContext(fs.readFileSync(path.join(batchDirectory, file), 'utf8'), context, { filename: file });
    }
    return context;
}

function getProblems(context) {
    return vm.runInContext('getAllDetailedProblems()', context);
}

function getProblem(context, id) {
    return getProblems(context).filter((problem) => problem.id === id).at(-1);
}

function parseTxtar(source) {
    const files = new Map();
    const markers = Array.from(source.matchAll(/^-- ([^\n]+) --\n/gm));
    markers.forEach((marker, index) => {
        const start = marker.index + marker[0].length;
        const end = index + 1 < markers.length ? markers[index + 1].index : source.length;
        files.set(marker[1], source.slice(start, end));
    });
    return files;
}

function runGeneratedGo(source) {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'z2l-go-core-'));
    try {
        for (const [name, content] of parseTxtar(source)) {
            fs.writeFileSync(path.join(directory, name), content);
        }
        return spawnSync('go', ['run', 'solution.go', 'z2l_harness.go'], {
            cwd: directory,
            encoding: 'utf8',
            timeout: 30000
        });
    } finally {
        fs.rmSync(directory, { recursive: true, force: true });
    }
}

test('core playground exposes Python, Java 17, and Go editor modes', () => {
    const html = fs.readFileSync(path.join(root, 'playground.html'), 'utf8');
    assert.match(html, /<option value="python">Python 3<\/option>/);
    assert.match(html, /<option value="java">Java 17<\/option>/);
    assert.match(html, /<option value="go">Go<\/option>/);
    assert.match(html, /mode\/go\/go\.min\.js/);
    assert.match(html, /mode\/clike\/clike\.min\.js/);
    assert.match(html, /assets\/js\/playground-languages\.js/);
});

test('language query and drafts stay isolated per problem and language', () => {
    const context = createContext('?id=1&language=java');
    assert.equal(vm.runInContext('currentLanguage', context), 'java');

    vm.runInContext(`
        saveCode(1, 'python-code', 'python');
        saveCode(1, 'java-code', 'java');
        saveCode(1, 'go-code', 'go');
    `, context);

    assert.equal(context.testStorage.get('z2l_playground_1'), 'python-code');
    assert.equal(context.testStorage.get('z2l_playground_java_1'), 'java-code');
    assert.equal(context.testStorage.get('z2l_playground_go_1'), 'go-code');
});

test('all locally executable problems produce Java and Go core templates', () => {
    const context = createContext();
    const support = context.window.LEETCODE_LANGUAGE_SUPPORT;
    const executable = getProblems(context).filter((problem) => problem.testCases?.length);

    assert.equal(executable.length, 116);
    for (const problem of executable) {
        const signature = support.parseProblemSignature(problem);
        assert.ok(signature, `LC ${problem.id} should expose a typed core signature`);
        const javaTemplate = support.getTemplate(problem, 'java');
        const goTemplate = support.getTemplate(problem, 'go');
        assert.ok(javaTemplate.trim(), `LC ${problem.id} should have a Java template`);
        assert.ok(goTemplate.trim(), `LC ${problem.id} should have a Go template`);
        assert.doesNotMatch(javaTemplate, /public\s+class\s+Main/);
        assert.doesNotMatch(goTemplate, /^\s*package\s+main/m);
    }
});

test('generated signatures follow Java and Go LeetCode core conventions', () => {
    const context = createContext();
    const support = context.window.LEETCODE_LANGUAGE_SUPPORT;

    assert.match(support.getTemplate(getProblem(context, 1), 'java'), /class Solution[\s\S]*int\[\] twoSum\(int\[\] nums, int target\)/);
    assert.match(support.getTemplate(getProblem(context, 1), 'go'), /func twoSum\(nums \[\]int, target int\) \[\]int/);
    assert.match(support.getTemplate(getProblem(context, 94), 'java'), /List<Integer> inorderTraversal\(TreeNode root\)/);
    assert.match(support.getTemplate(getProblem(context, 94), 'go'), /func inorderTraversal\(root \*TreeNode\) \[\]int/);
    assert.match(support.getTemplate(getProblem(context, 146), 'java'), /class LRUCache/);
    assert.match(support.getTemplate(getProblem(context, 146), 'go'), /func Constructor\(capacity int\) LRUCache/);
});

test('Go harness executes core functions and returns structured test results', () => {
    const context = createContext();
    const support = context.window.LEETCODE_LANGUAGE_SUPPORT;
    const problem = getProblem(context, 1);
    const userCode = `func twoSum(nums []int, target int) []int {
    positions := map[int]int{}
    for index, value := range nums {
        if other, ok := positions[target-value]; ok {
            return []int{other, index}
        }
        positions[value] = index
    }
    return nil
}`;
    const execution = runGeneratedGo(support.buildGoSource(problem, userCode));

    assert.equal(execution.status, 0, execution.stderr);
    const results = support.parseRunnerOutput(execution.stdout, problem.testCases.length);
    assert.equal(results.length, problem.testCases.length);
    results.forEach((result, index) => {
        assert.equal(result.error, undefined);
        assert.deepEqual(
            Array.from(result.actual).sort((a, b) => a - b),
            Array.from(problem.testCases[index].expected).sort((a, b) => a - b)
        );
    });
});

test('Go harness compiles tree, mutation, collection, and class adapters', () => {
    const context = createContext();
    const support = context.window.LEETCODE_LANGUAGE_SUPPORT;
    for (const id of [94, 114, 139, 146, 160, 189]) {
        const problem = getProblem(context, id);
        const source = support.buildGoSource(problem, support.getTemplate(problem, 'go'));
        const execution = runGeneratedGo(source);
        assert.equal(execution.status, 0, `LC ${id}: ${execution.stderr}`);
        assert.match(execution.stdout, /__Z2L_(?:RESULT|ERROR)__/);
    }
});

test('Java harness wraps Solution code without exposing ACM input/output', () => {
    const context = createContext();
    const support = context.window.LEETCODE_LANGUAGE_SUPPORT;
    const twoSum = getProblem(context, 1);
    const wordBreak = getProblem(context, 139);
    const source = support.buildJavaSource(twoSum, support.getTemplate(twoSum, 'java'));
    const wordBreakSource = support.buildJavaSource(wordBreak, support.getTemplate(wordBreak, 'java'));

    assert.match(source, /public class Main/);
    assert.match(source, /new Solution\(\)\.twoSum\(new int\[\]\{2, 7, 11, 15\}, 9\)/);
    assert.match(source, /__Z2L_RESULT__/);
    assert.doesNotMatch(support.getTemplate(twoSum, 'java'), /public class Main|Scanner|System\.in/);
    assert.match(wordBreakSource, /new java\.util\.ArrayList<>\(java\.util\.Arrays\.asList\("leet", "code"\)\)/);
});

test('Java core runner initializes the browser worker and parses every case', async () => {
    const workers = [];
    class FakeWorker {
        constructor(url) {
            this.url = url;
            this.messages = [];
            workers.push(this);
        }

        postMessage(message) { this.messages.push(message); }
        terminate() {}
        emit(data) { this.onmessage({ data }); }
    }
    const context = {
        AbortController,
        TextEncoder,
        URLSearchParams,
        Worker: FakeWorker,
        clearTimeout,
        console,
        fetch: async () => { throw new Error('Unexpected network request'); },
        setTimeout,
        window: {}
    };
    vm.createContext(context);
    vm.runInContext(languageSource, context, { filename: 'playground-languages.js' });
    const support = context.window.LEETCODE_LANGUAGE_SUPPORT;
    const problem = {
        id: 1,
        template: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    pass`,
        testCases: [
            { input: [[2, 7], 9], expected: [0, 1] },
            { input: [[3, 2, 4], 6], expected: [1, 2] }
        ]
    };
    const execution = support.runCompiledTests('java', problem, support.getTemplate(problem, 'java'));
    const worker = workers[0];
    assert.ok(worker);
    assert.match(worker.url, /java-runner-worker\.js/);
    worker.emit({ type: 'ready' });
    await new Promise((resolve) => setImmediate(resolve));

    assert.equal(worker.messages.length, 1);
    assert.equal(worker.messages[0].type, 'execute');
    assert.match(worker.messages[0].code, /class Solution/);
    assert.match(worker.messages[0].code, /public class Main/);
    worker.emit({
        type: 'result',
        id: worker.messages[0].id,
        result: {
            stdout: '__Z2L_RESULT__0\t[0,1]\n__Z2L_RESULT__1\t[1,2]\n',
            error: null
        }
    });

    assert.deepEqual(JSON.parse(JSON.stringify(await execution)), [
        { actual: [0, 1] },
        { actual: [1, 2] }
    ]);
});

test('compiled runner output keeps per-case values and errors isolated', () => {
    const context = createContext();
    const support = context.window.LEETCODE_LANGUAGE_SUPPORT;
    const output = [
        '__Z2L_RESULT__0\t[1,2]',
        '__Z2L_ERROR__1\t"boom\\nline 2"',
        '__Z2L_RESULT__2\ttrue',
    ].join('\n');

    assert.deepEqual(JSON.parse(JSON.stringify(support.parseRunnerOutput(output, 4))), [
        { actual: [1, 2] },
        { error: 'boom\nline 2' },
        { actual: true },
        { error: '运行器未返回该测试用例的结果。' },
    ]);
});
