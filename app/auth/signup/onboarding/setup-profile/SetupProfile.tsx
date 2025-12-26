/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { AiOutlineLoading } from 'react-icons/ai'
import { FaGears, FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6'
import type { DatePickerProps } from 'antd'
import { DatePicker, Divider } from 'antd'

import { API_URL } from '@/constants/api'
import Footer from '@/components/Footer'
import TextInput from '@/components/TextInput'
import OnboardingStepper from '@/components/OnboardingStepper'
import Dropdown from '@/components/Dropdown'
import Loader from '@/components/Loader'

import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'
import useOnboardingStore from '@/stores/useOnboardingStore'
import useGetRegions from '@/hooks/useGetRegions'

interface FormData {
    firstName: string
    middleName: string
    lastName: string
    company: string
    address: string
    zipCode: string
}

type Options = {
    value: string
    label: string
}

export default function SetupProfile() {
    const router = useRouter()
    const { showLoader, hideLoader } = useLoaderStore()

    //local screen loading state
    const [loading, setLoading] = useState(false)
    const [profileSet, setProfileSet] = useState('')
    const setIsStep7Rejected = useOnboardingStore(
        (state) => state.setIsStep7Rejected
    )
    const checkProfileSetProgress = async () => {
        const userToken = useUserStore.getState().userToken
        setLoading(true)
        try {
            const response = await fetch(
                `${API_URL}/api/v1/users/user/buyer/progress-track`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        Authorization: `Token ${userToken}`,
                    },
                }
            )
            const data = await response.json()
            // console.log('Fetched progress details.', data)
            if (response.ok) {
                if (data?.profile_verification_status === 'APPROVED') {
                    setProfileSet('approved')
                } else if (
                    data?.profile_verification_status ===
                    'FURTHER_CLARIFICATION'
                ) {
                    setProfileSet('declined')
                    setIsStep7Rejected()
                }
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
        checkProfileSetProgress()
    }, [])

    // handling birth date selection
    const [selectedBirthDate, setSelectedBirthDate] = useState<string>('')
    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        // dateString is always a string when NOT using range picker
        setSelectedBirthDate(dateString as string)
    }
    console.log('SELECTED BIRTHDATE: ', selectedBirthDate)

    // handling gender selection
    const genderOptions: Options[] = [
        { label: 'Male', value: 'M' },
        { label: 'Female', value: 'F' },
    ]

    const [selectedGender, setSelectedGender] = useState<Options | null>(null)

    // handling region selection
    const { regions } = useGetRegions()
    const transformedRegions: Options[] =
        regions?.map((item) => ({
            value: item.name,
            label: item.name,
        })) || []
    console.log('regions:', regions)
    const [selectedRegion, setSelectedRegion] = useState<any>(null)
    const [fetchedProvinces, setFetchedProvinces] = useState<Options[]>([
        { value: '0', label: 'Select a region first' }, // placeholder
    ])
    const [selectedProvince, setSelectedProvince] = useState<Options | null>(
        null
    )
    const [fetchedCities, setFetchedCities] = useState<Options[]>([
        { value: '0', label: 'Select a province first' }, // placeholder
    ])
    const [selectedCity, setSelectedCity] = useState<Options | null>(null)

    const [fetchedBarangays, setFetchedBarangays] = useState<Options[]>([
        { value: '0', label: 'Select a city first' }, // placeholder
    ])
    const [selectedBarangay, setSelectedBarangay] = useState<Options | null>(
        null
    )

    // console.log('selected region:', selectedRegion)
    // console.log('selected city:', selectedCity)
    // console.log('selected barangay:', selectedBarangay)

    useEffect(() => {
        // fetch cities/municipalities based on the selected province
        const fetchProvinces = async () => {
            const response = await fetch(
                `${API_URL}/address/info/provinces/?region=${selectedRegion?.label}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                }
            )
            const data = await response.json()
            const editedData = data?.map((item: any) => ({
                value: item.name,
                label: item.name,
            }))
            console.log('provinces:', data)
            setFetchedProvinces(editedData)
        }
        if (selectedRegion) {
            fetchProvinces()
        }
    }, [selectedRegion])

    useEffect(() => {
        // fetch cities/municipalities based on the selected province
        const fetchCitiesMunicipalities = async () => {
            const response = await fetch(
                `${API_URL}/address/info/cities/?province=${selectedProvince?.label}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                }
            )
            const data = await response.json()
            const editedData = data?.map((item: any) => ({
                value: item.name,
                label: item.name,
            }))
            console.log('cities:', data)
            setFetchedCities(editedData)
        }
        if (selectedProvince) {
            fetchCitiesMunicipalities()
        }
    }, [selectedProvince])

    useEffect(() => {
        // fetch cities/municipalities based on the selected province
        const fetchBarangays = async () => {
            const response = await fetch(
                `${API_URL}/address/info/barangays/?city=${selectedCity?.label}`,
                {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                }
            )
            const data = await response.json()
            const editedData = data?.map((item: any) => ({
                value: item.name,
                label: item.name,
            }))
            console.log('barangays:', data)
            setFetchedBarangays(editedData)
        }
        if (selectedCity) {
            fetchBarangays()
        }
    }, [selectedCity])

    const user = useUserStore((state) => state.user)
    // initialize formik values
    const initialValues = {
        firstName: user?.first_name,
        middleName: user?.middle_name,
        lastName: user?.last_name,
        address: '',
        zipCode: '',
    }

    //error message states
    const [dropdownErrors, setDropdownErrors] = useState<{
        regionErrorMessage: string
        provinceErrorMessage: string
        cityErrorMessage: string
        barangayErrorMessage: string
        genderErrorMessage: string
    }>({
        regionErrorMessage: '',
        provinceErrorMessage: '',
        cityErrorMessage: '',
        barangayErrorMessage: '',
        genderErrorMessage: '',
    })

    const resetStates = () => {
        setSelectedGender(null)
        setSelectedRegion(null)
        setSelectedCity(null)
        setSelectedBarangay(null)
        setDropdownErrors((prevState) => ({
            ...prevState,
            regionErrorMessage: '',
            provinceErrorMessage: '',
            cityErrorMessage: '',
            barangayErrorMessage: '',
            genderErrorMessage: '',
        }))
    }

    const confirmProfile = async () => {
        const userToken = useUserStore.getState().userToken
        try {
            const response = await fetch(
                `${API_URL}/ekyc/ewa/confirm/personal-profile/`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            )
            if (response.ok) {
                hideLoader()
                toast.success(`Profile completed.`)
                // handling checklist or dashboard
                router.push('/auth/signup/onboarding/checklist')
            }
        } catch (error) {
            toast.error(
                'Service not available right now. Please try again later.'
            )
            hideLoader()
        }
    }

    const setUser = useUserStore((state) => state.setUser)
    const setIsStep7CompletedTrue = useOnboardingStore(
        (state) => state.setIsStep7CompletedTrue
    )
    const handleSubmit = async (
        values: typeof initialValues,
        {
            resetForm,
        }: { resetForm: (nextState?: { values?: FormData }) => void }
    ) => {
        const userToken = useUserStore.getState().userToken
        console.log('signup values:', values)
        showLoader()
        if (
            selectedRegion === null ||
            selectedCity === null ||
            selectedBarangay === null ||
            selectedGender === null
        ) {
            if (selectedRegion === null) {
                setDropdownErrors((prevState) => ({
                    ...prevState,
                    regionErrorMessage: 'Required field.',
                }))
            }

            if (selectedProvince === null) {
                setDropdownErrors((prevState) => ({
                    ...prevState,
                    provinceErrorMessage: 'Required field.',
                }))
            }

            if (selectedCity === null) {
                setDropdownErrors((prevState) => ({
                    ...prevState,
                    cityErrorMessage: 'Required field.',
                }))
            }

            if (selectedBarangay === null) {
                setDropdownErrors((prevState) => ({
                    ...prevState,
                    barangayErrorMessage: 'Required field.',
                }))
            }

            if (selectedGender === null) {
                setDropdownErrors((prevState) => ({
                    ...prevState,
                    genderErrorMessage: 'Required field.',
                }))
            }
            hideLoader()
        } else {
            try {
                const formatBirthDate = (date?: string) => {
                    if (!date) return ''
                    const d = new Date(date)
                    return d.toISOString().split('T')[0]
                }

                const formData = new FormData()
                formData.append('first_name', values.firstName)
                formData.append('middle_name', values.middleName)
                formData.append('last_name', values.lastName)
                formData.append('name_extension', user.name_extension)
                formData.append('phone_number', user.phone_number)
                formData.append(
                    'address',
                    JSON.stringify({
                        region: selectedRegion?.label,
                        province: selectedProvince?.label,
                        city: selectedCity?.label,
                        barangay: selectedBarangay?.label,
                        address: values.address,
                        zip_code: values.zipCode,
                    })
                )
                formData.append('birthdate', formatBirthDate(selectedBirthDate))
                formData.append('sex', selectedGender?.value)
                console.log('setup profile form data:', formData)
                const response = await fetch(`${API_URL}/user/`, {
                    method: 'PUT',
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${userToken}`,
                    },
                    body: formData,
                })

                const data = await response.json()
                console.log('setup profile response:', data)

                if (response.ok) {
                    //setting state of user feedback stores to initialize user feedback components
                    confirmProfile()
                } else {
                    hideLoader()
                    await new Promise((resolve) => setTimeout(resolve, 100))
                    toast.error(`Failed to complete profile. ${data.detail}`)
                }
            } catch (error) {
                //setting state of user feedback stores to initialize user feedback components
                hideLoader()
                await new Promise((resolve) => setTimeout(resolve, 100))
                toast.error(
                    `Failed to complete profile. Service not available right now.`
                )
            }
        }
    }

    const validationSchema = Yup.object().shape({
        address: Yup.string().required('Street is required'),
        zipCode: Yup.string()
            .required('Zip code is required')
            .matches(
                /^\d{1,4}$/,
                'Zip code must be numeric and up to 4 digits'
            ),
    })

    //back
    const setIsUserInStep6 = useOnboardingStore(
        (state) => state.setIsUserInStep6
    )
    const handleBack = () => {
        // set then navigate
        setIsUserInStep6()
        router.push('/auth/signup/onboarding/setup-linked-account')
    }
    // skip
    const setIsStep7CompletedFalse = useOnboardingStore(
        (state) => state.setIsStep7CompletedFalse
    )
    const handleSkip = () => {
        if (profileSet === '') {
            setIsStep7CompletedFalse()
        }
        if (profileSet === 'approved') {
            setIsStep7CompletedTrue()
        }
        resetStates()
        router.push('/auth/signup/onboarding/checklist')
    }
    //proceed
    const handleProceed = () => {
        setIsStep7CompletedTrue()
        router.push('/auth/signup/onboarding/checklist')
    }

    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                {/* Sign Up Overlay */}
                <div className="bg-white rounded-xl shadow-2xl p-10 w-[90%] md:w-[50%] overflow-y-auto my-[40px]">
                    <div className="w-full border-b-2 border-tertiary mb-[20px]">
                        <OnboardingStepper
                            stepNumber={'6'}
                            stepTitle={'Setup Profile'}
                            onPressBack={handleBack}
                            onPressSkip={handleSkip}
                            isStepCompleted={profileSet === 'approved'}
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
                            {profileSet === 'approved' ? (
                                <>
                                    <div className="w-full px-5 md:px-[50px] lg:px-[70px] mb-[50px]">
                                        <div className="flex items-center justify-center mt-[20px]">
                                            <FaRegCircleCheck className="text-green-500 text-[100px]" />
                                        </div>
                                    </div>
                                    <h2 className="text-[40px] font-bold text-tertiary mb-6">
                                        Profile Setup Success
                                    </h2>
                                    <div className="flex flex-col w-full items-center mb-[20px]">
                                        <div className="text-[16px] 2sm:text-[20px] text-[#121212] mb-2 text-center">
                                            You have already setup your profile.
                                            We are validating your inputs.
                                        </div>
                                    </div>
                                    <div className="w-full mt-6 mb-2 text-center">
                                        <button
                                            className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                            onClick={handleProceed}
                                        >
                                            Proceed
                                        </button>
                                    </div>
                                </>
                            ) : profileSet === 'declined' ? (
                                <>
                                    <div className="w-full px-5 md:px-[50px] lg:px-[70px] mb-[50px]">
                                        <div className="flex items-center justify-center mt-[20px]">
                                            <FaRegCircleXmark className="text-red-500 text-[100px]" />
                                        </div>
                                    </div>
                                    <h2 className="text-[40px] font-bold text-tertiary mb-6">
                                        Profile Setup Declined
                                    </h2>
                                    <div className="flex flex-col w-full items-center mb-[20px]">
                                        <div className="text-[16px] 2sm:text-[20px] text-[#121212] mb-2 text-center">
                                            The profile details you entered were
                                            declined because it requires further
                                            clarification. Please enter you
                                            profile details again or contact
                                            support@vashcorp.com for
                                            administrative assistance.
                                        </div>
                                    </div>
                                    <div className="w-full mt-6 mb-2 text-center">
                                        <button
                                            className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                            onClick={() => setProfileSet('')}
                                        >
                                            Retry
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-[40px] font-bold text-tertiary text-center mb-8">
                                        Complete your personal profile
                                    </h2>
                                    <p className="text-[18px] text-black text-center mb-8 px-10 md:px-20">
                                        Make sure all details are correct. This
                                        helps us verify your identity securely.
                                    </p>

                                    <Formik
                                        initialValues={initialValues}
                                        onSubmit={handleSubmit}
                                        validationSchema={validationSchema}
                                    >
                                        {({
                                            values,
                                            errors,
                                            touched,
                                            handleChange,
                                        }) => (
                                            <Form className="w-full max-w-md mx-auto">
                                                <TextInput
                                                    labelText="First Name:"
                                                    placeholderText="Enter first name"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={values.firstName}
                                                    onChangeInput={handleChange}
                                                    editable={false}
                                                />
                                                <TextInput
                                                    labelText="Middle Name:"
                                                    placeholderText="Enter middle name"
                                                    id="middleName"
                                                    name="middleName"
                                                    value={values.middleName}
                                                    onChangeInput={handleChange}
                                                    editable={false}
                                                />
                                                <TextInput
                                                    labelText="Last Name:"
                                                    placeholderText="Enter last name"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={values.lastName}
                                                    onChangeInput={handleChange}
                                                    editable={false}
                                                />
                                                <div className="w-full flex flex-row justify-between">
                                                    <div className="w-[45%] flex flex-col items-start mb-[20px]">
                                                        <label className="text-[14px] text-black font-semibold">
                                                            Birth Date
                                                        </label>
                                                        <div
                                                            className={`w-full border-2 border-tertiary p-4 bg-white-50 rounded-[10px] flex`}
                                                        >
                                                            <DatePicker
                                                                onChange={
                                                                    onChange
                                                                }
                                                                className="w-full text-[16px]"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col w-[45%] mb-[20px]">
                                                        <label
                                                            htmlFor="passType"
                                                            className="text-black font-semibold text-[14px]"
                                                        >
                                                            Select Sex
                                                        </label>
                                                        <div
                                                            className={`w-full border-2 border-tertiary p-4 bg-white-50 rounded-[10px] flex`}
                                                        >
                                                            <Dropdown
                                                                selectedOption={
                                                                    selectedGender
                                                                }
                                                                setSelectedOption={
                                                                    setSelectedGender
                                                                }
                                                                options={
                                                                    genderOptions
                                                                }
                                                                placeholder="Male or Female"
                                                            />
                                                        </div>
                                                        {dropdownErrors.genderErrorMessage && (
                                                            <p className="text-red-500 text-sm">
                                                                {
                                                                    dropdownErrors.genderErrorMessage
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col w-full mb-[20px]">
                                                    <label
                                                        htmlFor="passType"
                                                        className="text-black font-semibold text-[14px]"
                                                    >
                                                        Region
                                                    </label>
                                                    <div
                                                        className={`w-full border-2 border-tertiary p-4 bg-white-50 rounded-[10px] flex`}
                                                    >
                                                        <Dropdown
                                                            selectedOption={
                                                                selectedRegion
                                                            }
                                                            setSelectedOption={
                                                                setSelectedRegion
                                                            }
                                                            options={
                                                                transformedRegions
                                                            }
                                                            placeholder="Select region"
                                                        />
                                                    </div>

                                                    {dropdownErrors.regionErrorMessage && (
                                                        <p className="text-red-500 text-sm">
                                                            {
                                                                dropdownErrors.regionErrorMessage
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col w-full mb-[20px]">
                                                    <label
                                                        htmlFor="passType"
                                                        className="text-black font-semibold text-[14px]"
                                                    >
                                                        Province
                                                    </label>
                                                    <div
                                                        className={`w-full border-2 border-tertiary p-4 bg-white-50 rounded-[10px] flex`}
                                                    >
                                                        <Dropdown
                                                            selectedOption={
                                                                selectedProvince
                                                            }
                                                            setSelectedOption={
                                                                setSelectedProvince
                                                            }
                                                            options={
                                                                fetchedProvinces
                                                            }
                                                            placeholder="Select province"
                                                        />
                                                    </div>
                                                    {dropdownErrors.provinceErrorMessage && (
                                                        <p className="text-red-500 text-sm">
                                                            {
                                                                dropdownErrors.provinceErrorMessage
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col w-full mb-[20px]">
                                                    <label
                                                        htmlFor="passType"
                                                        className="text-black font-semibold text-[14px]"
                                                    >
                                                        City
                                                    </label>
                                                    <div
                                                        className={`w-full border-2 border-tertiary p-4 bg-white-50 rounded-[10px] flex`}
                                                    >
                                                        <Dropdown
                                                            selectedOption={
                                                                selectedCity
                                                            }
                                                            setSelectedOption={
                                                                setSelectedCity
                                                            }
                                                            options={
                                                                fetchedCities
                                                            }
                                                            placeholder="Select city"
                                                        />
                                                    </div>
                                                    {dropdownErrors.cityErrorMessage && (
                                                        <p className="text-red-500 text-sm">
                                                            {
                                                                dropdownErrors.cityErrorMessage
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col w-full mb-[20px]">
                                                    <label
                                                        htmlFor="passType"
                                                        className="text-black font-semibold text-[14px]"
                                                    >
                                                        Barangay
                                                    </label>
                                                    <div
                                                        className={`w-full border-2 border-tertiary p-4 bg-white-50 rounded-[10px] flex`}
                                                    >
                                                        <Dropdown
                                                            selectedOption={
                                                                selectedBarangay
                                                            }
                                                            setSelectedOption={
                                                                setSelectedBarangay
                                                            }
                                                            options={
                                                                fetchedBarangays
                                                            }
                                                            placeholder="Select barangay"
                                                        />
                                                    </div>

                                                    {dropdownErrors.barangayErrorMessage && (
                                                        <p className="text-red-500 text-sm">
                                                            {
                                                                dropdownErrors.barangayErrorMessage
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                                <TextInput
                                                    labelText="Street:"
                                                    placeholderText="House No., Street, Village/Subdivision"
                                                    id="address"
                                                    name="address"
                                                    value={values.address}
                                                    onChangeInput={handleChange}
                                                    errorMessage={
                                                        touched.address &&
                                                        errors.address
                                                            ? errors.address
                                                            : undefined
                                                    }
                                                />
                                                <TextInput
                                                    labelText="Zip Code:"
                                                    placeholderText="Enter zip code"
                                                    variant="zip-code"
                                                    id="zipCode"
                                                    name="zipCode"
                                                    value={values.zipCode}
                                                    onChangeInput={handleChange}
                                                    errorMessage={
                                                        touched.zipCode &&
                                                        errors.zipCode
                                                            ? errors.zipCode
                                                            : undefined
                                                    }
                                                />
                                                <div className="mt-6 mb-6 text-center">
                                                    <button
                                                        type="submit"
                                                        className="w-full bg-tertiary text-white py-3 rounded-lg text-lg cursor-pointer"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </>
                            )}
                        </>
                    )}
                </div>
            </section>
            <Footer />
            <Loader />
        </div>
    )
}
