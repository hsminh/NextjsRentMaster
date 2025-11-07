'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DialogDelete from '@/components/ui/dialog-delete'
import ctoast from '@/components/ui/Toast'
import { CDataTable } from '@/app/components/Table/CDataTable'


import {    useApartmentData,
    createApartmentPath,
    apartmentSearchKeys,
    apartmentStatusOptions,
    apartmentPageSizeOptions,
    ApartmentActions
} from "@/app/landlord/apartments/use/use-apartment-data";
import {ApartmentAPI} from "@/app/landlord/apartments/api";
import {ApartmentRequest} from "@/app/landlord/apartments/type/apartment";

export default function ApartmentsPage() {
    const router = useRouter()
    const [apartments, setApartments] = useState<ApartmentRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteApartment, setDeleteApartment] = useState<ApartmentRequest | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchApartments = async () => {
        setLoading(true)
        try {
            const api = new ApartmentAPI()
            const data = await api.list()
            setApartments(data)
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải dữ liệu căn hộ')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApartments()
    }, [])

    const handleDeleteApartment = async () => {
        if (!deleteApartment) return
        setIsDeleting(true)
        try {
            const api = new ApartmentAPI()
            await api.delete(deleteApartment.uid as string)
            setApartments((prev) => prev.filter((a) => a.uid !== deleteApartment.uid))
            setDeleteApartment(null)
            ctoast.success('Xóa căn hộ thành công!')
        } catch {
            ctoast.error('Xóa căn hộ thất bại!')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleApartmentAction = (action: string, apartment: ApartmentRequest) => {
        switch (action) {
            case 'view':
                router.push(`/landlord/apartments/${apartment.uid}/details`)
                break
            case 'edit':
                router.push(`/landlord/apartments/${apartment.uid}/edit`)
                break
            case 'delete':
                setDeleteApartment(apartment)
                break
            default:
                break
        }
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-center">
                    <p>Đã xảy ra lỗi khi tải dữ liệu căn hộ</p>
                    <p className="text-sm text-gray-600 mt-2">{error}</p>
                </div>
            </div>
        )
    }

    const columns = useApartmentData.map((col) => {
        if (col.key === 'uid') {
            return {
                ...col,
                render: (row: ApartmentRequest) => (
                    <ApartmentActions
                        user={row}
                        onAction={(action) => handleApartmentAction(action, row)}
                        isLoading={isDeleting && deleteApartment?.uid === row.uid}
                    />
                ),
            }
        }
        return col
    })

    return (
        <>
            <CDataTable
                data={apartments}
                createPath={createApartmentPath}
                columns={columns}
                searchKeys={apartmentSearchKeys}
                statusKey="uid"
                statusOptions={apartmentStatusOptions}
                pageSizeOptions={apartmentPageSizeOptions}
                loading={loading}
            />

            <DialogDelete
                isOpen={!!deleteApartment}
                onClose={() => setDeleteApartment(null)}
                onConfirm={handleDeleteApartment}
                isLoading={isDeleting}
                title="Xác nhận xóa"
                deleteQuestion={`Bạn có chắc chắn muốn xóa căn hộ "${deleteApartment?.title}" không?`}
            />
        </>
    )
}
