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
  desc: string
  rechargeValue: number
  salePrice: number
  discount: number
  createDate: string
  status: '启用' | '停用'
}
