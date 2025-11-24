import { lazy } from '@loadable/component'
import type { RouteObject } from '../types'
import { LayoutGuard } from '../guard'
import { LazyLoad } from '@/components/LazyLoad'
import { AppstoreOutlined } from '@ant-design/icons'

const ProductRoute: RouteObject = {
  path: '/product',
  name: 'Product',
  element: <LayoutGuard />,
  meta: {
    title: '商品中心',
    affix: true,
    icon: <AppstoreOutlined />,
    orderNo: 5
  },
  children: [
    {
      path: 'list',
      name: 'ProductList',
      element: LazyLoad(lazy(() => import('@/views/product/list'))),
      meta: {
        title: '商品管理',
        key: 'productList'
      }
    },
    {
      path: 'category',
      name: 'ProductCategory',
      element: LazyLoad(lazy(() => import('@/views/product/category'))),
      meta: {
        title: '商品分类',
        key: 'productCategory'
      }
    }
  ]
}

export default ProductRoute
