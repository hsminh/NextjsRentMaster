import { TenantRequest } from "../type/tenant";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BreadcrumbNavigationProps } from "@/app/components/layout/BreadcrumbNavigation";
import {ColumnConfig} from "@/app/components/Table/CDataTable";


export const tenantBreadcrumbBase = {
  homeHref: "/landlord/tenants",
  homeLabel: "Quản lý",
} as const;

export const tenantListBreadcrumb: BreadcrumbNavigationProps = {
  ...tenantBreadcrumbBase,
  items: [
    { label: "Người thuê", href: "/landlord/tenants" },
    { label: "Danh sách" },
  ],
};

export const tenantCreateBreadcrumb: BreadcrumbNavigationProps = {
  ...tenantBreadcrumbBase,
  items: [
    { label: "Danh sách", href: "/landlord/tenants" },
    { label: "Tạo mới" },
  ],
};

export const tenantEditBreadcrumb: BreadcrumbNavigationProps = {
  ...tenantBreadcrumbBase,
  items: [
    { label: "Danh sách", href: "/landlord/tenants" },
    { label: "Cập nhật" },
  ],
};

export const tenantDetailBreadcrumb: BreadcrumbNavigationProps = {
  ...tenantBreadcrumbBase,
  items: [
    { label: "Danh sách", href: "/landlord/tenants" },
    { label: "Chi tiết" },
  ],
};

export const tenantPageSizeOptions = [5, 10, 25, 50];

export const useTenantData: ColumnConfig<TenantRequest>[] = [
  {
    key: 'consumer',
    label: 'Người thuê',
    render: (row) => `${row.consumer?.firstName || ''} ${row.consumer?.lastName || ''}`.trim() || 'Chưa cập nhật',
  },
  {
    key: 'realEstateUnit.title',
    label: 'Căn hộ',
    render: (row) => row.realEstateUnit?.title || 'Chưa cập nhật',
  },
  {
    key: 'status',
    label: 'Trạng thái',
    render: (row) => {
      const statusMap: Record<string, string> = {
        'Pending': 'Đang chờ',
        'Approved': 'Đã duyệt',
        'Rejected': 'Từ chối'
      };
      return statusMap[row.status] || row.status || 'Chưa cập nhật';
    },
  },
  {
    key: 'type',
    label: 'Loại',
    render: (row) => {
      const typeMap: Record<string, string> = {
        'FullApartment': 'Toàn bộ căn hộ',
        'Room': 'Phòng trọ',
        'SharedRoom': 'Phòng ghép'
      };
      return typeMap[row.type] || row.type || 'Chưa cập nhật';
    },
  },
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    render: (row) => new Date(row.createdAt).toLocaleDateString('vi-VN'),
  },
  {
    key: 'actions',
    label: 'Hành động',
    render: (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => window.location.href = `/landlord/tenants/${row.uid}/edit`}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Chỉnh sửa</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600">
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Xóa</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

interface TenantActionsProps {
  tenant: TenantRequest;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

export function TenantActions({ tenant, onView, onEdit, onDelete, isLoading = false }: TenantActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
          <span className="sr-only">Mở menu</span>
          {isLoading ? (
            <span className="h-4 w-4 animate-spin">↻</span>
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          <span>Xem chi tiết</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" />
          <span>Chỉnh sửa</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Xóa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
