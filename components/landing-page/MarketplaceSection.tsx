import React from 'react'
import { useRouter } from 'nextjs-toploader/app'

export default function MarketplaceSection() {
    const router = useRouter()
    return (
        <div className="w-full py-10 px-6 bg-tertiary">
            <section className="py-24 bg-tertiary">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <h3 className="text-4xl font-bold text-white">
                            Discover Your Next Ride
                        </h3>
                        <p className="mt-6 text-white text-lg">
                            From daily commuters to rare builds — browse
                            vehicles tailored to your taste.
                        </p>
                        <button
                            className="mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl"
                            onClick={() => router.push('/marktplace')}
                        >
                            Browse Listings
                        </button>
                    </div>

                    <div className="bg-zinc-900 rounded-2xl p-10 border border-zinc-800">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
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
                                    image: 'https://images.unsplash.com/photo-1595472167001-dbe2069e1b07?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // sport motorcycle
                                },
                                {
                                    title: '2019 Volvo FH 540',
                                    price: '₱4,200,000',
                                    badge: 'Truck',
                                    image: 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?q=80&w=1418&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // commercial truck / lorry
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="
          group bg-zinc-800 rounded-xl overflow-hidden
          border border-zinc-700
          transition-all duration-300 ease-out
          hover:border-red-600 hover:-translate-y-1
          hover:shadow-xl hover:shadow-red-600/10
        "
                                >
                                    {/* Image */}
                                    <div className="relative h-44 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="
              h-full w-full object-cover
              transition-transform duration-500
              group-hover:scale-110
            "
                                        />

                                        {/* Badge */}
                                        <span
                                            className="
            absolute top-3 left-3
            bg-black/70 backdrop-blur
            text-white text-xs font-semibold
            px-3 py-1 rounded-full
            border border-zinc-600
          "
                                        >
                                            {item.badge}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h4 className="text-white font-semibold leading-snug">
                                            {item.title}
                                        </h4>
                                        <p className="mt-2 text-red-500 font-bold">
                                            {item.price}
                                        </p>

                                        {/* Hover CTA */}
                                        {/* <div
                                            className="
            mt-4 opacity-0 translate-y-2
            transition-all duration-300
            group-hover:opacity-100 group-hover:translate-y-0
          "
                                        >
                                            <button className="text-sm text-white bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700">
                                                View Listing
                                            </button>
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <p className="mt-6 text-center text-sm text-white italic">
                    Note: These listings are{' '}
                    <span className="font-semibold">placeholders</span> for
                    demonstration purposes. Vehicle details, prices, and images
                    may not be accurate.
                </p>
            </section>
        </div>
    )
}
