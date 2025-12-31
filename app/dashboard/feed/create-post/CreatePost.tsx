/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import { colors } from '@/constants/themes'
import TextInput from '@/components/TextInput'
import ImageUpload from '@/components/ImageUpload'
import Loader from '@/components/Loader'

import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'

interface FormData {
    content: string
    images: any
}

export default function CreatePost() {
    const router = useRouter()

    const { showLoader, hideLoader } = useLoaderStore()

    const initialValues: FormData = {
        content: '',
        images: [] as File[],
    }

    const setUser = useUserStore((state) => state.setUser)
    const setUserToken = useUserStore((state) => state.setUserToken)
    const handleSubmit = async (
        values: typeof initialValues,
        {
            resetForm,
        }: { resetForm: (nextState?: { values?: FormData }) => void }
    ) => {
        console.log('create post inputs:', values)
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
        content: Yup.string().required('Content is required'),
    })

    return (
        <div className="relative w-full h-full bg-primary">
            <section
                id="hero"
                className="w-full bg-primary flex flex-col items-center justify-center px-10 mt-[60px]"
            >
                <div className="relative flex-1 w-full p-8">
                    <div className="w-full flex justify-between items-center mb-6">
                        <button
                            className="mb-[30px] flex items-center cursor-pointer"
                            onClick={() => router.push('/dashboard/feed')}
                        >
                            <ArrowLeft size={15} color={colors.tertiary} />
                            <h2 className="text-sm md:text-md font-semibold text-tertiary ml-[10px]">
                                Go back
                            </h2>
                        </button>
                    </div>
                    <h2 className="text-3xl font-bold text-center text-[#153A56] mb-6">
                        Create Post
                    </h2>

                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            setFieldValue,
                        }) => (
                            <Form className="w-full max-w-md mx-auto">
                                <TextInput
                                    labelText="Post Content"
                                    placeholderText="Tell me about something..."
                                    variant="paragraph"
                                    id="content"
                                    name="content"
                                    value={values.content}
                                    onChangeInput={handleChange}
                                    errorMessage={
                                        touched.content && errors.content
                                            ? errors.content
                                            : undefined
                                    }
                                />
                                <ImageUpload
                                    setFieldValue={setFieldValue}
                                    values={values}
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
            </section>
            <Loader />
        </div>
    )
}
