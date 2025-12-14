

export type DivisionTypeEnum = 'Country' | 'province' | 'ward' | 'street';

export interface CreateAddressDto {
    name: string;
    type: DivisionTypeEnum;
    parentId?: string | null;
    code?: string | null;
}
export interface UpdateAddressDto {
    name: string;
}
