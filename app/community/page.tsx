import React from 'react'
import { Metadata } from 'next'
import Community from './Community'
import LandingPageNavbar from '@/components/landing-page/LandingPageNavbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'NipponAuto | Community',
    description: 'Community',
}

export default function page() {
    return (
        <>
            <LandingPageNavbar />
            <Community />
            <Footer />
        </>
    )
}
