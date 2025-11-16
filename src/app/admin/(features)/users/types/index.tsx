export interface AdminUser {
    uid: string;
    gmail: string;
    Status: 'Active' | 'Inactive';
    scope?: string;
    password?: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    isDelete?: boolean;
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
