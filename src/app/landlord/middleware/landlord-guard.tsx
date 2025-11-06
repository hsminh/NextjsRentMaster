'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState, useAppDispatch } from '@/store'
import { setCredentials } from '@/store/authSlice'

export default function LandlordGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoggedIn, userType } = useSelector((s: RootState) => ({
    isLoggedIn: s.auth.isLoggedIn,
    userType: s.auth.userType
  }))
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      if (isLoggedIn && userType === 'landlord') {
        setChecked(true)
        return
      }

      if (isLoggedIn && userType !== 'landlord') {
        router.replace('/landlord/passport/login')
        return
      }

      const token = localStorage.getItem('access_token')
      if (token) {
        dispatch(setCredentials({
          token,
          userType: 'landlord' 
        }))
        return
      } else {
        router.replace('/landlord/passport/login')
      }
    }

    checkAuth()
  }, [isLoggedIn, userType, dispatch, router])

  // Show loading state while checking validator
  if (!checked || !isLoggedIn || userType !== 'landlord') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <>{children}</>
}
