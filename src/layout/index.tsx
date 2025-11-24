import { ConfigProvider, Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import LayoutMenu from './menu'
import LayoutHeader from './header'
import LayoutTags from './tags'
import { AppLogo } from '@/components/AppLogo'
import './index.less'
import { useTitle } from '@/hooks/web/useTitle'
import { useAppSelector } from '@/stores'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')

export const BasicLayout = () => {
  useTitle()
  const { Sider, Content } = Layout
  const { state } = useLocation()
  const { key = 'key' } = state || {}
  const getMenuFold = useAppSelector(st => st.app.appConfig?.menuSetting?.menuFold)

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 4
        },
        components: {
          Form: {
            itemMarginBottom: 16
          },
          Divider: {
            textPaddingInline: '16px 0'
          }
        }
      }}
    >
      <Layout className='layout_wrapper'>
        <Sider
          width={210}
          trigger={null}
          collapsed={getMenuFold}
          style={{ height: '100vh', borderRight: '1px solid #f0f0f0', overflowY: 'auto' }}
          theme='light'
        >
          <AppLogo />
          <LayoutMenu />
        </Sider>
        <Layout>
          <LayoutHeader />
          <Layout id='mainCont' style={{ overflowY: 'auto' }}>
            {/* <LayoutTags /> */}
            <Content>
              <Outlet key={key} />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
