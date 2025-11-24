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
  rechargeOrderCode: string
  memberName: string
  phone: number
  rechargeAmount: number
  arrivalAmount: number
  rechargeDate: string
  payMethod: string
}
