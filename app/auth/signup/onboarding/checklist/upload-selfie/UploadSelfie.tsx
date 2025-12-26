/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { ArrowUpFromLine, Camera, Loader2, Trash, X } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { useRouter } from 'nextjs-toploader/app'
import Compressor from 'compressorjs'

import { API_URL } from '@/constants/api'
import { colors } from '@/constants/themes'
import CameraModal from './cameraModal'
import Footer from '@/components/Footer'
import useUserStore from '@/stores/useUserStore'

export default function UploadSelfie() {
    const router = useRouter()

    const [governmentIdSelfie, setGovernmentIdSelfie] = useState<any>(null)
    console.log('selfie:', governmentIdSelfie)
    const [isTakingGovernmentIDSelfie, setIsTakingGovernmentIDSelfie] =
        useState<boolean>(false)
    const [governmentSelfieLoading, setGovernmentSelfieLoading] =
        useState<boolean>(false)
    const [uploadedImages, setUploadedImages] = useState<{
        governmentIdSelfie: File | Blob | null
    }>({
        governmentIdSelfie: null,
    })
    const [errors, setErrors] = useState<{
        governmentIdSelfie: string
    }>({
        governmentIdSelfie: '',
    })

    //show selfie guide
    const [showGuide, setShowGuide] = useState<boolean>(false)
    useEffect(() => {
        setShowGuide(true)
    }, [])

    //handling upload
    const handleCapture = async (imgSrc: File, isPrimaryId: boolean) => {
        console.log('PRIMARY ID SELFIE', imgSrc.size / 1024 / 1024)
        new Compressor(imgSrc, {
            quality: 1,
            convertTypes: ['image/jpeg', 'image/png'],
            strict: true,
            width: 1200,
            height: 1200,
            resize: 'contain',
            success: async (result) => {
                console.log('RESULT COMPRESSED', result.size / 1024 / 1024)

                const image = URL.createObjectURL(result)
                setGovernmentIdSelfie(image)
                setUploadedImages((prevState) => ({
                    ...prevState,
                    governmentIdSelfie: result,
                }))
                setIsTakingGovernmentIDSelfie(false)
            },
        })
    }

    const handleSelfieFileChange = async (file: any) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png'
        if (!isJpgOrPng) {
            setErrors((prevState) => ({
                ...prevState,
                governmentIdSelfie: 'You can only upload JPG/PNG file!',
            }))
            return
        }

        console.log('FILE SIZE IN MB', file.size / 1024 / 1024)
        new Compressor(file, {
            quality: 1,
            convertTypes: ['image/jpeg', 'image/png'],
            strict: true,
            width: 1000,
            height: 1000,
            resize: 'contain',
            success: async (result) => {
                console.log('RESULT COMPRESSED', result.size / 1024 / 1024)
                const isLt3M = result.size / 1024 / 1024 < 3
                if (!isLt3M) {
                    setErrors((prevState) => ({
                        ...prevState,
                        governmentIdSelfie: 'Image must be smaller than 3MB!',
                    }))
                    return
                }

                const image = URL.createObjectURL(result)
                setGovernmentIdSelfie(image)
                setUploadedImages((prevState) => ({
                    ...prevState,
                    governmentIdSelfie: result,
                }))
            },
        })

        setErrors({
            governmentIdSelfie: '',
        })
    }

    const triggerValidation = async () => {
        const userToken = useUserStore.getState().userToken
        try {
            const response = await fetch(
                `${API_URL}/ekyc/id-selfie/validate/`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            )

            const data = await response.json()
            if (response.ok) {
                console.log('Started validation process')
            } else {
                console.log('Failed to start validation process')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const user = useUserStore((state) => state.user)
    const onSelfieSubmit = async () => {
        setGovernmentSelfieLoading(true)
        const userToken = useUserStore.getState().userToken
        console.log('DATA', {
            selfie: uploadedImages.governmentIdSelfie,
        })

        if (uploadedImages?.governmentIdSelfie === null) {
            toast.error('Please upload seflie with your government ID.')
            setGovernmentSelfieLoading(false)
            return
        }

        try {
            const formData = new FormData()
            formData.append(
                'image',
                uploadedImages?.governmentIdSelfie,
                `${user.email}_selfie.jpg`
            )
            const response = await fetch(`${API_URL}/ekyc/id-selfie/upload/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
                body: formData,
            })

            const data = await response.json()
            console.log('upload documents response:', data)
            if (response.ok) {
                triggerValidation()
                setGovernmentSelfieLoading(false)
                toast.success('Successfully uploaded selfie.')
                router.push('/auth/signup/onboarding/checklist')
            } else {
                setGovernmentSelfieLoading(false)
                toast.error(`Error: Failed to upload selfie. ${data.error}`)
            }
        } catch (error) {
            toast.error(
                'Service not available right now. Please try again later.'
            )
            setGovernmentSelfieLoading(false)
            console.error('Error:', error)
        }
    }

    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                <div className="bg-white rounded-xl shadow-2xl p-10 w-[90%] md:w-[50%] overflow-y-auto my-[40px]">
                    <div className="w-full flex justify-between items-center mb-6">
                        <button
                            className="mb-[30px] flex items-center cursor-pointer"
                            onClick={() =>
                                router.push('/auth/signup/onboarding/checklist')
                            }
                        >
                            <ArrowLeft size={15} color={colors.tertiary} />
                            <h2 className="text-sm md:text-md font-semibold text-tertiary ml-[10px]">
                                Return to Checklist
                            </h2>
                        </button>
                    </div>
                    <div className="flex flex-col w-full items-center mb-[20px]">
                        <div className="text-[30px] md:text-[40px] text-center font-bold text-tertiary mb-4 2sm:mb-6 text-center">
                            Take a selfie with your ID
                        </div>
                        <div className="text-[16px] 2sm:text-[20px] text-[#121212] mb-2 text-center">
                            {isTakingGovernmentIDSelfie
                                ? 'Hold the same valid ID next toyour face. Make sure that your face and your ID are clearly visible.'
                                : "Upload an image or take a selfie using device's camera"}
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center">
                        <div className="w-full md:w-[80%] mb-[30px]">
                            {isTakingGovernmentIDSelfie ? (
                                <>
                                    <CameraModal
                                        open={isTakingGovernmentIDSelfie}
                                        isPrimaryId={true}
                                        onClose={() =>
                                            setIsTakingGovernmentIDSelfie(false)
                                        }
                                        onCapture={(
                                            imgSrc: File,
                                            isPrimaryId: boolean
                                        ) => handleCapture(imgSrc, isPrimaryId)}
                                        type="selfie"
                                    />
                                    {/* Add cancel button */}
                                    <button
                                        onClick={() => {
                                            setIsTakingGovernmentIDSelfie(false)
                                        }}
                                        className="w-full h-8 bg-tertiary text-white rounded-lg"
                                    >
                                        Cancel
                                    </button>
                                </>
                            ) : null}

                            {showGuide ? (
                                <div className="block border border-[#121212] rounded-lg p-2 mb-2">
                                    <div className="flex justify-between items-center">
                                        <h6 className="text-h5 font-bold text-start text-[#121212]">
                                            Selfie with ID Guide
                                        </h6>
                                        <div
                                            className="cursor-pointer"
                                            onClick={() => setShowGuide(false)}
                                        >
                                            <X size={24} color="red" />
                                        </div>
                                    </div>
                                    <Image
                                        src="/selfie-guide.png"
                                        alt="Selfie Guide"
                                        width={400}
                                        height={400}
                                        className="w-full"
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="w-full h-full">
                                        {governmentIdSelfie ? (
                                            <div className="w-full h-full flex justify-between p-2 border border-[#121212] rounded-lg relative">
                                                <img
                                                    src={governmentIdSelfie}
                                                    alt="Uploaded file"
                                                    className="w-full h-full object-cover rounded-lg"
                                                    loading="lazy"
                                                />
                                                {/* Image Name */}
                                                <button
                                                    className="absolute top-4 right-4"
                                                    onClick={() => {
                                                        setGovernmentIdSelfie(
                                                            null
                                                        )
                                                        setUploadedImages(
                                                            (prevState) => ({
                                                                ...prevState,
                                                                governmentIdSelfie:
                                                                    null,
                                                            })
                                                        )
                                                    }}
                                                >
                                                    <Trash
                                                        size={24}
                                                        stroke="#df2b2b"
                                                    />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                {!isTakingGovernmentIDSelfie && (
                                                    <div className="flex flex-col gap-2">
                                                        <label
                                                            htmlFor="selfieUpload"
                                                            className="border border-[#121212] w-full h-8 text-[#121212] flex flex-row items-center justify-center gap-1 cursor-pointer rounded-md"
                                                        >
                                                            <ArrowUpFromLine
                                                                size={20}
                                                                className="black"
                                                            />
                                                            <h5 className="text-[12px] text-[#121212] font-bold leading-5">
                                                                Choose photo
                                                            </h5>
                                                        </label>
                                                        <input
                                                            id="selfieUpload"
                                                            type="file"
                                                            accept=".jpg,.png,.jpeg"
                                                            style={{
                                                                display: 'none',
                                                            }}
                                                            onChange={(e) => {
                                                                const file =
                                                                    e.target
                                                                        .files?.[0]
                                                                if (file) {
                                                                    handleSelfieFileChange(
                                                                        file
                                                                    )
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            className="border border-[#121212] w-full h-8 text-[#121212] flex flex-row items-center justify-center gap-1 cursor-pointer rounded-lg"
                                                            onClick={() =>
                                                                setIsTakingGovernmentIDSelfie(
                                                                    true
                                                                )
                                                            }
                                                        >
                                                            <Camera
                                                                size={20}
                                                                color="black"
                                                            />
                                                            <h5 className="text-[12px] text-[#121212] font-bold leading-5">
                                                                Take a photo
                                                            </h5>
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="w-full h-full flex flex-col items-center gap-4">
                                        {governmentSelfieLoading ? (
                                            <button
                                                className="w-full rounded-lg p-2 flex justify-center items-center gap-2 bg-tertiary mt-6"
                                                disabled={
                                                    governmentSelfieLoading
                                                }
                                            >
                                                <Loader2
                                                    size={24}
                                                    className="w-6 h-6 animate-spin text-white"
                                                />
                                                <p className="text-white font-poppins">
                                                    Uploading...
                                                </p>
                                            </button>
                                        ) : (
                                            <>
                                                <div className="w-full mt-6 mb-2 text-center">
                                                    <button
                                                        className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                                        onClick={() => {
                                                            onSelfieSubmit()
                                                        }}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

const createImageBlob = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = () => {
            const img = new window.Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                canvas.width = img.width
                canvas.height = img.height
                const ctx = canvas.getContext('2d')
                ctx?.drawImage(img, 0, 0)
                canvas.toBlob((blob) => {
                    if (blob) {
                        blobToBase64(blob).then((base64data) => {
                            resolve(base64data)
                        })
                    } else {
                        throw new Error('Failed to create Blob')
                    }
                }, 'image/jpeg') // Change the type here if needed
            }
            img.src = reader.result as string
        }
        reader.readAsDataURL(file)
    })
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
            resolve(reader.result as string)
        }
        reader.readAsDataURL(blob)
    })
}
