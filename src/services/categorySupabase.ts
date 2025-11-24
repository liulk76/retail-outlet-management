import { message } from 'antd'
import { supabase } from './supabaseClient'
import { store } from '@/stores'

const TABLE = 'product_categories'

export interface CategoryInput {
  category_name: string
  sort_order?: number
  status?: 0 | 1
  remark?: string
}

const getUserId = () => store.getState().user?.userInfo?.userId

export async function listCategories(params: {
  current: number
  pageSize: number
  categoryName?: string
  status?: string
}) {
  const { current, pageSize, categoryName, status } = params
  let query = supabase.from(TABLE).select('*', { count: 'exact' })
  if (categoryName) query = query.ilike('category_name', `%${categoryName}%`)
  if (status !== undefined) query = query.eq('status', status)
  query = query.order('sort_order', { ascending: true }).range((current - 1) * pageSize, current * pageSize - 1)
  const { data, error, count } = await query
  if (error) {
    message.error(error.message)
  }
  return { list: data || [], total: count || 0 }
}

export async function createCategory(input: CategoryInput) {
  const payload = { ...input, user_id: getUserId() }
  const { data, error } = await supabase.from(TABLE).insert(payload).select('*').single()
  if (error) {
    message.error(error.message)
  }
  return data
}

export async function updateCategory(id: number | string, input: Partial<CategoryInput>) {
  const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select('*').single()
  if (error) {
    message.error(error.message)
  }
  return data
}

export async function deleteCategory(id: number | string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) {
    message.error(error.message)
    return false
  }
  return true
}
