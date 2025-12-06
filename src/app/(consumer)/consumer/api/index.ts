import AbstractRestApiClient from '@/app/utils/api/base-api-client';
import { ApartmentRequest } from '@/app/landlord/apartments/type/apartment';
import { ApartmentRoomRequest } from '@/app/landlord/rooms/type/apartment';

export class PublicApartmentAPI extends AbstractRestApiClient {
    protected protectedResource = false;
    private base = 'public/api/apartments';

    /**
     * Get all public apartments with optional filters
     */
    list(filters?: {
        minPrice?: number;
        maxPrice?: number;
        wardDivisionUid?: string;
        provinceDivisionUid?: string;
        streetUid?: string;
        provinceName?: string;
    }): Promise<ApartmentRequest[]> {
        const queryParams: Record<string, any> = {};

        if (filters?.minPrice !== undefined) {
            queryParams.MinPrice = filters.minPrice;
        }

        if (filters?.maxPrice !== undefined) {
            queryParams.MaxPrice = filters.maxPrice;
        }

        if (filters?.wardDivisionUid) {
            queryParams.WardDivisionUid = filters.wardDivisionUid;
        }

        if (filters?.provinceDivisionUid) {
            queryParams.ProvinceDivisionUid = filters.provinceDivisionUid;
        }

        if (filters?.provinceName) {
            queryParams.ProvinceName = filters.provinceName;
        }

        if (filters?.streetUid) {
            queryParams.StreetUid = filters.streetUid;
        }

        return this.get<ApartmentRequest[]>(this.base, queryParams);
    }
}

export class PublicApartmentRoomAPI extends AbstractRestApiClient {
    protected protectedResource = false;
    private base = 'public/api/apartment-rooms';

    /**
     * Get all public apartment rooms with optional filters
     */
    list(filters?: {
        minPrice?: number;
        maxPrice?: number;
        wardDivisionUid?: string;
        provinceDivisionUid?: string;
        streetUid?: string;
        provinceName?: string;
        apartmentUid?: string;
    }): Promise<ApartmentRoomRequest[]> {
        const queryParams: Record<string, any> = {};

        if (filters?.minPrice !== undefined) {
            queryParams.MinPrice = filters.minPrice;
        }

        if (filters?.maxPrice !== undefined) {
            queryParams.MaxPrice = filters.maxPrice;
        }

        if (filters?.wardDivisionUid) {
            queryParams.WardDivisionUid = filters.wardDivisionUid;
        }

        if (filters?.provinceDivisionUid) {
            queryParams.ProvinceDivisionUid = filters.provinceDivisionUid;
        }

        if (filters?.provinceName) {
            queryParams.ProvinceName = filters.provinceName;
        }

        if (filters?.apartmentUid) {
            queryParams.ApartmentUid = filters.apartmentUid;
        }

        if (filters?.streetUid) {
            queryParams.StreetUid = filters.streetUid;
        }

        return this.get<ApartmentRoomRequest[]>(this.base, queryParams);
    }
}

export interface JoinApartmentPayload {
    LandlordUid: string;
    ApartmentUid: string;
    Type: string;
}

export interface JoinResponse {
    success: boolean;
    message?: string;
}

export class ContactAPI extends AbstractRestApiClient {
    protected protectedResource = true;
    private base = 'consumer/api/contact';

    join(payload: JoinApartmentPayload): Promise<JoinResponse> {
        return this.post<JoinResponse>(`${this.base}/join`, undefined, payload);
    }
}

export const publicApartmentAPI = new PublicApartmentAPI();
export const publicApartmentRoomAPI = new PublicApartmentRoomAPI();
export const contactAPI = new ContactAPI();