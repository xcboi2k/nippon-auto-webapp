import React from 'react'
import { Metadata } from 'next'
import UpdateProfileImage from './UpdateProfileImage'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Profile - Update Profile Image',
    description: 'Account Profile Update Image',
}

export default function page() {
    return (
        <>
            <UpdateProfileImage />
        </>
    )
}
