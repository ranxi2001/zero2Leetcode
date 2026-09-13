#!/usr/bin/env python3
"""Ensure each exam article's permalink was rendered by Jekyll."""
import re
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
site = Path(sys.argv[1]) if len(sys.argv) > 1 else root / '_site'
errors = []
count = 0
for source in sorted((root / '04_real_interviews').rglob('*.md')):
    text = source.read_text(encoding='utf-8')
    front = re.match(r'\A---\r?\n(.*?)\r?\n---(?:\r?\n|\Z)', text, re.S)
    if not front:
        errors.append(f'{source.relative_to(root)}: missing front matter')
        continue
    link = re.search(r'^permalink:\s*[\"\']?(/[^\s\"\']*)', front[1], re.M)
    if not link and source.name != 'index.md':
        errors.append(f'{source.relative_to(root)}: missing permalink')
        continue
    url = link[1] if link else '/' + source.relative_to(root).with_suffix('.html').as_posix()
    target = site / url.lstrip('/')
    if url.endswith('/'):
        target /= 'index.html'
    if not target.is_file() or '<html' not in target.read_text(encoding='utf-8').lower():
        errors.append(f'{source.relative_to(root)}: no rendered HTML at {target}')
    count += 1
if errors:
    print('\n'.join(errors), file=sys.stderr)
    sys.exit(1)
print(f'PASS: {count} exam article permalinks have rendered HTML')
