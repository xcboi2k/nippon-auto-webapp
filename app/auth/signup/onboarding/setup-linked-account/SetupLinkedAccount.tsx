/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { AiOutlineLoading } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { useRouter } from 'nextjs-toploader/app'

import { API_URL } from '@/constants/api'
import Footer from '@/components/Footer'
import OnboardingStepper from '@/components/OnboardingStepper'
import Dropdown from '@/components/Dropdown'
import TextInput from '@/components/TextInput'
import Loader from '@/components/Loader'
import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'
import useOnboardingStore from '@/stores/useOnboardingStore'

export default function SetupLinkedAccount() {
    const router = useRouter()

    const { showLoader, hideLoader } = useLoaderStore()

    const user = useUserStore((state) => state.user)
    const employeeData = useUserStore((state) => state.employeeData)
    console.log('employee:', employeeData)
    const [toggleConfirm, setToggleConfirm] = useState(false)
    // for checking progress
    const [loading, setLoading] = useState(false)
    const [accountLinked, setAccountLinked] = useState(false)
    const checkAccountLinkingProgress = async () => {
        const userToken = useUserStore.getState().userToken
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/ekyc/onboarding/`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
            })
            const data = await response.json()
            // console.log('Fetched progress details.', data)
            if (response.ok) {
                if (data?.payroll_is_verified) {
                    setAccountLinked(true)
                }
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.error('Error fetching progress:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAccountLinkingProgress()
    }, [])

    const setIsUserInStep7 = useOnboardingStore(
        (state) => state.setIsUserInStep7
    )
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
                    setIsStep6CompletedTrue()
                    setIsUserInStep7()
                    router.push(
                        '/auth/signup/onboarding/setup-linked-account/status?mode=success'
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

    //back
    const setIsUserInStep4 = useOnboardingStore(
        (state) => state.setIsUserInStep4
    )
    const handleBack = () => {
        // set then navigate
        setIsUserInStep4()
        router.push('/auth/signup/onboarding/upload-id')
    }
    // skip
    const isStep6Completed = useOnboardingStore(
        (state) => state.isStep6Completed
    )
    const setIsStep6CompletedFalse = useOnboardingStore(
        (state) => state.setIsStep6CompletedFalse
    )
    const handleSkip = () => {
        if (isStep6Completed !== 'completed' && !accountLinked) {
            setIsStep6CompletedFalse()
        }
        if (accountLinked) {
            setIsStep6CompletedTrue()
        }
        setIsUserInStep7()
        router.push('/auth/signup/onboarding/setup-profile')
    }
    //proceed
    const setIsStep6CompletedTrue = useOnboardingStore(
        (state) => state.setIsStep6CompletedTrue
    )
    const handleProceed = () => {
        setIsStep6CompletedTrue()
        setIsUserInStep7()
        router.push('/auth/signup/onboarding/setup-profile')
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
                    <div className="w-full border-b-2 border-tertiary mb-[20px]">
                        <OnboardingStepper
                            stepNumber={'5'}
                            stepTitle={'Setup Linked Account'}
                            onPressBack={handleBack}
                            onPressSkip={handleSkip}
                            isStepCompleted={accountLinked}
                        />
                    </div>
                    {loading ? (
                        <div className="w-full px-5 md:px-[50px] lg:px-[70px] mb-[50px]">
                            <div className="flex items-center justify-center mt-[20px]">
                                <AiOutlineLoading className="text-tertiary animate-spin text-[100px]" />
                            </div>
                        </div>
                    ) : (
                        <>
                            {accountLinked ? (
                                <>
                                    <div className="w-full px-5 md:px-[50px] lg:px-[70px] mb-[50px]">
                                        <div className="flex items-center justify-center mt-[20px]">
                                            <FaRegCircleCheck className="text-green-500 text-[100px]" />
                                        </div>
                                    </div>
                                    <h2 className="text-[40px] font-bold text-tertiary text-center mb-6">
                                        Account Linking Success
                                    </h2>
                                    <div className="flex flex-col w-full items-center mb-[20px]">
                                        <div className="text-[16px] 2sm:text-[20px] text-[#121212] mb-2 text-center">
                                            You have already linked an account.
                                        </div>
                                    </div>
                                    <div className="w-full mt-6 mb-2 text-center">
                                        <button
                                            className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                            onClick={handleProceed}
                                        >
                                            Proceed
                                        </button>
                                    </div>
                                </>
                            ) : user?.is_employee ? (
                                <>
                                    {/* Header Section */}
                                    <div className="w-full mb-6">
                                        <h1 className="text-[25px] font-bold text-gray-900">
                                            Confirm your bank account
                                        </h1>

                                        <p className="text-[12px] text-gray-400 mt-1">
                                            These bank details were provided by
                                            your employer. Please review and
                                            confirm before proceeding. If these
                                            details are incorrect, please
                                            contact support for assistance.
                                        </p>
                                    </div>

                                    {/* Bank Name */}
                                    <div className="w-full mb-3">
                                        <p className="text-[12px] text-gray-400">
                                            Bank:
                                        </p>
                                        <p className="text-[25px] font-bold text-gray-900 uppercase">
                                            {employeeData
                                                ? employeeData?.payroll_bank
                                                : '-'}
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
                                                        setToggleConfirm(
                                                            e.target.checked
                                                        )
                                                    }}
                                                />
                                                <label
                                                    htmlFor="terms"
                                                    className="text-h6 text-black"
                                                >
                                                    I confirm these are my
                                                    correct bank details.
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
                                </>
                            ) : (
                                <>
                                    <h2 className="text-[40px] font-bold text-tertiary text-center mb-6">
                                        We can’t link your bank account just yet
                                    </h2>
                                    <div className="flex flex-col w-full items-center mb-[20px]">
                                        <div className="text-[16px] 2sm:text-[20px] text-[#121212] mb-2 text-center">
                                            We’re unable to confirm your bank
                                            account until your employment
                                            affiliation is verified. You may
                                            proceed with the other onboarding
                                            steps in the meantime.
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </section>
            <Footer />
            <Loader />
        </div>
    )
}
