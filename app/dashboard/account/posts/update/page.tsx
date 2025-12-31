import React from 'react'
import { Metadata } from 'next'
import UpdatePost from './UpdatePost'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Posts - Update',
    description: 'Update Post',
}

export default function page() {
    return (
        <>
            <UpdatePost />
        </>
    )
}
