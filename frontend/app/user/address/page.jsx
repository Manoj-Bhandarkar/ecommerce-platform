'use client'

import { useEffect, useState } from 'react'
import api from '@/utils/axios'
import { useRouter } from 'next/navigation'

export default function AddressPage() {
    const [addresses, setAddresses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const res = await api.get('/api/v1/shipping/address')
                setAddresses(res.data)
            } catch (err) {
                setError('Failed to load addresses')
            } finally {
                setLoading(false)
            }
        }
        fetchAddresses()
    }, [])

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this address?")) return
        try {
            await api.delete(`/api/v1/shipping/addresses/${id}`)
            // refresh by filtering locally (better UX than re-fetching everything)
            setAddresses(prev =>
                prev.filter(addr => addr.id !== id)
            )
        } catch {
            alert("Failed to delete address")
        }
    }

    if (loading) return <div className="p-6"><div className="flex justify-center py-10">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div></div>
    if (error) return <div className="p-6 text-red-600">{error}</div>

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    My Addresses
                </h1>

                <button
                    onClick={() =>
                        router.push('/user/address/create')
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
                >
                    + Add New Address
                </button>
            </div>
            {addresses.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">No addresses found.</p>
                    <button
                        onClick={() => router.push('/user/address/create')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded"
                    >
                        Add Your First Address
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map((addr) => (
                        <div
                            key={addr.id}
                            className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-lg">
                                            {addr.name}
                                        </h3>

                                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                                            Home
                                        </span>
                                    </div>

                                    <p className="text-gray-600 mt-1">
                                        {addr.phone_number}
                                    </p>

                                    <p className="mt-3 text-gray-700 leading-relaxed">
                                        {addr.address_line1}
                                        {addr.address_line2 &&
                                            `, ${addr.address_line2}`}
                                        , {addr.city}, {addr.state}
                                        {" - "}
                                        {addr.pin_code}, {addr.country}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            router.push(
                                                `/user/address/edit/${addr.id}`
                                            )
                                        }
                                        className="text-blue-600 font-medium cursor-pointer"
                                    >
                                        EDIT
                                    </button>

                                    <button
                                        onClick={() => handleDelete(addr.id)}
                                        className="text-red-600 font-medium cursor-pointer"
                                    >
                                        DELETE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
