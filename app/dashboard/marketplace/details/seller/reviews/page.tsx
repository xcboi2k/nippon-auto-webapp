import React from 'react'
import { Metadata } from 'next'
import SellerReviews from './SellerReviews'

export const metadata: Metadata = {
    title: 'NipponAuto | Marketplace - Seller Reviews',
    description: 'Seller Reviews',
}

export default function page() {
    return (
        <>
            <SellerReviews />
        </>
    )
}
