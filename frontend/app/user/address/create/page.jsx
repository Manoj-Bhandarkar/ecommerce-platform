'use client';

import { useState } from 'react';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';

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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Local Regex Client Validation Rules
    if (!/^\d{10}$/.test(form.phone_number)) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }
    if (!/^\d{6}$/.test(form.pin_code)) {
      setError("PIN code must be exactly 6 digits.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/v1/shipping/address", form);
      router.push("/user/address");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Failed to archive address parameters."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0B0F19] min-h-[85vh] text-white p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Decorative Ambient Blur Mesh Layer */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />

      {/* Focused Max-Width Form Envelope */}
      <div className="w-full max-w-2xl bg-[#111625] rounded-3xl border border-white/[0.04] shadow-2xl p-6 sm:p-10 space-y-6 relative z-10">
        
        {/* Structural Headers Header Row */}
        <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">Add Shipping Address</h2>
            <p className="text-xs text-slate-400 font-light mt-0.5">Register delivery endpoints for fast product allocations.</p>
          </div>

          <button
            type="button"
            onClick={() => router.push('/user/address')}
            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1.5 select-none"
          >
            ← Back
          </button>
        </div>

        {/* Dynamic Client/Server Error Banner Alert */}
        {error && (
          <div className="p-4 text-xs text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 font-medium tracking-wide leading-relaxed animate-pulse">
            ⚠️ {error}
          </div>
        )}

        {/* Inputs Registry Grid Layout */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Recipient Name *</label>
              <input
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number *</label>
              <input
                name="phone_number"
                type="tel"
                placeholder="10-digit mobile number"
                value={form.phone_number}
                onChange={handleChange}
                maxLength={10}
                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Address Line 1 (Flat, House No, Building) *</label>
            <input
              name="address_line1"
              type="text"
              placeholder="Apartment complex, street name"
              value={form.address_line1}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Address Line 2 (Locality, Landmark)</label>
            <input
              name="address_line2"
              type="text"
              placeholder="Near tech park, sector region"
              value={form.address_line2}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">City *</label>
              <input
                name="city"
                type="text"
                placeholder="Mumbai"
                value={form.city}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">State *</label>
              <input
                name="state"
                type="text"
                placeholder="Maharashtra"
                value={form.state}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Pin Code *</label>
              <input
                name="pin_code"
                type="text"
                placeholder="6-digit PIN"
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
                name="country"
                type="text"
                placeholder="India"
                value={form.country}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                required
              />
            </div>
          </div>

          {/* Premium Emerald CTA Trigger Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-gradient-to-r
                from-emerald-500
                to-teal-500
                hover:from-emerald-400
                hover:to-teal-400
                text-slate-950
                py-4
                rounded-xl
                font-black
                text-xs
                uppercase
                tracking-wider
                text-center
                transition-all
                duration-300
                shadow-xl
                shadow-emerald-500/10
                hover:scale-[1.01]
                active:scale-[0.99]
                disabled:opacity-20
                disabled:cursor-not-allowed
                disabled:hover:scale-100
                cursor-pointer
                block
              "
            >
              {loading ? 'Archiving Address Parameters...' : 'Save Logistics Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAddress;
