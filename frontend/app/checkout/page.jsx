"use client"

import { useEffect, useState } from "react"
import api from "@/utils/axios"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

const CheckoutPage = () => {
    const [cart, setCart] = useState(null)
    const [addresses, setAddresses] = useState([])
    const [selectedAddressId, setSelectedAddressId] = useState(null)
    const [selectedGateway, setSelectedGateway] = useState('mock')
    const [loading, setLoading] = useState(true)
    const [placingOrder, setPlacingOrder] = useState(false)
    const [error, setError] = useState(null)

    const { user, loading: authLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.async = true
        document.body.appendChild(script)
    }, [])

    const fetchCartAndAddresses = async () => {
        try {
            const [cartRes, addrRes] = await Promise.all([
                api.get("/api/v1/cart"),
                api.get("/api/v1/shipping/address"),
            ])
            setCart(cartRes.data)
            setAddresses(addrRes.data)
            if (addrRes.data.length > 0) {
                setSelectedAddressId(addrRes.data[0].id)
            }
        } catch (err) {
            console.error("Error loading checkout data:", err)
        } finally {
            setLoading(false)
        }
    }

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            setError("Please select a shipping address.")
            return
        }
        if (!selectedGateway) {
            setError("Please select a payment gateway.")
            return
        }
        setPlacingOrder(true)
        try {
            const res = await api.post("/api/v1/order/checkout", {
                amount: cart.total_price,
                shipping_address_id: selectedAddressId,
                gateway: selectedGateway,
                simulate_success: true,
            })
            const data = res.data
            if (selectedGateway === "razorpay") {
                const options = {
                    key: data.razorpay_data.razorpay_key,
                    amount: data.razorpay_data.amount,
                    currency: data.razorpay_data.currency,
                    name: "E-Commerce Store",
                    description: "Test Transaction",
                    order_id: data.razorpay_data.pg_order_id,
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact: user.phone_number || "",
                    },
                    notes: {
                        "address": "Razorpay Corporate Office",
                    },
                    theme: {
                        color: "#2874f0",
                    },
                    handler: async function (response) {
                        try {
                            const verifyRes = await api.post("/api/v1/payment/razorpay-callback", response)
                            if (verifyRes.data.status === 'success') {
                                router.push("/user/order")
                            }
                            else {
                                setError("Payment verification failed. Please contact support.")
                            }
                        } catch (err) {
                            setError("Payment verification failed. Please contact support.")
                        }
                    },
                }
                const rzp = new Razorpay(options)
                rzp.open()
            } else {
                router.push("/user/order")
            }
        } catch (err) {
            if (err.response) {
                if (err.response.status === 400) {
                    setError("Checkout failed. Try again.")
                }
            }
        }
    }

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/login?redirect=/checkout")
            } else {
                fetchCartAndAddresses()
            }
        }
    }, [authLoading, user])

    if (loading || authLoading) {
        return (
            <div className="text-center py-8 text-gray-600">Loading checkout...</div>
        )
    }
    const selectedAddress =
        addresses.find(addr => addr.id === selectedAddressId)

    if (!cart || cart.items.length === 0) {
        return (
            <div className="text-center py-8 text-gray-600">
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-semibold">Your Cart is Empty</h2>
                    <button
                        onClick={() => router.push('/product')}
                        className="mt-4 bg-blue-600 text-white px-6 py-2 rounded"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

                {/* LEFT SECTION */}
                <div className="lg:col-span-8 space-y-4">

                    {/* DELIVERY ADDRESS */}
                    <div className="bg-white border border-gray-200 shadow-sm">
                        {/* Header */}
                        <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-3">
                            <span className="bg-white text-[#2874f0] w-5 h-5 flex items-center justify-center text-xs font-bold">
                                1
                            </span>
                            <span className="font-medium uppercase text-sm">
                                Delivery Address
                            </span>
                        </div>

                        {/* Selected Address */}
                        <div className="p-4">
                            {selectedAddress && (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            Deliver to:
                                        </p>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-semibold">
                                                {selectedAddress.name}
                                            </span>

                                            <span className="bg-gray-100 px-2 py-1 text-xs font-medium rounded">
                                                HOME
                                            </span>
                                        </div>

                                        <p className="mt-2 text-sm text-gray-700">
                                            {selectedAddress.address_line1}
                                            {selectedAddress.address_line2 &&
                                                `, ${selectedAddress.address_line2}`}
                                            , {selectedAddress.city},
                                            {" "}
                                            {selectedAddress.state}
                                            {" "}
                                            {selectedAddress.pin_code}
                                        </p>

                                        <p className="text-sm text-gray-700 mt-1">
                                            {selectedAddress.phone_number}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() =>
                                            document
                                                .getElementById("address-modal")
                                                ?.showModal()
                                        }
                                        className="border border-blue-500 text-blue-600 px-5 py-2 rounded text-sm font-medium"
                                    >
                                        CHANGE
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ORDER SUMMARY */}
                    <div className="bg-white border border-gray-200 shadow-sm">
                        <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-3">
                            <span className="bg-white text-[#2874f0] w-5 h-5 flex items-center justify-center text-xs font-bold">
                                2
                            </span>
                            <span className="font-medium uppercase text-sm">
                                Order Summary
                            </span>
                        </div>

                        <div className="divide-y">
                            {cart.items.map(item => (
                                <div
                                    key={item.id}
                                    className="p-4 flex gap-4"
                                >
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.product_image}`}
                                        alt={item.product_title}
                                        className="w-28 h-28 object-contain"
                                    />

                                    <div className="flex-1">
                                        <h3 className="font-medium">
                                            {item.product_title}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-1">
                                            Qty: {item.quantity}
                                        </p>

                                        <div className="mt-2">
                                            <span className="font-semibold text-lg">
                                                ₹{item.total}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PAYMENT OPTIONS */}
                    <div className="bg-white border border-gray-200 shadow-sm">
                        <div className="bg-[#2874f0] text-white px-4 py-3 flex items-center gap-3">
                            <span className="bg-white text-[#2874f0] w-5 h-5 flex items-center justify-center text-xs font-bold">
                                3
                            </span>
                            <span className="font-medium uppercase text-sm">
                                Payment Options
                            </span>
                        </div>

                        <div className="divide-y">
                            <label className="flex items-center gap-3 p-4 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={selectedGateway === "mock"}
                                    onChange={() => setSelectedGateway("mock")}
                                />
                                Mock Payment
                            </label>

                            <label className="flex items-center gap-3 p-4 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={selectedGateway === "razorpay"}
                                    onChange={() => setSelectedGateway("razorpay")}
                                />
                                Razorpay
                            </label>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="lg:col-span-4">
                    <div className="sticky top-4">

                        <div className="bg-white border border-gray-200 shadow-sm">
                            <div className="px-4 py-3 border-b text-gray-500 text-sm font-medium uppercase">
                                Price Details
                            </div>

                            <div className="p-4 space-y-4">
                                <div className="flex justify-between">
                                    <span>
                                        Price ({cart.items.length} items)
                                    </span>
                                    <span>
                                        ₹{Number(cart.total_price).toLocaleString("en-IN")}
                                    </span>
                                </div>

                                <div className="flex justify-between">
                                    <span>Delivery Charges</span>
                                    <span className="text-green-600">
                                        FREE
                                    </span>
                                </div>

                                <div className="border-t pt-4 flex justify-between font-bold">
                                    <span>Total Amount</span>
                                    <span>
                                        ₹{Number(cart.total_price).toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50">
                                {error && (
                                    <div className="mb-4 p-2 test-sm text-red-700 bg-red-100 rounded">
                                        {error}
                                    </div>
                                )}
                                <button
                                    onClick={handleCheckout}
                                    disabled={placingOrder}
                                    className="w-full bg-[#fb641b] hover:bg-[#f95302] text-white py-3 font-medium"
                                >
                                    {placingOrder
                                        ? "Processing..."
                                        : "Place Order"}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

        </div>

    )

}

export default CheckoutPage
