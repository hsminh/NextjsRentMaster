'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Card } from "@/components/ui/card"
import {ApartmentRoomRequest} from "@/app/landlord/rooms/type/apartment";
import {RoomAPI} from "@/app/landlord/rooms/api";
import {ApartmentRoomForm} from "@/app/landlord/rooms/components/ApartmentRoomForm";
import {BreadcrumbNavigation} from "@/app/components/layout/BreadcrumbNavigation";
import {getApartmentDetailBreadcrumb} from "@/app/landlord/apartments/use/use-apartment-data";
import {ApartmentForm} from "@/app/landlord/apartments/components/ApartmentForm";
import {roomDetailBreadcrumb} from "@/app/landlord/rooms/use/use-room-data";


export default function DetailApartmentRoomPage() {
    const params = useParams()
    const [apartment, setApartment] = useState<ApartmentRoomRequest | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchApartment = async () => {
            try {
                const api = new RoomAPI()
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
        <div className="min-h-full space-y-4">
            <BreadcrumbNavigation {...roomDetailBreadcrumb} />
        <div className="min-h-full">
            <Card className="w-full">
                <div className="px-6">
                    <ApartmentRoomForm isDetails={true} initialData={apartment} />
                </div>
            </Card>
        </div>
        </div>
    )
}
