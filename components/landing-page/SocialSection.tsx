import React from 'react'

export default function SocialSection() {
    return (
        <div className="w-full py-10 px-6 bg-black">
            <section className="py-24 bg-black">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h3 className="text-4xl font-bold text-white">
                        More Than a Marketplace
                    </h3>
                    <p className="mt-6 text-zinc-400 text-lg max-w-2xl mx-auto">
                        NipponAuto is a social platform where vehicles tell
                        stories.
                    </p>

                    <div className="mt-16 grid md:grid-cols-3 gap-10">
                        {[
                            {
                                title: 'Share Builds',
                                description:
                                    'Showcase your vehicle builds, upgrades, and progress.',
                            },
                            {
                                title: 'Engage & Comment',
                                description:
                                    'Like, comment, and interact with posts from the community.',
                            },
                            {
                                title: 'Follow Garages',
                                description:
                                    'Stay updated with your favorite creators and garages.',
                            },
                        ].map((item) => (
                            <div
                                key={item.title}
                                className="
        group bg-zinc-800 p-8 rounded-2xl
        border border-zinc-700
        transition-all duration-300
        hover:border-red-600 hover:-translate-y-1
        hover:shadow-lg hover:shadow-red-600/10
      "
                            >
                                <h4 className="text-xl font-semibold text-white">
                                    {item.title}
                                </h4>

                                <p className="mt-3 text-zinc-400 leading-relaxed">
                                    {item.description}
                                </p>

                                {/* Hover Accent Line */}
                                <div className="mt-6 h-1 w-0 bg-red-600 rounded-full transition-all duration-300 group-hover:w-12" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
