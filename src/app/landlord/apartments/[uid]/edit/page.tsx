'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ApartmentForm } from '../../components/ApartmentForm'
import { ApartmentAPI } from '../../api'
import { ApartmentRequest } from '../../type/apartment'
import { Loader2 } from 'lucide-react'

export default function EditApartmentPage() {
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
        <Loader2 className="h-8 w-8 animate-spin" />
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Chỉnh sửa thông tin căn hộ</h1>
        <p className="text-muted-foreground">
          Cập nhật thông tin chi tiết về căn hộ của bạn
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <ApartmentForm initialData={apartment} isEdit />
      </div>
    </div>
  )
}
