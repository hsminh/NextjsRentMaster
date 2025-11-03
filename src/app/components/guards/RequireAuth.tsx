'use client'

import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import type { RootState } from '@/store'

export default function RequireAuth({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter()
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn)

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace('/admin/passport/login')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) return null

  return <>{children}</>
}

