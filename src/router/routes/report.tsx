import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'
import { LineChartOutlined, UnorderedListOutlined } from '@ant-design/icons'

// table module page
const OrderRoute: RouteObject = {
  path: '/report',
  name: 'Report',
  element: <LayoutGuard />,
  meta: {
    title: '营收汇总报表',
    affix: true,
    icon: <LineChartOutlined />,
    hideChildrenInMenu: true,
    orderNo: 1
  },
  children: [
    {
      path: '',
      name: 'ReportList',
      element: LazyLoad(lazy(() => import('@/views/report/list'))),
      meta: {
        title: '运营汇总',
        key: 'reportList'
      }
    }
  ]
}

export default OrderRoute
