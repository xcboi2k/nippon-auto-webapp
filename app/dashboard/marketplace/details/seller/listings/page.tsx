import React from 'react'
import { Metadata } from 'next'
import SellerListings from './SellerListings'

export const metadata: Metadata = {
    title: 'NipponAuto | Marketplace - Seller Listings',
    description: 'Seller Listings',
}

export default function page() {
    return (
        <>
            <SellerListings />
        </>
    )
}
