'use client'

import * as React from 'react'
import { Input, type InputProps } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <Input
        type={type}
        className={cn(
          'h-14 rounded-sm border border-gray-300',
          'focus:border-2 focus:border-neutral-900 focus-visible:ring-0',
          'transition-all duration-200',
          'placeholder:text-gray-400',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

CustomInput.displayName = 'CustomInput'
