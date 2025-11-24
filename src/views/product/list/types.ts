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
  price: number
  sales: number
  stock: number
  status: '上架' | '下架'
  addTime: string
  categoryId?: number
  categoryName?: string
}
