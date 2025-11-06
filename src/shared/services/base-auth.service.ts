import { LoginRequest, RegisterRequest } from '../types/request'
import { AuthResponse } from '../types/response'
import AbstractRestApiClient from '@/app/utils/api/base-api-client'

interface RegisterResponse {
  message: string
}

export abstract class BaseAuthService extends AbstractRestApiClient {
  protected abstract getBasePath(): string

  public async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.post<AuthResponse>(`${this.getBasePath()}/login`, undefined, credentials)
  }

  public async register(data: LoginRequest): Promise<RegisterResponse> {
    return this.post<RegisterResponse>(`${this.getBasePath()}`, undefined, data)
  }
}
