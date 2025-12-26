/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import { AiOutlineLoading } from 'react-icons/ai'

import { API_URL } from '@/constants/api'
import Footer from '@/components/Footer'
import Loader from '@/components/Loader'
import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'
import useOnboardingStore from '@/stores/useOnboardingStore'

export default function Checklist() {
    const router = useRouter()

    const { showLoader, hideLoader } = useLoaderStore()

    const [hasCompleted, setHasCompleted] = useState(false)
    const [mode, setMode] = useState('affiliateSuccess')
    const [loading, setLoading] = useState(false)
    const [userProgress, setUserProgress] = useState<any>(null)
    // user states
    const user = useUserStore((state) => state.user)
    const checkProgress = async () => {
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
            console.log('Fetched progress details.', data)
            if (response.ok) {
                setUserProgress(data)
                setLoading(false)
                if (data?.completed) {
                    setHasCompleted(true)
                }
            } else {
                setLoading(false)
            }
            return data
        } catch (error) {
            console.error('Error fetching progress:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null
        let isMounted = true

        const pollProgress = async () => {
            try {
                const res = await checkProgress()
                if (!isMounted || !res) return

                const {
                    id_card_is_verified,
                    id_selfie_is_verified,
                    liveness_check_is_verified,
                    completed,
                } = res

                // 🔥 Retain EXACT null checking logic you originally had
                const allVerified =
                    (id_card_is_verified === true ||
                        id_card_is_verified === null) &&
                    (id_selfie_is_verified === true ||
                        id_selfie_is_verified === null) &&
                    liveness_check_is_verified === true

                if (allVerified && completed === true) {
                    console.log('✅ All checks done. Stopping polling.')

                    if (intervalId) clearInterval(intervalId)
                    setHasCompleted(true)
                    // router.push(
                    //     '/auth/signup/onboarding/checklist/status?mode=affiliateSuccess'
                    // )
                } else {
                    console.log('⏳ Still checking progress...')
                }
            } catch (err) {
                console.log('Polling error:', err)
            }
        }

        // Run immediately, then every 20 seconds
        pollProgress()
        intervalId = setInterval(pollProgress, 20000)

        return () => {
            isMounted = false
            if (intervalId) clearInterval(intervalId)
        }
    }, [])

    // verify email
    const handleVerifyEmail = () => {
        router.push('/auth/signup/onboarding/checklist/email-verification')
    }

    //verify mobile number
    const handleVerifyMobileNumber = () => {
        router.push(
            '/auth/signup/onboarding/checklist/mobile-number-verification'
        )
    }

    const handleTakeFaceLiveliness = () => {
        router.push('/auth/signup/onboarding/checklist/liveness-check')
    }

    const handleUploadSelfie = () => {
        if (
            userProgress?.id_card_is_verified === true ||
            userProgress?.id_card_is_verified === null
        ) {
            router.push('/auth/signup/onboarding/checklist/upload-selfie')
        } else {
            toast.error('Kindly upload your required documents first.')
        }
    }

    const handleLinkAccount = () => {
        if (user?.is_employee === true) {
            router.push(
                '/auth/signup/onboarding/checklist/setup-linked-account'
            )
        } else {
            toast.error(
                "You're account is not affiliated with any 4Vale corporate partner at this time."
            )
        }
    }

    const setLoggedOut = useUserStore((state) => state.setLoggedOut)
    const clearUser = useUserStore((state) => state.clearUser)
    const clearUserToken = useUserStore((state) => state.clearUserToken)
    const resetOnboardingSteppers = useOnboardingStore(
        (state) => state.resetOnboardingSteppers
    )

    const handleLogout = () => {
        console.log('Logging out...')
        showLoader()
        setLoggedOut()
        resetOnboardingSteppers()
        clearUser()
        clearUserToken()
        setTimeout(() => {
            toast.success('Logged out successfully.')
            hideLoader()
            router.push('/')
        }, 2000)
    }

    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                <div className="bg-white rounded-xl shadow-2xl p-10 w-[90%] md:w-[50%] overflow-y-auto my-[40px]">
                    <div className="w-full flex flex-col items-center justify-center p-4 mt-2 rounded-lg bg-tertiary-50">
                        {/* Title */}
                        <div className="w-full flex flex-row items-center justify-between border-b-2 mb-3">
                            <p className="text-[16px] font-medium text-gray-500">
                                Onboarding Checklist
                            </p>
                        </div>

                        {loading ? (
                            <div className="w-full px-5 md:px-[50px] lg:px-[70px] mb-[50px]">
                                <div className="flex items-center justify-center mt-[20px]">
                                    <AiOutlineLoading className="text-tertiary animate-spin text-[100px]" />
                                </div>
                            </div>
                        ) : (
                            <>
                                {hasCompleted ? (
                                    <>
                                        <div className="flex flex-col items-center justify-center w-[90%] mb-4">
                                            {mode === 'affiliateSuccess' ? (
                                                <>
                                                    <h1 className="text-[60px] font-bold text-tertiary text-center mb-6">
                                                        You’re all set,
                                                        <br />
                                                        {user.first_name}!
                                                    </h1>
                                                    <p className="text-[12px] text-gray-400 text-center">
                                                        Your profile is now
                                                        complete. You can now
                                                        access your early wage
                                                        benefits through 4Vale.
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <h1 className="text-[60px] font-bold text-tertiary text-center mb-6">
                                                        Almost done,
                                                        <br />
                                                        {user.first_name}!
                                                    </h1>
                                                    <p className="text-[12px] text-gray-400 text-center">
                                                        Thank you for your
                                                        interest in 4Vale. We’ve
                                                        received your
                                                        information and we’ll
                                                        notify you once it has
                                                        been verified with your
                                                        employer.
                                                    </p>
                                                </>
                                            )}
                                        </div>

                                        {/* Button */}
                                        <div className="w-full flex justify-center items-center mt-4 mb-5">
                                            {mode === 'affiliateSuccess' ? (
                                                <button
                                                    className="bg-tertiary text-white px-6 py-3 rounded-lg text-[18px] font-medium"
                                                    onClick={() =>
                                                        router.push(
                                                            '/dashboard'
                                                        )
                                                    }
                                                >
                                                    Proceed to Dashboard
                                                </button>
                                            ) : (
                                                <button
                                                    className="bg-tertiary text-white px-6 py-3 rounded-lg text-[18px] font-medium"
                                                    onClick={() => {
                                                        setLoggedOut()
                                                        clearUser()
                                                        clearUserToken()
                                                        router.push('/')
                                                    }}
                                                >
                                                    Return to Login
                                                </button>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-full flex flex-col items-center mb-3 space-y-3">
                                            {/* STEP ITEM */}
                                            <div className="flex flex-row justify-between w-full">
                                                <div className="w-[65%]">
                                                    <p className="text-[12px] text-gray-500">
                                                        1. Verify mobile number
                                                    </p>
                                                </div>
                                                <div className="w-[30%] text-right">
                                                    <button
                                                        disabled={
                                                            userProgress?.sms_is_verified
                                                        }
                                                        onClick={
                                                            handleVerifyMobileNumber
                                                        }
                                                        className="text-[12px]"
                                                    >
                                                        <span
                                                            className={`
                        ${
                            userProgress?.sms_is_verified
                                ? 'text-green-600'
                                : 'text-tertiary underline'
                        }
                    `}
                                                        >
                                                            {userProgress?.sms_is_verified
                                                                ? 'Completed'
                                                                : 'Verify'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* STEP 2 */}
                                            <div className="flex flex-row justify-between w-full">
                                                <div className="w-[65%]">
                                                    <p className="text-[12px] text-gray-500">
                                                        2. Verify email address
                                                    </p>
                                                </div>
                                                <div className="w-[30%] text-right">
                                                    <button
                                                        disabled={
                                                            userProgress?.email_is_verified
                                                        }
                                                        onClick={
                                                            handleVerifyEmail
                                                        }
                                                        className="text-[12px]"
                                                    >
                                                        <span
                                                            className={`
                        ${
                            userProgress?.email_is_verified
                                ? 'text-green-600'
                                : 'text-tertiary underline'
                        }
                    `}
                                                        >
                                                            {userProgress?.email_is_verified
                                                                ? 'Completed'
                                                                : 'Verify'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* STEP 3 */}
                                            <div className="flex flex-row justify-between w-full">
                                                <div className="w-[65%]">
                                                    <p className="text-[12px] text-gray-500">
                                                        3. Face liveliness check
                                                    </p>
                                                </div>
                                                <div className="w-[30%] text-right">
                                                    <button
                                                        disabled={
                                                            userProgress?.liveness_check_is_verified
                                                        }
                                                        onClick={
                                                            handleTakeFaceLiveliness
                                                        }
                                                        className="text-[12px]"
                                                    >
                                                        <span
                                                            className={`
                        ${
                            userProgress?.liveness_check_is_verified
                                ? 'text-green-600'
                                : 'text-tertiary underline'
                        }
                    `}
                                                        >
                                                            {userProgress?.liveness_check_is_verified
                                                                ? 'Completed'
                                                                : 'Start'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* STEP 4A */}
                                            <div className="flex flex-row justify-between w-full">
                                                <div className="w-[65%]">
                                                    <p className="text-[12px] text-gray-500">
                                                        4a. Upload ID documents
                                                    </p>
                                                </div>
                                                <div className="w-[30%] text-right">
                                                    <button
                                                        disabled={
                                                            userProgress?.id_card_is_verified ||
                                                            userProgress?.id_card_is_verified ===
                                                                null
                                                        }
                                                        onClick={() =>
                                                            router.push(
                                                                '/auth/signup/onboarding/checklist/upload-id'
                                                            )
                                                        }
                                                    >
                                                        <span
                                                            className={`
                            text-[12px]
                            ${
                                userProgress?.id_card_is_verified === null
                                    ? 'text-black'
                                    : userProgress?.id_card_is_verified
                                    ? 'text-green-600'
                                    : 'text-tertiary underline'
                            }
                        `}
                                                        >
                                                            {userProgress?.id_card_is_verified ===
                                                            null
                                                                ? 'Ongoing'
                                                                : userProgress?.id_card_is_verified
                                                                ? 'Approved'
                                                                : 'Upload'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* STEP 4B */}
                                            <div className="flex flex-row justify-between w-full">
                                                <div className="w-[65%]">
                                                    <p className="text-[12px] text-gray-500">
                                                        4b. Upload selfie
                                                        holding ID
                                                    </p>
                                                </div>
                                                <div className="w-[30%] text-right">
                                                    <button
                                                        disabled={
                                                            userProgress?.id_selfie_is_verified ||
                                                            userProgress?.id_selfie_is_verified ===
                                                                null
                                                        }
                                                        onClick={
                                                            handleUploadSelfie
                                                        }
                                                    >
                                                        <span
                                                            className={`
                            text-[12px]
                            ${
                                userProgress?.id_selfie_is_verified === null
                                    ? 'text-black'
                                    : userProgress?.id_selfie_is_verified
                                    ? 'text-green-600'
                                    : 'text-tertiary underline'
                            }
                        `}
                                                        >
                                                            {userProgress?.id_selfie_is_verified ===
                                                            null
                                                                ? 'Ongoing'
                                                                : userProgress?.id_selfie_is_verified
                                                                ? 'Approved'
                                                                : 'Upload'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* STEP 5 */}
                                            <div className="flex flex-row justify-between w-full">
                                                <div className="w-[65%]">
                                                    <p className="text-[12px] text-gray-500">
                                                        5. Add linked account
                                                    </p>
                                                </div>
                                                <div className="w-[30%] text-right">
                                                    <button
                                                        disabled={
                                                            userProgress?.payroll_is_verified
                                                        }
                                                        onClick={
                                                            handleLinkAccount
                                                        }
                                                    >
                                                        <span
                                                            className={`
                            text-[12px]
                            ${
                                userProgress?.payroll_is_verified
                                    ? 'text-green-600'
                                    : 'text-tertiary underline'
                            }
                        `}
                                                        >
                                                            {userProgress?.payroll_is_verified
                                                                ? 'Completed'
                                                                : 'Add'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* STEP 6 */}
                                            <div className="flex flex-row justify-between w-full">
                                                <div className="w-[65%]">
                                                    <p className="text-[12px] text-gray-500">
                                                        6. Profile Verified
                                                    </p>
                                                </div>
                                                <div className="w-[30%] text-right">
                                                    <button
                                                        disabled={
                                                            userProgress?.profile_is_verified
                                                        }
                                                        onClick={() =>
                                                            router.push(
                                                                '/auth/signup/onboarding/checklist/setup-profile'
                                                            )
                                                        }
                                                    >
                                                        <span
                                                            className={`
                            text-[12px]
                            ${
                                userProgress?.profile_is_verified
                                    ? 'text-green-600'
                                    : 'text-tertiary underline'
                            }
                        `}
                                                        >
                                                            {userProgress?.profile_is_verified
                                                                ? 'Approved'
                                                                : 'Submit'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Return to Login Button */}
                                        <div className="w-full flex items-center justify-center mb-3">
                                            <button
                                                onClick={() => handleLogout()}
                                                className="w-[80%] border border-tertiary text-tertiary text-[18px] font-medium py-2 rounded-lg"
                                            >
                                                Return to Login
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
            <Footer />
            <Loader />
        </div>
    )
}
