import React from 'react'
import { Metadata } from 'next'
import Feed from './Feed'

export const metadata: Metadata = {
    title: 'NipponAuto | My Feed',
    description: 'My Feed',
}

export default function page() {
    return (
        <>
            <Feed />
        </>
    )
}
