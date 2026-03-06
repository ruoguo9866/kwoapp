import { useEffect, useState, useRef } from 'react'
import { Card, Space, Tag, Button } from 'antd-mobile'
// k-date 是 CommonJS 导出，Vite 会在构建时转换为 ESM
// 这里用默认导入再解构出 kDate、kClock
import kDatePkg from '@ruoguo/k-date'
const { kDate, kClock } = kDatePkg

const COUNTDOWN_SECONDS = 6

function DateDemo() {
  const [now, setNow] = useState(new Date())
  const [remainingSeconds, setRemainingSeconds] = useState(0) // 0 表示未运行
  const [clockState, setClockState] = useState('idle') // idle | running
  const clockRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // 用 setInterval 驱动倒计时显示，保证每秒更新
  useEffect(() => {
    if (clockState !== 'running' || remainingSeconds <= 0) return
    const timer = setInterval(() => {
      setRemainingSeconds((s) => {
        if (s <= 1) {
          setClockState('idle')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [clockState, remainingSeconds])

  const startCountdown = () => {
    if (clockRef.current) clockRef.current.stop()
    setRemainingSeconds(COUNTDOWN_SECONDS)
    setClockState('running')
    const clock = kClock.createCountdown({
      seconds: COUNTDOWN_SECONDS,
      onTick: () => {}, // 显示由上面 setInterval 驱动
      onEnd: () => {
        setClockState('idle')
        setRemainingSeconds(0)
      },
    })
    clockRef.current = clock
    clock.start()
  }

  const stopCountdown = () => {
    if (clockRef.current) {
      clockRef.current.stop()
      clockRef.current = null
    }
    setRemainingSeconds(0)
    setClockState('idle')
  }

  useEffect(() => {
    return () => {
      if (clockRef.current) clockRef.current.stop()
    }
  }, [])

  const countdownM = Math.floor(remainingSeconds / 60)
  const countdownS = remainingSeconds % 60

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
          <div>
            <Tag color="warning">fromNow</Tag> 三天后：{kDate(now).add(3, 'day').fromNow()}
          </div>
        </Space>
      </Card>

      <Card title="倒计时示例（6秒）" style={{ marginTop: 12 }}>
        {remainingSeconds > 0 ? (
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            {countdownM.toString().padStart(2, '0')}:{countdownS.toString().padStart(2, '0')}
          </div>
        ) : (
          <div style={{ fontSize: 14, color: '#999' }}>
            {clockState == 'idle' ? '点击「开始」启动倒计时' : '准备中...'}
          </div>
        )}
        <div style={{ marginTop: 8, fontSize: 13, color: '#999' }}>状态：{clockState == 'idle' ? 'idle' : 'running'}</div>
        <Space style={{ marginTop: 8 }} wrap>
          <Button size="small" color="primary" onClick={startCountdown} disabled={clockState === 'running'}>
            开始
          </Button>
          <Button size="small" onClick={stopCountdown} disabled={clockState !== 'running'}>
            停止
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default DateDemo

