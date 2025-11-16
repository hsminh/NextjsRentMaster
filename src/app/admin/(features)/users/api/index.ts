import AbstractRestApiClient from '@/app/utils/api/base-api-client'
import type { AdminUser, AdminUserCreateDTO, AdminUserUpdateDTO } from '../types'

export class AdminUsersAPI extends AbstractRestApiClient {
  private base = 'admin/api/landlords'

  list(): Promise<AdminUser[]> {
    return this.get<AdminUser[]>(this.base)
  }

  detail(uid: string): Promise<AdminUser> {
    return this.get<AdminUser>(`${this.base}/${uid}`)
  }

  create(dto: AdminUserCreateDTO): Promise<AdminUser> {
    return this.post<AdminUser>(this.base, undefined, dto)
  }

  update(uid: string, dto: AdminUserUpdateDTO): Promise<AdminUser> {
    return this.put<AdminUser>(`${this.base}/${uid}`, undefined, dto)
  }

  delete(uid: string): Promise<void> {
    return super.delete(`${this.base}/${uid}`)
  }

  deactivate(uid: string): Promise<AdminUser> {
    return this.put<AdminUser>(`${this.base}/${uid}`, undefined, { Status: 'Inactive' })
  }
}
