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
  productName: string
  stock: number
  marketPrice: number
  needPoints: number
  addDate: string
  status: '启用' | '停用'
}
