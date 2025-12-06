'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CDataTable } from '@/app/components/Table/CDataTable'
import { BreadcrumbNavigation } from "@/app/components/layout/BreadcrumbNavigation"

// Tenant related imports
import { 
  useTenantData, 
  tenantListBreadcrumb,
  tenantPageSizeOptions,
  TenantActions 
} from "./use/use-tenant-data"
import { TenantAPI } from "./api"
import { TenantRequest } from "./type/tenant"

export default function TenantPage() {
  const router = useRouter()
  const [tenants, setTenants] = useState<TenantRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const columns = useTenantData

  const fetchTenants = async () => {
    setLoading(true)
    try {
      const api = new TenantAPI()
      const data = await api.list()
      setTenants(data)
    } catch (err: any) {
      setError(err.message || 'Lỗi khi tải dữ liệu người thuê')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTenants()
  }, [])

  const handleTenantAction = (action: string, tenant: TenantRequest) => {
    switch (action) {
      case 'view':
        router.push(`/landlord/tenants/${tenant.uid}`)
        break
      case 'edit':
        router.push(`/landlord/tenants/${tenant.uid}/edit`)
        break
      default:
        break
    }
  }

  const searchKeys = ['consumer.firstName', 'consumer.lastName', 'realEstateUnit.title']

  return (
    <div className="p-6">
      <BreadcrumbNavigation {...tenantListBreadcrumb} />
      <div className="bg-white rounded-lg shadow mt-4">
        <CDataTable
          data={tenants}
          columns={columns}
          searchKeys={searchKeys}
          pageSizeOptions={tenantPageSizeOptions}
          noDataText="Không có dữ liệu người thuê"
          loading={loading}
          searchPlaceholder="Tìm kiếm người thuê..."
        />
      </div>
    </div>
  )
}
