const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const article = read('05_interview/coding/huawei.md');
const top20 = [[200,36],[3,34],[null,27],[20,25],[146,20],[56,18],[42,15],[15,14],[215,13],[102,13],[70,13],[394,12],[1,11],[739,11],[206,11],[11,10],[179,10],[53,10],[21,10],[46,10]];

// Load only the actual problem/runtime script tags, in page order. A batch on disk
// that the page forgot to load must not make a registration regression pass.
function loadPage(id = 451) {
  const select = { innerHTML: '', value: '', appendChild(option) { this.innerHTML += option.textContent; } };
  const context = {
    URLSearchParams, console,
    document: {
      readyState: 'loading', addEventListener() {},
      getElementById: key => key === 'problem-select' ? select : null,
      createElement: () => ({ innerHTML: '', textContent: '' }),
    },
    localStorage: { getItem: () => null },
    window: { addEventListener() {}, location: { search: `?id=${id}` } },
  };
  vm.createContext(context);
  const scripts = [...read('playground.html').matchAll(/<script\s+src="(assets\/js\/(?:problems-data|playground(?:-languages|-extra\/batch-\d+)?)\.js)(?:\?[^\"]*)?"/g)];
  for (const [, file] of scripts) vm.runInContext(read(file), context, { filename: file });
  vm.runInContext('syncProblemRegistry()', context);
  return { context, select, problems: context.window.PROBLEMS };
}

test('historical 38 problem frequencies and source totals remain intact', () => {
  const historical = article.split('## 高频手撕题 Top 38（分类详解）')[1].split('### Hot100')[0];
  const frequencies = [...historical.matchAll(/^\| \d+ \| \[LC (\d+)\.[^\n]*?\| \*{0,2}(\d+)次/gm)].map(m => [Number(m[1]), Number(m[2])]);
  assert.deepEqual(frequencies, [[3,32],[42,11],[15,11],[11,9],[209,8],[239,5],[200,31],[207,6],[695,5],[20,22],[394,15],[739,7],[155,6],[146,17],[206,14],[19,9],[21,7],[142,7],[2,6],[23,5],[92,3],[102,10],[124,5],[56,14],[215,10],[704,5],[300,9],[53,7],[70,7],[64,6],[72,5],[46,10],[93,8],[1,11],[451,8],[55,8],[406,5],[54,5]]);
  for (const text of ['6139', '4867', '1272', '629', '646']) assert.ok(historical.includes(text), text);
  assert.match(article, /\| 手写快速排序 \| 5 \|/);
});

test('attachment TOP20 preserves its independent source, exact ranking and usable entries', () => {
  const section = article.split('<a id="attachment-top20"></a>')[1]?.split('<a id="handwritten-quicksort"></a>')[0];
  assert.ok(section, 'Missing independent attachment TOP20 section');
  for (const text of ['华为手撕题TOP20.xlsx', '1148', '89', '639', '323', 'OD', '机考', '笔试', '不相加', '646']) assert.ok(section.includes(text), text);
  const rows = [...section.matchAll(/^\| (\d+) \| (LC \d+|—) \| ([^|]+) \| (\d+)次 \| ([^\n]+)\|$/gm)];
  assert.equal(rows.length, 20);
  assert.equal(rows.reduce((sum, row) => sum + Number(row[4]), 0), 323);
  const { problems } = loadPage();
  rows.forEach((row, i) => {
    assert.equal(Number(row[1]), i + 1);
    assert.equal(row[2], top20[i][0] === null ? '—' : `LC ${top20[i][0]}`);
    assert.equal(Number(row[4]), top20[i][1]);
    assert.ok(row[5].includes(top20[i][0] === null ? '#handwritten-quicksort' : `playground.html?id=${top20[i][0]}`));
    if (top20[i][0] !== null) {
      const problem = problems.find(p => p.id === top20[i][0]);
      assert.ok(problem && !problem.isFallback && problem.testCases.length, `TOP20 real practice: ${row[2]}`);
    }
  });
  assert.match(section, /快速选择.*堆/);
  assert.ok(article.includes('<a id="lc179-largest-number"></a>'));
});

for (const id of [451, 406, 179]) {
  test(`LC ${id} resolves direct URL, dropdown, metadata and typed templates through actual page scripts`, () => {
    const { context, select, problems } = loadPage(id);
    const problem = problems.find(p => p.id === id);
    assert.ok(problem && !problem.isFallback, `Missing real LC ${id} registration`);
    assert.equal(problems.filter(p => p.id === id).length, 1);
    assert.equal(vm.runInContext('currentProblem.id', context), id);
    assert.equal(problems[Number(select.value)].id, id);
    assert.ok(select.innerHTML.includes(`LC ${id}`));
    assert.ok(context.window.PROBLEMS_DATA.some(p => p.id === id));
    assert.ok(problem.testCases.length >= 5);
    assert.match(problem.description, /示例/);
    assert.match(problem.description, /提示|约束/);
    const support = context.window.LEETCODE_LANGUAGE_SUPPORT;
    assert.ok(support.parseProblemSignature(problem));
    const signatures = {
      451: [/String frequencySort\(String s\)/, /func frequencySort\(s string\) string/],
      406: [/int\[\]\[\] reconstructQueue\(int\[\]\[\] people\)/, /func reconstructQueue\(people \[\]\[\]int\) \[\]\[\]int/],
      179: [/String largestNumber\(int\[\] nums\)/, /func largestNumber\(nums \[\]int\) string/],
    };
    assert.match(support.getTemplate(problem, 'java'), signatures[id][0]);
    assert.match(support.getTemplate(problem, 'go'), signatures[id][1]);
    assert.ok(read('index.html').includes('assets/js/problems-data.js?v=20261020'));
    assert.match(problem.blogUrl, new RegExp(`/05_interview/coding/huawei/#lc${id}-`));
    assert.ok(article.includes(`id="${problem.blogUrl.split('#')[1]}"`));
    for (const file of ['assets/js/playground.js', 'assets/js/problems-data.js', 'assets/js/playground-extra/batch-9.js']) {
      assert.ok(read('playground.html').includes(`${file}?v=20261020`), `Cache version: ${file}`);
    }
  });
}

test('LC451 accepts tie orders and rejects lost characters, split groups and ascending frequencies', () => {
  const { context } = loadPage();
  const check = (actual, s) => context.compareResults(actual, 'ignored example', 'frequency_sort', [s]);
  for (const [actual, s] of [['eert','tree'],['eetr','tree'],['cccaaa','cccaaa'],['aaaccc','cccaaa'],['bbAa','Aabb'],['bbaA','Aabb'],['1111bbA','A1b1b11']]) assert.equal(check(actual,s), true, actual);
  for (const [actual, s] of [['tree','tree'],['tr','tree'],['eeee','tree'],['cacaca','cccaaa'],['Aabb','Aabb'],['bbbbaa','cccaaa'],[null,'tree'],[['eert'],'tree']]) assert.equal(check(actual,s), false, JSON.stringify(actual));
  const p = context.window.PROBLEMS.find(p => p.id === 451);
  assert.ok(p);
  assert.equal(context.renderTestResult(p, { input: ['tree'], expected: 'eert' }, 1, 'eetr').passed, true);
});

test('LC406 validates original multiset and every queue constraint, without sorting away order', () => {
  const { context } = loadPage(406);
  const people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]];
  const valid = [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]];
  const check = actual => context.compareResults(actual, [], 'reconstruct_queue', [people]);
  assert.equal(check(valid), true);
  for (const invalid of [people, valid.slice().reverse(), valid.slice(1), valid.map(() => [9,0]), [[5,0,0],...valid.slice(1)], [[5,'0'],...valid.slice(1)], [null,...valid.slice(1)], null]) assert.equal(check(invalid), false, JSON.stringify(invalid));
  // A different but internally valid queue must still retain the input people.
  assert.equal(context.compareResults([[1,0],[2,0]], [], 'reconstruct_queue', [[[3,0],[4,0]]]), false);
  assert.equal(context.compareResults([[0,0]], [], 'reconstruct_queue', [[[0,0]]]), true);
  const p = context.window.PROBLEMS.find(p => p.id === 406);
  assert.ok(p);
  assert.equal(context.renderTestResult(p, { input: [people], expected: [] }, 1, valid).passed, true);
});

function python(source) {
  const result = spawnSync('python3', ['-c', source], { encoding: 'utf8', timeout: 15000 });
  assert.equal(result.status, 0, result.stderr || String(result.error));
  return result.stdout;
}

test('all six added article reference implementations execute against cases and independent oracles', () => {
  const section = article.split('<a id="attachment-top20"></a>')[1]?.split('## 华为特色：追问文化')[0] || '';
  const blocks = [...section.matchAll(/```python\n([\s\S]*?)```/g)].map(m => m[1]);
  assert.equal(blocks.length, 6, 'quicksort, two kth-largest methods, LC179, LC451, LC406');
  const { problems } = loadPage();
  const cases = Object.fromEntries([179,451,406].map(id => [id, problems.find(p => p.id === id)?.testCases]));
  const output = python(blocks.join('\n') + `
import collections, itertools, json, random
rng = random.Random(451406)
cases = json.loads(${JSON.stringify(JSON.stringify(cases))})
for ident, fn in [('179', largest_number), ('451', frequency_sort), ('406', reconstruct_queue)]:
    for case in cases[ident]:
        actual = fn(*case['input'])
        if ident == '179':
            assert actual == case['expected'], case
        elif ident == '451':
            assert collections.Counter(actual) == collections.Counter(case['input'][0])
            groups = [(c, len(list(g))) for c, g in itertools.groupby(actual)]
            assert len(groups) == len(set(actual))
            assert [n for _, n in groups] == sorted([n for _, n in groups], reverse=True)
        else:
            assert sorted(actual) == sorted(case['input'][0])
            assert all(sum(hh >= h for hh, _ in actual[:i]) == k for i,(h,k) in enumerate(actual))
for n in range(1, 60):
    nums = [rng.randrange(-8, 9) for _ in range(n)]
    for data in [nums, sorted(nums), sorted(nums, reverse=True), [0]*n]:
        copied = data[:]
        quick_sort(copied)
        assert copied == sorted(data)
        for k in {1, n, (n+1)//2}:
            assert find_kth_largest_quickselect(data[:], k) == sorted(data)[-k]
            assert find_kth_largest_heap(data[:], k) == sorted(data)[-k]
quick_sort([])
large = list(range(5000))
quick_sort(large)
assert large == list(range(5000))
for _ in range(80):
    nums = [rng.randrange(1000) for _ in range(rng.randrange(1, 7))]
    oracle = max(''.join(map(str, p)) for p in itertools.permutations(nums)).lstrip('0') or '0'
    assert largest_number(nums) == oracle
print(json.dumps({ident: [globals()[name](*case['input']) for case in cases[ident]] for ident,name in [('179','largest_number'),('451','frequency_sort'),('406','reconstruct_queue')]}))
`);
  const results = JSON.parse(output);
  const { context } = loadPage();
  for (const id of [179,451,406]) {
    const p = problems.find(p => p.id === id);
    results[id].forEach((actual,i) => assert.equal(context.compareResults(actual, p.testCases[i].expected, p.compareFunc, p.testCases[i].input), true));
  }
});

test('new Go core templates compile and reference solutions pass the same semantic judge', () => {
  const { context, problems } = loadPage();
  const support = context.window.LEETCODE_LANGUAGE_SUPPORT;
  const solutions = {
    179: `import ("sort"; "strconv"; "strings")
    func largestNumber(nums []int) string {
      a := make([]string, len(nums)); for i,n := range nums { a[i] = strconv.Itoa(n) }
      sort.Slice(a, func(i,j int) bool { return a[i]+a[j] > a[j]+a[i] })
      if a[0] == "0" { return "0" }; return strings.Join(a, "")
    }`,
    451: `import ("sort"; "strings")
    func frequencySort(s string) string {
      counts := map[rune]int{}; for _,c := range s { counts[c]++ }
      chars := []rune{}; for c := range counts { chars = append(chars,c) }
      sort.Slice(chars, func(i,j int) bool { return counts[chars[i]] > counts[chars[j]] })
      var result strings.Builder; for _,c := range chars { result.WriteString(strings.Repeat(string(c), counts[c])) }; return result.String()
    }`,
    406: `import "sort"
    func reconstructQueue(people [][]int) [][]int {
      sort.Slice(people, func(i,j int) bool { if people[i][0] == people[j][0] { return people[i][1] < people[j][1] }; return people[i][0] > people[j][0] })
      q := [][]int{}; for _,p := range people { k := p[1]; q = append(q,nil); copy(q[k+1:],q[k:]); q[k] = p }; return q
    }`,
  };
  for (const id of [179,451,406]) {
    const p = problems.find(p => p.id === id);
    assert.ok(p, `LC ${id}`);
    for (const code of [support.getTemplate(p, 'go'), solutions[id]]) {
      const source = support.buildGoSource(p, code);
      const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'huawei-go-'));
      try {
        const markers = [...source.matchAll(/^-- ([^\n]+) --\n/gm)];
        markers.forEach((m,i) => fs.writeFileSync(path.join(directory,m[1]), source.slice(m.index+m[0].length,markers[i+1]?.index ?? source.length)));
        const result = spawnSync('go',['run','solution.go','z2l_harness.go'],{cwd:directory,encoding:'utf8',timeout:30000});
        assert.equal(result.status,0,result.stderr || String(result.error));
        if (code === solutions[id]) support.parseRunnerOutput(result.stdout,p.testCases.length).forEach((r,i) => {
          assert.equal(r.error,undefined);
          assert.equal(context.compareResults(r.actual,p.testCases[i].expected,p.compareFunc,p.testCases[i].input),true);
        });
      } finally { fs.rmSync(directory,{recursive:true,force:true}); }
    }
  }
});
