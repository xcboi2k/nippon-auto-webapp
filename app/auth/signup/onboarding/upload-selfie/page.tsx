import React from 'react'
import { Metadata } from 'next'
import UploadSelfie from './UploadSelfie'

export const metadata: Metadata = {
    title: 'TrueMoney powered by Vashcorp | Onboarding Upload Selfie',
}

export default function page() {
    return (
        <>
            <UploadSelfie />
        </>
    )
}
