import { store } from '@/stores'
import { supabase } from './supabaseClient'
import { message } from 'antd'

const TABLE = 'products'
const getUserId = () => store.getState().user?.userInfo?.userId

export interface ProductInput {
  product_name: string
  price: number
  sales?: number
  stock?: number
  status?: number
  category_id: number
}

export async function listProducts(params: {
  current: number
  pageSize: number
  productName?: string
  status?: number
  categoryId?: number
}) {
  const { current, pageSize, productName, status, categoryId } = params
  let query = supabase
    .from(TABLE)
    .select('*, product_categories:product_categories (id, category_name)', { count: 'exact' })
  if (productName) query = query.ilike('product_name', `%${productName}%`)
  if (status !== undefined) query = query.eq('status', status)
  if (categoryId) query = query.eq('category_id', categoryId)
  query = query.order('add_time', { ascending: false }).range((current - 1) * pageSize, current * pageSize - 1)
  const { data, error, count } = await query
  if (error) {
    message.error(error.message)
  }
  return { list: data || [], total: count || 0 }
}

export async function createProduct(input: ProductInput) {
  const payload = { ...input, user_id: getUserId() }
  const { data, error } = await supabase.from(TABLE).insert(payload).select('*').single()
  if (error) {
    message.error(error.message)
  }
  return data
}

export async function updateProduct(id: number | string, input: Partial<ProductInput>) {
  const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select('*').single()
  if (error) {
    message.error(error.message)
  }
  return data
}

export async function deleteProduct(id: number | string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) {
    message.error(error.message)
    return false
  }
  return true
}
