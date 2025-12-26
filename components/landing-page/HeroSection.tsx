import React from 'react'
import { useRouter } from 'nextjs-toploader/app'

export default function HeroSection() {
    const router = useRouter()
    return (
        <div className="w-full py-10 px-6 bg-tertiary">
            <section className="min-h-screen bg-tertiary flex items-center">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
                        Buy. Sell. <br />
                        <span className="text-red-600">Build.</span> Connect.
                    </h2>

                    <p className="mt-6 text-lg md:text-xl text-white max-w-2xl mx-auto">
                        NipponAuto is the all-in-one marketplace and social
                        network built for car enthusiasts and vehicle traders.
                    </p>

                    <div className="mt-10 flex justify-center gap-6">
                        <button
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl text-lg"
                            onClick={() => router.push('/marktplace')}
                        >
                            Explore Marketplace
                        </button>
                        <button
                            className="border border-white text-white px-8 py-4 rounded-xl text-lg"
                            onClick={() => router.push('/community')}
                        >
                            Join the Community
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
