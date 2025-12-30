import React from 'react'
import { Metadata } from 'next'
import Profile from './Profile'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Profile',
    description: 'Account Posts',
}

export default function page() {
    return (
        <>
            <Profile />
        </>
    )
}
