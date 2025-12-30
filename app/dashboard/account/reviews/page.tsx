import React from 'react'
import { Metadata } from 'next'
import Reviews from './Reviews'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Reviews',
    description: 'Account Reviews',
}

export default function page() {
    return (
        <>
            <Reviews />
        </>
    )
}
