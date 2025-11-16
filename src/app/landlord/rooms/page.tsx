'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DialogDelete from '@/components/ui/dialog-delete'
import ctoast from '@/components/ui/Toast'
import { CDataTable } from '@/app/components/Table/CDataTable'

import {
    useRoomData,
    createRoomPath,
    roomSearchKeys,
    roomStatusOptions,
    roomPageSizeOptions,
    RoomActions
} from "@/app/landlord/rooms/use/use-room-data";
import { RoomAPI, RoomRequest } from "@/app/landlord/rooms/api";

export default function RoomsPage() {
    const router = useRouter()
    const [rooms, setRooms] = useState<RoomRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [deleteRoom, setDeleteRoom] = useState<RoomRequest | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const fetchRooms = async () => {
        setLoading(true)
        try {
            const api = new RoomAPI()
            const data = await api.list()
            setRooms(data)
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải dữ liệu phòng')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRooms()
    }, [])

    const handleDeleteRoom = async () => {
        if (!deleteRoom) return
        setIsDeleting(true)
        try {
            const api = new RoomAPI()
            await api.delete(deleteRoom.uid as string)
            setRooms((prev) => prev.filter((r) => r.uid !== deleteRoom.uid))
            setDeleteRoom(null)
            ctoast.success('Xóa phòng thành công!')
        } catch {
            ctoast.error('Xóa phòng thất bại!')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleRoomAction = (action: string, room: RoomRequest) => {
        switch (action) {
            case 'view':
                router.push(`/landlord/rooms/${room.uid}/details`)
                break
            case 'edit':
                router.push(`/landlord/rooms/${room.uid}/edit`)
                break
            case 'delete':
                setDeleteRoom(room)
                break
            default:
                break
        }
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-red-500 text-center">
                    <p>Đã xảy ra lỗi khi tải dữ liệu phòng</p>
                    <p className="text-sm text-gray-600 mt-2">{error}</p>
                </div>
            </div>
        )
    }

    const columns = useRoomData.map((col) => {
        if (col.key === 'uid') {
            return {
                ...col,
                render: (row: RoomRequest) => (
                    <RoomActions
                        room={row}
                        onAction={(action) => handleRoomAction(action, row)}
                        isLoading={isDeleting && deleteRoom?.uid === row.uid}
                    />
                ),
            }
        }
        return col
    })

    return (
        <>
            <CDataTable
                data={rooms}
                createPath={createRoomPath}
                columns={columns}
                searchKeys={roomSearchKeys}
                statusKey="status"
                statusOptions={roomStatusOptions}
                pageSizeOptions={roomPageSizeOptions}
                loading={loading}
            />

            <DialogDelete
                isOpen={!!deleteRoom}
                onClose={() => setDeleteRoom(null)}
                onConfirm={handleDeleteRoom}
                isLoading={isDeleting}
                title="Xác nhận xóa"
                deleteQuestion={`Bạn có chắc chắn muốn xóa phòng "${deleteRoom?.roomNumber}" không?`}
            />
        </>
    )
}
