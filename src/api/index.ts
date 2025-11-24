import { service } from '@/utils/axios'
import type { ChartData } from '@/views/home/data'

interface LoginParams {
  username: string
  password: string
}

// User login api
export function loginApi(data: LoginParams): Promise<any> {
  return service({
    url: '/login',
    method: 'post',
    data
  })
}

// Get User info
export function getUserInfo(): Promise<any> {
  return service({
    url: '/getUserInfo',
    method: 'get'
  })
}

// User logout api
export function logoutApi() {
  return service({
    url: '/logout',
    method: 'get'
  })
}

// Table list
export function getTableList(params: any) {
  return service({
    url: '/table/getTableList',
    method: 'get',
    params
  })
}

// Order list
export function getOrderList(params: any) {
  return service({
    url: '/order/list',
    method: 'get',
    params
  })
}

export function getReportList(params: any) {
  return service({
    url: '/report/getList',
    method: 'get',
    params
  })
}

export function getMemberList(params: any) {
  return service({
    url: '/member/getList',
    method: 'get',
    params
  })
}

export function getCategoryList(params: any) {
  return service({
    url: '/category/getList',
    method: 'get',
    params
  })
}

export function getProductList(params: any) {
  return service({
    url: '/product/getList',
    method: 'get',
    params
  })
}

export function getDeskList(params: any) {
  return service({
    url: '/desk/getList',
    method: 'get',
    params
  })
}

export function getRechargeRecordList(params: any) {
  return service({
    url: '/activity/recharge/getList',
    method: 'get',
    params
  })
}

export function getRechargeCampaignList(params: any) {
  return service({
    url: '/activity/campaign/getList',
    method: 'get',
    params
  })
}

export function getPointsProductList(params: any) {
  return service({
    url: '/points/product/getList',
    method: 'get',
    params
  })
}

export function getPointsExchangeList(params: any) {
  return service({
    url: '/points/exchange/getList',
    method: 'get',
    params
  })
}

export function getChartData(): Promise<ChartData> {
  return service({
    url: '/dashboard/chartdata',
    method: 'get'
  })
}
