import React from 'react'
import { Heart, MessageCircle } from 'lucide-react'

interface CommunityPostProps {
    username: string
    avatar: string
    content: string
    image?: string
    likes: number
    comments: number
}

export default function CommunityPost({
    username,
    avatar,
    content,
    image,
    likes,
    comments,
}: CommunityPostProps) {
    return (
        <div className="bg-white p-5 rounded-xl transition hover:shadow-lg hover:shadow-red-600/10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <img
                    src={avatar}
                    alt={username}
                    className="h-10 w-10 rounded-full object-cover"
                />
                <span className="text-black font-medium">{username}</span>
            </div>

            {/* Content */}
            <p className="text-black mb-3">{content}</p>
            {image && (
                <img
                    src={image}
                    alt="post"
                    className="w-full h-60 object-cover rounded-lg mb-3"
                />
            )}

            {/* Interaction Buttons */}
            <div className="flex gap-6 text-black text-sm">
                <div className="flex items-center gap-1">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span>{likes} Likes</span>
                </div>
                <div className="flex items-center gap-1">
                    <MessageCircle className="h-5 w-5 text-black" />
                    <span>{comments} Comments</span>
                </div>
            </div>
        </div>
    )
}
