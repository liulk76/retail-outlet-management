import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'
import { GiftOutlined } from '@ant-design/icons'

const ActivityRoute: RouteObject = {
  path: '/activity',
  name: 'Activity',
  element: <LayoutGuard />,
  meta: {
    title: '活动中心',
    affix: true,
    icon: <GiftOutlined />,
    orderNo: 6
  },
  children: [
    {
      path: 'recharge',
      name: 'RechargeList',
      element: LazyLoad(lazy(() => import('@/views/activity/recharge'))),
      meta: {
        title: '充值记录',
        key: 'rechargeList'
      }
    },
    {
      path: 'campaign',
      name: 'CampaignList',
      element: LazyLoad(lazy(() => import('@/views/activity/campaign'))),
      meta: {
        title: '充值活动',
        key: 'campaignList'
      }
    }
  ]
}

export default ActivityRoute
