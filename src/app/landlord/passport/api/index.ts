import {LoginRequest} from "@/shared/types/request";
import {AuthResponse} from "@/shared/types/response";
import AbstractRestApiClient from "@/app/utils/api/base-api-client";

export class LandLordAPI extends AbstractRestApiClient {
    protected protectedResource = false
    public async login(data: LoginRequest): Promise<AuthResponse> {
        return this.post('landlord/api/auth/login', undefined, data)
    }
    public async register(data: LoginRequest): Promise<void> {
        return this.post('landlord/api', undefined, data)
    }
}
