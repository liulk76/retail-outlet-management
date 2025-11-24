import type { MockMethod } from 'vite-plugin-mock'
import { resultPageSuccess } from '../_utils'

const categories = ['2人桌', '4人桌', '8人桌', '包间圆桌']

const genDeskList = () => {
  const list: any[] = []
  for (let index = 0; index < 120; index++) {
    const id = index + 1
    const category = categories[Math.floor(Math.random() * categories.length)]
    const tableNumber = `${category.startsWith('包间') ? 'BJ' : 'T'}${String(id).padStart(3, '0')}`
    const tableName = `${category}-${id}`
    const orderCount = Math.floor(Math.random() * 500)
    const amount = Number((orderCount * (Math.random() * 50 + 20)).toFixed(2))
    const status = ['启用', '停用'][Math.floor(Math.random() * 2)]
    const date = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365))
    const addTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`

    list.push({ id, category, tableNumber, tableName, orderCount, amount, status, addTime })
  }
  return list
}

export default [
  {
    url: '/api/desk/getList',
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { current = 1, pageSize = 20, category, status } = query
      const all = genDeskList()
      const filtered = all.filter(item => {
        const categoryOk = category ? item.category === category : true
        const statusOk = status ? item.status === status : true
        return categoryOk && statusOk
      })
      return resultPageSuccess(current, pageSize, filtered)
    }
  }
] as MockMethod[]
