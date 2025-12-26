/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Form, Input } from 'antd'
import { toast } from 'react-toastify'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'

import { API_URL } from '@/constants/api'
import { colors } from '@/constants/themes'
import Footer from '@/components/Footer'
import useUserStore from '@/stores/useUserStore'
import useTimerZustand from '@/stores/timerZustand'
import useOnboardingStore from '@/stores/useOnboardingStore'

export default function MobileNumberVerification() {
    const router = useRouter()

    // timer
    const [timer, setTimer] = useState<string>('5:00')
    const [timeLeft, setTimeLeft] = useState<number>(300)
    const { remainingSeconds, startTimer, resetTimer, isTimerLoaded } =
        useTimerZustand('verify-mobile-checklist', 300)

    useEffect(() => {
        const formatTime = (seconds: number) => {
            const minutes = Math.floor(seconds / 60)
            const secs = seconds % 60
            return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
        }

        setTimer(formatTime(timeLeft))
    }, [timeLeft])

    const resetInputsAndTimer = () => {
        setOtp(['', '', '', '', '', ''])
        resetTimer()
    }

    //send otp
    const user = useUserStore((state) => state.user)
    async function sendSMS() {
        const userToken = useUserStore.getState().userToken
        try {
            const formData = new FormData()
            formData.append('phone_number', user.phone_number)
            formData.append('purpose', 'ONBOARDING')
            const response = await fetch(`${API_URL}/ekyc/sms/send-otp`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: formData,
            })
            const data = await response.json()
            const result = data.response
            console.log('send code:', result)
        } catch (error) {
            console.log(error)
        }
    }

    //call when mount
    const isChecklistMobileNumberOTPSent = useOnboardingStore(
        (state) => state.isChecklistMobileNumberOTPSent
    )
    const setIsChecklistMobileNumberOTPSentTrue = useOnboardingStore(
        (state) => state.setIsChecklistMobileNumberOTPSentTrue
    )

    const didInit = useRef(false)
    useEffect(() => {
        if (didInit.current) return
        if (isChecklistMobileNumberOTPSent) return
        if (isTimerLoaded) return

        didInit.current = true

        startTimer()
        sendSMS()
    }, [isTimerLoaded])

    useEffect(() => {
        const handlePopState = () => {
            setIsChecklistMobileNumberOTPSentTrue()
            console.log('User pressed back!')
        }

        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [verifyError, setVerifyError] = useState<string>('')
    const [verifyLoading, setVerifyLoading] = useState<boolean>(false)
    const [disable, setDisable] = useState<boolean>(false)

    // otp input
    const isInputEnabled = (index: number) => {
        // Enable the input if the previous input is filled
        return otp[index] !== '' || otp[index - 1] !== '' ? true : false
    }

    const handleInputChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const newOtp = [...otp]
        const val = e.target.value

        if (!isNaN(Number(val)) && val !== '') {
            newOtp[index] = val

            // Automatically focus on the next input field after entering a digit
            if (index < 5) {
                setTimeout(() => {
                    const nextInput = document.getElementById(
                        `otp-${index + 1}`
                    )
                    if (nextInput) {
                        nextInput.focus()
                    }
                }, 1)
            }
        } else {
            //when the user deletes the input, it will automatically focus on the previous input field
            newOtp[index] = ''
        }

        setOtp(newOtp)
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace') {
            const newOtp = [...otp]
            newOtp[index] = ''
            //focus on the previous input field when the user deletes the input
            if (index > 0) {
                setTimeout(() => {
                    const prevInput = document.getElementById(
                        `otp-${index - 1}`
                    )
                    if (prevInput) {
                        prevInput.focus()
                    }
                }, 1)
            }
            setOtp(newOtp)
        } else if (e.key === 'ArrowLeft') {
            document.getElementById(`otp-${index - 1}`)?.focus()
        } else if (e.key === 'ArrowRight') {
            e.preventDefault()
            document.getElementById(`otp-${index + 1}`)?.focus()
        } else if (e.key === 'Enter') {
            onVerify(otp)
        }
    }

    const onResend = async () => {
        resetInputsAndTimer()
        sendSMS()
    }

    // mask number
    function maskNumber(number: any) {
        const str = number.toString()
        const mainNumber = str.startsWith('+63') ? str.slice(3) : str

        // Mask all but the last 4 digits
        const masked =
            mainNumber.slice(0, -4).replace(/./g, '*') + mainNumber.slice(-4)

        return masked
    }

    // verify otp
    const resetOTPStates = useOnboardingStore((state) => state.resetOTPStates)
    const onVerify = async (data: any) => {
        setVerifyLoading(true)
        const newOtp = data.join('')
        const localStorageSessionId = localStorage.getItem('sessionId')
        const userToken = useUserStore.getState().userToken

        try {
            if (newOtp.length !== 6) {
                setVerifyError('Please enter a valid OTP.')
                return
            }

            if (timeLeft > 0) {
                const formData = new FormData()
                formData.append('code', otp.join(''))
                formData.append('phone_number', user.phone_number)
                formData.append('purpose', 'ONBOARDING')
                const response = await fetch(`${API_URL}/ekyc/sms/verify-otp`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${userToken}`,
                    },
                    body: formData,
                })
                const data = await response.json()
                console.log('verify sms code response:', data)

                if (response.ok) {
                    resetOTPStates()
                    toast.success('Mobile number verified.')
                    router.push('/auth/signup/onboarding/checklist')
                    setVerifyLoading(false)
                } else {
                    toast.error(`Invalid OTP. OTP is wrong or expired.`)
                    setVerifyLoading(false)
                }
            }
        } catch (error: any) {
            toast.error(
                'Service not available right now. Please try again later.'
            )
            setVerifyLoading(false)
        }
    }

    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative h-screen overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                <div className="bg-white rounded-xl shadow-2xl p-10 w-[90%] md:w-[50%] flex flex-col items-center justify-center">
                    <div className="w-full flex justify-between items-center mb-6">
                        <button
                            className="mb-[30px] flex items-center cursor-pointer"
                            onClick={() => {
                                setIsChecklistMobileNumberOTPSentTrue()
                                router.push('/auth/signup/onboarding/checklist')
                            }}
                        >
                            <ArrowLeft size={15} color={colors.tertiary} />
                            <h2 className="text-sm md:text-md font-semibold text-tertiary ml-[10px]">
                                Return to Checklist
                            </h2>
                        </button>
                    </div>
                    <>
                        <h2 className="text-[40px] font-bold text-tertiary text-center mb-6">
                            Verify your mobile number
                        </h2>

                        <div className="flex flex-col w-full items-center mb-[20px]">
                            <div className="text-[16px] 2sm:text-[20px] text-[#121212] mb-2 text-center">
                                We've sent a verification code to your mobile
                                number ending in{' '}
                                {maskNumber(
                                    user?.phone_number
                                        ? user?.phone_number
                                        : '1234'
                                )}
                                .<br /> Enter it below to verify your number.
                            </div>
                        </div>
                        <div className="w-full flex flex-col items-center justify-center">
                            <Form className="flex flex-col gap-5">
                                <div className="flex flex-row gap-2 mx-auto">
                                    {otp.map((value, index) => {
                                        const isFilled =
                                            !otp.includes('') &&
                                            otp.length === 6
                                        const isError = verifyError
                                        const isDisabled =
                                            !isInputEnabled(index)

                                        const baseClasses =
                                            'w-10 desktop:w-14 h-12 border-2 text-center text-lg rounded-md outline-none transition-all duration-150 bg-white'
                                        const borderColor = isError
                                            ? 'border-[#e74c3c] text-[#e74c3c]'
                                            : isFilled && !disable
                                            ? 'border-tertiary text-tertiary'
                                            : 'border-tertiary text-tertiary'

                                        return (
                                            <input
                                                key={index}
                                                id={`otp-${index}`}
                                                type="text"
                                                name={`otp-${index + 1}`}
                                                placeholder="0"
                                                maxLength={1}
                                                value={value}
                                                disabled={isDisabled}
                                                className={`${baseClasses} ${borderColor}`}
                                                onChange={(e) =>
                                                    handleInputChange(index, e)
                                                }
                                                onKeyDown={(e) =>
                                                    handleKeyDown(index, e)
                                                }
                                                inputMode="numeric"
                                                aria-label={`OTP digit ${
                                                    index + 1
                                                }`}
                                            />
                                        )
                                    })}
                                </div>
                                {verifyError && (
                                    <h6 className="w-full text-center text-h6 text-tertiary font-poppins">
                                        {verifyError}
                                    </h6>
                                )}
                                <div className="flex flex-col gap-2 items-center mx-auto desktop:p-0">
                                    <p className="text-[14px] text-[#121212]">{`Enter your code  (${Math.floor(
                                        remainingSeconds / 60
                                    )}:${(remainingSeconds % 60)
                                        .toString()
                                        .padStart(2, '0')})`}</p>

                                    {!verifyLoading ? (
                                        <>
                                            <div className="w-full mt-6 mb-2 text-center">
                                                <button
                                                    className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                                    disabled={
                                                        disable ||
                                                        otp.includes('')
                                                    }
                                                    onClick={() =>
                                                        onVerify(otp)
                                                    }
                                                >
                                                    Submit
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="w-full px-7 py-4 inline-block flex justify-center items-center gap-2 bg-tertiary rounded-lg mt-[40px]">
                                            {/* <Loader2 size={32} className="text-white animate-spin" /> */}
                                            <span className="text-white text-[16px]">
                                                Verifying...
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Form>

                            {remainingSeconds === 0 && (
                                <div className="w-full flex items-center justify-center mt-[30px] mb-[30px]">
                                    <div className="text-[16px] text-black mr-[5px]">
                                        Didn&apos;t receive a code?
                                    </div>
                                    <button
                                        className="text-lg cursor-pointer"
                                        onClick={() => {
                                            if (remainingSeconds === 0) {
                                                resetTimer()
                                                onResend() // This resets and restarts the timer
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
                        </div>
                    </>
                </div>
            </section>
            <Footer />
        </div>
    )
}
