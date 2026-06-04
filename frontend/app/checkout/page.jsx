'use client';

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";
import api from "@/utils/axios";

const CheckoutPage = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [cart, setCart] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [selectedGateway, setSelectedGateway] = useState('mock');
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load Razorpay Script Safely into DOM Pipeline
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const fetchCartAndAddresses = async () => {
        try {
            const [cartRes, addrRes] = await Promise.all([
                api.get("/api/v1/cart"),
                api.get("/api/v1/shipping/address"),
            ]);
            setCart(cartRes.data);
            setAddresses(addrRes.data || []);
            if (addrRes.data && addrRes.data.length > 0) {
                setSelectedAddressId(addrRes.data[0].id);
            }
        } catch (err) {
            console.error("Error loading checkout data:", err);
            setError("Failed to coordinate secure checkout assets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/login?redirect=/checkout");
            } else {
                fetchCartAndAddresses();
            }
        }
    }, [authLoading, user]);

    const handleCheckout = async () => {
        if (!selectedAddressId) {
            setError("Please select a shipping address.");
            return;
        }
        if (!selectedGateway) {
            setError("Please select a payment gateway.");
            return;
        }

        setError(null);
        setPlacingOrder(true);

        try {
            const res = await api.post("/api/v1/order/checkout", {
                amount: cart.total_price,
                shipping_address_id: selectedAddressId,
                gateway: selectedGateway,
                simulate_success: true,
            });

            const data = res.data;

            if (selectedGateway === "razorpay") {
                if (typeof window === 'undefined' || !window.Razorpay) {
                    setError("Razorpay secure terminal failed to init. Refresh the dashboard.");
                    setPlacingOrder(false);
                    return;
                }

                const options = {
                    key: data.razorpay_data.razorpay_key,
                    amount: data.razorpay_data.amount,
                    currency: data.razorpay_data.currency,
                    name: "Manoj Cart Drops",
                    description: "Premium Digital Checkout",
                    order_id: data.razorpay_data.pg_order_id,
                    prefill: {
                        name: user.name || "",
                        email: user.email || "",
                        contact: user.phone_number || "",
                    },
                    theme: {
                        color: "#10B981",
                    },
                    handler: async function (response) {
                        try {
                            const verifyRes = await api.post("/api/v1/payment/razorpay-callback", response);
                            if (verifyRes.data.status === 'success') {
                                router.push("/user/order");
                            } else {
                                setError("Payment verification signatures mismatched. Contact Support.");
                            }
                        } catch (err) {
                            setError("Payment network authorization loop failed.");
                        }
                    },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                router.push("/user/order");
            }
        } catch (err) {
            console.error("Checkout operational error:", err);
            setError(err.response?.data?.detail || "Checkout operation sequence failed.");
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="bg-[#0B0F19] min-h-screen text-slate-400 flex items-center justify-center font-medium tracking-wide">
                <div className="flex flex-col items-center gap-3">
                    <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
                    <p className="text-xs uppercase font-black tracking-widest text-slate-500">Authorizing Checkout Matrix...</p>
                </div>
            </div>
        );
    }

    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="bg-[#0B0F19] min-h-screen text-white flex items-center justify-center p-6">
                <div className="text-center max-w-sm space-y-6 bg-[#111625] p-10 rounded-3xl border border-white/[0.04] shadow-2xl">
                    <div className="text-5xl select-none animate-bounce">🛒</div>
                    <div className="space-y-1">
                        <h2 className="text-xl font-black tracking-tight">Your Cart is Empty</h2>
                        <p className="text-xs text-slate-400 font-light">No active allocations are currently reserved under your profile.</p>
                    </div>
                    <button
                        onClick={() => router.push('/product')}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/10 cursor-pointer block"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0B0F19] min-h-screen text-white pb-24 pt-6">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">

                {error && (
                    <div className="mb-6 p-4 text-xs text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 font-medium tracking-wide flex items-center gap-2 animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Checkout Sections */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* BOX 1: DELIVERY LOGISTICS */}
                        <div className="bg-[#111625] rounded-2xl border border-white/[0.04] shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-white/[0.04] px-4 sm:px-6 py-4 flex items-center gap-3">
                                <span className="bg-emerald-400 text-slate-950 w-5 h-5 flex items-center justify-center text-xs font-black rounded-md">
                                    1
                                </span>
                                <span className="font-black uppercase text-xs tracking-wider text-slate-200 px-4 sm:px-6">
                                    Delivery Destination
                                </span>
                            </div>

                            <div className="p-6">
                                {selectedAddress ? (
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="font-bold text-slate-200 text-base">{selectedAddress.name}</span>
                                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider">
                                                    {selectedAddress.address_type || "HOME"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-400 font-light leading-relaxed">
                                                {selectedAddress.address_line1}
                                                {selectedAddress.address_line2 && `, ${selectedAddress.address_line2}`}
                                                <br />
                                                {selectedAddress.city}, {selectedAddress.state} — <span className="font-mono text-slate-300 font-bold">{selectedAddress.pin_code}</span>
                                            </p>
                                            <p className="text-xs font-medium text-slate-500 pt-1">
                                                📞 Contact: {selectedAddress.phone_number}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="w-full sm:w-auto px-4 py-2 self-start rounded-xl text-xs uppercase font-black tracking-wider bg-white/[0.02] border border-white/[0.04] text-slate-300 hover:bg-emerald-400 hover:text-slate-950 hover:border-transparent transition-all duration-300 cursor-pointer"
                                        >
                                            Change Address
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 space-y-4">
                                        <p className="text-sm text-slate-400 font-light">No shipping configurations linked under your current profile.</p>
                                        <Link href="/user/profile" className="inline-block px-5 py-2.5 rounded-xl text-xs uppercase font-black tracking-wider bg-emerald-500 text-slate-950 transition-transform duration-300 hover:scale-105 shadow-lg shadow-emerald-500/10 font-bold">
                                            + Add New Address
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* BOX 2: GATEWAY INTERACTIVE CONFIGURATOR */}
                        <div className="bg-[#111625] rounded-2xl border border-white/[0.04] shadow-xl overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-b border-white/[0.04] px-4 sm:px-6 py-4 flex items-center gap-3">
                                <span className="bg-emerald-400 text-slate-950 w-5 h-5 flex items-center justify-center text-xs font-black rounded-md">
                                    2
                                </span>
                                <span className="font-black uppercase text-xs tracking-wider text-slate-200">
                                    Payment Gateway
                                </span>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gateway"
                                            value="mock"
                                            checked={selectedGateway === 'mock'}
                                            onChange={() => setSelectedGateway('mock')}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-500 flex items-center justify-center peer-data-[state=checked]:border-emerald-400 transition-colors">
                                            <div className="w-3 h-3 rounded-full bg-emerald-400 opacity-0 peer-data-[state=checked]:opacity-100 transition-opacity"></div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-300">Mock Gateway (Test Mode)</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio" name="gateway"
                                            value="razorpay"
                                            checked={selectedGateway === 'razorpay'}
                                            onChange={() => setSelectedGateway('razorpay')}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-500 flex items-center justify-center peer-data-[state=checked]:border-emerald-400 transition-colors">
                                            <div className="w-3 h-3 rounded-full bg-emerald-400 opacity-0 peer-data-[state=checked]:opacity-100 transition-opacity"></div>
                                        </div>
                                        <span className="text-sm font-medium text-slate-300">Razorpay (Live Mode)</span>
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500 font-light">Select your preferred payment gateway for secure transaction processing.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Order Summary */}
                    <div className="lg:col-span-4">
                        <div className="bg-[#111625] rounded-2xl border border-white/[0.04] shadow-xl p-4 sm:p-6 lg:sticky lg:top-24">
                            <h2 className="text-lg font-black tracking-wide mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                {cart.items.map(item => (
                                    <div key={item.id} className="flex gap-3 sm:gap-4 items-start">
                                        <img src={item.product_image} alt={item.product_name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0" />
                                        <div className="flex-1">
                                            <h3 className="text-xs sm:text-sm font-medium break-words">{item.product_name}</h3>
                                            <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                                        </div>
                                        <span className="text-xs sm:text-sm font-bold text-emerald-400 whitespace-nowrap">₹{(item.unit_price * item.quantity).toLocaleString('en-IN')}   </span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-white/[0.04] mt-6 pt-4">

                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-500">Total:</span>
                                    <span className="text-lg font-bold text-emerald-400">₹{Number(cart.total_price).toLocaleString('en-IN')}</span>
                                </div>
                                <button
                                    onClick={handleCheckout}
                                    disabled={placingOrder}
                                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider py-3 sm:py-4 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {placingOrder ? "Processing..." : "Place Order"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ADDRESS SELECTION MODAL */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-[#111625] rounded-2xl border border-white/[0.04] shadow-xl p-4 sm:p-6 w-[95%] max-w-md">
                            <h2 className="text-lg font-black tracking-wide mb-4">Select Shipping Address</h2>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                                {addresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        onClick={() => {
                                            setSelectedAddressId(addr.id);
                                            setIsModalOpen(false);
                                        }}
                                        className={`p-4 rounded-xl border cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/[0.04] hover:bg-white/[0.02]'}`}
                                    >
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-slate-200 text-sm sm:text-base break-words">{addr.name}</span>
                                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider">
                                                {addr.address_type || "HOME"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-400 font-light leading-relaxed">
                                            {addr.address_line1}
                                            {addr.address_line2 && `, ${addr.address_line2}`}
                                            <br />
                                            {addr.city}, {addr.state} — <span className="font-mono text-slate-300 font-bold">{addr.pin_code}</span>
                                        </p>
                                        <p className="text-xs font-medium text-slate-500 pt-1">
                                            📞 Contact: {addr.phone_number}
                                        </p>
                                    </div>
                                ))}
                                {addresses.length === 0 && (
                                    <p className="text-sm text-slate-400 font-light text-center">No shipping addresses found. Please add one in your profile.</p>
                                )}
                            </div>
                            <button
                                onClick={() => router.push('/user/profile')}
                                className="mt-6 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/10"
                            >
                                Manage Addresses
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
export default CheckoutPage;