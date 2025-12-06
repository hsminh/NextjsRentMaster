import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import {TenantRequest} from "@/app/landlord/tenants/type/tenant";

export class TenantAPI extends AbstractRestApiClient {
    protected protectedResource = true
    private base = 'landlords/api/tenant'

    list(): Promise<TenantRequest[]> {
        return this.get<TenantRequest[]>(this.base)
    }

    detail(uid: string): Promise<TenantRequest> {
        return this.get<TenantRequest>(`${this.base}/${uid}`)
    }
    update(uid: string, data: { status: 'Approved' | 'Rejected' }): Promise<TenantRequest> {
        return this.put<TenantRequest>(`${this.base}/${uid}/status`,undefined, data)
    }

}
