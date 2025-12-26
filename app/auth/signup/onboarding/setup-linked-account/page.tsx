import React from 'react'
import { Metadata } from 'next'
import SetupLinkedAccount from './SetupLinkedAccount'

export const metadata: Metadata = {
    title: 'TrueMoney powered by Vashcorp | Onboarding Setup Linked Account',
}

export default function page() {
    return (
        <>
            <SetupLinkedAccount />
        </>
    )
}
