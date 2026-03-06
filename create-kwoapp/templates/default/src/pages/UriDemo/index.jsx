import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Card, Space, Input, Button, Tag, List, Toast } from 'antd-mobile'
import { transFun, uri } from '@ruoguo/k-uri'

function UriDemo() {
  const navigate = useNavigate()
  const location = useLocation()

  const [obj, setObj] = useState({ a: '1', b: '2' })
  const [url, setUrl] = useState(window.location.href)
  const [paramKey, setParamKey] = useState('foo')
  const [paramValue, setParamValue] = useState('bar')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('上海市人民广场')

  /** 中国大陆 11 位手机号：1 开头，第二位 3-9 */
  const isValidPhone = useMemo(() => /^1[3-9]\d{9}$/.test(phone.trim()), [phone])
  const phoneError = phone.trim() && !isValidPhone ? '请输入正确的11位手机号' : ''

  const queryStr = useMemo(() => transFun(obj), [obj])
  const valueFromUrl = useMemo(() => uri.getValue(url, paramKey) ?? '', [url, paramKey])
  const newUrl = useMemo(
    () => uri.setUrl(url, { type: 'set', params: paramKey, value: paramValue }),
    [url, paramKey, paramValue],
  )

  const handlePushInternal = () => {
    uri.push({
      res: { url: '/list?from=uri-demo', name: '列表页' },
      nav: (to) => navigate(to),
    })
  }

  return (
    <div style={{ padding: 12 }}>
      <Card title="对象转查询串 transFun">
        <Space direction="vertical" block>
          <List>
            <List.Item
              style={{ alignItems: 'center' }}
              extra={
                <Input
                  value={obj.a}
                  onChange={(v) => setObj((prev) => ({ ...prev, a: v }))}
                  placeholder="a"
                  style={{ flex: 1, minWidth: 0 }}
                />
              }
            >
              a：
            </List.Item>
            <List.Item
              style={{ alignItems: 'center' }}
              extra={
                <Input
                  value={obj.b}
                  onChange={(v) => setObj((prev) => ({ ...prev, b: v }))}
                  placeholder="b"
                  style={{ flex: 1, minWidth: 0 }}
                />
              }
            >
              b：
            </List.Item>
          </List>
          <div style={{ fontSize: 13 }}>
            <Tag color="primary">结果</Tag> <code style={{ wordBreak: 'break-all' }}>{queryStr}</code>
          </div>
          <Button
            size="small"
            onClick={() => {
              navigator.clipboard.writeText(queryStr).then(
                () => Toast.show({ content: '已复制查询串', icon: 'success' }),
                () => Toast.show({ content: '复制失败', icon: 'fail' }),
              )
            }}
          >
            复制查询串
          </Button>
        </Space>
      </Card>

      <Card title="setUrl / getValue" style={{ marginTop: 12 }}>
        <Space direction="vertical" block>
          <Input
            value={url}
            onChange={setUrl}
            placeholder="输入一个 URL，例如 https://example.com?foo=bar"
          />
          <Space align="center">
            <Input
              style={{ flex: 1 }}
              value={paramKey}
              onChange={setParamKey}
              placeholder="参数名"
            />
            <Input
              style={{ flex: 1 }}
              value={paramValue}
              onChange={setParamValue}
              placeholder="新值"
            />
          </Space>
          <div style={{ fontSize: 13 }}>
            <Tag color="primary">getValue</Tag> 当前值：<code>{valueFromUrl || '空'}</code>
          </div>
          <div style={{ fontSize: 13 }}>
            <Tag color="success">setUrl</Tag> 新 URL：<code style={{ wordBreak: 'break-all' }}>{newUrl}</code>
          </div>
          <Button
            size="small"
            onClick={() => {
              navigator.clipboard.writeText(newUrl).then(
                () => Toast.show({ content: '已复制到剪贴板', icon: 'success' }),
                () => Toast.show({ content: '复制失败', icon: 'fail' }),
              )
            }}
          >
            复制新 URL
          </Button>
        </Space>
      </Card>

      <Card title="push：站内跳转" style={{ marginTop: 12 }}>
        <Space direction="vertical" block>
          <div style={{ fontSize: 13, color: '#999' }}>
            当前路径：<code>{location.pathname + location.search}</code>
          </div>
          <Button size="small" color="primary" onClick={handlePushInternal}>
            跳转到 /list（附带 title 和 from）
          </Button>
        </Space>
      </Card>

      <Card title="location / tel（请在真机上体验）" style={{ marginTop: 12 }}>
        <Space direction="vertical" block>
          <Input value={address} onChange={setAddress} placeholder="高德地图搜索地址" />
          <Button
            size="small"
            onClick={() => {
              Toast.show('将通过 uri.location 跳转高德地图')
              uri.location(address)
            }}
          >
            打开高德地图
          </Button>
          <Input
            value={phone}
            onChange={setPhone}
            placeholder="请输入手机号"
            type="tel"
            maxLength={11}
          />
          {phoneError ? (
            <div style={{ fontSize: 12, color: 'var(--adm-color-danger, #ff3141)' }}>{phoneError}</div>
          ) : null}
          <Button
            size="small"
            disabled={!phone.trim() || !isValidPhone}
            onClick={() => {
              Toast.show('将通过 uri.tel 唤起拨号')
              uri.tel(phone)
            }}
          >
            拨打电话
          </Button>
        </Space>
      </Card>
    </div>
  )
}

export default UriDemo

