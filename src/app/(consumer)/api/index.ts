import AbstractRestApiClient from '@/app/utils/api/base-api-client';
import { ApartmentRequest } from '@/app/landlord/apartments/type/apartment';
import { ApartmentRoomRequest } from '@/app/landlord/rooms/type/apartment';

export class PublicApartmentAPI extends AbstractRestApiClient {
    protected protectedResource = false; // Public endpoint
    private base = 'public/api/apartments';

    /**
     * Get all public apartments
     */
    list(params?: Record<string, any>): Promise<ApartmentRequest[]> {
        return this.get<ApartmentRequest[]>(this.base, params);
    }

    /**
     * Get apartment details by UID
     */
    detail(uid: string): Promise<ApartmentRequest> {
        return this.get<ApartmentRequest>(`${this.base}/${uid}`);
    }
}

export class PublicApartmentRoomAPI extends AbstractRestApiClient {
    protected protectedResource = false;
    private base = 'public/api/apartment-rooms';

    /**
     * Get all public apartment rooms
     */
    list(params?: Record<string, any>): Promise<ApartmentRoomRequest[]> {
        return this.get<ApartmentRoomRequest[]>(this.base, params);
    }

    /**
     * Get apartment room details by UID
     */
    detail(uid: string): Promise<ApartmentRoomRequest> {
        return this.get<ApartmentRoomRequest>(`${this.base}/${uid}`);
    }

    /**
     * Get rooms by apartment UID
     */
    listByApartment(apartmentUid: string): Promise<ApartmentRoomRequest[]> {
        return this.get<ApartmentRoomRequest[]>(`${this.base}/apartment/${apartmentUid}`);
    }
}

// Export instances
export const publicApartmentAPI = new PublicApartmentAPI();
export const publicApartmentRoomAPI = new PublicApartmentRoomAPI();
