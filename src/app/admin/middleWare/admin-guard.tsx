'use client'

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { RootState, useAppDispatch } from '@/store'
import { setCredentials } from '@/store/authSlice'

export default function AdminGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const isLoggedIn = useSelector((s: RootState) => s.auth.isLoggedIn)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // If already logged in, allow immediately
    if (isLoggedIn) {
      setChecked(true)
      return
    }

    try {
      const token = localStorage.getItem('access_token')
      if (token) {
        dispatch(setCredentials({ token }))
        setChecked(true)
        return
      }
    } catch (e) {
      // ignore localStorage errors
    }

    router.replace('/admin/passport/login')
  }, [isLoggedIn, dispatch, router])

  if (!checked) return null
  if (!isLoggedIn) return null

  return <>{children}</>
}

