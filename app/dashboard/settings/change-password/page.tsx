import React from 'react'
import { Metadata } from 'next'
import ChangePassword from './ChangePassword'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Settings - Change Password',
    description: 'Change Password',
}

export default function page() {
    return (
        <>
            <ChangePassword />
        </>
    )
}
