import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import {TenantRequest} from "@/app/landlord/tenants/type/tenant";

export class TenantAPI extends AbstractRestApiClient {
    protected protectedResource = true
    private base = 'landlords/api/tenant'

    list(): Promise<TenantRequest[]> {
        return this.get<TenantRequest[]>(this.base+'/filtered')
    }

    listFiltered(status?: string): Promise<TenantRequest[]> {
        const query: Record<string, string> = {}
        if (status) query.status = status
        return this.get<TenantRequest[]>(this.base+'/filtered', Object.keys(query).length > 0 ? query : undefined)
    }

    detail(uid: string): Promise<TenantRequest> {
        return this.get<TenantRequest>(`${this.base}/${uid}`)
    }
    update(uid: string, data: { status: 'Approved' | 'Rejected' }): Promise<TenantRequest> {
        return this.put<TenantRequest>(`${this.base}/${uid}/status`,undefined, data)
    }

}
