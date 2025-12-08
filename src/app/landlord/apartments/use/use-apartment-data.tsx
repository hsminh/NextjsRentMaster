import { ColumnConfig } from "@/app/admin/(features)/users/use/use-data-table";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Loader2, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { ApartmentRequest } from "@/app/landlord/apartments/type/apartment";
import { BreadcrumbNavigationProps } from "@/app/components/layout/BreadcrumbNavigation";

export const createApartmentPath = '/landlord/apartments/create'
export const apartmentSearchKeys: (keyof ApartmentRequest)[] = []

export const apartmentBreadcrumbBase = {
    homeHref: "/landlord/apartments",
    homeLabel: "Quản lý",
} as const;

export const apartmentListBreadcrumb: BreadcrumbNavigationProps = {
    ...apartmentBreadcrumbBase,
    items: [
        { label: "Căn hộ", href: "/landlord/apartments" },
        { label: "Danh sách" },
    ],
};

export const apartmentCreateBreadcrumb: BreadcrumbNavigationProps = {
    ...apartmentBreadcrumbBase,
    items: [
        { label: "Danh Sách", href: "/landlord/apartments" },
        { label: "Tạo mới" },
    ],
};

export const apartmentEditBreadcrumb: BreadcrumbNavigationProps = {
    ...apartmentBreadcrumbBase,
    items: [
        { label: "Danh Sách", href: "/landlord/apartments" },
        { label: "Cập Nhật" },
    ],
};

export const getApartmentDetailBreadcrumb = {
    ...apartmentBreadcrumbBase,
    items: [
        { label: "Danh Sách", href: "/landlord/apartments" },
        { label: "Chi tiết" },
    ],
};

export const apartmentStatusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'false', label: 'Hoạt động' },
    { value: 'true', label: 'Đã vô hiệu hóa' },
]

export const apartmentPageSizeOptions = [5, 10, 25, 50]

export const useApartmentData: ColumnConfig<ApartmentRequest>[] = [
    {
        key: 'title',
        label: 'title',
        render: (row) => row.title || 'N/A',
    },
    {
        key: 'price',
        label: 'price',
        render: (row) => row.price || 'Chưa cập nhật',
    },
    {
        key: 'status',
        label: 'status',
        render: (row) => row.status || 'Chưa cập nhật',
    },
    {
        key: 'type',
        label: 'type',
        render: (row) => row.type || 'Chưa cập nhật',
    },
    {
        key: 'areaLength',
        label: 'areaLength',
        render: (row) => row.areaLength || 'Chưa cập nhật',
    },
    {
        key: 'areaWidth',
        label: 'areaWidth',
        render: (row) => row.areaWidth || 'Chưa cập nhật',
    },
    {
        key: 'uid',
        label: 'Hành động',
        render: () => null,
    },
]

interface ApartmentActions {
    user: ApartmentRequest
    onAction?: (action: string) => void
    isLoading?: boolean
}

export const ApartmentActions = ({ user, onAction, isLoading }: ApartmentActions) => {
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
                {/* View Action */}
                <DropdownMenuItem
                    onClick={() => handleAction('view')}
                    className="px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 cursor-pointer transition-colors flex items-center gap-3"
                    disabled={isLoading}
                >
                    <Eye className="h-4 w-4 text-blue-600" />
                    <div className="flex flex-col">
                        <span className="font-medium">Xem chi tiết</span>
                        <span className="text-xs text-gray-500">Xem thông tin căn hộ</span>
                    </div>
                </DropdownMenuItem>

                {/* Edit Action */}
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

                {/* Delete Action */}
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
                            {isDeleting ? 'Đang xóa...' : 'Xóa căn hộ'}
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