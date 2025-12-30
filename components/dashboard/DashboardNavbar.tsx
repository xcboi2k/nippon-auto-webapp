'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'nextjs-toploader/app'
import Link from 'next/link'
import {
    FaUser,
    FaLock,
    FaListAlt,
    FaFileAlt,
    FaCreditCard,
    FaSignOutAlt,
    FaBook,
    FaShieldAlt,
    FaBell,
    FaUserCircle,
    FaHome,
    FaReceipt,
    FaQuestionCircle,
    FaCog,
    FaStar,
} from 'react-icons/fa'
import { MdFeed } from 'react-icons/md'
import { AiOutlineLoading } from 'react-icons/ai'
import { toast } from 'react-toastify'

import { logos } from '@/constants/themes'
import useUserStore from '@/stores/useUserStore'

interface DashboardNavbarProps {
    isStatusBarVisible: boolean
    offset?: number
    startLoading?: () => void
    stopLoading?: () => void
}

export default function DashboardNavbar({
    isStatusBarVisible,
    offset,
    startLoading,
    stopLoading,
}: DashboardNavbarProps) {
    const router = useRouter()

    const user = useUserStore((state) => state.user)
    // console.log('current user:', user)
    const [loaded, setLoaded] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const menuItems = [
        {
            label: 'Home',
            icon: <FaHome />,
            path: '/dashboard',
        },
        {
            label: 'My Profile',
            icon: <FaUser />,
            path: '/dashboard/account/profile',
        },
        {
            label: 'My Posts',
            icon: <FaListAlt />,
            path: '/dashboard/account/posts',
        },
        {
            label: 'My Listings',
            icon: <FaReceipt />,
            path: '/dashboard/account/listings',
        },
        {
            label: 'My Reviews',
            icon: <FaStar />,
            path: '/dashboard/account/reviews',
        },
        // {
        //     label: 'Notifications',
        //     icon: <FaBell />,
        //     path: '/dashboard/account/notifications',
        // },
        // {
        //     label: 'FAQs',
        //     icon: <FaQuestionCircle />,
        //     path: '/dashboard/account/faqs',
        // },
        {
            label: 'Change Password',
            icon: <FaLock />,
            path: '/dashboard/account/password',
        },
        // {
        //     label: 'Authentication Settings',
        //     icon: <FaCog />,
        //     path: '/dashboard/account/authentication-settings',
        // },
    ]

    // const policyLinks = [
    //     {
    //         label: 'Terms & Conditions',
    //         icon: <FaBook />,
    //         path: '/terms-conditions?from=dashboard',
    //     },
    //     {
    //         label: 'Privacy Policy',
    //         icon: <FaShieldAlt />,
    //         path: '/privacy-policy?from=dashboard',
    //     },
    // ]

    const setLoggedOut = useUserStore((state) => state.setLoggedOut)
    const clearUser = useUserStore((state) => state.clearUser)
    const clearUserToken = useUserStore((state) => state.clearUserToken)
    const handleLogout = () => {
        console.log('Logging out...')
        startLoading?.()
        toggleSidebar()
        setLoggedOut()
        clearUser()
        clearUserToken()
        setTimeout(() => {
            stopLoading?.()
            toast.success('Logged out successfully.')
            router.push('/')
        }, 2000)
    }

    return (
        <>
            <nav
                className={`w-full bg-primary fixed ${
                    isStatusBarVisible ? `top-[${offset}px]` : 'top-0'
                } left-0 z-30 h-16 border-b-[2px] border-tertiary p-[70px]`}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-full">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => router.push('/dashboard')}>
                            <Image
                                src={logos.webAppLogo}
                                alt="Logo"
                                width={100}
                                height={40}
                                className="w-[100px] h-auto mr-[50px]"
                            />
                        </button>

                        {/* Show only on medium screens and up */}
                        {/* <div className="hidden laptop:flex space-x-6 font-medium text-white">
                            <Link href="/dashboard">Dashboard</Link>
                            <Link href="/dashboard/transactions">Loans</Link>
                        </div>

                        <div className="flex laptop:hidden">
                            <MobileNavButton />
                        </div> */}
                    </div>

                    <div className="flex laptop:hidden space-x-4 font-medium text-white items-center justify-center">
                        <button
                            className="w-12 h-12 rounded-full overflow-hidden bg-tertiary flex items-center justify-center"
                            onClick={toggleSidebar}
                        >
                            <FaUserCircle className="text-white text-3xl" />
                        </button>
                    </div>
                    <div className="hidden laptop:flex items-center space-x-4 text-primary font-bold">
                        <button
                            onClick={toggleSidebar}
                            className="flex items-center bg-tertiary px-4 py-2 rounded-md"
                        >
                            Hi,{' '}
                            {user?.first_name !== ''
                                ? user?.first_name
                                : 'User'}
                            !
                        </button>
                    </div>
                </div>
            </nav>

            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform ${
                    isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
                } transition-transform duration-300 ease-in-out`}
            >
                {/* Header */}
                <div className="bg-tertiary p-6 flex flex-col items-center text-center border-b">
                    {user?.profile_photo ? (
                        <Image
                            src={user?.profile_photo}
                            alt="User"
                            width={70}
                            height={70}
                            className="rounded-full mb-3 object-cover border-primary"
                        />
                    ) : (
                        <div
                            className="w-12 h-12 rounded-full overflow-hidden bg-tertiary flex items-center justify-center"
                            onClick={toggleSidebar}
                        >
                            <FaUserCircle className="text-white text-4xl" />
                        </div>
                    )}

                    <h3 className="text-white text-lg font-bold">
                        {user
                            ? `${user?.first_name} ${user?.last_name}`
                            : 'User'}
                    </h3>
                    <p className="text-sm text-white">{user?.email}</p>
                    <p className="text-sm text-white">{user?.mobile_number}</p>
                </div>

                {/* Menu */}
                <div className="flex flex-col py-4">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                router.push(item.path)
                                setIsSidebarOpen(false)
                            }}
                            className="flex items-center gap-4 px-6 py-3 text-black hover:bg-gray-100 transition-all"
                        >
                            <span className="text-lg text-tertiary">
                                {item.icon}
                            </span>
                            <span className="text-[15px]">{item.label}</span>
                        </button>
                    ))}

                    {/* <hr className="my-4 border-tertiary" />

                    {policyLinks.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                router.push(item.path)
                                setIsSidebarOpen(false)
                            }}
                            className="flex items-center gap-4 px-6 py-3 text-primary hover:bg-gray-100 transition-all"
                        >
                            <span className="text-lg text-primary">
                                {item.icon}
                            </span>
                            <span className="text-[15px] font-medium text-primary">
                                {item.label}
                            </span>
                        </button>
                    ))}

                    <hr className="my-4 border-tertiary" /> */}

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 px-6 py-3 text-black hover:bg-gray-100 transition-all"
                    >
                        <FaSignOutAlt className="text-lg text-tertiary" />
                        <span className="text-[15px]">Log Out</span>
                    </button>
                </div>
            </div>

            {/* Overlay */}
            {isSidebarOpen ? (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-30"
                    onClick={toggleSidebar}
                />
            ) : null}

            {/* Padding for page content */}
            <div className="pt-[80px]" />
        </>
    )
}
