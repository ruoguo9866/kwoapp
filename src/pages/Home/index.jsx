import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Grid, Toast, Tag } from 'antd-mobile'
import { CalendarOutline, LinkOutline } from 'antd-mobile-icons'
import { kDate } from '@ruoguo/k-date'
import { transFun, uri } from '@ruoguo/k-uri'
import { homeApi } from '../../services/api'

function Home() {
  const navigate = useNavigate()
  const [now, setNow] = useState(new Date())
  const [home, setHome] = useState({ banner: [], productions: [] })

  useEffect(() => {
    // 实时时间显示，每秒刷新一次
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await homeApi.getHomeInfo()
        if (res?.code === 0) {
          setHome(res.data || { banner: [], productions: [] })
        } else {
          Toast.show({ content: res?.msg || '获取首页信息失败', icon: 'fail' })
        }
      } catch (e) {
        Toast.show({ content: '请求失败', icon: 'fail' })
      }
    }
    fetchData()
  }, [])

  // k-date 示例
  const formatted = kDate(now).format('YYYY-MM-DD HH:mm:ss')
  const twoDaysAgo = kDate(now).subtract(2, 'day').fromNow()

  // k-uri 示例
  const queryStr = transFun({ from: 'home', ts: String(now.getTime()) })
  // k-uri 的 setUrl 内部直接 new URL(url)，这里给它传绝对地址，避免 Invalid URL
  const baseDemoUrl = `${window.location.origin}/demo?foo=bar`
  const sampleUrl = uri.setUrl(baseDemoUrl, {
    type: 'set',
    params: 'extra',
    value: '1',
  })

  const handleOpenDemo = (url, name) => {
    // 内部路由跳转
    if (url?.startsWith('/')) {
      const titleQuery = name ? `?title=${encodeURIComponent(name)}` : ''
      navigate(`${url}${titleQuery}`)
    } else {
      Toast.show({ content: '暂不支持的示例链接', icon: 'fail' })
    }
  }

  return (
    <div style={{ padding: 12 }}>
      {/* 顶部时间与欢迎语：k-date 示例 */}
      <Card
        title={
          <span>
            <CalendarOutline style={{ marginRight: 8 }} />
            今天
          </span>
        }
        style={{ marginBottom: 12 }}
      >
        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{formatted}</div>
        <div style={{ fontSize: 13, color: '#999' }}>两天前：{twoDaysAgo}</div>
      </Card>

      {/* k-uri 示例 */}
      <Card
        title={
          <span>
            <LinkOutline style={{ marginRight: 8 }} />
            链接 & 参数工具（k-uri）
          </span>
        }
        style={{ marginBottom: 12 }}
      >
        <div style={{ fontSize: 13, marginBottom: 4 }}>
          <div>
            <Tag color="primary" style={{ marginRight: 4 }}>
              transFun
            </Tag>
            对象转查询串：<code>{queryStr}</code>
          </div>
          <div style={{ marginTop: 4 }}>
            <Tag color="success" style={{ marginRight: 4 }}>
              setUrl
            </Tag>
            修改 URL：<code>{sampleUrl}</code>
          </div>
        </div>
      </Card>

      {/* 底部功能入口：来自 mock /api/home/info */}
      <Card title="功能示例" bodyStyle={{ padding: 0 }}>
        <Grid columns={2} gap={8} style={{ padding: 8 }}>
          {home.productions?.map((item) => (
            <Grid.Item key={item.id}>
              <div
                style={{
                  borderRadius: 8,
                  padding: '12px 10px',
                  background: '#f7f8fa',
                }}
                onClick={() => handleOpenDemo(item.url, item.name)}
              >
                <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: '#999' }}>{item.url}</div>
              </div>
            </Grid.Item>
          ))}
        </Grid>
      </Card>
    </div>
  )
}

export default Home
