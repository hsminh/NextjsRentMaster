import { z } from 'zod'

export const apartmentFormSchema = z
    .object({
        title: z.string().min(1, 'Vui lòng nhập tiêu đề'),
        description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
        price: z.number().min(1000, 'Giá phải từ 1,000 VNĐ trở lên'),
        areaLength: z.number().min(1, 'Chiều dài phải lớn hơn 0'),
        areaWidth: z.number().min(1, 'Chiều rộng phải lớn hơn 0'),
        type: z.enum(['FullApartment', 'RoomBased']).refine((val) => !!val, {
            message: 'Vui lòng chọn loại phòng',
        }),
        status: z.enum(['available', 'rented', 'maintenance']).refine((val) => !!val, {
            message: 'Vui lòng chọn trạng thái',
        }),
        Files: z.array(z.string()).optional(),
        MetaData: z.string().min(1, 'Vui lòng nhập số nhà/địa chỉ'),
        provinceDivisionUid: z.string().min(1, 'Vui lòng chọn Tỉnh / Thành phố'),
        wardDivisionUid: z.string().min(1, 'Vui lòng chọn Phường/Xã'),
        streetUid: z.string().min(1, 'Vui lòng chọn Đường/Phố'),
    })
    .superRefine((data, ctx) => {
        // validate ảnh cho FullApartment
        if (data.type === 'FullApartment' && (!data.Files || data.Files.length === 0)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['Files'],
                message: 'Vui lòng thêm ít nhất 1 hình ảnh cho căn hộ đầy đủ',
            })
        }
    })

export type ApartmentFormValues = z.infer<typeof apartmentFormSchema>
