import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'
import { UnorderedListOutlined } from '@ant-design/icons'

// table module page
const OrderRoute: RouteObject = {
  path: '/order',
  name: 'Order',
  element: <LayoutGuard />,
  meta: {
    title: '订单中心',
    affix: true,
    icon: <UnorderedListOutlined />,
    orderNo: 2
  },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      element: LazyLoad(lazy(() => import('@/views/order/list'))),
      meta: {
        title: '订单管理',
        key: 'orderList'
      }
    }
  ]
}

export default OrderRoute
