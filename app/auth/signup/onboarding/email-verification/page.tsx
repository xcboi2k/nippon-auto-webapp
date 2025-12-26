import React from 'react'
import { Metadata } from 'next'
import EmailVerification from './EmailVerification'

export const metadata: Metadata = {
    title: 'TrueMoney powered by Vashcorp | Onboarding Email Verification',
}

export default function page() {
    return (
        <>
            <EmailVerification />
        </>
    )
}
