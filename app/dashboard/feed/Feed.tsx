import React, { useState } from 'react'
import { FaHeart, FaComment } from 'react-icons/fa'
import { IoAdd } from 'react-icons/io5'

export default function Feed() {
    const posts = [
        {
            username: 'John Doe',
            userImage: 'https://randomuser.me/api/portraits/men/10.jpg',
            content: 'Check out my new ride! Loving the performance.',
            postImage:
                'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=800&q=80',
            likes: 12,
            comments: 4,
        },
        {
            username: 'Jane Smith',
            userImage: 'https://randomuser.me/api/portraits/women/12.jpg',
            content: 'Weekend ride with friends! 🏍️',
            postImage:
                'https://images.unsplash.com/photo-1617559916160-55d3d271648b?w=800&q=80',
            likes: 34,
            comments: 10,
        },
        {
            username: 'Alice Johnson',
            userImage: 'https://randomuser.me/api/portraits/women/21.jpg',
            content: 'Just customized my bike, check the new colors!',
            postImage:
                'https://images.unsplash.com/photo-1605809602440-fc15d33a540b?w=800&q=80',
            likes: 18,
            comments: 5,
        },
    ]

    return (
        <div className="relative w-full h-full bg-primary">
            <section
                id="hero"
                className="w-full bg-primary flex flex-col items-center justify-center px-10 mt-[60px]"
            >
                <div className="relative flex-1 w-full p-8">
                    <h2 className="text-3xl font-bold text-center text-[#153A56] mb-6">
                        Social Feed
                    </h2>

                    <div className="flex flex-col items-center gap-6">
                        {posts.length ? (
                            posts.map((post, idx) => (
                                <div
                                    key={idx}
                                    className="w-full max-w-md bg-[#F4F6F8] rounded-lg p-4 shadow"
                                >
                                    <div className="flex items-center mb-3">
                                        <img
                                            src={post.userImage}
                                            alt={post.username}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <p className="font-bold text-[#153A56]">
                                                {post.username}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mb-2 text-[#153A56]">
                                        {post.content}
                                    </p>

                                    {post.postImage && (
                                        <img
                                            src={post.postImage}
                                            alt="Post"
                                            className="w-full h-60 object-cover rounded mb-2"
                                        />
                                    )}

                                    <div className="flex gap-4 text-sm text-[#153A56]">
                                        <span className="flex items-center gap-1">
                                            <FaHeart /> {post.likes} Likes
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FaComment /> {post.comments}{' '}
                                            Comments
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-[#153A56] font-bold">
                                No posts yet.
                            </p>
                        )}
                    </div>

                    {/* Floating Action Button */}
                    <button className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#234791] flex items-center justify-center shadow-lg hover:bg-blue-700 transition">
                        <IoAdd className="text-white" size={28} />
                    </button>
                </div>
            </section>
        </div>
    )
}
