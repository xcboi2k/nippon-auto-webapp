import React from 'react'
import { Metadata } from 'next'
import UpdateReview from './UpdateReview'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Reviews - Update',
    description: 'Update Review',
}

export default function page() {
    return (
        <>
            <UpdateReview />
        </>
    )
}
