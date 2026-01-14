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
import TextInput from '@/components/TextInput'
import LocationInput from '@/components/LocationInput'
import Loader from '@/components/Loader'

import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'

interface FormData {
    mobileNumber: string
    shopName: string
    location: string
    bio: string
}

export default function UpdateProfile() {
    const router = useRouter()
    const { showLoader, hideLoader } = useLoaderStore()

    const initialValues: FormData = {
        mobileNumber: '',
        shopName: '',
        location: '',
        bio: '',
    }

    const setUser = useUserStore((state) => state.setUser)
    const setUserToken = useUserStore((state) => state.setUserToken)
    const handleSubmit = async (
        values: typeof initialValues,
        {
            resetForm,
        }: { resetForm: (nextState?: { values?: FormData }) => void }
    ) => {
        console.log('signup values:', values)
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

    const validationSchema = Yup.object().shape({
        mobileNumber: Yup.string().required('Mobile number is required'),
        shopName: Yup.string().required('Shop name is required'),
        location: Yup.string().required('Location is required'),
        bio: Yup.string().required('Bio is required'),
    })

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
                            Update Profile
                        </h2>

                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            validationSchema={validationSchema}
                        >
                            {({ values, errors, touched, handleChange }) => (
                                <Form className="w-full max-w-md mx-auto">
                                    <TextInput
                                        labelText="Mobile Number"
                                        placeholderText="Enter mobile number"
                                        variant="contactNumber"
                                        id="mobileNumber"
                                        name="mobileNumber"
                                        value={values.mobileNumber}
                                        onChangeInput={handleChange}
                                        errorMessage={
                                            touched.mobileNumber &&
                                            errors.mobileNumber
                                                ? errors.mobileNumber
                                                : undefined
                                        }
                                    />
                                    <TextInput
                                        labelText="Shop Name"
                                        placeholderText="Enter shop name"
                                        id="shopName"
                                        name="shopName"
                                        value={values.shopName}
                                        onChangeInput={handleChange}
                                        errorMessage={
                                            touched.shopName && errors.shopName
                                                ? errors.shopName
                                                : undefined
                                        }
                                    />
                                    <LocationInput name="location" />

                                    <TextInput
                                        labelText="Bio"
                                        placeholderText="Enter bio"
                                        variant="paragraph"
                                        id="bio"
                                        name="bio"
                                        value={values.bio}
                                        onChangeInput={handleChange}
                                        errorMessage={
                                            touched.bio && errors.bio
                                                ? errors.bio
                                                : undefined
                                        }
                                    />
                                    <div className="mt-6 mb-6 text-center">
                                        <button
                                            type="submit"
                                            className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </section>
            <Loader />
        </div>
    )
}
