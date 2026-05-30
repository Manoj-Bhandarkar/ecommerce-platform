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

    if (loading) return <div className="p-6">Loading addresses...</div>
    if (error) return <div className="p-6 text-red-600">{error}</div>

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">🏠 Shipping Addresses</h1>
            <p className="text-gray-500 mb-6">{addresses.length} addresses</p>
            <button
                onClick={() => router.push('/user/address/create')}
                className="bg-indigo-600 text-white px-4 py-2 rounded mb-6 cursor-pointer"
            >
                ➕ Add Address
            </button>
            {addresses.length === 0 ? (
                <p>No addresses found. Add one to continue.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="border p-4 rounded shadow max-w-md">
                            <div className="flex mb-1"><strong className="w-28 shrink-0">Name :</strong> <span>{addr.name}</span></div>
                            <div className="flex mb-1"><strong className="w-28 shrink-0">Mobile :</strong> <span>{addr.phone_number}</span></div>
                            <div className="flex mb-1"><strong className="w-28 shrink-0">Address :</strong> <span>{addr.address_line1 + (addr.address_line2 ? `, ${addr.address_line2}` : '')}</span></div>
                            <div className="flex mb-1"><strong className="w-28 shrink-0">City :</strong> <span>{addr.city}</span></div>
                            <div className="flex mb-1"><strong className="w-28 shrink-0">State :</strong> <span>{addr.state}</span></div>
                            <div className="flex mb-1"><strong className="w-28 shrink-0">Pin Code :</strong> <span>{addr.pin_code}</span></div>
                            <div className="flex mb-3"><strong className="w-28 shrink-0">Country :</strong> <span>{addr.country}</span></div>
                            <div className="mt-4 flex gap-2">
                                <button className="bg-blue-500 text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 shadow-sm hover:bg-blue-600 transition">
                                    ✏️ Edit
                                </button>
                                <button className="bg-red-500 text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 shadow-sm hover:bg-red-600 transition">
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
