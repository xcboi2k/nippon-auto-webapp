import React from 'react'

interface VehicleCardProps {
    title: string
    price: string
    badge: string
    image: string
}

export default function VehicleCard({
    title,
    price,
    badge,
    image,
}: VehicleCardProps) {
    return (
        <div className="group bg-white rounded-xl overflow-hidden transition-all duration-300 hover:border-red-600 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-600/10">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 right-4 bg-black/60 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full border border-white/10">
                    {badge}
                </span>
            </div>
            <div className="p-4">
                <h4 className="text-tertiary font-medium text-lg">{title}</h4>
                <p className="mt-2 text-red-500 font-bold text-3xl">{price}</p>
                <div className="mt-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    <button className="text-sm bg-tertiary text-white px-4 py-2 rounded-lg cursor-pointer">
                        View Listing
                    </button>
                </div>
            </div>
        </div>
    )
}
