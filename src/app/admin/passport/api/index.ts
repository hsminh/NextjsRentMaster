import AbstractRestApiClient from "@/app/utils/api/base-api-client";
import {loginRequest} from "@/app/admin/passport/login/types/request";
import {LoginResponse} from "@/app/admin/passport/login/types/response";

export class AdminAuthAPI extends AbstractRestApiClient {
    protected protectedResource = false
    public async login(data: loginRequest): Promise<LoginResponse> {
        return this.post('admin/api/auth/login', undefined, data)
    }
    public async register(data: loginRequest): Promise<LoginResponse> {
        return this.post('admin/api', undefined, data)
    }
}
