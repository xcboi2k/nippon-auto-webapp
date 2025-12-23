'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { toast } from 'react-toastify'

import { logos } from '@/constants/themes'
import { EMAIL_NEWSLETTER_API_URL } from '@/constants/api'
import Loader from './Loader'

import useLoaderStore from '@/stores/useLoaderStore'
import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa'

interface FormData {
    email: string
}

export default function Footer() {
    const router = useRouter()

    const { showLoader, hideLoader } = useLoaderStore()
    const initialValues: FormData = {
        email: '',
    }

    const handleSubmit = async (
        values: typeof initialValues,
        {
            resetForm,
        }: { resetForm: (nextState?: { values?: FormData }) => void }
    ) => {
        showLoader()
        console.log('submitted data:', values)

        const scriptURL = EMAIL_NEWSLETTER_API_URL
        try {
            const response = await fetch(scriptURL, {
                method: 'POST',
                body: JSON.stringify({
                    email: values.email,
                    date: new Date().toLocaleDateString(),
                }),
            })

            if (response.ok) {
                const result = await response.json()
                console.log('Success:', result)
                toast.success('Email submitted successfully!')
                // Reset form data
                resetForm()
                hideLoader()
            } else {
                toast.error('Email submission failed. Please try again.')
                console.error(
                    'Error:',
                    'Email submission failed. Please try again.'
                )
                hideLoader()
            }
        } catch (error) {
            toast.error(
                'Service not available right now. Please try again later.'
            )
            hideLoader()
            console.error('Error:', error)
        } finally {
            hideLoader()
        }
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string()
            .email('Invalid email format')
            .required('Email is required'),
    })

    return (
        <div className="flex flex-col px-6 md:px-20 py-10 bg-white">
            {/* Left Side - Logo + Newsletter */}
            <div className="w-full max-w-none flex flex-col md:flex-row mb-6">
                <div className="flex-1 mb-6">
                    <button onClick={() => router.push('/')}>
                        <Image
                            src={logos.webAppLogo}
                            alt="TrueMoney powered by Vashcorp Logo"
                            width={80}
                            height={80}
                            className="mb-6"
                        />
                    </button>

                    {/* <p className="text-white text-sm mb-4">
                        Subscribe to our newsletter.
                    </p>

                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                        {({ values, errors, touched, handleChange }) => (
                            <Form>
                                <div className="flex flex-col gap-3 mb-2">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        className="w-full sm:w-[300px] px-4 py-2 border border-white bg-transparent rounded-lg text-white placeholder-white/70 focus:outline-none"
                                        value={values.email}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type="submit"
                                        className="lg:w-[30%] w-[50%] bg-white px-4 py-2 rounded-lg text-[#A4B79B] font-semibold hover:opacity-90 transition"
                                    >
                                        Subscribe
                                    </button>
                                </div>
                                {touched.email && errors.email && (
                                    <p className="text-white text-sm">
                                        {errors.email}
                                    </p>
                                )}
                            </Form>
                        )}
                    </Formik> */}

                    <div className="flex-1 mt-[20px]">
                        <div className="flex items-start gap-4">
                            <button
                                onClick={() =>
                                    window.open(
                                        'https://www.facebook.com/share/16pMun2he5/',
                                        '_blank'
                                    )
                                }
                            >
                                <FaFacebookF className="text-tertiary text-[30px]" />
                            </button>
                            <button
                                onClick={() =>
                                    window.open(
                                        'https://www.instagram.com/bettercrew.ph?igsh=MXJ3ZHNlbnI5aHEwZw==&utm_source=ig_contact_invite',
                                        '_blank'
                                    )
                                }
                            >
                                <FaInstagram className="text-tertiary text-[30px]" />
                            </button>

                            <button
                                onClick={() =>
                                    window.open(
                                        'https://www.tiktok.com/@bettercrew.ph?_t=ZS-904241d1GQq&_r=1',
                                        '_blank'
                                    )
                                }
                            >
                                <FaTiktok className="text-tertiary text-[30px]" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side - About Section */}
                {/* <div className="flex-1">
                    <h2 className="text-white text-2xl font-bold mb-4">
                        About
                    </h2>
                    <p className="text-white text-sm mb-6 leading-relaxed max-w-md">
                        BetterCrew is a modern coworking space designed for
                        freelancers, remote teams, creatives, and entrepreneurs
                        who want more than just a desk. We offer flexible
                        workstations, private rooms, and virtual services
                        tailored to help you stay focused, connected, and
                        productive.
                    </p>

                    <div className="flex items-start gap-4">
                        <MapPin color="white" size={30} />
                        <div>
                            <p className="text-white font-medium text-base">
                                Lower Ground Floor, 935 Aurora Blvd, Cubao,
                                Quezon City, Philippines
                            </p>
                            <p className="text-white text-xs mt-1 max-w-xs">
                                Right in the heart of Cubao—accessible via
                                Anonas LRT Station, near TIP Cubao, a few kms
                                away from Gateway.
                            </p>
                        </div>
                    </div>
                </div> */}
            </div>
            <div className="w-full flex flex-row items-center mb-4">
                <button
                    className="mr-[50px]"
                    onClick={() => router.push('/privacy-policy?from=footer')}
                >
                    <p className="text-tertiary text-xs">Privacy Policy</p>
                </button>
                <button
                    onClick={() => router.push('/terms-conditions?from=footer')}
                >
                    <p className="text-tertiary text-xs">
                        Terms and Conditions
                    </p>
                </button>
            </div>
            <p className="text-tertiary text-xs">
                &copy; {new Date().getFullYear()} NipponAuto. All Rights
                Reserved.
            </p>

            <Loader />
        </div>
    )
}
