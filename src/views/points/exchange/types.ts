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
  orderCode: string
  memberName: string
  phone: number
  productName: string
  usePoints: number
  exchangeDate: string
  remark: string
}
