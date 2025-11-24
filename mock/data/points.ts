import type { MockMethod } from 'vite-plugin-mock'
import { Random } from 'mockjs'
import { resultPageSuccess } from '../_utils'

const getPhone = () => {
  const prefixList = [135, 136, 137, 138, 139, 155, 158, 183, 185, 189]
  const randomNum = Math.floor(Math.random() * 10)
  const phoneStr = prefixList[randomNum] + Math.random().toString().slice(-8)
  return Number(phoneStr)
}

const genPointsProducts = () => {
  const list: any[] = []
  for (let index = 0; index < 160; index++) {
    const id = index + 1
    const productName = `积分商品${id}`
    const stock = Math.floor(Math.random() * 1000)
    const marketPrice = Number((Math.random() * 500 + 20).toFixed(2))
    const needPoints = Math.floor(marketPrice * (5 + Math.random() * 10))
    const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 180))
    const addDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    const status = ['启用', '停用'][Math.floor(Math.random() * 2)]
    list.push({ id, productName, stock, marketPrice, needPoints, addDate, status })
  }
  return list
}

const genPointsExchange = () => {
  const list: any[] = []
  for (let index = 0; index < 220; index++) {
    const id = index + 1
    const orderCode = `PEX${String(id).padStart(6, '0')}`
    const memberName = Random.cname()
    const phone = getPhone()
    const productName = `积分商品${Math.floor(Math.random() * 160) + 1}`
    const usePoints = Math.floor(Math.random() * 10000 + 100)
    const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 120))
    const exchangeDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    const remark = Math.random() > 0.7 ? '紧急配送' : '—'
    list.push({ id, orderCode, memberName, phone, productName, usePoints, exchangeDate, remark })
  }
  return list
}

export default [
  {
    url: '/api/points/product/getList',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { current = 1, pageSize = 20, productName } = query
      const all = genPointsProducts()
      const filtered = all.filter(item => {
        const nameOk = productName ? String(item.productName).includes(String(productName)) : true
        return nameOk
      })
      return resultPageSuccess(current, pageSize, filtered)
    }
  },
  {
    url: '/api/points/exchange/getList',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { current = 1, pageSize = 20, memberName, phone } = query
      const all = genPointsExchange()
      const filtered = all.filter(item => {
        const nameOk = memberName ? String(item.memberName).includes(String(memberName)) : true
        const phoneOk = phone ? String(item.phone).includes(String(phone)) : true
        return nameOk && phoneOk
      })
      return resultPageSuccess(current, pageSize, filtered)
    }
  }
] as MockMethod[]
