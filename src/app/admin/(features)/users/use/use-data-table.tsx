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
    { value: 'all', label: 'Tất cả' },
    { value: 'false', label: 'Hoạt động' },
    { value: 'true', label: 'Đã vô hiệu hóa' },
]

export const userPageSizeOptions = [5, 10, 25, 50]

export interface ColumnConfig<T> {
    key: keyof T
    label: string
    render?: (row: T) => React.ReactNode
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
        key: 'isDelete',
        label: 'Trạng thái',
        render: (row) => (
            <span
                className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                    !row.isDelete
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-gray-200 text-gray-600 border border-gray-300'
                }`}
            >
        {!row.isDelete ? 'Hoạt động' : 'Đã vô hiệu hóa'}
      </span>
        ),
    },
    {
        key: 'uid',
        label: 'Hành động',
        render: () => null,
    },
]

interface UserActionsProps {
    user: AdminUser
    onAction?: (action: string) => void
    isLoading?: boolean
}

export const UserActions = ({ user, onAction, isLoading }: UserActionsProps) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleAction = (action: string) => {
        if (action === 'delete') {
            setIsDeleting(true)
        }
        onAction?.(action)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isLoading}>
                <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <MoreHorizontal className="h-4 w-4" />
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={5}
                className="min-w-[180px] py-1 bg-white rounded-md shadow-md border border-gray-200"
            >
                <DropdownMenuItem 
                    onClick={() => handleAction('view')} 
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    disabled={isLoading}
                >
                    Xem
                </DropdownMenuItem>

                <DropdownMenuItem 
                    onClick={() => handleAction('edit')} 
                    className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    disabled={isLoading}
                >
                    Sửa
                </DropdownMenuItem>

                <DropdownMenuItem 
                    onClick={() => handleAction('delete')} 
                    className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    disabled={isLoading}
                >
                    {isDeleting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Đang xóa...
                        </>
                    ) : 'Xóa'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
