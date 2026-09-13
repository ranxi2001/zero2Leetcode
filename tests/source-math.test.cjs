const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
for (const [route, count] of Object.entries({'jd/dev-20260905':151,'jd/algo-20260905':163,'meituan/algo-20260905':240,'nio/general-20260904':100,'didi/dev-20260906':170})) {
  test(`all source SVG formulas survive extraction: ${route}`, () => {
    const text = fs.readFileSync(path.join(root, '04_real_interviews', route + '.md'), 'utf8');
    const images = [...text.matchAll(/<img class="source-math" src="\{\{ '([^']+)' \| relative_url \}\}"/g)];
    assert.equal(images.length, count);
    assert.equal(new Set(images.map(m => m[1])).size, count);
    for (const image of images) {
      const svg = fs.readFileSync(path.join(root, image[1]), 'utf8');
      assert.match(svg, /viewBox=/);
      assert.match(svg, /data-mml-node="math"/);
      assert.doesNotMatch(svg, /<script|<foreignObject|\son\w+=/i);
    }
    for (const block of text.matchAll(/```[^\n]*\n([\s\S]*?)```/g)) {
      assert.doesNotMatch(block[1], /source-math/, 'Formula must not be inserted into a code fence');
    }
  });
}
