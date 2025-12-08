'use client'

import { useState, useEffect } from 'react'
import { CDataTable, ColumnConfig } from "@/app/components/Table/CDataTable"
import ctoast from "@/components/ui/Toast"
import { AddressAPI } from '@/app/admin/(features)/addresses/api/address-api'
import type { AddressDivision } from '@/app/admin/(features)/addresses/types'
import { BreadcrumbNavigation } from '@/app/components/layout/BreadcrumbNavigation'
import { CreateAddressDto } from '@/app/admin/(features)/addresses/DTO'
import { useRef } from "react";


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
    const fileInputRef = useRef<HTMLInputElement>(null);


    // ----- ADD ADDRESS STATE -----
    const [showAddModal, setShowAddModal] = useState(false)
    const [newName, setNewName] = useState('')
    const [newType, setNewType] = useState<'province' | 'ward' | 'street'>('province')
    const [newParentId, setNewParentId] = useState<string | undefined>()
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
        const fetchAllStreets = async () => {
            setLoadingStreets(true);
            try {
                const data = await addressApi.getStreets();
                setStreets(data);
            } catch {
                ctoast.error("Không thể tải danh sách đường");
            } finally {
                setLoadingStreets(false);
            }
        };
        fetchAllStreets();
    }, []);
    // Handle CSV import

    const handleImportFile = async (file: File) => {
        try {
            console.log("Uploading file:", file.name, file.size, file.lastModified);
            const res = await addressApi.importCSV(file)
            ctoast.success(res.message || "Import thành công!");
        } catch (err: any) {
            ctoast.error(err.message || "Import thất bại!");
        } finally {
            // Reset input để chắc chắn onChange sẽ trigger lần sau
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }
    const wardColumns: ColumnConfig<AddressDivision>[] = [
        { key: 'code', label: 'Mã', render: row => row.code },
        { key: 'name', label: 'Tên', render: row => row.name },
        { key: 'type', label: 'Loại', render: row => row.type },
        { key: 'parentId', label: 'Parent UID', render: row => row.parentId || '-' },
        { key: 'isDeprecated', label: ' Ngừng sử dụng', render: row => row.isDeprecated ? 'Có' : 'Không' },
        {
            key: 'actions',
            label: 'Hành động',
            render: (row: AddressDivision) => (
                <div className="flex space-x-2">
                    <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() => handleEditAddress(row)}
                    >
                        Chỉnh sửa
                    </button>
                    {/* Nếu muốn thêm nút khác, vd. Xóa */}
                    { <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Xóa</button> }
                </div>
            ),
        }
    ]

    const streetColumns: ColumnConfig<AddressDivision>[] = [
        { key: 'code', label: 'Mã', render: row => row.code },
        { key: 'name', label: 'Tên đường', render: row => row.name },
        {
            key: 'actions',
            label: 'Hành động',
            render: (row: AddressDivision) => (
                <div className="flex space-x-2">
                    <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() => handleEditAddress(row)}
                    >
                        Chỉnh sửa
                    </button>
                    {/* Nếu muốn thêm nút khác, vd. Xóa */}
                    { <button className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Xóa</button> }
                </div>
            ),
        }
    ]
    const handleCreateAddress = async () => {
        if (!newName.trim()) return ctoast.error("Tên địa chỉ là bắt buộc")
        if (newType === 'ward' && !newParentId) return ctoast.error("Chọn tỉnh cho phường/xã")

        const dto: CreateAddressDto = {
            name: newName.trim(),
            type: newType,
            parentId: newType === 'ward' ? newParentId : null,
            code: ""
        };

        try {
            console.log("Sending createAddress body:", dto) // kiểm tra trước khi gửi
            const created = await addressApi.createAddress(dto)
            ctoast.success("Thêm địa chỉ thành công: " + created.name)

            // Update local state
            if (created.type === 'province') setProvinces(prev => [...prev, created])
            if (created.type === 'ward' && created.parentId === selectedProvince) setWards(prev => [...prev, created])
            if (created.type === 'street') setStreets(prev => [...prev, created])

            setShowAddModal(false)
            setNewName('')
            setNewParentId(undefined)
            setNewType('province')
        } catch (err: any) {
            ctoast.error(err.message || "Thêm địa chỉ thất bại")
        }
    }
    return (
        <div className=" min-h-full space-y-4 p-4">
            <BreadcrumbNavigation items={[{ label: 'Địa chỉ', href: '/admin/address' }]} />
          
            {/* Province Select */}
            <div className="flex justify-between items-center w-full">
              
                <div className="ml-4 w-fit">
                <label className="block mb-1 font-medium">Chọn tỉnh:</label>
                <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value)}>
                    <option value="">-- Chọn tỉnh --</option>
                    {provinces.map(p => (
                        <option key={p.uid} value={p.uid}>{p.name}</option>
                    ))}
                </select>
                </div>
              
            </div>

            {/* Ward Select */}
            <div className="ml-4">
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
            <button
                onClick={() => setShowAddModal(true)}
                className="mb-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Thêm địa chỉ
            </button>

            {/* Modal form thêm địa chỉ */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-[400px]">
                        <h3 className="text-lg font-medium mb-4">Thêm địa chỉ mới</h3>

                        {/* Loại địa chỉ */}
                        <div className="mb-2">
                            <label className="block font-medium">Loại:</label>
                            <select
                                value={newType}
                                onChange={e => setNewType(e.target.value as any)}
                                className="border p-1 rounded w-full"
                            >
                                <option value="province">Tỉnh/Thành phố</option>
                                <option value="ward">Phường/Xã</option>
                                <option value="street">Đường</option>
                            </select>
                        </div>

                        {/* Chọn tỉnh nếu là ward */}
                        {newType === 'ward' && (
                            <div className="mb-2">
                                <label className="block font-medium">Chọn tỉnh:</label>
                                <select
                                    value={newParentId}
                                    onChange={e => setNewParentId(e.target.value)}
                                    className="border p-1 rounded w-full"
                                >
                                    <option value="">-- Chọn tỉnh --</option>
                                    {provinces.map(p => (
                                        <option key={p.uid} value={p.uid}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Tên địa chỉ */}
                        <div className="mb-2">
                            <label className="block font-medium">Tên:</label>
                            <input
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                className="border p-1 rounded w-full"
                            />
                        </div>

                        {/* Nút Lưu / Hủy */}
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleCreateAddress}
                                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Lưu
                            </button>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Wards Table */}
            <CDataTable
                data={wards}
                columns={wardColumns}
                searchKeys={['name', 'code']}
                rightSlot={
                    <>
                        {/* Import CSV */}
                        {/* Nhập CSV bằng input */}
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault();
                                const file = e.dataTransfer.files[0];
                                if (!file) return;
                                handleImportFile(file);
                                e.dataTransfer.clearData();
                            }}
                            onClick={() => fileInputRef.current?.click()} // click vào div sẽ mở file dialog
                            className="border-2 border-dashed border-purple-600 bg-purple-50 hover:bg-purple-100 text-center py-6 px-4 rounded cursor-pointer"
                        >
                            Kéo thả FILE CSV vào đây hoặc click để chọn
                            <input
                                type="file"
                                accept=".csv"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={(e) => e.target.files && handleImportFile(e.target.files[0])}
                            />
                        </div>


                    </>
                }
                statusKey="isDeprecated"
                statusOptions={[
                    { value: 'false', label: 'Đang sử dụng' },
                    { value: 'true', label: 'Ngừng sử dụng' }
                ]}
                pageSizeOptions={[10, 20, 50]}
                loading={loadingWards}
            />

            {/* Streets Table */}
        
                <CDataTable
                    data={streets}
                    columns={streetColumns}
                    searchKeys={['name', 'code']}
                    pageSizeOptions={[10, 20, 50]}
                    loading={loadingStreets}
                />

          
    
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    )
}
