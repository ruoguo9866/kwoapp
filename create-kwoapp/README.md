# create-kwoapp

通过 npm 快速创建基于 **React + Vite** 的项目，支持多模板选择。

## 使用方式

```bash
npm create kwoapp
```

在**支持交互的终端**中会依次提示选择**模板**、输入**项目目录名**，然后在当前目录创建项目并执行 `npm install`。

若无法交互（如部分环境或 CI），将**无法弹出模板选择**，此时需要显式指定 `--template`。

```bash
# 指定模板与目录名
npm create kwoapp my-app -- --template minimal
# 或
npx create-kwoapp my-app --template minimal
```

## 模板说明

| 模板 | 说明 |
|------|------|
| **default** | 完整版：React + antd-mobile + 登录鉴权 + Mock + 主题、TabBar、账号/设置/详情页示例 |
| **minimal** | 极简版：仅 Vite + React + react-router-dom，首页/关于两页 |

创建完成后：

```bash
cd <项目目录名>
npm run dev
```

## 环境要求

- Node.js >= 18.0.0

## 发布（维护者）

在仓库根目录：

1. 更新 default 模板：`node scripts/prepare-create-kwoapp.js`
2. 进入包目录：`cd create-kwoapp`
3. 发布：`npm publish`（需先 `npm login`，2FA 时加 `--otp=验证码`）

`templates/default` 由准备脚本从根项目生成，`templates/minimal` 为手写维护。
