'use client';
import { useState } from 'react';
import api from '@/utils/api';
import { getImageUrl } from '@/utils/media';
import Image from 'next/image';

interface ImageUploadProps {
    onUploadSuccess: (url: string) => void;
    currentImage?: string;
    label?: string;
}

export default function ImageUpload({ onUploadSuccess, currentImage, label }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(currentImage || '');

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            const { data } = await api.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            onUploadSuccess(data);
            setPreview(data); // Update with server path
        } catch (error) {
            console.error('Upload error:', error);
            alert('Gagal mengunggah gambar');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-foreground/80 text-sm font-medium mb-1">{label}</label>}
            <div className="flex flex-col items-center gap-4 p-4 border border-dashed border-border rounded-xl bg-muted/30">
                {(preview || currentImage) ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                        <Image
                            src={getImageUrl(preview || currentImage)}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white text-xs font-medium">Ubah Gambar</span>
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center">
                        <span className="text-4xl mb-2 block">🖼️</span>
                        <p className="text-sm text-foreground/40 italic">Belum ada gambar</p>
                    </div>
                )}

                <label className="cursor-pointer w-full">
                    <div className={`px-4 py-2 rounded-lg text-sm font-semibold text-center transition ${uploading ? 'bg-muted text-foreground/40' : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'
                        }`}>
                        {uploading ? 'Sedang Mengunggah...' : (preview || currentImage ? 'Ganti Gambar' : 'Pilih Gambar')}
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            </div>
        </div>
    );
}
