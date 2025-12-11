// services/address-api.ts
import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import type { AddressDivision } from '../types'
import {CreateAddressDto, UpdateAddressDto} from '@/app/admin/(features)/addresses/DTO'
export class AddressAPI extends AbstractRestApiClient {
    private publicBase = 'public/address'
    private adminBase = 'admin/api/address'
    getProvinces(): Promise<AddressDivision[]> {
        return this.get<AddressDivision[]>(`${this.publicBase}/province`)
    }

    getChildren(parentUid: string, type?: string): Promise<AddressDivision[]> {
            const params: Record<string, string> = { parentUid }
            if (type) params['type'] = type
            return this.get<AddressDivision[]>(`${this.publicBase}/division`, params)
        }
    getStreets(): Promise<AddressDivision[]> {
        return this.get<AddressDivision[]>(`${this.publicBase}/street`)
    }
    importCSV(file: File): Promise<any> {
        const formData = new FormData();
        formData.append("file", file);

        return fetch(`http://localhost:5279/public/address/import`, {
            method: "POST",
            body: formData, // ✅ không set Content-Type
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    return Promise.reject(errData);
                }
                return res.json();
            });
    }
    createAddress(dto: CreateAddressDto): Promise<AddressDivision> {
        return this.request<AddressDivision>(
            'POST',
            `${this.publicBase}/create`,
            {}, 
            dto , // wrap it in a "dto" property
            { 'Content-Type': 'application/json' }
        );
    }

    deleteAddress(id: string) {
        return fetch(`http://localhost:5279/public/address/${id}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error("Xóa thất bại");
                return res; // hoặc return true
            });
    }
    updateAddress(id: string, dto: UpdateAddressDto): Promise<AddressDivision> {
        return this.request<AddressDivision>(
            'PUT',
            `${this.publicBase}/${id}`,
            {},
            dto,
            { "Content-Type": "application/json" }
        );
    }


}
