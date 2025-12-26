import React from 'react'
import { Metadata } from 'next'
import Verification from './Verification'

export const metadata: Metadata = {
    title: 'NipponAuto | Reset Password Verification',
}

export default function page() {
    return (
        <>
            <Verification />
        </>
    )
}
