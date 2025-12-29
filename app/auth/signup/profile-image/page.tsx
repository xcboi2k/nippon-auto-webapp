import React from 'react'
import { Metadata } from 'next'
import SignUpProfileImage from './SignUpProfileImage'

export const metadata: Metadata = {
    title: 'NipponAuto | Sign Up - Profile Image',
}

export default function page() {
    return (
        <>
            <SignUpProfileImage />
        </>
    )
}
