'use client'

import LandingPageNavbar from '@/components/landing-page/LandingPageNavbar'
import HeroSection from '@/components/landing-page/HeroSection'
import FeaturesSection from '@/components/landing-page/FeaturesSection'
import MarketplaceSection from '@/components/landing-page/MarketplaceSection'
import SocialSection from '@/components/landing-page/SocialSection'
import CTASection from '@/components/landing-page/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
    return (
        <div className="relative w-full h-full bg-primary">
            <LandingPageNavbar />
            <HeroSection />
            <FeaturesSection />
            <MarketplaceSection />
            <SocialSection />
            <CTASection />
            <Footer />
        </div>
    )
}
