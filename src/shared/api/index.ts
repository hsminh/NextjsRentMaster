import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import { AddressInterface } from '@/shared/types/response/address'
import type {AddressDivision} from "@/app/admin/(features)/addresses/types";

export class AddressDivisionAPI extends AbstractRestApiClient {
    protected protectedResource = true
    private publicBase = 'public/address'
    private provinceBase = 'public/address/province'
    private divisionBase = 'public/address/division'

    listProvinces(): Promise<AddressInterface[]> {
        return this.get<AddressInterface[]>(this.provinceBase)
    }

    listByParent(parentUid: string): Promise<AddressInterface[]> {
        return this.get<AddressInterface[]>(this.divisionBase, { parentUid })
    }

    listWards(provinceUid: string): Promise<AddressInterface[]> {
        return this.listByParent(provinceUid)
    }

    listStreets(wardUid: string): Promise<AddressInterface[]> {
        return this.listByParent(wardUid)
    }
    getStreets(): Promise<AddressDivision[]> {
        return this.get<AddressDivision[]>(`${this.publicBase}/street`)
    }
}


export interface JoinApartmentRequest {
    landlordUid: string
    apartmentUid: string
}

export interface JoinApartmentResponse {
    message: string
    data: any
}

export class ConsumerContactAPI extends AbstractRestApiClient {
    protected protectedResource = true
    protected baseUrl = 'consumer/api/contact'

    /**
     * Join an apartment room
     * POST /consumer/api/contact/join
     */
    async joinApartment(data: JoinApartmentRequest): Promise<JoinApartmentResponse> {
        return this.post<JoinApartmentResponse>('join', undefined, data)
    }

    /**
     * Get all contacts for current consumer
     * GET /consumer/api/contact
     */
    async getContacts(): Promise<any[]> {
        return this.get<any[]>('')
    }

    /**
     * Get specific contact by ID
     * GET /consumer/api/contact/{id}
     */
    async getContactById(id: string): Promise<any> {
        return this.get<any>(`/${id}`)
    }
}

// Export instance for easy use
export const consumerContactAPI = new ConsumerContactAPI()