'use client'

import React, { useEffect, useState } from 'react'
import { AdminUsersAPI } from './api'
import type { AdminUser } from './types'
import { toastError, toastSuccess } from '@/components/ui/Toast'
import Link from 'next/link'

export default function UsersPage() {
  const api = new AdminUsersAPI()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await api.list()
      setUsers(data)
    } catch (err: any) {
      toastError('Không thể lấy danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const remove = async (u: AdminUser) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return
    try {
      await api.delete(u.uid)
      toastSuccess('Xóa thành công')
      fetchUsers()
    } catch (err: any) {
      toastError('Xóa thất bại')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div>
          <Link href="/admin/users/create" className="bg-blue-600 text-white px-4 py-2 rounded-md inline-block">Create</Link>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2">Gmail</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Phone</th>
                <th className="px-4 py-2">UID</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.uid} className="border-t">
                  <td className="px-4 py-2">{u.gmail}</td>
                  <td className="px-4 py-2">{(u.firstName ?? '') + ' ' + (u.lastName ?? '')}</td>
                  <td className="px-4 py-2">{u.phoneNumber}</td>
                  <td className="px-4 py-2">{u.uid}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Link href={`/admin/users/${u.uid}`} className="text-blue-600 mr-2">Edit</Link>
                    <Link href={`/admin/users/${u.uid}/details`} className="text-gray-700 mr-2">Details</Link>
                    <button onClick={() => remove(u)} className="text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
