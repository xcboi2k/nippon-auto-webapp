/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { FaRegCircleCheck } from 'react-icons/fa6'
import { AiOutlineLoading } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { useRouter } from 'nextjs-toploader/app'

import { API_URL } from '@/constants/api'
import Footer from '@/components/Footer'
import OnboardingStepper from '@/components/OnboardingStepper'
import TextInput from '@/components/TextInput'
import Loader from '@/components/Loader'
import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'
import useOnboardingStore from '@/stores/useOnboardingStore'
import useTimerZustand from '@/stores/timerZustand'

interface FormData {
    code: string
}

export default function EmailVerification() {
    const router = useRouter()

    const { showLoader, hideLoader } = useLoaderStore()

    const user = useUserStore((state) => state.user)

    // timer
    const [timer, setTimer] = useState<string>('5:00')
    const [timeLeft, setTimeLeft] = useState<number>(300)
    const { remainingSeconds, startTimer, resetTimer, isTimerLoaded } =
        useTimerZustand('verify-email-onboarding', 300)

    useEffect(() => {
        const formatTime = (seconds: number) => {
            const minutes = Math.floor(seconds / 60)
            const secs = seconds % 60
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
        }

        setTimer(formatTime(timeLeft))
    }, [timeLeft])

    // for checking progress
    const [loading, setLoading] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const checkEmailVerifiedProgress = async () => {
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
                const isVerified = !!data?.is_email_verified
                setEmailVerified(isVerified)
                setLoading(false)
                return isVerified // ✅ return the status
            } else {
                setLoading(false)
                return
            }
        } catch (error) {
            console.error('Error fetching progress:', error)
            setLoading(false)
            return
        }
    }

    const sendCode = async () => {
        const userToken = useUserStore.getState().userToken

        try {
            const formData = new FormData()
            formData.append('email', user.email)
            formData.append('purpose', 'ONBOARDING')
            const response = await fetch(`${API_URL}/ekyc/email/send-otp`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: formData,
            })
            // const data = await response.json()
            // console.log('send email status:',data)
            if (response.ok) {
                // set({ isEmailVerified: false, user: data })
                //setting state of user feedback stores to initialize user feedback components
                console.log('code sent to email')
                // showAlert('Success', 'Code is sent to email.')
            } else {
                console.log('failed to send code to email')
            }
        } catch (error) {
            console.log(error)
        }
    }

    //call when mount
    const isEmailOTPSent = useOnboardingStore((state) => state.isEmailOTPSent)
    const setIsEmailOTPSentTrue = useOnboardingStore(
        (state) => state.setIsEmailOTPSentTrue
    )

    const didVerify = useRef(false)
    useEffect(() => {
        if (didVerify.current) return

        const verify = async () => {
            const verified = await checkEmailVerifiedProgress()

            if (verified) return
            if (isEmailOTPSent) return
            if (isTimerLoaded) return

            didVerify.current = true

            startTimer()
            sendCode()
        }

        verify()
    }, [isTimerLoaded])

    useEffect(() => {
        const handlePopState = () => {
            setIsEmailOTPSentTrue()
            console.log('User pressed back!')
        }

        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    const initialValues: FormData = {
        code: '',
    }

    const setIsStep2CompletedTrue = useOnboardingStore(
        (state) => state.setIsStep2CompletedTrue
    )
    const setIsUserInStep3 = useOnboardingStore(
        (state) => state.setIsUserInStep3
    )
    const handleSubmit = async (
        values: typeof initialValues,
        {
            resetForm,
        }: { resetForm: (nextState?: { values?: FormData }) => void }
    ) => {
        const userToken = useUserStore.getState().userToken
        console.log('signup verify email values:', values)
        setIsEmailOTPSentTrue()
        showLoader()
        try {
            const formData = new FormData()
            formData.append('code', values.code)
            formData.append('email', user.email)
            formData.append('purpose', 'ONBOARDING')
            const response = await fetch(`${API_URL}/ekyc/email/verify-otp`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: formData,
            })
            const data = await response.json()
            console.log(data)
            hideLoader()
            if (response.ok) {
                toast.success('Email Verified!')
                setIsStep2CompletedTrue()
                setIsUserInStep3()
                router.push('/auth/signup/onboarding/liveness-check')
            } else {
                toast.error(`Invalid code. Code is wrong or expired.`)
            }
        } catch (error) {
            console.log(error)
            toast.error(
                'Service not available right now. Please try again later.'
            )
            hideLoader()
        }
    }

    const validationSchema = Yup.object().shape({
        code: Yup.string().required('Code is required'),
    })

    function formatEmail(email: string) {
        const [localPart, domainPart] = email.split('@')

        const firstTwo = localPart.slice(0, 2)
        const hiddenLocalPart = '*'.repeat(localPart.length - 2)
        const firstAfterAt = domainPart.charAt(0)
        const hiddenDomain = '*'.repeat(domainPart.length - 1)
        return `${firstTwo}${hiddenLocalPart}@${firstAfterAt}${hiddenDomain}`
    }

    //back
    const setIsUserInStep1 = useOnboardingStore(
        (state) => state.setIsUserInStep1
    )
    const handleBack = () => {
        // set then navigate
        setIsEmailOTPSentTrue()
        setIsUserInStep1()
        router.push('/auth/signup/onboarding/mobile-number-verification')
    }
    // skip
    const isStep2Completed = useOnboardingStore(
        (state) => state.isStep2Completed
    )
    const setIsStep2CompletedFalse = useOnboardingStore(
        (state) => state.setIsStep2CompletedFalse
    )
    const handleSkip = () => {
        setIsEmailOTPSentTrue()
        if (isStep2Completed !== 'completed' && !emailVerified) {
            setIsStep2CompletedFalse()
        }
        if (emailVerified) {
            setIsStep2CompletedTrue()
        }
        setIsUserInStep3()
        router.push('/auth/signup/onboarding/liveness-check')
    }
    //proceed
    const handleProceed = () => {
        setIsUserInStep3()
        setIsStep2CompletedTrue()
        router.push('/auth/signup/onboarding/liveness-check')
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
                            stepNumber={'2'}
                            stepTitle={'Email Verification'}
                            onPressBack={handleBack}
                            onPressSkip={handleSkip}
                            isStepCompleted={emailVerified}
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
                            {emailVerified ? (
                                <>
                                    <div className="w-full px-5 md:px-[50px] lg:px-[70px] mb-[50px]">
                                        <div className="flex items-center justify-center mt-[20px]">
                                            <FaRegCircleCheck className="text-green-500 text-[100px]" />
                                        </div>
                                    </div>
                                    <h2 className="text-[40px] font-bold text-tertiary mb-6">
                                        Email Verified
                                    </h2>
                                    <div className="flex flex-col w-full items-center mb-[20px]">
                                        <div className="text-[16px] 2sm:text-[20px] text-[#121212] mb-2 text-center">
                                            Your email was successfully
                                            verified.
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
                            ) : (
                                <>
                                    <h2 className="text-[50px] font-semibold mt-[30px] mb-[20px] text-tertiary">
                                        Verify your email address
                                    </h2>
                                    <div className="flex flex-col w-full items-center mb-[20px]">
                                        <div className="text-[16px] 2sm:text-[20px] text-[#121212] mb-2 text-center">
                                            We've sent a verification code to{' '}
                                            {formatEmail(
                                                user?.email
                                                    ? user?.email
                                                    : 'test@email.com'
                                            )}
                                            .<br />
                                            Enter it below to verify your email
                                            address.
                                        </div>
                                    </div>
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
                                        }) => (
                                            <Form className="w-full max-w-md">
                                                <TextInput
                                                    placeholderText="Enter code"
                                                    id="code"
                                                    name="code"
                                                    value={values.code}
                                                    onChangeInput={handleChange}
                                                    errorMessage={
                                                        touched.code &&
                                                        errors.code
                                                            ? errors.code
                                                            : undefined
                                                    }
                                                />
                                                <div className="w-full flex items-center justify-center mb-[15px]">
                                                    <p className="text-[14px] text-[#121212]">{`Enter your code  (${Math.floor(
                                                        remainingSeconds / 60
                                                    )}:${(remainingSeconds % 60)
                                                        .toString()
                                                        .padStart(
                                                            2,
                                                            '0'
                                                        )})`}</p>
                                                </div>
                                                <div className="w-full flex items-center justify-center mt-[30px] mb-[30px]">
                                                    <button
                                                        className="w-[50%] bg-tertiary text-white px-6 py-3 text-lg rounded-lg shadow-lg cursor-pointer"
                                                        type="submit"
                                                    >
                                                        <div className="text-[16px] text-white text-center">
                                                            Submit
                                                        </div>
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                    {remainingSeconds === 0 && (
                                        <div className="w-full flex items-center justify-center mt-[30px] mb-[30px]">
                                            <div className="text-[16px] text-black mr-[5px]">
                                                Didn&apos;t receive a code?
                                            </div>
                                            <button
                                                className="text-lg cursor-pointer"
                                                onClick={() => {
                                                    if (
                                                        remainingSeconds === 0
                                                    ) {
                                                        resetTimer()
                                                        sendCode() // This resets and restarts the timer
                                                    }
                                                }}
                                                disabled={remainingSeconds > 0} // prevent clicking while countdown is running
                                            >
                                                <div className="text-[16px] text-tertiary">
                                                    Resend Code
                                                </div>
                                            </button>
                                        </div>
                                    )}
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
