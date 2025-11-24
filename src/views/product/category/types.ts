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
  categoryName: string
  sortOrder: number
  status: '上架' | '下架'
  createTime: string
  user_id: string
  remark?: string
}
