import React from 'react'
import { Metadata } from 'next'
import UpdateListing from './UpdateListing'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Listings - Update',
    description: 'Update Listing',
}

export default function page() {
    return (
        <>
            <UpdateListing />
        </>
    )
}
