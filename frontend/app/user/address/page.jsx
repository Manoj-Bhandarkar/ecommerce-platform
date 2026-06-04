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
        setError('Failed to load secure address parameters.');
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to drop this shipping allocation profile?")) return;
    try {
      await api.delete(`/api/v1/shipping/addresses/${id}`);
      setAddresses(prev => prev.filter(addr => addr.id !== id));
    } catch {
      alert("Failed to drop address profile parameters.");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0B0F19] min-h-[85vh] text-slate-400 flex items-center justify-center font-medium tracking-wide">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
          <p className="text-xs uppercase font-black tracking-widest text-slate-500">Decrypting Logistics Profiles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0B0F19] min-h-[85vh] flex items-center justify-center p-6">
        <div className="w-full max-w-md p-4 text-xs text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 font-medium tracking-wide text-center leading-relaxed">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F19] min-h-[85vh] text-white p-6 sm:p-8 md:p-12">
      <div className="container mx-auto max-w-4xl space-y-8">
        
        {/* Page Top Bar Header Container Row */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/[0.04] pb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
              📦 Shipping Profiles
            </h1>
            <p className="text-xs text-slate-400 font-light mt-0.5">Manage your active delivery destinations and allocation endpoints.</p>
          </div>

          <button
            onClick={() => router.push('/user/address/create')}
            className="sm:self-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            + Add New Profile
          </button>
        </div>

        {/* Conditional Cards List View Block */}
        {addresses.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-[#111625]/20 rounded-3xl border border-white/[0.04] border-dashed max-w-xl mx-auto space-y-2">
            <p className="text-base font-bold text-slate-400">No Address Profiles Linked</p>
            <p className="text-xs font-light text-slate-500">You haven't cataloged any delivery parameters under this secure profile yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-[#111625] rounded-2xl p-6 border border-white/[0.04] shadow-xl hover:border-white/[0.1] hover:shadow-emerald-500/[0.01] transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  
                  {/* Left Side Metadata Info Frame */}
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-slate-200 text-lg tracking-tight">
                        {addr.name}
                      </h3>
                      <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider select-none">
                        {addr.address_type || "HOME"}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-500">
                      📞 Linked Contact: <span className="text-slate-400">{addr.phone_number}</span>
                    </p>

                    <p className="text-sm text-slate-400 font-light leading-relaxed max-w-2xl pt-1">
                      {addr.address_line1}
                      {addr.address_line2 && `, ${addr.address_line2}`}
                      <br />
                      {addr.city}, {addr.state} — <span className="font-mono text-slate-300 font-bold">{addr.pin_code}</span>, {addr.country}
                    </p>
                  </div>

                  {/* Right Side Modification Action Clusters */}
                  <div className="flex items-center gap-3 w-full md:w-auto border-t border-white/[0.02] md:border-t-0 pt-4 md:pt-0 justify-end">
                    <button
                      onClick={() => router.push(`/user/address/edit/${addr.id}`)}
                      className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-white/[0.02] border border-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all duration-200 cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(addr.id)}
                      className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-transparent transition-all duration-200 cursor-pointer"
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
