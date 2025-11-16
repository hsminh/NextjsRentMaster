'use client'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Loader2 } from 'lucide-react'
import {AdminUser} from "@/app/admin/(features)/users/types";
import {useState} from "react";

export const createUserPath = '/admin/users/create'

export const userSearchKeys: (keyof AdminUser)[] = ['gmail', 'firstName', 'lastName', 'phoneNumber']

export const userStatusOptions = [
    { value: 'Active', label: 'Hoạt động' },
    { value: 'Inactive', label: 'Vô hiệu hóa' }
] as const

export const userPageSizeOptions = [5, 10, 25, 50]

interface ColumnConfig<T> {
    key: keyof T
    label: string
    render?: (row: T) => React.ReactNode
}

const getStatusBadge = (status: string) => {
    const baseStyle = 'px-2.5 py-1 text-xs font-medium rounded-full border'
    
    switch(status) {
        case 'Active':
            return `${baseStyle} bg-green-100 text-green-800 border-green-200`
        case 'Inactive':
            return `${baseStyle} bg-gray-200 text-gray-600 border-gray-300`
        case 'Pending':
            return `${baseStyle} bg-yellow-100 text-yellow-800 border-yellow-200`
        default:
            return `${baseStyle} bg-gray-100 text-gray-800 border-gray-200`
    }
}

export const useUserColumns = (): ColumnConfig<AdminUser>[] => [
    {
        key: 'gmail',
        label: 'Email',
        render: (row) => row.gmail || 'N/A',
    },
    {
        key: 'firstName',
        label: 'Họ và tên',
        render: (row) => [row.firstName, row.lastName].filter(Boolean).join(' ') || 'Chưa cập nhật',
    },
    {
        key: 'phoneNumber',
        label: 'Số điện thoại',
        render: (row) => row.phoneNumber || 'Chưa cập nhật',
    },
    {
        key: 'Status',
        label: 'Trạng thái',
        render: (row) => {
            const status = (row.Status && userStatusOptions.some(opt => opt.value === row.Status)) 
                ? row.Status
                : 'Active'
            const statusLabel = userStatusOptions.find(opt => opt.value === status)?.label || status
            return (
                <span className={getStatusBadge(status)}>
                    {statusLabel}
                </span>
            )
        },
    },
    {
        key: 'uid',
        label: 'Hành động',
        render: () => null,
    },
]

interface UserActionsProps {
    user: AdminUser
    onAction: (action: string, user: AdminUser) => void
    isLoading?: boolean
}

export const UserActions = ({ user, onAction, isLoading }: UserActionsProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isActive = user.Status === 'Active'

    const handleAction = (action: string) => {
        setIsMenuOpen(false)
        onAction?.(action, user)
    }

    return (
        <div className="flex items-center gap-2">
            {isActive ? (
                <Button 
                    variant="outline" 
                    size="sm"
                    className="text-amber-600 border-amber-200 hover:bg-amber-50"
                    onClick={() => handleAction('deactivate')}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang xử lý...' : 'Vô hiệu hóa'}
                </Button>
            ) : (
                <Button 
                    variant="outline" 
                    size="sm"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => handleAction('activate')}
                    disabled={isLoading}
                >
                    {isLoading ? 'Đang xử lý...' : 'Kích hoạt'}
                </Button>
            )}
            
            <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleAction('view')}>
                        <span>Xem chi tiết</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction('edit')}>
                        <span>Chỉnh sửa</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
