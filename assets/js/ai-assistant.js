// =============================================
// AI 编程教练 - 练习场与 ACM 模拟 IDE 共用
// =============================================

const AI_STORAGE_KEY = 'z2l_ai_config';
const AI_DEFAULT_MODEL = 'poolside/laguna-s-2.1:free';
const AI_LEGACY_DYNAMIC_MODEL = 'openrouter/free';
const AI_CONTEXT_LIMITS = Object.freeze({
    problem: 10000,
    code: 18000,
    stdin: 4000,
    stdout: 6000,
    expected: 4000,
    status: 1200,
    user: 12000,
    response: 60000,
    history: 60000,
});

const AI_LANGUAGE_META = Object.freeze({
    python: { label: 'Python 3', fence: 'python' },
    go: { label: 'Go', fence: 'go' },
    java: { label: 'Java 17', fence: 'java' },
});

const SYSTEM_PROMPT = `你是一名面向算法初学者的编程教练。你会收到练习场或 ACM 模拟 IDE 的当前上下文，包括题目、代码、标准输入、程序输出、期望输出和运行状态中的一部分。

## 工作原则
1. 先理解用户当前的算法和输入输出约定，再回答问题。
2. 诊断时指出最核心的错误、解释原因，并给出可验证的修改。
3. 代码转换必须保持原算法语义、stdin 读取顺序、stdout 格式和边界行为，不得只翻译片段。
4. 转为 Java 时输出可直接提交的 Java 17 完整程序，入口必须是 public class Main。
5. 转为 Go 时输出可直接提交的完整程序，入口必须是 package main。
6. 不确定输入约束时明确说明假设，不擅自改变题意。

## 回复风格
- 默认使用中文，面向初学者解释必要的语言差异。
- 回复使用 Markdown，代码块标注当前语言或目标语言。
- 优先给出完整、可运行、可用现有样例验证的版本。
- 保持简洁，不用无关铺垫，也不只给出黑盒答案。`;

const LEETCODE_PYTHON_HARNESS = `【运行环境硬约束】
当前页面是本地力扣模拟，执行环境按 Python 3.6 兼容标准运行，仅接受题目原始模板定义的顶层函数。
如果回答中包含实现代码、修正版、补全代码或可写入编辑器的代码，只能输出兼容 Python 3.6 的代码，并使用 python 代码块；禁止输出 Java、Go、C++、JavaScript 或其他语言代码。
不支持 Python 3.7 及以上才提供的语法和标准库特性。函数签名中禁止使用 typing.Optional、Optional、List、Dict、Set、Tuple 等类型注解，禁止使用参数类型注解和 -> 返回值注解。
必须原样沿用下方【原始代码模板】中的函数名、参数列表、下划线命名及 ListNode、TreeNode 等运行环境约定；只替换模板中的 pass 或待实现函数体。不得输出 class Solution，不得把 snake_case 函数名改成 LeetCode 官方 camelCase 方法，也不得改成 ACM 的 stdin/stdout 完整程序。
即使用户只说“给出代码”“写代码”“给答案”等未指定语言的请求，也必须按上述模板返回兼容 Python 3.6 的实现。`;

const LEETCODE_JAVA_HARNESS = `【运行环境硬约束】
当前页面是本地力扣模拟，当前语言为 Java 17，使用 LeetCode 核心代码模式。
如果回答中包含实现代码、修正版、补全代码或可写入编辑器的代码，只能输出 Java 17 代码，并使用 java 代码块。
必须严格保留下方【原始代码模板】中的类名、方法名、参数类型和返回类型，只补全待实现部分。ListNode、TreeNode 等题目数据结构由运行环境提供。
不得输出 public class Main、main 方法、stdin/stdout 读取或 ACM 完整程序，也不得改写成 Python、Go 或其他语言。
即使用户只说“给出代码”“写代码”“给答案”等未指定语言的请求，也必须返回与当前 Java 17 核心代码模板兼容的实现。`;

const LEETCODE_GO_HARNESS = `【运行环境硬约束】
当前页面是本地力扣模拟，当前语言为 Go，使用 LeetCode 核心代码模式。
如果回答中包含实现代码、修正版、补全代码或可写入编辑器的代码，只能输出 Go 代码，并使用 go 代码块。
必须严格保留下方【原始代码模板】中的函数名、参数类型和返回类型，只补全待实现部分。ListNode、TreeNode 等题目数据结构由运行环境提供；需要标准库时可在函数前添加 import 声明。
不得输出 package main、main 函数、stdin/stdout 读取或 ACM 完整程序，也不得改写成 Python、Java 或其他语言。
即使用户只说“给出代码”“写代码”“给答案”等未指定语言的请求，也必须返回与当前 Go 核心代码模板兼容的实现。`;

const LEETCODE_HARNESSES = Object.freeze({
    python: LEETCODE_PYTHON_HARNESS,
    java: LEETCODE_JAVA_HARNESS,
    go: LEETCODE_GO_HARNESS,
});

const QUICK_ACTIONS = Object.freeze({
    'convert-java': {
        label: '转为 Java 17',
        prompt: '请把当前代码转换为可直接提交的 Java 17 ACM 完整程序。以当前 {sourceLanguage} 实现的算法语义为基准，严格保留 stdin 读取顺序、stdout 格式和边界行为。必须使用 public class Main，不能省略 import、输入解析、主函数或任何辅助方法。先给出完整 java 代码块，再用不超过 3 点说明关键语法转换。',
    },
    'convert-go': {
        label: '转为 Go',
        prompt: '请把当前代码转换为可直接提交的 Go ACM 完整程序。以当前 {sourceLanguage} 实现的算法语义为基准，严格保留 stdin 读取顺序、stdout 格式和边界行为。必须使用 package main，不能省略 import、输入解析、main 函数或任何辅助函数。先给出完整 go 代码块，再用不超过 3 点说明关键语法转换。',
    },
    'check-code': {
        label: '检查代码',
        prompt: '请检查当前代码的正确性，优先指出会导致编译失败、运行错误或答案错误的问题，并结合当前样例给出修改。',
    },
    'explain-error': {
        label: '分析报错',
        prompt: '请结合当前代码、运行状态和 stdout 分析报错。先定位根因，再给出最小修改和可验证的修正版。',
    },
    'explain-code': {
        label: '解释思路',
        prompt: '请用初学者能理解的方式解释当前代码的算法思路、关键变量和时间空间复杂度。',
    },
    'generate-tests': {
        label: '补充样例',
        prompt: '请根据当前代码的输入格式补充有区分度的 ACM 测试样例，包含 stdin、expected stdout，以及每个样例覆盖的边界情况。',
    },
    'give-hint': {
        label: '给个提示',
        prompt: '这道题给我一个思路提示，不要直接给答案。',
    },
    'explain-problem': {
        label: '解释题目',
        prompt: '用通俗的方式解释一下这道题目要求。',
    },
    'optimize': {
        label: '优化代码',
        prompt: '我的代码能通过，但想知道有没有更好的写法。',
    },
    'give-code': {
        label: '给我代码',
        prompt: '请直接给出这道题完整、可运行、可写入当前编辑器的 {sourceLanguage} 核心代码。严格沿用【原始代码模板】的签名和数据结构约定，只补全待实现部分。只输出 {sourceFence} 代码块，再用不超过 3 点说明关键思路。',
    },
});

// Free 模型专用 key。它只用于默认体验，Base64 不是安全存储。
const _k = [
    'c2stb3ItdjEtMDk1',
    'MGEzNDk1ODE1OGJh',
    'M2E3MmNjZWMwNzEy',
    'NDY2MjA5NWRjY2E0',
    'ODI3YWJiM2E0NmQx',
    'ZWZmZTdiMTUwZWNjMw==',
];

function _dk() {
    try { return atob(_k.join('')); } catch (error) { return ''; }
}

const AI_ICON_SVG = `
<img class="ai-brand-icon" src="assets/images/ai-assistant-logo.svg" width="18" height="18" alt="" aria-hidden="true">`;

const AI_WELCOME_ICON_SVG = `
<img class="ai-brand-icon ai-brand-icon-large" src="assets/images/ai-assistant-logo.svg" width="64" height="64" alt="" aria-hidden="true">`;

const AI_USER_ICON_SVG = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M20 21a8 8 0 0 0-16 0" />
    <circle cx="12" cy="7" r="4" />
</svg>`;

const AI_SEND_ICON_SVG = `
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M22 2 11 13" />
    <path d="m22 2-7 20-4-9-9-4Z" />
</svg>`;

const AI_STOP_ICON_SVG = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="1.5" />
</svg>`;

function getDocument() {
    return typeof document !== 'undefined' ? document : null;
}

function getWindow() {
    return typeof window !== 'undefined' ? window : null;
}

function getNavigator() {
    return typeof navigator !== 'undefined' ? navigator : null;
}

function getStorage() {
    return typeof localStorage !== 'undefined' ? localStorage : null;
}

let sessionAIConfig = null;

function normalizeConfiguredModel(model) {
    const value = String(model || '').trim();
    return !value || value === AI_LEGACY_DYNAMIC_MODEL ? AI_DEFAULT_MODEL : value;
}

function loadAIConfig() {
    if (sessionAIConfig) return { ...sessionAIConfig };
    const defaults = {
        baseUrl: 'https://openrouter.ai/api/v1',
        apiKey: _dk(),
        model: AI_DEFAULT_MODEL,
    };
    try {
        const storage = getStorage();
        const saved = storage?.getItem(AI_STORAGE_KEY);
        if (!saved) return defaults;
        const parsed = JSON.parse(saved);
        const config = {
            baseUrl: String(parsed.baseUrl || defaults.baseUrl),
            apiKey: String(parsed.apiKey || ''),
            model: normalizeConfiguredModel(parsed.model),
        };
        if (parsed.model === AI_LEGACY_DYNAMIC_MODEL) {
            try { storage.setItem(AI_STORAGE_KEY, JSON.stringify(config)); } catch (error) { /* session config still works */ }
        }
        return config;
    } catch (error) {
        return defaults;
    }
}

function saveAIConfig(config) {
    const normalizedConfig = {
        ...config,
        model: normalizeConfiguredModel(config?.model),
    };
    sessionAIConfig = normalizedConfig;
    try {
        const storage = getStorage();
        if (!storage) return false;
        storage.setItem(AI_STORAGE_KEY, JSON.stringify(normalizedConfig));
        return true;
    } catch (error) {
        return false;
    }
}

let chatHistory = [];

function clearChatHistory() {
    chatHistory = [];
}

function clipText(value, maximum) {
    const text = String(value ?? '');
    if (maximum <= 0) return '';
    if (text.length <= maximum) return text;
    const marker = `\n... 已截断 ${text.length - maximum} 个字符 ...\n`;
    if (marker.length >= maximum) return text.slice(0, maximum);
    const remaining = Math.max(0, maximum - marker.length);
    const headLength = Math.ceil(remaining * 0.72);
    return text.slice(0, headLength) + marker + text.slice(text.length - (remaining - headLength));
}

function markdownCodeBlock(code, language) {
    const runs = String(code).match(/`+/g) || [];
    const longestRun = runs.reduce((longest, run) => Math.max(longest, run.length), 2);
    const fence = '`'.repeat(Math.max(3, longestRun + 1));
    return `${fence}${language}\n${code}\n${fence}`;
}

function normalizeGeneratedCodeLanguage(language) {
    const value = String(language || '')
        .trim()
        .toLowerCase()
        .replace(/^language-/, '');
    const aliases = {
        py: 'python',
        python: 'python',
        python3: 'python',
        go: 'go',
        golang: 'go',
        java: 'java',
        java17: 'java',
        'java-17': 'java',
    };
    return aliases[value] || '';
}

function getGeneratedCodeLanguage(codeElement) {
    const classes = String(codeElement?.className || '').split(/\s+/);
    const languageClass = classes.find((className) => /^language-/i.test(className));
    return normalizeGeneratedCodeLanguage(languageClass || '');
}

function extractPythonCode(content) {
    const text = String(content || '');
    const blocks = Array.from(text.matchAll(/```\s*(?:python|py|python3)?\s*\n([\s\S]*?)```/gi));
    return blocks.length ? blocks.map((match) => match[1]).join('\n') : '';
}

function parseTopLevelFunctionSignature(source) {
    const match = String(source || '').match(/^def\s+([A-Za-z_]\w*)\s*\((.*)\)\s*(->\s*[^:]+)?\s*:/m);
    if (!match) return null;
    const parameters = match[2].split(',').map((parameter) => parameter.trim()).filter(Boolean);
    const hasAnnotation = Boolean(match[3]) || parameters.some((parameter) => {
        const equalIndex = parameter.indexOf('=');
        const declaration = equalIndex >= 0 ? parameter.slice(0, equalIndex) : parameter;
        return declaration.includes(':');
    });
    return {
        name: match[1],
        parameters: parameters.map((parameter) => parameter.split('=')[0].split(':')[0].trim()),
        hasAnnotation,
    };
}

function validateAssistantResponse(content, expectedLanguage = '', expectedTemplate = '', expectedSurface = 'acm') {
    const text = String(content || '').trim();
    if (!text) return { valid: false, message: 'AI 服务未返回内容，请重试。' };
    if (/^user\s+safety\s*:\s*(?:safe|unsafe)[.!]?$/i.test(text)) {
        return { valid: false, message: 'AI 服务返回了安全分类结果，没有生成代码，请重试。' };
    }

    const language = normalizeGeneratedCodeLanguage(expectedLanguage);
    if (language === 'python') {
        const foreignFence = /```\s*(?:java(?:17)?|go(?:lang)?|cpp|c\+\+|javascript|typescript|js|ts)\b/i.test(text);
        const foreignSyntax = /\bpublic\s+(?:final\s+)?class\s+\w+\b|^\s*package\s+main\b/m.test(text);
        const pythonCode = extractPythonCode(text);
        const incompatibleLeetCodeShape = /^\s*class\s+Solution\s*(?:\([^\n)]*\))?\s*:/m.test(pythonCode);
        const generatedSignature = parseTopLevelFunctionSignature(pythonCode);
        const templateSignature = parseTopLevelFunctionSignature(expectedTemplate);
        const incompatibleSyntax = /:=|^\s*match\s+.+:\s*$|^\s*case\s+.+:\s*$/m.test(pythonCode);
        if (foreignFence || foreignSyntax) {
            return { valid: false, message: '本地力扣模拟仅支持 Python 3.6，AI 返回了其他语言代码，请重试。' };
        }
        const signatureMismatch = generatedSignature && templateSignature && (
            generatedSignature.name !== templateSignature.name ||
            generatedSignature.parameters.join('\u0000') !== templateSignature.parameters.join('\u0000')
        );
        if (incompatibleLeetCodeShape || generatedSignature?.hasAnnotation || signatureMismatch || incompatibleSyntax) {
            return { valid: false, message: 'AI 返回的代码不符合本地力扣模拟的 Python 3.6 原始函数模板，请重试。' };
        }
    }
    if (language === 'java') {
        if (expectedSurface === 'leetcode') {
            const expectedClass = String(expectedTemplate).match(/^class\s+([A-Za-z_]\w*)\b/m)?.[1] || 'Solution';
            const hasExpectedClass = new RegExp(`^\\s*class\\s+${expectedClass}\\b`, 'm').test(text);
            if (!hasExpectedClass || /\bpublic\s+(?:final\s+)?class\s+Main\b/.test(text)) {
                return { valid: false, message: 'AI 返回的代码不符合当前 Java 17 核心代码模板，请重试。' };
            }
        } else if (!/\bpublic\s+(?:final\s+)?class\s+Main\b/.test(text)) {
            return { valid: false, message: 'AI 没有返回完整的 Java 17 Main 程序，请重试。' };
        }
    }
    if (language === 'go') {
        if (expectedSurface === 'leetcode') {
            const expectedFunction = String(expectedTemplate).match(/^func\s+([A-Za-z_]\w*)\s*\(/m)?.[1] || '';
            const expectedType = String(expectedTemplate).match(/^type\s+([A-Za-z_]\w*)\s+struct\b/m)?.[1] || '';
            const hasExpectedShape = expectedFunction
                ? new RegExp(`^\\s*func\\s+${expectedFunction}\\s*\\(`, 'm').test(text)
                : Boolean(expectedType && new RegExp(`^\\s*type\\s+${expectedType}\\s+struct\\b`, 'm').test(text));
            if (!hasExpectedShape || /^\s*package\s+main\b/m.test(text) || /^\s*func\s+main\s*\(/m.test(text)) {
                return { valid: false, message: 'AI 返回的代码不符合当前 Go 核心代码模板，请重试。' };
            }
        } else if (!/^\s*package\s+main\b/m.test(text)) {
            return { valid: false, message: 'AI 没有返回完整的 Go main 程序，请重试。' };
        }
    }
    return { valid: true, message: '' };
}

function resolveExpectedResponseLanguage(userMessage, context = {}, explicitLanguage = '') {
    if (explicitLanguage) return normalizeGeneratedCodeLanguage(explicitLanguage) || explicitLanguage;
    if (context.surface !== 'leetcode') return '';

    const request = String(userMessage || '').trim();
    const rejectsDirectCode = /(?:不要|不用|无需|别)\s*(?:直接)?\s*(?:给|写|输出|提供|生成)?[^。！？\n]{0,8}(?:代码|答案|实现)/.test(request);
    if (rejectsDirectCode) return '';

    const requestsCode = /(?:给我|给出|提供|输出|生成|写出|写一份|写一个|补全|完成|改写|重写|修复|修改)[^。！？\n]{0,16}(?:代码|函数|实现|程序)|(?:完整|可运行|可提交|修正后|正确的)[^。！？\n]{0,8}(?:代码|实现|程序)/.test(request);
    return requestsCode ? normalizeGeneratedCodeLanguage(context.language) || 'python' : '';
}

function readElementValue(doc, id) {
    const element = doc?.getElementById(id);
    if (!element) return '';
    if (typeof element.value === 'string') return element.value;
    return element.textContent || '';
}

function readEditorValue(win, doc, preferAcm) {
    const editors = preferAcm
        ? [win?.acmEditor, win?.editor]
        : [win?.editor, win?.acmEditor];
    for (const editor of editors) {
        if (editor && typeof editor.getValue === 'function') return editor.getValue();
    }
    const codeMirrorElement = doc?.querySelector('.CodeMirror');
    return codeMirrorElement?.CodeMirror?.getValue?.() || '';
}

function htmlToPlainText(html, doc) {
    if (!html) return '';
    if (!doc?.createElement) return String(html).replace(/<[^>]*>/g, ' ');
    const container = doc.createElement('div');
    container.innerHTML = String(html);
    return container.textContent || container.innerText || '';
}

function isAcmSurface(doc = getDocument()) {
    return doc?.body?.dataset?.aiSurface === 'acm';
}

function collectAssistantContext() {
    const doc = getDocument();
    const win = getWindow();
    const acm = isAcmSurface(doc);

    if (acm) {
        const languageSelect = doc?.getElementById('language-select');
        const language = AI_LANGUAGE_META[languageSelect?.value] ? languageSelect.value : 'python';
        const stdoutElement = doc?.getElementById('stdout-area');
        const stdoutText = stdoutElement?.textContent || '';
        const stdoutIsPlaceholder = stdoutElement?.classList?.contains('placeholder-text') ||
            stdoutText.startsWith('点击「运行」') || stdoutText.trim() === '(无输出)';
        const stdout = stdoutIsPlaceholder ? '' : stdoutText;
        const statuses = [
            readElementValue(doc, 'run-status'),
            readElementValue(doc, 'status-info'),
            readElementValue(doc, 'diff-result'),
        ].map((item) => item.trim()).filter(Boolean);

        return {
            surface: 'acm',
            language,
            languageLabel: AI_LANGUAGE_META[language].label,
            code: readEditorValue(win, doc, true),
            stdin: readElementValue(doc, 'stdin-area'),
            stdout,
            expected: readElementValue(doc, 'expected-area'),
            status: Array.from(new Set(statuses)).join(' · '),
        };
    }

    let problemTitle = '';
    let problem = '';
    if (win?.currentProblem) {
        problemTitle = win.currentProblem.title || '';
        problem = htmlToPlainText(win.currentProblem.description || '', doc);
    } else {
        problem = readElementValue(doc, 'problem-description');
        const select = doc?.getElementById('problem-select');
        problemTitle = select?.selectedIndex >= 0
            ? (select.options?.[select.selectedIndex]?.text || '')
            : '';
    }

    const code = readEditorValue(win, doc, false);
    const languageContext = typeof win?.leetcodeGetLanguageContext === 'function'
        ? win.leetcodeGetLanguageContext()
        : { language: 'python', languageLabel: 'Python 3', template: win?.currentProblem?.template || '' };
    const language = AI_LANGUAGE_META[languageContext?.language] ? languageContext.language : 'python';
    const template = String(languageContext?.template || win?.currentProblem?.template || '');
    return {
        surface: 'leetcode',
        language,
        languageLabel: AI_LANGUAGE_META[language].label,
        problemTitle,
        problem,
        template,
        code: code === template ? '' : code,
    };
}

function normalizeContext(context) {
    const language = AI_LANGUAGE_META[context?.language] ? context.language : 'python';
    return {
        surface: context?.surface === 'acm' ? 'acm' : 'leetcode',
        language,
        languageLabel: String(context?.languageLabel || AI_LANGUAGE_META[language].label),
        problemTitle: String(context?.problemTitle || ''),
        problem: String(context?.problem || ''),
        template: String(context?.template || ''),
        code: String(context?.code || ''),
        stdin: String(context?.stdin || ''),
        stdout: String(context?.stdout || ''),
        expected: String(context?.expected || ''),
        status: String(context?.status || ''),
    };
}

function buildContextMessage(userMessage, contextOverride = null) {
    const context = normalizeContext(contextOverride || collectAssistantContext());
    const parts = [];

    if (context.surface === 'acm') {
        parts.push(`【ACM 环境】\n当前语言：${context.languageLabel}\n请保持现有标准输入与标准输出协议。`);
    } else {
        parts.push(LEETCODE_HARNESSES[context.language] || LEETCODE_PYTHON_HARNESS);
    }

    const problem = clipText(context.problem.trim(), AI_CONTEXT_LIMITS.problem);
    if (problem) {
        parts.push(`【当前题目】\n${context.problemTitle.trim()}\n${problem}`.trim());
    }

    if (context.surface === 'leetcode') {
        const template = clipText(context.template.trim(), AI_CONTEXT_LIMITS.code);
        if (template) {
            parts.push(`【原始代码模板】\n必须保留以下签名，只替换待实现部分：\n${markdownCodeBlock(template, AI_LANGUAGE_META[context.language].fence)}`);
        }
    }

    const code = clipText(context.code.trim(), AI_CONTEXT_LIMITS.code);
    if (code) {
        parts.push(`【当前代码】\n${markdownCodeBlock(code, AI_LANGUAGE_META[context.language].fence)}`);
    }

    if (context.surface === 'acm') {
        const stdin = clipText(context.stdin, AI_CONTEXT_LIMITS.stdin);
        const stdout = clipText(context.stdout, AI_CONTEXT_LIMITS.stdout);
        const expected = clipText(context.expected, AI_CONTEXT_LIMITS.expected);
        const status = clipText(context.status, AI_CONTEXT_LIMITS.status);
        if (stdin.trim()) parts.push(`【标准输入 stdin】\n${stdin}`);
        if (stdout.trim()) parts.push(`【最近输出 stdout】\n${stdout}`);
        if (expected.trim()) parts.push(`【期望输出 expected】\n${expected}`);
        if (status.trim()) parts.push(`【运行状态】\n${status}`);
    }

    const boundedUserMessage = clipText(userMessage, AI_CONTEXT_LIMITS.user);
    if (parts.length === 0) return boundedUserMessage;
    return `${parts.join('\n\n')}\n\n【用户提问】\n${boundedUserMessage}`;
}

function summarizeContext(contextOverride = null) {
    const context = normalizeContext(contextOverride || collectAssistantContext());
    const labels = [context.languageLabel];
    if (context.code.trim()) labels.push('代码');
    if (context.surface === 'acm') {
        if (context.stdin.trim()) labels.push('stdin');
        if (context.stdout.trim()) labels.push('输出');
        if (context.expected.trim()) labels.push('期望输出');
    } else if (context.problem.trim()) {
        labels.push('题目');
    }
    return labels.join(' · ');
}

function boundedHistory(history) {
    const selected = [];
    let total = 0;
    for (let index = history.length - 1; index >= 0 && selected.length < 10; index -= 1) {
        const item = history[index];
        const remaining = AI_CONTEXT_LIMITS.history - total;
        if (remaining <= 0) break;
        const originalContent = String(item.content || '');
        const content = clipText(originalContent, remaining);
        selected.unshift({ ...item, content });
        total += content.length;
        if (content.length < originalContent.length) break;
    }
    return selected;
}

function getQuickActionPrompt(action, contextOverride = null) {
    const quickAction = QUICK_ACTIONS[action];
    if (!quickAction) return '';
    const context = normalizeContext(contextOverride || collectAssistantContext());
    const sourceLanguage = context.surface === 'leetcode' && context.language === 'python'
        ? 'Python 3.6'
        : context.languageLabel;
    return quickAction.prompt
        .replaceAll('{sourceLanguage}', sourceLanguage)
        .replaceAll('{sourceFence}', AI_LANGUAGE_META[context.language].fence);
}

function parseSseLine(line) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) return null;
    const data = trimmed.slice(5).trim();
    if (!data) return null;
    if (data === '[DONE]') return { done: true, delta: '' };
    try {
        const parsed = JSON.parse(data);
        return { done: false, delta: parsed.choices?.[0]?.delta?.content || '' };
    } catch (error) {
        return null;
    }
}

function isRetryableAIError(error) {
    const message = String(error?.message || '');
    return /API 请求失败 \((?:408|429|5\d\d)\)|Failed to fetch|NetworkError|网络/i.test(message);
}

async function* streamChatCompletion(messages, config, signal) {
    const url = `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
            model: config.model,
            messages,
            stream: true,
        }),
        signal,
    });

    if (!response.ok) {
        const errorText = clipText(await response.text(), 2000);
        throw new Error(`API 请求失败 (${response.status}): ${errorText}`);
    }
    if (!response.body) throw new Error('AI 服务未返回可读取的响应流');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                const event = parseSseLine(line);
                if (event?.done) return;
                if (event?.delta) yield event.delta;
            }
        }

        buffer += decoder.decode();
        for (const line of buffer.split('\n')) {
            const event = parseSseLine(line);
            if (event?.done) return;
            if (event?.delta) yield event.delta;
        }
    } finally {
        try { await reader.cancel(); } catch (error) { /* already closed or aborted */ }
        try { reader.releaseLock(); } catch (error) { /* already released */ }
    }
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function sanitizeMarkdownHtml(html, doc = getDocument()) {
    if (!doc?.createElement) return escapeHtml(html);
    const template = doc.createElement('template');
    template.innerHTML = String(html);
    const allowedTags = new Set([
        'A', 'BLOCKQUOTE', 'BR', 'CODE', 'DEL', 'EM', 'H1', 'H2', 'H3', 'H4',
        'HR', 'LI', 'OL', 'P', 'PRE', 'STRONG', 'TABLE', 'TBODY', 'TD', 'TH',
        'THEAD', 'TR', 'UL',
    ]);
    const dangerousTags = new Set([
        'BASE', 'BUTTON', 'EMBED', 'FORM', 'IFRAME', 'INPUT', 'LINK', 'MATH',
        'META', 'OBJECT', 'SCRIPT', 'SELECT', 'STYLE', 'SVG', 'TEXTAREA', 'VIDEO',
    ]);
    const root = template.content || template;
    const elements = Array.from(root.querySelectorAll('*'));

    for (const element of elements) {
        if (!allowedTags.has(element.tagName)) {
            if (dangerousTags.has(element.tagName)) {
                element.remove();
            } else {
                element.replaceWith(...Array.from(element.childNodes));
            }
            continue;
        }

        for (const attribute of Array.from(element.attributes)) {
            const keepHref = element.tagName === 'A' && attribute.name === 'href';
            const keepTitle = element.tagName === 'A' && attribute.name === 'title';
            const keepCodeClass = element.tagName === 'CODE' && attribute.name === 'class' &&
                /^language-[a-z0-9_+-]+$/i.test(attribute.value);
            if (!keepHref && !keepTitle && !keepCodeClass) element.removeAttribute(attribute.name);
        }

        if (element.tagName === 'A') {
            const href = element.getAttribute('href') || '';
            const safeHref = /^(https?:|mailto:|#|\/)/i.test(href);
            if (!safeHref) element.removeAttribute('href');
            if (element.hasAttribute('href')) {
                element.setAttribute('target', '_blank');
                element.setAttribute('rel', 'noopener noreferrer');
            }
        }
    }
    return template.innerHTML;
}

async function copyTextToClipboard(text, nav = getNavigator(), doc = getDocument()) {
    const value = String(text ?? '');
    try {
        if (typeof nav?.clipboard?.writeText === 'function') {
            await nav.clipboard.writeText(value);
            return true;
        }
    } catch (error) {
        // Fall back for denied clipboard permissions and non-secure origins.
    }

    if (!doc?.body || typeof doc.createElement !== 'function' || typeof doc.execCommand !== 'function') {
        return false;
    }
    const previousFocus = doc.activeElement;
    const textarea = doc.createElement('textarea');
    textarea.value = value;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.inset = '0 auto auto -9999px';
    textarea.style.opacity = '0';
    doc.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange?.(0, value.length);
    let copied = false;
    try {
        copied = doc.execCommand('copy') === true;
    } catch (error) {
        copied = false;
    }
    textarea.remove();
    previousFocus?.focus?.();
    return copied;
}

function decorateAssistantCodeBlocks(container, options = {}) {
    if (!container?.querySelectorAll) return 0;
    const doc = container.ownerDocument || getDocument();
    const surface = options.surface === 'acm' ? 'acm' : 'leetcode';
    const allowApply = options.allowApply !== false;
    let decoratedCount = 0;

    for (const codeElement of Array.from(container.querySelectorAll('pre > code'))) {
        const pre = codeElement.parentElement;
        if (!pre?.parentNode || pre.parentElement?.classList?.contains('ai-code-block')) continue;

        const language = getGeneratedCodeLanguage(codeElement);
        const languageClass = String(codeElement.className || '')
            .split(/\s+/)
            .find((className) => /^language-/i.test(className)) || '';
        const rawLanguage = languageClass.replace(/^language-/i, '');
        const languageLabel = AI_LANGUAGE_META[language]?.label || rawLanguage || '代码';
        const supportsLanguage = Boolean(AI_LANGUAGE_META[language]);

        const block = doc.createElement('div');
        block.className = 'ai-code-block';
        block.dataset.aiCodeLanguage = language;

        const toolbar = doc.createElement('div');
        toolbar.className = 'ai-code-toolbar';

        const label = doc.createElement('span');
        label.className = 'ai-code-language';
        label.textContent = languageLabel;

        const actions = doc.createElement('div');
        actions.className = 'ai-code-actions';

        const copyButton = doc.createElement('button');
        copyButton.type = 'button';
        copyButton.className = 'ai-code-action';
        copyButton.dataset.aiCodeAction = 'copy';
        copyButton.textContent = '复制';
        copyButton.setAttribute('aria-label', `复制 ${languageLabel} 代码`);

        const applyButton = doc.createElement('button');
        applyButton.type = 'button';
        applyButton.className = 'ai-code-action ai-code-action-apply';
        applyButton.dataset.aiCodeAction = 'apply';
        applyButton.textContent = '写入编辑器';
        applyButton.setAttribute('aria-label', `将 ${languageLabel} 代码写入编辑器`);
        applyButton.disabled = !allowApply || !supportsLanguage;
        if (!allowApply) {
            applyButton.title = '回复未完整生成，仅可复制';
        } else if (!language) {
            applyButton.title = '代码块未标注支持的语言';
        } else if (!supportsLanguage) {
            applyButton.title = '当前编辑器不支持这种语言';
        }

        actions.append(copyButton, applyButton);
        toolbar.append(label, actions);
        pre.parentNode.insertBefore(block, pre);
        block.append(toolbar, pre);
        decoratedCount += 1;
    }
    return decoratedCount;
}

class AIAssistant {
    constructor() {
        this.isOpen = false;
        this.isConfigOpen = false;
        this.isStreaming = false;
        this.discardCurrentResponse = false;
        this.abortController = null;
        this.lastFocus = null;
        this.configReturnFocus = null;
        this.contextObserver = null;
        this.init();
    }

    init() {
        const doc = getDocument();
        this.fab = doc?.getElementById('ai-fab');
        this.panel = doc?.getElementById('ai-panel');
        this.overlay = doc?.getElementById('ai-overlay');
        this.messagesEl = doc?.getElementById('ai-messages');
        this.inputEl = doc?.getElementById('ai-input');
        this.sendBtn = doc?.getElementById('ai-send-btn');
        this.closeBtn = doc?.getElementById('ai-close-btn');
        this.configBtn = doc?.getElementById('ai-config-btn');
        this.clearBtn = doc?.getElementById('ai-clear-btn');
        this.configModal = doc?.getElementById('ai-config-modal');
        this.quickActions = doc?.getElementById('ai-quick-actions');
        this.contextSummary = doc?.getElementById('ai-context-summary');
        this.liveStatus = doc?.getElementById('ai-live-status');
        this.isAcm = isAcmSurface(doc);
        this.overlayMode = false;

        const required = [this.fab, this.panel, this.messagesEl, this.inputEl, this.sendBtn];
        if (required.some((element) => !element)) return;

        this.prepareAccessibility();
        this.prepareActionStatus();
        this.bindEvents();
        this.bindContextUpdates();
        this.showWelcome();
        this.updateContextSummary();
    }

    prepareAccessibility() {
        const title = this.panel.querySelector('.ai-panel-title');
        if (title && !title.id) title.id = 'ai-panel-title-generated';
        if (title) this.panel.setAttribute('aria-labelledby', title.id);
        this.panel.setAttribute('aria-hidden', 'true');
        this.panel.inert = true;
        this.fab.setAttribute('aria-controls', this.panel.id);
        this.fab.setAttribute('aria-expanded', 'false');
        this.overlay?.setAttribute('aria-hidden', 'true');
        this.messagesEl.setAttribute('role', 'log');
        this.messagesEl.setAttribute('aria-live', 'polite');
        this.messagesEl.setAttribute('aria-relevant', 'additions');
        this.inputEl.setAttribute('aria-label', this.inputEl.getAttribute('aria-label') || '向 AI 教练提问');
        this.sendBtn.setAttribute('aria-label', '发送消息');
        if (this.configModal) {
            const configTitle = this.configModal.querySelector('h1, h2, h3, h4');
            if (configTitle && !configTitle.id) configTitle.id = 'ai-config-title-generated';
            if (configTitle) this.configModal.setAttribute('aria-labelledby', configTitle.id);
            this.configModal.setAttribute('role', 'dialog');
            this.configModal.setAttribute('aria-modal', 'true');
            this.configModal.setAttribute('aria-hidden', 'true');
            this.configModal.inert = true;
        }
        this.overlayMode = this.isOverlayMode();
        this.syncPanelSemantics();
    }

    prepareActionStatus() {
        if (this.liveStatus) {
            this.actionStatus = this.liveStatus;
            return;
        }
        const status = getDocument().createElement('div');
        status.className = 'ai-live-status ai-action-status';
        status.setAttribute('role', 'status');
        status.setAttribute('aria-live', 'polite');
        status.setAttribute('aria-atomic', 'true');
        this.panel.appendChild(status);
        this.actionStatus = status;
    }

    bindEvents() {
        this.fab.addEventListener('click', () => this.toggle());
        this.closeBtn?.addEventListener('click', () => this.close());
        this.overlay?.addEventListener('click', () => this.close());
        this.sendBtn.addEventListener('click', () => {
            if (this.isStreaming) this.stopStreaming();
            else this.send();
        });
        this.configBtn?.addEventListener('click', () => this.openConfig());
        this.clearBtn?.addEventListener('click', () => this.clearChat());

        this.inputEl.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.send();
            }
        });
        this.inputEl.addEventListener('input', () => this.resizeInput());

        this.quickActions?.addEventListener('click', (event) => {
            const button = event.target.closest('.ai-quick-btn');
            if (button) this.handleQuickAction(button.dataset.action);
        });
        this.messagesEl.addEventListener('click', (event) => this.handleCodeBlockAction(event));

        getDocument()?.getElementById('ai-config-save')?.addEventListener('click', () => this.saveConfig());
        getDocument()?.getElementById('ai-config-cancel')?.addEventListener('click', () => this.closeConfig());
        this.configModal?.addEventListener('click', (event) => {
            if (event.target === this.configModal) this.closeConfig();
        });
        getDocument()?.addEventListener('keydown', (event) => this.handleDocumentKeydown(event));
        getWindow()?.addEventListener('resize', () => {
            const previousOverlayMode = this.overlayMode;
            this.overlayMode = this.isOverlayMode();
            this.syncPanelSemantics();
            this.syncBackgroundInert();
            this.refreshEditor();
            if (this.isOpen && !previousOverlayMode && this.overlayMode &&
                !this.panel.contains(getDocument()?.activeElement)) {
                this.inputEl.focus();
            }
        });
    }

    bindContextUpdates() {
        if (!this.isAcm) return;
        const update = () => this.updateContextSummary();
        for (const id of ['language-select', 'stdin-area', 'expected-area']) {
            const element = getDocument()?.getElementById(id);
            element?.addEventListener('input', update);
            element?.addEventListener('change', update);
        }
        getWindow()?.acmEditor?.on?.('change', update);

        if (typeof MutationObserver !== 'undefined') {
            this.contextObserver = new MutationObserver(update);
            for (const id of ['stdout-area', 'run-status', 'status-info', 'diff-result']) {
                const element = getDocument()?.getElementById(id);
                if (element) this.contextObserver.observe(element, { childList: true, characterData: true, subtree: true });
            }
        }
    }

    resizeInput() {
        this.inputEl.style.height = 'auto';
        this.inputEl.style.height = `${Math.min(this.inputEl.scrollHeight, 120)}px`;
    }

    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }

    open() {
        if (this.isOpen) return;
        this.lastFocus = getDocument()?.activeElement || this.fab;
        this.isOpen = true;
        this.panel.inert = false;
        this.panel.classList.add('open');
        this.overlay?.classList.add('visible');
        this.fab.classList.add('active');
        this.fab.setAttribute('aria-expanded', 'true');
        this.panel.setAttribute('aria-hidden', 'false');
        this.overlay?.setAttribute('aria-hidden', 'false');
        getDocument()?.body?.classList.add('ai-open');
        this.syncPanelSemantics();
        this.syncBackgroundInert();
        this.updateContextSummary();
        this.refreshEditor();

        const config = loadAIConfig();
        if (!config.apiKey) this.openConfig();
        else getWindow()?.requestAnimationFrame?.(() => this.inputEl.focus());
    }

    close() {
        if (!this.isOpen) return;
        if (this.isConfigOpen) this.closeConfig({ restoreFocus: false });
        if (this.isStreaming) this.stopStreaming();
        const returnTarget = this.lastFocus?.isConnected ? this.lastFocus : this.fab;
        this.setPageInert(false);
        returnTarget?.focus?.();
        this.isOpen = false;
        this.panel.classList.remove('open');
        this.overlay?.classList.remove('visible');
        this.fab.classList.remove('active');
        this.fab.setAttribute('aria-expanded', 'false');
        this.panel.setAttribute('aria-hidden', 'true');
        this.overlay?.setAttribute('aria-hidden', 'true');
        getDocument()?.body?.classList.remove('ai-open');
        this.syncBackgroundInert();
        this.refreshEditor();
    }

    isOverlayMode() {
        const query = this.isAcm ? '(max-width: 1199px)' : '(max-width: 768px)';
        return Boolean(getWindow()?.matchMedia?.(query).matches);
    }

    syncPanelSemantics() {
        if (!this.panel) return;
        if (this.isOverlayMode()) {
            this.panel.setAttribute('role', 'dialog');
            this.panel.setAttribute('aria-modal', 'true');
        } else {
            this.panel.setAttribute('role', 'complementary');
            this.panel.removeAttribute('aria-modal');
        }
    }

    getBackgroundSelectors() {
        return this.isAcm
            ? ['.navbar', '.acm-main']
            : ['.navbar', '.playground-toolbar', '.panel-problem', '.panel-right', '#ai-fab'];
    }

    setPageInert(value) {
        const doc = getDocument();
        if (!doc) return;
        for (const selector of this.getBackgroundSelectors()) {
            const element = doc.querySelector(selector);
            if (element) element.inert = value;
        }
    }

    syncBackgroundInert() {
        const shouldInertPage = this.isConfigOpen || (this.isOpen && this.isOverlayMode());
        this.setPageInert(shouldInertPage);
        if (this.panel) this.panel.inert = !this.isOpen || this.isConfigOpen;
    }

    refreshEditor() {
        const refresh = () => {
            const editor = this.isAcm ? getWindow()?.acmEditor : getWindow()?.editor;
            editor?.refresh?.();
        };
        getWindow()?.requestAnimationFrame?.(refresh);
        getWindow()?.setTimeout?.(refresh, 240);
    }

    openConfig() {
        if (!this.configModal) return;
        const config = loadAIConfig();
        const doc = getDocument();
        doc.getElementById('ai-cfg-base-url').value = config.baseUrl;
        doc.getElementById('ai-cfg-api-key').value = config.apiKey;
        doc.getElementById('ai-cfg-model').value = config.model;
        this.configReturnFocus = this.isOpen
            ? (this.configBtn || this.inputEl)
            : (doc.activeElement || this.fab);
        this.isConfigOpen = true;
        this.configModal.inert = false;
        this.configModal.classList.add('open');
        this.configModal.setAttribute('aria-hidden', 'false');
        doc.getElementById('ai-cfg-base-url')?.focus();
        this.syncBackgroundInert();
    }

    closeConfig(options = {}) {
        if (!this.configModal || !this.isConfigOpen) return;
        this.isConfigOpen = false;
        this.syncBackgroundInert();
        const preferredTarget = this.configReturnFocus?.isConnected
            ? this.configReturnFocus
            : this.inputEl;
        const target = options.restoreFocus === false ? this.inputEl : preferredTarget;
        target?.focus?.();
        this.configModal.classList.remove('open');
        this.configModal.setAttribute('aria-hidden', 'true');
        this.configModal.inert = true;
    }

    saveConfig() {
        const doc = getDocument();
        const config = {
            baseUrl: doc.getElementById('ai-cfg-base-url').value.trim() || 'https://openrouter.ai/api/v1',
            apiKey: doc.getElementById('ai-cfg-api-key').value.trim(),
            model: doc.getElementById('ai-cfg-model').value.trim() || AI_DEFAULT_MODEL,
        };
        if (!config.apiKey) {
            doc.getElementById('ai-cfg-api-key').focus();
            return;
        }
        const persisted = saveAIConfig(config);
        this.closeConfig();
        this.addSystemMessage(persisted
            ? 'AI 服务配置已保存'
            : '配置仅在当前页面生效，浏览器未允许本地保存');
    }

    handleDocumentKeydown(event) {
        const nativeDialog = getDocument()?.querySelector('dialog[open]');
        if (nativeDialog?.contains(getDocument()?.activeElement)) return;

        if (event.key === 'Escape') {
            if (this.isConfigOpen) {
                event.preventDefault();
                this.closeConfig();
            } else if (this.isOpen) {
                event.preventDefault();
                this.close();
            }
            return;
        }

        if (event.key !== 'Tab') return;
        const container = this.isConfigOpen
            ? this.configModal
            : (this.isOpen && this.isOverlayMode() ? this.panel : null);
        if (container) this.trapFocus(event, container);
    }

    trapFocus(event, container) {
        const focusable = Array.from(container.querySelectorAll(
            'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
        )).filter((element) => !element.hidden && element.getAttribute('aria-hidden') !== 'true');
        if (focusable.length === 0) {
            event.preventDefault();
            return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = getDocument()?.activeElement;
        if (event.shiftKey && (active === first || !container.contains(active))) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && active === last) {
            event.preventDefault();
            first.focus();
        }
    }

    showWelcome() {
        if (!this.messagesEl) return;
        this.messagesEl.innerHTML = '';
        const welcome = getDocument().createElement('div');
        welcome.className = 'ai-welcome';
        welcome.innerHTML = this.isAcm
            ? `<div class="ai-welcome-icon">${AI_WELCOME_ICON_SVG}</div>
               <h3>从当前解法开始</h3>
               <p>选择 Java 17 或 Go 生成完整 ACM 程序，再继续追问语言差异和报错。</p>`
            : `<div class="ai-welcome-icon">${AI_WELCOME_ICON_SVG}</div>
               <h3>AI 刷题助手</h3>
               <p>我会读取当前题目和代码，帮你诊断问题、给出提示。</p>
               <p class="ai-welcome-hint">使用快捷操作或直接输入问题</p>`;
        this.messagesEl.appendChild(welcome);
    }

    clearChat() {
        if (this.isStreaming) {
            this.discardCurrentResponse = true;
            this.stopStreaming();
        }
        clearChatHistory();
        this.showWelcome();
    }

    handleQuickAction(action) {
        const quickAction = QUICK_ACTIONS[action];
        if (!quickAction || !this.inputEl) return;
        const context = collectAssistantContext();
        const targetLanguage = action === 'convert-java'
            ? 'java'
            : (action === 'convert-go' ? 'go' : '');
        if (targetLanguage && context.language === targetLanguage) {
            this.addSystemMessage?.(`当前已经是 ${AI_LANGUAGE_META[targetLanguage].label}`);
            return;
        }
        this.inputEl.value = getQuickActionPrompt(action, context);
        this.resizeInput?.();
        this.send({
            visibleMessage: quickAction.label,
            expectedLanguage: targetLanguage,
        });
    }

    announceAction(message) {
        if (!this.actionStatus) return;
        this.actionStatus.textContent = '';
        const update = () => { this.actionStatus.textContent = message; };
        if (typeof getWindow()?.requestAnimationFrame === 'function') {
            getWindow().requestAnimationFrame(update);
        } else {
            update();
        }
    }

    flashCodeActionButton(button, label) {
        if (!button) return;
        const defaultLabel = button.dataset.aiDefaultLabel || button.textContent;
        button.dataset.aiDefaultLabel = defaultLabel;
        if (button.aiResetTimer) getWindow()?.clearTimeout?.(button.aiResetTimer);
        button.textContent = label;
        button.aiResetTimer = getWindow()?.setTimeout?.(() => {
            if (button.isConnected) button.textContent = defaultLabel;
            button.aiResetTimer = null;
        }, 1500);
    }

    async handleCodeBlockAction(event) {
        const button = event.target?.closest?.('button[data-ai-code-action]');
        if (!button || !this.messagesEl.contains(button) || button.disabled) return;
        const block = button.closest('.ai-code-block');
        const codeElement = block?.querySelector('pre > code');
        if (!block || !codeElement) return;

        const action = button.dataset.aiCodeAction;
        const code = codeElement.textContent || '';
        if (action === 'copy') {
            const copied = await copyTextToClipboard(code);
            this.flashCodeActionButton(button, copied ? '已复制' : '复制失败');
            this.announceAction(copied ? '代码已复制' : '复制失败，请检查浏览器剪贴板权限');
            return;
        }
        if (action !== 'apply') return;

        const language = block.dataset.aiCodeLanguage || '';
        const adapter = this.isAcm
            ? getWindow()?.acmApplyGeneratedCode
            : getWindow()?.leetcodeApplyGeneratedCode;
        let result;
        try {
            result = typeof adapter === 'function'
                ? adapter({ language, code })
                : { ok: false, message: '编辑器尚未准备好，请稍后重试。' };
        } catch (error) {
            result = { ok: false, message: '写入编辑器失败，请重试。' };
        }

        if (!result?.ok) {
            this.flashCodeActionButton(button, '写入失败');
            this.announceAction(result?.message || '写入编辑器失败');
            if (result?.message) this.addSystemMessage(result.message);
            return;
        }

        const label = AI_LANGUAGE_META[result.language || language]?.label || '代码';
        this.flashCodeActionButton(button, '已写入');
        this.announceAction(`${label}代码已写入编辑器`);
        this.updateContextSummary();

        const focusEditor = () => {
            const editor = this.isAcm ? getWindow()?.acmEditor : getWindow()?.editor;
            editor?.refresh?.();
            editor?.focus?.();
        };
        if (this.isOverlayMode()) this.close();
        if (typeof getWindow()?.requestAnimationFrame === 'function') {
            getWindow().requestAnimationFrame(focusEditor);
        } else {
            focusEditor();
        }
    }

    updateContextSummary() {
        const context = collectAssistantContext();
        if (this.contextSummary) this.contextSummary.textContent = summarizeContext(context);
        const targets = { 'convert-java': 'java', 'convert-go': 'go' };
        for (const [action, targetLanguage] of Object.entries(targets)) {
            const button = this.quickActions?.querySelector(`[data-action="${action}"]`);
            if (!button) continue;
            const disabled = context.language === targetLanguage;
            button.disabled = disabled;
            button.setAttribute('aria-disabled', String(disabled));
            button.title = disabled ? `当前已经是 ${AI_LANGUAGE_META[targetLanguage].label}` : '';
        }
    }

    async send(options = {}) {
        const isRetry = options.retry === true;
        const userMessage = isRetry ? String(options.userMessage || '').trim() : this.inputEl.value.trim();
        if (!userMessage || this.isStreaming) return;

        const config = loadAIConfig();
        if (!config.apiKey) {
            this.openConfig();
            return;
        }

        if (!isRetry) {
            this.messagesEl.querySelector('.ai-welcome')?.remove();
            this.addMessage('user', options.visibleMessage || userMessage);
            this.inputEl.value = '';
            this.inputEl.style.height = 'auto';
            this.updateContextSummary();
        }

        const context = options.context || collectAssistantContext();
        const contextMessage = options.contextMessage || buildContextMessage(userMessage, context);
        const expectedLanguage = options.expectedLanguage || resolveExpectedResponseLanguage(userMessage, context);
        if (!isRetry) chatHistory.push({ role: 'user', content: contextMessage });
        const apiMessages = options.apiMessages || [
            { role: 'system', content: SYSTEM_PROMPT },
            ...boundedHistory(chatHistory),
        ];

        this.abortController = new AbortController();
        this.discardCurrentResponse = false;
        this.setStreamingState(true);
        const assistantMessage = this.addMessage('assistant', '', { loading: true, scroll: false });
        this.scrollMessageToStart(assistantMessage);
        const contentElement = assistantMessage.querySelector('.ai-msg-content');
        let fullContent = '';
        let lastRenderAt = Number.NEGATIVE_INFINITY;
        let responseTruncated = false;
        let completionAnnouncement = '';
        const currentTime = () => {
            const performanceTime = getWindow()?.performance?.now?.();
            return Number.isFinite(performanceTime) ? performanceTime : Date.now();
        };
        const renderResponse = () => {
            contentElement.innerHTML = this.renderMarkdown(fullContent);
            lastRenderAt = currentTime();
        };

        try {
            for await (const chunk of streamChatCompletion(apiMessages, config, this.abortController.signal)) {
                const remaining = AI_CONTEXT_LIMITS.response - fullContent.length;
                if (remaining <= 0 || chunk.length > remaining) {
                    if (remaining > 0) fullContent += chunk.slice(0, remaining);
                    responseTruncated = true;
                    this.abortController.abort();
                    break;
                }
                fullContent += chunk;
                assistantMessage.classList.remove('ai-msg-loading');
                const now = currentTime();
                if (now - lastRenderAt >= 80) renderResponse();
            }
            if (!fullContent.trim()) {
                contentElement.textContent = 'AI 服务未返回内容，请重试。';
                completionAnnouncement = 'AI 服务未返回内容';
            } else if (!this.discardCurrentResponse) {
                const validation = validateAssistantResponse(
                    fullContent,
                    expectedLanguage,
                    context.template,
                    context.surface
                );
                if (!validation.valid) {
                    contentElement.innerHTML = '';
                    const invalidElement = getDocument().createElement('div');
                    invalidElement.className = 'ai-error';
                    invalidElement.textContent = validation.message;
                    contentElement.appendChild(invalidElement);
                    completionAnnouncement = 'AI 回复无效，请重试';
                } else {
                    renderResponse();
                    this.decorateCodeBlocks(contentElement, { allowApply: !responseTruncated });
                    chatHistory.push({ role: 'assistant', content: fullContent });
                    completionAnnouncement = responseTruncated ? 'AI 回复过长，已截断' : 'AI 回复已生成';
                }
                if (responseTruncated && validation.valid) {
                    const limitMessage = getDocument().createElement('div');
                    limitMessage.className = 'ai-error';
                    limitMessage.textContent = '回复过长，已在 60000 字符处停止生成。';
                    contentElement.appendChild(limitMessage);
                }
            }
        } catch (error) {
            assistantMessage.classList.remove('ai-msg-loading');
            if (error.name === 'AbortError') {
                if (fullContent.trim() && !this.discardCurrentResponse) {
                    chatHistory.push({ role: 'assistant', content: fullContent });
                    contentElement.innerHTML = this.renderMarkdown(fullContent);
                    this.decorateCodeBlocks(contentElement, { allowApply: false });
                    completionAnnouncement = '已停止生成，保留当前回复';
                } else if (!this.discardCurrentResponse) {
                    contentElement.textContent = '已停止生成';
                    completionAnnouncement = '已停止生成';
                }
            } else {
                if (fullContent.trim() && !this.discardCurrentResponse) {
                    chatHistory.push({ role: 'assistant', content: fullContent });
                    contentElement.innerHTML = this.renderMarkdown(fullContent);
                    this.decorateCodeBlocks(contentElement, { allowApply: false });
                } else if (!this.discardCurrentResponse) {
                    contentElement.innerHTML = '';
                }
                if (!this.discardCurrentResponse) {
                    const errorElement = getDocument().createElement('div');
                    errorElement.className = 'ai-error';
                    errorElement.textContent = error.message;
                    contentElement.appendChild(errorElement);
                    if (isRetryableAIError(error)) {
                        const retryButton = getDocument().createElement('button');
                        retryButton.type = 'button';
                        retryButton.className = 'ai-retry-btn';
                        retryButton.textContent = '重新生成';
                        retryButton.setAttribute('aria-label', '重新发送上一条问题');
                        retryButton.addEventListener('click', () => {
                            if (this.isStreaming) return;
                            retryButton.disabled = true;
                            assistantMessage.remove();
                            this.send({
                                retry: true,
                                userMessage,
                                context,
                                contextMessage,
                                expectedLanguage,
                                apiMessages,
                            });
                        });
                        contentElement.appendChild(retryButton);
                    }
                    completionAnnouncement = 'AI 请求失败，可重新生成';
                }
            }
        } finally {
            assistantMessage.classList.remove('ai-msg-loading');
            this.abortController = null;
            this.setStreamingState(false);
            if (this.liveStatus && !this.discardCurrentResponse) {
                this.liveStatus.textContent = completionAnnouncement;
            }
            this.discardCurrentResponse = false;
        }
    }

    stopStreaming() {
        this.abortController?.abort();
    }

    setStreamingState(active) {
        this.isStreaming = active;
        if (active && this.liveStatus) this.liveStatus.textContent = '';
        this.messagesEl.setAttribute('aria-busy', active ? 'true' : 'false');
        this.panel.classList.toggle('is-streaming', active);
        this.sendBtn.classList.toggle('is-stop', active);
        this.sendBtn.innerHTML = active ? AI_STOP_ICON_SVG : AI_SEND_ICON_SVG;
        this.sendBtn.setAttribute('aria-label', active ? '停止生成' : '发送消息');
        this.sendBtn.setAttribute('title', active ? '停止生成' : '发送');
    }

    addMessage(role, content, options = {}) {
        const loading = role === 'assistant' && options.loading === true;
        const message = getDocument().createElement('div');
        message.className = `ai-msg ai-msg-${role}${loading ? ' ai-msg-loading' : ''}`;
        const avatar = role === 'user' ? AI_USER_ICON_SVG : AI_ICON_SVG;
        const rendered = loading
            ? this.renderLoadingIndicator()
            : (role === 'user' ? escapeHtml(content) : this.renderMarkdown(content));
        message.innerHTML = `
            <div class="ai-msg-avatar">${avatar}</div>
            <div class="ai-msg-bubble">
                <div class="ai-msg-content">${rendered}</div>
            </div>`;
        this.messagesEl.appendChild(message);
        if (role === 'assistant' && !loading) {
            this.decorateCodeBlocks(message.querySelector('.ai-msg-content'));
        }
        if (options.scroll !== false) this.scrollToBottom();
        return message;
    }

    addSystemMessage(text) {
        const message = getDocument().createElement('div');
        message.className = 'ai-msg ai-msg-system';
        const content = getDocument().createElement('div');
        content.className = 'ai-msg-system-text';
        content.textContent = text;
        message.appendChild(content);
        this.messagesEl.appendChild(message);
        this.scrollToBottom();
    }

    renderMarkdown(text) {
        if (!text) return '';
        if (typeof marked !== 'undefined') {
            try {
                return sanitizeMarkdownHtml(marked.parse(text));
            } catch (error) {
                return escapeHtml(text).replace(/\n/g, '<br>');
            }
        }
        return escapeHtml(text).replace(/\n/g, '<br>');
    }

    decorateCodeBlocks(container, options = {}) {
        return decorateAssistantCodeBlocks(container, {
            surface: this.isAcm ? 'acm' : 'leetcode',
            ...options,
        });
    }

    renderLoadingIndicator() {
        return [
            '<div class="ai-typing" aria-label="AI 正在生成">',
            '<span class="ai-typing-dot"></span>',
            '<span class="ai-typing-dot"></span>',
            '<span class="ai-typing-dot"></span>',
            '</div>',
        ].join('');
    }

    scrollToBottom() {
        getWindow()?.requestAnimationFrame?.(() => {
            this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
        });
    }

    scrollMessageToStart(message) {
        if (!message || !this.messagesEl) return;
        getWindow()?.requestAnimationFrame?.(() => {
            this.messagesEl.scrollTop = Math.max(0, message.offsetTop - 12);
        });
    }
}

function initializeAIAssistant() {
    if (!getDocument()?.getElementById('ai-fab')) return;
    if (typeof marked !== 'undefined') {
        marked.setOptions({ breaks: true, gfm: true });
    }
    const assistant = new AIAssistant();
    if (getWindow()) getWindow().aiAssistant = assistant;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AIAssistant,
        AI_DEFAULT_MODEL,
        AI_LANGUAGE_META,
        QUICK_ACTIONS,
        SYSTEM_PROMPT,
        boundedHistory,
        buildContextMessage,
        clipText,
        collectAssistantContext,
        copyTextToClipboard,
        decorateAssistantCodeBlocks,
        getQuickActionPrompt,
        getGeneratedCodeLanguage,
        markdownCodeBlock,
        loadAIConfig,
        normalizeConfiguredModel,
        normalizeGeneratedCodeLanguage,
        resolveExpectedResponseLanguage,
        saveAIConfig,
        sanitizeMarkdownHtml,
        streamChatCompletion,
        summarizeContext,
        validateAssistantResponse,
    };
}

if (getDocument()) {
    if (getDocument().readyState === 'loading') {
        getDocument().addEventListener('DOMContentLoaded', initializeAIAssistant);
    } else {
        initializeAIAssistant();
    }
}
