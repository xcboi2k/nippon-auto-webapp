'use client'

import React from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'
import { MdStore, MdLocationOn, MdEmail, MdPhone } from 'react-icons/md'

import { colors } from '@/constants/themes'

export default function Profile() {
    const router = useRouter()

    return (
        <div className="relative w-full h-full bg-primary">
            <section
                id="hero"
                className="w-full bg-primary flex flex-col items-center justify-center px-10 mt-[60px]"
            >
                <div className="relative flex-1 w-full p-8">
                    <div className="w-full flex justify-between items-center mb-6">
                        <button
                            className="mb-[30px] flex items-center cursor-pointer"
                            onClick={() => router.push('/dashboard')}
                        >
                            <ArrowLeft size={15} color={colors.tertiary} />
                            <h2 className="text-sm md:text-md font-semibold text-tertiary ml-[10px]">
                                Go back
                            </h2>
                        </button>
                    </div>
                    <h2 className="text-3xl font-bold text-center text-[#153A56] mb-6">
                        My Profile
                    </h2>

                    {/* Avatar + Stats */}
                    <div className="w-full flex items-center mb-6 gap-4">
                        <img
                            src={
                                'https://randomuser.me/api/portraits/men/10.jpg'
                            }
                            alt="John Doe"
                            className="w-20 h-20 rounded-full object-cover"
                        />

                        <div className="flex flex-1 justify-around text-center">
                            <div>
                                <p className="text-xl font-bold text-[#333]">
                                    10
                                </p>
                                <p className="text-sm text-[#666]">Listings</p>
                            </div>
                            <div>
                                <p className="text-xl font-bold text-[#333]">
                                    9.8/10
                                </p>
                                <p className="text-sm text-[#666]">Rating</p>
                            </div>
                        </div>
                    </div>

                    {/* Name & Username */}
                    <div className="mb-4">
                        <h3 className="text-2xl font-bold text-[#333]">
                            John Doe
                        </h3>
                        <p className="text-lg italic text-[#234791]">
                            @johndoe_123
                        </p>
                        <p className="text-sm text-[#666]">Car Seller</p>
                    </div>

                    {/* Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        <div className="flex items-center text-sm text-[#666]">
                            <MdStore size={16} className="text-[#153A56]" />
                            <span className="ml-2">My Shop</span>
                        </div>

                        <div className="flex items-center text-sm text-[#666]">
                            <MdLocationOn
                                size={16}
                                className="text-[#153A56]"
                            />
                            <span className="ml-2">My Location</span>
                        </div>

                        <div className="flex items-center text-sm text-[#666]">
                            <MdEmail size={16} className="text-[#153A56]" />
                            <span className="ml-2">johndoe@email.com</span>
                        </div>

                        <div className="flex items-center text-sm text-[#666]">
                            <MdPhone size={16} className="text-[#153A56]" />
                            <span className="ml-2">1234 - 5678 - 0000</span>
                        </div>
                    </div>

                    {/* About */}
                    <div className="mb-6">
                        <h4 className="text-xl font-bold text-[#333] mb-2">
                            About
                        </h4>
                        <p className="text-sm text-[#666] leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis
                            nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center gap-3">
                        <button
                            className="w-[70%] bg-[#234791] py-3 rounded-xl text-white font-medium hover:bg-[#1d3a75] transition"
                            onClick={() => router.push('/my-listings')}
                        >
                            My Listings
                        </button>

                        <button
                            className="w-[70%] bg-[#234791] py-3 rounded-xl text-white font-medium hover:bg-[#1d3a75] transition"
                            onClick={() => router.push('/my-reviews')}
                        >
                            My Reviews
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
