import { RouterProvider } from 'react-router-dom'
import router from '@/router'
import { setupProdMockServer } from '../mock/_createProductionServer'
import { useEffect } from 'react'
import { supabase } from '@/services/supabaseClient'
import { useAppDispatch } from '@/stores'
import { setToken, setUserInfo, resetState } from '@/stores/modules/user'
import { resetShopSetting } from '@/stores/modules/shop'
import { clearAuthCache } from '@/utils/auth'

function App() {
  const isBuild = process.env.NODE_ENV === 'production'
  if (isBuild) {
    setupProdMockServer()
  }

  const dispatch = useAppDispatch()

  useEffect(() => {
    const sync = async () => {
      const { data } = await supabase.auth.getSession()
      const s = data?.session
      const u = s?.user
      if (s && u) {
        dispatch(setToken(s.access_token))
        dispatch(
          setUserInfo({
            userId: u.id,
            user_id: u.id,
            username: u.email || '',
            realName: (u.user_metadata as any)?.name || u.email || '',
            avatar: (u.user_metadata as any)?.avatar_url || '',
            token: s.access_token,
            homePath: '/home'
          })
        )
      } else {
        dispatch(resetState())
        dispatch(resetShopSetting())
        clearAuthCache(true)
      }
    }
    sync()
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      const u = session?.user
      if (session && u) {
        dispatch(setToken(session.access_token))
        dispatch(
          setUserInfo({
            userId: u.id,
            user_id: u.id,
            username: u.email || '',
            realName: (u.user_metadata as any)?.name || u.email || '',
            avatar: (u.user_metadata as any)?.avatar_url || '',
            token: session.access_token,
            homePath: '/home'
          })
        )
      } else {
        dispatch(resetState())
        dispatch(resetShopSetting())
        clearAuthCache(true)
      }
    })
    return () => sub?.subscription?.unsubscribe()
  }, [dispatch])

  return <RouterProvider router={router} />
}

export default App
