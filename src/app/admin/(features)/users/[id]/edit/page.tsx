'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminUsersAPI } from '../../api'
import type { AdminUser } from '../../types'
import ctoast from '@/components/ui/Toast'
import { Card } from '@/components/ui/card'
import LandLordComponentForm from '@/app/admin/(features)/users/components/LandLordComponentForm'
import { Loader2 } from 'lucide-react'
import {BreadcrumbNavigation} from "@/app/components/layout/BreadcrumbNavigation";
import {getApartmentDetailBreadcrumb} from "@/app/landlord/apartments/use/use-apartment-data";
import {ApartmentForm} from "@/app/landlord/apartments/components/ApartmentForm";
export default function UserEditPage() {
    const params = useParams() as { id?: string }
    const id = params?.id
    const api = new AdminUsersAPI()

    const [user, setUser] = useState<AdminUser | null>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!id) return

        const fetchDetail = async () => {
            setLoading(true)
            try {
                const data = await api.detail(id)
                setUser(data)
            } catch (err: any) {
                ctoast.error('Không thể lấy chi tiết người dùng')
            } finally {
                setLoading(false)
            }
        }

        fetchDetail()
    }, [id])

    if (!id) return <div>Invalid user id</div>

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary w-6 h-6 mr-2" />
                <span>Đang tải dữ liệu...</span>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center h-64 text-gray-500">
                Không tìm thấy thông tin người dùng.
            </div>
        )
    }

    return (<div className="min-h-full space-y-4">
        <BreadcrumbNavigation {...getApartmentDetailBreadcrumb} />
        <div className="min-h-full">
            <Card className="w-full mt-4">
                <div className="p-6">
                    <LandLordComponentForm isEdit={true} initialData={user} />
                </div>
            </Card>
        </div>
        </div>
    )
}
