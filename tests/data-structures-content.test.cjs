const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const pages = {
    index: '01_data_structures/index.md',
    array: '01_data_structures/01-array-string/index.md',
    linked: '01_data_structures/02-linked-list/index.md',
    stack: '01_data_structures/03-stack-queue/index.md',
    hash: '01_data_structures/04-hash-table/index.md',
    tree: '01_data_structures/05-binary-tree/index.md',
    heap: '01_data_structures/06-heap/index.md',
    graph: '01_data_structures/07-graph/index.md',
    trie: '01_data_structures/08-trie/index.md',
    unionFind: '01_data_structures/09-union-find/index.md',
    advanced: '01_data_structures/10-advanced-structures/index.md',
    acm: '01_data_structures/11-acm-construction/index.md',
};

function read(page) {
    return fs.readFileSync(path.join(root, pages[page]), 'utf8');
}

test('data structure lessons define an interface contract', () => {
    for (const [name, page] of Object.entries(pages)) {
        if (name === 'index') continue;
        assert.match(read(name), /## 接口契约/, `${page} should define a contract`);
    }
});

test('every data structure lesson starts with one maintainable mind map', () => {
    for (const [name, page] of Object.entries(pages)) {
        if (name === 'index') continue;
        const source = read(name);
        const maps = source.match(/```mermaid\s*\nmindmap/g) || [];
        assert.equal(maps.length, 1, `${page} should contain exactly one mind map`);
        const h1 = source.indexOf('\n# ');
        const map = source.indexOf('```mermaid');
        assert.ok(h1 >= 0 && map > h1 && map < h1 + 500, `${page} map should follow the title`);
    }
});

test('data structure lessons keep at least four times the original depth', () => {
    const originalLines = {
        index: 63,
        array: 229,
        linked: 299,
        stack: 249,
        hash: 240,
        tree: 337,
        heap: 249,
        graph: 224,
        trie: 189,
        unionFind: 197,
        advanced: 238,
        acm: 424,
    };

    for (const [name, baseline] of Object.entries(originalLines)) {
        const lineCount = read(name).split(/\r?\n/).length - 1;
        assert.ok(
            lineCount >= baseline * 4,
            `${pages[name]} has ${lineCount} lines; expected at least ${baseline * 4}`,
        );
    }
});

test('data structure lessons include implementation-level coverage', () => {
    const required = {
        array: /DynamicArray[\s\S]*_grow/,
        linked: /SinglyLinkedList[\s\S]*DoublyLinkedList/,
        stack: /CircularQueue[\s\S]*max_sliding_window/,
        hash: /ChainedHashMap[\s\S]*ProbingHashMap/,
        tree: /delete_bst[\s\S]*AVL/,
        heap: /class MinHeap[\s\S]*heap_sort/,
        graph: /AdjacencyListGraph[\s\S]*dijkstra/,
        trie: /class Trie[\s\S]*def delete/,
        unionFind: /RollbackUnionFind[\s\S]*WeightedUnionFind/,
        advanced: /SparseTableMin[\s\S]*LazySegmentTree/,
        acm: /TokenReader[\s\S]*serialize/,
    };

    for (const [name, pattern] of Object.entries(required)) {
        assert.match(read(name), pattern, `${pages[name]} lacks implementation coverage`);
    }
});

test('edge contracts are documented for the high-risk structures', () => {
    assert.match(read('tree'), /重复值.*忽略/);
    assert.match(read('advanced'), /cannot query an empty segment tree/);
    assert.match(read('advanced'), /Fenwick index out of range/);
    assert.match(read('hash'), /墓碑/);
    assert.match(read('trie'), /delete\(word\)/);
    assert.match(read('acm'), /unexpected end of input/);
    assert.doesNotMatch(read('acm'), /assert len\(nums\) == n/);
});

test('data structure markdown code fences are balanced', () => {
    for (const [name, page] of Object.entries(pages)) {
        const source = read(name);
        const fences = (source.match(/^```/gm) || []).length;
        assert.equal(fences % 2, 0, `${page} has unbalanced code fences`);
    }
});
