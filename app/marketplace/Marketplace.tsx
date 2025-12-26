import React from 'react'
import MarketplaceFilters from '@/components/marketplace-page/MarketplaceFilters'
import MarketplaceGrid from '@/components/marketplace-page/MarketplaceGrid'

export default function Marketplace() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-10 bg-tertiary">
            <h2 className="text-4xl font-bold text-white mb-6">Marketplace</h2>
            <MarketplaceFilters />
            <MarketplaceGrid />
            <p className="mt-6 text-center text-sm text-white italic">
                Note: These listings are{' '}
                <span className="font-semibold">placeholders</span> for demo
                purposes. Vehicle details, prices, and images may not be
                accurate.
            </p>
        </div>
    )
}
