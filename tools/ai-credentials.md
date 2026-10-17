# 更新 AI 内置凭据

内置服务为 `https://tosky.io/v1` 的 `gpt-6-luna`。`assets/js/ai-assistant.js` 中的内置服务标记与用户自填密钥走不同的调用逻辑。

- 内置凭据使用 AES-256-GCM 包装，以项目标识、官方 origin、项目路径、API 地址与模型派生包装材料。不同 origin 使用独立随机 IV 和包装数据。
- 内置服务仅在 `https://onefly.top/zero2Leetcode/` 与 `https://ranxi2001.github.io/zero2Leetcode/` 下自动解包；修改目标 API 或模型后必须填写自己的密钥。
- 内置密钥只在发出 API 请求前解包，不回填设置框，也不写入 localStorage。旧内置配置会迁移成服务标记；用户自填配置保留。
- 用户自填密钥仍按原逻辑保存在浏览器，并直接调用用户设置的 API；本地开发无需解包内置凭据。

这是前端混淆：包装材料和解包代码均可获得，真实密钥仍出现在请求头中。它不能阻止修改代码、逆向或复制真实密钥后的站外调用。

## 生成新的包装

在仓库根目录执行以下 Bash 命令，从隐藏输入读取新密钥，避免把明文密钥放进源码、命令行参数和 shell 历史：

```bash
read -r -s -p '新的内置 API Key: ' z2l_new_api_key
printf '\n'
printf '%s' "$z2l_new_api_key" | node tools/wrap-ai-default-key.cjs
unset z2l_new_api_key
```

用输出替换 `assets/js/ai-assistant.js` 中的 `AI_BUILTIN_ENVELOPES` 常量。修改官方域名、项目路径、API 或模型后，也必须重新生成包装。不要把明文密钥保存到仓库或测试快照。

同时递增两个练习页面引用的 `ai-assistant.js` 版本号，并运行：

```bash
node --check assets/js/ai-assistant.js
node --check tools/wrap-ai-default-key.cjs
node --test tests/ai-assistant.test.cjs
```
