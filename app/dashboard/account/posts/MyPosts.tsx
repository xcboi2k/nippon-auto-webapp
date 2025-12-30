'use client'

import React, { useState } from 'react'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'
import { FiEdit, FiTrash2, FiHeart, FiMessageCircle } from 'react-icons/fi'

import { colors } from '@/constants/themes'

export default function MyPosts() {
    const router = useRouter()

    const placeholderPosts = [
        {
            id: 1,
            author: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
            content: 'Just listed a new Toyota Camry 🚗',
            likes: 12,
            comments: [
                { id: 1, user: 'Jane', text: 'Looks great!' },
                { id: 2, user: 'Alex', text: 'How much?' },
            ],
            createdAt: '2 hours ago',
        },
        {
            id: 2,
            author: 'John Doe',
            avatar: 'https://randomuser.me/api/portraits/men/10.jpg',
            content: 'Marketplace is booming today 🔥',
            likes: 5,
            comments: [{ id: 1, user: 'Mike', text: 'Nice!' }],
            createdAt: '1 day ago',
        },
    ]

    const [openComments, setOpenComments] = useState<number | null>(null)

    const toggleComments = (postId: number) => {
        setOpenComments(openComments === postId ? null : postId)
    }

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
                        My Posts
                    </h2>

                    <div className="max-w-2xl mx-auto space-y-6">
                        {placeholderPosts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white rounded-lg shadow p-5"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={post.avatar}
                                            alt={post.author}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="font-bold text-[#153A56]">
                                                {post.author}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {post.createdAt}
                                            </p>
                                        </div>
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

                                {/* Content */}
                                <p className="text-[#333] mb-4">
                                    {post.content}
                                </p>

                                {/* Stats */}
                                <div className="flex items-center gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <FiHeart />
                                        <span>{post.likes} Likes</span>
                                    </div>

                                    <button
                                        onClick={() => toggleComments(post.id)}
                                        className="flex items-center gap-1 hover:text-[#234791]"
                                    >
                                        <FiMessageCircle />
                                        <span>
                                            {post.comments.length} Comments
                                        </span>
                                    </button>
                                </div>

                                {/* Comments */}
                                {openComments === post.id && (
                                    <div className="mt-4 border-t pt-3 space-y-2">
                                        {post.comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="text-sm text-gray-700"
                                            >
                                                <span className="font-semibold">
                                                    {comment.user}:
                                                </span>{' '}
                                                {comment.text}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
