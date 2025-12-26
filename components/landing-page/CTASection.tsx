import React from 'react'

export default function CTASection() {
    return (
        <div className="w-full py-10 px-6 bg-tertiary">
            <section className="py-32 bg-tertiary text-center">
                <h3 className="text-4xl font-extrabold text-white">
                    Start Your Engine with NipponAuto
                </h3>
                <p className="mt-6 text-white/80 text-lg">
                    Join today and become part of the vehicle community.
                </p>
                <button className="mt-10 bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl text-lg cursor-pointer">
                    Get Started
                </button>
            </section>
        </div>
    )
}
