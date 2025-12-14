// form-utils.ts
import { blobUrlToFile, processExistingImageUrls } from './image-utils'

export const createFormData = async <T extends Record<string, any>>(
    values: T,
    allPreviews: (File | string)[] = [],
    fileFieldName: string = 'Files'
): Promise<FormData> => {
    const formData = new FormData()

    // Append các field khác (không phải file)
    Object.entries(values).forEach(([key, value]) => {
        if (key === fileFieldName || value === undefined || value === null) return
        
        // Transform ApartmentUid to ApartmentRoomUid for RoomBased type
        if (key === 'ApartmentUid' && values.type === 'RoomBased') {
            formData.append('ApartmentRoomUid', typeof value === 'object' ? JSON.stringify(value) : String(value))
            return
        }
        
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : String(value))
    })

    if (!allPreviews || allPreviews.length === 0) {
        // Không có file thì bỏ qua
        return formData
    }

    // Tách URL cũ và blob mới
    const existingUrls = allPreviews.filter(f => typeof f === 'string' && !f.startsWith('blob:')) as string[]
    const newBlobOrFiles = allPreviews.filter(f => f instanceof File || (typeof f === 'string' && f.startsWith('blob:')))

    // Chuyển URL cũ sang File (nếu cần)
    const existingFiles = await processExistingImageUrls(existingUrls)

    // Chuyển blob URL sang File
    const newFiles: File[] = await Promise.all(
            newBlobOrFiles.map(f => f instanceof File ? f : blobUrlToFile(f))
        )

        // Append tất cả
    ;[...existingFiles, ...newFiles].forEach(file => formData.append(fileFieldName, file))

    return formData
}
