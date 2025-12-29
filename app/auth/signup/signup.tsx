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

import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'

interface FormData {
    firstName: string
    lastName: string
    userName: string
    email: string
    password: string
    confirmPassword: string
}

export default function SignUp() {
    const router = useRouter()
    const { showLoader, hideLoader } = useLoaderStore()

    const initialValues: FormData = {
        firstName: '',
        lastName: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    const [checkedTerms, setCheckedTerms] = useState(false)

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
        firstName: Yup.string().required('First name is required'),
        lastName: Yup.string().required('Last name is required'),
        userName: Yup.string().required('User name is required'),
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters long')
            .matches(
                /[A-Z]/,
                'Password must contain at least one uppercase letter'
            )
            .matches(
                /[a-z]/,
                'Password must contain at least one lowercase letter'
            )
            .matches(/[0-9]/, 'Password must contain at least one number')
            .matches(
                /[@$!%*?&]/,
                'Password must contain at least one special character'
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Please confirm your password'),
    })

    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                {/* Sign Up Overlay */}
                <div className="bg-primary p-10 overflow-y-auto my-[20px]">
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
                    <h2 className="text-[40px] font-bold text-tertiary text-center mb-8">
                        Create account
                    </h2>
                    <p className="text-[18px] text-black text-center mb-8">
                        Kindly provide the necessary details below.
                    </p>

                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                        {({ values, errors, touched, handleChange }) => (
                            <Form className="w-full max-w-md mx-auto">
                                <TextInput
                                    labelText="First Name"
                                    placeholderText="Enter your first name"
                                    id="firstName"
                                    name="firstName"
                                    value={values.firstName}
                                    onChangeInput={handleChange}
                                    errorMessage={
                                        touched.firstName && errors.firstName
                                            ? errors.firstName
                                            : undefined
                                    }
                                />

                                <TextInput
                                    labelText="Last Name"
                                    placeholderText="Enter your last name"
                                    id="lastName"
                                    name="lastName"
                                    value={values.lastName}
                                    onChangeInput={handleChange}
                                    errorMessage={
                                        touched.lastName && errors.lastName
                                            ? errors.lastName
                                            : undefined
                                    }
                                />
                                <TextInput
                                    labelText="Username"
                                    placeholderText="Enter your username"
                                    id="userName"
                                    name="userName"
                                    value={values.userName}
                                    onChangeInput={handleChange}
                                    errorMessage={
                                        touched.userName && errors.userName
                                            ? errors.userName
                                            : undefined
                                    }
                                />
                                <TextInput
                                    labelText="Email Address"
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

                                <TextInput
                                    labelText="Password"
                                    placeholderText="Enter password"
                                    id="password"
                                    name="password"
                                    variant="password"
                                    value={values.password}
                                    onChangeInput={handleChange}
                                    errorMessage={
                                        touched.password && errors.password
                                            ? errors.password
                                            : undefined
                                    }
                                />
                                <TextInput
                                    labelText="Confirm Password"
                                    placeholderText="Enter confirm password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    variant="password"
                                    value={values.confirmPassword}
                                    onChangeInput={handleChange}
                                    errorMessage={
                                        touched.confirmPassword &&
                                        errors.confirmPassword
                                            ? errors.confirmPassword
                                            : undefined
                                    }
                                />
                                <div className="flex items-center gap-4">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 bg-tertiary rounded-sm"
                                        name="terms"
                                        id="terms"
                                        onChange={(e) => {
                                            setCheckedTerms(e.target.checked)
                                        }}
                                    />
                                    <label
                                        htmlFor="terms"
                                        className="text-h6 text-black"
                                    >
                                        I acknowledge that I have read and
                                        understood the{' '}
                                        <Link
                                            href="/terms-conditions?from=signup"
                                            target="_blank"
                                            className="text-tertiary font-semibold cursor-pointer"
                                        >
                                            NipponAuto Terms and Conditions
                                        </Link>{' '}
                                        and{' '}
                                        <Link
                                            href="/privacy-policy?from=signup"
                                            target="_blank"
                                            className="text-tertiary font-semibold cursor-pointer"
                                        >
                                            NipponAuto Privacy Policy{' '}
                                        </Link>
                                        (as may be updated from time to time)
                                        and hereby agree to be bound by such
                                        terms.
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
                                <div className="text-center">
                                    <span className="text-[16px] text-black mr-[5px]">
                                        Already have an account?
                                    </span>
                                    <button
                                        type="button"
                                        className="text-tertiary underline text-[16px] cursor-pointer"
                                        onClick={() =>
                                            router.push('/auth/login')
                                        }
                                    >
                                        Log In
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
