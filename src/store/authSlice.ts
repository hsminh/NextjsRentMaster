import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState } from '@/shared/types/api/auth'

export type UserType = 'admin' | 'landlord' | 'consumer' | null

const initialState: AuthState & { isAuthInitialized: boolean } = {
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
                    isVerified: userData.isVerified || false
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
            state.isVerified = false
            state.userType = null
            state.userUid = null
            state.userData = null
            state.isAuthInitialized = true // Vẫn đặt là true sau logout

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