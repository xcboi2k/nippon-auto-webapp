import React from 'react'
import { Metadata } from 'next'
import Marketplace from './Marketplace'
import LandingPageNavbar from '@/components/landing-page/LandingPageNavbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
    title: 'NipponAuto | Marketplace',
    description: 'Marketplace',
}

export default function page() {
    return (
        <>
            <LandingPageNavbar />
            <Marketplace />
            <Footer />
        </>
    )
}
