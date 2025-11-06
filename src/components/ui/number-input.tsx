// components/ui/number-input.tsx
'use client'

import { Input, InputProps } from './input'
import { forwardRef, useState, useEffect } from 'react'

interface NumberInputProps extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
    value: number | undefined
    onChange: (value: number | undefined) => void
    min?: number
    max?: number
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({ value, onChange, onFocus, onBlur, ...props }, ref) => {
        const [touched, setTouched] = useState(false)

        // Handle focus to track first interaction
        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            if (!touched) {
                setTouched(true)
            }
            onFocus?.(e)
        }

        // Handle value changes
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value
            if (newValue === '') {
                onChange(undefined)
            } else {
                const num = parseFloat(newValue)
                if (!isNaN(num)) {
                    onChange(num)
                }
            }
        }

        // Display empty string until first focus
        const displayValue = touched ? (value !== undefined ? value.toString() : '') : ''

        return (
            <Input
                {...props}
                ref={ref}
                type="number"
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={onBlur}
            />
        )
    }
)

NumberInput.displayName = 'NumberInput'