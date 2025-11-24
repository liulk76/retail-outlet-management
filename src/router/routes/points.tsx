import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'
import { ShoppingOutlined } from '@ant-design/icons'

const PointsRoute: RouteObject = {
  path: '/points',
  name: 'Points',
  element: <LayoutGuard />,
  meta: {
    title: '积分商城',
    affix: true,
    icon: <ShoppingOutlined />,
    orderNo: 7
  },
  children: [
    {
      path: 'product',
      name: 'PointsProductList',
      element: LazyLoad(lazy(() => import('@/views/points/product'))),
      meta: {
        title: '商品管理',
        key: 'pointsProductList'
      }
    },
    {
      path: 'exchange',
      name: 'PointsExchangeList',
      element: LazyLoad(lazy(() => import('@/views/points/exchange'))),
      meta: {
        title: '积分兑换',
        key: 'pointsExchangeList'
      }
    }
  ]
}

export default PointsRoute
