'use client'

import React, { useState } from "react"
import { ColumnConfig } from "@/app/admin/(features)/users/use/use-data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Loader2, MoreHorizontal } from "lucide-react"
import { RoomRequest } from "@/app/landlord/rooms/api"

export const createRoomPath = '/landlord/rooms/create'
export const roomSearchKeys: (keyof RoomRequest)[] = ['areaLength', 'areaWidth', 'roomNumber']
export const roomPageSizeOptions = [5, 10, 25, 50]

export const roomStatusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'available', label: 'Hoạt động' },
    { value: 'rented', label: 'Đang thuê' },
    { value: 'maintenance', label: 'Bảo trì' }
]

const statusMap: Record<string, { label: string; color: string }> = {
    available: { label: 'Hoạt động', color: 'text-green-700 bg-green-100' },
    rented: { label: 'Đang thuê', color: 'text-yellow-700 bg-yellow-100' },
    maintenance: { label: 'Bảo trì', color: 'text-red-700 bg-red-100' },
    default: { label: 'Chưa cập nhật', color: 'text-gray-500 bg-gray-100' }
}

const typeMap: Record<string, { label: string; color: string }> = {
    RoomBased: { label: 'Theo phòng', color: 'text-yellow-700 bg-yellow-100' },
    FULL_APARTMENT: { label: 'Căn hộ đầy đủ', color: 'text-blue-700 bg-blue-100' },
    default: { label: 'Chưa cập nhật', color: 'text-gray-500 bg-gray-100' }
}

export const useRoomData: ColumnConfig<RoomRequest>[] = [
    {
        key: 'roomNumber',
        label: 'Số phòng',
        render: (row) => row.roomNumber || 'Chưa có số phòng'
    },
    {
        key: 'price',
        label: 'Giá thuê',
        render: (row) => row.price ? `${row.price.toLocaleString()} VNĐ` : 'Chưa cập nhật'
    },
    {
        key: 'status',
        label: 'Trạng thái',
        render: (row) => {
            const s = statusMap[row.status ?? 'default'] ?? statusMap.default
            return <span className={`px-2 py-1 rounded-md text-sm font-medium ${s.color}`}>{s.label}</span>
        }
    },
    {
        key: 'areaLength',
        label: 'Chiều dài (m²)',
        render: (row) => row.areaLength ? `${row.areaLength} m²` : 'Chưa cập nhật'
    },
    {
        key: 'areaWidth',
        label: 'Chiều rộng (m²)',
        render: (row) => row.areaWidth ? `${row.areaWidth} m²` : 'Chưa cập nhật'
    },

    {
        key: 'uid',
        label: 'Hành động',
        render: (row) => <RoomActions room={row} />
    }
]

interface RoomActionsProps {
    room: RoomRequest
    onAction?: (action: string) => void
    isLoading?: boolean
}

export const RoomActions: React.FC<RoomActionsProps> = ({ room, onAction, isLoading = false }) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleAction = (action: string) => {
        if (action === 'delete') {
            setIsDeleting(true)
            setTimeout(() => {
                setIsDeleting(false)
            }, 2000)
        }
        onAction?.(action)
    }

    React.useEffect(() => {
        if (!isLoading) {
            setIsDeleting(false)
        }
    }, [isLoading])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isLoading}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" sideOffset={5} className="min-w-[180px] py-1 bg-white rounded-md shadow-md border border-gray-200">
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
