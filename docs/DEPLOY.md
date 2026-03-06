# 部署发布手册

本文档说明如何将 **kwoapp** 脚手架以 npm 包 `create-kwoapp` 的形式发布，以及发布后他人如何使用。

---

## 一、发布前准备

### 1. 环境要求

- Node.js >= 18
- 已注册 [npm](https://www.npmjs.com/) 账号
- 若使用 scope（如 `@myorg/create-kwoapp`），需在 npm 创建对应组织或使用付费账号发布 unscoped 包

### 2. 检查包名

- 当前包名：**create-kwoapp**（unscoped）
- 在 [npm 官网](https://www.npmjs.com/) 搜索 `create-kwoapp`，若已被占用需在 `create-kwoapp/package.json` 中修改 `name`（例如改为 `create-kwoapp-mobile` 或 `@你的用户名/create-kwoapp`）

### 3. 可选：使用 scope

若希望包名为 `@myorg/create-kwoapp`：

1. 在 `create-kwoapp/package.json` 中设置 `"name": "@myorg/create-kwoapp"`
2. 首次发布需加 `--access public`（scoped 包默认私有）

---

## 二、发布步骤

在项目**根目录**（`kwoapp/`）按顺序执行。

### 步骤 1：更新模板快照

将当前项目（排除 node_modules、dist 等）复制到 `create-kwoapp/templates/default`，保证发布出去的完整版模板是最新代码。极简版 `templates/minimal` 为手写维护，无需脚本生成。

```bash
npm run prepare:create-kwoapp
```

或直接：

```bash
node scripts/prepare-create-kwoapp.js
```

确认控制台输出：`Template prepared at create-kwoapp/templates/default`。

### 步骤 2：登录 npm（未登录时）

```bash
npm login
```

按提示输入 npm 用户名、密码、邮箱及一次性验证码（若开启 2FA）。

验证是否登录成功：

```bash
npm whoami
```

### 步骤 3：进入脚手架包目录并发布

```bash
cd create-kwoapp
npm publish
```

若账号开启了 **双重认证（2FA）**，需携带一次性验证码（来自 Authenticator 应用或短信）：

```bash
npm publish --otp=123456
```

将 `123456` 替换为当前 6 位验证码。若使用 scope 且首次发布：

```bash
npm publish --access public --otp=123456
```

### 步骤 4：确认发布结果

- 控制台会输出包名与版本，例如：`+ create-kwoapp@1.0.0`
- 在浏览器打开 `https://www.npmjs.com/package/create-kwoapp` 可查看包信息与 README

---

## 三、发布后：他人如何使用

用户无需克隆本仓库，只需执行：

```bash
npm create kwoapp
```

按提示**选择模板**（default 完整版 / minimal 极简版）、**输入项目目录名**，创建完成后进入目录并启动：

```bash
cd my-app
npm run dev
```

等价写法：

```bash
npx create-kwoapp
npx create-kwoapp my-app
```

---

## 四、后续版本发布（更新脚手架）

1. 在**根目录**修改或开发项目，确认功能与文档无误。
2. 在 `create-kwoapp/package.json` 中**升级版本号**（如 `1.0.0` → `1.0.1` 或 `1.1.0`），遵循[语义化版本](https://semver.org/lang/zh-CN/)。
3. 在根目录执行：

   ```bash
   npm run prepare:create-kwoapp
   cd create-kwoapp
   npm publish
   ```

---

## 五、常见问题

| 问题 | 处理方式 |
|------|----------|
| `npm publish` 报 403 / 未登录 | 在项目或任意目录执行 `npm login`，再执行 `npm publish` |
| 包名已被占用 | 修改 `create-kwoapp/package.json` 的 `name`，或使用 scope |
| 2FA 验证失败 / 提示需一次性密码 | 使用 `npm publish --otp=你的6位验证码`，验证码来自 Authenticator 或短信，需在有效期内输入 |
| 发布后用户拉不到最新版 | 确认版本号已提升且已执行 `npm publish`；用户可先执行 `npm cache clean --force` 再重试 |
| 想撤销刚发布的版本 | 72 小时内可 `npm unpublish create-kwoapp@版本号 --force`（慎用，可能影响依赖该版本的用户） |

---

## 六、一键发布脚本（可选）

在项目根目录可增加脚本，便于本地一条命令完成「更新模板 + 发布」（需已登录 npm）：

**package.json（根目录）** 中增加：

```json
"scripts": {
  "publish:create-kwoapp": "node scripts/prepare-create-kwoapp.js && cd create-kwoapp && npm publish"
}
```

执行：

```bash
npm run publish:create-kwoapp
```

注意：版本号仍需在 `create-kwoapp/package.json` 中手动修改后再执行上述脚本。

## 发布为 npm 脚手架

本项目可发布为 `create-kwoapp`，供他人通过 `npm create kwoapp` 一键创建新项目。

**完整步骤与常见问题见 [部署发布手册](docs/DEPLOY.md)。**

### 发布前准备

1. **更新模板快照**（将当前项目拷贝到 `create-kwoapp/template`）：

   ```bash
   node scripts/prepare-create-kwoapp.js
   ```

2. **进入脚手架包目录**：

   ```bash
   cd create-kwoapp
   ```

3. **登录 npm**（未登录时）：

   ```bash
   npm login
   ```

4. **发布**：

   ```bash
   npm publish
   ```

发布后，任何人可执行：

```bash
npm create kwoapp
# 或
npm create kwoapp my-app
```