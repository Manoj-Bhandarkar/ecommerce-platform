'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';

export default function AddressPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const res = await api.get('/api/v1/shipping/address');
        setAddresses(res.data || []);
      } catch (err) {
        setError('Failed to load shipping addresses.');
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this address?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/api/v1/shipping/addresses/${id}`);

      setAddresses((prev) =>
        prev.filter((address) => address.id !== id)
      );
    } catch (err) {
      alert('Failed to delete address.');
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0B0F19] min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4">
          <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
          <p className="text-xs uppercase tracking-widest font-black text-slate-500">
            Loading Addresses...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0B0F19] min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md p-4 text-xs sm:text-sm text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 text-center">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F19] min-h-screen text-white px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.04] pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              📦 Shipping Addresses
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your delivery locations and shipping profiles.
            </p>
          </div>

          <button
            onClick={() => router.push('/user/address/create')}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:scale-[1.02]"
          >
            + Add Address
          </button>
        </div>

        {/* Empty State */}
        {addresses.length === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-[#111625]/20 rounded-3xl border border-dashed border-white/[0.04]">
            <p className="text-base sm:text-lg font-bold text-slate-300">
              No Addresses Found
            </p>

            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Add your first shipping address to continue.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-[#111625] border border-white/[0.04] rounded-2xl p-5 sm:p-6 shadow-xl hover:border-white/[0.08] transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  {/* Address Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-white">
                        {addr.name}
                      </h3>

                      <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {addr.address_type || 'HOME'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mb-3">
                      📞 {addr.phone_number}
                    </p>

                    <p className="text-sm text-slate-300 leading-relaxed break-words">
                      {addr.address_line1}
                      {addr.address_line2 &&
                        `, ${addr.address_line2}`}
                      <br />
                      {addr.city}, {addr.state} -{' '}
                      <span className="font-mono font-bold">
                        {addr.pin_code}
                      </span>
                      , {addr.country}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <button
                      onClick={() =>
                        router.push(
                          `/user/address/edit/${addr.id}`
                        )
                      }
                      className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-white/[0.03] border border-white/[0.05] text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-transparent transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}