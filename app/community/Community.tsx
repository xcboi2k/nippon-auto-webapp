import React from 'react'
import CommunityFeed from '@/components/community-page/CommunityFeed'
import CommunityFilters from '@/components/community-page/CommunityFilters'

export default function Community() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-10 bg-tertiary">
            <h2 className="text-4xl font-bold text-white mb-6">Community</h2>
            <CommunityFilters />
            <CommunityFeed />
            <p className="mt-6 text-center text-sm text-white italic">
                Note: These posts are{' '}
                <span className="font-semibold">placeholders</span> for demo
                purposes. Content and interactions may not be accurate.
            </p>
        </div>
    )
}
