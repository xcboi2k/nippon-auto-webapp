import React from 'react'
import { Metadata } from 'next'
import SignUpAdditionalDetails from './SignUpAdditionalDetails'

export const metadata: Metadata = {
    title: 'NipponAuto | Sign Up - Profile',
}

export default function page() {
    return (
        <>
            <SignUpAdditionalDetails />
        </>
    )
}
