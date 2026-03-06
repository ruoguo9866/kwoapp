import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import { AppOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons'
import Header from '../components/Header'
import styles from './MainLayout.module.css'

const tabs = [
  { key: '/', path: '/', title: '首页', icon: <AppOutline /> },
  { key: '/list', path: '/list', title: '列表', icon: <UnorderedListOutline /> },
  { key: '/user', path: '/user', title: '我的', icon: <UserOutline /> },
]

function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const activeKey = tabs.find((t) => t.path === location.pathname)?.key ?? tabs[0].key
  const isTabRoute = tabs.some((t) => t.path === location.pathname)

  return (
    <div className={styles.wrap}>
      <main className={styles.content}>
        {/* 子路由（非 Tab 页）显示 Header 返回上级 */}
        {!isTabRoute && <Header />}
        <Outlet />
      </main>
      {isTabRoute && (
        <TabBar
          className={styles.tabBar}
          activeKey={activeKey}
          safeArea
          onChange={(key) => navigate(key)}
        >
          {tabs.map((item) => (
            <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
          ))}
        </TabBar>
      )}
    </div>
  )
}

export default MainLayout
