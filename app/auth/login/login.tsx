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

import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'

interface FormData {
    email: string
    password: string
}

export default function Login() {
    const router = useRouter()

    const { showLoader, hideLoader } = useLoaderStore()

    const initialValues: FormData = {
        email: '',
        password: '',
    }

    const setUser = useUserStore((state) => state.setUser)
    // const fetchUserData = async (token: string) => {
    //     try {
    //         const response = await fetch(`${API_URL}/user/`, {
    //             method: 'GET',
    //             headers: {
    //                 Accept: 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })

    //         const userData = await response.json()
    //         console.log('get login user data response:', userData)

    //         if (response.ok) {
    //             setUser(userData)
    //             return { success: true, data: userData }
    //         } else {
    //             console.log('error fetching user data')
    //             return { success: false, data: userData }
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         hideLoader()
    //         return { success: false, data: null }
    //     }
    // }

    // const setUserProgress = useUserStore((state) => state.setUserProgress)
    // const fetchOnboardingData = async (token: string) => {
    //     try {
    //         const response = await fetch(`${API_URL}/ekyc/onboarding/`, {
    //             method: 'GET',
    //             headers: {
    //                 Accept: 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })

    //         const onboardingData = await response.json()
    //         console.log('get login onboarding data response:', onboardingData)

    //         if (response.ok) {
    //             setUserProgress(onboardingData)
    //             return { hasData: true, data: onboardingData }
    //         } else {
    //             console.log('user has no data')
    //             return { hasData: false, data: onboardingData }
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         hideLoader()
    //         return { data: null }
    //     }
    // }

    // const setEmployeeData = useUserStore((state) => state.setEmployeeData)
    // const fetchEmployeeData = async (token: string) => {
    //     try {
    //         const response = await fetch(`${API_URL}/user/employee/`, {
    //             method: 'GET',
    //             headers: {
    //                 Accept: 'application/json',
    //                 Authorization: `Bearer ${token}`,
    //             },
    //         })

    //         const employeeData = await response.json()
    //         console.log('get login employee data:', employeeData)

    //         if (response.ok) {
    //             setEmployeeData(employeeData)
    //             return { success: true, data: employeeData }
    //         } else {
    //             console.log('error fetching employee data')
    //             return { success: false, data: employeeData }
    //         }
    //     } catch (error) {
    //         console.log(error)
    //         hideLoader()
    //         return { success: false, data: null }
    //     }
    // }

    const setLoggedIn = useUserStore((state) => state.setLoggedIn)
    const setUserToken = useUserStore((state) => state.setUserToken)
    const setRefreshToken = useUserStore((state) => state.setRefreshToken)
    const handleSubmit = async (
        values: typeof initialValues,
        {
            resetForm,
        }: { resetForm: (nextState?: { values?: FormData }) => void }
    ) => {
        console.log('login values:', values)
        // showLoader()
        // try {
        //     const formData = new FormData()
        //     formData.append('email', values.email)
        //     formData.append('password', values.password)
        //     const response = await fetch(`${API_URL}/auth/jwt/`, {
        //         method: 'POST',
        //         headers: {
        //             Accept: 'application/json',
        //         },
        //         body: formData,
        //     })
        //     const loginResponseData = await response.json()
        //     console.log('login response:', loginResponseData.refresh)

        //     if (response.ok) {
        //         toast.success('Logged in successfully!')
        //         setLoggedIn()
        //         setUserToken(loginResponseData.access)
        //         setRefreshToken(loginResponseData.refresh)

        //         localStorage.setItem(`refresh`, loginResponseData.refresh)
        //         const userToken = useUserStore.getState().userToken
        //         await fetch('/api/set-cookie', {
        //             method: 'POST',
        //             headers: { 'Content-Type': 'application/json' },
        //             body: JSON.stringify({ token: userToken }), // from your state
        //         })

        //         const userResult = await fetchUserData(loginResponseData.access)
        //         const onboardingResult = await fetchOnboardingData(
        //             loginResponseData.access
        //         )
        //         fetchEmployeeData(loginResponseData.access)

        //         // ✅ now you can check directly
        //         if (userResult.data?.is_employee === true) {
        //             if (onboardingResult?.hasData) {
        //                 hideLoader()
        //                 if (onboardingResult?.data.completed) {
        //                     router.push('/dashboard')
        //                 } else {
        //                     router.push(`/auth/signup/onboarding/checklist`)
        //                 }
        //             } else {
        //                 createOnboardingRecord(
        //                     values.email,
        //                     loginResponseData.access
        //                 )
        //             }
        //         } else {
        //             // Not employee
        //             if (onboardingResult?.hasData) {
        //                 if (
        //                     onboardingResult?.data?.liveness_check_is_verified
        //                 ) {
        //                     hideLoader()
        //                     if (onboardingResult?.data.completed) {
        //                         router.push('/dashboard')
        //                     } else {
        //                         router.push(`/auth/signup/onboarding/checklist`)
        //                     }
        //                 } else {
        //                     hideLoader()
        //                     router.push(`/auth/signup-liveness-check`)
        //                 }
        //             } else {
        //                 hideLoader()
        //                 router.push(`/auth/signup-consent-form`)
        //             }
        //         }
        //     } else {
        //         toast.error(`Wrong credentials. ${loginResponseData.detail}`)
        //         hideLoader()
        //     }
        // } catch (error) {
        //     console.log(error)
        //     toast.error(
        //         'Service not available right now. Please try again later.'
        //     )
        //     hideLoader()
        // }
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
        password: Yup.string().required('Password is required'),
    })

    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative h-screen overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                {/* Login Overlay */}
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
                        Welcome Back!
                    </h2>
                    <p className="text-[18px] text-black text-center mb-6">
                        Enter your TrueMoney powered by Vashcorp credentials to
                        access your earnings.
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
                                <TextInput
                                    labelText="Password:"
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
                                <button
                                    type="button"
                                    className="text-tertiary underline cursor-pointer"
                                    onClick={() =>
                                        router.push('/auth/reset-password')
                                    }
                                >
                                    Reset your password
                                </button>
                                <div className="mt-6">
                                    <button
                                        type="submit"
                                        className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                    >
                                        Login
                                    </button>
                                </div>
                                <div className="mt-6 text-center text-black">
                                    Don't have an account?
                                    <button
                                        type="button"
                                        className="ml-2 text-tertiary underline cursor-pointer"
                                        onClick={() =>
                                            router.push('/auth/signup')
                                        }
                                    >
                                        Sign Up
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
