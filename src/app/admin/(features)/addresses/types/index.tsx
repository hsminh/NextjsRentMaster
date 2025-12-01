// types/address.ts
export interface AddressDivision {
    uid: string
    name: string
    code: string
    type: 'province' | 'ward' | 'country' | 'street'
    parentId?: string
    isDeprecated: boolean
    deprecatedAt?: string
    previousUnitCodes: string[]
}
