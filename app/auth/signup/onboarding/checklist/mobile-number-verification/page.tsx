import React from 'react'
import { Metadata } from 'next'
import MobileNumberVerification from './MobileNumberVerification'

export const metadata: Metadata = {
    title: 'TrueMoney powered by Vashcorp | Onboarding Checklist Mobile Number Verification',
}

export default function page() {
    return (
        <>
            <MobileNumberVerification />
        </>
    )
}
