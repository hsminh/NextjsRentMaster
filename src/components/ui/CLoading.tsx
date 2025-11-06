'use client'

import { Loader2 } from 'lucide-react'
import React from 'react'

interface CLoadingProps {
  message?: string
  fullScreen?: boolean
}

export default function CLoading({ message = 'Đang tải dữ liệu...', fullScreen = true }: CLoadingProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center ${
        fullScreen ? 'h-screen' : 'h-64'
      } w-full gap-3`}
    >
      <Loader2 className="animate-spin text-primary w-10 h-10" />
      <span className="text-gray-600 font-medium">{message}</span>
    </div>
  )
}
