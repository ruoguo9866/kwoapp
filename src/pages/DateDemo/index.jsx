import { useEffect, useState } from 'react'
import { Card, Space, Tag, Button } from 'antd-mobile'
// k-date 是 CommonJS 导出，Vite 会在构建时转换为 ESM
// 这里用默认导入再解构出 kDate、kClock
import kDatePkg from '@ruoguo/k-date'
const { kDate, kClock } = kDatePkg

function DateDemo() {
  const [now, setNow] = useState(new Date())
  const [countdown, setCountdown] = useState(null)
  const [clockState, setClockState] = useState('idle')

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const clock = kClock.createCountdown({
      seconds: 90,
      onTick: (m) => {
        setCountdown(m)
        setClockState('running')
      },
      onEnd: () => {
        setClockState('idle')
      },
    })
    clock.start()
    return () => clock.stop()
  }, [])

  const today = kDate(now).format('YYYY-MM-DD')
  const nextWeek = kDate(now).add(7, 'day').format('YYYY-MM-DD')
  const monthStart = kDate(now).startOf('month').format('YYYY-MM-DD')
  const monthEnd = kDate(now).endOf('month').format('YYYY-MM-DD')

  return (
    <div style={{ padding: 12 }}>
      <Card title="当前时间">
        <Space direction="vertical" block>
          <div>
            <Tag color="primary">format</Tag> {kDate(now).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <div>
            <Tag color="success">fromNow</Tag> {kDate(now).subtract(2, 'day').fromNow()}
          </div>
        </Space>
      </Card>

      <Card title="日期计算" style={{ marginTop: 12 }}>
        <Space direction="vertical" block>
          <div>
            今天：<strong>{today}</strong>
          </div>
          <div>一周后：{nextWeek}</div>
          <div>
            本月范围：{monthStart} ~ {monthEnd}
          </div>
        </Space>
      </Card>

      <Card title="倒计时示例（90秒）" style={{ marginTop: 12 }}>
        {countdown ? (
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {countdown.minutes.toString().padStart(2, '0')}:
            {countdown.seconds.toString().padStart(2, '0')}
          </div>
        ) : (
          '准备中...'
        )}
        <div style={{ marginTop: 8, fontSize: 13, color: '#999' }}>状态：{clockState}</div>
        <div style={{ marginTop: 8 }}>
          <Button size="small" disabled>
            示例只读，控制按钮可按需补充
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default DateDemo

