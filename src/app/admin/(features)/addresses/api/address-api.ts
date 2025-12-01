// services/address-api.ts
import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import type { AddressDivision } from '../types'

export class AddressAPI extends AbstractRestApiClient {
    private publicBase = 'public/address'

    getProvinces(): Promise<AddressDivision[]> {
        return this.get<AddressDivision[]>(`${this.publicBase}/province`)
    }

    getChildren(parentUid: string, type?: string): Promise<AddressDivision[]> {
        const params: Record<string, string> = { parentUid }
        if (type) params['type'] = type
        return this.get<AddressDivision[]>(`${this.publicBase}/division`, params)
    }


}
