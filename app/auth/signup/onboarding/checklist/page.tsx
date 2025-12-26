import React from 'react'
import { Metadata } from 'next'
import Checklist from './Checklist'

export const metadata: Metadata = {
    title: '4Vale | Onboarding Checklist',
}

export default function page() {
    return (
        <>
            <Checklist />
        </>
    )
}
