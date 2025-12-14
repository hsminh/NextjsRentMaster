export interface Division {
    name: string;
    code: string;
    type: string;
    parentId: string;
    isDeprecated: boolean;
    deprecatedAt: string | null;
    previousUnitCodes: string[];
    uid: string;
    createdAt: string;
    updatedAt: string | null;
    deletedAt: string | null;
    isDelete: boolean;
}

export interface RoomMetadata {
    [key: string]: string | undefined
}

export interface ApartmentRoomRequest {
    uid?: string
    apartmentUid: string
    landlordUid: string
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
    province?: Division | null
    ward?: Division | null
    street?: Division | null
}
