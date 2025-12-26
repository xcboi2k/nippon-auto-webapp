import React from 'react'
import { Metadata } from 'next'
import SetupLinkedAccountStatus from './SetupLinkedAccountStatus'

export const metadata: Metadata = {
    title: 'TrueMoney powered by Vashcorp | Onboarding Checklist Setup Linked Account Status',
}

export default function page() {
    return (
        <>
            <SetupLinkedAccountStatus />
        </>
    )
}
