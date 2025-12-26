'use client'

import React, { useEffect } from 'react'

import { API_URL } from '@/constants/api'
import useUserStore from '@/stores/useUserStore'

export default function RefreshTokenProvider({
    children,
}: {
    children: React.ReactNode
}) {
    // const user = useUserStore((state) => state.user)
    // const setUserToken = useUserStore((state) => state.setUserToken)
    // const isLoggedIn = useUserStore((state) => state.isLoggedIn)

    // const refreshToken = useUserStore((state) => state.refreshToken)

    // const refreshAccessToken = async () => {
    //     console.log('updating token...')
    //     if (!refreshToken || !isLoggedIn) return

    //     const userToken = useUserStore.getState().userToken
    //     try {
    //         const res = await fetch(`${API_URL}/auth/jwt/refresh/`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 Authorization: `Bearer ${userToken}`,
    //             },
    //             body: JSON.stringify({
    //                 refresh: refreshToken,
    //             }),
    //         })

    //         if (!res.ok) {
    //             // refresh expired → logout user
    //             return
    //         }

    //         const data = await res.json()
    //         setUserToken(data.access)

    //         await fetch('/api/set-cookie', {
    //             method: 'POST',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify({ token: data.access }),
    //         })
    //     } catch (err) {
    //         console.log('Refresh error:', err)
    //     }
    // }

    // useEffect(() => {
    //     console.log('RefreshProvider mounted', { isLoggedIn, refreshToken })
    //     if (!refreshToken || !isLoggedIn) return

    //     // Call once immediately when logged in
    //     refreshAccessToken()

    //     // Then call every 5 minutes
    //     const interval = setInterval(() => {
    //         refreshAccessToken()
    //     }, 30000) // 5 minutes 300000

    //     return () => clearInterval(interval)
    // }, [isLoggedIn])

    return <>{children}</>
}
