'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState, useAppDispatch } from '@/store'
import { setCredentials } from '@/store/authSlice'

export default function AdminGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isLoggedIn, userType } = useSelector((s: RootState) => ({
    isLoggedIn: s.auth.isLoggedIn,
    userType: s.auth.userType
  }))
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      // If already logged in as admin
      if (isLoggedIn && userType === 'admin') {
        setChecked(true)
        return
      }

      // If logged in but not admin
      if (isLoggedIn && userType !== 'admin') {
        router.replace('/admin/passport/login')
        return
      }

      const token = localStorage.getItem('access_token')
      if (token) {
        dispatch(setCredentials({
          token,
          userType: 'admin',
          userData: {}
        }))
        return
      } else {
        // If no token, redirect to login
        router.replace('/admin/passport/login')
      }
    }

    checkAuth()
  }, [isLoggedIn, userType, dispatch, router])

  if (!checked || !isLoggedIn || userType !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return <>{children}</>
}

