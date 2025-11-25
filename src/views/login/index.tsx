import type { UserInfo } from '@/types'
import { type FC, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Form, Input, Checkbox, Button, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAppSelector, useAppDispatch } from '@/stores'
import { setToken, setUserInfo, setSessionTimeout } from '@/stores/modules/user'
import { getAuthCache } from '@/utils/auth'
import { TOKEN_KEY } from '@/enums/cacheEnum'
import { supabase } from '@/services/supabaseClient'
import classNames from 'classnames'
import styles from './index.module.less'
import logoImg from '@/assets/images/logo.png'

const LoginPage: FC = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const dispatch = useAppDispatch()

  const { token, sessionTimeout } = useAppSelector(state => state.user)

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const handleLogin = async (values: any) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email: values.email, password: values.password })
      if (error) throw error
      const session = data.session
      const user = data.user
      if (!session || !user) throw new Error('登录失败')
      dispatch(setToken(session.access_token))
      const info: UserInfo = {
        userId: user.id,
        user_id: user.id,
        username: user.email || '',
        realName: (user.user_metadata as any)?.name || user.email || '',
        avatar: (user.user_metadata as any)?.avatar_url || '',
        token: session.access_token,
        homePath: '/home'
      }
      dispatch(setUserInfo(info))
      const redirect = searchParams.get('redirect')
      if (sessionTimeout) {
        dispatch(setSessionTimeout(false))
      }
      if (redirect) {
        navigate(redirect)
      } else {
        navigate(info.homePath || '/home')
      }
      message.success('登陆成功！')
    } catch (error) {
      message.error((error as unknown as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const getToken = (): string => {
    return token || getAuthCache<string>(TOKEN_KEY)
  }

  return (
    <div className={styles['login-wrapper']}>
      <div className={styles['login-box']}>
        <div className={styles['login-box-title']}>
          <img style={{ width: 70, height: 60, marginBottom: 8 }} src={logoImg} alt='icon' />
          <p>餐饮零售管理系统</p>
        </div>
        <Form
          form={form}
          initialValues={{
            // email: '',
            // password: '123456',
            remember: true
          }}
          className={styles['login-box-form']}
          onFinish={handleLogin}
        >
          <Form.Item name='email' rules={[{ required: true, message: '请输入登录账户' }]}>
            <Input
              placeholder='请输入登录账户'
              prefix={<UserOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} rev={undefined} />}
            />
          </Form.Item>
          <Form.Item name='password' rules={[{ required: true, message: '请输入密码' }]}>
            <Input
              type='password'
              placeholder='请输入密码'
              prefix={<LockOutlined style={{ color: 'rgba(0, 0, 0, 0.25)' }} rev={undefined} />}
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name='remember' className={classNames('fl', styles['no-margin'])} valuePropName='checked'>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
            <Form.Item className={classNames('fr', styles['no-margin'])}>
              <a href=''>忘记密码？</a>
            </Form.Item>
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit' className={styles['login-btn']} loading={loading}>
              登 录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default LoginPage
