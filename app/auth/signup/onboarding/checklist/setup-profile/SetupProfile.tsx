/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Form, Formik, useFormik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { ArrowLeft } from 'lucide-react'
import type { DatePickerProps } from 'antd'
import { DatePicker, Divider } from 'antd'

import { API_URL } from '@/constants/api'
import { colors } from '@/constants/themes'
import Footer from '@/components/Footer'
import TextInput from '@/components/TextInput'
import Dropdown from '@/components/Dropdown'
import Loader from '@/components/Loader'

import useLoaderStore from '@/stores/useLoaderStore'
import useUserStore from '@/stores/useUserStore'
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

    return (
        <div className="relative w-full">
            <section
                id="hero"
                className="relative overflow-hidden bg-primary bg-center flex items-center justify-center"
            >
                {/* Sign Up Overlay */}
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

                    <h2 className="text-[40px] font-bold text-tertiary text-center mb-8">
                        Complete your personal profile
                    </h2>
                    <p className="text-[18px] text-black text-center mb-8 px-10 md:px-20">
                        Make sure all details are correct. This helps us verify
                        your identity securely.
                    </p>

                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                        {({ values, errors, touched, handleChange }) => (
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
                                                onChange={onChange}
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
                                                selectedOption={selectedGender}
                                                setSelectedOption={
                                                    setSelectedGender
                                                }
                                                options={genderOptions}
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
                                            selectedOption={selectedRegion}
                                            setSelectedOption={
                                                setSelectedRegion
                                            }
                                            options={transformedRegions}
                                            placeholder="Select region"
                                        />
                                    </div>

                                    {dropdownErrors.regionErrorMessage && (
                                        <p className="text-red-500 text-sm">
                                            {dropdownErrors.regionErrorMessage}
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
                                            selectedOption={selectedProvince}
                                            setSelectedOption={
                                                setSelectedProvince
                                            }
                                            options={fetchedProvinces}
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
                                            selectedOption={selectedCity}
                                            setSelectedOption={setSelectedCity}
                                            options={fetchedCities}
                                            placeholder="Select city"
                                        />
                                    </div>
                                    {dropdownErrors.cityErrorMessage && (
                                        <p className="text-red-500 text-sm">
                                            {dropdownErrors.cityErrorMessage}
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
                                            selectedOption={selectedBarangay}
                                            setSelectedOption={
                                                setSelectedBarangay
                                            }
                                            options={fetchedBarangays}
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
                                        touched.address && errors.address
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
                                        touched.zipCode && errors.zipCode
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
                </div>
            </section>
            <Footer />
            <Loader />
        </div>
    )
}
