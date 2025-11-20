export type AddressUnitType = 'province' | 'district' | 'ward'

export interface AddressInterface {
    name: string
    code: string
    type: AddressUnitType
    parentId: string | null
    isDeprecated: boolean
    deprecatedAt: string | null
    previousUnitCodes: string[]
    uid: string
    createdAt: string
    updatedAt: string | null
    deletedAt: string | null
    isDelete: boolean
}
