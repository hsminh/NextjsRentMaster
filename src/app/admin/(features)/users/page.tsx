'use client'

import { useState, useEffect } from 'react'
import { DialogOption } from '@/components/ui/dialog-option'
import type { AdminUser } from './types'
import {
    createUserPath,
    UserActions,
    userPageSizeOptions,
    userSearchKeys,
    userStatusOptions as rawStatusOptions,
    useUserColumns
} from './use/use-data-table'

import ctoast from "@/components/ui/Toast"
import { CDataTable } from "@/app/components/Table/CDataTable"
import { AdminUsersAPI } from "@/app/admin/(features)/users/api"

// Mở rộng AdminUser tạm thời để UI biết action
type AdminUserWithAction = AdminUser & { action?: 'activate' | 'deactivate' }

const userStatusOptions = [...rawStatusOptions] as Array<{ value: AdminUser['Status']; label: string }>

export default function UsersPage() {
    const [users, setUsers] = useState<AdminUser[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userToUpdate, setUserToUpdate] = useState<AdminUserWithAction | null>(null)
    const [isUpdating, setIsUpdating] = useState(false)

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

    const handleUpdateUserStatus = async (uid: string, status: AdminUser['Status']) => {
        if (!userToUpdate) {
            ctoast.error('Không tìm thấy thông tin người dùng')
            return
        }

        setIsUpdating(true)
        try {
            const api = new AdminUsersAPI()
            const updateData = { ...userToUpdate, Status: status }

            // Cập nhật server
            await api.update(uid, updateData as any)

            // Update state local
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.uid === uid ? { ...user, Status: status } : user
                )
            )

            setUserToUpdate(null)
            ctoast.success(`Đã cập nhật trạng thái người dùng thành ${status === 'Active' ? 'Hoạt động' : 'Vô hiệu hóa'}`)
        } catch (err: any) {
            console.error('Error updating user status:', err)
            ctoast.error(err.message || 'Có lỗi xảy ra khi cập nhật trạng thái')
        } finally {
            setIsUpdating(false)
        }
    }

    const getDialogTitle = (action?: string) =>
        action === 'deactivate'
            ? 'Xác nhận vô hiệu hóa tài khoản'
            : 'Xác nhận kích hoạt tài khoản'

    const getDialogDescription = (user: AdminUserWithAction | null) => {
        if (!user?.action) return ''
        const userName = user.gmail || 'người dùng này'
        return user.action === 'deactivate'
            ? `Bạn có chắc chắn muốn vô hiệu hóa tài khoản ${userName}?`
            : `Bạn có chắc chắn muốn kích hoạt lại tài khoản ${userName}?`
    }

    const getConfirmButtonText = (action?: string) =>
        action === 'deactivate' ? 'Vô hiệu hóa' : 'Kích hoạt'

    const handleUserAction = (action: string, user: AdminUser) => {
        switch (action) {
            case 'view':
                window.location.href = `/admin/users/${user.uid}/details`
                break
            case 'edit':
                window.location.href = `/admin/users/${user.uid}/edit`
                break
            case 'deactivate':
                setUserToUpdate({ ...user, action: 'deactivate' })
                break
            case 'activate':
                setUserToUpdate({ ...user, action: 'activate' })
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

    const columns = useUserColumns().map(col => {
        if (col.key === 'uid') {
            return {
                ...col,
                render: (row: AdminUser) => (
                    <UserActions
                        user={row}
                        onAction={(action) => handleUserAction(action, row)}
                        isLoading={isUpdating && userToUpdate?.uid === row.uid}
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
                statusKey="Status"
                statusOptions={userStatusOptions}
                pageSizeOptions={userPageSizeOptions}
                loading={loading}
            />

            <DialogOption
                isOpen={!!userToUpdate}
                onClose={() => !isUpdating && setUserToUpdate(null)}
                onConfirm={() => {
                    if (!userToUpdate?.action) return
                    const newStatus: AdminUser['Status'] =
                        userToUpdate.action === 'deactivate' ? 'Inactive' : 'Active'
                    handleUpdateUserStatus(userToUpdate.uid, newStatus)
                }}
                title={getDialogTitle(userToUpdate?.action)}
                description={getDialogDescription(userToUpdate)}
                variant={userToUpdate?.action === 'deactivate' ? 'destructive' : 'default'}
                confirmText={getConfirmButtonText(userToUpdate?.action)}
                isLoading={isUpdating}
            />
        </>
    )
}
