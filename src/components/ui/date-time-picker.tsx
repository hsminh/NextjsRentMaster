'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from 'lucide-react'

interface DateTimePickerProps {
    value?: string
    onChange: (date: string) => void
    placeholder?: string
    disabled?: boolean
}

export function DateTimePicker({
    value,
    onChange,
    placeholder = 'Chọn ngày',
    disabled = false
}: DateTimePickerProps) {
    const [open, setOpen] = useState(false)
    
    const dateStr = value ? value.slice(0, 10) : ''

    const handleDateChange = (newDate: string) => {
        onChange(newDate)
    }

    const displayText = dateStr
        ? new Date(dateStr + 'T00:00:00').toLocaleDateString('vi-VN')
        : placeholder

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    disabled={disabled}
                >
                    <Calendar className="mr-2 h-4 w-4" />
                    {displayText}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Ngày</label>
                        <Input
                            type="date"
                            value={dateStr}
                            onChange={(e) => {
                                handleDateChange(e.target.value)
                                setOpen(false)
                            }}
                            className="mt-1"
                            autoFocus
                        />
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
