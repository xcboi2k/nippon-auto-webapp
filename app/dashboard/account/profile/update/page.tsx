import React from 'react'
import { Metadata } from 'next'
import UpdateProfile from './UpdateProfile'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Profile - Update',
    description: 'Account Profile Update',
}

export default function page() {
    return (
        <>
            <UpdateProfile />
        </>
    )
}
