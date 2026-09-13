// =============================================
// ACM Bridge — 在真题文章中注入"在 ACM IDE 中运行"按钮
// 仅在 04_real_interviews 页面上激活
// =============================================

(function () {
    // 仅在真题页面生效
    if (window.location.pathname.indexOf('04_real_interviews') === -1) return;

    // 等待 hljs 高亮完成后执行
    var ready = window.requestIdleCallback || function (fn) { setTimeout(fn, 100); };
    ready(function () { injectButtons(); });

    function injectButtons() {
        var article = document.querySelector('.doc-article');
        if (!article) return;

        // 找到所有 Python / Go / Java 代码块
        // kramdown 渲染结构: div.highlighter-rouge > div.highlight > pre > code
        var codeBlocks = article.querySelectorAll('pre > code');
        var runnableBlocks = [];
        for (var i = 0; i < codeBlocks.length; i++) {
            var cls = codeBlocks[i].className || '';
            var parentCls = (codeBlocks[i].closest('.highlighter-rouge') || {}).className || '';
            var language = null;
            if (cls.indexOf('python') !== -1 || parentCls.indexOf('language-python') !== -1) {
                language = 'python';
            } else if (/(^|\s)language-(go|golang)(\s|$)/.test(cls + ' ' + parentCls) ||
                       /(^|\s)(go|golang)(\s|$)/.test(cls)) {
                language = 'go';
            } else if (/(^|\s)language-java(\s|$)/.test(cls + ' ' + parentCls) ||
                       /(^|\s)java(\s|$)/.test(cls)) {
                language = 'java';
            }
            if (language) runnableBlocks.push({ element: codeBlocks[i], language: language });
        }

        runnableBlocks.forEach(function (block) {
            var codeEl = block.element;
            // 找到最外层容器（div.highlighter-rouge），或直接用 <pre>
            var wrapper = codeEl.closest('.highlighter-rouge') || codeEl.parentElement;
            var data = findSampleData(wrapper);
            if (!data) return;

            var btn = document.createElement('a');
            btn.className = 'acm-run-btn';
            btn.target = '_blank';
            btn.rel = 'noopener';
            btn.textContent = '\u25B6 \u5728 ACM IDE \u4E2D\u8FD0\u884C'; // ▶ 在 ACM IDE 中运行

            // 构建 URL
            var base = (window.Z2L_BASE || '').replace(/\/$/, '');
            var params = [];
            params.push('language=' + encodeURIComponent(block.language));
            params.push('code=' + encodeURIComponent(encodeB64(data.code)));
            if (data.input) params.push('input=' + encodeURIComponent(encodeB64(data.input)));
            if (data.expected) params.push('expected=' + encodeURIComponent(encodeB64(data.expected)));
            btn.href = base + '/acm-playground.html?' + params.join('&');

            // 插入到代码块包装器前面
            wrapper.parentNode.insertBefore(btn, wrapper);
        });
    }

    /**
     * 从一个代码块的外层容器向上查找同一道题的样例输入/输出
     * wrapper 可以是 div.highlighter-rouge 或 <pre>
     * 返回 { code, input, expected } 或 null
     */
    function findSampleData(wrapper) {
        var code = wrapper.textContent || '';
        if (!code.trim()) return null;

        // 向上遍历同级兄弟节点，寻找输入/输出 code blocks
        var input = null;
        var expected = null;

        // 收集从当前容器往上直到 <h2> 之间的所有元素
        var siblings = [];
        var el = wrapper.previousElementSibling;
        while (el) {
            if (el.tagName === 'H2') break; // 题目边界
            siblings.unshift(el);
            el = el.previousElementSibling;
        }

        // 在 siblings 中寻找 **输入** 和 **输出** 后的代码块
        // kramdown 生成: <p><strong>输入</strong></p> → <div.highlighter-rouge>
        for (var i = 0; i < siblings.length; i++) {
            var node = siblings[i];
            var next = siblings[i + 1];

            // 检查是否包含 **输入** 标记，下一个兄弟是代码块
            if (isLabel(node, '输入') && next && isCodeBlock(next)) {
                input = next.textContent || '';
            }
            // 检查是否包含 **输出** 标记
            if (isLabel(node, '输出') && next && isCodeBlock(next)) {
                expected = next.textContent || '';
            }
        }

        return {
            code: code.trim(),
            input: (input || '').trimEnd(),
            expected: (expected || '').trim()
        };
    }

    /**
     * 判断元素是否为代码块（<pre> 或 div.highlighter-rouge）
     */
    function isCodeBlock(el) {
        if (el.tagName === 'PRE') return true;
        if (el.classList && el.classList.contains('highlighter-rouge')) return true;
        return false;
    }

    /**
     * 判断一个元素是否是 <p><strong>输入</strong></p> 这样的标记
     */
    function isLabel(el, keyword) {
        if (el.tagName !== 'P') return false;
        var strong = el.querySelector('strong');
        if (!strong) return false;
        return strong.textContent.trim() === keyword;
    }

    /**
     * Base64 编码（支持 Unicode / 中文）
     */
    function encodeB64(str) {
        try {
            var bytes = new TextEncoder().encode(str);
            var binary = '';
            for (var i = 0; i < bytes.length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return btoa(binary);
        } catch (e) {
            return btoa(unescape(encodeURIComponent(str)));
        }
    }
})();
