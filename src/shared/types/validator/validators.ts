import { z } from 'zod'

export const createAuthValidation = () => {
    return z.object({
        gmail: z
            .string()
            .min(1, 'Vui lòng nhập Gmail')
            .email('Gmail không hợp lệ'),

        password: z
            .string()
            .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    })
}

export type AuthSchemaType = z.infer<ReturnType<typeof createAuthValidation>>

export const LoginValidationSchema = createAuthValidation
export const RegisterValidationSchema = createAuthValidation
