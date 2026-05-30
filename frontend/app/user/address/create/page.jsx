'use client'
import { useState } from 'react'
import api from '@/utils/axios'
import { useRouter } from 'next/navigation'

const CreateAddress = () => {
    const [form, setForm] = useState({
        name: '',
        phone_number: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pin_code: '',
        country: ''
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const router = useRouter()

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setError(null)
    }

    // const handleSubmit = async (e) => {
    //     e.preventDefault()
    //     setLoading(true)
    //     setError(null)
    //     if (!/^\d{10}$/.test(form.phone_number)) {
    //         setError("Phone number must be exactly 10 digits")
    //         return
    //     }

    //     if (!/^\d{6}$/.test(form.pin_code)) {
    //         setError("PIN code must be exactly 6 digits")
    //         return
    //     }

    //     setLoading(true)

    //     try {
    //         await api.post('/api/v1/shipping/address', form)
    //         router.push('/user/address')
    //     } catch (err) {
    //         setError(err.response?.data?.detail || 'Failed to save address')
    //     } finally {
    //         setLoading(false)
    //     }
    // }
    const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("Submit clicked")

    setError(null)

    if (!/^\d{10}$/.test(form.phone_number)) {
        console.log("Phone validation failed")
        setError("Phone number must be exactly 10 digits")
        return
    }

    if (!/^\d{6}$/.test(form.pin_code)) {
        console.log("PIN validation failed")
        setError("PIN code must be exactly 6 digits")
        return
    }

    setLoading(true)

    try {
        console.log("Sending request...")

        const res = await api.post(
            "/api/v1/shipping/address",
            form
        )

        console.log("Success:", res.data)

        router.push("/user/address")

    } catch (err) {

        console.log("Error:", err)

        setError(
            err.response?.data?.detail ||
            err.message ||
            "Failed to save address"
        )

    } finally {

        console.log("Finished")

        setLoading(false)
    }
}

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">➕ Add Address</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Name *</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Phone Number *</label>
                    <input
                        name="phone_number"
                        type='tel'
                        value={form.phone_number}
                        onChange={handleChange}
                        maxLength={10}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Address Line 1 *</label>
                    <input
                        name="address_line1"
                        value={form.address_line1}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Address Line 2</label>
                    <input
                        name="address_line2"
                        value={form.address_line2}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label className="grid md:grid-cols-2 gap-4">City *</label>
                    <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="grid md:grid-cols-2 gap-4">State *</label>
                    <input
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="grid md:grid-cols-2 gap-4">Pin Code *</label>
                    <input
                        name="pin_code"
                        type='text'
                        value={form.pin_code}
                        onChange={handleChange}
                        maxLength={6}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="grid md:grid-cols-2 gap-4">Country *</label>
                    <input
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full border p-2 rounded"
                        required
                    />
                </div>

                {error && <p className="text-red-600 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 rounded text-white cursor-pointer ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                        }`}
                >
                    {loading ? 'Saving...' : 'Save Address'}
                </button>
            </form>
        </div>
    )
}

export default CreateAddress
