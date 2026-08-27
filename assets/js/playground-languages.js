// =============================================
// LeetCode core-mode language templates and runners
// =============================================

(function (global) {
    'use strict';

    const RESULT_PREFIX = '__Z2L_RESULT__';
    const ERROR_PREFIX = '__Z2L_ERROR__';
    const GO_PLAYGROUND_API = 'https://play.golang.org/compile';
    const JAVA_WORKER_URL = 'assets/js/java-runner-worker.js?v=20260803';
    const JAVA_INIT_TIMEOUT_MS = 90000;
    const EXECUTION_TIMEOUT_MS = 10000;
    const JAVA_MAX_SOURCE_BYTES = 48 * 1024;

    const LANGUAGES = Object.freeze({
        python: Object.freeze({ label: 'Python 3', mode: 'python', indentUnit: 4, indentWithTabs: false }),
        java: Object.freeze({ label: 'Java 17', mode: 'text/x-java', indentUnit: 4, indentWithTabs: false }),
        go: Object.freeze({ label: 'Go', mode: 'text/x-go', indentUnit: 4, indentWithTabs: true }),
    });

    const JAVA_RETURN_OVERRIDES = Object.freeze({
        15: 'List<List<Integer>>',
        17: 'List<String>',
        22: 'List<String>',
        39: 'List<List<Integer>>',
        46: 'List<List<Integer>>',
        49: 'List<List<String>>',
        51: 'List<List<String>>',
        54: 'List<Integer>',
        78: 'List<List<Integer>>',
        94: 'List<Integer>',
        102: 'List<List<Integer>>',
        103: 'List<List<Integer>>',
        118: 'List<List<Integer>>',
        131: 'List<List<String>>',
        199: 'List<Integer>',
        438: 'List<Integer>',
        763: 'List<Integer>',
    });

    function normalizeLanguage(language) {
        return Object.prototype.hasOwnProperty.call(LANGUAGES, language) ? language : 'python';
    }

    function toCamelCase(value) {
        return String(value || '').replace(/_([a-z0-9])/g, (_, character) => character.toUpperCase());
    }

    function parseProblemSignature(problem) {
        if (problem && Number(problem.id) === 146) {
            return { kind: 'class', className: 'LRUCache', params: [], returnType: 'None' };
        }

        const template = String(problem?.template || '');
        const match = template.match(/^def\s+([A-Za-z_]\w*)\s*\(([^)]*)\)\s*:/m);
        if (!match) return null;

        const declaredTypes = {};
        for (const typeMatch of template.matchAll(/:type\s+([A-Za-z_]\w*)\s*:\s*([^\n]+)/g)) {
            declaredTypes[typeMatch[1]] = typeMatch[2].trim();
        }
        const returnType = template.match(/:rtype:\s*([^\n]+)/)?.[1].trim() || 'object';
        const params = match[2]
            .split(',')
            .map((parameter) => parameter.trim().split('=')[0].trim())
            .filter(Boolean)
            .map((name) => ({ name, pythonType: declaredTypes[name] || 'object' }));

        return {
            kind: 'function',
            pythonName: match[1],
            coreName: toCamelCase(match[1]),
            params,
            returnType,
        };
    }

    function javaType(pythonType, direction, problem, parameterName = '') {
        if (direction === 'return' && JAVA_RETURN_OVERRIDES[Number(problem?.id)]) {
            return JAVA_RETURN_OVERRIDES[Number(problem.id)];
        }
        if (pythonType === 'int') return 'int';
        if (pythonType === 'float') return 'double';
        if (pythonType === 'bool') return 'boolean';
        if (pythonType === 'str') return 'String';
        if (pythonType === 'List[int]') return 'int[]';
        if (pythonType === 'List[str]') {
            return direction === 'param' && parameterName === 'wordDict' ? 'List<String>' : 'String[]';
        }
        if (pythonType === 'List[List[int]]') return 'int[][]';
        if (pythonType === 'List[List[str]]') {
            return direction === 'param' ? 'char[][]' : 'List<List<String>>';
        }
        if (pythonType === 'List[List[object]]') return 'Object[][]';
        if (pythonType === 'List[ListNode]') return 'ListNode[]';
        if (pythonType === 'ListNode') return 'ListNode';
        if (pythonType === 'TreeNode') return 'TreeNode';
        if (pythonType === 'Node') return 'Node';
        if (pythonType === 'None') return 'void';
        return 'Object';
    }

    function goType(pythonType, direction) {
        if (pythonType === 'int') return 'int';
        if (pythonType === 'float') return 'float64';
        if (pythonType === 'bool') return 'bool';
        if (pythonType === 'str') return 'string';
        if (pythonType === 'List[int]') return '[]int';
        if (pythonType === 'List[str]') return '[]string';
        if (pythonType === 'List[List[int]]') return '[][]int';
        if (pythonType === 'List[List[str]]') return direction === 'param' ? '[][]byte' : '[][]string';
        if (pythonType === 'List[List[object]]') return '[][]any';
        if (pythonType === 'List[ListNode]') return '[]*ListNode';
        if (pythonType === 'ListNode') return '*ListNode';
        if (pythonType === 'TreeNode') return '*TreeNode';
        if (pythonType === 'Node') return '*Node';
        if (pythonType === 'None') return '';
        return 'any';
    }

    function javaDefaultValue(type) {
        if (type === 'int') return '0';
        if (type === 'double') return '0.0';
        if (type === 'boolean') return 'false';
        if (type === 'String') return '""';
        if (type === 'int[]') return 'new int[0]';
        if (type === 'String[]') return 'new String[0]';
        if (type === 'int[][]') return 'new int[0][]';
        if (type === 'char[][]') return 'new char[0][]';
        if (type === 'Object[][]') return 'new Object[0][]';
        if (type.startsWith('List<')) return 'new ArrayList<>()';
        return 'null';
    }

    function javaDataStructureComment(signature) {
        const types = [signature.returnType, ...signature.params.map((param) => param.pythonType)];
        const sections = [];
        if (types.some((type) => type === 'ListNode' || type === 'List[ListNode]')) {
            sections.push(`/**
 * Definition for singly-linked list.
 * class ListNode { int val; ListNode next; }
 */`);
        }
        if (types.includes('TreeNode')) {
            sections.push(`/**
 * Definition for a binary tree node.
 * class TreeNode { int val; TreeNode left; TreeNode right; }
 */`);
        }
        if (types.includes('Node')) {
            sections.push(`/**
 * Definition for a random-pointer node.
 * class Node { int val; Node next; Node random; }
 */`);
        }
        return sections.join('\n\n');
    }

    function buildJavaClassTemplate(problem) {
        const problemId = Number(problem?.id);
        if (problemId === 146) {
            return `import java.util.*;

class LRUCache {
    public LRUCache(int capacity) {
    }

    public int get(int key) {
        return -1;
    }

    public void put(int key, int value) {
    }
}
`;
        }
        if (problemId === 208) {
            return `class Trie {
    public Trie() {
    }

    public void insert(String word) {
    }

    public boolean search(String word) {
        return false;
    }

    public boolean startsWith(String prefix) {
        return false;
    }
}
`;
        }
        if (problemId === 295) {
            return `class MedianFinder {
    public MedianFinder() {
    }

    public void addNum(int num) {
    }

    public double findMedian() {
        return 0.0;
    }
}
`;
        }
        if (problemId === 232) {
            return `class MyQueue {
    public MyQueue() {
    }

    public void push(int x) {
    }

    public int pop() {
        return 0;
    }

    public int peek() {
        return 0;
    }

    public boolean empty() {
        return true;
    }
}
`;
        }
        return `class Solution {
    // 请根据题目补全核心代码
}
`;
    }

    function buildJavaTemplate(problem) {
        const signature = parseProblemSignature(problem);
        if (!signature || signature.kind === 'class') return buildJavaClassTemplate(problem);

        const returnType = javaType(signature.returnType, 'return', problem);
        const params = signature.params.map((param) =>
            `${javaType(param.pythonType, 'param', problem, param.name)} ${toCamelCase(param.name)}`
        ).join(', ');
        const comment = javaDataStructureComment(signature);
        const body = returnType === 'void'
            ? '        // 在这里写你的代码'
            : `        // 在这里写你的代码\n        return ${javaDefaultValue(returnType)};`;

        return `import java.util.*;

${comment ? comment + '\n\n' : ''}class Solution {
    public ${returnType} ${signature.coreName}(${params}) {
${body}
    }
}
`;
    }

    function goDataStructureComment(signature) {
        const types = [signature.returnType, ...signature.params.map((param) => param.pythonType)];
        const sections = [];
        if (types.some((type) => type === 'ListNode' || type === 'List[ListNode]')) {
            sections.push(`// Definition for singly-linked list.
// type ListNode struct { Val int; Next *ListNode }`);
        }
        if (types.includes('TreeNode')) {
            sections.push(`// Definition for a binary tree node.
// type TreeNode struct { Val int; Left *TreeNode; Right *TreeNode }`);
        }
        if (types.includes('Node')) {
            sections.push(`// Definition for a random-pointer node.
// type Node struct { Val int; Next *Node; Random *Node }`);
        }
        return sections.join('\n\n');
    }

    function buildGoClassTemplate(problem) {
        const problemId = Number(problem?.id);
        if (problemId === 146) {
            return `type LRUCache struct {
}

func Constructor(capacity int) LRUCache {
    return LRUCache{}
}

func (cache *LRUCache) Get(key int) int {
    return -1
}

func (cache *LRUCache) Put(key int, value int) {
}
`;
        }
        if (problemId === 208) {
            return `type Trie struct {
}

func Constructor() Trie {
    return Trie{}
}

func (trie *Trie) Insert(word string) {
}

func (trie *Trie) Search(word string) bool {
    return false
}

func (trie *Trie) StartsWith(prefix string) bool {
    return false
}
`;
        }
        if (problemId === 295) {
            return `type MedianFinder struct {
}

func Constructor() MedianFinder {
    return MedianFinder{}
}

func (finder *MedianFinder) AddNum(num int) {
}

func (finder *MedianFinder) FindMedian() float64 {
    return 0
}
`;
        }
        if (problemId === 232) {
            return `type MyQueue struct {
}

func Constructor() MyQueue {
    return MyQueue{}
}

func (queue *MyQueue) Push(x int) {
}

func (queue *MyQueue) Pop() int {
    return 0
}

func (queue *MyQueue) Peek() int {
    return 0
}

func (queue *MyQueue) Empty() bool {
    return true
}
`;
        }
        return '// 请根据题目补全核心代码\n';
    }

    function buildGoTemplate(problem) {
        const signature = parseProblemSignature(problem);
        if (!signature || signature.kind === 'class') return buildGoClassTemplate(problem);

        const params = signature.params.map((param) =>
            `${toCamelCase(param.name)} ${goType(param.pythonType, 'param')}`
        ).join(', ');
        const returnType = goType(signature.returnType, 'return');
        const comment = goDataStructureComment(signature);
        const returnClause = returnType ? ` ${returnType}` : '';
        const body = returnType ? '    return nil' : '    // 在这里写你的代码';
        const typedBody = returnType && !returnType.startsWith('[]') && !returnType.startsWith('*') && returnType !== 'any'
            ? `    var result ${returnType}\n    return result`
            : body;

        return `${comment ? comment + '\n\n' : ''}func ${signature.coreName}(${params})${returnClause} {
    // 在这里写你的代码
${typedBody.startsWith('    //') ? '' : typedBody + '\n'} }
`.replace('\n }', '\n}');
    }

    function getTemplate(problem, language) {
        const normalized = normalizeLanguage(language);
        if (normalized === 'java') return buildJavaTemplate(problem);
        if (normalized === 'go') return buildGoTemplate(problem);
        return String(problem?.template || '');
    }

    function javaString(value) {
        return JSON.stringify(String(value));
    }

    function javaArray(values, itemType, problem) {
        const items = (values || []).map((value) => javaValue(value, itemType, '', problem)).join(', ');
        const mapped = javaType(`List[${itemType}]`, 'param', problem);
        if (mapped === 'List<String>') {
            return `new java.util.ArrayList<>(java.util.Arrays.asList(${items}))`;
        }
        return `new ${mapped.replace(/\[\]$/, '')}[]{${items}}`;
    }

    function javaValue(value, pythonType, wrapper, problem, parameterName = '') {
        if (wrapper === '_to_linked_list') return `Z2L.list(${javaValue(value, 'List[int]', '', problem)})`;
        if (wrapper === '_to_linked_lists') {
            const lists = (value || []).map((item) => `Z2L.list(${javaValue(item, 'List[int]', '', problem)})`);
            return `new ListNode[]{${lists.join(', ')}}`;
        }
        if (wrapper === '_to_tree') return `Z2L.tree(${javaIntegerArray(value)})`;
        if (wrapper === '_to_cyclic_list') {
            return `Z2L.cycle(${javaValue(value?.[0] || [], 'List[int]', '', problem)}, ${Number(value?.[1] ?? -1)})`;
        }
        if (value === null || value === undefined) return 'null';
        if (pythonType === 'int') return String(Math.trunc(Number(value)));
        if (pythonType === 'float') return String(Number(value));
        if (pythonType === 'bool') return value ? 'true' : 'false';
        if (pythonType === 'str') return javaString(value);
        if (pythonType === 'ListNode') return `Z2L.list(${javaValue(value, 'List[int]', '', problem)})`;
        if (pythonType === 'TreeNode') return `Z2L.tree(${javaIntegerArray(value)})`;
        if (pythonType === 'List[int]') return javaArray(value, 'int', problem);
        if (pythonType === 'List[str]') {
            const items = (value || []).map(javaString).join(', ');
            if (parameterName === 'wordDict') {
                return `new java.util.ArrayList<>(java.util.Arrays.asList(${items}))`;
            }
            return `new String[]{${items}}`;
        }
        if (pythonType === 'List[List[int]]') {
            const rows = (value || []).map((row) => javaValue(row, 'List[int]', '', problem));
            return `new int[][]{${rows.join(', ')}}`;
        }
        if (pythonType === 'List[List[str]]') {
            const rows = (value || []).map((row) => `${javaString((row || []).join(''))}.toCharArray()`);
            return `new char[][]{${rows.join(', ')}}`;
        }
        if (pythonType === 'List[List[object]]') {
            const rows = (value || []).map((row) => {
                const items = (row || []).map((item) => {
                    if (typeof item === 'string') return javaString(item);
                    if (typeof item === 'boolean') return item ? 'true' : 'false';
                    if (item === null) return 'null';
                    return String(item);
                });
                return `new Object[]{${items.join(', ')}}`;
            });
            return `new Object[][]{${rows.join(', ')}}`;
        }
        return javaString(JSON.stringify(value));
    }

    function javaIntegerArray(values) {
        const items = (values || []).map((value) => value === null ? 'null' : String(Math.trunc(Number(value))));
        return `new Integer[]{${items.join(', ')}}`;
    }

    function goValue(value, pythonType, wrapper) {
        if (wrapper === '_to_linked_list') return `z2lList(${goValue(value, 'List[int]', '')})`;
        if (wrapper === '_to_linked_lists') {
            const lists = (value || []).map((item) => `z2lList(${goValue(item, 'List[int]', '')})`);
            return `[]*ListNode{${lists.join(', ')}}`;
        }
        if (wrapper === '_to_tree') return `z2lTree(${goAnyArray(value)})`;
        if (wrapper === '_to_cyclic_list') {
            return `z2lCycle(${goValue(value?.[0] || [], 'List[int]', '')}, ${Number(value?.[1] ?? -1)})`;
        }
        if (value === null || value === undefined) return 'nil';
        if (pythonType === 'int') return String(Math.trunc(Number(value)));
        if (pythonType === 'float') return String(Number(value));
        if (pythonType === 'bool') return value ? 'true' : 'false';
        if (pythonType === 'str') return JSON.stringify(String(value));
        if (pythonType === 'ListNode') return `z2lList(${goValue(value, 'List[int]', '')})`;
        if (pythonType === 'TreeNode') return `z2lTree(${goAnyArray(value)})`;
        if (pythonType === 'List[int]') return `[]int{${(value || []).map((item) => String(item)).join(', ')}}`;
        if (pythonType === 'List[str]') return `[]string{${(value || []).map((item) => JSON.stringify(item)).join(', ')}}`;
        if (pythonType === 'List[List[int]]') {
            return `[][]int{${(value || []).map((row) => goValue(row, 'List[int]', '')).join(', ')}}`;
        }
        if (pythonType === 'List[List[str]]') {
            return `[][]byte{${(value || []).map((row) => `[]byte(${JSON.stringify((row || []).join(''))})`).join(', ')}}`;
        }
        if (pythonType === 'List[List[object]]') {
            const rows = (value || []).map((row) => `[]any{${(row || []).map((item) => {
                if (item === null) return 'nil';
                return typeof item === 'string' ? JSON.stringify(item) : String(item);
            }).join(', ')}}`);
            return `[][]any{${rows.join(', ')}}`;
        }
        return JSON.stringify(value);
    }

    function goAnyArray(values) {
        return `[]any{${(values || []).map((value) => value === null ? 'nil' : String(value)).join(', ')}}`;
    }

    function javaNormalizedResult(expression, wrapper) {
        if (wrapper === '_to_array') return `Z2L.listToArray(${expression})`;
        if (wrapper === '_tree_to_array') return `Z2L.treeToArray(${expression})`;
        if (wrapper === '_validate_balanced_bst') return `Z2L.validateBalancedBst(${expression})`;
        if (wrapper === '_parts_to_strings') return `Z2L.joinRows(${expression}, "|")`;
        if (wrapper === '_boards_to_strings') return `Z2L.joinRows(${expression}, "\\n")`;
        return expression;
    }

    function goNormalizedResult(expression, wrapper) {
        if (wrapper === '_to_array') return `z2lListToSlice(${expression})`;
        if (wrapper === '_tree_to_array') return `z2lTreeToSlice(${expression})`;
        if (wrapper === '_validate_balanced_bst') return `z2lValidateBalancedBST(${expression})`;
        if (wrapper === '_parts_to_strings') return `z2lJoinRows(${expression}, "|")`;
        if (wrapper === '_boards_to_strings') return `z2lJoinRows(${expression}, "\\n")`;
        return expression;
    }

    function buildJavaCase(problem, signature, testCase, index) {
        const id = Number(problem.id);
        if (id === 189) {
            return `Z2L.runCase(${index}, () -> {
            int[] nums = ${javaValue(testCase.input[0], 'List[int]', '', problem)};
            new Solution().rotate(nums, ${testCase.input[1]});
            return nums;
        });`;
        }
        if (id === 114) {
            return `Z2L.runCase(${index}, () -> {
            TreeNode root = Z2L.tree(${javaIntegerArray(testCase.input[0])});
            new Solution().flatten(root);
            return Z2L.flattenedTree(root);
        });`;
        }
        if (id === 160) {
            const [listA, listB, skipA, skipB] = testCase.input[0];
            return `Z2L.runCase(${index}, () -> {
            ListNode[] pair = Z2L.intersection(${javaValue(listA, 'List[int]', '', problem)}, ${javaValue(listB, 'List[int]', '', problem)}, ${skipA}, ${skipB});
            ListNode result = new Solution().getIntersectionNode(pair[0], pair[1]);
            return result == null ? null : result.val;
        });`;
        }
        if (id === 146) return buildJavaLruCase(testCase, index);

        const args = signature.params.map((param, argumentIndex) =>
            javaValue(
                testCase.input[argumentIndex],
                param.pythonType,
                problem.argWrappers?.[argumentIndex] || '',
                problem,
                param.name
            )
        ).join(', ');
        const call = `new Solution().${signature.coreName}(${args})`;
        return `Z2L.runCase(${index}, () -> ${javaNormalizedResult(call, problem.returnWrapper)});`;
    }

    function buildJavaLruCase(testCase, index) {
        const operations = testCase.input[0] || [];
        const argumentsList = testCase.input[1] || [];
        const statements = [];
        operations.forEach((operation, operationIndex) => {
            const args = argumentsList[operationIndex] || [];
            if (operation === 'LRUCache') {
                statements.push(`cache = new LRUCache(${args[0]});`, 'results.add(null);');
            } else if (operation === 'put') {
                statements.push(`cache.put(${args[0]}, ${args[1]});`, 'results.add(null);');
            } else if (operation === 'get') {
                statements.push(`results.add(cache.get(${args[0]}));`);
            }
        });
        return `Z2L.runCase(${index}, () -> {
            LRUCache cache = null;
            java.util.List<Object> results = new java.util.ArrayList<>();
            ${statements.join('\n            ')}
            return results;
        });`;
    }

    function buildGoCase(problem, signature, testCase, index) {
        const id = Number(problem.id);
        if (id === 189) {
            return `z2lRunCase(${index}, func() any {
        nums := ${goValue(testCase.input[0], 'List[int]', '')}
        rotate(nums, ${testCase.input[1]})
        return nums
    })`;
        }
        if (id === 114) {
            return `z2lRunCase(${index}, func() any {
        root := z2lTree(${goAnyArray(testCase.input[0])})
        flatten(root)
        return z2lFlattenedTree(root)
    })`;
        }
        if (id === 160) {
            const [listA, listB, skipA, skipB] = testCase.input[0];
            return `z2lRunCase(${index}, func() any {
        headA, headB := z2lIntersection(${goValue(listA, 'List[int]', '')}, ${goValue(listB, 'List[int]', '')}, ${skipA}, ${skipB})
        result := getIntersectionNode(headA, headB)
        if result == nil { return nil }
        return result.Val
    })`;
        }
        if (id === 146) return buildGoLruCase(testCase, index);

        const args = signature.params.map((param, argumentIndex) =>
            goValue(testCase.input[argumentIndex], param.pythonType, problem.argWrappers?.[argumentIndex] || '')
        ).join(', ');
        const call = `${signature.coreName}(${args})`;
        return `z2lRunCase(${index}, func() any { return ${goNormalizedResult(call, problem.returnWrapper)} })`;
    }

    function buildGoLruCase(testCase, index) {
        const operations = testCase.input[0] || [];
        const argumentsList = testCase.input[1] || [];
        const statements = [];
        operations.forEach((operation, operationIndex) => {
            const args = argumentsList[operationIndex] || [];
            if (operation === 'LRUCache') {
                statements.push(`cache = Constructor(${args[0]})`, 'results = append(results, nil)');
            } else if (operation === 'put') {
                statements.push(`cache.Put(${args[0]}, ${args[1]})`, 'results = append(results, nil)');
            } else if (operation === 'get') {
                statements.push(`results = append(results, cache.Get(${args[0]}))`);
            }
        });
        return `z2lRunCase(${index}, func() any {
        var cache LRUCache
        results := make([]any, 0, ${operations.length})
        ${statements.join('\n        ')}
        return results
    })`;
    }

    const JAVA_HARNESS = `
class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

class Node {
    int val;
    Node next;
    Node random;
    Node(int val) { this.val = val; }
}

final class Z2L {
    interface Case { Object run() throws Exception; }

    static void runCase(int index, Case test) {
        try {
            System.out.println("${RESULT_PREFIX}" + index + "\\t" + stringify(test.run()));
        } catch (Throwable error) {
            System.out.println("${ERROR_PREFIX}" + index + "\\t" + stringify(error.toString()));
        }
    }

    static ListNode list(int[] values) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (int value : values) {
            tail.next = new ListNode(value);
            tail = tail.next;
        }
        return dummy.next;
    }

    static ListNode cycle(int[] values, int position) {
        ListNode head = list(values);
        if (head == null || position < 0) return head;
        ListNode target = null;
        ListNode tail = head;
        int index = 0;
        while (tail.next != null) {
            if (index == position) target = tail;
            tail = tail.next;
            index++;
        }
        if (index == position) target = tail;
        tail.next = target;
        return head;
    }

    static java.util.List<Integer> listToArray(ListNode head) {
        java.util.List<Integer> values = new java.util.ArrayList<>();
        int limit = 10000;
        while (head != null && limit-- > 0) {
            values.add(head.val);
            head = head.next;
        }
        if (head != null) throw new IllegalStateException("linked list contains a cycle");
        return values;
    }

    static TreeNode tree(Integer[] values) {
        if (values.length == 0 || values[0] == null) return null;
        TreeNode root = new TreeNode(values[0]);
        java.util.Queue<TreeNode> queue = new java.util.ArrayDeque<>();
        queue.add(root);
        int index = 1;
        while (!queue.isEmpty() && index < values.length) {
            TreeNode node = queue.remove();
            if (index < values.length && values[index] != null) {
                node.left = new TreeNode(values[index]);
                queue.add(node.left);
            }
            index++;
            if (index < values.length && values[index] != null) {
                node.right = new TreeNode(values[index]);
                queue.add(node.right);
            }
            index++;
        }
        return root;
    }

    static java.util.List<Integer> treeToArray(TreeNode root) {
        java.util.List<Integer> values = new java.util.ArrayList<>();
        if (root == null) return values;
        java.util.Queue<TreeNode> queue = new java.util.LinkedList<>();
        queue.add(root);
        while (!queue.isEmpty()) {
            TreeNode node = queue.remove();
            if (node == null) {
                values.add(null);
                continue;
            }
            values.add(node.val);
            queue.add(node.left);
            queue.add(node.right);
        }
        while (!values.isEmpty() && values.get(values.size() - 1) == null) values.remove(values.size() - 1);
        return values;
    }

    static Object validateBalancedBst(TreeNode root) {
        if (height(root) < 0) return "ERROR: not height-balanced";
        java.util.List<Integer> values = new java.util.ArrayList<>();
        inorder(root, values);
        for (int i = 1; i < values.size(); i++) {
            if (values.get(i) <= values.get(i - 1)) return "ERROR: not a valid BST";
        }
        return values;
    }

    static int height(TreeNode node) {
        if (node == null) return 0;
        int left = height(node.left);
        int right = height(node.right);
        if (left < 0 || right < 0 || Math.abs(left - right) > 1) return -1;
        return Math.max(left, right) + 1;
    }

    static void inorder(TreeNode node, java.util.List<Integer> values) {
        if (node == null) return;
        inorder(node.left, values);
        values.add(node.val);
        inorder(node.right, values);
    }

    static Object flattenedTree(TreeNode root) {
        java.util.List<Integer> values = new java.util.ArrayList<>();
        while (root != null) {
            if (root.left != null) return "ERROR: left child should be null";
            values.add(root.val);
            root = root.right;
        }
        return values;
    }

    static ListNode[] intersection(int[] valuesA, int[] valuesB, int skipA, int skipB) {
        int[] sharedValues = skipA < valuesA.length
            ? java.util.Arrays.copyOfRange(valuesA, skipA, valuesA.length)
            : new int[0];
        ListNode shared = list(sharedValues);
        return new ListNode[]{prepend(valuesA, skipA, shared), prepend(valuesB, skipB, shared)};
    }

    static ListNode prepend(int[] values, int count, ListNode tail) {
        for (int i = Math.min(count, values.length) - 1; i >= 0; i--) {
            ListNode node = new ListNode(values[i]);
            node.next = tail;
            tail = node;
        }
        return tail;
    }

    static java.util.List<String> joinRows(Iterable<? extends Iterable<String>> rows, String separator) {
        java.util.List<String> result = new java.util.ArrayList<>();
        if (rows == null) return null;
        for (Iterable<String> row : rows) {
            StringBuilder text = new StringBuilder();
            for (String item : row) {
                if (text.length() > 0) text.append(separator);
                text.append(item);
            }
            result.add(text.toString());
        }
        java.util.Collections.sort(result);
        return result;
    }

    static String stringify(Object value) {
        if (value == null) return "null";
        if (value instanceof Number || value instanceof Boolean) return value.toString();
        if (value instanceof Character || value instanceof CharSequence) return quote(value.toString());
        if (value.getClass().isArray()) {
            StringBuilder text = new StringBuilder("[");
            int length = java.lang.reflect.Array.getLength(value);
            for (int i = 0; i < length; i++) {
                if (i > 0) text.append(',');
                text.append(stringify(java.lang.reflect.Array.get(value, i)));
            }
            return text.append(']').toString();
        }
        if (value instanceof Iterable) {
            StringBuilder text = new StringBuilder("[");
            boolean first = true;
            for (Object item : (Iterable<?>) value) {
                if (!first) text.append(',');
                first = false;
                text.append(stringify(item));
            }
            return text.append(']').toString();
        }
        return quote(value.toString());
    }

    static String quote(String value) {
        StringBuilder text = new StringBuilder("\\\"");
        for (int i = 0; i < value.length(); i++) {
            char character = value.charAt(i);
            switch (character) {
                case '\\\\': text.append("\\\\\\\\"); break;
                case '"': text.append("\\\\\\\""); break;
                case '\\n': text.append("\\\\n"); break;
                case '\\r': text.append("\\\\r"); break;
                case '\\t': text.append("\\\\t"); break;
                default:
                    if (character < 32) text.append(String.format("\\\\u%04x", (int) character));
                    else text.append(character);
            }
        }
        return text.append('"').toString();
    }
}
`;

    const GO_HARNESS = `package main

import (
    "encoding/json"
    "fmt"
    "sort"
    "strings"
)

type ListNode struct {
    Val int
    Next *ListNode
}

type TreeNode struct {
    Val int
    Left *TreeNode
    Right *TreeNode
}

type Node struct {
    Val int
    Next *Node
    Random *Node
}

func z2lRunCase(index int, test func() any) {
    defer func() {
        if failure := recover(); failure != nil {
            encoded, _ := json.Marshal(fmt.Sprint(failure))
            fmt.Printf("${ERROR_PREFIX}%d\\t%s\\n", index, encoded)
        }
    }()
    encoded, errorValue := json.Marshal(test())
    if errorValue != nil {
        encoded, _ = json.Marshal(errorValue.Error())
        fmt.Printf("${ERROR_PREFIX}%d\\t%s\\n", index, encoded)
        return
    }
    fmt.Printf("${RESULT_PREFIX}%d\\t%s\\n", index, encoded)
}

func z2lList(values []int) *ListNode {
    dummy := &ListNode{}
    tail := dummy
    for _, value := range values {
        tail.Next = &ListNode{Val: value}
        tail = tail.Next
    }
    return dummy.Next
}

func z2lCycle(values []int, position int) *ListNode {
    head := z2lList(values)
    if head == nil || position < 0 { return head }
    var target *ListNode
    tail := head
    index := 0
    for tail.Next != nil {
        if index == position { target = tail }
        tail = tail.Next
        index++
    }
    if index == position { target = tail }
    tail.Next = target
    return head
}

func z2lListToSlice(head *ListNode) []int {
    values := make([]int, 0)
    for limit := 10000; head != nil && limit > 0; limit-- {
        values = append(values, head.Val)
        head = head.Next
    }
    if head != nil { panic("linked list contains a cycle") }
    return values
}

func z2lTree(values []any) *TreeNode {
    if len(values) == 0 || values[0] == nil { return nil }
    root := &TreeNode{Val: values[0].(int)}
    queue := []*TreeNode{root}
    for index := 1; len(queue) > 0 && index < len(values); {
        node := queue[0]
        queue = queue[1:]
        if index < len(values) && values[index] != nil {
            node.Left = &TreeNode{Val: values[index].(int)}
            queue = append(queue, node.Left)
        }
        index++
        if index < len(values) && values[index] != nil {
            node.Right = &TreeNode{Val: values[index].(int)}
            queue = append(queue, node.Right)
        }
        index++
    }
    return root
}

func z2lTreeToSlice(root *TreeNode) []any {
    values := make([]any, 0)
    if root == nil { return values }
    queue := []*TreeNode{root}
    for len(queue) > 0 {
        node := queue[0]
        queue = queue[1:]
        if node == nil {
            values = append(values, nil)
            continue
        }
        values = append(values, node.Val)
        queue = append(queue, node.Left, node.Right)
    }
    for len(values) > 0 && values[len(values)-1] == nil { values = values[:len(values)-1] }
    return values
}

func z2lValidateBalancedBST(root *TreeNode) any {
    var height func(*TreeNode) int
    height = func(node *TreeNode) int {
        if node == nil { return 0 }
        left, right := height(node.Left), height(node.Right)
        if left < 0 || right < 0 || left-right > 1 || right-left > 1 { return -1 }
        if left > right { return left + 1 }
        return right + 1
    }
    if height(root) < 0 { return "ERROR: not height-balanced" }
    values := make([]int, 0)
    var inorder func(*TreeNode)
    inorder = func(node *TreeNode) {
        if node == nil { return }
        inorder(node.Left)
        values = append(values, node.Val)
        inorder(node.Right)
    }
    inorder(root)
    for index := 1; index < len(values); index++ {
        if values[index] <= values[index-1] { return "ERROR: not a valid BST" }
    }
    return values
}

func z2lFlattenedTree(root *TreeNode) any {
    values := make([]int, 0)
    for root != nil {
        if root.Left != nil { return "ERROR: left child should be nil" }
        values = append(values, root.Val)
        root = root.Right
    }
    return values
}

func z2lIntersection(valuesA, valuesB []int, skipA, skipB int) (*ListNode, *ListNode) {
    sharedValues := []int{}
    if skipA < len(valuesA) { sharedValues = valuesA[skipA:] }
    shared := z2lList(sharedValues)
    prepend := func(values []int, count int, tail *ListNode) *ListNode {
        if count > len(values) { count = len(values) }
        for index := count - 1; index >= 0; index-- {
            tail = &ListNode{Val: values[index], Next: tail}
        }
        return tail
    }
    return prepend(valuesA, skipA, shared), prepend(valuesB, skipB, shared)
}

func z2lJoinRows(rows [][]string, separator string) []string {
    if rows == nil { return nil }
    result := make([]string, len(rows))
    for index, row := range rows { result[index] = strings.Join(row, separator) }
    sort.Strings(result)
    return result
}
`;

    function buildJavaSource(problem, userCode) {
        const signature = parseProblemSignature(problem);
        const cases = (problem.testCases || []).map((testCase, index) =>
            buildJavaCase(problem, signature, testCase, index)
        ).join('\n        ');
        return `${userCode}\n${JAVA_HARNESS}\npublic class Main {
    public static void main(String[] args) {
        ${cases}
    }
}\n`;
    }

    function buildGoSource(problem, userCode) {
        const signature = parseProblemSignature(problem);
        const cases = (problem.testCases || []).map((testCase, index) =>
            buildGoCase(problem, signature, testCase, index)
        ).join('\n    ');
        return `-- solution.go --
package main

${userCode}
-- z2l_harness.go --
${GO_HARNESS}
func main() {
    ${cases}
}
`;
    }

    function parseRunnerOutput(stdout, total) {
        const results = new Array(total);
        String(stdout || '').split(/\r?\n/).forEach((line) => {
            let prefix = null;
            if (line.startsWith(RESULT_PREFIX)) prefix = RESULT_PREFIX;
            if (line.startsWith(ERROR_PREFIX)) prefix = ERROR_PREFIX;
            if (!prefix) return;
            const separator = line.indexOf('\t', prefix.length);
            if (separator < 0) return;
            const index = Number(line.slice(prefix.length, separator));
            if (!Number.isInteger(index) || index < 0 || index >= total) return;
            const payload = line.slice(separator + 1);
            try {
                const value = JSON.parse(payload);
                results[index] = prefix === ERROR_PREFIX ? { error: String(value) } : { actual: value };
            } catch (error) {
                results[index] = { error: `无法解析运行结果：${error.message}` };
            }
        });
        return Array.from(
            { length: total },
            (_, index) => results[index] || { error: '运行器未返回该测试用例的结果。' }
        );
    }

    function failedSuite(problem, error) {
        return (problem.testCases || []).map(() => ({ error: String(error || '运行失败。') }));
    }

    async function executeGo(problem, userCode) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), EXECUTION_TIMEOUT_MS);
        try {
            const body = new URLSearchParams({
                version: '2',
                withVet: 'true',
                body: buildGoSource(problem, userCode),
            });
            const response = await fetch(GO_PLAYGROUND_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body,
                signal: controller.signal,
            });
            if (!response.ok) return failedSuite(problem, `Go 在线编译服务请求失败（HTTP ${response.status}）`);
            const data = await response.json();
            if (data.Errors) return failedSuite(problem, String(data.Errors).trimEnd());

            let stdout = '';
            let stderr = '';
            for (const event of Array.isArray(data.Events) ? data.Events : []) {
                if (event.Kind === 'stderr') stderr += event.Message || '';
                else stdout += event.Message || '';
            }
            if (stderr || (typeof data.Status === 'number' && data.Status !== 0)) {
                return failedSuite(problem, stderr || `Go 程序异常退出（状态码 ${data.Status}）`);
            }
            return parseRunnerOutput(stdout, problem.testCases.length);
        } catch (error) {
            return failedSuite(problem, error?.name === 'AbortError'
                ? 'Go 编译或运行超过 10 秒。'
                : '无法连接 Go 在线编译服务，请检查网络后重试。');
        } finally {
            clearTimeout(timeoutId);
        }
    }

    let javaWorker = null;
    let javaState = 'idle';
    let javaInitPromise = null;
    let javaInitResolve = null;
    let javaInitReject = null;
    let javaInitTimeoutId = null;
    let javaPending = null;
    let javaRequestId = 0;
    let javaStatusListener = null;

    function notifyJavaStatus(message, state) {
        if (typeof javaStatusListener === 'function') javaStatusListener(message, state);
    }

    function stopJavaWorker() {
        if (javaWorker) javaWorker.terminate();
        if (javaInitTimeoutId !== null) clearTimeout(javaInitTimeoutId);
        javaWorker = null;
        javaState = 'idle';
        javaInitPromise = null;
        javaInitResolve = null;
        javaInitReject = null;
        javaInitTimeoutId = null;
    }

    function failJavaWorker(message) {
        const reject = javaInitReject;
        const pending = javaPending;
        javaPending = null;
        if (pending) clearTimeout(pending.timeoutId);
        stopJavaWorker();
        javaState = 'error';
        notifyJavaStatus(message, 'error');
        if (reject) reject(new Error(message));
        if (pending) pending.resolve({ error: message, phase: 'service' });
    }

    function handleJavaMessage(event, sourceWorker) {
        if (sourceWorker !== javaWorker) return;
        const message = event.data || {};
        if (message.type === 'status') {
            notifyJavaStatus(String(message.message || 'Java 17 加载中...'), 'loading');
            return;
        }
        if (message.type === 'ready') {
            const resolve = javaInitResolve;
            if (javaInitTimeoutId !== null) clearTimeout(javaInitTimeoutId);
            javaInitTimeoutId = null;
            javaInitPromise = null;
            javaInitResolve = null;
            javaInitReject = null;
            javaState = 'ready';
            notifyJavaStatus('Java 17 就绪', 'ready');
            if (resolve) resolve(true);
            return;
        }
        if (message.type === 'init-error') {
            failJavaWorker(String(message.message || 'Java 17 初始化失败。'));
            return;
        }

        const pending = javaPending;
        if (!pending || pending.id !== message.id) return;
        clearTimeout(pending.timeoutId);
        javaPending = null;
        if (message.type === 'result') {
            pending.resolve(message.result || { error: 'Java 运行时返回了无效结果。', phase: 'service' });
            if (message.result?.restartRuntime) stopJavaWorker();
            return;
        }
        pending.resolve({ error: String(message.message || 'Java 编译器执行失败。'), phase: 'service' });
    }

    function prepareJava(statusListener = null) {
        if (statusListener) javaStatusListener = statusListener;
        if (javaState === 'ready' && javaWorker) {
            notifyJavaStatus('Java 17 就绪', 'ready');
            return Promise.resolve(true);
        }
        if (javaInitPromise) return javaInitPromise;
        if (typeof Worker !== 'function') return Promise.reject(new Error('当前浏览器不支持 Web Worker。'));

        javaState = 'loading';
        notifyJavaStatus('正在启动 Java 17...', 'loading');
        javaInitPromise = new Promise((resolve, reject) => {
            javaInitResolve = resolve;
            javaInitReject = reject;
            try {
                const worker = new Worker(JAVA_WORKER_URL);
                javaWorker = worker;
                worker.onmessage = (event) => handleJavaMessage(event, worker);
                worker.onerror = (event) => {
                    if (event?.preventDefault) event.preventDefault();
                    failJavaWorker(event?.message || 'Java Worker 加载失败。');
                };
            } catch (error) {
                setTimeout(() => failJavaWorker(error?.message || String(error)), 0);
                return;
            }
            javaInitTimeoutId = setTimeout(() => {
                if (javaState === 'loading') failJavaWorker('Java 17 首次加载超时，请检查网络后重试。');
            }, JAVA_INIT_TIMEOUT_MS);
        });
        return javaInitPromise;
    }

    async function executeJava(problem, userCode, statusListener = null) {
        const source = buildJavaSource(problem, userCode);
        if (new TextEncoder().encode(source).byteLength > JAVA_MAX_SOURCE_BYTES) {
            return failedSuite(problem, 'Java 源码与测试驱动超过 48 KB 限制。');
        }
        try {
            await prepareJava(statusListener);
        } catch (error) {
            return failedSuite(problem, `Java 17 浏览器运行时加载失败：${error?.message || error}`);
        }

        const requestId = ++javaRequestId;
        const execution = await new Promise((resolve) => {
            const timeoutId = setTimeout(() => {
                if (!javaPending || javaPending.id !== requestId) return;
                javaPending = null;
                stopJavaWorker();
                resolve({ error: 'Java 编译或运行超过 10 秒，运行时已终止。', phase: 'timeout' });
            }, EXECUTION_TIMEOUT_MS);
            javaPending = { id: requestId, resolve, timeoutId };
            try {
                javaWorker.postMessage({ type: 'execute', id: requestId, code: source, stdin: '' });
            } catch (error) {
                clearTimeout(timeoutId);
                javaPending = null;
                resolve({ error: '无法向 Java 浏览器 Worker 发送代码。', phase: 'service' });
            }
        });
        if (execution.error) return failedSuite(problem, execution.error);
        return parseRunnerOutput(execution.stdout, problem.testCases.length);
    }

    async function runCompiledTests(language, problem, userCode, statusListener = null) {
        if (language === 'java') return executeJava(problem, userCode, statusListener);
        if (language === 'go') return executeGo(problem, userCode);
        throw new Error(`Unsupported compiled language: ${language}`);
    }

    global.LEETCODE_LANGUAGE_SUPPORT = Object.freeze({
        languages: LANGUAGES,
        normalizeLanguage,
        parseProblemSignature,
        getTemplate,
        buildJavaSource,
        buildGoSource,
        parseRunnerOutput,
        prepareJava,
        runCompiledTests,
        toCamelCase,
    });
})(window);
