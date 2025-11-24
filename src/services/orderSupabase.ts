import { message } from 'antd'
import { supabase } from './supabaseClient'
import { store } from '@/stores'

const TABLE = 'orders'

export interface OrderQuery {
  current: number
  pageSize: number
  orderCode?: string
  orderStatus?: number
  paymentMethod?: number
  userName?: string
  userPhone?: string
  startTime?: string
  endTime?: string
}

export async function listOrders(params: OrderQuery) {
  const { current, pageSize, orderCode, orderStatus, paymentMethod, userName, userPhone, startTime, endTime } = params
  const uid = store.getState().user?.userInfo?.user_id ?? store.getState().user?.userInfo?.userId
  let query = supabase
    .from(TABLE)
    .select('*, shop_desks:shop_desks (id, table_number, table_name)', { count: 'exact' })
    .eq('user_id', uid)
  if (orderCode) query = query.ilike('order_code', `%${orderCode}%`)
  if (typeof orderStatus === 'number') query = query.eq('order_status', orderStatus)
  if (typeof paymentMethod === 'number') query = query.eq('pay_method', paymentMethod)
  if (userName) query = query.ilike('user_name', `%${userName}%`)
  if (userPhone) query = query.eq('user_phone', userPhone)
  if (startTime) query = query.gte('create_time', startTime)
  if (endTime) query = query.lte('create_time', endTime)
  query = query.order('create_time', { ascending: false }).range((current - 1) * pageSize, current * pageSize - 1)
  const { data, error, count } = await query
  if (error) {
    message.error(error.message)
  }
  let summary = { orderAmount: 0, discountAmount: 0, payAmount: 0 }
  const { data: summaryData, error: summaryError } = await supabase.rpc('orders_summary', {
    start_t: startTime || null,
    end_t: endTime || null,
    order_code: orderCode || null,
    order_status: typeof orderStatus === 'number' ? orderStatus : null,
    pay_method: typeof paymentMethod === 'number' ? paymentMethod : null,
    user_name: userName || null,
    user_phone: userPhone || null
  })
  if (summaryError) {
    message.error(summaryError.message)
  }
  if (Array.isArray(summaryData) && summaryData.length > 0) {
    const row = summaryData[0] as any
    summary = {
      orderAmount: Number(row.total_order_amount || 0),
      discountAmount: Number(row.total_discount_amount || 0),
      payAmount: Number(row.total_pay_amount || 0)
    }
  }
  return { list: data || [], total: count || 0, summary }
}

export interface OrderInput {
  order_type: number
  order_status: number
  order_amount?: number
  discount_amount?: number
  pay_amount?: number
  pay_method?: number
  desk_id?: number
  user_name?: string
  user_phone?: string
  user_count?: number
}

const getUserId = () => store.getState().user?.userInfo?.userId

export async function createOrder(input: OrderInput) {
  const payload = { ...input, user_id: getUserId() }
  const { data, error } = await supabase.from(TABLE).insert(payload).select('*').single()
  if (error) {
    message.error(error.message)
  }
  return data
}

export async function updateOrder(id: number | string, input: Partial<OrderInput>) {
  const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select('*').single()
  if (error) {
    message.error(error.message)
  }
  return data
}

export async function replaceOrderProducts(
  orderId: string | number,
  items: Array<{ product_id: string | number; quantity: number }>
) {
  const TABLE = 'order_products'
  // Remove existing products for this order
  const delRes = await supabase.from(TABLE).delete().eq('order_id', orderId)
  if (delRes.error) {
    message.error(delRes.error.message)
    return false
  }
  if (!items || items.length === 0) return true
  const payload = items.map(i => ({ order_id: orderId, product_id: i.product_id, quantity: i.quantity }))
  const insRes = await supabase.from(TABLE).insert(payload)
  if (insRes.error) {
    message.error(insRes.error.message)
    return false
  }
  return true
}

export async function listOrderProducts(orderId: string | number) {
  const { data, error } = await supabase
    .from('order_products')
    .select('product_id, quantity, products:products (id, product_name, price)')
    .eq('order_id', orderId)
  if (error) {
    message.error(error.message)
    return []
  }
  return data || []
}

export interface DailyRevenueRow {
  day: string
  total_order_amount: number
  total_discount_amount: number
  total_pay_amount: number
  order_count: number
  user_count: number
}

export async function dailyRevenueSummary(year: number): Promise<DailyRevenueRow[]> {
  const { data, error } = await supabase.rpc('orders_daily_summary', { year })
  if (error) {
    message.error(error.message)
    return []
  }
  return (data || []) as DailyRevenueRow[]
}

export interface DailyRevenuePageQuery {
  year: number
  current: number
  pageSize: number
}

export async function dailyRevenueSummaryPaged(
  params: DailyRevenuePageQuery
): Promise<{ list: DailyRevenueRow[]; total: number }> {
  const { year, current, pageSize } = params
  const offset = (current - 1) * pageSize
  const { data, error } = await supabase.rpc('orders_daily_summary_paged', {
    p_year: year,
    p_offset: offset,
    p_limit: pageSize
  })
  if (error) {
    message.error(error.message)
    return { list: [], total: 0 }
  }
  const rows = (data || []) as Array<DailyRevenueRow & { total_count?: number }>
  const total = rows.length > 0 && (rows[0] as any).total_count ? Number((rows[0] as any).total_count) : rows.length
  const list = rows.map(r => ({
    day: r.day,
    total_order_amount: Number(r.total_order_amount || 0),
    total_discount_amount: Number(r.total_discount_amount || 0),
    total_pay_amount: Number(r.total_pay_amount || 0),
    order_count: Number(r.order_count || 0),
    user_count: Number((r as any).user_count || 0)
  }))
  return { list, total }
}

export interface DailyRevenueRangePagedQuery {
  start: string
  end: string
  minAmount?: number
  maxAmount?: number
  current: number
  pageSize: number
}

export async function dailyRevenueSummaryRangePaged(
  params: DailyRevenueRangePagedQuery
): Promise<{ list: DailyRevenueRow[]; total: number }> {
  const { start, end, minAmount, maxAmount, current, pageSize } = params
  const offset = (current - 1) * pageSize
  const { data, error } = await supabase.rpc('orders_daily_summary_range_paged', {
    p_start: start,
    p_end: end,
    p_min: minAmount ?? null,
    p_max: maxAmount ?? null,
    p_offset: offset,
    p_limit: pageSize
  })
  if (error) {
    message.error(error.message)
    return { list: [], total: 0 }
  }
  const rows = (data || []) as Array<DailyRevenueRow & { total_count?: number }>
  const total = rows.length > 0 && (rows[0] as any).total_count ? Number((rows[0] as any).total_count) : rows.length
  const list = rows.map(r => ({
    day: r.day,
    total_order_amount: Number(r.total_order_amount || 0),
    total_discount_amount: Number(r.total_discount_amount || 0),
    total_pay_amount: Number(r.total_pay_amount || 0),
    order_count: Number(r.order_count || 0),
    user_count: Number((r as any).user_count || 0)
  }))
  return { list, total }
}

export async function dailyRevenueSummaryTotalRange(params: {
  start: string
  end: string
  minAmount?: number
  maxAmount?: number
}): Promise<{ orderAmount: number; discountAmount: number; payAmount: number; userCount: number; orderCount: number }> {
  const { start, end, minAmount, maxAmount } = params
  const { data, error } = await supabase.rpc('orders_daily_summary_total_range', {
    p_start: start,
    p_end: end,
    p_min: minAmount ?? null,
    p_max: maxAmount ?? null
  })
  if (error) {
    message.error(error.message)
    return { orderAmount: 0, discountAmount: 0, payAmount: 0, userCount: 0, orderCount: 0 }
  }
  const row = Array.isArray(data) && data.length > 0 ? (data[0] as any) : {}
  return {
    orderAmount: Number(row.total_order_amount || 0),
    discountAmount: Number(row.total_discount_amount || 0),
    payAmount: Number(row.total_pay_amount || 0),
    userCount: Number(row.total_user_count || 0),
    orderCount: Number(row.total_order_count || 0)
  }
}

export async function yearTotals(year: number): Promise<{
  orderAmount: number
  discountAmount: number
  payAmount: number
  userCount: number
  orderCount: number
}> {
  const start = `${year}-01-01 00:00:00`
  const end = `${year}-12-31 23:59:59`
  return dailyRevenueSummaryTotalRange({ start, end })
}
