const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

function markdownFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? markdownFiles(file) : file.endsWith('.md') ? [file] : [];
  });
}

// Exam articles are published pages, not unlinked notes or include fragments.
for (const dir of ['04_real_interviews']) {
  for (const file of markdownFiles(path.join(root, dir))) {
    test(`Jekyll page has valid front matter: ${path.relative(root, file)}`, () => {
      const text = fs.readFileSync(file, 'utf8');
      assert.match(text, /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/,
        'Missing front matter: Jekyll will copy Markdown instead of generating HTML');
      assert.doesNotMatch(text, /^\s*1\|---/,
        'Tool display line numbers must never be written into article source');
    });
  }
}
