const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const assistantPath = path.join(root, 'assets/js/ai-assistant.js');
const assistantSource = fs.readFileSync(assistantPath, 'utf8');
const {
    AIAssistant,
    AI_BUILTIN_KEY,
    AI_DEFAULT_MODEL,
    QUICK_ACTIONS,
    SYSTEM_PROMPT,
    boundedHistory,
    buildContextMessage,
    collectAssistantContext,
    copyTextToClipboard,
    decorateAssistantCodeBlocks,
    getQuickActionPrompt,
    loadAIConfig,
    normalizeConfiguredModel,
    normalizeGeneratedCodeLanguage,
    resolveExpectedResponseLanguage,
    resolveAIRequestKey,
    saveAIConfig,
    streamResponses,
    validateAssistantResponse,
} = require(assistantPath);

function withBrowserGlobals(values, callback) {
    const previous = {};
    for (const [key, value] of Object.entries(values)) {
        previous[key] = globalThis[key];
        globalThis[key] = value;
    }
    const restore = () => {
        for (const key of Object.keys(values)) {
            if (previous[key] === undefined) delete globalThis[key];
            else globalThis[key] = previous[key];
        }
    };
    try {
        const result = callback();
        if (result && typeof result.then === 'function') return result.finally(restore);
        restore();
        return result;
    } catch (error) {
        restore();
        throw error;
    }
}

test('ACM AI DOM and local assets are wired', () => {
    const html = fs.readFileSync(path.join(root, 'acm-playground.html'), 'utf8');
    const requiredIds = [
        'ai-fab', 'ai-panel', 'ai-context-summary', 'ai-messages', 'ai-quick-actions',
        'ai-input', 'ai-send-btn', 'ai-config-modal',
    ];

    assert.match(html, /<body\s+data-ai-surface="acm">/);
    for (const id of requiredIds) assert.match(html, new RegExp(`id="${id}"`));
    assert.match(html, /data-action="convert-java"/);
    assert.match(html, /data-action="convert-go"/);
    assert.match(html, /assets\/images\/ai-assistant-logo\.svg/);
    assert.doesNotMatch(html, /<rect x="4" y="7" width="16" height="11" rx="4"/);
    assert.match(html, /marked@15\.0\.12\/marked\.min\.js/);
    assert.match(html, /integrity="sha384-[^"]+"/);
    assert.ok(
        html.indexOf('marked.min.js') < html.indexOf('assets/js/ai-assistant.js'),
        'Marked must be declared before the assistant'
    );
    assert.ok(
        html.indexOf('assets/js/acm-playground.js') < html.indexOf('assets/js/ai-assistant.js'),
        'The ACM editor must initialize before the assistant reads it'
    );

    const localAssets = Array.from(html.matchAll(/(?:href|src)="(assets\/[^"?#]+)(?:[?#][^"]*)?"/g))
        .map((match) => match[1]);
    for (const asset of localAssets) {
        assert.equal(fs.existsSync(path.join(root, asset)), true, `Missing local asset: ${asset}`);
    }
});

test('LeetCode quick actions include a language-aware code generation button', () => {
    const html = fs.readFileSync(path.join(root, 'playground.html'), 'utf8');

    assert.match(html, /assets\/images\/ai-assistant-logo\.svg/);
    assert.doesNotMatch(html, /<rect x="4" y="7" width="16" height="11" rx="4"/);

    assert.match(html, /data-action="give-code"[^>]*>💻 给我代码<\/button>/);
    assert.equal(QUICK_ACTIONS['give-code'].label, '给我代码');
    assert.match(QUICK_ACTIONS['give-code'].prompt, /\{sourceLanguage\}/);
    assert.match(QUICK_ACTIONS['give-code'].prompt, /\{sourceFence\}/);
    assert.match(QUICK_ACTIONS['give-code'].prompt, /原始代码模板/);
    assert.match(QUICK_ACTIONS['give-code'].prompt, /完整/);
});

test('AI assistant logo is a transparent scalable SVG used by dynamic messages', () => {
    const logo = fs.readFileSync(path.join(root, 'assets/images/ai-assistant-logo.svg'), 'utf8');

    assert.match(logo, /viewBox="0 0 64 64"/);
    assert.match(logo, /stroke="url\(#left\)"/);
    assert.match(logo, /stroke="url\(#right\)"/);
    assert.match(logo, /fill="url\(#spark\)"/);
    assert.doesNotMatch(logo, /<rect|background|#[Ff]{6}/);
    assert.match(assistantSource, /assets\/images\/ai-assistant-logo\.svg/);
    assert.doesNotMatch(assistantSource, /<rect x="4" y="7" width="16" height="11" rx="4"/);
});

test('give-code quick action follows the active core language', () => {
    const assistant = Object.create(AIAssistant.prototype);
    assistant.inputEl = { value: '', style: {}, scrollHeight: 40 };
    const sent = [];
    assistant.send = (options) => sent.push(options);

    assistant.handleQuickAction('give-code');

    assert.match(assistant.inputEl.value, /Python 3\.6/);
    assert.match(assistant.inputEl.value, /原始代码模板/);
    assert.match(assistant.inputEl.value, /完整/);
    assert.deepEqual(sent, [{ visibleMessage: '给我代码', expectedLanguage: '' }]);

    const javaPrompt = getQuickActionPrompt('give-code', {
        surface: 'leetcode',
        language: 'java',
        languageLabel: 'Java 17',
    });
    assert.match(javaPrompt, /Java 17/);
    assert.match(javaPrompt, /java 代码块/);
});

test('ACM context includes language, code, stdin, stdout, expected output, and status', () => {
    const elements = {
        'language-select': { value: 'python' },
        'stdin-area': { value: '2\n3 5\n' },
        'stdout-area': { textContent: '8\n', classList: { contains: () => false } },
        'expected-area': { value: '8\n' },
        'run-status': { textContent: '12.4 ms' },
        'status-info': { textContent: '运行完成' },
        'diff-result': { textContent: 'ACCEPTED' },
    };
    const document = {
        body: { dataset: { aiSurface: 'acm' } },
        getElementById(id) { return elements[id] || null; },
        querySelector() { return null; },
    };
    const window = {
        acmEditor: { getValue: () => 'a, b = map(int, input().split())\nprint(a + b)\n' },
    };

    withBrowserGlobals({ document, window }, () => {
        const context = collectAssistantContext();
        const message = buildContextMessage('转成其他语言', context);
        assert.match(message, /当前语言：Python 3/);
        assert.match(message, /```python\na, b = map/);
        assert.match(message, /【标准输入 stdin】\n2\n3 5/);
        assert.match(message, /【最近输出 stdout】\n8/);
        assert.match(message, /【期望输出 expected】\n8/);
        assert.match(message, /运行完成/);
        assert.match(message, /ACCEPTED/);
        assert.doesNotMatch(message, /undefined/);
    });
});

test('ACM code fences follow the active language', () => {
    const cases = [
        ['python', 'Python 3', 'python'],
        ['go', 'Go', 'go'],
        ['java', 'Java 17', 'java'],
    ];
    for (const [language, languageLabel, fence] of cases) {
        const message = buildContextMessage('检查', {
            surface: 'acm',
            language,
            languageLabel,
            code: 'sample code',
        });
        assert.match(message, new RegExp(`当前语言：${languageLabel}`));
        assert.match(message, new RegExp('```' + fence + '\\nsample code'));
    }
});

test('conversion actions issue complete target-specific ACM prompts', () => {
    for (const [action, required] of [
        ['convert-java', ['Java 17', 'public class Main', 'stdin', 'stdout', '算法语义']],
        ['convert-go', ['Go', 'package main', 'stdin', 'stdout', '算法语义']],
    ]) {
        const assistant = Object.create(AIAssistant.prototype);
        assistant.inputEl = { value: '', style: {}, scrollHeight: 40 };
        const sent = [];
        assistant.send = (options) => sent.push(options);
        assistant.handleQuickAction(action);

        for (const fragment of required) assert.match(assistant.inputEl.value, new RegExp(fragment));
        assert.equal(sent.length, 1);
        assert.equal(sent[0].visibleMessage, QUICK_ACTIONS[action].label);
    }
});

test('conversion prompts use the actual source language', () => {
    const prompt = getQuickActionPrompt('convert-java', {
        surface: 'acm',
        language: 'go',
        languageLabel: 'Go',
        code: 'package main',
    });
    assert.match(prompt, /当前 Go 实现/);
    assert.doesNotMatch(prompt, /当前 Python 实现/);
});

test('LeetCode context includes a Python 3.6 harness and the exact starter template', () => {
    const starterTemplate = `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def add_two_numbers(l1, l2):
    """
    :type l1: ListNode
    :type l2: ListNode
    :rtype: ListNode
    """
    # 在这里写你的代码
    pass
`;
    const message = buildContextMessage('给出代码', {
        surface: 'leetcode',
        language: 'python',
        languageLabel: 'Python 3',
        problemTitle: '两数相加',
        problem: '将两个逆序链表表示的数相加。',
        template: starterTemplate,
    });

    assert.match(message, /【运行环境硬约束】/);
    assert.match(message, /Python 3\.6/);
    assert.match(message, /不支持 Python 3\.7 及以上才提供的语法/);
    assert.match(message, /禁止使用 typing\.Optional|禁止使用 Optional/);
    assert.match(message, /不得输出 class Solution/);
    assert.match(message, /【原始代码模板】/);
    assert.match(message, /def add_two_numbers\(l1, l2\):/);
    assert.doesNotMatch(message, /def addTwoNumbers\(/);
    assert.ok(
        message.indexOf('【运行环境硬约束】') < message.indexOf('【原始代码模板】') &&
        message.indexOf('【原始代码模板】') < message.indexOf('【用户提问】'),
        'The Python 3.6 harness and starter template must precede the user request'
    );
});

test('LeetCode response validation rejects non-Python and incompatible local template code', () => {
    const starterTemplate = 'def add_two_numbers(l1, l2):\n    pass\n';
    assert.equal(
        validateAssistantResponse('```python\ndef add_two_numbers(l1, l2):\n    return None\n```', 'python', starterTemplate).valid,
        true
    );
    assert.equal(
        validateAssistantResponse('`Optional[ListNode]` 是官方题解常见的类型标注，但本页面不要使用。', 'python', starterTemplate).valid,
        true
    );
    assert.equal(
        validateAssistantResponse('```python\ndef solve(key=lambda x: x):\n    return key(1)\n```', 'python').valid,
        true
    );
    assert.equal(
        validateAssistantResponse('```java\nclass Solution {}\n```', 'python', starterTemplate).valid,
        false
    );
    assert.equal(
        validateAssistantResponse('public class Solution {}', 'python', starterTemplate).valid,
        false
    );
    assert.equal(
        validateAssistantResponse('```go\npackage main\nfunc main() {}\n```', 'python', starterTemplate).valid,
        false
    );
    assert.equal(
        validateAssistantResponse('```python\nclass Solution(object):\n    def addTwoNumbers(self, l1, l2):\n        return None\n```', 'python', starterTemplate).valid,
        false
    );
    assert.equal(
        validateAssistantResponse('```python\ndef add_two_numbers(l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:\n    return None\n```', 'python', starterTemplate).valid,
        false
    );
    assert.equal(
        validateAssistantResponse('```python\ndef addTwoNumbers(l1, l2):\n    return None\n```', 'python', starterTemplate).valid,
        false
    );
    assert.equal(
        validateAssistantResponse('```python\ndef add_two_numbers(l1, l2, carry=0):\n    return None\n```', 'python', starterTemplate).valid,
        false
    );
    assert.equal(
        validateAssistantResponse('```python\ndef add_two_numbers(l1, l2):\n    if (n := 1):\n        return n\n```', 'python', starterTemplate).valid,
        false
    );
});

test('ACM Python validation is not coupled to the LeetCode starter template', () => {
    assert.equal(
        validateAssistantResponse('```python\ndef solve(nums: list) -> int:\n    return len(nums)\n```', '').valid,
        true
    );
});

test('LeetCode response validation only applies to explicit code-generation requests', () => {
    assert.equal(resolveExpectedResponseLanguage('result = [None] 是什么写法', { surface: 'leetcode' }), '');
    assert.equal(resolveExpectedResponseLanguage('为什么这里要用列表包一层？', { surface: 'leetcode' }), '');
    assert.equal(resolveExpectedResponseLanguage('请直接给出完整代码', { surface: 'leetcode' }), 'python');
    assert.equal(resolveExpectedResponseLanguage('帮我补全函数实现', { surface: 'leetcode' }), 'python');
    assert.equal(resolveExpectedResponseLanguage('帮我补全函数实现', { surface: 'leetcode', language: 'java' }), 'java');
    assert.equal(resolveExpectedResponseLanguage('帮我补全函数实现', { surface: 'leetcode', language: 'go' }), 'go');
    assert.equal(resolveExpectedResponseLanguage('解释这段代码', { surface: 'leetcode' }), '');
    assert.equal(resolveExpectedResponseLanguage('给我提示，不要直接给代码', { surface: 'leetcode' }), '');
    assert.equal(resolveExpectedResponseLanguage('任意问题', { surface: 'acm' }), '');
    assert.equal(resolveExpectedResponseLanguage('任意问题', { surface: 'leetcode' }, 'java'), 'java');
    assert.match(assistantSource, /resolveExpectedResponseLanguage\(userMessage, context\)/);
    assert.match(assistantSource, /context\.surface\n\s*\)/);
});

test('failed AI requests render a retry button and retry without duplicating the user turn', () => {
    assert.match(assistantSource, /isRetryableAIError\(error\)/);
    assert.match(assistantSource, /retryButton\.textContent = '重新生成'/);
    assert.match(assistantSource, /retry: true/);
    assert.match(assistantSource, /if \(!isRetry\) \{/);
});

test('shared assistant keeps the LeetCode problem and Python editor context', () => {
    const document = {
        body: { dataset: {} },
        createElement() {
            return {
                textContent: '',
                set innerHTML(value) { this.textContent = String(value).replace(/<[^>]+>/g, ''); },
            };
        },
        getElementById() { return null; },
        querySelector() { return null; },
    };
    const window = {
        currentProblem: {
            title: '两数之和',
            description: '<p>返回两个数的下标</p>',
            template: '# template',
        },
        editor: { getValue: () => 'def two_sum(nums, target):\n    return []' },
    };

    withBrowserGlobals({ document, window }, () => {
        const message = buildContextMessage('给我提示');
        assert.match(message, /两数之和/);
        assert.match(message, /返回两个数的下标/);
        assert.match(message, /【原始代码模板】/);
        assert.match(message, /```python\n# template/);
        assert.match(message, /```python\ndef two_sum/);
        assert.match(message, /【用户提问】\n给我提示/);
    });
});

test('LeetCode assistant follows the active Java core template', () => {
    const document = {
        body: { dataset: {} },
        createElement() {
            return {
                textContent: '',
                set innerHTML(value) { this.textContent = String(value).replace(/<[^>]+>/g, ''); },
            };
        },
        getElementById() { return null; },
        querySelector() { return null; },
    };
    const template = 'class Solution {\n    public int[] twoSum(int[] nums, int target) { return null; }\n}';
    const window = {
        currentProblem: { title: '两数之和', description: '<p>返回两个下标</p>' },
        editor: { getValue: () => template.replace('return null', 'return new int[]{0, 1}') },
        leetcodeGetLanguageContext: () => ({
            language: 'java',
            languageLabel: 'Java 17',
            template,
        }),
    };

    withBrowserGlobals({ document, window }, () => {
        const context = collectAssistantContext();
        const message = buildContextMessage('给出代码', context);
        assert.equal(context.language, 'java');
        assert.match(message, /当前语言为 Java 17/);
        assert.match(message, /不得输出 public class Main/);
        assert.match(message, /```java\nclass Solution/);
        assert.doesNotMatch(message, /当前页面是本地力扣模拟，执行环境按 Python 3\.6/);
    });
});

test('assistant prompt and renderer are language-aware and sanitize Markdown HTML', () => {
    assert.match(SYSTEM_PROMPT, /代码块标注当前语言或目标语言/);
    assert.doesNotMatch(SYSTEM_PROMPT, /代码块使用\s+```python/);
    assert.match(assistantSource, /sanitizeMarkdownHtml\(marked\.parse\(text\)\)/);
    assert.match(assistantSource, /dangerousTags/);
    assert.match(assistantSource, /const safeHref =/);
    assert.match(assistantSource, /element\.removeAttribute\('href'\)/);
});

test('generated code language aliases are normalized without guessing unknown fences', () => {
    for (const [input, expected] of [
        ['python', 'python'], ['language-py', 'python'], ['Language-Python', 'python'], ['python3', 'python'],
        ['go', 'go'], ['golang', 'go'], ['java', 'java'], ['java17', 'java'],
        ['text', ''], ['', ''],
    ]) {
        assert.equal(normalizeGeneratedCodeLanguage(input), expected);
    }
});

test('conversion response validation rejects safety classifiers and incomplete programs', () => {
    assert.equal(validateAssistantResponse('User Safety: safe').valid, false);
    assert.equal(validateAssistantResponse('User Safety: unsafe.').valid, false);
    assert.equal(validateAssistantResponse('```java\nclass Solution {}\n```', 'java').valid, false);
    assert.equal(validateAssistantResponse('```go\nfunc main() {}\n```', 'go').valid, false);
    assert.equal(
        validateAssistantResponse('```java\npublic class Main {}\n```', 'java').valid,
        true
    );
    assert.equal(
        validateAssistantResponse('```go\npackage main\nfunc main() {}\n```', 'go').valid,
        true
    );
    assert.equal(
        validateAssistantResponse(
            '```java\nclass Solution { public int[] twoSum(int[] nums, int target) { return null; } }\n```',
            'java',
            'class Solution { public int[] twoSum(int[] nums, int target) { return null; } }',
            'leetcode'
        ).valid,
        true
    );
    assert.equal(
        validateAssistantResponse(
            '```java\npublic class Main {}\n```',
            'java',
            'class Solution {}',
            'leetcode'
        ).valid,
        false
    );
    assert.equal(
        validateAssistantResponse(
            '```go\nfunc twoSum(nums []int, target int) []int { return nil }\n```',
            'go',
            'func twoSum(nums []int, target int) []int { return nil }',
            'leetcode'
        ).valid,
        true
    );
    assert.equal(
        validateAssistantResponse(
            '```go\npackage main\nfunc main() {}\n```',
            'go',
            'func twoSum(nums []int, target int) []int { return nil }',
            'leetcode'
        ).valid,
        false
    );
});

test('saved built-in defaults migrate without changing user-provided OpenRouter credentials', async () => {
    assert.equal(AI_DEFAULT_MODEL, 'gpt-6-luna');
    assert.equal(normalizeConfiguredModel('openrouter/free'), 'openrouter/free');
    assert.equal(normalizeConfiguredModel('custom/model'), 'custom/model');

    await withBrowserGlobals({ window: { location: new URL('https://onefly.top/zero2Leetcode/playground.html') } }, async () => {
        const oldKey = await resolveAIRequestKey({
            baseUrl: 'https://tosky.io/v1', model: AI_DEFAULT_MODEL, apiKey: AI_BUILTIN_KEY,
        });
        for (const model of ['openrouter/free', 'poolside/laguna-s-2.1:free', AI_DEFAULT_MODEL]) {
            const writes = [];
            const localStorage = {
                getItem: () => JSON.stringify({
                    baseUrl: model === AI_DEFAULT_MODEL ? 'https://tosky.io/v1' : 'https://openrouter.ai/api/v1',
                    apiKey: oldKey, model,
                }),
                setItem(key, value) { writes.push([key, JSON.parse(value)]); },
            };
            withBrowserGlobals({ localStorage }, () => {
                const config = loadAIConfig();
                assert.equal(config.baseUrl, 'https://tosky.io/v1');
                assert.equal(config.model, AI_DEFAULT_MODEL);
                assert.ok(config.apiKey === AI_BUILTIN_KEY, 'migration must use the built-in marker');
                assert.equal(writes.length, 1);
                assert.ok(writes[0][1].apiKey === AI_BUILTIN_KEY, 'migration must not persist the unwrapped key');
            });
        }
    });

    for (const model of ['custom/model', 'openrouter/free', 'poolside/laguna-s-2.1:free']) {
        const custom = { baseUrl: 'https://openrouter.ai/api/v1', apiKey: 'custom-key', model };
        withBrowserGlobals({ localStorage: { getItem: () => JSON.stringify(custom) } }, () => {
            assert.deepEqual(loadAIConfig(), custom);
        });
    }
});

test('built-in credential unwraps on official project pages and stays out of the config', async () => {
    for (const origin of ['https://onefly.top', 'https://ranxi2001.github.io']) {
        await withBrowserGlobals({ window: { location: new URL(`${origin}/zero2Leetcode/acm-playground.html`) } }, async () => {
            const config = loadAIConfig();
            assert.ok(config.apiKey === AI_BUILTIN_KEY);
            const key = await resolveAIRequestKey(config);
            assert.ok(/^sk-[a-zA-Z0-9-]+$/.test(key), 'the request must receive a valid unwrapped key');
            assert.ok(config.apiKey === AI_BUILTIN_KEY, 'unwrapping must not mutate the config');
        });
    }
});

test('copied built-in config cannot send requests from another domain, protocol, or project path', async () => {
    for (const href of [
        'https://example.test/zero2Leetcode/playground.html',
        'https://onefly.top/another-project/playground.html',
        'https://onefly.top/zero2Leetcode-copy/playground.html',
        'http://onefly.top/zero2Leetcode/playground.html',
        'https://onefly.top:8443/zero2Leetcode/playground.html',
    ]) {
        let requested = false;
        await withBrowserGlobals({
            window: { location: new URL(href) },
            fetch: async () => { requested = true; },
        }, async () => {
            await assert.rejects(async () => {
                for await (const chunk of streamResponses([], loadAIConfig())) void chunk;
            }, /仅在项目官网可用/);
            assert.equal(requested, false);
        });
    }
});

test('built-in marker cannot release the key to a changed API or model', async () => {
    await withBrowserGlobals({ window: { location: new URL('https://onefly.top/zero2Leetcode/playground.html') } }, async () => {
        const config = loadAIConfig();
        await assert.rejects(resolveAIRequestKey({ ...config, baseUrl: 'https://example.test/v1' }), /填写自己的 API Key/);
        await assert.rejects(resolveAIRequestKey({ ...config, model: 'another-model' }), /填写自己的 API Key/);
    });
});

test('user-provided API keys bypass built-in restrictions and Web Crypto', async () => {
    await withBrowserGlobals({
        window: { location: new URL('http://localhost:8000/playground.html') },
        crypto: undefined,
    }, async () => {
        assert.equal(await resolveAIRequestKey({
            baseUrl: 'https://tosky.io/v1', model: AI_DEFAULT_MODEL, apiKey: 'custom-key',
        }), 'custom-key');
        assert.equal(await resolveAIRequestKey({
            baseUrl: 'https://example.test/v1', model: 'custom-model', apiKey: 'another-custom-key',
        }), 'another-custom-key');
    });
});

test('built-in streaming unwraps only for the request and sends the real authorization header', async () => {
    let requested = false;
    await withBrowserGlobals({
        window: { location: new URL('https://onefly.top/zero2Leetcode/playground.html') },
        fetch: async (url, options) => {
            requested = true;
            assert.equal(url, 'https://tosky.io/v1/responses');
            assert.ok(/^Bearer sk-/.test(options.headers.Authorization), 'request must use the unwrapped key');
            assert.equal(JSON.parse(options.body).model, AI_DEFAULT_MODEL);
            return new Response(textDelta('ok') + completed('ok'), {
                headers: { 'Content-Type': 'text/event-stream' },
            });
        },
    }, async () => {
        const config = loadAIConfig();
        for await (const chunk of streamResponses([], config)) void chunk;
        assert.ok(config.apiKey === AI_BUILTIN_KEY, 'the real key must not replace the marker');
        assert.equal(requested, true);
    });
});

test('copy helper uses the browser clipboard without changing code text', async () => {
    const copied = [];
    const result = await copyTextToClipboard('System.out.println("<ok>");\n', {
        clipboard: { writeText: async (value) => copied.push(value) },
    }, null);
    assert.equal(result, true);
    assert.deepEqual(copied, ['System.out.println("<ok>");\n']);
});

test('code block decorator adds local copy and editor actions once', () => {
    function element(tagName) {
        const node = {
            tagName: tagName.toUpperCase(),
            children: [],
            parentElement: null,
            parentNode: null,
            className: '',
            dataset: {},
            attributes: {},
            textContent: '',
            type: '',
            disabled: false,
            title: '',
            setAttribute(name, value) { this.attributes[name] = String(value); },
            append(...children) {
                for (const child of children) {
                    if (child.parentNode?.children) {
                        child.parentNode.children = child.parentNode.children.filter((item) => item !== child);
                    }
                    child.parentNode = this;
                    child.parentElement = this;
                    this.children.push(child);
                }
            },
            get classList() {
                return { contains: (name) => this.className.split(/\s+/).includes(name) };
            },
        };
        return node;
    }

    const root = element('div');
    const pre = element('pre');
    const code = element('code');
    code.className = 'language-java';
    code.textContent = 'public class Main {}\n';
    pre.append(code);
    root.append(pre);
    root.ownerDocument = { createElement: element };
    root.querySelectorAll = () => [code];
    root.insertBefore = function insertBefore(child, reference) {
        child.parentNode = this;
        child.parentElement = this;
        this.children.splice(this.children.indexOf(reference), 0, child);
    };

    assert.equal(decorateAssistantCodeBlocks(root, { surface: 'acm' }), 1);
    assert.equal(decorateAssistantCodeBlocks(root, { surface: 'acm' }), 0);
    const block = root.children[0];
    assert.equal(block.className, 'ai-code-block');
    assert.equal(block.dataset.aiCodeLanguage, 'java');
    assert.equal(block.children[1], pre);
    const actions = block.children[0].children[1].children;
    assert.equal(actions[0].dataset.aiCodeAction, 'copy');
    assert.equal(actions[0].textContent, '复制');
    assert.equal(actions[1].dataset.aiCodeAction, 'apply');
    assert.equal(actions[1].textContent, '写入编辑器');
    assert.equal(actions[1].disabled, false);
});

test('streaming responses pin the viewport to the start instead of chasing new tokens', () => {
    assert.match(assistantSource, /scrollMessageToStart\(assistantMessage\)/);
    assert.match(assistantSource, /addMessage\('assistant', '', \{ loading: true, scroll: false \}\)/);

    const renderResponseBody = assistantSource.match(/const renderResponse = \(\) => \{([\s\S]*?)\n        \};/i)?.[1] || '';
    assert.doesNotMatch(renderResponseBody, /scrollToBottom/);
    assert.doesNotMatch(assistantSource, /this\.discardCurrentResponse = false;\n\s*this\.scrollToBottom\(\);/);
});

test('scrollMessageToStart aligns the new answer with a small reading offset', () => {
    const assistant = Object.create(AIAssistant.prototype);
    const scheduled = [];
    assistant.messagesEl = { scrollTop: 0 };
    const message = { offsetTop: 240 };

    withBrowserGlobals({
        window: { requestAnimationFrame: (callback) => scheduled.push(callback) },
    }, () => {
        assistant.scrollMessageToStart(message);
        assert.equal(assistant.messagesEl.scrollTop, 0);
        scheduled[0]();
        assert.equal(assistant.messagesEl.scrollTop, 228);
    });
});

test('history applies a hard limit even when the latest message is oversized', () => {
    const result = boundedHistory([
        { role: 'assistant', content: 'old' },
        { role: 'user', content: 'x'.repeat(100000) },
    ]);
    assert.equal(result.length, 1);
    assert.ok(result[0].content.length <= 60000);
});

// Synthetic Responses fixtures; the saved live diagnostic remains historical Chat evidence.
function outputMessage(text, role = 'assistant') {
    return { type: 'message', role, content: [{ type: 'output_text', text }] };
}
function responsePayload(text, overrides = {}) {
    return { object: 'response', status: 'completed', output: [outputMessage(text)], ...overrides };
}
function sseEvent(type, data = {}) {
    if (type === 'error' && data.type && data.type !== 'error' && !data.error) {
        data = { ...data, code: data.code ?? data.type };
    }
    return `event: ${type}\ndata: ${JSON.stringify({ ...data, type })}\n\n`;
}
function textDelta(text, output_index = 0, content_index = 0) {
    return sseEvent('response.output_text.delta', { delta: text, output_index, content_index });
}
function completed(text, overrides = {}) {
    return sseEvent('response.completed', { response: responsePayload(text, overrides) });
}

async function readCompletion(response, signal) {
    return withBrowserGlobals({ fetch: async () => response }, async () => {
        const chunks = [];
        for await (const chunk of streamResponses([], {
            baseUrl: 'https://example.test/v1', apiKey: 'test-key', model: 'test-model',
        }, signal)) chunks.push(chunk);
        return chunks;
    });
}

function withAssistant(fetch, callback) {
    const createElement = () => ({
        children: [], textContent: '', innerHTML: '', classList: { remove() {} },
        appendChild(child) { this.children.push(child); },
        setAttribute() {},
        addEventListener(type, callback) { this[type] = callback; },
    });
    const assistant = Object.create(AIAssistant.prototype);
    const replies = [];
    const userMessages = [];
    assistant.inputEl = { value: '', style: {} };
    assistant.messagesEl = { querySelector: () => null };
    assistant.liveStatus = { textContent: '' };
    assistant.showWelcome = () => {};
    assistant.updateContextSummary = () => {};
    assistant.scrollMessageToStart = () => {};
    assistant.setStreamingState = (active) => { assistant.isStreaming = active; };
    assistant.renderMarkdown = (text) => text;
    assistant.decorateCodeBlocks = (element, options) => { element.codeOptions = options; };
    assistant.addMessage = (role, text) => {
        if (role === 'user') userMessages.push(text);
        const content = createElement();
        if (role === 'assistant') replies.push(content);
        return { classList: { remove() {} }, querySelector: () => content, remove() {} };
    };
    assistant.clearChat();
    return withBrowserGlobals({
        fetch,
        document: { createElement },
        localStorage: { getItem: () => JSON.stringify({
            baseUrl: 'https://example.test/v1', apiKey: 'test-key', model: 'test-model',
        }) },
    }, () => callback({ assistant, replies, userMessages }));
}

const hintContext = { surface: 'leetcode', language: 'python',
    problemTitle: 'LC 93 - 复原 IP 地址', problem: '把数字字符串分为四段有效 IP 地址。',
    template: 'def restore_ip_addresses(s):\n    pass\n', code: '' };

const liveDiagnostics = JSON.parse(fs.readFileSync(path.join(root, 'tests/fixtures/ai-hint-live-diagnostics.json'), 'utf8'));
const { type: upstreamType, message: upstreamMessage } = liveDiagnostics.reports.find(report => report.errors)?.errors[0];
const upstreamError = { type: upstreamType, message: upstreamMessage };
const busyMessage = '上游服务繁忙，请稍后重新生成。';

test('failed LC93 hints do not leave consecutive user messages in the next request', async () => {
    const requests = [];
    await withAssistant(async (url, options) => {
        requests.push(JSON.parse(options.body));
        if (requests.length === 1) return new Response(sseEvent('error', upstreamError), {
            headers: { 'Content-Type': 'text/event-stream' },
        });
        return new Response(textDelta('考虑每段的长度和前导零。') + completed('考虑每段的长度和前导零。'), {
            headers: { 'Content-Type': 'text/event-stream' },
        });
    }, async ({ assistant, replies }) => {
        assistant.inputEl.value = getQuickActionPrompt('give-hint', hintContext);
        await assistant.send({ context: hintContext });
        assistant.inputEl.value = getQuickActionPrompt('give-hint', hintContext);
        await assistant.send({ context: hintContext });
        assert.deepEqual(requests[1].input.map(message => message.role), ['system', 'user']);
        assert.equal(replies[1].innerHTML, '考虑每段的长度和前导零。');
        assert.equal(assistant.liveStatus.textContent, 'AI 回复已生成');
    });
});

test('a streamed service error can be retried without duplicating the user turn', async () => {
    const requests = [];
    await withAssistant(async (url, options) => {
        requests.push(JSON.parse(options.body));
        if (requests.length === 1) return new Response(sseEvent('error', upstreamError));
        return Response.json(responsePayload('先枚举第一段的长度。'));
    }, async ({ assistant, replies, userMessages }) => {
        assistant.inputEl.value = getQuickActionPrompt('give-hint', hintContext);
        await assistant.send({ context: hintContext, visibleMessage: '给个提示' });
        assert.equal(requests.length, 1, 'service failures must not retry automatically');
        assert.equal(replies[0].children[0].textContent, busyMessage);
        const retry = replies[0].children.find(element => element.textContent === '重新生成');
        assert.ok(retry, 'the failed reply must offer a retry');
        const send = assistant.send.bind(assistant);
        let pending;
        assistant.send = options => (pending = send(options));
        retry.click();
        await pending;
        assert.deepEqual(requests[1], requests[0]);
        assert.deepEqual(userMessages, ['给个提示']);
        assert.equal(replies[1].innerHTML, '先枚举第一段的长度。');
        assistant.inputEl.value = '再解释一下';
        await assistant.send({ context: hintContext });
        assert.deepEqual(requests[2].input.map(message => message.role), ['system', 'user', 'assistant', 'user']);
    });
});

test('mid-stream errors preserve partial text for display but never add it to history', async () => {
    const requests = [];
    await withAssistant(async (url, options) => {
        requests.push(JSON.parse(options.body));
        if (requests.length === 2) return Response.json(responsePayload('完整回复'));
        return new Response(textDelta('失败的部分回复')
            + sseEvent('error', upstreamError));
    }, async ({ assistant, replies }) => {
        assistant.inputEl.value = '给个提示';
        await assistant.send({ context: hintContext });
        assert.equal(requests.length, 1);
        assert.equal(replies[0].innerHTML, '失败的部分回复');
        assert.equal(replies[0].codeOptions.allowApply, false);
        assert.equal(replies[0].children[0].textContent, busyMessage);
        assistant.inputEl.value = '换个提示';
        await assistant.send({ context: hintContext });
        assert.deepEqual(requests[1].input.map(message => message.role), ['system', 'user']);
        assert.doesNotMatch(JSON.stringify(requests[1]), /失败的部分回复|给个提示/);
        assistant.inputEl.value = '继续';
        await assistant.send({ context: hintContext });
        assert.deepEqual(requests[2].input.map(message => message.role), ['system', 'user', 'assistant', 'user']);
        assert.equal(requests[2].input[2].content[0].text, '完整回复');
    });
});

test('only temporary service failures offer explicit retry in SSE, JSON, and HTTP errors', async () => {
    for (const [detail, retryable] of [
        [upstreamError, true],
        [{ type: 'overloaded', message: 'PRIVATE_DETAIL' }, true],
        [{ type: 'server_error', message: 'PRIVATE_DETAIL' }, true],
        [{ type: 'authentication_error', message: 'overloaded PRIVATE_KEY' }, false],
        [{ code: 'invalid_api_key', message: 'PRIVATE_KEY' }, false],
        [{ type: 'invalid_request_error', message: 'PRIVATE_PARAMETER' }, false],
        [{ code: 400, message: 'PRIVATE_PARAMETER' }, false],
        [{ type: 'unknown_error', message: 'PRIVATE_DETAIL' }, false],
    ]) {
        for (const format of ['sse', 'json', 'failed-sse', 'failed-json']) {
            let requests = 0;
            await withAssistant(async () => {
                requests += 1;
                if (format === 'failed-json') return Response.json(responsePayload('', { status: 'failed', error: detail }));
                if (format === 'failed-sse') return new Response(sseEvent('response.failed', {
                    response: responsePayload('', { status: 'failed', error: detail }),
                }));
                return format === 'json' ? Response.json({ error: detail }) : new Response(sseEvent('error', detail));
            }, async ({ assistant, replies }) => {
                assistant.inputEl.value = '给个提示';
                await assistant.send({ context: hintContext });
                assert.equal(requests, 1, 'never retry automatically');
                assert.doesNotMatch(replies[0].children[0].textContent, /PRIVATE_|Our servers/);
                assert.equal(replies[0].children.some(element => element.textContent === '重新生成'), retryable,
                    `${JSON.stringify(detail)}, ${format}`);
            });
        }
    }
    for (const status of [400, 401, 403, 408, 429, 500, 503]) {
        let requests = 0;
        await withAssistant(async () => {
            requests += 1;
            return new Response('PRIVATE_DETAIL', { status });
        }, async ({ assistant, replies }) => {
            assistant.inputEl.value = '给个提示';
            await assistant.send({ context: hintContext });
            assert.equal(requests, 1);
            assert.doesNotMatch(replies[0].children[0].textContent, /PRIVATE_/);
            assert.equal(replies[0].children.some(element => element.textContent === '重新生成'),
                [408, 429, 500, 503].includes(status), `HTTP ${status}`);
        });
    }
});

test('JSON Responses preserves a plain text hint when a service does not stream', async () => {
    const hint = '先考虑每一段最多可以取几位数字，再判断剩余长度。';
    assert.deepEqual(await readCompletion(Response.json(responsePayload(hint))), [hint]);
});

test('historical Chat overload classification also applies to a synthetic Responses error event', async () => {
    assert.deepEqual(upstreamError, {
        type: 'upstream_error', message: 'Our servers are currently overloaded. Please try again later.',
    });
    const body = sseEvent('response.created', { response: { status: 'in_progress', output: [] } })
        + sseEvent('error', { error: upstreamError });
    await assert.rejects(readCompletion(new Response(body, {
        headers: { 'Content-Type': 'text/event-stream' },
    })), { message: busyMessage });
});

test('HTTP 200 JSON service errors use a fixed safe Chinese message', async () => {
    await assert.rejects(readCompletion(Response.json({ error: upstreamError })), { message: busyMessage });
});

test('failed and incomplete Responses report errors in SSE and JSON', async () => {
    for (const [status, detail, message] of [
        ['failed', { error: upstreamError }, /上游服务繁忙/],
        ['incomplete', { incomplete_details: { reason: 'max_output_tokens' } }, /输出上限/],
        ['incomplete', { incomplete_details: { reason: 'content_filter' } }, /内容过滤/],
        ['incomplete', { incomplete_details: { reason: 'unknown' } }, /不完整/],
    ]) {
        for (const json of [false, true]) {
            const payload = responsePayload('部分回复', { status, ...detail });
            const response = json ? Response.json(payload) : new Response(
                textDelta('部分回复') + sseEvent(`response.${status}`, { response: payload })
            );
            await assert.rejects(readCompletion(response), message, `${status}, JSON=${json}`);
        }
    }
});

test('reasoning-only, tool-only, refusal-only and empty Responses never become answers', async () => {
    for (const output of [[], [outputMessage(' ')],
        [{ type: 'reasoning', summary: [{ type: 'summary_text', text: 'PRIVATE_REASONING' }] }],
        [{ type: 'function_call', name: 'PRIVATE_TOOL', arguments: '{}' }],
        [{ type: 'message', role: 'assistant', content: [{ type: 'refusal', refusal: 'PRIVATE_REFUSAL' }] }],
        [outputMessage('PRIVATE_USER', 'user')],
    ]) {
        for (const json of [false, true]) {
            const response = json ? Response.json(responsePayload('', { output }))
                : new Response(sseEvent('response.reasoning_text.delta', { delta: 'PRIVATE_REASONING' })
                    + completed('', { output }));
            await assert.rejects(readCompletion(response), error => {
                assert.match(error.message, /未返回.*答案|没有生成.*答案/);
                assert.doesNotMatch(error.message, /PRIVATE_/);
                return true;
            });
        }
    }
});

test('SSE byte chunks preserve hint and code and ignore reasoning and events after completed', async () => {
    const hint = '每段枚举 1 到 3 位。';
    const code = '\n```python\ndef restore_ip_addresses(s):\n    return []\n```';
    const body = (': keepalive\n\n'
        + sseEvent('response.reasoning_text.delta', { delta: 'PRIVATE_REASONING' })
        + textDelta(hint) + textDelta(code)
        + sseEvent('response.output_text.done', { output_index: 0, content_index: 0, text: hint + code })
        + completed(hint + code) + textDelta('IGNORE')).replaceAll('\n', '\r\n');
    const bytes = new TextEncoder().encode(body);
    const response = new Response(new ReadableStream({
        start(controller) {
            for (const byte of bytes) controller.enqueue(Uint8Array.of(byte));
            controller.close();
        },
    }), { headers: { 'Content-Type': 'text/event-stream' } });
    assert.deepEqual(await readCompletion(response), [hint, code]);
    assert.equal(response.body.locked, false);
});

test('JSON code replies preserve fenced code for LeetCode validation', async () => {
    const code = '```python\ndef restore_ip_addresses(s):\n    return []\n```';
    const chunks = await readCompletion(Response.json(responsePayload(code, {
        output: [{ type: 'reasoning', text: 'PRIVATE_REASONING' }, outputMessage(code)],
    })));
    assert.deepEqual(chunks, [code]);
    assert.equal(validateAssistantResponse(chunks.join(''), 'python', hintContext.template, 'leetcode').valid, true);
});

test('SSE tail errors release the reader and retain an actionable error', async () => {
    const response = new Response(sseEvent('error', upstreamError).trimEnd());
    await assert.rejects(readCompletion(response), { message: busyMessage });
    assert.equal(response.body.locked, false);
});

test('HTTP errors keep their status without exposing service details', async () => {
    for (const status of [401, 429, 500]) {
        await assert.rejects(readCompletion(Response.json({ error: { message: 'Request failed' } }, { status })),
            error => {
                assert.match(error.message, new RegExp(`API 请求失败 \\(${status}\\)`));
                assert.doesNotMatch(error.message, /Request failed/);
                return true;
            });
    }
});

test('ending consumption early cancels and unlocks the SSE reader', async () => {
    let cancelled = false;
    const response = new Response(new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(textDelta('提示')));
        },
        cancel() { cancelled = true; },
    }));
    await withBrowserGlobals({ fetch: async () => response }, async () => {
        for await (const chunk of streamResponses([], {
            baseUrl: 'https://example.test/v1', apiKey: 'test-key', model: 'test-model',
        })) {
            assert.equal(chunk, '提示');
            break;
        }
    });
    assert.equal(cancelled, true);
    assert.equal(response.body.locked, false);
});

test('stopping a partial SSE reply preserves text and disables applying incomplete code', async () => {
    let stopped = false;
    await withAssistant(async (url, options) => new Response(new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(textDelta('部分提示')));
            options.signal.addEventListener('abort', () => {
                stopped = true;
                controller.error(new DOMException('Stopped', 'AbortError'));
            });
        },
    })), async ({ assistant, replies }) => {
        assistant.renderMarkdown = text => { assistant.stopStreaming(); return text; };
        assistant.inputEl.value = '给个提示';
        await assistant.send({ context: hintContext });
        assert.equal(stopped, true);
        assert.equal(replies[0].innerHTML, '部分提示');
        assert.equal(replies[0].codeOptions.allowApply, false);
        assert.equal(assistant.liveStatus.textContent, '已停止生成，保留当前回复');
        assert.equal(assistant.isStreaming, false);
    });
});

test('a length-limited code reply keeps the last delta but cannot be applied as complete code', async () => {
    const code = '```python\ndef restore_ip_addresses(s):\n';
    await withAssistant(async () => new Response(
        textDelta(code) + sseEvent('response.incomplete', { response: responsePayload(code, { status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' } }) })
    ), async ({ assistant, replies }) => {
        assistant.inputEl.value = getQuickActionPrompt('give-code', hintContext);
        await assistant.send({ context: hintContext });
        assert.equal(replies[0].innerHTML, code);
        assert.equal(replies[0].codeOptions.allowApply, false);
        assert.match(replies[0].children[0].textContent, /输出上限/);
        assert.equal(assistant.liveStatus.textContent, 'AI 请求失败，可重新生成');
    });
});

test('stream parser preserves split UTF-8 and cancels after the done event', async () => {
    const originalFetch = globalThis.fetch;
    const encoder = new TextEncoder();
    let cancelled = false;
    const event = encoder.encode(textDelta('你好'));
    const splitAt = event.indexOf(0xe5) + 1;
    const done = encoder.encode(completed('你好'));
    globalThis.fetch = async () => ({
        ok: true,
        body: new ReadableStream({
            start(controller) {
                controller.enqueue(event.slice(0, splitAt));
                controller.enqueue(event.slice(splitAt));
                controller.enqueue(done);
            },
            cancel() { cancelled = true; },
        }),
    });

    try {
        const chunks = [];
        for await (const chunk of streamResponses([], {
            baseUrl: 'https://example.test/v1',
            apiKey: 'key',
            model: 'model',
        })) chunks.push(chunk);
        assert.deepEqual(chunks, ['你好']);
        assert.equal(cancelled, true);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('stream parser reads a final SSE event without a trailing newline', async () => {
    const originalFetch = globalThis.fetch;
    const encoder = new TextEncoder();
    globalThis.fetch = async () => ({
        ok: true,
        body: new ReadableStream({
            start(controller) {
                controller.enqueue(encoder.encode(textDelta('tail') + completed('tail').trimEnd()));
                controller.close();
            },
        }),
    });

    try {
        const chunks = [];
        for await (const chunk of streamResponses([], {
            baseUrl: 'https://example.test/v1',
            apiKey: 'key',
            model: 'model',
        })) chunks.push(chunk);
        assert.deepEqual(chunks, ['tail']);
    } finally {
        globalThis.fetch = originalFetch;
    }
});

test('settings keep the built-in key empty, save only its marker, and accept custom credentials', () => {
    const fields = {
        'ai-cfg-base-url': { value: 'https://tosky.io/v1' },
        'ai-cfg-api-key': { value: '' },
        'ai-cfg-model': { value: AI_DEFAULT_MODEL },
    };
    let saved = null;
    const assistant = Object.create(AIAssistant.prototype);
    assistant.configModal = { classList: { add() {} }, setAttribute() {} };
    assistant.closeConfig = () => {};
    assistant.addSystemMessage = () => {};
    assistant.syncBackgroundInert = () => {};
    fields['ai-cfg-base-url'].focus = () => {};
    withBrowserGlobals({
        document: { getElementById: (id) => fields[id] },
        localStorage: { setItem: (key, value) => { saved = JSON.parse(value); } },
    }, () => {
        assistant.saveConfig();
        assert.ok(saved.apiKey === AI_BUILTIN_KEY, 'only the marker should be persisted');
        assistant.openConfig();
        assert.equal(fields['ai-cfg-api-key'].value, '');
        assert.match(fields['ai-cfg-api-key'].placeholder, /内置服务/);

        fields['ai-cfg-base-url'].value = 'https://example.test/v1';
        fields['ai-cfg-model'].value = 'custom-model';
        fields['ai-cfg-api-key'].value = 'custom-key';
        assistant.saveConfig();
        assert.deepEqual(saved, { baseUrl: 'https://example.test/v1', model: 'custom-model', apiKey: 'custom-key' });
        assistant.openConfig();
        assert.equal(fields['ai-cfg-api-key'].value, 'custom-key');
    });
});

test('an unsaved custom API config remains active for the current page session', () => {
    const custom = {
        baseUrl: 'https://example.test/v1',
        apiKey: 'custom-key',
        model: 'custom-model',
    };
    const localStorage = {
        setItem() { throw new Error('storage disabled'); },
        getItem() { return null; },
    };

    withBrowserGlobals({ localStorage }, () => {
        assert.equal(saveAIConfig(custom), false);
        assert.deepEqual(loadAIConfig(), custom);
    });
});

test('Responses request uses typed input, stateless storage and the unchanged system/history', async () => {
    const messages = [{ role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: '第一问' }, { role: 'assistant', content: '第一答' },
        { role: 'user', content: '第二问' }];
    await withBrowserGlobals({ fetch: async (url, options) => {
        assert.equal(url, 'https://example.test/v1/responses');
        assert.equal(options.method, 'POST');
        assert.equal(options.headers.Authorization, 'Bearer custom');
        const body = JSON.parse(options.body);
        assert.deepEqual(Object.keys(body).sort(), ['input', 'model', 'store', 'stream']);
        assert.equal(body.store, false);
        assert.equal(body.stream, true);
        assert.equal(body.model, 'existing-model');
        assert.deepEqual(body.input, messages.map((message, index) => message.role === 'assistant'
            ? { type: 'message', id: `msg_local_${index}`, status: 'completed', role: 'assistant',
                content: [{ type: 'output_text', text: message.content, annotations: [] }] }
            : { type: 'message', role: message.role, content: [{ type: 'input_text', text: message.content }] }));
        return Response.json(responsePayload('第二答'));
    } }, async () => {
        const chunks = [];
        for await (const chunk of streamResponses(messages, {
            baseUrl: 'https://example.test/v1///', apiKey: 'custom', model: 'existing-model',
        })) chunks.push(chunk);
        assert.deepEqual(chunks, ['第二答']);
    });
});

test('output_text.done and completed snapshots emit each text part exactly once', async () => {
    const output = [outputMessage('甲'), outputMessage('乙')];
    for (const body of [
        textDelta('甲') + sseEvent('response.output_text.done', { output_index: 0, content_index: 0, text: '甲' })
            + sseEvent('response.output_text.done', { output_index: 1, content_index: 0, text: '乙' })
            + completed('', { output }),
        completed('', { output }),
        textDelta('甲') + sseEvent('response.output_text.done', { output_index: 0, content_index: 0, text: '甲乙' })
            + completed('甲乙'),
    ]) assert.equal((await readCompletion(new Response(body))).join(''), '甲乙');
});

test('SSE event name, multiline data and no trailing newline are supported', async () => {
    const body = 'event: response.output_text.delta\r\ndata: {"output_index":0,\r\ndata: "content_index":0,"delta":"你好"}\r\n\r\n'
        + 'event: response.completed\r\ndata: {"response":\r\ndata: {"status":"completed","output":[]}}';
    assert.deepEqual(await readCompletion(new Response(body)), ['你好']);
});

test('EOF, DONE and output_text.done never substitute for a success terminal', async () => {
    for (const tail of ['', 'data: [DONE]\n\n',
        sseEvent('response.output_text.done', { output_index: 0, content_index: 0, text: '半截' }),
        'event: response.completed\ndata: {"response":',
    ]) {
        const response = new Response(textDelta('半截') + tail);
        await assert.rejects(readCompletion(response), /中断|不完整|截断/);
        assert.equal(response.body.locked, false);
    }
    for (const status of [undefined, 'in_progress', 'queued', 'cancelled']) {
        await assert.rejects(readCompletion(Response.json(responsePayload('半截', { status }))), /中断|不完整|截断/);
    }
});

test('failed and incomplete terminals stop reading before later success events', async () => {
    for (const type of ['response.failed', 'response.incomplete', 'error']) {
        const detail = type === 'error' ? { code: 'server_error' }
            : { response: responsePayload('', { status: type.split('.')[1], error: { code: 'server_error' } }) };
        await assert.rejects(readCompletion(new Response(sseEvent(type, detail) + completed('IGNORE'))));
    }
});

test('truncated, incomplete, failed, cancelled and locally limited replies never enter history', async () => {
    const partial = '```python\ndef restore_ip_addresses(s):\n    return []\n```';
    for (const mode of ['eof', 'failed', 'incomplete', 'abort', 'local-limit']) {
        const requests = [];
        await withAssistant(async (url, options) => {
            requests.push(JSON.parse(options.body));
            if (requests.length > 1) return Response.json(responsePayload('完整提示'));
            if (mode === 'abort') return new Response(new ReadableStream({ start(controller) {
                controller.enqueue(new TextEncoder().encode(textDelta(partial)));
                options.signal.addEventListener('abort', () => controller.error(new DOMException('Stopped', 'AbortError')));
            } }));
            const text = mode === 'local-limit' ? partial + 'x'.repeat(60001) : partial;
            const tail = mode === 'failed' ? sseEvent('response.failed', { response: { status: 'failed', error: upstreamError } })
                : mode === 'incomplete' ? sseEvent('response.incomplete', { response: { status: 'incomplete', incomplete_details: { reason: 'max_output_tokens' } } })
                    : mode === 'local-limit' ? completed(text) : '';
            return new Response(textDelta(text) + tail);
        }, async ({ assistant, replies }) => {
            const render = assistant.renderMarkdown;
            if (mode === 'abort') assistant.renderMarkdown = text => { assistant.stopStreaming(); return text; };
            assistant.inputEl.value = '失败问题';
            await assistant.send({ context: hintContext });
            assert.equal(replies[0].codeOptions.allowApply, false, mode);
            assistant.renderMarkdown = render;
            assistant.inputEl.value = '下一问';
            await assistant.send({ context: hintContext });
            assert.deepEqual(requests[1].input.map(message => message.role), ['system', 'user'], mode);
            assert.doesNotMatch(JSON.stringify(requests[1]), /失败问题|return \[\]/);
            assistant.inputEl.value = '继续';
            await assistant.send({ context: hintContext });
            assert.deepEqual(requests[2].input.map(message => message.role), ['system', 'user', 'assistant', 'user']);
            assert.equal(requests[2].input[0].content[0].text, SYSTEM_PROMPT);
            assert.deepEqual(requests[2].input[2].content, [{ type: 'output_text', text: '完整提示', annotations: [] }]);
        });
    }
});

test('Responses config wording and cache version are present on both surfaces', () => {
    for (const name of ['playground.html', 'acm-playground.html']) {
        const html = fs.readFileSync(path.join(root, name), 'utf8');
        assert.match(html, /OpenAI Responses.*兼容/);
        assert.match(html, /ai-assistant\.js\?v=20261020-responses/);
    }
});

test('equal text across different output/content parts is preserved without snapshot duplication', async () => {
    const output = [outputMessage('同'), { type: 'message', role: 'assistant',
        content: [{ type: 'output_text', text: '同' }, { type: 'output_text', text: '同' }] }];
    const body = textDelta('同', 0, 0) + textDelta('同', 1, 0) + textDelta('同', 1, 1)
        + completed('', { output });
    assert.deepEqual(await readCompletion(new Response(body)), ['同', '同', '同']);
});

test('known non-assistant items and non-output_text events never yield answer text', async () => {
    const body = sseEvent('response.output_item.added', { output_index: 0,
        item: { type: 'message', role: 'user' } }) + textDelta('PRIVATE_USER')
        + sseEvent('response.refusal.delta', { delta: 'PRIVATE_REFUSAL' })
        + sseEvent('response.function_call_arguments.delta', { delta: 'PRIVATE_TOOL' })
        + textDelta('答案', 1) + completed('', { output: [
            outputMessage('PRIVATE_USER', 'user'), outputMessage('答案'),
        ] });
    assert.deepEqual(await readCompletion(new Response(body)), ['答案']);
});

test('aborting a pending read cancels and releases its reader even if fetch ignores the signal', async () => {
    const controller = new AbortController();
    let cancelled = false;
    let started;
    const waiting = new Promise(resolve => { started = resolve; });
    const response = new Response(new ReadableStream({
        pull() { started(); },
        cancel() { cancelled = true; },
    }));
    await withBrowserGlobals({ fetch: async () => response }, async () => {
        const iterator = streamResponses([], { baseUrl: 'https://example.test/v1', apiKey: 'custom', model: 'existing' }, controller.signal);
        const pending = iterator.next();
        await waiting;
        controller.abort();
        await assert.rejects(pending, { name: 'AbortError' });
    });
    assert.equal(cancelled, true);
    assert.equal(response.body.locked, false);
});

test('aborting before a request sends nothing and aborting JSON reads remains an AbortError', async () => {
    const controller = new AbortController();
    controller.abort();
    let requests = 0;
    await withBrowserGlobals({ fetch: async () => { requests += 1; } }, async () => {
        await assert.rejects(async () => {
            for await (const chunk of streamResponses([], {}, controller.signal)) void chunk;
        }, { name: 'AbortError' });
    });
    assert.equal(requests, 0);
    const reading = new AbortController();
    await assert.rejects(readCompletion({ ok: true, headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => { reading.abort(); throw new DOMException('Aborted', 'AbortError'); },
    }, reading.signal), { name: 'AbortError' });
});

test('data-only typed SSE events work and snapshot conflicts fail safely', async () => {
    const delta = { type: 'response.output_text.delta', output_index: 0, content_index: 0, delta: '哈' };
    const terminal = { type: 'response.completed', response: responsePayload('哈哈') };
    const body = `data: ${JSON.stringify(delta)}\n\ndata: ${JSON.stringify(delta)}\n\ndata: ${JSON.stringify(terminal)}`;
    assert.deepEqual(await readCompletion(new Response(body)), ['哈', '哈']);
    await assert.rejects(readCompletion(new Response(textDelta('前文') + completed('PRIVATE_DIFFERENT_TEXT'))), error => {
        assert.match(error.message, /不完整/);
        assert.doesNotMatch(error.message, /PRIVATE_/);
        return true;
    });
});

test('malformed SSE and JSON payloads fail without leaking body contents', async () => {
    for (const response of [
        new Response('event: response.completed\ndata: PRIVATE_BODY\n\n'),
        new Response('PRIVATE_BODY', { headers: { 'Content-Type': 'application/json' } }),
        Response.json(responsePayload('', { output: 'PRIVATE_BODY' })),
        Response.json(responsePayload('', { output: [null] })),
    ]) {
        await assert.rejects(readCompletion(response), error => {
            assert.match(error.message, /不完整|未返回.*答案/);
            assert.doesNotMatch(error.message, /PRIVATE_/);
            return true;
        });
    }
});
