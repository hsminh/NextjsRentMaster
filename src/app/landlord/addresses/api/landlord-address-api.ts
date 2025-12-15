import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import { AddressInterface } from '@/shared/types/response/address'

export class LandlordAddressAPI extends AbstractRestApiClient {
    protected protectedResource = true

    private base = 'public/address'

    getProvinces() {
        return this.get<AddressInterface[]>(`${this.base}/province`)
    }

    getDistricts(provinceUid: string) {
        return this.get<AddressInterface[]>(`${this.base}/division`, {
            parentUid: provinceUid,
            type: 'DISTRICT'
        })
    }

    getWards(districtUid: string) {
        return this.get<AddressInterface[]>(`${this.base}/division`, {
            parentUid: districtUid,
            type: 'WARD'
        })
    }

    getStreets() {
        return this.get<AddressInterface[]>(`${this.base}/street`)
    }
}
