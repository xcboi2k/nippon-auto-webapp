import React from 'react'
import { Metadata } from 'next'
import UploadID from './UploadID'

export const metadata: Metadata = {
    title: 'TrueMoney powered by Vashcorp | Onboarding Upload ID',
}

export default function page() {
    return (
        <>
            <UploadID />
        </>
    )
}
