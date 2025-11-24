import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'
import { TableOutlined } from '@ant-design/icons'

const DeskRoute: RouteObject = {
  path: '/shop',
  name: 'Desk',
  element: <LayoutGuard />,
  meta: {
    title: '门店中心',
    affix: true,
    icon: <TableOutlined />,
    orderNo: 5
  },
  children: [
    {
      path: 'setting',
      name: 'Setting',
      element: LazyLoad(lazy(() => import('@/views/shop/setting'))),
      meta: {
        title: '门店设置',
        key: 'deskList'
      }
    },
    {
      path: 'desk-list',
      name: 'DeskList',
      element: LazyLoad(lazy(() => import('@/views/shop/desk/list'))),
      meta: {
        title: '桌号管理',
        key: 'deskList'
      }
    }
  ]
}

export default DeskRoute
