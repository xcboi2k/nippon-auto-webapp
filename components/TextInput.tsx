/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent, useEffect, useState } from 'react'
import { useField } from 'formik'

interface InputProps {
    labelText?: string
    placeholderText: string
    variant?: string
    id: string
    name: string
    value: string
    onChangeInput: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void // Event handler for input changes
    errorMessage?: string | undefined
    editable?: boolean
}

export default function TextInput({
    labelText,
    placeholderText,
    variant = 'default',
    id,
    name,
    value,
    onChangeInput,
    errorMessage,
    editable = true,
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false)

    const [countries, setCountries] = useState<any>(null)

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch(
                    'https://restcountries.com/v3.1/all?fields=name,idd'
                )
                const data = await res.json()

                const countries = data
                    .filter((c: { idd: { root: any } }) => c.idd?.root)
                    .map(
                        (c: {
                            name: { common: any }
                            idd: { root: any; suffixes: any[] }
                        }) => ({
                            name: c.name.common,
                            dialCode: `${c.idd.root}${
                                c.idd.suffixes?.[0] ?? ''
                            }`,
                        })
                    )
                    .sort((a: { name: string }, b: { name: any }) =>
                        a.name.localeCompare(b.name)
                    )
                console.log(countries)
                setCountries(countries)
            } catch (err) {
                console.error('Failed to load countries', err)
            }
        }

        if (variant === 'contactNumber') {
            fetchCountries()
        }
    }, [variant])

    const [field, , helpers] = useField<string>(name)
    const [countryCode, setCountryCode] = useState('+63')

    const localNumber = field.value?.replace(countryCode, '') || ''

    return (
        <div className="flex-col mb-[20px]">
            <label
                htmlFor={id}
                className="text-[14px] text-black font-semibold"
            >
                {labelText}
            </label>
            <div
                className={`w-full border-2 p-4 rounded-[10px] bg-white-50 flex ${
                    variant === 'footer' ? 'border-white' : 'border-tertiary'
                } ${variant === 'contactNumber' ? 'flex-col' : 'flex-row'}`}
            >
                {variant === 'paragraph' ? (
                    <textarea
                        id={id}
                        name={name}
                        value={value}
                        placeholder={placeholderText}
                        onChange={onChangeInput}
                        className="w-full h-[150px] p-4 bg-transparent outline-none rounded-3xl text-black"
                    ></textarea>
                ) : variant === 'contactNumber' ? (
                    <>
                        <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            className="px-2 bg-transparent text-black outline-none"
                        >
                            {countries &&
                                countries.map((c: any) => (
                                    <option key={c.dialCode} value={c.dialCode}>
                                        {c.name} {c.dialCode}
                                    </option>
                                ))}
                        </select>
                        <div className="border border-tertiary my-[10px]" />
                        <input
                            {...field}
                            id={id}
                            type="text"
                            value={localNumber}
                            placeholder={placeholderText}
                            onChange={(e) => {
                                const digitsOnly = e.target.value.replace(
                                    /\D/g,
                                    ''
                                )
                                helpers.setValue(`${countryCode}${digitsOnly}`)
                            }}
                            className={`w-full bg-transparent outline-none text-black ${
                                variant === 'contactNumber' ? 'pl-2' : ''
                            }`}
                        />
                    </>
                ) : variant === 'password' ? (
                    <div className="relative w-full">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id={id}
                            name={name}
                            value={value}
                            placeholder={placeholderText}
                            onChange={onChangeInput}
                            className="w-full bg-transparent outline-none text-black pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-tertiary hover:text-black"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                ) : variant === 'number' ? (
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        id={id}
                        name={name}
                        value={value}
                        placeholder={placeholderText}
                        // maxLength={4}
                        onChange={(e) => {
                            // Only allow numeric characters
                            const numericValue = e.target.value.replace(
                                /[^0-9]/g,
                                ''
                            )
                            // Create a new event with the filtered value, preserving id and name for Formik
                            const syntheticEvent = {
                                ...e,
                                target: {
                                    ...e.target,
                                    id,
                                    name,
                                    value: numericValue,
                                },
                            } as React.ChangeEvent<HTMLInputElement>
                            onChangeInput(syntheticEvent)
                        }}
                        className="w-full bg-transparent outline-none text-black"
                    />
                ) : variant === 'amount' ? (
                    <input
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        id={id}
                        name={name}
                        value={value}
                        placeholder={placeholderText}
                        onChange={(e) => {
                            // Only allow numeric characters
                            const numericValue = e.target.value.replace(
                                /[^0-9]/g,
                                ''
                            )
                            // Create a new event with the filtered value, preserving id and name for Formik
                            const syntheticEvent = {
                                ...e,
                                target: {
                                    ...e.target,
                                    id,
                                    name,
                                    value: numericValue,
                                },
                            } as React.ChangeEvent<HTMLInputElement>
                            onChangeInput(syntheticEvent)
                        }}
                        className="w-full bg-transparent outline-none text-black"
                    />
                ) : (
                    <input
                        type="text"
                        id={id}
                        name={name}
                        value={value}
                        placeholder={placeholderText}
                        onChange={onChangeInput}
                        className="w-full bg-transparent outline-none text-black"
                        disabled={!editable}
                    />
                )}
            </div>
            <label className="font-semibold text-[14px] text-red-500">
                {errorMessage}
            </label>
        </div>
    )
}
