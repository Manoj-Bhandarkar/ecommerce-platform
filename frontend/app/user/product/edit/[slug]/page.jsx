'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/utils/axios';
import AdminOnly from '@/components/AdminOnly';
const ProductEditPage = () => {
    const router = useRouter();
    const params = useParams();
    const slug = params?.slug;

    const [loading, setLoading] = useState(true);
    const [productId, setProductId] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [allCategories, setAllCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        sku: '',
        description: '',
        price: '',
        stock_quantity: '',
        categories: [],
        image: null,
    });

    useEffect(() => {
        if (!slug) return;

        const fetchData = async () => {
            try {
                const [productRes, categoriesRes] = await Promise.all([
                    api.get(`/api/v1/product/${slug}`),
                    api.get('/api/v1/categories'),
                ]);

                const product = productRes.data;
                setProductId(product.id);

                setForm({
                    title: product.title || '',
                    sku: product.sku || '',
                    description: product.description || '',
                    price: product.price || '',
                    stock_quantity: product.stock_quantity || '',
                    categories: product.categories?.map(cat => cat.id) || [],
                    image: null,
                });

                setAllCategories(categoriesRes.data || []);

                if (product.image_url) {
                    const formattedUrl = product.image_url.startsWith('http')
                        ? product.image_url
                        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image_url.replace(/^\/+/, '')}`;
                    setPreviewUrl(formattedUrl);
                }
            } catch (err) {
                console.error('Failed loading product details:', err);
                setError('Failed to extract product configuration parameters.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // Clean memory garbage buffers securely when blob assets switch frames
    useEffect(() => {
        let currentUrl = previewUrl;

        return () => {
            if (currentUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(currentUrl);
            }
        };
    }, [previewUrl]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
        setError('');
    };

    const handleCategoryToggle = (id) => {
        setForm(prev => ({
            ...prev,
            categories: prev.categories.includes(id)
                ? prev.categories.filter(cat => cat !== id)
                : [...prev.categories, id],
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setForm(prev => ({
            ...prev,
            image: file,
        }));

        const imagePreview = URL.createObjectURL(file);
        setPreviewUrl(imagePreview);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productId) return;
        if (!form.title.trim()) {
            setError('Product title is required.');
            return;
        }

        if (form.categories.length === 0) {
            setError('Please select at least one category.');
            return;
        }
        setIsSubmitting(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('sku', form.sku);
            formData.append('description', form.description);
            formData.append('price', form.price);
            formData.append('stock_quantity', form.stock_quantity);

            form.categories.forEach(catId => {
                formData.append('category_ids', String(catId));
            });
            if (form.image) {
                formData.append('image', form.image);
            }

            await api.patch(`/api/v1/product/${productId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            router.push('/user/product');
        } catch (err) {
            console.error('Update failed operational sequence:', err);
            setError(err.response?.data?.detail || 'Failed to sync modifications back to database catalog.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AdminOnly>
                <div className="bg-[#0B0F19] min-h-[85vh] text-slate-400 flex items-center justify-center font-medium tracking-wide">
                    <div className="flex flex-col items-center gap-3">
                        <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
                        <p className="text-xs uppercase font-black tracking-widest text-slate-500">Decrypting Product Allocation Records...</p>
                    </div>
                </div>
            </AdminOnly>
        );
    }

    return (
        <AdminOnly>
            <div className="bg-[#0B0F19] min-h-screen text-white p-6 sm:p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden">
                {/* Ambient Glow Graphic Layer */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />

                {/* Structural Form Wrap Block */}
                <div className="w-full max-w-2xl bg-[#111625] rounded-3xl border border-white/[0.04] shadow-2xl p-6 sm:p-10 space-y-6 relative z-10">

                    {/* Header Row Bar */}
                    <div className="flex justify-between items-center border-b border-white/[0.04] pb-4">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                                ✏️ Edit Product
                            </h2>
                            <p className="text-xs text-slate-400 font-light mt-0.5">Modify inventory details, stock targets, and category slots.</p>
                        </div>

                        <button
                            type="button"
                            onClick={() => router.push('/user/product')}
                            className="text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer select-none"
                        >
                            ← Cancel
                        </button>
                    </div>

                    {/* Error Banner Callout */}
                    {error && (
                        <div className="p-4 text-xs text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 font-medium tracking-wide leading-relaxed animate-pulse">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form Processing Input Deck */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Product Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">SKU Identifier *</label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={form.sku}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner font-mono"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Description Overview *</label>
                            <textarea
                                name="description"
                                rows={4}
                                value={form.description}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner resize-none leading-relaxed"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Price Valuation (INR) *</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner font-mono"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Stock Quantity *</label>
                                <input
                                    type="number"
                                    name="stock_quantity"
                                    value={form.stock_quantity}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner font-mono"
                                    required
                                />
                            </div>
                        </div>

                        {/* Category Cluster Select Checkboxes */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Taxonomy Category Mappings *</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {allCategories.map(cat => {
                                    const isChecked = form.categories.includes(cat.id);
                                    return (
                                        <label
                                            key={cat.id}
                                            className={`flex items-center gap-3 border rounded-xl p-3.5 cursor-pointer transition-all duration-300 select-none text-xs uppercase font-bold tracking-wider ${isChecked ? 'border-emerald-500 bg-emerald-500/5 text-emerald-400' : 'border-white/[0.04] bg-slate-950/10 text-slate-400 hover:border-white/[0.1]'}`}
                                        >
                                            <input type="checkbox" checked={isChecked} className="accent-emerald-400 w-3.5 h-3.5 cursor-pointer" onChange={() => handleCategoryToggle(cat.id)} />
                                            {cat.name}
                                        </label>
                                    )
                                })
                                }

                            </div>
                        </div>
                        {/* Image Section */}
                        <div className="space-y-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                                Product Image
                            </label>

                            <div className="flex items-center gap-4">
                                {previewUrl && (
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-28 h-28 object-cover rounded-xl border border-white/[0.04]"
                                    />
                                )}

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="flex-1 text-sm text-slate-300 border border-white/[0.04] bg-slate-950/40 rounded-xl p-3"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 py-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-xl shadow-emerald-500/10 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Updating Product...' : 'Update Product'}
                        </button>

                    </form>
                </div>
            </div>
        </AdminOnly>
    );
};

export default ProductEditPage;