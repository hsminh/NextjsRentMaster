import { z } from 'zod'

export const apartmentFormSchema = z.object({
    title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
    description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
    price: z.number().min(1000, 'Giá phải từ 1,000 VNĐ trở lên'),
    addressDivisionUid: z.string().min(1, 'Vui lòng chọn địa chỉ'),
    areaLength: z.number().min(1, 'Chiều dài phải lớn hơn 0'),
    areaWidth: z.number().min(1, 'Chiều rộng phải lớn hơn 0'),
    quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
    floorNumber: z.number().min(0, 'Tầng không được âm'),
    totalFloors: z.number().min(1, 'Tổng số tầng phải lớn hơn 0'),

    type: z.enum(['full_apartment', 'private_room', 'shared_room'])
        .refine((val) => !!val, { message: 'Vui lòng chọn loại phòng' }),

    status: z.enum(['available', 'rented', 'maintenance'])
        .refine((val) => !!val, { message: 'Vui lòng chọn trạng thái' }),

    images: z.array(z.string().url('URL hình ảnh không hợp lệ'))
        .min(1, 'Vui lòng thêm ít nhất 1 hình ảnh'),
})

export type ApartmentFormValues = z.infer<typeof apartmentFormSchema>
