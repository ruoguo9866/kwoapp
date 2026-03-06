import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Form, Input, Toast } from 'antd-mobile'
import { setToken } from '../../components/AuthGuard'
import { userApi } from '../../services/api'
import { Storage } from '@ruoguo/k-storage'
function Login() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  //获取 from 参数并解码，如果不存在或为登录页则默认跳转到首页
  const fromParam = searchParams.get('from')
  let from = '/'
  if (fromParam) {
    try {
      from = decodeURIComponent(fromParam)
      // 防止循环跳转：如果 from 是登录页，则跳转到首页
      if (from.startsWith('/Login')) {
        from = '/'
      }
    } catch (e) {
      from = '/'
    }
  }
  const [loading, setLoading] = useState(false)

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const res = await userApi.login(values)
      if (res?.code === 0 && res?.data?.token) {
        setToken(res.data.token)
        Storage.set('footerBar', res.data.footerBar)
        Toast.show({ content: res.msg || '登录成功', icon: 'success' })
        navigate(from, { replace: true })
      } else {
        console.log(res);
        
        Toast.show({ content: res?.msg || '登录失败', icon: 'fail' })
      }
    } catch (e) {
      console.log(e);
      
      Toast.show({ content: '请求失败', icon: 'fail' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>登录</h2>
      <Form
        onFinish={onFinish}
        footer={
          <Button block type="submit" color="primary" loading={loading}>
            登录
          </Button>
        }
      >
        <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
          <Input placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true }]}>
          <Input type="password" placeholder="请输入密码" />
        </Form.Item>
      </Form>
    </div>
  )
}

export default Login