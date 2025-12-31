import React from 'react'
import { Metadata } from 'next'
import DeleteReview from './DeleteReview'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Reviews - Delete',
    description: 'Delete Review',
}

export default function page() {
    return (
        <>
            <DeleteReview />
        </>
    )
}
