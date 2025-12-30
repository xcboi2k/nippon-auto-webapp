'use client'

import React from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'
import { FiEdit, FiTrash2, FiMapPin } from 'react-icons/fi'

import { colors } from '@/constants/themes'

export default function MyListings() {
    const router = useRouter()

    const placeholderListings = [
        {
            id: 1,
            title: 'Toyota Camry 2020',
            image: 'https://source.unsplash.com/800x600/?toyota,sedan,car',
            price: '₱850,000',
            status: 'Active',
            location: 'Manila, PH',
            createdAt: '3 days ago',
        },
        {
            id: 2,
            title: 'Honda Odyssey 2019',
            image: 'https://source.unsplash.com/800x600/?honda,van',
            price: '₱1,250,000',
            status: 'Sold',
            location: 'Cebu, PH',
            createdAt: '1 week ago',
        },
        {
            id: 3,
            title: 'Yamaha MT-09 2022',
            image: 'https://source.unsplash.com/800x600/?yamaha,motorcycle',
            price: '₱620,000',
            status: 'Active',
            location: 'Quezon City, PH',
            createdAt: '2 weeks ago',
        },
    ]

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
                        My Listings
                    </h2>

                    <div className="max-w-2xl mx-auto space-y-6">
                        {placeholderListings.map((listing) => (
                            <div
                                key={listing.id}
                                className="bg-white rounded-lg shadow p-5"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-[#153A56]">
                                            {listing.title}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            Posted {listing.createdAt}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 text-gray-500">
                                        <button className="hover:text-blue-600">
                                            <FiEdit size={18} />
                                        </button>
                                        <button className="hover:text-red-600">
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Image */}
                                <img
                                    src={listing.image}
                                    alt={listing.title}
                                    className="w-full h-56 object-cover rounded-md mb-4"
                                />

                                {/* Info */}
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-lg font-bold text-[#234791]">
                                        {listing.price}
                                    </p>
                                    <span
                                        className={`text-sm px-3 py-1 rounded-full ${
                                            listing.status === 'Active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}
                                    >
                                        {listing.status}
                                    </span>
                                </div>

                                {/* Location */}
                                <div className="flex items-center text-sm text-gray-500">
                                    <FiMapPin className="mr-1" />
                                    {listing.location}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
