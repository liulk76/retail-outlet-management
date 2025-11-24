import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAuthCache } from '@/utils/auth'
import { TOKEN_KEY } from '@/enums/cacheEnum'
import { useAppSelector } from '@/stores'
import { useEffect, useState } from 'react'
import { supabase } from '@/services/supabaseClient'

export const GuardRoute = ({ children }: { children: ReactNode }) => {
  const whiteList: string[] = ['/', '/home', '/login']
  const { pathname } = useLocation()
  const { token } = useAppSelector(state => state.user)
  const [checked, setChecked] = useState(false)
  const [hasSession, setHasSession] = useState(false)
  const getToken = (): string => {
    return token || getAuthCache<string>(TOKEN_KEY)
  }

  useEffect(() => {
    const run = async () => {
      if (getToken()) {
        setHasSession(true)
        setChecked(true)
        return
      }
      const { data } = await supabase.auth.getSession()
      if (data?.session) {
        setHasSession(true)
      } else {
        setHasSession(false)
      }
      setChecked(true)
    }
    run()
  }, [token])

  if (!checked) return null

  if (!getToken() && !hasSession) {
    if (whiteList.includes(pathname)) {
      return <Navigate to='/login' replace />
    } else {
      return <Navigate to={`/login?redirect=${pathname}`} replace />
    }
  }

  return children
}
