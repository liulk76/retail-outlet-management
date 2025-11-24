export interface APIResult {
  list: any[]
  total: number
}

export interface PageState {
  current: number
  pageSize: number
}

export interface TableDataType {
  id: number
  category: string
  tableNumber: string
  tableName: string
  orderCount: number
  amount: number
  status: '启用' | '停用'
  addTime: string
}
