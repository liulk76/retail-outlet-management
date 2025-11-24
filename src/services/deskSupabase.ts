import { message } from 'antd'
import { supabase } from './supabaseClient'
import { store } from '@/stores'

const TABLE = 'shop_desks'

export interface DeskInput {
  category: string
  table_number: string
  table_name: string
  status: 0 | 1
  order_count?: number
  amount?: number
}

const getUserId = () => store.getState().user?.userInfo?.userId

export async function listDesks(params: { current: number; pageSize: number; category?: string; status?: string }) {
  const { current, pageSize, category, status } = params
  let query = supabase.from(TABLE).select('*', { count: 'exact' })
  if (category) query = query.eq('category', category)
  if (status) query = query.eq('status', status)
  query = query.order('create_time', { ascending: true }).range((current - 1) * pageSize, current * pageSize - 1)
  const { data, error, count } = await query
  if (error) {
    message.error(error.message)
  }
  return { list: data || [], total: count || 0 }
}

export async function createDesk(input: DeskInput) {
  const payload = { ...input, user_id: getUserId() }
  const { data, error } = await supabase.from(TABLE).insert(payload).select('*').single()
  if (error) {
    message.error(error.message)
  }
  return data
}

export async function updateDesk(id: number | string, input: Partial<DeskInput>) {
  const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select('*').single()
  if (error) {
    message.error(error.message)
  }
  return data
}

export async function deleteDesk(id: number | string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) {
    message.error(error.message)
    return false
  }
  return true
}
