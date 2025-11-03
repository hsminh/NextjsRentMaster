export type AdminUser = {
  gmail: string
  scope?: string
  password?: string
  firstName?: string | null
  lastName?: string | null
  phoneNumber?: string | null
  uid: string
  createdAt?: string | null
  updatedAt?: string | null
  deletedAt?: string | null
  isDelete?: boolean
}

export type AdminUserCreateDTO = {
  gmail: string
  password: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  scope?: string
}

export type AdminUserUpdateDTO = Partial<AdminUserCreateDTO> & { uid: string }
