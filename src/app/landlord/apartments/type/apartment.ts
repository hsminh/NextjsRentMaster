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

export interface ApartmentRequest {
    uid?: string;
    landlordUid: string;
    price: number;
    pid: string;
    title: string;
    description: string;
    areaLength: number;
    areaWidth: number;
    metaData: string;
    totalFloors: number | null;
    type: 'FullApartment' | 'RoomBased';
    status: 'available' | 'rented' | 'maintenance';
    images: string[];
    province: Division;
    ward: Division;
    provinceDivisionUid?: string;
    wardDivisionUid?: string;
    streetUid?: string;
    addressDetail?: string;
    createdAt: string;
    updatedAt: string | null;
    isDelete: boolean;
}

export interface RoomMetadata {
    [key: string]: string | undefined;
}

export interface ApartmentRoomRequest {
    uid?: string;
    apartmentUid: string;
    description: string;
    price: number;
    areaLength: number;
    areaWidth: number;
    status: 'available' | 'rented' | 'maintenance';
    Files: File[] | string[];
    images: string[];
    provinceDivisionUid?: string;
    wardDivisionUid?: string;
    addressDetail?: string;
    metaData?: RoomMetadata;
}