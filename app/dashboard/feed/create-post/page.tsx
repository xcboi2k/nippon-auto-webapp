import React from 'react'
import { Metadata } from 'next'
import CreatePost from './CreatePost'

export const metadata: Metadata = {
    title: 'NipponAuto | My Feed - Create Post',
    description: 'Create Post',
}

export default function page() {
    return (
        <>
            <CreatePost />
        </>
    )
}
