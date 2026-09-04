const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
    return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const coursePages = [
    '05_interview/fundamentals/cs-core/index.md',
    '05_interview/fundamentals/cs-core/computer-organization/index.md',
    '05_interview/fundamentals/cs-core/computer-organization/01-data-and-instructions/index.md',
    '05_interview/fundamentals/cs-core/computer-organization/02-cpu-pipeline-performance/index.md',
    '05_interview/fundamentals/cs-core/computer-organization/03-memory-cache/index.md',
    '05_interview/fundamentals/cs-core/computer-organization/04-io-multicore/index.md',
    '05_interview/fundamentals/cs-core/operating-system/index.md',
    '05_interview/fundamentals/cs-core/operating-system/01-kernel-process-thread/index.md',
    '05_interview/fundamentals/cs-core/operating-system/02-scheduling-concurrency/index.md',
    '05_interview/fundamentals/cs-core/operating-system/03-virtual-memory/index.md',
    '05_interview/fundamentals/cs-core/operating-system/04-filesystem-io/index.md',
    '05_interview/fundamentals/cs-core/operating-system/05-linux-observability/index.md',
    '05_interview/fundamentals/cs-core/computer-network/index.md',
    '05_interview/fundamentals/cs-core/computer-network/01-layers-link/index.md',
    '05_interview/fundamentals/cs-core/computer-network/02-ip-routing/index.md',
    '05_interview/fundamentals/cs-core/computer-network/03-transport-tcp/index.md',
    '05_interview/fundamentals/cs-core/computer-network/04-dns-http/index.md',
    '05_interview/fundamentals/cs-core/computer-network/05-tls-debugging/index.md',
];

test('computer science core course pages have publishable front matter', () => {
    for (const page of coursePages) {
        const source = read(page);
        assert.match(source, /^---\n[\s\S]*?layout: default\n[\s\S]*?permalink: \/05_interview\/fundamentals\/cs-core\//);
        assert.match(source, /^# /m, `${page} should have an H1`);
        assert.ok(source.split('\n').length >= 60, `${page} should be a substantive lesson`);
    }
});

test('the three courses cover mechanism, misconceptions, interviews, and exercises', () => {
    for (const page of coursePages.filter((page) => /\/0\d-/.test(page))) {
        const source = read(page);
        assert.match(source, /## 常见误区/);
        assert.match(source, /## 面试表达/);
        assert.match(source, /## (?:理解检查|实战练习|综合练习)/);
    }

    const organization = coursePages.filter((page) => page.includes('/computer-organization/')).map(read).join('\n');
    assert.match(organization, /补码/);
    assert.match(organization, /流水线/);
    assert.match(organization, /Cache line/);
    assert.match(organization, /DMA/);
    assert.match(organization, /false sharing/i);

    const operatingSystem = coursePages.filter((page) => page.includes('/operating-system/')).map(read).join('\n');
    assert.match(operatingSystem, /系统调用/);
    assert.match(operatingSystem, /条件变量/);
    assert.match(operatingSystem, /TLB miss 不等于 Page Fault/);
    assert.match(operatingSystem, /epoll/);
    assert.match(operatingSystem, /strace/);

    const network = coursePages.filter((page) => page.includes('/computer-network/')).map(read).join('\n');
    assert.match(network, /ARP/);
    assert.match(network, /最长前缀匹配/);
    assert.match(network, /流量控制和拥塞控制/);
    assert.match(network, /HTTP\/3/);
    assert.match(network, /TLS 1\.3/);
});

test('course navigation precedes interview question banks', () => {
    const nav = read('_data/nav.yml');
    const coursePosition = nav.indexOf('name: "计算机基础系统课"');
    const companyPosition = nav.indexOf('name: "公司与岗位八股"');
    const questionPosition = nav.indexOf('name: "通用题库与面经"');

    assert.ok(coursePosition >= 0);
    assert.ok(companyPosition > coursePosition);
    assert.ok(questionPosition > companyPosition);
    for (const slug of [
        'fundamentals/cs-core/computer-organization/04-io-multicore',
        'fundamentals/cs-core/operating-system/05-linux-observability',
        'fundamentals/cs-core/computer-network/05-tls-debugging',
        'fundamentals/computer-organization',
        'fundamentals/operating-system',
        'fundamentals/computer-network',
    ]) {
        assert.match(nav, new RegExp(slug.replaceAll('/', '\\/')));
    }
});

test('existing question banks point learners back to the systematic courses', () => {
    const organization = read('05_interview/fundamentals/computer-organization.md');
    const operatingSystem = read('05_interview/fundamentals/operating-system.md');
    const network = read('05_interview/fundamentals/computer-network.md');
    const interviewIndex = read('05_interview/index.md');

    assert.match(organization, /计算机组成原理系统课/);
    assert.match(operatingSystem, /操作系统系统课/);
    assert.match(network, /计算机网络系统课/);
    assert.match(interviewIndex, /## 计算机基础系统课/);
    assert.match(interviewIndex, /组成原理 → 操作系统 → 计算机网络/);
});

test('group navigation uses exact article URLs for current-state highlighting', () => {
    const layout = read('_layouts/default.html');
    assert.match(layout, /page\.url == candidate_pretty_url or page\.url == candidate_index_url/);
    assert.match(layout, /page\.url == article_pretty_url or page\.url == article_index_url/);
    assert.doesNotMatch(layout, /page\.url contains article\.slug/);
});

test('system course Mermaid diagrams have a renderer and theme-aware styling', () => {
    const layout = read('_layouts/default.html');
    const docsJs = read('assets/js/docs.js');
    const docsCss = read('assets/css/docs.css');
    const courseSource = coursePages.map(read).join('\n');

    assert.match(layout, /mermaid@9\.4\.3/);
    assert.match(layout, /\.language-mermaid/);
    assert.match(layout, /code\.language-mermaid/);
    assert.match(layout, /closest\('pre'\)/);
    assert.match(layout, /mermaid\.init/);
    assert.match(docsJs, /rerenderMermaid/);
    assert.match(docsCss, /\.mermaid\s*\{/);
    assert.match(courseSource, /```mermaid/);

    for (const page of coursePages) {
        assert.match(read(page), /```mermaid/, `${page} should include a diagram`);
    }
});

test('every numbered system lesson starts with one maintainable mind map', () => {
    const lessons = coursePages.filter((page) => /\/0\d-/.test(page));

    for (const page of lessons) {
        const source = read(page);
        const firstH2 = source.indexOf('\n## ');
        const mapStart = source.indexOf('```mermaid\nmindmap\n');
        const mapCount = (source.match(/```mermaid\nmindmap\n/g) || []).length;

        assert.ok(mapStart > 0 && mapStart > firstH2, `${page} should start with a mind map section`);
        assert.equal(mapCount, 1, `${page} should contain exactly one lesson mind map`);
    }

    assert.match(read('_layouts/default.html'), /mermaid-mindmap/);
    assert.match(read('assets/css/docs.css'), /\.mermaid-mindmap/);
});
