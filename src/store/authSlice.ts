import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState } from '@/shared/types/api/auth'

export type UserType = 'admin' | 'landlord' | 'consumer' | null

const initialState: AuthState = {
  token: null,
  isLoggedIn: false,
  userType: null,
  userUid: null,
  userData: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string
        userType: UserType
        userData: {
          uid?: string
          firstName?: string
          lastName?: string
          gmail?: string
          email?: string
          phoneNumber?: string
          phone?: string
          createdAt?: string
          updatedAt?: string | null
        }
      }>
    ) => {
      const { token, userType, userData = {} } = action.payload
      
      state.token = token
      state.userType = userType
      state.isLoggedIn = true
      
      if (userData) {
        state.userData = {
          uid: userData.uid || '',
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.gmail || userData.email || '',
          phone: userData.phoneNumber || userData.phone || '',
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || null
        }
        
        // Also set userUid for backward compatibility
        if (userData.uid) {
          state.userUid = userData.uid
        }
      }
    },
    updateUserData: (
      state,
      action: PayloadAction<{
        firstName?: string
        lastName?: string
        phoneNumber?: string
      }>
    ) => {
      if (state.userData) {
        state.userData = {
          ...state.userData,
          ...(action.payload.firstName && { firstName: action.payload.firstName }),
          ...(action.payload.lastName && { lastName: action.payload.lastName }),
          ...(action.payload.phoneNumber && { phone: action.payload.phoneNumber }),
        }
      }
    },
    logout: (state) => {
      state.token = null
      state.isLoggedIn = false
      state.userType = null
      state.userUid = null
      state.userData = null
    },
  },
})

// Load initial state from localStorage if available
export const initializeAuth = () => (dispatch: any) => {
  const token = localStorage.getItem('access_token')
  const userDataStr = localStorage.getItem('userData')
  
  if (token && userDataStr) {
    try {
      const userData = JSON.parse(userDataStr)
      dispatch(setCredentials({
        token,
        userType: userData.role || 'landlord', // Default to 'landlord' if role not specified
        userData: {
          uid: userData.uid,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          gmail: userData.gmail || userData.email || '',
          phoneNumber: userData.phoneNumber || userData.phone || '',
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || null
        }
      }))
    } catch (error) {
      console.error('Failed to parse user data from localStorage', error)
      // Clear invalid data
      localStorage.removeItem('access_token')
      localStorage.removeItem('userData')
    }
  }
}

export const { setCredentials, logout, updateUserData } = authSlice.actions
export default authSlice.reducer
