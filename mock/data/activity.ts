import type { MockMethod } from 'vite-plugin-mock'
import { Random } from 'mockjs'
import { resultPageSuccess } from '../_utils'

const getPhone = () => {
  const prefixList = [135, 136, 137, 138, 139, 155, 158, 183, 185, 189]
  const randomNum = Math.floor(Math.random() * 10)
  const phoneStr = prefixList[randomNum] + Math.random().toString().slice(-8)
  return Number(phoneStr)
}

const genRechargeRecords = () => {
  const list: any[] = []
  const payMethods = ['支付宝', '微信', '现金', '会员余额']
  for (let index = 0; index < 200; index++) {
    const id = index + 1
    const orderCode = `RCG${String(id).padStart(6, '0')}`
    const memberName = Random.cname()
    const phone = getPhone()
    const rechargeAmount = Number((Math.random() * 1000 + 50).toFixed(2))
    const arrivalAmount = Number((rechargeAmount * (0.9 + Math.random() * 0.2)).toFixed(2))
    const payMethod = payMethods[Math.floor(Math.random() * payMethods.length)]
    const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 180))
    const rechargeDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    list.push({
      id,
      rechargeOrderCode: orderCode,
      memberName,
      phone,
      rechargeAmount,
      arrivalAmount,
      rechargeDate,
      payMethod
    })
  }
  return list
}

const genRechargeCampaigns = () => {
  const list: any[] = []
  for (let index = 0; index < 120; index++) {
    const id = index + 1
    const desc = `活动${id}：充值返利`
    const rechargeValue = Number((Math.random() * 2000 + 100).toFixed(2))
    const salePrice = Number((rechargeValue * (0.85 + Math.random() * 0.3)).toFixed(2))
    const discount = Number(((1 - salePrice / rechargeValue) * 100).toFixed(2))
    const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 90))
    const createDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    const status = ['启用', '停用'][Math.floor(Math.random() * 2)]
    list.push({ id, desc, rechargeValue, salePrice, discount, createDate, status })
  }
  return list
}

export default [
  {
    url: '/api/activity/recharge/getList',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { current = 1, pageSize = 20, memberName, phone, payMethod, rechargeRange } = query as any
      const all = genRechargeRecords()
      const [start, end] = Array.isArray(rechargeRange) ? rechargeRange : []
      const startTime = start ? new Date(start).getTime() : undefined
      const endTime = end ? new Date(end).getTime() : undefined
      const filtered = all.filter(item => {
        const nameOk = memberName ? String(item.memberName).includes(String(memberName)) : true
        const phoneOk = phone ? String(item.phone).includes(String(phone)) : true
        const payOk = payMethod ? item.payMethod === payMethod : true
        const dateMs = new Date(item.rechargeDate).getTime()
        const rangeOk = startTime && endTime ? dateMs >= startTime && dateMs <= endTime : true
        return nameOk && phoneOk && payOk && rangeOk
      })
      return resultPageSuccess(current, pageSize, filtered)
    }
  },
  {
    url: '/api/activity/campaign/getList',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { current = 1, pageSize = 20 } = query
      return resultPageSuccess(current, pageSize, genRechargeCampaigns())
    }
  }
] as MockMethod[]
