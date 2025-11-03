import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type AuthState = {
  token: string | null
  isLoggedIn: boolean
}

const initialState: AuthState = {
  token: null,
  isLoggedIn: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token
      state.isLoggedIn = true
    },
    logout: (state) => {
      state.token = null
      state.isLoggedIn = false
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

