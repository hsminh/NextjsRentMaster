'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    isInvalid?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, isInvalid = false, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    'h-11 w-full rounded-md border bg-white px-3 py-2 text-sm transition-all duration-200',
                    'focus:border-2 focus:border-neutral-900 focus:outline-none focus:ring-0',
                    'placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50',
                    isInvalid
                        ? 'border-red-500 focus:!border-red-600'
                        : 'border-gray-300',
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)

Input.displayName = 'Input'

export { Input }
