// services/address-api.ts
import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import type { AddressDivision } from '../types'
import { CreateAddressDto } from '@/app/admin/(features)/addresses/DTO'
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
        const formData = new FormData()
        formData.append("file", file)
        return this.postForm(`${this.adminBase}/import`, formData)
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
}
