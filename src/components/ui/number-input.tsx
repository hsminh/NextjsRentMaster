'use client'

import { Input, InputProps } from './input'
import { forwardRef } from 'react'

interface NumberInputProps
    extends Omit<InputProps, 'onChange' | 'value' | 'type'> {
    value?: number
    onChange: (value: number | undefined) => void
    min?: number
    max?: number
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
    ({ value, onChange, onFocus, onBlur, ...props }, ref) => {
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

        return (
            <Input
                {...props}
                ref={ref}
                type="number"
                value={value !== undefined ? value.toString() : ''}
                onChange={handleChange}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        )
    }
)

NumberInput.displayName = 'NumberInput'
