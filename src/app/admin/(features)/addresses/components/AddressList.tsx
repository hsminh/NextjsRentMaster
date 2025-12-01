// components/AddressList.tsx
import { useEffect, useState } from 'react'
import { AddressAPI } from '@/app/admin/(features)/addresses/api/address-api'
import type { AddressDivision } from '@/app/admin/(features)/addresses/types'

const addressApi = new AddressAPI()

export default function AddressList() {
    const [provinces, setProvinces] = useState<AddressDivision[]>([])
    const [wards, setWards] = useState<AddressDivision[]>([])
    const [selectedProvince, setSelectedProvince] = useState<string>('')
    const [streets, setStreets] = useState<AddressDivision[]>([])
    const [selectedWard, setSelectedWard] = useState<string>('')

    // Load provinces
    useEffect(() => {
        addressApi.getProvinces()
            .then(setProvinces)
            .catch(console.error)
    }, [])

    // Load wards khi chọn tỉnh
    useEffect(() => {
        setSelectedWard('')
        setStreets([])
        if (!selectedProvince) {
            setWards([])
            return
        }
        addressApi.getChildren(selectedProvince, 'ward') // 'ward' để lọc phường/xã
            .then(setWards)
            .catch(console.error)
    }, [selectedProvince])

    // Load streets khi chọn phường
    useEffect(() => {
        if (!selectedWard) {
            setStreets([])
            return
        }
        addressApi.getChildren(selectedWard, 'street') // 'street' để lọc đường
            .then(setStreets)
            .catch(console.error)
    }, [selectedWard])

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-2">Danh sách địa chỉ</h2>

            {/* Chọn tỉnh */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Chọn tỉnh:</label>
                <select
                    className="border p-2 rounded"
                    value={selectedProvince}
                    onChange={(e) => setSelectedProvince(e.target.value)}
                >
                    <option value="">-- Chọn tỉnh --</option>
                    {provinces.map((p) => (
                        <option key={p.uid} value={p.uid}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Danh sách phường/xã */}
            {wards.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Danh sách phường/xã</h3>
                    <select
                        className="border p-2 rounded"
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                    >
                        <option value="">-- Chọn phường/xã --</option>
                        {wards.map(w => (
                            <option key={w.uid} value={w.uid}>{w.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Danh sách đường */}
            {streets.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Danh sách đường</h3>
                    <ul className="list-disc list-inside">
                        {streets.map(s => (
                            <li key={s.uid}>{s.name}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
