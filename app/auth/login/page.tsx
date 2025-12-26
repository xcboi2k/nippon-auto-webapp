import React from 'react'
import { Metadata } from 'next'
import Login from './login'

export const metadata: Metadata = {
    title: 'NipponAuto | Login',
}

export default function page() {
    return (
        <>
            <Login />
        </>
    )
}
