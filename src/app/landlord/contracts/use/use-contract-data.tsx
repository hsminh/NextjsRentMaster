'use client'

import React, { useState } from "react"
import { ColumnConfig } from "@/app/components/Table/CDataTable"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Loader2, MoreHorizontal, Eye, Edit, Trash2, Check, X } from "lucide-react"
import { ContractRequest, contractTypeOptions } from "@/app/landlord/contracts/type/contract"
import { BreadcrumbNavigationProps } from "@/app/components/layout/BreadcrumbNavigation"

export const createContractPath = '/landlord/contracts/create'
export const contractSearchKeys: (keyof ContractRequest)[] = []
export const contractPageSizeOptions = [5, 10, 25, 50]

export const contractBreadcrumbBase = {
    homeHref: "/landlord/contracts",
    homeLabel: "Quản lý",
} as const;

export const contractListBreadcrumb: BreadcrumbNavigationProps = {
    ...contractBreadcrumbBase,
    items: [
        { label: "Hợp đồng", href: "/landlord/contracts" },
        { label: "Danh sách" },
    ],
};

export const contractCreateBreadcrumb: BreadcrumbNavigationProps = {
    ...contractBreadcrumbBase,
    items: [
        { label: "Danh sách", href: "/landlord/contracts" },
        { label: "Tạo mới" },
    ],
};

export const contractEditBreadcrumb: BreadcrumbNavigationProps = {
    ...contractBreadcrumbBase,
    items: [
        { label: "Danh sách", href: "/landlord/contracts" },
        { label: "Cập nhật" },
    ],
};

export const contractDetailBreadcrumb: BreadcrumbNavigationProps = {
    ...contractBreadcrumbBase,
    items: [
        { label: "Danh sách", href: "/landlord/contracts" },
        { label: "Chi tiết" },
    ],
};

export const contractStatusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'active', label: 'Đang hoạt động' },
    { value: 'expired', label: 'Hết hạn' },
    { value: 'terminated', label: 'Đã hủy' },
]

const typeMap: Record<string, { label: string; color: string }> = {
    'RoomBased': { label: 'Phòng trọ', color: 'text-yellow-700 bg-yellow-100' },
    'FullApartment': { label: 'Toàn bộ căn hộ', color: 'text-blue-700 bg-blue-100' },
    default: { label: 'Chưa cập nhật', color: 'text-gray-500 bg-gray-100' }
}

export const useContractData: ColumnConfig<ContractRequest>[] = [
    {
        key: 'consumerUid',
        label: 'Người thuê',
        render: (row) => row.consumerUid || 'Chưa cập nhật',
    },
    {
        key: 'apartmentUid',
        label: 'Căn hộ',
        render: (row) => row.apartmentUid || 'Chưa cập nhật',
    },
    {
        key: 'type',
        label: 'Loại hợp đồng',
        render: (row) => {
            const t = typeMap[row.type ?? 'default'] ?? typeMap.default
            return <span className={`px-2 py-1 rounded-md text-sm font-medium ${t.color}`}>{t.label}</span>
        }
    },
    {
        key: 'monthlyPrice',
        label: 'Giá thuê/tháng',
        render: (row) => row.monthlyPrice ? `${row.monthlyPrice.toLocaleString()} VNĐ` : 'Chưa cập nhật'
    },
    {
        key: 'depositAmount',
        label: 'Tiền cọc',
        render: (row) => row.depositAmount ? `${row.depositAmount.toLocaleString()} VNĐ` : 'Chưa cập nhật'
    },
    {
        key: 'startDate',
        label: 'Ngày bắt đầu',
        render: (row) => row.startDate ? new Date(row.startDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật',
    },
    {
        key: 'endDate',
        label: 'Ngày kết thúc',
        render: (row) => row.endDate ? new Date(row.endDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật',
    },
    {
        key: 'isPayment',
        label: 'Trạng thái thanh toán',
        render: (row) => {
            if (row.isPayment) {
                return <span className="px-2 py-1 rounded-md text-sm font-medium text-green-700 bg-green-100">✓ Đã thanh toán</span>
            }
            return <span className="px-2 py-1 rounded-md text-sm font-medium text-orange-700 bg-orange-100">⚠ Chưa thanh toán</span>
        }
    },
    {
        key: 'uid',
        label: 'Hành động',
        render: () => null,
    }
]

interface ContractActionsProps {
    contract: ContractRequest
    onAction?: (action: string) => void
    isLoading?: boolean
}

export const ContractActions = ({ contract, onAction, isLoading }: ContractActionsProps) => {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleAction = (action: string) => {
        if (action === 'delete') {
            setIsDeleting(true)
        }
        onAction?.(action)
    }

    React.useEffect(() => {
        if (!isLoading) {
            setIsDeleting(false)
        }
    }, [isLoading])

    const handleTogglePayment = () => {
        onAction?.('toggle-payment')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isLoading}>
                <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                    ) : (
                        <MoreHorizontal className="h-4 w-4 text-gray-600" />
                    )}
                    <span className="sr-only">Mở menu</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-48 rounded-lg shadow-lg border border-gray-200 bg-white backdrop-blur-sm"
            >
                <DropdownMenuItem
                    onClick={() => handleAction('edit')}
                    className="px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 cursor-pointer transition-colors flex items-center gap-3"
                    disabled={isLoading}
                >
                    <Edit className="h-4 w-4 text-green-600" />
                    <div className="flex flex-col">
                        <span className="font-medium">Chỉnh sửa</span>
                        <span className="text-xs text-gray-500">Cập nhật thông tin</span>
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-100" />

                <DropdownMenuItem
                    onClick={handleTogglePayment}
                    className={`px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-3 ${
                        contract.isPayment
                            ? 'text-blue-700 hover:bg-blue-50 hover:text-blue-700'
                            : 'text-orange-700 hover:bg-orange-50 hover:text-orange-700'
                    }`}
                    disabled={isLoading}
                >
                    {contract.isPayment ? (
                        <>
                            <X className="h-4 w-4 text-blue-600" />
                            <div className="flex flex-col">
                                <span className="font-medium">Hủy đánh dấu thanh toán</span>
                                <span className="text-xs text-gray-500">Đánh dấu lại chưa thanh toán</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <Check className="h-4 w-4 text-orange-600" />
                            <div className="flex flex-col">
                                <span className="font-medium">Đánh dấu đã thanh toán</span>
                                <span className="text-xs text-gray-500">Xác nhận thanh toán tháng này</span>
                            </div>
                        </>
                    )}
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-gray-100" />

                <DropdownMenuItem
                    onClick={() => handleAction('delete')}
                    className="px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer transition-colors flex items-center gap-3"
                    disabled={isLoading || isDeleting}
                >
                    {isDeleting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Trash2 className="h-4 w-4" />
                    )}
                    <div className="flex flex-col">
                        <span className="font-medium">
                            {isDeleting ? 'Đang xóa...' : 'Xóa hợp đồng'}
                        </span>
                        <span className="text-xs text-red-400">
                            {isDeleting ? 'Vui lòng chờ...' : 'Xóa vĩnh viễn'}
                        </span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
