// 从 stdin 读取密钥，只输出域名绑定的加密包装；不要通过命令行参数传入密钥。
// 这是前端混淆，不能替代服务端密钥存储。
const fs = require('node:fs');
const { createCipheriv, createHash, randomBytes } = require('node:crypto');
const { AI_BUILTIN_ORIGINS, getBuiltinKeyMaterial } = require('../assets/js/ai-assistant.js');

const apiKey = fs.readFileSync(0, 'utf8').trim();
if (!apiKey || /\s/.test(apiKey)) {
    process.stderr.write('请通过 stdin 提供一个非空 API Key。\n');
    process.exitCode = 1;
} else {
    const lines = ['const AI_BUILTIN_ENVELOPES = Object.freeze({'];
    for (const origin of AI_BUILTIN_ORIGINS) {
        const material = Buffer.from(getBuiltinKeyMaterial(origin));
        const iv = randomBytes(12);
        const cipher = createCipheriv('aes-256-gcm', createHash('sha256').update(material).digest(), iv);
        cipher.setAAD(material);
        const encrypted = Buffer.concat([cipher.update(apiKey, 'utf8'), cipher.final()]);
        const wrapped = Buffer.concat([iv, encrypted, cipher.getAuthTag()]).toString('base64');
        lines.push(`    '${origin}': Object.freeze([`);
        for (const chunk of wrapped.match(/.{1,24}/g)) lines.push(`        '${chunk}',`);
        lines.push('    ]),');
    }
    lines.push('});');
    process.stdout.write(lines.join('\n') + '\n');
}
