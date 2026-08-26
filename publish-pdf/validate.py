#!/usr/bin/env python3
"""Validate assembled Markdown with Pandoc's parsed document model."""

import argparse
import json
import re
import subprocess
from pathlib import Path
from typing import Any, Dict, Iterable, List


MATH_COMMAND = re.compile(
    r"\\(?:geq|leq|lvert|rvert|frac|sum|prod|max|min|sqrt|text|operatorname|"
    r"cdot|times|approx|infty|Delta|lambda|mu|sigma|theta)"
)
UNSUPPORTED_GLYPHS = re.compile(r"[①②③④⑤⑥⑦⑧⑨⑩⁹⌈⌉💬✍📊📅🛠]")
CJK_OUTSIDE_TEXT = re.compile(r"[一-鿿。]")
TEXT_COMMAND = re.compile(r"\\text\{[^{}]*\}")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("paths", nargs="+", type=Path)
    return parser.parse_args()


def walk(value: Any) -> Iterable[Dict[str, Any]]:
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from walk(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk(child)


def main() -> None:
    args = parse_args()
    command = [
        "pandoc",
        *[str(path) for path in args.paths],
        "--from=markdown+raw_html+tex_math_dollars",
        "--to=json",
    ]
    result = subprocess.run(command, check=True, stdout=subprocess.PIPE)
    document = json.loads(result.stdout)

    errors: List[str] = []
    headers = 0
    math_nodes = 0
    code_blocks = 0
    for node in walk(document):
        node_type = node.get("t")
        if node_type == "Header":
            headers += 1
        elif node_type == "CodeBlock":
            code_blocks += 1
            code = node["c"][1]
            match = UNSUPPORTED_GLYPHS.search(code)
            if match:
                errors.append(f"代码块含不受支持字符: {match.group(0)}")
        elif node_type == "Str":
            text = node.get("c", "")
            if "$" in text or MATH_COMMAND.search(text):
                errors.append(f"疑似未闭合数学表达式: {text}")
            match = UNSUPPORTED_GLYPHS.search(text)
            if match:
                errors.append(f"正文含不受支持字符: {match.group(0)}")
        elif node_type == "Math":
            math_nodes += 1
            math_text = node["c"][1]
            outside_text = TEXT_COMMAND.sub("", math_text)
            match = CJK_OUTSIDE_TEXT.search(outside_text)
            if match:
                errors.append(f"数学环境含裸中文或中文标点: {math_text.strip()}")

    if errors:
        for error in errors[:50]:
            print(f"错误: {error}")
        if len(errors) > 50:
            print(f"另有 {len(errors) - 50} 条错误未展示")
        raise SystemExit(1)

    print(
        f"  Pandoc AST 校验通过: {headers} 个标题，"
        f"{math_nodes} 个公式，{code_blocks} 个代码块"
    )


if __name__ == "__main__":
    main()
