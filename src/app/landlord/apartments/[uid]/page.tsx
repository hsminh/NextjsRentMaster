'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ApartmentAPI } from '../../api'
import { ApartmentRequest } from '../../type/apartment'
import { ApartmentTypeLabels, ApartmentStatusLabels } from '../../type/apartment-enums'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export default function ApartmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [apartment, setApartment] = useState<ApartmentRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const api = new ApartmentAPI()
        const data = await api.detail(params.uid as string)
        setApartment(data)
      } catch (error) {
        console.error('Failed to fetch apartment:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.uid) {
      fetchApartment()
    }
  }, [params.uid])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    )
  }

  if (!apartment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Không tìm thấy căn hộ</h2>
        <p className="text-muted-foreground mt-2">
          Căn hộ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">{apartment.title}</h1>
            <p className="text-muted-foreground">
              Cập nhật lần cuối: {format(new Date(apartment.updatedAt || ''), 'PPP', { locale: vi })}
            </p>
          </div>
          <Button
            onClick={() => router.push(`/landlord/apartments/${apartment.uid}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Thông tin cơ bản</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Trạng thái</p>
                <p className="font-medium">
                  {ApartmentStatusLabels[apartment.status as keyof typeof ApartmentStatusLabels]}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Loại phòng</p>
                <p className="font-medium">
                  {ApartmentTypeLabels[apartment.type as keyof typeof ApartmentTypeLabels]}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Giá thuê</p>
                <p className="font-medium">
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(apartment.price)}
                  <span className="text-sm text-muted-foreground">/tháng</span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Diện tích</p>
                <p className="font-medium">
                  {apartment.areaLength * apartment.areaWidth}m²
                </p>
                <p className="text-xs text-muted-foreground">
                  ({apartment.areaLength}m × {apartment.areaWidth}m)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số tầng</p>
                <p className="font-medium">
                  Tầng {apartment.floorNumber}/{apartment.totalFloors}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số lượng phòng</p>
                <p className="font-medium">{apartment.quantity}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Mô tả</h2>
          <p className="text-muted-foreground whitespace-pre-line">
            {apartment.description || 'Chưa có mô tả'}
          </p>
        </div>

        {apartment.images && apartment.images.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Hình ảnh</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {apartment.images.map((image, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={image}
                    alt={`Hình ảnh ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
