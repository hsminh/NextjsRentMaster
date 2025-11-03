import { z } from 'zod'

export const userSchema = z.object({
    gmail: z.string().email({ message: 'Gmail không hợp lệ' }),
    password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự').optional(),
    firstName: z.string().min(1, 'Vui lòng nhập tên'),
    lastName: z.string().min(1, 'Vui lòng nhập họ'),
    phoneNumber: z.string().optional(),
})