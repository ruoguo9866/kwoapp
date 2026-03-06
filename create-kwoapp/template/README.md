# kwoapp

基于 React + Vite 的移动端 H5 脚手架，集成登录鉴权、Mock 接口、主题与基础页面结构。

## 技术栈

- **React 18** + **Vite 7**
- **antd-mobile 5** 组件库
- **react-router-dom 7** 路由
- **@ruoguo/k-date**、**@ruoguo/k-uri**、**@ruoguo/k-storage**、**@ruoguo/kres** 业务封装
- **vite-plugin-mock-dev-server** 本地 Mock（开发时拦截 `/api` 已配置接口）

## 脚本

```bash
npm install
npm run dev    # 开发：默认 http://localhost:8000，自动打开浏览器
npm run build  # 构建
npm run preview # 预览构建产物
npm run lint   # ESLint
```

## 目录与约定

- `src/routes/index.jsx`：手动路由表，需登录的路由由 `AuthGuard` 包裹
- `src/layouts/`：MainLayout（TabBar + 内容区）、BlankLayout（登录等独立页）
- `src/pages/`：页面组件；`User/detail`、`User/setting` 为子页
- `src/services/`：`request.js` 封装请求与 token 头；`api.js` 接口方法
- `src/components/`：Header、AuthGuard、Loading 等公共组件
- `mock/api.mock.js`：Mock 接口定义（仅开发环境生效）

## 环境变量

- `VITE_API_BASE`：接口基础路径，默认 `'/api'`。可新建 `.env` 或 `.env.local` 配置。

示例 `.env.local`：

```env
VITE_API_BASE=/api
```

## 登录与鉴权

- 未登录访问需鉴权页面会跳转 `/login`，登录成功后可根据 `from` 参数回跳
- Token 存于本地（k-storage），请求拦截器自动附加 `Authorization` 头
- 401 时清除 token 并跳转登录

## Mock 说明

- 开发时请求 `/api/*` 会先走 Mock，未在 `mock/api.mock.js` 中配置的路径会按 `vite.config.js` 的 proxy 转发到 `target`
- 当前 Mock：`/api/user/login`、`/api/user/info`、`/api/user/detail`、`/api/user/update`、`/api/home/info` 等

## 主题

- 设置页可「开启主题颜色」并选择颜色，会写入本地并在下次启动时恢复
- 通过覆盖 CSS 变量 `--adm-color-primary` 实现

---

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

会创建新目录并自动安装依赖。使用文档见 [create-kwoapp/README.md](create-kwoapp/README.md)。
