'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/axios';
import AdminOnly from '@/components/AdminOnly';
import { useRouter } from 'next/navigation';

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/v1/categories/');
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this category?'
    );

    if (!confirmed) return;

    try {
      await api.delete(`/api/v1/categories/${id}`);

      setCategories((prev) =>
        prev.filter((cat) => cat.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert('Failed to delete category.');
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <AdminOnly>
        <div className="bg-[#0B0F19] min-h-screen flex items-center justify-center px-4">
          <div className="flex flex-col items-center gap-4">
            <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
            <p className="text-xs uppercase tracking-widest font-black text-slate-500">
              Loading Categories...
            </p>
          </div>
        </div>
      </AdminOnly>
    );
  }

  return (
    <AdminOnly>
      <div className="bg-[#0B0F19] min-h-screen text-white px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.04] pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">
                📂 Categories
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Total Categories:{' '}
                <span className="text-emerald-400 font-bold">
                  {categories.length}
                </span>
              </p>
            </div>

            <button
              onClick={() => router.push('/user/category/create')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-500/10"
            >
              ➕ Add Category
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* Search */}
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#111625] border border-white/[0.04] text-white placeholder-slate-500 outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Empty State */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20 bg-[#111625]/20 border border-dashed border-white/[0.04] rounded-3xl">
              <h3 className="text-lg font-bold text-slate-300">
                No Categories Found
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Create a category to get started.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-hidden rounded-2xl border border-white/[0.04] bg-[#111625]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-950/40 border-b border-white/[0.04]">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs uppercase text-slate-400">
                          Category
                        </th>

                        <th className="px-6 py-4 text-center text-xs uppercase text-slate-400">
                          Products
                        </th>

                        <th className="px-6 py-4 text-right text-xs uppercase text-slate-400">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredCategories.map((cat) => (
                        <tr
                          key={cat.id}
                          className="border-b border-white/[0.03] hover:bg-white/[0.02]"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-white">
                                {cat.name}
                              </p>

                              <p className="text-xs text-slate-500">
                                ID #{cat.id}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-center text-emerald-400 font-bold">
                            {cat.products_count ?? 0}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDelete(cat.id)}
                              className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase hover:bg-rose-500 hover:text-white transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredCategories.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-[#111625] border border-white/[0.04] rounded-2xl p-5"
                  >
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-lg text-white">
                          {cat.name}
                        </h3>

                        <p className="text-xs text-slate-500">
                          ID #{cat.id}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-400">
                          Products
                        </span>

                        <span className="font-bold text-emerald-400">
                          {cat.products_count ?? 0}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="w-full py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminOnly>
  );
}