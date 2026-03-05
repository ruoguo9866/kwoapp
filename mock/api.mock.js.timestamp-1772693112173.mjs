// mock/api.mock.js
import { defineMock } from "vite-plugin-mock-dev-server/helper";
var api_mock_default = defineMock([
  // GET 示例
  {
    url: "/api/user/info",
    method: "GET",
    body: {
      code: 0,
      data: {
        id: 1,
        name: "mock-name-1",
        avatar: "",
        token: "mock-token-1"
      },
      msg: "\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u6210\u529F"
    }
  },
  // POST 示例
  {
    url: "/api/user/login",
    method: "POST",
    body(req) {
      const body = req.body || {};
      const { username, password } = body;
      if (username == "username2026" && password == "password2026") {
        return {
          code: 0,
          data: {
            token: "mock-token-1",
            username: "username2026",
            footerBar: [
              {
                alias: "footer.home",
                icon: "home",
                name: "\u9996\u9875",
                path: "/home",
                sort: 0,
                url: "/home"
              },
              {
                alias: "footer.user",
                icon: "user",
                name: "\u4E2A\u4EBA\u4E2D\u5FC3",
                path: "/user",
                sort: 1,
                url: "/user"
              }
            ]
          },
          msg: "\u767B\u5F55\u6210\u529F"
        };
      }
      return {
        code: 1,
        data: null,
        msg: "\u8D26\u53F7\u6216\u5BC6\u7801\u9519\u8BEF"
      };
    }
  },
  // 带动态参数的 GET
  {
    url: "/api/home/info",
    method: "GET",
    body() {
      return {
        code: 0,
        data: {
          banner: [],
          productions: [
            {
              id: 1,
              name: "kdate-demo",
              image: "",
              url: "/date-demo"
            },
            {
              id: 2,
              name: "kstorage-demo",
              image: "",
              url: "/storage-demo"
            },
            {
              id: 3,
              name: "kuri-demo",
              image: "",
              url: "/uri-demo"
            },
            {
              id: 4,
              name: "kres-demo",
              image: "",
              url: "/res-demo"
            }
          ]
        },
        msg: "\u83B7\u53D6\u5217\u8868\u6210\u529F"
      };
    }
  }
]);
export {
  api_mock_default as default
};
