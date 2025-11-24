import type { MockMethod } from 'vite-plugin-mock'
import { Random } from 'mockjs'
import { resultPageSuccess } from '../_utils'

const getPhone = () => {
  const prefixList = [135, 136, 137, 138, 139, 155, 158, 183, 185, 189]
  const randomNum = Math.floor(Math.random() * 10)
  const phoneStr = prefixList[randomNum] + Math.random().toString().slice(-8)
  return Number(phoneStr)
}

const genMemberList = () => {
  const list: any[] = []
  for (let index = 0; index < 200; index++) {
    const id = index + 1
    const name = Random.cname()
    const phone = getPhone()
    const balance = Number((Math.random() * 1000).toFixed(2))
    const points = Math.floor(Math.random() * 10000)
    const status = ['正常', '已停用'][Math.floor(Math.random() * 2)]
    const now = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 180))
    const addTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    list.push({
      id,
      memberCode: `MBR${String(id).padStart(6, '0')}`,
      memberName: name,
      phone,
      addTime,
      balance,
      points,
      status
    })
  }
  return list
}

export default [
  {
    url: '/api/member/getList',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { current = 1, pageSize = 20 } = query
      return resultPageSuccess(current, pageSize, genMemberList())
    }
  }
] as MockMethod[]
