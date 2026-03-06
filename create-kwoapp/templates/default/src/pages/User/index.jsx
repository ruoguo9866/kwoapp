import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Avatar, List, Toast, Skeleton } from 'antd-mobile'
import { UserOutline, SetOutline } from 'antd-mobile-icons'
import { Storage } from '@ruoguo/k-storage'
import { userApi } from '../../services/api'

function User() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(() => Storage.get('user-info') || null)

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) setLoading(true)
      try {
        const res = await userApi.getUserInfo()
        if (res?.code === 0) {
          setUser(res.data)
          Storage.set('user-info', res.data)
        } else {
          Toast.show({ content: res?.msg || '获取用户信息失败', icon: 'fail' })
        }
      } catch (e) {
        Toast.show({ content: '请求失败', icon: 'fail' })
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {/* 头部用户卡片 */}
      <div
        style={{
          padding: '24px 16px 16px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar
          style={{ '--size': '56px', '--border-radius': '50%' }}
          src={user?.avatar || undefined}
        >
          {!user?.avatar && <UserOutline fontSize={32} />}
        </Avatar>
        <div style={{ marginLeft: 16, flex: 1 }}>
          {loading && !user ? (
            <>
              <Skeleton.Paragraph lineCount={1} animated style={{ width: 120, marginBottom: 8 }} />
              <Skeleton.Paragraph lineCount={1} animated style={{ width: 160 }} />
            </>
          ) : (
            <>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {user?.name || '未登录用户'}
              </div>
              <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                {user?.id ? (user.phone ? `手机：${user.phone}` : `ID：${user.id}`) : '请先登录后查看详细信息'}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 功能列表 */}
      <div style={{ padding: '12px 8px 80px' }}>
        <List style={{ borderRadius: 8, overflow: 'hidden' }}>
          <List.Item
            prefix={<UserOutline />}
            extra={user?.name || '-'}
            onClick={() => navigate('/user/detail')}
          >
            账号信息
          </List.Item>
          <List.Item
            prefix={<SetOutline />}
            onClick={() => navigate('/user/setting')}
          >
            设置
          </List.Item>
        </List>
      </div>
    </div>
  )
}

export default User