import type { MockMethod } from 'vite-plugin-mock'
import { resultPageSuccess } from '../_utils'

const genReportList = () => {
  const list: any[] = []
  // 生成近180天的每日汇总
  for (let index = 0; index < 180; index++) {
    const date = new Date(Date.now() - index * 24 * 60 * 60 * 1000)
    const dayStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}`
    const orderCount = Math.floor(Math.random() * 120) + 10
    const userCount = Math.floor(Math.random() * 300) + 30
    const flowAmount = Number((orderCount * (Math.random() * 40 + 30)).toFixed(2))
    const discountAmount = Number((flowAmount * Math.random() * 0.2).toFixed(2))
    const realPayAmount = Number((flowAmount - discountAmount).toFixed(2))
    const avgPayAmount = Number((realPayAmount / Math.max(userCount, 1)).toFixed(2))
    const avgOrderAmount = Number((realPayAmount / Math.max(orderCount, 1)).toFixed(2))

    list.push({
      id: index + 1,
      date: dayStr,
      flowAmount,
      discountAmount,
      realPayAmount,
      orderCount,
      userCount,
      avgPayAmount,
      avgOrderAmount
    })
  }
  return list
}

export default [
  {
    url: '/api/report/getList',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { current = 1, pageSize = 20 } = query
      return resultPageSuccess(current, pageSize, genReportList())
    }
  }
] as MockMethod[]
