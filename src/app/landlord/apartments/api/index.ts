import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import { ApartmentRequest } from "@/app/landlord/apartments/type/apartment";

export class ApartmentAPI extends AbstractRestApiClient {
    protected protectedResource = true
    private base = 'landlords/api/apartment'

    list(type? : string): Promise<ApartmentRequest[]> {
        const queryParams: Record<string, any> = {};
        if (type){
            queryParams.type = type;
        }
        return this.get<ApartmentRequest[]>(this.base, queryParams);
    }

    detail(uid: string): Promise<ApartmentRequest> {
        return this.get<ApartmentRequest>(`${this.base}/${uid}`)
    }

    create(dto: ApartmentRequest | FormData): Promise<ApartmentRequest> {
        return this.post<ApartmentRequest>(
            this.base,
            undefined,
            dto,
            { 'Content-Type': 'multipart/form-data' }
        )
    }

    update(uid: string, dto: ApartmentRequest | FormData): Promise<ApartmentRequest> {
        return this.put<ApartmentRequest>(
            `${this.base}/${uid}`,
            undefined,
            dto,
            { 'Content-Type': 'multipart/form-data' }
        )
    }

    delete(uid: string): Promise<void> {
        return super.delete(`${this.base}/${uid}`)
    }
}
