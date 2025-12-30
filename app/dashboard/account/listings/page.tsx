import React from 'react'
import { Metadata } from 'next'
import MyListings from './MyListings'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Listings',
    description: 'Account Listings',
}

export default function page() {
    return (
        <>
            <MyListings />
        </>
    )
}
