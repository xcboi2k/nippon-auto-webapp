/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { Divider, Select } from 'antd'
import { ArrowUpFromLine, Camera, Loader2, Trash } from 'lucide-react'
import { AiOutlineLoading } from 'react-icons/ai'
import Compressor from 'compressorjs'
import { toast } from 'react-toastify'
import { useRouter } from 'nextjs-toploader/app'

import { API_URL } from '@/constants/api'
import CameraModal from './cameraModal'
import UploadStatusView from '@/components/UploadStatusView'
import OnboardingStepper from '@/components/OnboardingStepper'
import TextInput from '@/components/TextInput'
import Dropdown from '@/components/Dropdown'
import Footer from '@/components/Footer'
import useUserStore from '@/stores/useUserStore'
import useOnboardingStore from '@/stores/useOnboardingStore'

type Options = {
    value: string
    label: string
}

interface FormData {
    documentNumber: string
}

export default function UploadID() {
    const router = useRouter()

    const [loading, setLoading] = useState(false)
    const [documentsUploaded, setDocumentsUploaded] = useState('')
    const [selfieUploaded, setSelfieUploaded] = useState('')
    const setIsStep4Rejected = useOnboardingStore(
        (state) => state.setIsStep4Rejected
    )
    const checkDocumentUploadProgress = async () => {
        const userToken = useUserStore.getState().userToken
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/ekyc/onboarding/`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
            })
            const data = await response.json()
            // console.log('Fetched progress details.', data)
            if (response.ok) {
                if (data?.id_card_is_verified === null) {
                    setDocumentsUploaded('ongoing')
                } else if (data?.id_card_is_verified === true) {
                    setDocumentsUploaded('approved')
                } else {
                    setDocumentsUploaded('')
                }

                // setDocumentsUploaded('retry')
                setLoading(false)
            } else {
                setLoading(false)
            }
        } catch (error) {
            console.error('Error fetching progress:', error)
            setLoading(false)
        }
    }

    useEffect(() => {
        checkDocumentUploadProgress()
    }, [])

    const [governmentIdType, setGovernmentIdType] = useState<Options | null>(
        null
    )
    console.log('Selected government ID:', governmentIdType)
    const [frontIdPhotoCamera, setFrontIdPhotoCamera] = useState<boolean>(false)
    const [governmentIdImageFront, setGovernmentIdImageFront] =
        useState<any>(null)
    const [governmentIdImageBack, setGovernmentIdImageBack] =
        useState<any>(null)
    const [uploadedImages, setUploadedImages] = useState<{
        governmentIdFront: File | Blob | null
        governmentIdBack: File | Blob | null
    }>({
        governmentIdFront: null,
        governmentIdBack: null,
    })
    const [idErrors, setIdErrors] = useState<{
        governmentIdType: string
        governmentIdFront: string
        governmentIdBack: string
    }>({
        governmentIdType: '',
        governmentIdFront: '',
        governmentIdBack: '',
    })

    const [governmentIdLoading, setGovernmentIdLoading] =
        useState<boolean>(false)

    // fetch id types
    const [idTypes, setIdTypes] = useState<Options[]>([])
    useEffect(() => {
        async function fetchIDs() {
            try {
                const response = await fetch(
                    `${API_URL}/ekyc/id/info/document-types`,
                    {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                )
                const data = await response.json()
                console.log('valid ids:', data)
                const editedData =
                    data?.map((item: any) => ({
                        value: item.abbreviation,
                        label: item.name,
                    })) || []
                setIdTypes(editedData)
            } catch (error) {
                console.log(error)
            }
        }
        fetchIDs()
    }, [])

    // handling upload
    const handleCaptureId = async ({
        imgSrc,
        front,
    }: {
        imgSrc: any
        front: boolean
    }) => {
        new Compressor(imgSrc, {
            quality: 2,
            convertTypes: ['image/jpeg', 'image/png'],
            strict: true,
            width: 1000,
            height: 1000,
            resize: 'contain',

            success: async (result) => {
                console.log('RESULT COMPRESSED', result.size / 1024 / 1024)

                if (front) {
                    setGovernmentIdImageFront(URL.createObjectURL(result))
                    setUploadedImages((prev) => ({
                        ...prev,
                        governmentIdFront: result,
                    }))
                } else {
                    setGovernmentIdImageBack(URL.createObjectURL(result))
                    setUploadedImages((prev) => ({
                        ...prev,
                        governmentIdBack: result,
                    }))
                }
            },
        })
    }

    const handleFileChange = async ({
        file,
        front,
    }: {
        file: any
        front: boolean
    }) => {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png'

        if (!isJpgOrPng) {
            setIdErrors((prev) => ({
                ...prev,
                [front ? 'governmentIdFront' : 'governmentIdBack']:
                    'You can only upload JPG/PNG file!',
            }))
            return
        }

        new Compressor(file, {
            quality: 0.8,
            width: 800,
            height: 800,
            resize: 'contain',

            success: async (result) => {
                const isLt3M = result.size / 1024 / 1024 < 3
                if (!isLt3M) {
                    setIdErrors((prev) => ({
                        ...prev,
                        [front ? 'governmentIdFront' : 'governmentIdBack']:
                            'Image must be smaller than 3MB!',
                    }))
                    return
                }

                console.log('COMPRESSED:', result)

                // save file to state if your UI needs preview
                if (front) {
                    setGovernmentIdImageFront(URL.createObjectURL(result))
                    setUploadedImages((prev) => ({
                        ...prev,
                        governmentIdFront: result,
                    }))
                } else {
                    setGovernmentIdImageBack(URL.createObjectURL(result))
                    setUploadedImages((prev) => ({
                        ...prev,
                        governmentIdBack: result,
                    }))
                }
            },
        })
    }

    const triggerValidation = async () => {
        const userToken = useUserStore.getState().userToken
        try {
            const response = await fetch(`${API_URL}/ekyc/id/validate/`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${userToken}`,
                },
            })

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

    // initialize formik values
    const initialValues: FormData = { documentNumber: '' }

    const user = useUserStore((state) => state.user)
    const setIsUserInStep5 = useOnboardingStore(
        (state) => state.setIsUserInStep5
    )
    const onSubmit = async (
        values: typeof initialValues,
        {
            resetForm,
        }: { resetForm: (nextState?: { values?: FormData }) => void }
    ) => {
        setGovernmentIdLoading(true)
        const userToken = useUserStore.getState().userToken
        console.log('DATA', {
            front_image: uploadedImages.governmentIdFront,
            back_image: uploadedImages.governmentIdBack,
            id_type: governmentIdType?.value,
            document_type: 'primary',
        })

        if (uploadedImages?.governmentIdFront === null) {
            toast.error('Please upload your Documents.')
            setGovernmentIdLoading(false)
            return
        } else if (
            uploadedImages?.governmentIdFront !== null &&
            governmentIdType === null
        ) {
            toast.error('Please select an ID type.')
            setGovernmentIdLoading(false)
            return
        } else {
            try {
                const formData = new FormData()
                formData.append('document_number', values.documentNumber)
                formData.append(
                    'document_type',
                    String(governmentIdType?.value || '')
                )
                formData.append(
                    'image',
                    uploadedImages?.governmentIdFront,
                    `${user.email}_id.jpg`
                )
                console.log('upload form:', formData)
                const response = await fetch(`${API_URL}/ekyc/id/upload/`, {
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
                    setGovernmentIdLoading(false)
                    setIsStep4CompletedTrue()
                    setIsUserInStep5()
                    triggerValidation()
                    toast.success('Successfully uploaded documents.')
                    router.push('/auth/signup/onboarding/upload-selfie')
                } else {
                    setGovernmentIdLoading(false)
                    toast.error(
                        `Error: Failed to upload documents. ${data.message}`
                    )
                }
            } catch (error) {
                toast.error(
                    'Service not available right now. Please try again later.'
                )
                setGovernmentIdLoading(false)
                console.error('Error:', error)
            }
        }
    }

    const validationSchema = Yup.object().shape({
        documentNumber: Yup.string().required('ID Number is required').max(64),
    })

    //back
    const setIsUserInStep3 = useOnboardingStore(
        (state) => state.setIsUserInStep3
    )
    const handleBack = () => {
        //clear
        // setPrimaryIDFront(null)
        // setPrimaryIDBack(null)
        // setSelectedPrimaryGovernmentID(null)
        // set then navigate
        setIsUserInStep3()
        router.push('/auth/signup/onboarding/liveness-check')
    }
    // skip
    const isStep4Completed = useOnboardingStore(
        (state) => state.isStep4Completed
    )
    const setIsStep4CompletedFalse = useOnboardingStore(
        (state) => state.setIsStep4CompletedFalse
    )
    const setIsStep5CompletedFalse = useOnboardingStore(
        (state) => state.setIsStep5CompletedFalse
    )
    const setIsUserInStep6 = useOnboardingStore(
        (state) => state.setIsUserInStep6
    )
    const handleSkip = () => {
        //clear
        // setPrimaryIDFront(null)
        // setPrimaryIDBack(null)
        // setSelectedPrimaryGovernmentID(null)
        // set then navigate
        if (documentsUploaded === '') {
            setIsStep4CompletedFalse()
            setIsStep5CompletedFalse()
            setIsUserInStep6()
            router.push('/auth/signup/onboarding/setup-linked-account')
        }
        if (
            documentsUploaded === 'ongoing' ||
            documentsUploaded === 'approved'
        ) {
            setIsStep4CompletedTrue()
            setIsStep5CompletedFalse()
            setIsUserInStep5()
            router.push('/auth/signup/onboarding/upload-selfie')
        }
    }
    //proceed
    const setIsStep4CompletedTrue = useOnboardingStore(
        (state) => state.setIsStep4CompletedTrue
    )
    const handleProceed = () => {
        setIsStep4CompletedTrue()
        setIsUserInStep5()
        router.push('/auth/signup/onboarding/upload-selfie')
    }

    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                <div className="bg-white rounded-xl shadow-2xl p-10 w-[90%] md:w-[50%] overflow-y-auto my-[40px]">
                    <div className="w-full border-b-2 border-tertiary mb-[20px]">
                        <OnboardingStepper
                            stepNumber={'4a'}
                            stepTitle={'Upload ID'}
                            onPressBack={handleBack}
                            onPressSkip={handleSkip}
                            isStepCompleted={
                                documentsUploaded === 'ongoing' ||
                                documentsUploaded === 'approved'
                            }
                        />
                    </div>
                    {loading ? (
                        <div className="w-full px-5 md:px-[50px] lg:px-[70px] mb-[50px]">
                            <div className="flex items-center justify-center mt-[20px]">
                                <AiOutlineLoading className="text-tertiary animate-spin text-[100px]" />
                            </div>
                        </div>
                    ) : (
                        <>
                            {['ongoing', 'approved', 'retry'].includes(
                                documentsUploaded
                            ) ? (
                                <UploadStatusView
                                    status={documentsUploaded}
                                    onProceed={handleProceed}
                                    onReject={() => setDocumentsUploaded('')}
                                />
                            ) : (
                                <>
                                    <h2 className="text-[30px] md:text-[40px] text-center font-semibold text-tertiary text-center mb-6">
                                        Upload your valid ID
                                    </h2>

                                    <div className="text-[16px] 2sm:text-[20px] text-[#121212] mb-2 text-center">
                                        Upload a clear photo of a valid
                                        government-issued ID to confirm your
                                        identity.
                                    </div>

                                    <div className="w-full flex flex-col items-center justify-center">
                                        <Formik
                                            initialValues={initialValues}
                                            onSubmit={onSubmit}
                                            validationSchema={validationSchema}
                                        >
                                            {({
                                                values,
                                                errors,
                                                touched,
                                                handleChange,
                                            }) => (
                                                <Form className="w-full max-w-md">
                                                    <div className="w-full mb-[30px]">
                                                        <div
                                                            className={`w-full border-2 border-tertiary p-4 bg-white-50 rounded-[10px] flex`}
                                                        >
                                                            <Dropdown
                                                                selectedOption={
                                                                    governmentIdType
                                                                }
                                                                setSelectedOption={
                                                                    setGovernmentIdType
                                                                }
                                                                options={
                                                                    idTypes
                                                                }
                                                                placeholder="Select ID type"
                                                            />
                                                        </div>
                                                        {idErrors.governmentIdType && (
                                                            <h6 className="text-[12px]  text-[#121212]">
                                                                {
                                                                    idErrors.governmentIdType
                                                                }
                                                            </h6>
                                                        )}
                                                    </div>
                                                    <div className="w-full mb-[30px]">
                                                        <h6 className="text-[12px] font-bold  text-start text-[#121212]">
                                                            Front Id
                                                        </h6>

                                                        {governmentIdImageFront ? (
                                                            <div className="w-full h-full flex justify-between p-2 border border-[#121212] rounded-lg relative">
                                                                <img
                                                                    src={
                                                                        governmentIdImageFront
                                                                    }
                                                                    alt="Uploaded file"
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                    loading="lazy"
                                                                />
                                                                {/* Image Name */}
                                                                <button
                                                                    className="absolute top-4 right-4"
                                                                    onClick={() => {
                                                                        setGovernmentIdImageFront(
                                                                            null
                                                                        )
                                                                        setUploadedImages(
                                                                            (
                                                                                prevState
                                                                            ) => ({
                                                                                ...prevState,
                                                                                governmentIdFront:
                                                                                    null,
                                                                            })
                                                                        )
                                                                    }}
                                                                >
                                                                    <Trash
                                                                        size={
                                                                            24
                                                                        }
                                                                        stroke="#df2b2b"
                                                                    />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {!frontIdPhotoCamera ? (
                                                                    <>
                                                                        {' '}
                                                                        <div>
                                                                            <button
                                                                                className="border border-[#121212] w-full h-8 text-[#121212]  flex flex-row items-center justify-center gap-1 cursor-pointer rounded-lg"
                                                                                onClick={() =>
                                                                                    setFrontIdPhotoCamera(
                                                                                        true
                                                                                    )
                                                                                }
                                                                            >
                                                                                <Camera
                                                                                    size={
                                                                                        20
                                                                                    }
                                                                                    color="black"
                                                                                />
                                                                                <h5 className="text-[12px] text-[#121212] font-bold leading-5">
                                                                                    Take
                                                                                    a
                                                                                    photo
                                                                                </h5>
                                                                            </button>
                                                                        </div>
                                                                        <Divider
                                                                            style={{
                                                                                borderColor:
                                                                                    '#121212',
                                                                            }}
                                                                        >
                                                                            or
                                                                        </Divider>
                                                                        <label
                                                                            htmlFor="fileUploadFront"
                                                                            className="w-full h-full border-2 border-[#121212] border-dashed rounded-lg flex flex-col items-center justify-center gap-2 py-2 cursor-pointer px-2 md:px-0"
                                                                        >
                                                                            <ArrowUpFromLine
                                                                                size={
                                                                                    24
                                                                                }
                                                                                className="text-[#121212]"
                                                                            />
                                                                            <h5 className="text-[16px] text-center font-bold text-[#121212]">
                                                                                Click
                                                                                to
                                                                                browse
                                                                                files
                                                                                and
                                                                                upload
                                                                            </h5>
                                                                            <h6 className="text-[12px] text-[#121212]">
                                                                                Supported
                                                                                format:
                                                                                JPG,
                                                                                PNG
                                                                                or
                                                                                PDF
                                                                            </h6>
                                                                            <h6 className="text-[12px] text-[#121212]">
                                                                                Max.
                                                                                file
                                                                                size:
                                                                                3
                                                                                MB
                                                                            </h6>
                                                                            <input
                                                                                id="fileUploadFront"
                                                                                type="file"
                                                                                accept=".jpg,.png,.jpeg"
                                                                                style={{
                                                                                    display:
                                                                                        'none',
                                                                                }}
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    const file =
                                                                                        e
                                                                                            .target
                                                                                            .files?.[0]
                                                                                    if (
                                                                                        file
                                                                                    ) {
                                                                                        handleFileChange(
                                                                                            {
                                                                                                file: file,
                                                                                                front: true,
                                                                                            }
                                                                                        )
                                                                                    }
                                                                                }}
                                                                            />
                                                                        </label>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <CameraModal
                                                                            open={
                                                                                frontIdPhotoCamera
                                                                            }
                                                                            onClose={() =>
                                                                                setFrontIdPhotoCamera(
                                                                                    false
                                                                                )
                                                                            }
                                                                            isPrimaryId={
                                                                                true
                                                                            }
                                                                            onCapture={(
                                                                                imgSrc: File
                                                                            ) =>
                                                                                handleCaptureId(
                                                                                    {
                                                                                        imgSrc: imgSrc,
                                                                                        front: true,
                                                                                    }
                                                                                )
                                                                            }
                                                                            type="documents"
                                                                        />
                                                                        {/* Cancel Button */}
                                                                        <button
                                                                            className="w-full h-8 bg-tertiary text-white rounded-lg"
                                                                            onClick={() =>
                                                                                setFrontIdPhotoCamera(
                                                                                    false
                                                                                )
                                                                            }
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </>
                                                        )}
                                                        {idErrors.governmentIdFront && (
                                                            <h6 className="text-[12px]  text-[#121212]">
                                                                {
                                                                    idErrors.governmentIdFront
                                                                }
                                                            </h6>
                                                        )}
                                                    </div>
                                                    {/* <div className="w-full mb-[30px]">
                                                        <h6 className="text-[12px] font-bold  text-start text-[#121212]">
                                                            Back Id (Optional)
                                                        </h6>
                                                        <div>
                                                            <button
                                                                className="border border-[#121212] w-full h-8 text-[#121212]  flex flex-row items-center justify-center gap-1 cursor-pointer rounded-lg"
                                                                onClick={() =>
                                                                    // setIsTakingPrimarySelfie(true)
                                                                    console.log(
                                                                        'Take a photo'
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
                                                        <Divider
                                                            style={{
                                                                borderColor:
                                                                    '#121212',
                                                            }}
                                                        >
                                                            {' '}
                                                            or{' '}
                                                        </Divider>

                                                        {governmentIdImageBack ? (
                                                            <div className="w-full h-full flex justify-between p-2 border border-[#121212] rounded-lg relative">
                                                                <img
                                                                    src={
                                                                        governmentIdImageBack
                                                                    }
                                                                    alt="Uploaded file"
                                                                    className="w-full h-full object-cover rounded-lg"
                                                                    loading="lazy"
                                                                />
                                                                <button
                                                                    className="absolute top-4 right-4"
                                                                    onClick={() => {
                                                                        setGovernmentIdImageBack(
                                                                            null
                                                                        )
                                                                        setUploadedImages(
                                                                            (
                                                                                prevState
                                                                            ) => ({
                                                                                ...prevState,
                                                                                governmentIdBack:
                                                                                    null,
                                                                            })
                                                                        )
                                                                    }}
                                                                >
                                                                    <Trash
                                                                        size={
                                                                            24
                                                                        }
                                                                        stroke="#df2b2b"
                                                                    />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <label
                                                                htmlFor="fileUploadBack"
                                                                className="w-full h-full border-2 border-[#121212] border-dashed rounded-lg flex flex-col items-center justify-center gap-2 py-2 cursor-pointer px-2 md:px-0"
                                                            >
                                                                <ArrowUpFromLine
                                                                    size={24}
                                                                    className="text-[#121212]"
                                                                />
                                                                <h5 className="text-[16px] text-center font-bold text-[#121212]">
                                                                    Click to
                                                                    browse files
                                                                    and upload
                                                                </h5>
                                                                <h6 className="text-[12px] text-[#121212]">
                                                                    Supported
                                                                    format: JPG,
                                                                    PNG or PDF
                                                                </h6>
                                                                <h6 className="text-[12px] ext-[#121212]">
                                                                    Max. file
                                                                    size: 3 MB
                                                                </h6>
                                                                <input
                                                                    id="fileUploadBack"
                                                                    type="file"
                                                                    accept=".jpg,.png,.jpeg"
                                                                    style={{
                                                                        display:
                                                                            'none',
                                                                    }}
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        const file =
                                                                            e
                                                                                .target
                                                                                .files?.[0]
                                                                        if (
                                                                            file
                                                                        ) {
                                                                            handleFileChange(
                                                                                {
                                                                                    file: file,
                                                                                    front: false,
                                                                                }
                                                                            )
                                                                        }
                                                                    }}
                                                                />
                                                            </label>
                                                        )}
                                                        {idErrors.governmentIdBack && (
                                                            <h6 className="text-[12px]  text-[#121212]">
                                                                {
                                                                    idErrors.governmentIdBack
                                                                }
                                                            </h6>
                                                        )}
                                                    </div> */}
                                                    <TextInput
                                                        placeholderText="Enter your ID number"
                                                        id="documentNumber"
                                                        name="documentNumber"
                                                        value={
                                                            values.documentNumber
                                                        }
                                                        onChangeInput={
                                                            handleChange
                                                        }
                                                        errorMessage={
                                                            touched.documentNumber &&
                                                            errors.documentNumber
                                                                ? errors.documentNumber
                                                                : undefined
                                                        }
                                                    />
                                                    <div className="w-full h-full flex flex-col items-center gap-4">
                                                        {governmentIdLoading ? (
                                                            <button
                                                                className="w-full rounded-lg p-2 flex justify-center items-center gap-2 bg-tertiary"
                                                                disabled={
                                                                    governmentIdLoading
                                                                }
                                                            >
                                                                <Loader2
                                                                    size={24}
                                                                    className="w-6 h-6 animate-spin text-white"
                                                                />
                                                                <p className="text-white ">
                                                                    Uploading...
                                                                </p>
                                                            </button>
                                                        ) : (
                                                            <>
                                                                <div className="w-full mt-6 mb-2 text-center">
                                                                    <button
                                                                        className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                                                        type="submit"
                                                                    >
                                                                        Submit
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </div>
            </section>
            <Footer />
        </div>
    )
}
