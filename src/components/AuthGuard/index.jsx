import { Navigate, useLocation } from 'react-router-dom'
import { Storage } from '@ruoguo/k-storage'

const TOKEN_KEY = 'token'
export function getToken() {
  return Storage.get(TOKEN_KEY)
}

export function setToken(value) {
  if (value) Storage.set(TOKEN_KEY, value)
  else Storage.remove(TOKEN_KEY)
}

/**
 * 校验 token 是否存在，不存在则跳转登录页，并带上 from 以便登录后返回
 */
function AuthGuard({ children }) {
  const location = useLocation()
  const token = getToken()
  if (!token) {
    const from = location.pathname + location.search
    return <Navigate to={from ? `/login?from=${encodeURIComponent(from)}` : '/login'} replace />
  }

  return children
}

export default AuthGuard
