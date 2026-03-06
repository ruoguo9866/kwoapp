import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { mockDevServerPlugin } from 'vite-plugin-mock-dev-server'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true, // 局域网可访问
    port: 8000, // 启动端口
    open: true, 
    proxy: {
      // mock 会拦截 /api 下已配置的接口，未匹配的请求会转发到 target
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  plugins: [mockDevServerPlugin(), react()],
})

