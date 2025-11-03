import { z } from 'zod'

export const RegisterValidationSchema = (t?: (key: string) => string) =>
  z.object({
    gmail: z
      .string()
      .min(1, { message: t ? t('messages.required') : 'Vui lòng nhập email' })
      .email({ message: t ? t('messages.invalid_email') : 'Email không hợp lệ' }),
    password: z
      .string()
      .min(6, { message: t ? t('messages.min_length') : 'Mật khẩu phải có ít nhất 6 ký tự' }),
  })

export type RegisterSchemaType = z.infer<ReturnType<typeof RegisterValidationSchema>>
