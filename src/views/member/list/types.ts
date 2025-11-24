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
  memberCode: string
  memberName: string
  phone: number
  addTime: string
  balance: number
  points: number
  status: '正常' | '已停用'
}
