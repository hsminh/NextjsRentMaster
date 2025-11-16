import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import {ApartmentRoomRequest} from "@/app/landlord/rooms/type/apartment";


export class RoomAPI extends AbstractRestApiClient {
    protected protectedResource = true
    private base = 'landlords/api/apartment-room'

    list(): Promise<ApartmentRoomRequest[]> {
        return this.get<ApartmentRoomRequest[]>(this.base)
    }

    detail(uid: string): Promise<ApartmentRoomRequest> {
        return this.get<ApartmentRoomRequest>(`${this.base}/${uid}`)
    }

    create(dto: ApartmentRoomRequest | FormData): Promise<ApartmentRoomRequest> {
        return this.post<ApartmentRoomRequest>(
            this.base,
            undefined,
            dto,
            { 'Content-Type': 'multipart/form-data' }
        )
    }

    update(uid: string, dto: ApartmentRoomRequest | FormData): Promise<ApartmentRoomRequest> {
        return this.put<ApartmentRoomRequest>(
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
