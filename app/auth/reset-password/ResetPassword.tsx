/* eslint-disable @typescript-eslint/no-explicit-any */
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
import TextInput from '@/components/TextInput'
import Loader from '@/components/Loader'

interface FormData {
    email: string
}

export default function ResetPassword() {
    const router = useRouter()

    const initialValues: FormData = {
        email: '',
    }

    const handleSubmit = async (
        values: typeof initialValues,
        {
            resetForm,
        }: { resetForm: (nextState?: { values?: FormData }) => void }
    ) => {
        router.push(`/auth/reset-password?email=${values.email}`)
        resetForm()
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
    })

    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative h-screen overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                <div className="bg-primary p-10 flex flex-col items-center justify-center my-[20px]">
                    <div className="w-full flex justify-between items-center mb-6">
                        <button
                            className="mb-[30px] flex items-center cursor-pointer"
                            onClick={() => router.push('/')}
                        >
                            <ArrowLeft size={15} color={colors.tertiary} />
                            <h2 className="text-sm md:text-md font-semibold text-tertiary ml-[10px]">
                                Return to Home
                            </h2>
                        </button>
                    </div>

                    <h2 className="text-[40px] font-bold text-tertiary text-center mb-6">
                        Reset Password
                    </h2>
                    <p className="text-[18px] text-black text-center mb-6">
                        Enter your registered email address below to receive a
                        password reset link.
                    </p>

                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                        {({ values, errors, touched, handleChange }) => (
                            <Form className="w-full max-w-md">
                                <TextInput
                                    labelText="Email Address:"
                                    placeholderText="Enter email"
                                    id="email"
                                    name="email"
                                    value={values.email}
                                    onChangeInput={handleChange}
                                    errorMessage={
                                        touched.email && errors.email
                                            ? errors.email
                                            : undefined
                                    }
                                />
                                <div className="mt-6">
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
            <Footer />
            <Loader />
        </div>
    )
}
