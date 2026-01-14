'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'

import { API_URL } from '@/constants/api'
import { colors } from '@/constants/themes'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'

import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'

export default function UpdateProfileImage() {
    const router = useRouter()
    const { showLoader, hideLoader } = useLoaderStore()

    const [preview, setPreview] = useState<string>('')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreview(url)
        } else {
            setPreview('')
        }
    }

    return (
        <div className="relative w-full h-full bg-primary">
            <section
                id="hero"
                className="w-full bg-primary flex flex-col items-center justify-center px-10 mt-[60px]"
            >
                <div className="relative flex-1 w-full p-8">
                    <button
                        className="mb-[30px] flex items-center cursor-pointer"
                        onClick={() =>
                            router.push('/dashboard/account/profile')
                        }
                    >
                        <ArrowLeft size={15} color={colors.tertiary} />
                        <h2 className="text-sm md:text-md font-semibold text-tertiary ml-[10px]">
                            Go back
                        </h2>
                    </button>
                    <div className="w-full flex flex-col justify-between items-center mb-6">
                        <h2 className="text-[40px] font-bold text-tertiary text-center mb-8">
                            Update Profile Photo
                        </h2>

                        <div className="w-full max-w-md mx-auto items-center justify-center">
                            <div className="flex flex-col items-center">
                                <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-tertiary bg-zinc-200 flex items-center justify-center mb-5">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="Profile Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-zinc-400 text-center">
                                            No Photo
                                        </span>
                                    )}
                                </div>

                                <label className="cursor-pointer bg-tertiary text-white px-6 py-2 rounded-lg hover:bg-tertiary/80 transition">
                                    Choose Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="mt-6 mb-6 text-center">
                                <button
                                    type="submit"
                                    className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Loader />
        </div>
    )
}
