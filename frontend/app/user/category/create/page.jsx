'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';
import AdminOnly from '@/components/AdminOnly';

const CreateCategoryPage = () => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await api.post('/api/v1/categories/', { name });
      router.push('/user/category');
    } catch (err) {
      console.error('Failed to create category:', err);
      setError(
        err.response?.data?.detail || 
        'Failed to establish new catalog category metrics.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminOnly>
      <div className="bg-[#0B0F19] min-h-[85vh] text-white p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Dynamic Ambient Glow Backmesh Overlay */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

        {/* Focused Panel Envelope Block */}
        <div className="w-full max-w-md bg-[#111625] rounded-3xl border border-white/[0.04] p-8 sm:p-10 shadow-2xl space-y-6 relative z-10">
          
          {/* Header Block Row Container */}
          <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                ➕ Create Category
              </h2>
              <p className="text-xs text-slate-400 font-light">Deploy fresh structural taxonomies into the core catalog matrix.</p>
            </div>

            <button
              type="button"
              onClick={() => router.push('/user/category')}
              className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer select-none"
            >
              ← Cancel
            </button>
          </div>

          {/* Dynamic Server Error Banner Alerts */}
          {error && (
            <div className="p-4 text-xs text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 font-medium tracking-wide leading-relaxed animate-pulse">
              ⚠️ {error}
            </div>
          )}

          {/* Input Submission Pipeline Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Category Name *</label>
              <input
                name="name"
                type="text"
                placeholder="e.g., Ultra-Gadgets, Summer-Capitals"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner disabled:opacity-40"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Premium Emerald CTA Trigger Button Element */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full
                mt-2
                bg-gradient-to-r
                from-emerald-500
                to-teal-500
                hover:from-emerald-400
                hover:to-teal-400
                text-slate-950
                py-3.5
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
              {isSubmitting ? "Deploying Taxonomy Keys..." : "Initialize New Category"}
            </button>
          </form>

        </div>
      </div>
    </AdminOnly>
  );
};

export default CreateCategoryPage;
