import React from 'react'
import { Metadata } from 'next'
import PrivacyPolicy from './PrivacyPolicy'

export const metadata: Metadata = {
    title: 'TrueMoney powered by Vashcorp | Privacy Policy',
}

export default function page() {
    return (
        <>
            <PrivacyPolicy />
        </>
    )
}
