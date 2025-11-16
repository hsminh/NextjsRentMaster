'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { X, ImagePlus } from 'lucide-react'

interface CImageUploaderProps {
    multiple?: boolean
    defaultFiles?: string[]
    onChange?: (files: File[], previews: string[], allPreviews: string[]) => void
    required?: boolean
}

const CImageUploader: React.FC<CImageUploaderProps> = ({
                                                           multiple = true,
                                                           defaultFiles = [],
                                                           onChange,
                                                           required = false,
                                                       }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [previewImages, setPreviewImages] = useState<string[]>([])
    const [existingImages, setExistingImages] = useState<string[]>([])

    useEffect(() => {
        if (defaultFiles.length > 0) {
            setExistingImages(defaultFiles)
            setPreviewImages(defaultFiles)
        }
    }, [defaultFiles])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const newFiles = Array.from(files)
            const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

            const updatedFiles = multiple ? [...selectedFiles, ...newFiles] : newFiles
            const updatedPreviews = multiple
                ? [...previewImages, ...newPreviews]
                : [...existingImages, ...newPreviews]

            setSelectedFiles(updatedFiles)
            setPreviewImages(updatedPreviews)

            // Trả về: files mới, previews mới, tất cả previews (bao gồm cả ảnh cũ)
            onChange?.(updatedFiles, newPreviews, updatedPreviews)
        }
    }

    const handleRemove = (index: number) => {
        const removedUrl = previewImages[index]
        const isBlobUrl = removedUrl.startsWith('blob:')

        let updatedFiles = selectedFiles

        if (isBlobUrl) {
            const fileIndex = selectedFiles.findIndex((_, i) => {
                const blobIndex = existingImages.length + i
                return blobIndex === index
            })

            if (fileIndex !== -1) {
                updatedFiles = selectedFiles.filter((_, i) => i !== fileIndex)
                setSelectedFiles(updatedFiles)
            }
            URL.revokeObjectURL(removedUrl)
        } else {
            const updatedExisting = existingImages.filter((url) => url !== removedUrl)
            setExistingImages(updatedExisting)
        }

        const updatedPreviews = previewImages.filter((_, i) => i !== index)
        setPreviewImages(updatedPreviews)

        // Trả về files đã cập nhật thay vì selectedFiles cũ
        onChange?.(updatedFiles, [], updatedPreviews)
    }

    return (
        <div className="border rounded-lg p-4 bg-gray-50">
            <div className="flex items-center gap-3 mb-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2"
                >
                    <ImagePlus className="w-4 h-4" />
                    <span>Chọn ảnh</span>
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="hidden"
                />
                {previewImages.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                        Đã chọn {previewImages.length} ảnh
                    </span>
                )}
            </div>

            {previewImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previewImages.map((src, idx) => (
                        <div key={idx} className="relative group border rounded-lg overflow-hidden shadow-sm">
                            <Image
                                src={src}
                                alt={`preview-${idx}`}
                                width={200}
                                height={150}
                                className="object-cover w-full h-32"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemove(idx)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CImageUploader