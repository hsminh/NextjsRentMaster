import AbstractRestApiClient from '@/app/utils/api/base-api-client'

export interface VerificationResponse {
  is_verified: boolean;
}

export interface ConsumerData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  Gmail: string;
}
export class ConsumerApi extends AbstractRestApiClient {
    protected protectedResource = true
    private ConsumerBase = 'consumer/api/'

    async checkVerified(uid: string): Promise<VerificationResponse> {
        return this.post<VerificationResponse>(`${this.ConsumerBase}${uid}/check-verified`)
    }

    async updateConsumer(uid: string, data: ConsumerData): Promise<void> {
        return this.put<void>(`${this.ConsumerBase}${uid}`, undefined, data)
    }
}