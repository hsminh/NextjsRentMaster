import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import { AddressInterface } from '@/shared/types/response/address'

export class AddressDivisionAPI extends AbstractRestApiClient {
    protected protectedResource = true

    private provinceBase = 'public/address/province'
    private wardBase = 'public/address/ward'

    listProvinces(): Promise<AddressInterface[]> {
        return this.get<AddressInterface[]>(this.provinceBase)
    }

    listWards(parentCode: string): Promise<AddressInterface[]> {
        return this.get<AddressInterface[]>(this.wardBase, { parentCode })
    }
}
