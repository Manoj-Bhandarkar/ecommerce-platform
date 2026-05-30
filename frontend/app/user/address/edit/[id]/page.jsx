'use client'

import { useState, useEffect } from 'react'
import api from '@/utils/axios'
import { useRouter, useParams } from 'next/navigation'

const EditAddress = () => {
    const router = useRouter()
    const params = useParams()

    const [form, setForm] = useState({
        name: '',
        phone_number: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pin_code: '',
        country: '',
    })

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const res = await api.get(
                    `/api/v1/shipping/address/${params.id}`
                )

                setForm({
                    name: res.data.name || '',
                    phone_number: res.data.phone_number || '',
                    address_line1: res.data.address_line1 || '',
                    address_line2: res.data.address_line2 || '',
                    city: res.data.city || '',
                    state: res.data.state || '',
                    pin_code: res.data.pin_code || '',
                    country: res.data.country || '',
                })
            } catch (err) {
                setError('Failed to load address')
            } finally {
                setFetching(false)
            }
        }

        if (params.id) {
            fetchAddress()
        }
    }, [params.id])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })

        setError(null)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError(null)

        if (!/^\d{10}$/.test(form.phone_number)) {
            setError('Phone number must be exactly 10 digits')
            return
        }

        if (!/^\d{6}$/.test(form.pin_code)) {
            setError('PIN code must be exactly 6 digits')
            return
        }

        setLoading(true)

        try {
            await api.patch(
                `/api/v1/shipping/addresses/${params.id}`,
                form
            )

            router.push('/user/address')
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                'Failed to update address'
            )
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="p-6 text-center">
                Loading address...
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    Edit Address
                </h2>

                <button
                    type="button"
                    onClick={() => router.push('/user/address')}
                    className="text-blue-600 font-medium cursor-pointer"
                >
                    ← Back
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="bg-white border rounded-lg shadow-sm p-6 space-y-4"
            >
                <div>
                    <label className="block mb-1 font-medium">
                        Name *
                    </label>

                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Phone Number *
                    </label>

                    <input
                        type="tel"
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                        maxLength={10}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Address Line 1 *
                    </label>

                    <input
                        type="text"
                        name="address_line1"
                        value={form.address_line1}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium">
                        Address Line 2
                    </label>

                    <input
                        type="text"
                        name="address_line2"
                        value={form.address_line2}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">
                            City *
                        </label>

                        <input
                            type="text"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            State *
                        </label>

                        <input
                            type="text"
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium">
                            PIN Code *
                        </label>

                        <input
                            type="text"
                            name="pin_code"
                            value={form.pin_code}
                            onChange={handleChange}
                            maxLength={6}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Country *
                        </label>

                        <input
                            type="text"
                            name="country"
                            value={form.country}
                            onChange={handleChange}
                            className="w-full border p-2 rounded"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-red-600 text-sm">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded text-white ${loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                        }`}
                >
                    {loading ? 'Updating...' : 'Update Address'}
                </button>
            </form>
        </div>
    )
}

export default EditAddress