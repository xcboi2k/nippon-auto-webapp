import React, { useEffect, useState } from 'react'

interface Option {
    label: string
    value: string
}

interface DropdownProps {
    labelText?: string
    name: string
    data: Option[]
    errorMessage?: string
    editable?: boolean
    variant?: 'create' | 'update'
    previousSelected?: string // used when updating
    onChange?: (value: string) => void
}

export default function ListingDropdown({
    labelText,
    name,
    data,
    errorMessage,
    editable = true,
    variant = 'create',
    previousSelected,
    onChange,
}: DropdownProps) {
    const [selected, setSelected] = useState('')

    // Preselect when in update mode
    useEffect(() => {
        if (variant === 'update' && previousSelected) {
            const match = data.find(
                (d) =>
                    d.value === previousSelected || d.label === previousSelected
            )
            if (match) {
                setSelected(match.value)
            }
        }
    }, [variant, previousSelected, data])

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelected(e.target.value)
        onChange?.(e.target.value)
    }

    return (
        <div className="flex flex-col mb-5 w-full">
            {labelText && (
                <label className="text-sm text-black font-semibold mb-2">
                    {labelText}
                </label>
            )}

            <div
                className={`w-full border-2 rounded-lg bg-white flex items-center
                    ${errorMessage ? 'border-red-500' : 'border-tertiary'}
                `}
            >
                <select
                    name={name}
                    value={selected}
                    onChange={handleChange}
                    disabled={!editable}
                    className="w-full bg-transparent px-4 py-3 outline-none text-black appearance-none cursor-pointer"
                >
                    <option value="" disabled>
                        Select an option
                    </option>

                    {data.map((item) => (
                        <option key={item.value} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
            </div>

            {errorMessage && (
                <p className="text-xs text-red-500 mt-1">{errorMessage}</p>
            )}
        </div>
    )
}
