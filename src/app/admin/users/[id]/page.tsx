'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import LandLordComponentForm from '@/app/admin/users/components/LandLordComponentForm'
import { Card } from "@/components/ui/card"
import { AdminUsersAPI } from "@/app/admin/users/api"
import type { AdminUser } from '@/app/admin/users/types'

export default function UserEditPageWrapper() {
    const params = useParams() as { id?: string }
    const id = params?.id
    const api = new AdminUsersAPI()

    const [user, setUser] = useState<AdminUser | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id) return

        const fetchUser = async () => {
            try {
                setLoading(true)
                const data = await api.detail(id)
                setUser(data)
            } catch (err) {
                setError('Không thể tải dữ liệu người dùng')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchUser()
    }, [id])

    if (!id) return <div>Invalid user id</div>
    if (loading) return <div>Đang tải dữ liệu...</div>
    if (error) return <div>{error}</div>

    return (
        <div className="min-h-full">
            <Card className="w-full mt-4">
                <div className="p-6">
                    <LandLordComponentForm isEdit={true} initialData={user} />
                </div>
            </Card>
        </div>
    )
}
