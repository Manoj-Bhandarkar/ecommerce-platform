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
                setError('Failed to load product.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
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

        setForm(prev => ({ ...prev, image: file }));
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productId) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('sku', form.sku);
            formData.append('description', form.description);
            formData.append('price', form.price);
            formData.append('stock_quantity', form.stock_quantity);

            form.categories.forEach(id => {
                formData.append('category_ids', String(id));
            });

            if (form.image) formData.append('image', form.image);

            await api.patch(`/api/v1/product/${productId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            router.push('/user/product');
        } catch (err) {
            setError('Update failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AdminOnly>
                <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] text-slate-400 px-4">
                    Loading...
                </div>
            </AdminOnly>
        );
    }

    return (
        <AdminOnly>
            <div className="min-h-screen bg-[#0B0F19] text-white px-4 sm:px-6 md:px-10 py-6 flex justify-center">
                <div className="w-full max-w-3xl bg-[#111625] rounded-2xl p-4 sm:p-6 md:p-10 border border-white/5">

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-3 border-b border-white/10 pb-4">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold">Edit Product</h2>
                            <p className="text-xs text-slate-400">Update product details</p>
                        </div>

                        <button
                            onClick={() => router.push('/user/product')}
                            className="text-xs text-slate-400 hover:text-emerald-400 text-left sm:text-right"
                        >
                            Cancel
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 text-xs text-red-400 bg-red-500/10 p-3 rounded">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                        {/* Title + SKU */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Product Title"
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-sm"
                            />

                            <input
                                name="sku"
                                value={form.sku}
                                onChange={handleChange}
                                placeholder="SKU"
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-sm"
                            />
                        </div>

                        {/* Description */}
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Description"
                            className="w-full p-3 rounded bg-black/30 border border-white/10 text-sm"
                        />

                        {/* Price + Stock */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-sm"
                            />

                            <input
                                type="number"
                                name="stock_quantity"
                                value={form.stock_quantity}
                                onChange={handleChange}
                                placeholder="Stock"
                                className="w-full p-3 rounded bg-black/30 border border-white/10 text-sm"
                            />
                        </div>

                        {/* Categories */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {allCategories.map(cat => (
                                <label
                                    key={cat.id}
                                    className="flex items-center gap-2 text-xs p-2 border border-white/10 rounded"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.categories.includes(cat.id)}
                                        onChange={() => handleCategoryToggle(cat.id)}
                                    />
                                    {cat.name}
                                </label>
                            ))}
                        </div>

                        {/* Image */}
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    className="w-24 h-24 object-cover rounded"
                                />
                            )}

                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="text-sm w-full"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-emerald-500 text-black font-bold py-3 rounded text-sm"
                        >
                            {isSubmitting ? 'Updating...' : 'Update Product'}
                        </button>

                    </form>
                </div>
            </div>
        </AdminOnly>
    );
};

export default ProductEditPage;