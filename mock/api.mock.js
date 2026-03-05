import { defineMock } from 'vite-plugin-mock-dev-server'

/**
 * Mock 接口：文件名需为 *.mock.js/ts 等，且需在 server.proxy 中有对应前缀（如 /api）
 * 请求会先匹配 mock，匹配则返回 mock 数据，否则走 proxy 转发到 target
 */
export default defineMock([
  // GET 示例
  {
    url: '/api/user/info',
    method: 'GET',
    body: {
      code: 0,
      data: {
        id: 1,
        name: 'mock-name-1',
        avatar: '',
        token: 'mock-token-1',
      },
      msg: '获取用户信息成功'
    },
  },
  // POST 示例
  {
    url: '/api/user/login',
    method: 'POST',
    body(req) {
      const body = req.body || {}
      const { username, password } = body

      // 简单账号密码校验：用户名 admin，密码 123456
      if (username == 'user2026' && password == 'psw2026') {
        return {
          code: 0,
          data: {
            token: 'mock-token-1',
            username: 'user2026',
            footerBar: [
              {
                alias: 'footer.home',
                icon: 'home',
                name: '首页',
                path: '/home',
                sort: 0,
                url: '/home',
              },
              {
                alias: 'footer.user',
                icon: 'user',
                name: '个人中心',
                path: '/user',
                sort: 1,
                url: '/user',
              },
            ],
          },
          msg: '登录成功',
        }
      }

      // 账号或密码不正确
      return {
        code: 1,
        data: null,
        msg: '账号或密码错误',
      }
    },
  },
  // 带动态参数的 GET
  {
    url: '/api/home/info',
    method: 'GET',
    body() {
      return {
        code: 0,
        data: {
          banner: [],
          productions: [
            {
              id: 1,
              name: 'kdate-demo',
              image: '',
              url: '/date-demo'
            },
            {
              id: 2,
              name: 'kuri-demo',
              image: '',
              url: '/uri-demo'
            },
          ]
        },
        msg: '获取列表成功'
      }
    },
  },
])
