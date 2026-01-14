/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'
import { AiOutlineLoading } from 'react-icons/ai'

import { API_URL } from '@/constants/api'
import { colors } from '@/constants/themes'
import LandingPageNavbar from '@/components/landing-page/LandingPageNavbar'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import Loader from '@/components/Loader'
import Footer from '@/components/Footer'
import useUserStore from '@/stores/useUserStore'
import useLoaderStore from '@/stores/useLoaderStore'

export default function TermsConditions() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const from = searchParams.get('from')

    const [loading, setLoading] = useState(false)
    const [viewHeader, setViewHeader] = useState(true)
    const [htmlContent, setHtmlContent] = useState(`
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.</p>
    `)

    const { showLoader, hideLoader } = useLoaderStore()

    const user = useUserStore((state) => state.user)

    return (
        <div className="relative w-full h-full bg-primary">
            {from === 'dashboard' ? (
                <DashboardNavbar
                    startLoading={showLoader}
                    stopLoading={hideLoader}
                    isStatusBarVisible={false}
                />
            ) : (
                <LandingPageNavbar />
            )}
            <section
                id="hero"
                className="w-full bg-primary flex flex-col items-center justify-center px-10 mt-[60px]"
            >
                <div className="bg-white rounded-xl shadow-2xl p-10 w-full overflow-y-auto my-[30px]">
                    <div className="w-full flex items-center gap-2 mb-6 relative z-20">
                        <button
                            className="flex items-center cursor-pointer"
                            onClick={() => {
                                if (from === 'dashboard') {
                                    router.push('/dashboard/feed')
                                } else {
                                    router.push('/')
                                }
                            }}
                        >
                            <ArrowLeft size={15} color={colors.tertiary} />
                            <span className="text-sm md:text-md font-semibold text-tertiary ml-2">
                                Go back
                            </span>
                        </button>
                    </div>

                    <div className="w-full flex flex-col">
                        {loading ? (
                            <div className="w-full px-5 md:px-[50px] lg:px-[70px] mb-[50px]">
                                <div className="flex items-center justify-center mt-[20px]">
                                    <AiOutlineLoading className="text-tertiary animate-spin text-[100px]" />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full px-5 md:px-[50px] lg:px-[70px] mb-[50px]">
                                <div
                                    className="p-5 text-black"
                                    dangerouslySetInnerHTML={{
                                        __html: htmlContent,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <Loader />
            <Footer />
        </div>
    )
}
