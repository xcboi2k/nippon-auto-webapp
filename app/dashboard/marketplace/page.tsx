import React from 'react'
import { Metadata } from 'next'
import Marketplace from './Marketplace'

export const metadata: Metadata = {
    title: 'NipponAuto | Marketplace',
    description: 'Marketplace',
}

export default function page() {
    return (
        <>
            <Marketplace />
        </>
    )
}
