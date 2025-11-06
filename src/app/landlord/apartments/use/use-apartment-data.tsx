import {ColumnConfig} from "@/app/admin/(features)/users/use/use-data-table";
import {useState} from "react";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {Loader2, MoreHorizontal} from "lucide-react";
import {ApartmentRequest} from "@/app/landlord/apartments/type/apartment";


export const createApartmentPath = '/landlord/apartments/create'
export const apartmentSearchKeys: (keyof ApartmentRequest)[] = ['areaLength']

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
        key: 'quantity',
        label: 'quantity',
        render: (row) => row.quantity || 'Chưa cập nhật',
    },
    {
        key: 'floorNumber',
        label: 'floorNumber',
        render: (row) => row.floorNumber || 'Chưa cập nhật',
    },
    {
        key: 'totalFloors',
        label: 'totalFloors',
        render: (row) => row.totalFloors || 'Chưa cập nhật',
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