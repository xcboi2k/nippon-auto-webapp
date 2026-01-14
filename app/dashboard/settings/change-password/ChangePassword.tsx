'use client'

import React from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'
import { MdStore, MdLocationOn, MdEmail, MdPhone } from 'react-icons/md'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

import { API_URL } from '@/constants/api'
import { colors } from '@/constants/themes'
import TextInput from '@/components/TextInput'
import Loader from '@/components/Loader'

import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'

interface FormData {
    oldPassword: string
    newPassword: string
    confirmNewPassword: string
}

export default function ChangePassword() {
    const router = useRouter()
    const { showLoader, hideLoader } = useLoaderStore()

    const initialValues: FormData = {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
    }

    const setLoggedOut = useUserStore((state) => state.setLoggedOut)
    const clearUser = useUserStore((state) => state.clearUser)
    const clearUserToken = useUserStore((state) => state.clearUserToken)
    const handleLogout = () => {
        console.log('Logging out...')
        setLoggedOut()
        clearUser()
        clearUserToken()
        setTimeout(() => {
            hideLoader()
            router.push('/')
        }, 2000)
    }

    const handleFormikSubmit = async (
        values: typeof initialValues,
        {
            resetForm,
        }: { resetForm: (nextState?: { values?: FormData }) => void }
    ) => {
        console.log('change password values:', values)
        // showLoader()
        // const userToken = useUserStore.getState().userToken
        // try {
        //     const formData = new FormData()
        //     formData.append('old_password', values.oldPassword)
        //     formData.append('new_password', values.newPassword)
        //     formData.append('confirm_password', values.confirmNewPassword)
        //     const response = await fetch(`${API_URL}/user/change-password/`, {
        //         method: 'POST',
        //         headers: {
        //             Accept: 'application/json',
        //             Authorization: `Bearer ${userToken}`,
        //         },
        //         body: formData,
        //     })
        //     const data = await response.json()
        //     // const result = data.response
        //     console.log('change password response', data)
        //     if (response.ok) {
        //         //setting state of user feedback stores to initialize user feedback components
        //         await new Promise((resolve) => setTimeout(resolve, 100))
        //         toast.success('Password updated. Logging out.')
        //         handleLogout()
        //     } else {
        //         hideLoader()
        //         toast.error(`Failed to update password.`)
        //     }
        //     resetForm()
        // } catch (error) {
        //     console.log(error)
        //     toast.error(
        //         'Service not available right now. Please try again later.'
        //     )
        //     hideLoader()
        // }
    }

    const validationSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Old password is required'),
        newPassword: Yup.string()
            .required('New password is required')
            .min(8, 'New password must be at least 8 characters long')
            .matches(
                /[A-Z]/,
                'New password must contain at least one uppercase letter'
            )
            .matches(
                /[a-z]/,
                'New password must contain at least one lowercase letter'
            )
            .matches(/[0-9]/, 'New password must contain at least one number')
            .matches(
                /[@$!%*?&]/,
                'New password must contain at least one special character'
            ),
        confirmNewPassword: Yup.string()
            .oneOf([Yup.ref('newPassword')], 'Passwords must match')
            .required('Please confirm your new password'),
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
                        Change Password
                    </h2>

                    <div className="w-full flex flex-col items-center justify-center">
                        <Formik
                            initialValues={initialValues}
                            onSubmit={handleFormikSubmit}
                            validationSchema={validationSchema}
                        >
                            {({ values, errors, touched, handleChange }) => (
                                <Form className="w-full max-w-md">
                                    <TextInput
                                        labelText="Old Password:"
                                        placeholderText="Enter old password"
                                        id="oldPassword"
                                        name="oldPassword"
                                        variant="password"
                                        value={values.oldPassword}
                                        onChangeInput={handleChange}
                                        errorMessage={
                                            touched.oldPassword &&
                                            errors.oldPassword
                                                ? errors.oldPassword
                                                : undefined
                                        }
                                    />
                                    <TextInput
                                        labelText="New Password:"
                                        placeholderText="Enter new password"
                                        id="newPassword"
                                        name="newPassword"
                                        variant="password"
                                        value={values.newPassword}
                                        onChangeInput={handleChange}
                                        errorMessage={
                                            touched.newPassword &&
                                            errors.newPassword
                                                ? errors.newPassword
                                                : undefined
                                        }
                                    />
                                    <TextInput
                                        labelText="Confirm New Password:"
                                        placeholderText="Enter new password"
                                        id="confirmNewPassword"
                                        name="confirmNewPassword"
                                        variant="password"
                                        value={values.confirmNewPassword}
                                        onChangeInput={handleChange}
                                        errorMessage={
                                            touched.confirmNewPassword &&
                                            errors.confirmNewPassword
                                                ? errors.confirmNewPassword
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
                </div>
            </section>
            <Loader />
        </div>
    )
}
