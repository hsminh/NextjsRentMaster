'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AdminUsersAPI } from '../../api'
import type { AdminUser } from '../../types'
import { toastError } from '@/components/ui/Toast'

export default function UserDetailsPage() {
  const params = useParams() as { id?: string }
  const router = useRouter()
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
        toastError('Không thể lấy chi tiết người dùng')
      } finally {
        setLoading(false)
      }
    }
    fetchDetail()
  }, [id])

  if (!id) return <div>Invalid user id</div>

  return (
    <div className="max-w-2xl bg-white p-6 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">User Details</h2>
        <div>
          <button onClick={() => router.push('/admin/users')} className="px-3 py-1 border rounded">Back</button>
        </div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : user ? (
        <div className="space-y-3 text-sm text-gray-800">
          <div><strong>Gmail:</strong> {user.gmail}</div>
          <div><strong>Name:</strong> {(user.firstName ?? '') + ' ' + (user.lastName ?? '')}</div>
          <div><strong>Phone:</strong> {user.phoneNumber}</div>
          <div><strong>UID:</strong> {user.uid}</div>
          <div><strong>Created At:</strong> {user.createdAt}</div>
          <div><strong>Updated At:</strong> {user.updatedAt}</div>
          <div><strong>Deleted:</strong> {user.isDelete ? 'Yes' : 'No'}</div>
        </div>
      ) : (
        <div>Không tìm thấy người dùng</div>
      )}
    </div>
  )
}

