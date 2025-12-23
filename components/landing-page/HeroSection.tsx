import React from 'react'

export default function HeroSection() {
    return (
        <div className="w-full py-10 px-6">
            <div className="w-full flex flex-col justify-center items-center rounded-md bg-white p-6">
                <p className="font-bold text-gray-700 text-[30px] md:text-[50px] mb-[20px]">
                    Welcome to NipponAuto
                </p>
                {/* <p className="w-[70%] text-gray-800 text-[15px] md:text-[20px] mb-[40px] leading">
                    BetterCrew is a modern coworking space designed for
                    freelancers, remote teams, creatives, and entrepreneurs who
                    want more than just a desk. We offer flexible workstations,
                    private rooms, and virtual services tailored to help you
                    stay focused, connected, and productive. Whether you're here
                    for a few hours or every day of the month, we make it easy
                    to work your way—with reliable Wi-Fi, a professional
                    atmosphere, and an up-and-coming community of doers.
                </p> */}
            </div>
        </div>
    )
}
