'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DialogDelete from '@/components/ui/dialog-delete'
import type { AdminUser } from './types'
import { AdminUsersAPI } from './api'
import {
    createUserPath,
    UserActions,
    userPageSizeOptions,
    userSearchKeys,
    userStatusOptions,
    useUserColumns
} from './use/use-data-table'
import ctoast from "@/components/ui/Toast"
import {CDataTable} from "@/app/components/Table/CDataTable";
import CLoading from "@/components/ui/CLoading";

export default function UsersPage() {
    const router = useRouter()

    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchUsers = async () => {
        setLoading(true)
        try {
            const api = new AdminUsersAPI()
            const data = await api.list()
            setUsers(data)
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải dữ liệu')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleDeleteUser = async () => {
        if (!deleteUser) return
        setIsDeleting(true)
        try {
            const api = new AdminUsersAPI()
            await api.delete(deleteUser.uid)
            setUsers((prev) => prev.filter((u) => u.uid !== deleteUser.uid))
            setDeleteUser(null)
            ctoast.success('Xóa Người Dùng Thành Công!')
        } catch (err: any) {
            ctoast.error('Xóa Người Dùng Thất Bại!')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleUserAction = (action: string, user: AdminUser) => {
        switch (action) {
            case 'view':
                router.push(`/admin/users/${user.uid}/details`)
                break
            case 'edit':
                router.push(`/admin/users/${user.uid}/edit`)
                break
            case 'delete':
                setDeleteUser(user)
                break
            default:
                break
        }
    }


    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-center">
                    <p>Đã xảy ra lỗi khi tải dữ liệu</p>
                    <p className="text-sm text-gray-600 mt-2">{error}</p>
                </div>
            </div>
        )
    }

    const columns = useUserColumns().map((col) => {
        if (col.key === 'uid') {
            return {
                ...col,
                render: (row: AdminUser) => (
                    <UserActions
                        user={row}
                        onAction={(action) => handleUserAction(action, row)}
                        isLoading={isDeleting && deleteUser?.uid === row.uid}
                    />
                ),
            }
        }
        return col
    })

    return (
        <>
            <CDataTable
                data={users}
                createPath={createUserPath}
                columns={columns}
                searchKeys={userSearchKeys}
                statusKey="isDelete"
                statusOptions={userStatusOptions}
                pageSizeOptions={userPageSizeOptions}
                loading={loading}
            />


            <DialogDelete
                isOpen={!!deleteUser}
                onClose={() => setDeleteUser(null)}
                onConfirm={handleDeleteUser}
                isLoading={isDeleting}
                title="Xác nhận xóa"
                deleteQuestion={`Bạn có chắc chắn muốn xóa tài khoản ${deleteUser?.gmail}?`}
            />
        </>
    )
}
