import { z } from 'zod'

export const createApartmentValidation = z.object({
  name: z.string().min(1, 'Tên căn hộ là bắt buộc'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  price: z.number().min(1000, 'Giá phải lớn hơn 1,000'),
  area: z.number().min(1, 'Diện tích phải lớn hơn 0'),
  description: z.string().optional(),
  images: z.array(z.string().url('URL hình ảnh không hợp lệ')).optional(),
})

export type ApartmentFormValues = z.infer<typeof createApartmentValidation>
