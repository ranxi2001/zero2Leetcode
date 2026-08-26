#!/usr/bin/env python3
"""Assemble the blue book from maintained Markdown sources."""

import argparse
import re
from pathlib import Path
from typing import Iterable, List, Sequence, Set, Tuple


CHAPTER_NAMES = {
    1: "面试高频手撕",
    2: "八股文",
    3: "大厂笔试真题",
    4: "其他知识",
}

COMPANY_NAMES = {
    "alibaba": "阿里巴巴",
    "ant": "蚂蚁集团",
    "meituan": "美团",
    "huawei": "华为",
    "jd": "京东",
    "didi": "滴滴",
    "netease": "网易",
    "bilibili": "哔哩哔哩",
    "ctrip": "携程",
    "pinduoduo": "拼多多",
    "baidu": "百度",
    "bytedance": "字节跳动",
    "mihoyo": "米哈游",
    "oppo": "OPPO",
    "honor": "荣耀",
    "iflytek": "科大讯飞",
    "shopee": "Shopee",
    "dewu": "得物",
    "nio": "蔚来",
    "shailab": "商汤研究院",
    "deepseek": "DeepSeek",
}

COMPANY_ORDER = list(COMPANY_NAMES)

FUNDAMENTALS_ORDER = [
    "operating-system.md",
    "computer-network.md",
    "database.md",
    "general-backend.md",
    "go-backend.md",
    "huawei-backend.md",
    "huawei-dev.md",
    "huawei-ai.md",
    "alibaba-backend.md",
    "tencent-backend.md",
    "meituan-backend.md",
    "baidu-backend.md",
    "bytedance-backend.md",
    "infra-systems.md",
    "kubernetes-agent-infra.md",
    "backend-frequency-2026-march-july.md",
    "recent-2026-spring.md",
    "recent-2026-summer.md",
]

SYMBOL_REPLACEMENTS = {
    "🔴": "[高风险]",
    "🟡": "[中等]",
    "🟢": "[基础]",
    "⚠️": "[注意]",
    "⚠": "[注意]",
    "✅": "[正确]",
    "❌": "[错误]",
    "✓": "[适用]",
    "✗": "[不适用]",
    "⭐": "*",
    "🚀": "",
    "🤖": "AI",
    "📝": "",
    "📚": "",
    "📖": "",
    "💬": "",
    "✍": "",
    "📊": "",
    "📅": "",
    "🛠": "",
    "🎯": "",
    "💡": "",
    "🔥": "",
    "①": "(1)",
    "②": "(2)",
    "③": "(3)",
    "④": "(4)",
    "⑤": "(5)",
    "⑥": "(6)",
    "⑦": "(7)",
    "⑧": "(8)",
    "⑨": "(9)",
    "⑩": "(10)",
    "⁹": "^9",
    "\ufe0f": "",
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--repo-root", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--chapters", default="1,2,3,4")
    return parser.parse_args()


def parse_chapters(value: str) -> List[int]:
    try:
        chapters = sorted({int(item.strip()) for item in value.split(",") if item.strip()})
    except ValueError as exc:
        raise SystemExit(f"章节参数无效: {value}") from exc
    invalid = [number for number in chapters if number not in CHAPTER_NAMES]
    if not chapters or invalid:
        raise SystemExit(f"章节必须来自 1,2,3,4，当前值: {value}")
    return chapters


def expand_includes(content: str, repo_root: Path, stack: Set[Path]) -> str:
    pattern = re.compile(r"\{%\s*include\s+([^\s%]+)\s*%\}")

    def replace(match: re.Match) -> str:
        include_path = (repo_root / "_includes" / match.group(1)).resolve()
        include_root = (repo_root / "_includes").resolve()
        if include_root not in include_path.parents or not include_path.is_file():
            raise ValueError(f"无法解析 include: {match.group(1)}")
        if include_path in stack:
            raise ValueError(f"循环 include: {include_path}")
        nested = include_path.read_text(encoding="utf-8")
        return expand_includes(nested, repo_root, stack | {include_path})

    return pattern.sub(replace, content)


def strip_frontmatter(content: str) -> str:
    return re.sub(r"\A---\s*\n.*?\n---\s*\n", "", content, count=1, flags=re.DOTALL)


def normalize_liquid(content: str) -> str:
    base_url = "https://onefly.top/zero2Leetcode"
    content = content.replace("{{ site.baseurl }}", base_url)
    content = re.sub(
        r"\{\{\s*(['\"])(/[^'\"]*)\1\s*\|\s*relative_url\s*\}\}",
        lambda match: base_url + match.group(2),
        content,
    )
    content = re.sub(r"\{%.*?%\}", "", content)
    content = re.sub(r"\{\{.*?\}\}", "", content)
    return content


def remove_mermaid(content: str) -> str:
    return re.sub(
        r"^```mermaid\s*\n.*?^```\s*$",
        "_流程图请参见在线版。_",
        content,
        flags=re.DOTALL | re.MULTILINE,
    )


def replace_symbols(content: str) -> str:
    for source, replacement in SYMBOL_REPLACEMENTS.items():
        content = content.replace(source, replacement)
    return content


def shift_headings(content: str, levels: int) -> str:
    output: List[str] = []
    fence_char = ""
    fence_length = 0
    for line in content.splitlines():
        fence = re.match(r"^\s*(`{3,}|~{3,})", line)
        if fence:
            marker = fence.group(1)
            if not fence_char:
                fence_char = marker[0]
                fence_length = len(marker)
            elif marker[0] == fence_char and len(marker) >= fence_length:
                fence_char = ""
                fence_length = 0
            output.append(line)
            continue

        if not fence_char:
            heading = re.match(r"^(#{1,6})([ \t]+)(.*)$", line)
            if heading:
                depth = min(6, len(heading.group(1)) + levels)
                line = "#" * depth + heading.group(2) + heading.group(3)
        output.append(line)
    return "\n".join(output)


def transform_source(path: Path, repo_root: Path, heading_shift: int) -> str:
    content = path.read_text(encoding="utf-8")
    content = expand_includes(content, repo_root, {path.resolve()})
    content = strip_frontmatter(content)
    content = normalize_liquid(content)
    content = remove_mermaid(content)
    content = replace_symbols(content)
    content = shift_headings(content, heading_shift)
    content = re.sub(r"\n{4,}", "\n\n\n", content).strip()
    return content + "\n"


def append_sources(
    parts: List[str], paths: Iterable[Path], repo_root: Path, heading_shift: int
) -> int:
    count = 0
    for path in paths:
        if not path.is_file():
            raise FileNotFoundError(path)
        parts.append(transform_source(path, repo_root, heading_shift))
        count += 1
    return count


def write_preface(output_dir: Path) -> None:
    content = """# 前言 {.unnumbered}

《zero2Leetcode 蓝皮书》面向准备校招、实习与社招技术面试的读者，内容由四部分组成：面试高频手撕、计算机基础八股文、大厂笔试真题，以及语法、数据结构、测评和 AI Coding 技巧。

第一章以字节跳动高频手撕题单的六大分类为主线，其他公司统计只用于优先级参考和新增题补充。题解强调现场可讲、代码可写、复杂度可证，并在适合的题目中比较哈希表、双指针、滑动窗口、堆、二分和动态规划等多种方法。

第二至第四章在编译时直接读取网站原始资料，不在 `book` 目录维护副本。这样网站内容与出版内容共享同一事实来源，避免重复修改后产生版本漂移。

## 阅读建议

1. 面试临近时，优先完成第一章字节核心题，并练习每题的口述与追问。
2. 八股文按薄弱主题查缺补漏，不建议只背结论。
3. 笔试真题按公司和岗位限时完成，使用本机 Python 环境验证输入输出。
4. AI Coding 题重点训练需求拆解、测试设计、隐藏边界和限时交付。
"""
    (output_dir / "00-preface.md").write_text(content, encoding="utf-8")


def build_chapter_one(repo_root: Path, output_dir: Path) -> Tuple[int, Path]:
    paths = sorted((repo_root / "book/01_high_frequency_coding").glob("0[1-6]-*.md"))
    parts = ["# 面试高频手撕\n"]
    count = append_sources(parts, paths, repo_root, heading_shift=1)
    output = output_dir / "01-high-frequency-coding.md"
    output.write_text("\n".join(parts), encoding="utf-8")
    return count, output


def build_chapter_two(repo_root: Path, output_dir: Path) -> Tuple[int, Path]:
    source_dir = repo_root / "05_interview/fundamentals"
    discovered = {path.name: path for path in source_dir.glob("*.md")}
    paths = [discovered.pop(name) for name in FUNDAMENTALS_ORDER if name in discovered]
    paths.extend(discovered[name] for name in sorted(discovered))
    parts = ["# 八股文\n"]
    count = append_sources(parts, paths, repo_root, heading_shift=1)
    output = output_dir / "02-fundamentals.md"
    output.write_text("\n".join(parts), encoding="utf-8")
    return count, output


def company_sort_key(path: Path) -> Tuple[int, str]:
    try:
        company_index = COMPANY_ORDER.index(path.name)
    except ValueError:
        company_index = len(COMPANY_ORDER)
    return company_index, path.name


def build_chapter_three(repo_root: Path, output_dir: Path) -> Tuple[int, Path]:
    source_dir = repo_root / "04_real_interviews"
    company_dirs = sorted(
        [path for path in source_dir.iterdir() if path.is_dir() and path.name != "tips"],
        key=company_sort_key,
    )
    parts = ["# 大厂笔试真题\n"]
    count = 0
    for company_dir in company_dirs:
        files = sorted(company_dir.glob("*.md"))
        if not files:
            continue
        company_name = COMPANY_NAMES.get(company_dir.name, company_dir.name)
        parts.append(f"## {company_name}\n")
        count += append_sources(parts, files, repo_root, heading_shift=2)
    output = output_dir / "03-real-interviews.md"
    output.write_text("\n".join(parts), encoding="utf-8")
    return count, output


def index_files(root: Path) -> List[Path]:
    overview = root / "index.md"
    children = sorted(path for path in root.glob("*/index.md") if path != overview)
    return ([overview] if overview.is_file() else []) + children


def add_group(
    parts: List[str], title: str, paths: Sequence[Path], repo_root: Path
) -> int:
    existing = [path for path in paths if path.is_file()]
    if not existing:
        return 0
    parts.append(f"## {title}\n")
    return append_sources(parts, existing, repo_root, heading_shift=2)


def build_chapter_four(repo_root: Path, output_dir: Path) -> Tuple[int, Path]:
    parts = ["# 其他知识\n"]
    count = 0
    count += add_group(
        parts,
        "综合测评与面试流程",
        sorted((repo_root / "05_interview/assessment").glob("*.md")),
        repo_root,
    )
    count += add_group(parts, "Python 刷题语法", index_files(repo_root / "00_python_basics"), repo_root)
    count += add_group(parts, "数据结构", index_files(repo_root / "01_data_structures"), repo_root)
    count += add_group(parts, "核心算法", index_files(repo_root / "02_algorithms"), repo_root)
    count += add_group(
        parts,
        "复杂度与备考方法",
        [
            repo_root / "docs/complexity_analysis/index.md",
            repo_root / "docs/interview_tips/index.md",
            repo_root / "docs/study_guide/index.md",
            repo_root / "04_real_interviews/tips/exam-essentials.md",
            repo_root / "04_real_interviews/tips/ml-coding-trend.md",
            repo_root / "04_real_interviews/tips/autumn-2027-timeline.md",
        ],
        repo_root,
    )
    count += add_group(
        parts,
        "AI Coding 技巧",
        [
            repo_root / "05_interview/coding/ai-coding-assessment-guide.md",
            repo_root / "05_interview/coding/alibaba-qwen-vibecoding.md",
        ],
        repo_root,
    )
    output = output_dir / "04-other.md"
    output.write_text("\n".join(parts), encoding="utf-8")
    return count, output


def main() -> None:
    args = parse_args()
    repo_root = args.repo_root.resolve()
    output_dir = args.output_dir.resolve()
    chapters = parse_chapters(args.chapters)
    output_dir.mkdir(parents=True, exist_ok=True)
    write_preface(output_dir)

    builders = {
        1: build_chapter_one,
        2: build_chapter_two,
        3: build_chapter_three,
        4: build_chapter_four,
    }
    total_sources = 0
    for number in chapters:
        count, output = builders[number](repo_root, output_dir)
        total_sources += count
        print(f"  第 {number} 章: {count} 个来源 -> {output.name}")
    print(f"  合计: {total_sources} 个来源文件")


if __name__ == "__main__":
    main()
