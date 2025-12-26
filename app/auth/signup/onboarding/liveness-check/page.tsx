import React from 'react'
import { Metadata } from 'next'
import LivenessCheck from './LivenessCheck'

export const metadata: Metadata = {
    title: 'TrueMoney powered by Vashcorp | Onboarding Liveness Check',
}

export default function page() {
    return (
        <>
            <LivenessCheck />
        </>
    )
}
