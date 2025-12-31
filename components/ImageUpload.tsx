/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

export default function ImageUpload({
    setFieldValue,
    values,
}: {
    setFieldValue: any
    values: any
}) {
    const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const fileArray = Array.from(files)
        setFieldValue('images', [...values.images, ...fileArray])
    }

    const removeImage = (index: number) => {
        const updated = values.images.filter((_: any, i: number) => i !== index)
        setFieldValue('images', updated)
    }

    return (
        <div className="mt-4">
            {/* Upload Button */}
            <label className="block cursor-pointer border-2 border-dashed border-tertiary rounded-lg p-6 text-center hover:bg-gray-50 transition">
                <p className="text-tertiary font-semibold">
                    Upload Images (Multiple)
                </p>
                <p className="text-sm text-gray-400">
                    JPG, PNG — you can select multiple
                </p>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFilesChange}
                    className="hidden"
                />
            </label>

            {/* Preview */}
            {values.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mt-4">
                    {values.images.map((file: File, index: number) => (
                        <div
                            key={index}
                            className="relative group rounded-lg overflow-hidden border"
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt="preview"
                                className="w-full h-24 object-cover"
                            />

                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
