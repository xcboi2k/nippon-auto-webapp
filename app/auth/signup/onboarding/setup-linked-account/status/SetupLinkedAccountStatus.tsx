'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'

import Footer from '@/components/Footer'
import useUserStore from '@/stores/useUserStore'
import useOnboardingStore from '@/stores/useOnboardingStore'

export default function SetupLinkedAccountStatus() {
    const router = useRouter()

    const searchParams = useSearchParams()
    const mode = searchParams.get('mode')

    // importing required states
    const setIsUserInStep7 = useOnboardingStore(
        (state) => state.setIsUserInStep7
    )
    const setIsStep6CompletedTrue = useOnboardingStore(
        (state) => state.setIsStep6CompletedTrue
    )
    // continue
    const handleContinue = () => {
        setIsStep6CompletedTrue()
        setIsUserInStep7()
        router.push('/auth/signup/onboarding/setup-profile')
    }
    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative h-screen overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                {/* Sign Up Overlay */}
                <div className="bg-white rounded-xl shadow-2xl p-10 w-[90%] md:w-[50%] flex flex-col items-center justify-center">
                    {mode === 'success' ? (
                        <>
                            <h2 className="text-[40px] font-bold text-tertiary text-center mb-6">
                                Congratulations!
                            </h2>
                            <div className="flex flex-col w-full items-center mb-[20px]">
                                <div className="text-[16px] 2sm:text-[20px] text-[#121212] mb-2 text-center">
                                    You have linked an account. The account can
                                    be used in transactions inside 4Vale.
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-[40px] font-bold text-tertiary text-center mb-6">
                                Sorry
                            </h2>
                            <div className="flex flex-col w-full items-center mb-[20px]">
                                <div className="text-[16px] 2sm:text-[20px] text-[#121212] mb-2 text-center">
                                    We regret to inform you that the account
                                    linking process was unsuccessful. Please
                                    review the provided information and try
                                    again.
                                </div>
                            </div>
                        </>
                    )}
                    <div className="w-full mt-6 mb-2 text-center">
                        <button
                            className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                            onClick={handleContinue}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}
