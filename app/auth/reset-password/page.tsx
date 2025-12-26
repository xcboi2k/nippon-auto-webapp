import React from 'react'
import { Metadata } from 'next'
import ResetPassword from './ResetPassword'

export const metadata: Metadata = {
    title: 'NipponAuto | Reset Password',
}

export default function page() {
    return (
        <>
            <ResetPassword />
        </>
    )
}
