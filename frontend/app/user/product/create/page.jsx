'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/axios';
import AdminOnly from '@/components/AdminOnly';

const ProductCreatePage = () => {
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sku: '',
    price: '',
    stock_quantity: '',
    category_ids: [],
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/v1/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setError('Failed to load catalog category taxonomies.');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files?.[0];
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      if (file) {
        setPreview(URL.createObjectURL(file));
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('sku', formData.sku);
      payload.append('price', formData.price);
      payload.append('stock_quantity', formData.stock_quantity);
      formData.category_ids.forEach((id) => payload.append('category_ids', id));
      if (formData.image) payload.append('image', formData.image);

      await api.post('/api/v1/product/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.push('/user/product');
    } catch (err) {
      console.error('Failed to create product:', err);
      setError(err.response?.data?.detail || 'Failed to archive and deploy new product profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminOnly>
      <div className="bg-[#0B0F19] min-h-screen text-white p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Dynamic Background Blur Mesh Layer */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />

        {/* Focused Max-Width Form Envelope Container */}
        <div className="w-full max-w-2xl bg-[#111625] rounded-3xl border border-white/[0.04] shadow-2xl p-6 sm:p-10 space-y-6 relative z-10">

          {/* Header Block Row */}
          <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                ➕ Add New Product
              </h2>
              <p className="text-xs text-slate-400 font-light mt-0.5">Deploy a new visual merchandise listing into the global inventory.</p>
            </div>

            <button
              type="button"
              onClick={() => router.push('/user/product')}
              className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer select-none"
            >
              ← Cancel
            </button>
          </div>

          {/* Dynamic Error Callout Banner Panel */}
          {error && (
            <div className="p-4 text-xs text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 font-medium tracking-wide leading-relaxed animate-pulse">
              ⚠️ {error}
            </div>
          )}

          {/* Core Configuration Input Forms Pipeline */}
          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Product Title *</label>
                <input
                  type="text"
                  name="title"
                  placeholder="e.g., Wireless Audio Pods Gen-3"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">SKU Code Identifier *</label>
                <input
                  type="text"
                  name="sku"
                  placeholder="e.g., AUDIO-PODS-G3"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Editorial Overview / Description *</label>
              <textarea
                name="description"
                placeholder="Detail the technical specifications sheets and consumer features parameters here..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Price Base Value (INR) *</label>
                <input
                  type="number"
                  name="price"
                  placeholder="₹ Cost amount"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min={0}
                  className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Stock Deployment Quantity *</label>
                <input
                  type="number"
                  name="stock_quantity"
                  placeholder="Units count available"
                  value={formData.stock_quantity}
                  onChange={handleChange}
                  required
                  min={0}
                  className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner font-mono"
                />
              </div>
            </div>

            {/* Category Node Checkboxes Cluster */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Taxonomy Category Mappings *
              </label>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => {
                  const isChecked = formData.category_ids.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer transition-all duration-300 select-none text-xs uppercase font-bold tracking-wider
                        ${isChecked
                          ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400'
                          : 'border-white/[0.04] bg-slate-950/10 text-slate-400 hover:border-white/[0.1]'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        className="accent-emerald-400 w-3.5 h-3.5 cursor-pointer"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData((prev) => ({
                              ...prev,
                              category_ids: [...prev.category_ids, cat.id],
                            }));
                          } else {
                            setFormData((prev) => ({
                              ...prev,
                              category_ids: prev.category_ids.filter((id) => id !== cat.id),
                            }));
                          }
                        }}
                      />
                      <span className="truncate">{cat.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>


            {/* Product Image Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                Product Image
              </label>

              <div className="border border-white/[0.04] rounded-2xl p-4 bg-slate-950/20">
                <div className="flex flex-col sm:flex-row items-center gap-4">

                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl border border-white/[0.04] shrink-0"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-xl border border-dashed border-white/[0.08] flex items-center justify-center text-slate-500 text-xs text-center">
                      No Image
                    </div>
                  )}

                  <div className="flex-1 w-full">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full text-sm text-slate-400 file:mr-4 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-emerald-500/10 file:text-emerald-400 file:font-bold file:cursor-pointer cursor-pointer"
                    />

                    <p className="text-[11px] text-slate-500 mt-2">
                      JPG, PNG, WEBP supported.
                    </p>
                  </div>

                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
              >
                {loading
                  ? 'Deploying Product Profile...'
                  : 'Create Product'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </AdminOnly>
  )
}

export default ProductCreatePage
