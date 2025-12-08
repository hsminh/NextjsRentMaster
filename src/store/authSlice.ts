import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState } from '@/shared/types/api/auth'

export type UserType = 'admin' | 'landlord' | 'consumer' | null

interface UserData {
  uid: string
  firstName: string
  lastName: string
  email: string
  phone: string
  isVerified: boolean
  createdAt: string
  updatedAt: string | null
  avatarUrl?: string
}

interface ExtendedAuthState extends AuthState {
  isAuthInitialized: boolean
  userData: UserData | null
}

const initialState: ExtendedAuthState = {
    token: null,
    isLoggedIn: false,
    isVerified: false,
    userType: null,
    userUid: null,
    userData: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthInitialized: (state) => {
            state.isAuthInitialized = true
        },

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
                    isVerified?: boolean
                    avatar?: string
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
                    updatedAt: userData.updatedAt || null,
                    isVerified: userData.isVerified || false,
                    avatarUrl: userData.avatar || undefined
                }
                state.isVerified = userData.isVerified || false

                if (userData.uid) {
                    state.userUid = userData.uid
                }
            }

            state.isAuthInitialized = true
        },
        updateUserData: (
            state,
            action: PayloadAction<{
                firstName?: string
                lastName?: string
                phoneNumber?: string
                avatarUrl?: string
            }>
        ) => {
            if (state.userData) {
                state.userData = {
                    ...state.userData,
                    firstName: action.payload.firstName ?? state.userData.firstName,
                    lastName: action.payload.lastName ?? state.userData.lastName,
                    phone: action.payload.phoneNumber ?? state.userData.phone,
                    avatarUrl: action.payload.avatarUrl ?? state.userData.avatarUrl,
                }
            }
        },
        logout: (state) => {
            state.token = null
            state.isLoggedIn = false
            state.isVerified = false
            state.userType = null
            state.userUid = null
            state.userData = null
            state.isAuthInitialized = true

            // Xóa localStorage khi logout
            localStorage.removeItem('access_token')
            localStorage.removeItem('userData')
        },

        // Add new action to update verification status
        setVerified: (state, action: PayloadAction<boolean>) => {
            state.isVerified = action.payload
            if (state.userData) {
                state.userData.isVerified = action.payload
            }
        },
    },
})

export const { setCredentials, logout, updateUserData, setVerified, setAuthInitialized } = authSlice.actions
export default authSlice.reducer