import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Form,
  Input,
  Button,
  Avatar,
  List,
  Toast,
  Skeleton,
} from 'antd-mobile'
import { UserOutline } from 'antd-mobile-icons'
import { Storage } from '@ruoguo/k-storage'
import { userApi } from '../../../services/api'

function UserDetail() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [detail, setDetail] = useState(null)

  const loadDetail = async () => {
    setLoading(true)
    try {
      const res = await userApi.getUserDetail()
      if (res?.code === 0 && res.data) {
        setDetail(res.data)
        form.setFieldsValue({
          name: res.data.name,
          avatar: res.data.avatar,
          phone: res.data.phone ?? '',
          email: res.data.email ?? '',
        })
      } else {
        Toast.show({ content: res?.msg || '获取失败', icon: 'fail' })
      }
    } catch (e) {
      Toast.show({ content: '请求失败', icon: 'fail' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDetail()
  }, [])

  const handleFinish = async (values) => {
    setSaving(true)
    try {
      const res = await userApi.updateUserProfile(values)
      if (res?.code === 0 && res.data) {
        setDetail(res.data)
        Storage.set('user-info', res.data)
        setEditing(false)
        Toast.show({ content: res.msg || '保存成功', icon: 'success' })
      } else {
        Toast.show({ content: res?.msg || '保存失败', icon: 'fail' })
      }
    } catch (e) {
      Toast.show({ content: '请求失败', icon: 'fail' })
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    form.setFieldsValue({
      name: detail?.name,
      avatar: detail?.avatar,
      phone: detail?.phone ?? '',
      email: detail?.email ?? '',
    })
    setEditing(false)
  }

  if (loading && !detail) {
    return (
      <div style={{ padding: 16 }}>
        <Skeleton.Paragraph lineCount={4} animated />
      </div>
    )
  }

  return (
    <div style={{ padding: 12, paddingBottom: 80 }}>
      {/* 头像区 */}
      <div style={{ textAlign: 'center', padding: '24px 0 16px' }}>
        <Avatar
          style={{ '--size': '72px', '--border-radius': '50%' }}
          src={detail?.avatar || undefined}
        >
          {!detail?.avatar && <UserOutline fontSize={40} />}
        </Avatar>
      </div>

      {editing ? (
        <Form
          form={form}
          onFinish={handleFinish}
          footer={
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <Button block onClick={handleCancelEdit}>
                取消
              </Button>
              <Button block type="submit" color="primary" loading={saving}>
                保存
              </Button>
            </div>
          }
        >
          <Form.Item name="name" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
            <Input placeholder="请输入昵称" />
          </Form.Item>
          <Form.Item name="avatar" label="头像链接">
            <Input placeholder="头像 URL（选填）" />
          </Form.Item>
          <Form.Item name="phone" label="手机号">
            <Input type="tel" placeholder="请输入手机号" maxLength={11} />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[{ type: 'email', message: '请输入正确邮箱' }]}
          >
            <Input type="email" placeholder="请输入邮箱" />
          </Form.Item>
        </Form>
      ) : (
        <>
          <List header="账号信息" style={{ borderRadius: 8, overflow: 'hidden' }}>
            <List.Item extra={detail?.name || '-'}>昵称</List.Item>
            <List.Item extra={detail?.phone || '-'}>手机号</List.Item>
            <List.Item extra={detail?.email || '-'}>邮箱</List.Item>
          </List>
          <Button
            block
            color="primary"
            style={{ marginTop: 16 }}
            onClick={() => setEditing(true)}
          >
            编辑资料
          </Button>
        </>
      )}
    </div>
  )
}

export default UserDetail
