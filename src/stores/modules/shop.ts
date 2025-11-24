import { createSlice } from '@reduxjs/toolkit'

export interface ShopSettingState {
  setting: {
    name?: string
    business_start_time?: string
    business_end_time?: string
    address?: string
    logo_url?: string
    description?: string
    user_id?: string | number
  } | null
}

const initialState: ShopSettingState = {
  setting: null
}

const shop = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setShopSetting: (state, action) => {
      Object.assign(state, action.payload)
    },
    resetShopSetting: state => {
      Object.assign(state, initialState)
    }
  }
})

export const { setShopSetting, resetShopSetting } = shop.actions

export default shop.reducer
