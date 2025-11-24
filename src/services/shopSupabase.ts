import { message } from 'antd'
import { supabase } from './supabaseClient'
import { store } from '@/stores'

const TABLE = 'shop_settings'
const BUCKET = (import.meta.env.VITE_SUPABASE_BUCKET as string) || 'retail-outlet-assets'

const getUserId = () => {
  const info: any = store.getState().user?.userInfo
  return info?.user_id ?? info?.userId
}

export interface ShopSettingInput {
  name: string
  business_start_time: string
  business_end_time: string
  address: string
  logo_url?: string
  description?: string
}

export async function getShopSetting() {
  const uid = getUserId()
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('user_id', uid)
    .order('id', { ascending: true })
    .limit(1)
  if (error) {
    message.error(error.message)
  }
  return Array.isArray(data) && data.length > 0 ? data[0] : null
}

export async function saveShopSetting(input: ShopSettingInput) {
  const userId = getUserId()
  const { data: existed, error: checkError } = await supabase
    .from(TABLE)
    .select('id')
    .eq('user_id', userId)
    .order('id', { ascending: true })
    .limit(1)
  if (checkError) {
    message.error(checkError.message)
    return null
  }
  if (Array.isArray(existed) && existed[0]?.id) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({ ...input, user_id: userId })
      .eq('user_id', userId)
      .select('*')
      .single()
    if (error) {
      message.error(error.message)
    }
    return data
  } else {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({ ...input, user_id: userId })
      .select('*')
      .single()
    if (error) {
      message.error(error.message)
    }
    return data
  }
}

export async function uploadShopLogo(file: File) {
  const userId = getUserId()
  const filename = `${Date.now()}_${file.name}`
  const path = `logos/${userId || 'anonymous'}/${filename}`
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type })
  if (error) {
    message.error(error.message)
    return null
  }
  const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(data.path).data.publicUrl
  return publicUrl
}

function parseStoragePathFromPublicUrl(url: string): { bucket: string; path: string } | null {
  try {
    const u = new URL(url)
    const marker = '/object/public/'
    const idx = u.pathname.indexOf(marker)
    if (idx >= 0) {
      const rest = u.pathname.substring(idx + marker.length)
      const parts = rest.split('/')
      const bucket = parts.shift() || ''
      const path = parts.join('/')
      if (bucket && path) return { bucket, path }
    }
  } catch (e) {}
  return null
}

export async function removeShopLogoByUrl(url?: string) {
  if (!url) return true
  const info = parseStoragePathFromPublicUrl(url)
  if (!info) return true
  const { error } = await supabase.storage.from(info.bucket).remove([info.path])
  if (error) {
    message.error(error.message)
    return false
  }
  return true
}

export async function replaceShopLogo(prevUrl: string | undefined, file: File) {
  const ok = await removeShopLogoByUrl(prevUrl)
  if (!ok) return null
  const url = await uploadShopLogo(file)
  return url
}
