import React from 'react'
import VehicleCard from './VehicleCard'

export default function MarketplaceGrid() {
    const sampleVehicles = [
        {
            title: '2022 BMW M3 Competition',
            price: '₱5,200,000',
            badge: 'Car',
            image: 'https://images.unsplash.com/photo-1622244588672-9290bf3cb1f7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: '2021 Ducati Panigale V4',
            price: '₱2,400,000',
            badge: 'Motorcycle',
            image: 'https://images.unsplash.com/photo-1698695290237-5c7be2bd52a8?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: '2020 Toyota Hilux 4x4',
            price: '₱1,650,000',
            badge: 'Truck',
            image: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?q=80&w=1151&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: '2023 Tesla Model 3',
            price: '₱2,700,000',
            badge: 'EV',
            image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: '2021 Kawasaki Ninja ZX-6R',
            price: '₱780,000',
            badge: 'Motorcycle',
            image: 'https://images.unsplash.com/photo-1595472167001-dbe2069e1b07?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            title: '2019 Volvo FH 540',
            price: '₱4,200,000',
            badge: 'Truck',
            image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?q=80&w=1418&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sampleVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.title} {...vehicle} />
            ))}
        </div>
    )
}
