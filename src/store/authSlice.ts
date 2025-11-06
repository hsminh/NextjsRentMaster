import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserType = 'admin' | 'landlord' | null

type AuthState = {
  token: string | null
  isLoggedIn: boolean
  userType: UserType
}

const initialState: AuthState = {
  token: null,
  isLoggedIn: false,
  userType: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; userType?: UserType }>) => {
      state.token = action.payload.token
      state.userType = action.payload.userType || null
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.token = null
      state.isLoggedIn = false
      state.userType = null
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

