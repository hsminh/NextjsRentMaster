import React, { useRef, useState, useEffect, memo } from 'react'; // Import memo
import { User, Camera } from 'lucide-react';

interface AvatarUploaderProps {
    defaultUrl?: string | null;
    onFileChange: (file: File | null) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({ defaultUrl, onFileChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(defaultUrl || null);

    useEffect(() => {
        if (defaultUrl !== previewUrl) {
            setPreviewUrl(defaultUrl || null);
        }
    }, [defaultUrl]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        if (file) {
            const newPreview = URL.createObjectURL(file);
            setPreviewUrl(newPreview);

            onFileChange(file);
        } else {
            setPreviewUrl(defaultUrl || null);
            onFileChange(null);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center space-y-3">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <div
                className="relative w-28 h-28 cursor-pointer group"
                onClick={handleAvatarClick}
                title="Click để thay đổi ảnh đại diện"
            >
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border-4 border-primary/20 shadow-lg transition-shadow duration-300 group-hover:shadow-xl">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Avatar Preview"
                            className="w-full h-full object-cover"
                            key={previewUrl}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User className="w-14 h-14" />
                        </div>
                    )}
                </div>

                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Camera className="w-6 h-6 text-white" />
                </div>
            </div>

        </div>
    );
};

export default memo(AvatarUploader);