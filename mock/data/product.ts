import type { MockMethod } from 'vite-plugin-mock'
import { resultPageSuccess } from '../_utils'

const genCategoryList = () => {
  const list: any[] = []
  for (let index = 0; index < 60; index++) {
    const id = index + 1
    const sortOrder = Math.floor(Math.random() * 100)
    const status = ['上架', '下架'][Math.floor(Math.random() * 2)]
    const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 180))
    const createTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    list.push({ id, categoryName: `分类${id}`, sortOrder, status, createTime })
  }
  return list
}

const genProductList = () => {
  const list: any[] = []
  for (let index = 0; index < 120; index++) {
    const id = index + 1
    const price = Number((Math.random() * 500 + 10).toFixed(2))
    const sales = Math.floor(Math.random() * 10000)
    const stock = Math.floor(Math.random() * 5000)
    const status = ['上架', '下架'][Math.floor(Math.random() * 2)]
    const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 180))
    const addTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    list.push({ id, productName: `商品${id}`, price, sales, stock, status, addTime })
  }
  return list
}

export default [
  {
    url: '/api/category/getList',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { current = 1, pageSize = 20 } = query
      return resultPageSuccess(current, pageSize, genCategoryList())
    }
  },
  {
    url: '/api/product/getList',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { current = 1, pageSize = 20, productName, status } = query
      const all = genProductList()
      const filtered = all.filter(item => {
        const nameOk = productName ? String(item.productName).includes(String(productName)) : true
        const statusOk = status ? item.status === status : true
        return nameOk && statusOk
      })
      return resultPageSuccess(current, pageSize, filtered)
    }
  }
] as MockMethod[]
