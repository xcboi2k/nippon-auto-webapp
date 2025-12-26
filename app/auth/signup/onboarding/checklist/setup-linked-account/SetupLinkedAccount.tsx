/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from 'nextjs-toploader/app'

import { API_URL } from '@/constants/api'
import { colors } from '@/constants/themes'
import Footer from '@/components/Footer'
import OnboardingStepper from '@/components/OnboardingStepper'
import Dropdown from '@/components/Dropdown'
import TextInput from '@/components/TextInput'
import Loader from '@/components/Loader'
import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'
import useOnboardingStore from '@/stores/useOnboardingStore'

type Options = {
    value: string
    label: string
}

export default function SetupLinkedAccount() {
    const router = useRouter()

    const { showLoader, hideLoader } = useLoaderStore()

    const user = useUserStore((state) => state.user)
    const employeeData = useUserStore((state) => state.employeeData)

    const [toggleConfirm, setToggleConfirm] = useState(false)

    const handleSubmit = async () => {
        const userToken = useUserStore.getState().userToken
        showLoader()
        if (!toggleConfirm) {
            toast.error('Please confirm checkbox before submitting.')
            hideLoader()
        } else {
            try {
                const response = await fetch(
                    `${API_URL}/ekyc/ewa/confirm/payroll-account/`,
                    {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${userToken}`,
                        },
                    }
                )
                console.log('response status:', response.status)
                if (response.ok) {
                    hideLoader()
                    router.push(
                        '/auth/signup/onboarding/checklist/setup-linked-account/status?mode=success'
                    )
                } else {
                    hideLoader()
                }
            } catch (error) {
                toast.error(
                    'Service not available right now. Please try again.'
                )
                hideLoader()
            }
        }
    }

    const maskAccount = (account: string) => {
        // Remove bank name and keep only the numbers
        const numbers = account?.replace(/\D/g, '') // ✅ remove everything except digits

        // Keep last 4 digits
        const last4 = numbers?.slice(-4)

        // Mask the rest
        const masked = numbers
            ?.slice(0, -4)
            .replace(/\d/g, '*')
            .replace(/(.{4})/g, '$& ') // add spaces every 4

        return `${masked}${last4}`
    }

    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative h-screen overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                {/* Sign Up Overlay */}
                <div className="bg-white rounded-xl shadow-2xl p-10 w-[90%] md:w-[50%] flex flex-col items-center justify-center">
                    <div className="w-full flex justify-between items-center mb-6">
                        <button
                            className="mb-[30px] flex items-center cursor-pointer"
                            onClick={() => {
                                router.push('/auth/signup/onboarding/checklist')
                            }}
                        >
                            <ArrowLeft size={15} color={colors.tertiary} />
                            <h2 className="text-sm md:text-md font-semibold text-tertiary ml-[10px]">
                                Return to Checklist
                            </h2>
                        </button>
                    </div>
                    {/* Header Section */}
                    <div className="w-full mb-6">
                        <h1 className="text-[25px] font-bold text-gray-900">
                            Confirm your bank account
                        </h1>

                        <p className="text-[12px] text-gray-400 mt-1">
                            These bank details were provided by your employer.
                            Please review and confirm before proceeding. If
                            these details are incorrect, please contact support
                            for assistance.
                        </p>
                    </div>

                    {/* Bank Name */}
                    <div className="w-full mb-3">
                        <p className="text-[12px] text-gray-400">Bank:</p>
                        <p className="text-[25px] font-bold text-gray-900 uppercase">
                            {employeeData ? employeeData?.payroll_bank : '-'}
                        </p>
                    </div>

                    {/* Account Number */}
                    <div className="w-full mb-3">
                        <p className="text-[12px] text-gray-400">
                            Account Number:
                        </p>
                        <p className="text-[25px] font-bold text-gray-900">
                            {employeeData
                                ? maskAccount(
                                      employeeData?.payroll_account_number
                                  )
                                : '-'}
                        </p>
                    </div>

                    {/* Account Holder */}
                    <div className="w-full mb-3">
                        <p className="text-[12px] text-gray-400">
                            Account Holder Name:
                        </p>
                        <p className="text-[25px] font-bold text-gray-900">
                            {user?.first_name} {user?.last_name}
                        </p>
                    </div>

                    {/* Checkbox */}
                    <div className="w-full flex flex-col items-center mt-3 mb-4">
                        <div className="flex flex-row justify-between w-full items-start">
                            {/* Checkbox */}
                            <div className="flex items-center gap-4">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 bg-tertiary rounded-sm"
                                    name="terms"
                                    id="terms"
                                    onChange={(e) => {
                                        setToggleConfirm(e.target.checked)
                                    }}
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-h6 text-black"
                                >
                                    I confirm these are my correct bank details.
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Button */}
                    <div className="w-full">
                        <button
                            onClick={handleSubmit}
                            className="w-full bg-tertiary text-white text-[18px] font-medium py-3 rounded-lg"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
            <Loader />
        </div>
    )
}
