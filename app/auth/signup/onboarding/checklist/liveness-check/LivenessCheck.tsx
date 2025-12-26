/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ScanFace } from 'lucide-react'
import { toast } from 'react-toastify'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'

import { API_URL, WEBSOCKET_API_URL } from '@/constants/api'
import { colors } from '@/constants/themes'
import Footer from '@/components/Footer'
import useUserStore from '@/stores/useUserStore'
import useOnboardingStore from '@/stores/useOnboardingStore'

interface LivenessResponse {
    status: string
    session_id?: string
    results?: any
    instruction?: string
    error?: string
}

export default function LivenessCheck() {
    const router = useRouter()

    const windowSize =
        typeof window !== 'undefined'
            ? window.innerWidth < 640
                ? 200
                : window.innerWidth < 768
                ? 300
                : 350
            : 350

    const videoRef = useRef<HTMLVideoElement | null>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [videoLoading, setVideoLoading] = useState<boolean>(false)

    const [socket, setSocket] = useState<any>(null)
    const [instruction, setInstruction] = useState<any>(
        'Waiting for instruction...'
    )
    const [isNewInstruction, setIsNewInstruction] = useState(false)
    const instructionRef = useRef(null)
    const [livenessResult, setLivenessResult] = useState(null)
    const [started, setStarted] = useState(false)
    const [canSendFrames, setCanSendFrames] = useState(true)

    const [cameraError, setCameraError] = useState<string>('')
    useEffect(() => {
        if (videoRef.current) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then((stream) => {
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream
                        setStream(stream)
                        videoRef.current.play()
                    }
                })
                .catch((err) => {
                    console.error('Error accessing webcam: ', err)
                    setVideoLoading(true)

                    switch (err.name) {
                        case 'NotReadableError':
                            setCameraError(
                                'Camera is already in use by another application'
                            )
                            break
                        case 'NotAllowedError':
                            setCameraError('Camera access denied by user')
                            break
                        case 'NotFoundError':
                            setCameraError('No camera device found')
                            break
                        default:
                            setCameraError('Unknown camera error')
                            setVideoLoading(true)
                    }
                })
        }
    }, [videoRef, videoLoading])

    //websocket
    const connectWebSocket = () => {
        console.log('Connecting WebSocket [liveness check]...')
        const ws = new WebSocket(`ws://${WEBSOCKET_API_URL}/ws/liveness-check/`)

        ws.onopen = () => {
            console.log('✅ WebSocket connection established [liveness check]')
            setSocket(ws)
        }

        ws.onmessage = (message: any) => {
            try {
                const data = JSON.parse(message.data)
                console.log('WebSocket data:', data)

                if (data.status === 200) {
                    const responseInstruction = data.payload?.instruction

                    if (responseInstruction) {
                        setCanSendFrames(true)
                        setIsNewInstruction(true)
                        setInstruction(responseInstruction)

                        // setTimeout(() => {
                        //     setCanSendFrames(false)
                        //     setIsNewInstruction(false)
                        // }, 2000)
                    } else {
                        setCanSendFrames(false)
                    }
                }

                if (typeof data?.detail === 'string') {
                    const detail = data.detail.trim().toLowerCase()
                    if (detail.includes('successfully completed')) {
                        setCanSendFrames(false)
                        setIsNewInstruction(false)
                        setLivenessResult(data.detail)

                        setTimeout(
                            () =>
                                router.push(
                                    '/auth/signup/onboarding/checklist'
                                ),
                            1000
                        )
                    }
                }
            } catch (error) {
                console.error('WebSocket message parse error:', error)
            }
        }

        ws.onerror = (error: any) => {
            console.error('❌ WebSocket error:', error)
        }

        ws.onclose = () => {
            console.log('🔌 WebSocket connection closed [liveness check]')
        }
    }

    // Connect once on mount
    useEffect(() => {
        connectWebSocket()
        return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close(1000, 'Component unmounted')
            }
        }
    }, [])

    const captureFrame = (): Promise<Blob | null> => {
        return new Promise((resolve) => {
            if (!videoRef.current) return resolve(null)

            const canvas = document.createElement('canvas')
            canvas.width = videoRef.current.videoWidth
            canvas.height = videoRef.current.videoHeight
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0)

            canvas.toBlob((blob) => {
                resolve(blob)
            }, 'image/jpeg')
        })
    }
    const sendFrame = async (photo: any) => {
        try {
            if (socket && socket.readyState === WebSocket.OPEN) {
                if (photo) {
                    const blob = await captureFrame()

                    console.log('📤 Sending frame payload:', blob)

                    socket.send(blob)
                    console.log('Frame sent')
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        if (!canSendFrames) return

        const interval = setInterval(async () => {
            if (canSendFrames && started) {
                const photo = await captureFrame()
                sendFrame(photo)
            }
        }, 500)

        return () => clearInterval(interval)
    }, [canSendFrames, started])

    const startLivenessCheck = () => {
        setStarted(true)
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log('START')
            socket.send(JSON.stringify({ type: 'ONBOARDING' }))
        } else if (
            socket &&
            socket.readyState === WebSocket.CLOSED &&
            livenessResult === 'failure'
        ) {
            setLivenessResult(null)
            console.log('START')
            socket.send(JSON.stringify({ type: 'ONBOARDING' }))
        }
    }

    function stopCamera(stream: MediaStream | null): void {
        if (stream) {
            stream.getTracks().forEach((track: MediaStreamTrack) => {
                track.stop()
            })

            console.log('🛑 Stopping WebSocket...')
            setStarted(false)
            setInstruction(null)

            if (socket && socket.readyState === WebSocket.OPEN) {
                socket.close(1000, 'Manual stop')
                console.log('WebSocket manually closed.')
            }

            // 🔁 Reconnect after 2 seconds
            setTimeout(() => {
                console.log('♻️ Reconnecting WebSocket after manual stop...')
                connectWebSocket()
            }, 2000)
        }
    }

    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                {/* Login Overlay */}
                <div className="bg-white rounded-xl shadow-2xl p-10 w-[90%] md:w-[50%] overflow-y-auto flex flex-col items-center justify-center my-[40px]">
                    <div className="w-full flex justify-between items-center mb-6">
                        <button
                            className="mb-[30px] flex items-center cursor-pointer"
                            onClick={() => {
                                if (started) {
                                    toast.error(
                                        'Please manually stop the liveness check process first.'
                                    )
                                } else {
                                    router.push(
                                        '/auth/signup/onboarding/checklist'
                                    )
                                }
                            }}
                        >
                            <ArrowLeft size={15} color={colors.tertiary} />
                            <h2 className="text-sm md:text-md font-semibold text-tertiary ml-[10px]">
                                Return to Checklist
                            </h2>
                        </button>
                    </div>
                    {started ? (
                        <>
                            <h2 className="text-[30px] md:text-[40px] text-center font-bold text-tertiary mt-8 mb-6">
                                Liveness Check
                            </h2>
                            {instruction && (
                                <p className="text-black text-md">
                                    Instruction: {instruction}
                                </p>
                            )}
                            {livenessResult && (
                                <div className="text-black text-lg font-bold mb-4">
                                    Result:{' '}
                                    <span className="uppercase text-green-500 font-bold">
                                        {JSON.stringify(livenessResult).replace(
                                            /"/g,
                                            ' '
                                        )}
                                    </span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="w-full flex flex-col justify-between ">
                            <h2 className="text-[40px] font-bold text-tertiary text-center mb-8">
                                Verify if it's really you
                            </h2>
                            <p className="text-[18px] text-black text-center mb-8 px-10 md:px-20">
                                To confirm your consent, please complete a quick
                                liveness check. Make sure you are in a well-lit
                                environment and follow the on-screen prompts to
                                verify you’re physically present.
                            </p>
                        </div>
                    )}
                    {videoLoading ? (
                        <div className="bg-tertiary-200 w-full gap-4 h-[300px] 2xl:h-[500px] flex flex-col items-center justify-center rounded-lg mb-[30px]">
                            <h1 className="text-white text-h4">
                                Camera access is not allowed.
                            </h1>
                            <p className="text-white text-h6 w-1/2 text-center">
                                {cameraError}
                            </p>
                        </div>
                    ) : (
                        <div className="relative mb-[30px]">
                            <video
                                ref={videoRef}
                                className="rounded-lg h-[400px] w-full bg-tertiary-200"
                                playsInline
                            >
                                {/* <source src="xmasvideo/video.mp4" type="video/mp4" />
                                                                                                <source src="xmasvideo/M&P-Xmas 2.ogv" type="video/ogv" />
                                                                                                <source type="video/webm" src="xmasvideo/M&P-Xmas.webm" /> */}
                            </video>

                            {/* Overlay image */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <ScanFace size={windowSize} color="#FFFFFF80" />
                            </div>
                        </div>
                    )}
                    {started ? (
                        <button
                            type="button"
                            className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                            onClick={() => stopCamera(stream)}
                        >
                            Cancel
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="w-[30%] bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                onClick={startLivenessCheck}
                                disabled={started}
                            >
                                Start
                            </button>
                        </>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    )
}
