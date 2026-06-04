'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';
import AdminOnly from '@/components/AdminOnly';

export default function CreateCategoryPage() {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await api.post('/api/v1/categories/', {
        name: name.trim(),
      });

      router.push('/user/category');
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        'Failed to create category.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminOnly>
      <div className="bg-[#0B0F19] min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-emerald-500/5 blur-[120px]" />
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-lg bg-[#111625] border border-white/[0.04] rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.04] pb-5">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                ➕ Create Category
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Add a new category to organize products.
              </p>
            </div>

            <button
              type="button"
              onClick={() => router.push('/user/category')}
              className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition"
            >
              ← Back
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-6 p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Category Name
              </label>

              <input
                type="text"
                placeholder="Electronics"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                disabled={isSubmitting}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-950/40 border border-white/[0.04] text-white placeholder-slate-600 outline-none focus:border-emerald-500/50 transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? 'Creating Category...'
                : 'Create Category'}
            </button>
          </form>
        </div>
      </div>
    </AdminOnly>
  );
}