import { message } from 'antd'
import { supabase } from './supabaseClient'
import { store } from '@/stores'

const TABLE = 'members'

export interface MemberInput {
  // member_code?: string
  member_name: string
  phone: string
  balance?: number
  points?: number
  status: number
}

const getUserId = () => store.getState().user?.userInfo?.userId

export async function listMembers(params: {
  current: number
  pageSize: number
  memberName?: string
  phone?: string
  status?: number
}) {
  const { current, pageSize, memberName, phone, status } = params
  let query = supabase.from(TABLE).select('*', { count: 'exact' })
  if (memberName) query = query.ilike('member_name', `%${memberName}%`)
  if (phone) query = query.eq('phone', phone)
  if (status !== undefined) query = query.eq('status', status)
  query = query.order('create_time', { ascending: false }).range((current - 1) * pageSize, current * pageSize - 1)
  const { data, error, count } = await query
  if (error) {
    message.error(error.message)
  }
  return { list: data || [], total: count || 0 }
}

export async function createMember(input: MemberInput) {
  const payload = { ...input, user_id: getUserId() }
  const { data, error } = await supabase.from(TABLE).insert(payload).select('*').single()
  if (error) {
    message.error(error.message)
  }
  return data
}

export async function updateMember(id: number | string, input: Partial<MemberInput>) {
  const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select('*').single()
  if (error) {
    message.error(error.message)
  }
  return data
}

export async function deleteMember(id: number | string) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) {
    message.error(error.message)
    return false
  }
  return true
}
