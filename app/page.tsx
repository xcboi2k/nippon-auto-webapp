'use client'

import LandingPageNavbar from '@/components/landing-page/LandingPageNavbar'
import HeroSection from '@/components/landing-page/HeroSection'
import Footer from '@/components/Footer'

export default function Home() {
    return (
        <div className="relative w-full h-full bg-primary">
            <LandingPageNavbar />
            <HeroSection />
            <Footer />
        </div>
    )
}
