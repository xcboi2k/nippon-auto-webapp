/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import { useField, useFormikContext } from 'formik'

interface Country {
    name: string
    iso: string
}

interface LocationInputProps {
    name: string // Formik field name for combined value
}

export default function LocationInput({ name }: LocationInputProps) {
    const { setFieldValue } = useFormikContext<any>()
    const [countries, setCountries] = useState<Country[]>([])
    const [loading, setLoading] = useState(true)

    // Local states for individual inputs
    const [line1, setLine1] = useState('')
    const [line2, setLine2] = useState('')
    const [city, setCity] = useState('')
    const [province, setProvince] = useState('')
    const [country, setCountry] = useState('')
    const [zip, setZip] = useState('')

    // Fetch countries from REST Countries API
    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const res = await fetch(
                    'https://restcountries.com/v3.1/all?fields=name'
                )
                const data: any[] = await res.json()
                const sorted = data
                    .map((c) => ({ name: c.name.common, iso: c.cca2 }))
                    .sort((a, b) => a.name.localeCompare(b.name))
                setCountries(sorted)
            } catch (err) {
                console.error('Failed to load countries', err)
            } finally {
                setLoading(false)
            }
        }
        fetchCountries()
    }, [])

    // Update combined value whenever any field changes
    useEffect(() => {
        const combined = `${line1}, ${
            line2 ? line2 + ', ' : ''
        }${city}, ${province}, ${country}, ${zip}`
        setFieldValue(name, combined)
    }, [line1, line2, city, province, country, zip])

    if (loading) return <p>Loading countries...</p>

    return (
        <div className="w-full bg-white">
            <label className="text-[14px] text-black font-semibold">
                Location
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <input
                    type="text"
                    placeholder="Address Line 1"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    className="p-3 border-2 border-tertiary rounded-lg w-full bg-white"
                />
                <input
                    type="text"
                    placeholder="Address Line 2"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    className="p-3 border-2 border-tertiary rounded-lg w-full bg-white"
                />
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="p-3 border-2 border-tertiary rounded-lg w-full bg-white"
                />
                <input
                    type="text"
                    placeholder="Province / State"
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="p-3 border-2 border-tertiary rounded-lg w-full bg-white"
                />
                <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="p-3 border-2 border-tertiary rounded-lg w-full bg-white text-black"
                >
                    <option value="">Select Country</option>
                    {countries.map((c) => (
                        <option key={c.iso} value={c.name}>
                            {c.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    placeholder="ZIP / Postal Code"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="p-3 border-2 border-tertiary rounded-lg w-full bg-white"
                />
            </div>
        </div>
    )
}
