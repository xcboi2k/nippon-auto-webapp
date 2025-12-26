import React from 'react'

export default function MarketplaceFilters() {
    return (
        <div className="flex flex-wrap gap-4 mb-6">
            {['All', 'Cars', 'Motorcycles', 'Trucks', 'EV'].map((filter) => (
                <button
                    key={filter}
                    className="px-4 py-2 bg-white hover:bg-red-600 text-tertiary hover:text-white rounded-full transition"
                >
                    {filter}
                </button>
            ))}
        </div>
    )
}
