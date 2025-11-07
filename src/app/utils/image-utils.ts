/**
 * Chuyển đổi blob URL thành File object
 * @param blobUrl URL của blob (bắt đầu bằng 'blob:')
 * @param filename Tên file (mặc định sẽ tự tạo nếu không cung cấp)
 * @returns Promise<File> trả về đối tượng File
 */
export const blobUrlToFile = async (
  blobUrl: string,
  filename?: string
): Promise<File> => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const defaultFilename = `image_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`;
    return new File([blob], filename || defaultFilename, { type: blob.type || 'image/jpeg' });
  } catch (error) {
    console.error('Lỗi khi chuyển đổi blob URL thành file:', error);
    throw error;
  }
};

/**
 * Xử lý mảng files để tạo FormData cho việc upload
 * @param files Mảng các file (có thể là File object hoặc blob URL)
 * @param formData Đối tượng FormData đang xử lý
 * @param fieldName Tên field trong FormData (mặc định là 'Files')
 */
export const handleFileUploads = async (
  files: (File | string)[],
  formData: FormData,
  fieldName: string = 'Files'
): Promise<void> => {
  for (const file of files) {
    if (file instanceof File) {
      formData.append(fieldName, file);
    } else if (typeof file === 'string' && file.startsWith('blob:')) {
      try {
        const fileObj = await blobUrlToFile(file);
        formData.append(fieldName, fileObj);
      } catch (error) {
        console.error('Không thể xử lý file:', file, error);
      }
    }
    // Bỏ qua nếu không phải File object hoặc blob URL hợp lệ
  }
};

/**
 * Tạo URL xem trước từ File hoặc Blob
 * @param file File hoặc Blob để tạo URL
 * @returns string URL xem trước
 */
export const createPreviewUrl = (file: File | Blob): string => {
  return URL.createObjectURL(file);
};

/**
 * Giải phóng bộ nhớ của URL xem trước
 * @param url URL cần giải phóng
 */
export const revokePreviewUrl = (url: string): void => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Kiểm tra xem một URL có phải là blob URL không
 * @param url URL cần kiểm tra
 * @returns boolean
 */
export const isBlobUrl = (url: string): boolean => {
  return url.startsWith('blob:');
};
