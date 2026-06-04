'use client';

import { useState, useEffect } from 'react';
import api from '@/utils/axios';
import { useRouter, useParams } from 'next/navigation';

const EditAddress = () => {
    const router = useRouter();
    const params = useParams();

    const [form, setForm] = useState({
        name: '',
        phone_number: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        pin_code: '',
        country: '',
    });

    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const res = await api.get(`/api/v1/shipping/address/${params.id}`);

                setForm({
                    name: res.data.name || '',
                    phone_number: res.data.phone_number || '',
                    address_line1: res.data.address_line1 || '',
                    address_line2: res.data.address_line2 || '',
                    city: res.data.city || '',
                    state: res.data.state || '',
                    pin_code: res.data.pin_code || '',
                    country: res.data.country || '',
                });
            } catch (err) {
                setError('Failed to load address configuration.');
            } finally {
                setFetching(false);
            }
        };

        if (params.id) {
            fetchAddress();
        }
    }, [params.id]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!/^\d{10}$/.test(form.phone_number)) {
            setError('Phone number must be exactly 10 digits.');
            return;
        }

        if (!/^\d{6}$/.test(form.pin_code)) {
            setError('PIN code must be exactly 6 digits.');
            return;
        }

        setLoading(true);

        try {
            await api.patch(`/api/v1/shipping/addresses/${params.id}`, form);
            router.push('/user/address');
        } catch (err) {
            setError(
                err.response?.data?.detail ||
                'Failed to update logistics metrics.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="bg-[#0B0F19] min-h-[85vh] text-slate-400 flex items-center justify-center font-medium tracking-wide">
                <div className="flex flex-col items-center gap-3">
                    <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
                    <p className="text-xs uppercase font-black tracking-widest text-slate-500">Retrieving Address Keys...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0B0F19] min-h-[85vh] text-white p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Decorative Ambient Blur Mesh */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />

            {/* Focused Form Envelope Wrapper */}
            <div className="w-full max-w-2xl bg-[#111625] rounded-3xl border border-white/[0.04] shadow-2xl p-6 sm:p-10 space-y-6 relative z-10">

                {/* Header Block Row */}
                <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight">Modify Shipping Profile</h2>
                        <p className="text-xs text-slate-400 font-light mt-0.5">Edit delivery destination values linked to this user tag.</p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push('/user/address')}
                        className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 select-none"
                    >
                        ← Cancel
                    </button>
                </div>

                {/* Dynamic Context Validation Error Banner */}
                {error && (
                    <div className="p-4 text-xs text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 font-medium tracking-wide leading-relaxed animate-pulse">
                        ⚠️ {error}
                    </div>
                )}

                {/* Input Registry Framework */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Recipient Name *</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                maxLength={10}
                                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Address Line 1 *</label>
                        <input
                            type="text"
                            name="address_line1"
                            value={form.address_line1}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Address Line 2</label>
                        <input
                            type="text"
                            name="address_line2"
                            value={form.address_line2}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">City *</label>
                            <input
                                type="text"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">State *</label>
                            <input
                                type="text"
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">PIN Code *</label>
                            <input
                                type="text"
                                name="pin_code"
                                value={form.pin_code}
                                onChange={handleChange}
                                maxLength={6}
                                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner font-mono"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Country *</label>
                            <input
                                type="text"
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    {/* Premium Form Dispatch Submission Key Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-500                to-teal-500                hover:from-emerald-400                hover:to-teal-400                text-slate-950                py-4                rounded-xl                font-black                text-xs                uppercase                tracking-wider                text-center                transition-all                duration-300                shadow-xlshadow-emerald-500/10hover:scale-[1.01]active:scale-[0.99]disabled:opacity-20disabled:cursor-not-alloweddisabled:hover:scale-100cursor-pointerblock"
                        >
                            {loading ? "Updating Address..." : "Update Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default EditAddress;