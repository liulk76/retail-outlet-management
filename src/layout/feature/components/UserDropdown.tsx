import type { MenuProps } from 'antd'
import { Space, Dropdown, Avatar } from 'antd'
import { PoweroffOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { getAuthCache, clearAuthCache } from '@/utils/auth'
import { TOKEN_KEY } from '@/enums/cacheEnum'
import { useAppDispatch, useAppSelector } from '@/stores'
import { useMessage } from '@/hooks/web/useMessage'
import { supabase } from '@/services/supabaseClient'
import { resetState } from '@/stores/modules/user'
import { getShopSetting } from '@/services/shopSupabase'
import { setShopSetting } from '@/stores/modules/shop'
import { useEffect } from 'react'

export default function UserDropdown() {
  const shopSetting = useAppSelector(state => (state as any).shop?.setting)
  const items: MenuProps['items'] = [
    // {
    //   key: 'lock',
    //   label: (
    //     <Space size={4}>
    //       <LockOutlined rev={undefined} />
    //       <span>锁定屏幕</span>
    //     </Space>
    //   )
    // },
    {
      key: 'logout',
      label: (
        <Space size={4}>
          <PoweroffOutlined rev={undefined} />
          <span>退出登录</span>
        </Space>
      )
    }
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'lock':
        handleLock()
        break
      case 'logout':
        handleLogout()
        break
    }
  }

  const navigate = useNavigate()
  const { createMessage } = useMessage()
  const { createConfirm } = useMessage()

  const dispatch = useAppDispatch()
  const { token } = useAppSelector(state => state.user)
  const getToken = (): string => {
    return token || getAuthCache<string>(TOKEN_KEY)
  }

  const getShopInfo = async () => {
    const setting = await getShopSetting()
    if (setting) {
      dispatch(setShopSetting({ setting }))
    }
  }

  useEffect(() => {
    getShopInfo()
  }, [])

  const handleLock = () => {}

  const handleLogout = () => {
    createConfirm({
      iconType: 'warning',
      title: <span>温馨提醒</span>,
      content: <span>是否确认退出系统?</span>,
      onOk: async () => {
        await logoutAction(true)
      }
    })
  }

  const logoutAction = async (goLogin = false) => {
    if (getToken()) {
      try {
        await supabase.auth.signOut()
      } catch (error) {
        createMessage.error('注销失败!')
      }
    }
    dispatch(resetState())
    clearAuthCache()
    // eslint-disable-next-line
    goLogin && navigate('/login')
  }

  return (
    <Dropdown menu={{ items, onClick }} placement='bottomRight' arrow>
      <span className='flex-center' style={{ cursor: 'pointer', height: 24 }}>
        {shopSetting?.logo_url ? (
          <img
            src={shopSetting?.logo_url}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              marginRight: 8
            }}
            alt=''
          />
        ) : (
          <Avatar style={{ marginRight: 8 }} size={24} icon={<UserOutlined />} />
        )}
        {shopSetting?.name || '门店信息待设置'}
      </span>
    </Dropdown>
  )
}
