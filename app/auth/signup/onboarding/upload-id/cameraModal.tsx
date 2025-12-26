import React, { useRef, useState, useCallback, useEffect } from 'react'
// import { useAppDispatch } from "../../lib/hook";
// import { savetertiaryIdSelfie } from "../../store/slices/buyerOnboardingSlice";

import { Button } from 'antd'

import Webcam from 'react-webcam'
import { Aperture, ArrowLeftRight, Camera, CameraOff } from 'lucide-react'
import { colors } from '@/constants/themes'

interface Props {
    open?: boolean
    isPrimaryId: boolean
    onClose: () => void
    isQrCode?: boolean
    onCapture: (imgSrc: File, from: boolean) => void
    isSuccess?: boolean
    stopCamera?: boolean
    type?: string
}

const CameraModal: React.FC<Props> = ({
    open,
    isPrimaryId,
    onClose,
    onCapture,
    isQrCode,
    isSuccess,
    stopCamera,
    type,
}) => {
    // const dispatch = useAppDispatch();
    const webcamRef = useRef<Webcam>(null)
    const [imgSrc, setImgSrc] = useState<string | null>(null)
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
    const [notAllowed, setNotAllowed] = useState<boolean>(false)
    const [isWebcamOn, setIsWebcamOn] = useState<boolean>(false)

    const convertToJpeg = (imageData: string) => {
        const fileName = isPrimaryId
            ? 'primary_id_selfie'
            : 'secondary_id_selfie' // Desired filename

        // Convert base64 string to Blob
        const byteString = atob(imageData.split(',')[1])
        const mimeString = imageData.split(',')[0].split(':')[1].split(';')[0]
        const ab = new ArrayBuffer(byteString.length)
        const ia = new Uint8Array(ab)
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
        }
        const blob = new Blob([ab], { type: mimeString })

        // Create a new File object with the desired filename
        const file = new File([blob], fileName, { type: mimeString })

        // Create a FormData object and append the file
        const formData = new FormData()
        formData.append('file', file)

        // Replace this with your API call to save the image
        onCapture(file, isPrimaryId)
    }

    const capture = useCallback(() => {
        const convertWebPToJPEG = (webPBase64: string) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const image = new Image()

            image.onload = function () {
                canvas.width = image.width
                canvas.height = image.height
                ctx?.drawImage(image, 0, 0)

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const reader = new FileReader()
                            reader.readAsDataURL(blob)
                            reader.onloadend = () => {
                                const base64data = reader.result as string
                                setImgSrc(base64data)
                                // if (istertiaryId) dispatch(savetertiaryIdSelfie(base64data));
                                // else dispatch(savetertiaryIdSelfie(base64data));
                                convertToJpeg(base64data)
                            }
                        }
                    },
                    'image/jpeg', // Convert to JPEG format
                    1 // Image quality (0 to 1)
                )
            }

            image.src = webPBase64
        }

        const imageSrc = webcamRef.current?.getScreenshot()
        convertWebPToJPEG(imageSrc as string)
        setImgSrc(imageSrc as string)
    }, [webcamRef, setImgSrc, isPrimaryId])

    const scanQRCode = () => {
        if (webcamRef.current && isQrCode) {
            const imageSrc = webcamRef.current.getScreenshot()

            const convertWebPToJPEG = (webPBase64: string) => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                const image = new Image()

                image.onload = function () {
                    canvas.width = image.width
                    canvas.height = image.height
                    ctx?.drawImage(image, 0, 0)

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const reader = new FileReader()
                                reader.readAsDataURL(blob)
                                reader.onloadend = () => {
                                    const base64data = reader.result as string
                                    setImgSrc(base64data)
                                    convertToJpeg(base64data)
                                }
                            }
                        },
                        'image/jpeg', // Convert to JPEG format
                        1 // Image quality (0 to 1)
                    )
                }

                image.src = webPBase64
            }

            convertWebPToJPEG(imageSrc as string)
            setImgSrc(imageSrc as string)
        }
    }

    useEffect(() => {
        const interval = setInterval(scanQRCode, 1000) // Scan every second

        return () => clearInterval(interval)
    }, [webcamRef])

    useEffect(() => {
        if (stopCamera === true) {
            const stream = webcamRef.current?.video!.srcObject as MediaStream
            if (stream) {
                const tracks = stream.getTracks()

                tracks.forEach((track) => {
                    track.stop()
                })
            }
        }
    }, [stopCamera])

    // create a useEffect where if the device is mobile, set the facingMode to "environment"
    useEffect(() => {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
        console.log('isMobile:', isMobile)
        if (isMobile) {
            setFacingMode('environment')
        } else {
            setFacingMode('user')
        }
    }, [])

    return (
        <div className=" flex flex-col items-center justify-center gap-4 p-5">
            {notAllowed ? (
                <div className="bg-tertiary w-full h-[150] xxs:p-10 xs:p-10 sm:p-10 tablet:p-15 laptop:p-20 desktop:p-20 flex flex-col items-center gap-4 rounded-lg">
                    <h1 className="text-white text-[30px]">
                        Camera access is not allowed.
                    </h1>
                    <h1 className="text-white text-[16px]">
                        Go to your browser settings and allow camera access.
                    </h1>
                </div>
            ) : (
                <>
                    {isQrCode ? (
                        isWebcamOn && (
                            <div>
                                <Webcam
                                    audio={false}
                                    height={800}
                                    width={800}
                                    ref={webcamRef}
                                    className="rounded-xl"
                                    videoConstraints={{
                                        facingMode: facingMode,
                                    }}
                                    onUserMediaError={(error) => {
                                        console.log('error', error)
                                        if (
                                            error
                                                .toString()
                                                .includes('Permission denied')
                                        ) {
                                            setNotAllowed(true)
                                        }
                                    }}
                                />
                            </div>
                        )
                    ) : (
                        <div className="relative">
                            <Webcam
                                audio={false}
                                height={800}
                                width={800}
                                ref={webcamRef}
                                className="rounded-xl"
                                videoConstraints={{
                                    facingMode: facingMode,
                                }}
                                onUserMediaError={(error) => {
                                    console.log('error', error)
                                    if (
                                        error
                                            .toString()
                                            .includes('Permission denied')
                                    ) {
                                        setNotAllowed(true)
                                    }
                                }}
                            />
                        </div>
                    )}
                    <div className="flex gap-2 items-center">
                        <button
                            onClick={capture}
                            className="rounded-full w-12 h-12 desktop:w-16 desktop:h-16 border-4 border-tertiary flex justify-center items-center"
                        >
                            <Aperture size={30} color={colors.tertiary} />
                        </button>
                        <button
                            onClick={() => {
                                setFacingMode(
                                    facingMode === 'user'
                                        ? 'environment'
                                        : 'user'
                                )
                            }}
                            className="rounded-full w-12 h-12 desktop:w-16 desktop:h-16 bg-tertiary border-4 border-tertiary text-white flex justify-center items-center text-center"
                        >
                            <ArrowLeftRight
                                size={24}
                                color={colors.tertiary}
                                className="w-6 h-6 desktop:w-8 desktop:h-8"
                            />
                        </button>
                        {/* Switch Camera */}
                    </div>
                </>
            )}
        </div>
    )
}

export default CameraModal
