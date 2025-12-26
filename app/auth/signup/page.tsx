import React from 'react'
import { Metadata } from 'next'
import SignUp from './signup'

export const metadata: Metadata = {
    title: 'NipponAuto | Sign Up',
}

export default function page() {
    return (
        <>
            <SignUp />
        </>
    )
}
