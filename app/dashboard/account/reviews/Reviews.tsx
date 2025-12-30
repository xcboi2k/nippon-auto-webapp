'use client'

import React, { useState } from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'

import { colors } from '@/constants/themes'
import { ReviewCard } from '@/components/dashboard/reviews/ReviewCard'

export default function Reviews() {
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

    const reviewsIGave = [
        {
            id: 3,
            targetName: 'Carlos Reyes',
            targetAvatar: 'https://randomuser.me/api/portraits/men/10.jpg',
            rating: 5,
            comment: 'Great buyer, quick payment and polite communication.',
            relatedItem: 'Yamaha MT-09 2022',
            date: '5 days ago',
        },
        {
            id: 4,
            targetName: 'Anna Lee',
            targetAvatar: 'https://randomuser.me/api/portraits/women/30.jpg',
            rating: 3,
            comment: 'Transaction completed but communication could be better.',
            relatedItem: 'Nissan Skyline R34',
            date: '3 weeks ago',
        },
    ]

    const reviewTabs = ['About Me', 'I Gave'] as const
    type ReviewTab = (typeof reviewTabs)[number]

    const [activeTab, setActiveTab] = useState<ReviewTab>('About Me')

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
                        My Reviews
                    </h2>

                    <div className="flex justify-center mb-8">
                        <div className="flex bg-gray-100 rounded-full p-1">
                            {reviewTabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                                        activeTab === tab
                                            ? 'bg-[#234791] text-white shadow'
                                            : 'text-gray-500 hover:text-[#234791]'
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content */}
                    {activeTab === 'About Me' && (
                        <section>
                            <h3 className="text-xl font-bold text-[#234791] mb-4">
                                Reviews About Me
                            </h3>

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
                    )}

                    {activeTab === 'I Gave' && (
                        <section>
                            <h3 className="text-xl font-bold text-[#234791] mb-4">
                                Reviews I Gave
                            </h3>

                            {reviewsIGave.length ? (
                                reviewsIGave.map((review) => (
                                    <ReviewCard
                                        key={review.id}
                                        avatar={review.targetAvatar}
                                        name={review.targetName}
                                        rating={review.rating}
                                        comment={review.comment}
                                        relatedItem={review.relatedItem}
                                        date={review.date}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-400">
                                    You haven’t reviewed anyone yet.
                                </p>
                            )}
                        </section>
                    )}
                </div>
            </section>
        </div>
    )
}
