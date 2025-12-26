import React from 'react'
import CommunityPost from './CommunityPost'

export default function CommunityFeed() {
    const samplePosts = [
        {
            username: 'CarLover89',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            content: 'Just installed my new exhaust! Sounds amazing 🔥',
            image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a',
            likes: 24,
            comments: 5,
        },
        {
            username: 'MotoQueen',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            content: 'Morning ride along the coast. Feeling alive!',
            image: 'https://images.unsplash.com/photo-1727805908571-9fe30e068328?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            likes: 42,
            comments: 12,
        },
        {
            username: 'TruckMaster',
            avatar: 'https://randomuser.me/api/portraits/men/55.jpg',
            content: 'Loaded up the new cargo truck for deliveries today.',
            image: 'https://images.unsplash.com/photo-1765833541491-c7a5b1f91b18?q=80&w=1092&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            likes: 18,
            comments: 2,
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {samplePosts.map((post, index) => (
                <CommunityPost key={index} {...post} />
            ))}
        </div>
    )
}
