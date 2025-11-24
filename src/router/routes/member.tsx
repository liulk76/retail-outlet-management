import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'
import { UserOutlined } from '@ant-design/icons'

const MemberRoute: RouteObject = {
  path: '/member',
  name: 'Member',
  element: <LayoutGuard />,
  meta: {
    title: '会员中心',
    affix: true,
    icon: <UserOutlined />,
    orderNo: 3
  },
  children: [
    {
      path: 'list',
      name: 'MemberList',
      element: LazyLoad(lazy(() => import('@/views/member/list'))),
      meta: {
        title: '会员管理',
        key: 'memberList'
      }
    }
  ]
}

export default MemberRoute
