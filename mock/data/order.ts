import type { MockMethod } from 'vite-plugin-mock'
import { Random } from 'mockjs'
import { resultPageSuccess } from '../_utils'

const getPhone = () => {
  const prefixList = [135, 136, 137, 138, 139, 155, 158, 183, 185, 189]
  const randomNum = Math.floor(Math.random() * 10)
  const phoneStr = prefixList[randomNum] + Math.random().toString().slice(-8)
  return Number(phoneStr)
}

const genOrderList = () => {
  const list: any[] = []
  const today = new Date()
  const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(
    today.getDate()
  ).padStart(2, '0')}`
  for (let index = 0; index < 200; index++) {
    const seq = String(index + 1).padStart(4, '0')
    const id = index + 1
    const baseAmount = Math.floor(Math.random() * 500) + 50
    const discount = Math.floor(Math.random() * 50)
    const payAmount = Math.max(baseAmount - discount, 0)
    const statusRand = Math.random() * 100
    const orderStatus = statusRand < 2 ? 3 : [0, 1, 2][Math.floor(Math.random() * 3)]
    const typeRand = Math.random() * 100
    const orderType = typeRand < 80 ? 0 : 1
    const r = Math.random() * 100
    const payMethod = r < 35 ? '微信' : r < 75 ? '支付宝' : r < 90 ? '现金' : '会员余额'
    const userName = Random.cname()
    const phone = getPhone()
    const userCount = [1, 2, 3, 4, 5, 6][Math.floor(Math.random() * 6)]
    const tableNumber = ['A01', 'A02', 'A03', 'B01', 'B02', 'C01', 'C02', 'D01'][Math.floor(Math.random() * 8)]
    const now = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30))
    const createTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const payTime = orderStatus === 1 ? createTime : ''

    list.push({
      id,
      orderNumber: `ORD${dateStr}${seq}`,
      orderStatus,
      orderType,
      orderAmount: baseAmount,
      discountAmount: discount,
      payAmount,
      payMethod,
      payTime,
      tableNumber,
      userInfo: `${userName}/${phone}`,
      userCount,
      createTime
    })
  }
  return list
}

export default [
  {
    url: '/api/order/list',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { current = 1, pageSize = 20 } = query
      return resultPageSuccess(current, pageSize, genOrderList())
    }
  }
] as MockMethod[]
