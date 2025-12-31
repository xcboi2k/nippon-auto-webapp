import React from 'react'
import { Metadata } from 'next'
import DeletePost from './DeletePost'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Posts - Delete',
    description: 'Delete Post',
}

export default function page() {
    return (
        <>
            <DeletePost />
        </>
    )
}
