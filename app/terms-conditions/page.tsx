import React from 'react'
import { Metadata } from 'next'
import TermsConditions from './TermsConditions'

export const metadata: Metadata = {
    title: 'TrueMoney powered by Vashcorp | Terms and Conditions',
}

export default function page() {
    return (
        <>
            <TermsConditions />
        </>
    )
}
