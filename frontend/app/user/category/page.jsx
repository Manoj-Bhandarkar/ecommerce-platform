'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/axios';
import AdminOnly from '@/components/AdminOnly';
import { useRouter } from 'next/navigation';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/v1/categories/');
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to fetch taxonomy datasets from the database.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you absolutely certain you want to purge this catalog taxonomy configuration?')) return;
    try {
      await api.delete(`/api/v1/categories/${id}`);
      setCategories(prev => prev.filter(cat => cat.id !== id));
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('Failed to drop category allocation.');
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="bg-[#0B0F19] min-h-[85vh] text-slate-400 flex items-center justify-center font-medium tracking-wide">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
          <p className="text-xs uppercase font-black tracking-widest text-slate-500">Decrypting Category Taxonomies...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminOnly>
      <div className="bg-[#0B0F19] min-h-[85vh] text-white p-6 sm:p-8 md:p-12">
        <div className="container mx-auto max-w-5xl space-y-6">
          
          {/* Header Row Content */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/[0.04] pb-6">
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                📂 Catalog Categories
              </h1>
              <p className="text-xs text-slate-400 font-light mt-0.5">
                Total Taxonomy Groups: <span className="text-emerald-400 font-bold font-mono">{categories.length}</span>
              </p>
            </div>
            
            <button
              onClick={() => router.push('/user/category/create')}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              ➕ Add Category
            </button>
          </div>

          {/* Error Callout Banner Panel */}
          {error && (
            <div className="p-4 text-xs text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 font-medium tracking-wide leading-relaxed animate-pulse">
              ⚠️ {error}
            </div>
          )}

          {/* Search Management Box */}
          <div className="w-full relative max-w-md">
            <input
              type="text"
              placeholder="Filter active categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-5 py-3 bg-[#111625] text-slate-100 placeholder-slate-500 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
            />
            <span className="absolute right-4 top-3.5 opacity-40 text-sm select-none pointer-events-none">🔍</span>
          </div>

          {/* Main Grid/Table Segment */}
          {categories.length === 0 ? (
            <div className="text-center py-20 text-slate-500 bg-[#111625]/20 rounded-3xl border border-white/[0.04] border-dashed max-w-xl mx-auto space-y-2">
              <p className="text-base font-bold text-slate-400">No Taxonomies Cataloged</p>
              <p className="text-xs font-light text-slate-500">Deploy fresh structural category directories using the creation panel.</p>
            </div>
          ) : (
            <div className="bg-[#111625] rounded-2xl border border-white/[0.04] shadow-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.04] bg-white/[0.01]">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
                  Taxonomy Control Directory
                </h2>
              </div>

              {/* Data Table Core Frame */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-slate-950/40 border-b border-white/[0.04]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-wider">
                        Category Identity
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-wider">
                        Linked Product Slots
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-black text-slate-400 uppercase tracking-wider">
                        Actions Matrix
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/[0.02]">
                    {filteredCategories.map((cat) => (
                      <tr
                        key={cat.id}
                        className="hover:bg-white/[0.01] transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <p className="font-bold text-slate-200 text-base tracking-tight">
                              {cat.name}
                            </p>
                            <p className="text-xs font-mono text-slate-500 font-medium">
                              ID: #{cat.id}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center font-mono font-black text-emerald-400 text-sm">
                          {cat.products_count ?? 0}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(cat.id)}
                            className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-transparent transition-all duration-200 cursor-pointer"
                          >
                            Purge
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </AdminOnly>
  );
};

export default CategoryPage;
