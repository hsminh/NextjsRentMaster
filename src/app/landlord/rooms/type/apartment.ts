export interface RoomMetadata {
    [key: string]: string | undefined
}

export interface ApartmentRoomRequest {
    uid?: string
    apartmentUid: string
    description: string
    price: number
    areaLength: number
    areaWidth: number
    status: 'available' | 'rented' | 'maintenance'
    Files: File[] | string[]
    images: string[]
    provinceDivisionUid?: string
    wardDivisionUid?: string
    addressDetail?: string
    metaData?: RoomMetadata
}
