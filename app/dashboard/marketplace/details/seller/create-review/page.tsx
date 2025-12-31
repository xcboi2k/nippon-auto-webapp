import React from 'react'
import { Metadata } from 'next'
import CreateReview from './CreateReview'

export const metadata: Metadata = {
    title: 'NipponAuto | Marketplace - Create Review',
    description: 'Create Review',
}

export default function page() {
    return (
        <>
            <CreateReview />
        </>
    )
}
