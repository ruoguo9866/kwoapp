import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, Button, Dialog, Toast, Switch, Radio } from 'antd-mobile'
import { setToken } from '../../../components/AuthGuard'
import { Storage } from '@ruoguo/k-storage'

const THEME_STORAGE_KEY = 'theme-color'

const THEME_OPTIONS = [
  { key: 'blue', name: '默认蓝', color: '#1677ff' },
  { key: 'green', name: '翠绿', color: '#00b578' },
  { key: 'orange', name: '活力橙', color: '#ff7a45' },
  { key: 'purple', name: '紫罗兰', color: '#722ed1' },
]

const DEFAULT_COLOR = THEME_OPTIONS[0].color

function applyTheme(color) {
  document.documentElement.style.setProperty('--adm-color-primary', color)
}

function UserSetting() {
  const navigate = useNavigate()
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [themeKey, setThemeKey] = useState(() => Storage.get(THEME_STORAGE_KEY) || 'blue')

  useEffect(() => {
    const option = THEME_OPTIONS.find((t) => t.key === themeKey)
    if (option) applyTheme(option.color)
  }, [themeKey])

  const handleLogout = async () => {
    const result = await Dialog.confirm({
      content: '确定要退出登录吗？',
    })
    if (!result) return

    setLogoutLoading(true)
    setToken(null)
    Storage.remove('user-info')
    Toast.show({ content: '已退出登录', icon: 'success' })
    navigate('/login', { replace: true })
    setLogoutLoading(false)
  }

  const handleThemeChange = (key) => {
    setThemeKey(key)
    Storage.set(THEME_STORAGE_KEY, key)
    const option = THEME_OPTIONS.find((t) => t.key === key)
    if (option) {
      applyTheme(option.color)
      Toast.show({ content: `已切换为${option.name}`, icon: 'success' })
    }
  }

  return (
    <div style={{ padding: 12 }}>
      <List header="主题色" style={{ borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
        <List.Item>
          <Radio.Group value={themeKey} onChange={handleThemeChange}>
            {THEME_OPTIONS.map((opt) => (
              <Radio key={opt.key} value={opt.key} block style={{ padding: '10px 0' }}>
                <span style={{ marginRight: 8 }}>{opt.name}</span>
                <span
                  style={{
                    display: 'inline-block',
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    backgroundColor: opt.color,
                    verticalAlign: 'middle',
                  }}
                />
              </Radio>
            ))}
          </Radio.Group>
        </List.Item>
      </List>

      <Button
        block
        color='primary'
        onClick={handleLogout}
        loading={logoutLoading}
        style={{ marginTop: 12 }}
      >
        退出登录
      </Button>
    </div>
  )
}

export default UserSetting
