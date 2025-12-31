import React from 'react'
import { Metadata } from 'next'
import CreateListing from './CreateListing'

export const metadata: Metadata = {
    title: 'NipponAuto | Marketplace  - Create Listing',
    description: 'Create Listing',
}

export default function page() {
    return (
        <>
            <CreateListing />
        </>
    )
}
