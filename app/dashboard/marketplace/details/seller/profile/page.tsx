import React from 'react'
import { Metadata } from 'next'
import SellerProfile from './SellerProfile'

export const metadata: Metadata = {
    title: 'NipponAuto | Marketplace - Seller Profile',
    description: 'Seller Profile',
}

export default function page() {
    return (
        <>
            <SellerProfile />
        </>
    )
}
