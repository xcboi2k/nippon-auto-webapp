'use client'

import React, { useState } from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'

import { colors } from '@/constants/themes'
import { ReviewCard } from '@/components/dashboard/reviews/ReviewCard'

export default function SellerReviews() {
    const router = useRouter()

    const reviewsAboutMe = [
        {
            id: 1,
            reviewerName: 'Jane Smith',
            reviewerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            rating: 5,
            comment:
                'Smooth transaction. Seller was very responsive and honest.',
            relatedItem: 'Toyota Camry 2020',
            date: '2 days ago',
        },
        {
            id: 2,
            reviewerName: 'Mark Johnson',
            reviewerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            rating: 4,
            comment:
                'Car was in good condition, minor delays but overall okay.',
            relatedItem: 'Honda Odyssey 2019',
            date: '1 week ago',
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
                            onClick={() =>
                                router.push(
                                    '/dashboard/marketplace/details/seller/profile'
                                )
                            }
                        >
                            <ArrowLeft size={15} color={colors.tertiary} />
                            <h2 className="text-sm md:text-md font-semibold text-tertiary ml-[10px]">
                                Go back
                            </h2>
                        </button>
                    </div>
                    <h2 className="text-3xl font-bold text-center text-[#153A56] mb-6">
                        Seller Reviews
                    </h2>

                    {/* Content */}
                    <section>
                        {reviewsAboutMe.length ? (
                            reviewsAboutMe.map((review) => (
                                <ReviewCard
                                    key={review.id}
                                    avatar={review.reviewerAvatar}
                                    name={review.reviewerName}
                                    rating={review.rating}
                                    comment={review.comment}
                                    relatedItem={review.relatedItem}
                                    date={review.date}
                                />
                            ))
                        ) : (
                            <p className="text-gray-400">No reviews yet.</p>
                        )}
                    </section>
                </div>
            </section>
        </div>
    )
}
