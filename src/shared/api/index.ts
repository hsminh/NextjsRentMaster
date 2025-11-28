import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import { AddressInterface } from '@/shared/types/response/address'

export class AddressDivisionAPI extends AbstractRestApiClient {
    protected protectedResource = true

    private provinceBase = 'public/address/province'
    private divisionBase = 'public/address/division'

    listProvinces(): Promise<AddressInterface[]> {
        return this.get<AddressInterface[]>(this.provinceBase)
    }

    listByParent(parentUid: string): Promise<AddressInterface[]> {
        return this.get<AddressInterface[]>(this.divisionBase, { parentUid })
    }

    listWards(provinceUid: string): Promise<AddressInterface[]> {
        return this.listByParent(provinceUid)
    }

    listStreets(wardUid: string): Promise<AddressInterface[]> {
        return this.listByParent(wardUid)
    }
}
