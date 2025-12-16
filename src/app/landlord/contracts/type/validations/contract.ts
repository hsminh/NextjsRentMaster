import { z } from 'zod'

export const contractFormSchema = z
    .object({
        apartmentUid: z.string().min(1, 'Vui lòng chọn phòng/căn hộ'),
        type: z.enum(['RoomBased', 'FullApartment']).refine((val) => !!val, {
            message: 'Vui lòng chọn loại hợp đồng',
        }),
        responsibleUid: z.string().min(1, 'Vui lòng chọn người chịu trách nhiệm'),
        participantUids: z.array(z.string()).default([]).optional(),
        monthlyPrice: z
            .number()
            .min(1, 'Giá thuê phải lớn hơn 0')
            .refine((val) => val > 0, 'Giá thuê phải lớn hơn 0'),
        depositAmount: z
            .number()
            .min(1, 'Tiền cọc phải lớn hơn 0')
            .refine((val) => val > 0, 'Tiền cọc phải lớn hơn 0'),
        startDate: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
        endDate: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
    })
    .superRefine((data, ctx) => {
        if (!data.startDate || !data.endDate) {
            return
        }

        const parseDate = (dateStr: string) => {
            const [year, month, day] = dateStr.split('-').map(Number)
            return new Date(year, month - 1, day)
        }

        const startDate = parseDate(data.startDate)
        const endDate = parseDate(data.endDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (startDate >= endDate) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['endDate'],
                message: 'Ngày kết thúc phải sau ngày bắt đầu',
            })
        }

        if (startDate < today) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['startDate'],
                message: 'Ngày bắt đầu không được trong quá khứ',
            })
        }
    })

export type ContractFormValues = z.infer<typeof contractFormSchema>
