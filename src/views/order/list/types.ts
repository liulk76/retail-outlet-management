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
  orderNumber: string
  orderStatus: string
  orderAmount: number
  discountAmount: number
  payAmount: number
  paymentMethod: number
  payTime: string
  tableNumber: string
  userInfo: string
  userCount: number
  createTime: string
  hobby?: string[]
}
