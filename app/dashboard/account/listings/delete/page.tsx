import React from 'react'
import { Metadata } from 'next'
import DeleteListing from './DeleteListing'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Listings - Delete',
    description: 'Delete Listing',
}

export default function page() {
    return (
        <>
            <DeleteListing />
        </>
    )
}
