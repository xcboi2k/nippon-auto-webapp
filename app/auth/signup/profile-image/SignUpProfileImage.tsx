'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useRouter } from 'nextjs-toploader/app'

import { API_URL } from '@/constants/api'
import { colors } from '@/constants/themes'
import Footer from '@/components/Footer'
import TextInput from '@/components/TextInput'
import LocationInput from '@/components/LocationInput'
import Loader from '@/components/Loader'

import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'

export default function SignUpProfileImage() {
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

    const setUser = useUserStore((state) => state.setUser)
    const setUserToken = useUserStore((state) => state.setUserToken)
    const handleSubmit = async () =>
        // values: typeof initialValues,
        // {
        //     resetForm,
        // }: { resetForm: (nextState?: { values?: FormData }) => void }
        {
            console.log('image upload:')
            // showLoader()
            // if (checkedTerms) {
            //     try {
            //         const formData = new FormData()
            //         formData.append('first_name', values.firstName)
            //         formData.append('middle_name', values.middleName)
            //         formData.append('last_name', values.lastName)
            //         formData.append('name_extension', values.nameExtension)
            //         formData.append('phone_number', `0${values.contactNumber}`)
            //         formData.append('email', values.email)
            //         formData.append('password', values.password)
            //         formData.append('confirm_password', values.confirmPassword)
            //         const response = await fetch(`${API_URL}/user/register/`, {
            //             method: 'POST',
            //             headers: {
            //                 Accept: 'application/json',
            //             },
            //             body: formData,
            //         })
            //         const data = await response.json()
            //         console.log('response:', data)
            //         if (!response.ok) {
            //             hideLoader()
            //             await new Promise((resolve) => setTimeout(resolve, 100))
            //             // Handle other errors
            //             const formattedErrors = Object.entries(data).map(
            //                 ([field, messages]) => {
            //                     // Turn snake_case into Title Case (new_password → New Password)
            //                     const msgs = messages as string[]
            //                     const label = field
            //                         .split('_')
            //                         .map(
            //                             (word) =>
            //                                 word.charAt(0).toUpperCase() +
            //                                 word.slice(1)
            //                         )
            //                         .join(' ')

            //                     return `${label} Error: ${msgs.join(' ')}`
            //                 }
            //             )
            //             toast.error(`${formattedErrors}`)
            //         } else {
            //             hideLoader()
            //             toast.success(`${data.message}`)
            //             router.push('/auth/login')
            //         }
            //     } catch (error) {
            //         console.log(error)
            //         toast.error(
            //             'Service not available right now. Please try again later.'
            //         )
            //         hideLoader()
            //     }
            // } else {
            //     hideLoader()
            //     toast.error('Please accept the terms and conditions to proceed.')
            //     return
            // }
        }
    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                <div className="bg-primary p-10 overflow-y-auto my-[20px]">
                    <h2 className="text-[40px] font-bold text-tertiary text-center mb-8">
                        Setup Profile - Upload Profile Photo
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

                        <div className="mt-6 mb-6 text-center">
                            <button
                                type="submit"
                                className="w-full border-2 border-tertiary bg-white text-tertiary py-3 rounded-lg text-lg cursor-pointer"
                            >
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <Loader />
        </div>
    )
}
