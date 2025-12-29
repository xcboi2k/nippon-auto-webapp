'use client'

import React, { useState } from 'react'
import {
    FaSearch,
    FaCar,
    FaBus,
    FaMotorcycle,
    FaBars,
    FaShuttleVan,
} from 'react-icons/fa'
import { IoAdd } from 'react-icons/io5'

export default function Marketplace() {
    const sampleListings = [
        {
            sellerName: 'John Doe',
            sellerLocation: 'New York, USA',
            car_model: 'Toyota Camry 2022',
            classification_type: 'Car',
            carImageAddress:
                'https://images.unsplash.com/photo-1603780033344-7d3ee8f06d4f?w=800&q=80',
            userImageAddress: 'https://randomuser.me/api/portraits/men/10.jpg',
            price: '₱1,200,000',
        },
        {
            sellerName: 'Jane Smith',
            sellerLocation: 'Los Angeles, USA',
            car_model: 'Honda Odyssey 2021',
            classification_type: 'Van',
            carImageAddress:
                'https://images.unsplash.com/photo-1610585153975-ade947932f87?w=800&q=80',
            userImageAddress:
                'https://randomuser.me/api/portraits/women/12.jpg',
            price: '₱1,500,000',
        },
        {
            sellerName: 'Alice Johnson',
            sellerLocation: 'Chicago, USA',
            car_model: 'Ford F-150 2020',
            classification_type: 'Truck/Bus',
            carImageAddress:
                'https://images.unsplash.com/photo-1612840907842-c1a5f6ed9b9a?w=800&q=80',
            userImageAddress:
                'https://randomuser.me/api/portraits/women/21.jpg',
            price: '₱2,200,000',
        },
    ]

    const sampleFeaturedListings = [
        {
            car_model: '2022 BMW M3 Competition',
            carImageAddress:
                'https://images.unsplash.com/photo-1622244588672-9290bf3cb1f7?q=80&w=1170&auto=format&fit=crop',
            price: '₱5,200,000',
        },
        {
            car_model: '2021 Ducati Panigale V4',
            carImageAddress:
                'https://images.unsplash.com/photo-1698695290237-5c7be2bd52a8?q=80&w=1172&auto=format&fit=crop',
            price: '₱2,400,000',
        },
    ]

    const sampleRecommendedListings = [
        {
            car_model: '2023 Tesla Model 3',
            carImageAddress:
                'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1171&auto=format&fit=crop',
            price: '₱2,700,000',
        },
        {
            car_model: '2021 Kawasaki Ninja ZX-6R',
            carImageAddress:
                'https://images.unsplash.com/photo-1595472167001-dbe2069e1b07?q=80&w=1170&auto=format&fit=crop',
            price: '₱780,000',
        },
    ]

    const filters = ['All', 'Car', 'Van', 'Truck/Bus', 'Motorcycle']

    const [searchText, setSearchText] = useState('')
    const [activeFilter, setActiveFilter] = useState(filters[0])

    const filteredListings = sampleListings.filter((listing) => {
        const filterMatch =
            activeFilter === 'All' ||
            listing.classification_type === activeFilter
        const searchTermMatch =
            !searchText ||
            listing.car_model.toLowerCase().includes(searchText.toLowerCase())
        return filterMatch && searchTermMatch
    })

    return (
        <div className="relative w-full h-full bg-primary">
            <section className="w-full bg-primary flex flex-col items-center justify-center px-4 lg:px-10 mt-[60px]">
                <div className="relative flex-1 w-full p-8">
                    <h2 className="text-3xl font-bold text-center text-[#153A56] mb-6">
                        Marketplace
                    </h2>

                    {/* Main + Sidebar */}
                    <div className="flex gap-4 mx-auto w-max">
                        {/* Main Listings */}
                        <div className="flex-1 flex flex-col gap-6">
                            {/* Search Bar */}
                            <div className="flex items-center mb-4">
                                <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 w-full max-w-md">
                                    <FaSearch
                                        className="text-[#153A56]"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        className="ml-4 flex-1 bg-transparent outline-none text-[#153A56]"
                                        placeholder="Search by model"
                                        value={searchText}
                                        onChange={(e) =>
                                            setSearchText(e.target.value)
                                        }
                                    />
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex justify-start mb-6 gap-2 flex-wrap">
                                {filters.map((filter) => (
                                    <button
                                        key={filter}
                                        className={`flex items-center justify-center p-2 rounded ${
                                            activeFilter === filter
                                                ? 'bg-[#234791] text-white'
                                                : 'bg-[#F4F6F8] text-[#C2C7CB]'
                                        }`}
                                        onClick={() => setActiveFilter(filter)}
                                    >
                                        {filter === 'Car' && (
                                            <FaCar className="mr-1" />
                                        )}
                                        {filter === 'Van' && (
                                            <FaShuttleVan className="mr-1" />
                                        )}
                                        {filter === 'Truck/Bus' && (
                                            <FaBus className="mr-1" />
                                        )}
                                        {filter === 'Motorcycle' && (
                                            <FaMotorcycle className="mr-1" />
                                        )}
                                        {filter === 'All' && (
                                            <FaBars className="mr-1" />
                                        )}
                                        <span>{filter}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Listings */}
                            <div className="flex flex-col justify-start gap-6">
                                {filteredListings.length ? (
                                    filteredListings.map((item, index) => (
                                        <div
                                            key={index}
                                            className="w-full max-w-md bg-[#F4F6F8] rounded-lg p-4 shadow"
                                        >
                                            {/* Seller Info */}
                                            <div className="flex items-center mb-3">
                                                <img
                                                    src={item.userImageAddress}
                                                    alt={item.sellerName}
                                                    className="w-10 h-10 rounded-full mr-3"
                                                />
                                                <div>
                                                    <p className="font-bold text-[#153A56]">
                                                        {item.sellerName}
                                                    </p>
                                                    <p className="text-sm text-[#C2C7CB]">
                                                        {item.sellerLocation}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Car Image */}
                                            <img
                                                src={item.carImageAddress}
                                                alt={item.car_model}
                                                className="w-full h-60 object-cover rounded mb-3"
                                            />

                                            {/* Price */}
                                            {item.price && (
                                                <p className="font-bold text-[#234791] mb-2">
                                                    {item.price}
                                                </p>
                                            )}

                                            {/* Button */}
                                            <div className="flex justify-center">
                                                <button
                                                    type="submit"
                                                    className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                                >
                                                    Check Details
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-[#153A56] font-bold">
                                        No listings available
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:flex flex-col w-80 gap-6 sticky top-8 h-fit">
                            {/* Featured Listings */}
                            {sampleFeaturedListings.length > 0 && (
                                <div className="bg-white rounded-lg p-4 shadow mb-4">
                                    <h3 className="font-bold text-[#153A56] mb-3">
                                        Featured Listings
                                    </h3>
                                    {sampleFeaturedListings.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center mb-3 gap-3 hover:bg-gray-100 p-2 rounded transition"
                                        >
                                            <img
                                                src={item.carImageAddress}
                                                alt={item.car_model}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-black">
                                                    {item.car_model}
                                                </p>
                                                {item.price && (
                                                    <p className="text-xs text-[#234791]">
                                                        {item.price}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Promotional Banner */}
                            <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg p-4 text-center shadow mb-4">
                                <p className="font-bold mb-2">Limited Offer!</p>
                                <p>Get 10% off on car accessories this week.</p>
                            </div>

                            {/* Recommended Listings */}
                            {sampleRecommendedListings.length > 0 && (
                                <div className="bg-white rounded-lg p-4 shadow mb-4">
                                    <h3 className="font-bold text-[#153A56] mb-3">
                                        Recommended for You
                                    </h3>
                                    {sampleRecommendedListings.map(
                                        (item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center mb-3 gap-3 hover:bg-gray-100 p-2 rounded transition"
                                            >
                                                <img
                                                    src={item.carImageAddress}
                                                    alt={item.car_model}
                                                    className="w-16 h-16 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-black">
                                                        {item.car_model}
                                                    </p>
                                                    {item.price && (
                                                        <p className="text-xs text-[#234791]">
                                                            {item.price}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Floating Action Button */}
                    <button
                        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#234791] flex items-center justify-center shadow-lg hover:bg-blue-700 transition"
                        onClick={() => console.log('Add Listing')}
                    >
                        <IoAdd className="text-white" size={28} />
                    </button>
                </div>
            </section>
        </div>
    )
}
