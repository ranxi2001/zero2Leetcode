#!/usr/bin/env python3
"""Validate a Zero2Leetcode interview article before publishing."""

from __future__ import annotations

import argparse
import html
import re
import subprocess
import sys
from pathlib import Path


MATH_RE = re.compile(
    r"(?<!\\)\$\$(.*?)(?<!\\)\$\$"
    r"|(?<![\\$])\$(?!\$)(.*?)(?<![\\$])\$(?!\$)",
    re.DOTALL,
)
PYTHON_BLOCK_RE = re.compile(r"^```python\s*\n(.*?)^```\s*$", re.MULTILINE | re.DOTALL)
SQL_BLOCK_RE = re.compile(r"^```sql\s*\n(.*?)^```\s*$", re.MULTILINE | re.DOTALL)
SQL_SOLUTION_RE = re.compile(
    r"^### (?:SQL 代码|题解代码)\s*$.*?^```sql\s*\n(.*?)^```\s*$",
    re.MULTILINE | re.DOTALL,
)
FENCED_CODE_RE = re.compile(r"^```[^\n]*\n.*?^```\s*$", re.MULTILINE | re.DOTALL)
INLINE_CODE_RE = re.compile(r"`[^`\n]*`")
QUESTION_RE = re.compile(r"^## 第 \d+ 题(?:：|:)", re.MULTILINE)
QUESTION_LIKE_RE = re.compile(r"^##\s*第\s*\d+\s*题", re.MULTILINE)
SAMPLE_RE = re.compile(
    r"^\*\*输入\*\*\s*$\n\s*\n^```\s*$\n(.*?)^```\s*$"
    r".*?^\*\*输出\*\*\s*$\n\s*\n^```\s*$\n(.*?)^```\s*$",
    re.MULTILINE | re.DOTALL,
)
FORBIDDEN_EXIT_RE = re.compile(
    r"raise\s+SystemExit|sys\.exit\s*\(|(?<![\w.])(exit|quit)\s*\("
)
REQUIRED_FRONTMATTER = ("layout", "title", "description", "eyebrow", "permalink")


def line_number(text: str, offset: int) -> int:
    return text.count("\n", 0, offset) + 1


def mask_code(text: str) -> str:
    """Hide code while preserving offsets and line numbers for prose scans."""

    def blank(match: re.Match[str]) -> str:
        return "".join("\n" if char == "\n" else " " for char in match.group(0))

    return INLINE_CODE_RE.sub(blank, FENCED_CODE_RE.sub(blank, text))


def frontmatter(text: str) -> dict[str, str]:
    if not text.startswith("---\n"):
        return {}
    end = text.find("\n---\n", 4)
    if end == -1:
        return {}
    values: dict[str, str] = {}
    for line in text[4:end].splitlines():
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        values[key.strip()] = value.strip().strip('"\'')
    return values


def question_sections(text: str) -> list[str]:
    starts = [match.start() for match in QUESTION_RE.finditer(text)]
    sections = []
    for index, start in enumerate(starts):
        end = starts[index + 1] if index + 1 < len(starts) else len(text)
        sections.append(text[start:end])
    return sections


def run_program(code: str, stdin_text: str, timeout: float, wrapped: bool) -> subprocess.CompletedProcess[str]:
    if wrapped:
        indented = "\n".join("    " + line for line in code.splitlines())
        code = f"""import sys, io as __io, traceback as __tb
__stdout_capture = __io.StringIO()
__stderr_capture = __io.StringIO()
sys.stdout = __stdout_capture
sys.stderr = __stderr_capture
try:
{indented}
except Exception as __e:
    __stderr_capture.write(__tb.format_exc())
finally:
    sys.stdout = sys.__stdout__
    sys.stderr = sys.__stderr__
    __out = __stdout_capture.getvalue()
    __err = __stderr_capture.getvalue()
sys.stdout.write(__out)
sys.stderr.write(__err)
"""
    return subprocess.run(
        [sys.executable, "-c", code],
        input=stdin_text,
        text=True,
        capture_output=True,
        timeout=timeout,
        check=False,
    )


def validate_structure(text: str, errors: list[str]) -> list[str]:
    canonical_count = len(QUESTION_RE.findall(text))
    question_like_count = len(QUESTION_LIKE_RE.findall(text))
    if canonical_count != question_like_count:
        errors.append(
            f"found {question_like_count} question-like H2 headings but only "
            f"{canonical_count} use the required '## 第 N 题：' format"
        )

    sections = question_sections(text)
    if not sections:
        errors.append("article has no canonical '## 第 N 题：' sections")
        return sections

    owned_python_blocks = 0
    owned_sql_blocks = 0
    for section_number, section in enumerate(sections, 1):
        python_count = len(PYTHON_BLOCK_RE.findall(section))
        sql_count = len(SQL_SOLUTION_RE.findall(section))
        code_count = python_count + sql_count
        sample_count = len(SAMPLE_RE.findall(section))
        complexity_count = len(re.findall(r"^### 复杂度分析\s*$", section, re.MULTILINE))
        owned_python_blocks += python_count
        owned_sql_blocks += sql_count
        if code_count != 1:
            errors.append(
                f"question section {section_number}: expected exactly 1 Python or SQL block, "
                f"found {python_count} Python and {sql_count} SQL"
            )
        if sample_count < 1:
            errors.append(
                f"question section {section_number}: expected at least 1 input/output sample pair"
            )
        if complexity_count != 1:
            errors.append(
                f"question section {section_number}: expected 1 complexity section, "
                f"found {complexity_count}"
            )

    total_python_blocks = len(PYTHON_BLOCK_RE.findall(text))
    if owned_python_blocks != total_python_blocks:
        errors.append(
            f"{total_python_blocks - owned_python_blocks} Python block(s) are outside canonical question sections"
        )
    total_sql_blocks = len(SQL_SOLUTION_RE.findall(text))
    if owned_sql_blocks != total_sql_blocks:
        errors.append(
            f"{total_sql_blocks - owned_sql_blocks} SQL block(s) are outside canonical question sections"
        )
    return sections


def validate_samples(sections: list[str], timeout: float, errors: list[str]) -> int:
    sample_runs = 0
    for section_number, section in enumerate(sections, 1):
        code_blocks = PYTHON_BLOCK_RE.findall(section)
        if not code_blocks:
            continue
        samples = SAMPLE_RE.findall(section)
        if not samples:
            errors.append(f"question section {section_number}: Python code has no input/output sample pair")
            continue
        for code_number, code in enumerate(code_blocks, 1):
            for sample_number, (stdin_text, expected) in enumerate(samples, 1):
                expected = expected.strip()
                for wrapped in (False, True):
                    mode = "ACM-wrapped" if wrapped else "CPython"
                    try:
                        result = run_program(code, stdin_text + "\n", timeout, wrapped)
                    except subprocess.TimeoutExpired:
                        errors.append(
                            f"question {section_number} code {code_number} sample {sample_number}: "
                            f"{mode} timed out after {timeout:g}s"
                        )
                        continue
                    actual = result.stdout.strip()
                    if result.returncode != 0 or result.stderr or actual != expected:
                        errors.append(
                            f"question {section_number} code {code_number} sample {sample_number}: "
                            f"{mode} failed (rc={result.returncode}, stdout={actual!r}, "
                            f"stderr={result.stderr.strip()!r}, expected={expected!r})"
                        )
                sample_runs += 1
    return sample_runs


def strip_tags(fragment: str) -> str:
    return html.unescape(re.sub(r"<[^>]+>", " ", fragment))


def generated_path(site_dir: Path, permalink: str) -> Path:
    relative = permalink.strip("/")
    target = site_dir / relative
    if target.suffix == ".html":
        return target
    return target / "index.html"


def validate_generated_html(
    site_dir: Path,
    permalink: str,
    python_count: int,
    sql_count: int,
    complexity_count: int,
    errors: list[str],
) -> None:
    page = generated_path(site_dir, permalink)
    if not page.is_file():
        errors.append(f"generated page not found: {page}")
        return

    source = page.read_text(encoding="utf-8")
    sections = re.findall(
        r"<h3\b[^>]*>复杂度分析</h3>(.*?)(?=<h[23]\b|<hr\b)",
        source,
        re.IGNORECASE | re.DOTALL,
    )
    if len(sections) != complexity_count:
        errors.append(
            f"generated HTML has {len(sections)} complexity sections; expected {complexity_count}"
        )
    for index, section in enumerate(sections, 1):
        if re.search(r"<table\b|<td\b", section, re.IGNORECASE):
            errors.append(f"generated complexity section {index} contains <table>/<td>")
        paragraphs = [strip_tags(item).strip() for item in re.findall(r"<p\b[^>]*>(.*?)</p>", section, re.IGNORECASE | re.DOTALL)]
        time_indexes = [position for position, item in enumerate(paragraphs) if "时间复杂度" in item]
        space_indexes = [position for position, item in enumerate(paragraphs) if "空间复杂度" in item]
        if (
            len(time_indexes) != 1
            or len(space_indexes) != 1
            or time_indexes[0] == space_indexes[0]
        ):
            errors.append(
                f"generated complexity section {index} must contain separate time/space paragraphs"
            )

    rendered_python_count = source.count("language-python")
    if rendered_python_count < python_count:
        errors.append(
            f"generated HTML has {rendered_python_count} Python blocks; expected at least {python_count}"
        )
    if python_count and "acm-bridge.js" not in source:
        errors.append("generated HTML does not load acm-bridge.js")

    rendered_sql_count = source.count("language-sql")
    if rendered_sql_count < sql_count:
        errors.append(
            f"generated HTML has {rendered_sql_count} SQL blocks; expected at least {sql_count}"
        )


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("article", type=Path)
    parser.add_argument("--run-samples", action="store_true")
    parser.add_argument(
        "--reviewed-code",
        action="store_true",
        help="confirm that every executable code block was manually reviewed and is trusted",
    )
    parser.add_argument("--site-dir", type=Path)
    parser.add_argument("--timeout", type=float, default=15.0)
    args = parser.parse_args()

    if args.run_samples and not args.reviewed_code:
        parser.error("--run-samples requires --reviewed-code; this validator is not a sandbox")

    if not args.article.is_file():
        parser.error(f"article not found: {args.article}")

    text = args.article.read_text(encoding="utf-8")
    errors: list[str] = []
    metadata = frontmatter(text)
    for key in REQUIRED_FRONTMATTER:
        if not metadata.get(key):
            errors.append(f"frontmatter is missing {key!r}")

    for number, line in enumerate(text.splitlines(), 1):
        if line.endswith((" ", "\t")):
            errors.append(f"line {number}: trailing whitespace")

    prose = mask_code(text)
    for match in MATH_RE.finditer(prose):
        formula = match.group(1) if match.group(1) is not None else match.group(2)
        if re.search(r"(?<!\\)\|", formula):
            errors.append(
                f"line {line_number(text, match.start())}: math contains a bare vertical bar; "
                "use \\lvert/\\rvert or \\mid"
            )

    python_blocks = PYTHON_BLOCK_RE.findall(text)
    sql_blocks = SQL_SOLUTION_RE.findall(text)
    for match in PYTHON_BLOCK_RE.finditer(text):
        forbidden = FORBIDDEN_EXIT_RE.search(match.group(1))
        if forbidden:
            errors.append(
                f"line {line_number(text, match.start(1) + forbidden.start())}: "
                f"forbidden ACM exit call {forbidden.group(0)!r}"
            )

    sections = validate_structure(text, errors)

    sample_runs = 0
    if args.run_samples:
        sample_runs = validate_samples(sections, args.timeout, errors)
        if python_blocks and sample_runs == 0:
            errors.append("--run-samples executed zero sample pairs")

    complexity_count = len(re.findall(r"^### 复杂度分析\s*$", text, re.MULTILINE))
    if args.site_dir:
        permalink = metadata.get("permalink")
        if not permalink:
            errors.append("cannot locate generated page without frontmatter permalink")
        else:
            validate_generated_html(
                args.site_dir,
                permalink,
                len(python_blocks),
                len(sql_blocks),
                complexity_count,
                errors,
            )

    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1

    details = [
        f"{len(python_blocks)} Python block(s)",
        f"{len(sql_blocks)} SQL block(s)",
        f"{complexity_count} complexity section(s)",
    ]
    if args.run_samples:
        details.append(f"{sample_runs} sample pair(s) in CPython and ACM wrapper")
    if args.site_dir:
        details.append("generated HTML checked")
    print(f"PASS: {args.article} ({', '.join(details)})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
