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
                setError('Failed to load address.');
            } finally {
                setFetching(false);
            }
        };

        if (params?.id) {
            fetchAddress();
        }
    }, [params?.id]);

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
                err.response?.data?.detail || 'Failed to update address.'
            );
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="bg-[#0B0F19] min-h-screen flex items-center justify-center px-4">
                <div className="flex flex-col items-center gap-4">
                    <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
                    <p className="text-xs uppercase tracking-widest font-black text-slate-500">
                        Loading Address...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#0B0F19] min-h-screen text-white px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 flex items-center justify-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />

            {/* Form Card */}
            <div className="w-full max-w-2xl bg-[#111625] rounded-2xl sm:rounded-3xl border border-white/[0.04] shadow-2xl p-5 sm:p-8 md:p-10 space-y-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-b border-white/[0.04] pb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                            Edit Shipping Address
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-400 font-light mt-1">
                            Update your delivery information.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => router.push('/user/address')}
                        className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                        ← Cancel
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="p-4 text-xs sm:text-sm text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 font-medium leading-relaxed">
                        ⚠️ {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name + Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                Recipient Name *
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm outline-none transition-all duration-300 shadow-inner"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                Phone Number *
                            </label>

                            <input
                                type="tel"
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                inputMode="numeric"
                                maxLength={10}
                                required
                                className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm outline-none transition-all duration-300 shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Address Line 1 */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            Address Line 1 *
                        </label>

                        <input
                            type="text"
                            name="address_line1"
                            value={form.address_line1}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm outline-none transition-all duration-300 shadow-inner"
                        />
                    </div>

                    {/* Address Line 2 */}
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                            Address Line 2
                        </label>

                        <input
                            type="text"
                            name="address_line2"
                            value={form.address_line2}
                            onChange={handleChange}
                            className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm outline-none transition-all duration-300 shadow-inner"
                        />
                    </div>

                    {/* City + State */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                City *
                            </label>

                            <input
                                type="text"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm outline-none transition-all duration-300 shadow-inner"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                State *
                            </label>

                            <input
                                type="text"
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm outline-none transition-all duration-300 shadow-inner"
                            />
                        </div>
                    </div>

                    {/* PIN + Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                PIN Code *
                            </label>

                            <input
                                type="text"
                                name="pin_code"
                                value={form.pin_code}
                                onChange={handleChange}
                                inputMode="numeric"
                                maxLength={6}
                                required
                                className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm outline-none transition-all duration-300 shadow-inner font-mono"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                Country *
                            </label>

                            <input
                                type="text"
                                name="country"
                                value={form.country}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 sm:py-3.5 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm outline-none transition-all duration-300 shadow-inner"
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Updating Address...' : 'Update Address'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAddress;