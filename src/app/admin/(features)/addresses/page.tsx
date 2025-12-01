'use client'

import { useState, useEffect } from 'react'
import { CDataTable, ColumnConfig } from "@/app/components/Table/CDataTable"
import ctoast from "@/components/ui/Toast"
import { AddressAPI } from '@/app/admin/(features)/addresses/api/address-api'
import type { AddressDivision } from '@/app/admin/(features)/addresses/types'
import { BreadcrumbNavigation } from '@/app/components/layout/BreadcrumbNavigation'

const addressApi = new AddressAPI()

export default function AddressPage() {
    const [provinces, setProvinces] = useState<AddressDivision[]>([])
    const [wards, setWards] = useState<AddressDivision[]>([])
    const [streets, setStreets] = useState<AddressDivision[]>([])

    const [selectedProvince, setSelectedProvince] = useState<string>('')
    const [selectedWard, setSelectedWard] = useState<string>('')

    const [loadingProvinces, setLoadingProvinces] = useState(true)
    const [loadingWards, setLoadingWards] = useState(false)
    const [loadingStreets, setLoadingStreets] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Load provinces
    useEffect(() => {
        const fetchProvinces = async () => {
            setLoadingProvinces(true)
            try {
                const data = await addressApi.getProvinces()
                setProvinces(data)
            } catch (err: any) {
                setError(err.message || 'Lỗi khi tải danh sách tỉnh')
                ctoast.error(err.message || 'Lỗi khi tải danh sách tỉnh')
            } finally {
                setLoadingProvinces(false)
            }
        }
        fetchProvinces()
    }, [])

    // Load wards
    useEffect(() => {
        setSelectedWard("")
        setStreets([])

        if (!selectedProvince) {
            setWards([])
            return
        }

        const fetchWards = async () => {
            setLoadingWards(true)
            try {
                const data = await addressApi.getChildren(selectedProvince)
                setWards(data)
            } catch (err: any) {
                setError(err.message || 'Lỗi khi tải danh sách phường/xã')
                ctoast.error(err.message || 'Lỗi khi tải danh sách phường/xã')
            } finally {
                setLoadingWards(false)
            }
        }
        fetchWards()
    }, [selectedProvince])

    // Load streets
    useEffect(() => {
        if (!selectedWard) {
            setStreets([])
            return
        }

        const fetchStreets = async () => {
            setLoadingStreets(true)
            try {
                const data = await addressApi.getChildren(selectedWard, 'street')
                setStreets(data)
            } catch {
                ctoast.error("Lỗi tải danh sách đường")
            } finally {
                setLoadingStreets(false)
            }
        }
        fetchStreets()
    }, [selectedWard])

    // Handle CSV import
    const handleImport = async (e: any) => {
        const file = e.target.files?.[0]
        if (!file) return

        const formData = new FormData()
        formData.append("file", file)

        try {
            const res =await fetch("http://localhost:5279/public/address/import", {
                method: "POST",
                body: formData
            })

            const data = await res.json()
            if (res.ok) {
                ctoast.success(data.message || "Import thành công!")
            } else {
                ctoast.error(data.message || "Import thất bại!")
            }
        } catch {
            ctoast.error("Không thể kết nối server")
        }
    }

    const wardColumns: ColumnConfig<AddressDivision>[] = [
        { key: 'code', label: 'Mã', render: row => row.code },
        { key: 'name', label: 'Tên', render: row => row.name },
        { key: 'type', label: 'Loại', render: row => row.type },
        { key: 'parentId', label: 'Parent UID', render: row => row.parentId || '-' },
        { key: 'isDeprecated', label: 'Ngừng sử dụng', render: row => row.isDeprecated ? 'Có' : 'Không' },
    ]

    const streetColumns: ColumnConfig<AddressDivision>[] = [
        { key: 'code', label: 'Mã', render: row => row.code },
        { key: 'name', label: 'Tên đường', render: row => row.name },
        { key: 'parentId', label: 'Thuộc phường UID', render: row => row.parentId || '-' },
    ]

    return (
        <div className="min-h-full space-y-4 p-4">
            <BreadcrumbNavigation items={[{ label: 'Địa chỉ', href: '/admin/address' }]} />

            {/* Import CSV */}
            <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded cursor-pointer">
                Import CSV
                <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
            </label>

            {/* Province Select */}
            <div>
                <label className="block mb-1 font-medium">Chọn tỉnh:</label>
                <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
                    <option value="">-- Chọn tỉnh --</option>
                    {provinces.map(p => (
                        <option key={p.uid} value={p.uid}>{p.name}</option>
                    ))}
                </select>
            </div>

            {/* Ward Select */}
            <div>
                <label className="block mb-1 font-medium">Chọn phường/xã:</label>
                <select
                    value={selectedWard}
                    onChange={(e) => setSelectedWard(e.target.value)}
                    disabled={wards.length === 0}
                >
                    <option value="">-- Chọn phường/xã --</option>
                    {wards.map(w => (
                        <option key={w.uid} value={w.uid}>{w.name}</option>
                    ))}
                </select>
            </div>

            {/* Wards Table */}
            <CDataTable
                data={wards}
                columns={wardColumns}
                searchKeys={['name', 'code']}
                statusKey="isDeprecated"
                statusOptions={[
                    { value: 'false', label: 'Đang sử dụng' },
                    { value: 'true', label: 'Ngừng sử dụng' }
                ]}
                pageSizeOptions={[10, 20, 50]}
                loading={loadingWards}
            />

            {/* Streets Table */}
            {selectedWard && (
                <CDataTable
                    data={streets}
                    columns={streetColumns}
                    searchKeys={['name', 'code']}
                    pageSizeOptions={[10, 20, 50]}
                    loading={loadingStreets}
                />
            )}

            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    )
}
