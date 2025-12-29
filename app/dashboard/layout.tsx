/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'

import { API_URL, WEBSOCKET_API_URL } from '@/constants/api'
import DashboardNavbar from '@/components/dashboard/DashboardNavbar'
import Loader from '@/components/Loader'

import useUserStore from '@/stores/useUserStore'
import useLoaderStore from '@/stores/useLoaderStore'
import Footer from '@/components/Footer'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { showLoader, hideLoader } = useLoaderStore()

    return (
        <div
            className="min-h-screen bg-gray-50 transition-all duration-300"
            // style={{ paddingTop: totalOffset }}
        >
            <DashboardNavbar
                startLoading={showLoader}
                stopLoading={hideLoader}
                isStatusBarVisible={false}
                offset={0}
            />

            {/* Page content */}
            <div className="mt-[60px]">{children}</div>

            <Footer />

            <Loader />
        </div>
    )
}
