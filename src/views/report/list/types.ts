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
  date: string
  flowAmount: number
  discountAmount: number
  realPayAmount: number
  orderCount: number
  userCount: number
  avgPayAmount: number
  avgOrderAmount: number
}
