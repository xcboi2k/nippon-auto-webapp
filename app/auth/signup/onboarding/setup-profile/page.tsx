import React from 'react'
import { Metadata } from 'next'
import SetupProfile from './SetupProfile'

export const metadata: Metadata = {
    title: 'TrueMoney powered by Vashcorp | Onboarding Setup Profile',
}

export default function page() {
    return (
        <>
            <SetupProfile />
        </>
    )
}
