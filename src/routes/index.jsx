import { Routes, Route, Navigate } from 'react-router-dom'
import AuthGuard from '../components/AuthGuard'
import MainLayout from '../layouts/MainLayout'
import BlankLayout from '../layouts/BlankLayout'
import Home from '../pages/Home'
import List from '../pages/List'
import User from '../pages/User'
import Login from '../pages/Login'
import DateDemo from '../pages/DateDemo'
import UriDemo from '../pages/UriDemo'

/**
 * 手动路由表：
 * - 使用 MainLayout 的为带底部 TabBar 的页面，需通过 AuthGuard 校验 token
 * - 使用 BlankLayout 的为无 TabBar 的独立页（如登录）
 */
function RouterConfig() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route index element={<Home />} />
        <Route path="list" element={<List />} />
        <Route path="user" element={<User />} />
        <Route path="date-demo" element={<DateDemo />} />
        <Route path="uri-demo" element={<UriDemo />} />
      </Route>
      <Route path="/login" element={<BlankLayout />}>
        <Route index element={<Login />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default RouterConfig

