'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'

export default function MobileNavButton() {
    const router = useRouter()

    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open])

    const handleNavigate = (path: string) => {
        setOpen(false)
        router.push(path)
    }

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setOpen(true)}
                className="text-white focus:outline-none"
            >
                <h2 className="text-md font-medium text-white">
                    <Menu size={30} />
                </h2>
            </button>

            {open && (
                <div
                    ref={dropdownRef}
                    className="absolute mt-2 laptop:left-0 right-[20px] w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                >
                    <div className="py-1">
                        {/* Close button */}
                        <div className="flex justify-end px-4 py-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="text-black focus:outline-none cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Nav Links */}
                        <nav className="flex flex-col space-y-1 text-gray-800 px-4 pb-2">
                            <Link
                                href="/"
                                onClick={() => setOpen(false)}
                                className="px-3 py-2 rounded-md hover:bg-gray-100"
                            >
                                Home
                            </Link>
                            <Link
                                href="/about"
                                onClick={() => setOpen(false)}
                                className="px-3 py-2 rounded-md hover:bg-gray-100"
                            >
                                About
                            </Link>
                            <Link
                                href="/services"
                                onClick={() => setOpen(false)}
                                className="px-3 py-2 rounded-md hover:bg-gray-100"
                            >
                                Services
                            </Link>

                            <div className="border-t border-gray-200 my-1"></div>

                            <button
                                onClick={() =>
                                    handleNavigate('/booking/hotseat')
                                }
                                className="px-3 py-2 rounded-md text-left hover:bg-gray-100 cursor-pointer"
                            >
                                Book a Hot Seat
                            </button>
                            <button
                                onClick={() => handleNavigate('/booking/room')}
                                className="px-3 py-2 rounded-md text-left hover:bg-gray-100 cursor-pointer"
                            >
                                Book a Room
                            </button>
                            <button
                                onClick={() =>
                                    handleNavigate('/booking/virtual')
                                }
                                className="px-3 py-2 rounded-md text-left hover:bg-gray-100 cursor-pointer"
                            >
                                Book Virtual Service
                            </button>
                            <button
                                onClick={() =>
                                    handleNavigate('/booking/storage')
                                }
                                className="px-3 py-2 rounded-md text-left hover:bg-gray-100 cursor-pointer"
                            >
                                Book Private Storage
                            </button>

                            <div className="border-t border-gray-200 my-1"></div>

                            <Link
                                href="/faqs"
                                onClick={() => setOpen(false)}
                                className="px-3 py-2 rounded-md hover:bg-gray-100"
                            >
                                FAQs
                            </Link>
                            <Link
                                href="/contact"
                                onClick={() => setOpen(false)}
                                className="px-3 py-2 rounded-md hover:bg-gray-100"
                            >
                                Contact
                            </Link>
                        </nav>
                    </div>
                </div>
            )}
        </div>
    )
}
