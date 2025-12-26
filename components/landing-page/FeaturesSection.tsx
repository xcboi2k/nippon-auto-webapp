import React from 'react'

export default function FeaturesSection() {
    const features = [
        {
            title: 'Vehicle Marketplace',
            description:
                'List, buy, and sell cars, trucks, and motorcycles with confidence.',
        },
        {
            title: 'Social Feed',
            description:
                'Post builds, share rides, and engage with fellow enthusiasts.',
        },
        {
            title: 'Verified Community',
            description:
                'Trusted users, transparent listings, and real connections.',
        },
    ]

    return (
        <div className="w-full py-10 px-6 bg-black">
            <section className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <h3 className="text-4xl font-bold text-white text-center">
                        Why Choose NipponAuto?
                    </h3>

                    <div className="mt-16 grid md:grid-cols-3 gap-10">
                        {features.map((f) => (
                            <div
                                key={f.title}
                                className="bg-zinc-800 rounded-2xl p-8 hover:border-red-600 border border-zinc-700 transition"
                            >
                                <h4 className="text-xl font-semibold text-white">
                                    {f.title}
                                </h4>
                                <p className="mt-4 text-zinc-400">
                                    {f.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
