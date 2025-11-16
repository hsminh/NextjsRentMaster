import { z } from 'zod'

export const apartmentRoomFormSchema = z.object({
    apartmentUid: z.string().min(1, 'Vui lòng chọn căn hộ'), // thêm bắt buộc
    description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
    price: z.number().min(1000, 'Giá phải từ 1,000 VNĐ trở lên'),
    areaLength: z.number().min(1, 'Chiều dài phải lớn hơn 0'),
    areaWidth: z.number().min(1, 'Chiều rộng phải lớn hơn 0'),
    Files: z.array(z.string()).min(1, 'Vui lòng thêm ít nhất 1 hình ảnh cho căn hộ'),
})

export type ApartmentRoomFormValues = z.infer<typeof apartmentRoomFormSchema>
