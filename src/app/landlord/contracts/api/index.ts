import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import { ContractRequest } from "@/app/landlord/contracts/type/contract";

export class ContractAPI extends AbstractRestApiClient {
    protected protectedResource = true
    private base = 'landlords/api/contracts'

    list(): Promise<ContractRequest[]> {
        return this.get<ContractRequest[]>(this.base)
    }

    detail(uid: string): Promise<ContractRequest> {
        return this.get<ContractRequest>(`${this.base}/${uid}`)
    }

    create(dto: ContractRequest): Promise<ContractRequest> {
        return this.post<ContractRequest>(
            this.base,
            undefined,
            dto
        )
    }

    update(uid: string, dto: ContractRequest): Promise<ContractRequest> {
        return this.put<ContractRequest>(
            `${this.base}/${uid}`,
            undefined,
            dto
        )
    }

    delete(uid: string): Promise<void> {
        return super.delete(`${this.base}/${uid}`)
    }
}
