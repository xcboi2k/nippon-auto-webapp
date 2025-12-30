import React from 'react'
import { Metadata } from 'next'
import MyPosts from './MyPosts'

export const metadata: Metadata = {
    title: 'NipponAuto | Account Posts',
    description: 'Account Posts',
}

export default function page() {
    return (
        <>
            <MyPosts />
        </>
    )
}
