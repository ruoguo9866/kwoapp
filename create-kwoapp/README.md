# create-kwoapp

通过 npm 快速创建基于 **React + Vite** 的移动端 H5 项目模板（kwoapp 脚手架）。

## 使用方式

### 创建新项目（推荐）

```bash
npm create kwoapp
```

按提示输入项目目录名（直接回车则使用默认名 `kwoapp`），会在当前目录下创建子目录并自动执行 `npm install`。

### 指定项目名

```bash
npm create kwoapp my-app
```

会在当前目录创建 `my-app` 文件夹并安装依赖。

### 使用 npx

```bash
npx create-kwoapp
npx create-kwoapp my-app
```

## 创建完成后的步骤

```bash
cd my-app      # 进入项目目录
npm run dev    # 启动开发服务（默认 http://localhost:8000，自动打开浏览器）
```

## 模板包含内容

- **技术栈**：React 18、Vite 7、antd-mobile 5、react-router-dom 7
- **业务库**：@ruoguo/k-date、k-uri、k-storage、kres
- **功能**：登录鉴权（AuthGuard）、Mock 接口、主题切换、TabBar 布局、账号/设置/详情页示例
- **脚本**：`dev` / `build` / `preview` / `lint`

详细说明见生成项目内的 `README.md`。

## 环境要求

- Node.js >= 18.0.0

