'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/utils/axios'
import AdminOnly from '@/components/AdminOnly'

export default function ProductEditPage() {
    const router = useRouter()
    const params = useParams()
    const slug = params?.slug

    const [loading, setLoading] = useState(true)
    const [productId, setProductId] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const [allCategories, setAllCategories] = useState([])

    const [form, setForm] = useState({
        title: '',
        sku: '',
        description: '',
        price: '',
        stock_quantity: '',
        categories: [],
        image: null,
    })

    useEffect(() => {
        if (!slug) return

        const fetchData = async () => {
            try {
                const [productRes, categoriesRes] = await Promise.all([
                    api.get(`/api/v1/product/${slug}`),
                    api.get('/api/v1/categories'),
                ])

                const product = productRes.data

                setProductId(product.id)

                setForm({
                    title: product.title || '',
                    sku: product.sku || '',
                    description: product.description || '',
                    price: product.price || '',
                    stock_quantity: product.stock_quantity || '',
                    categories: product.categories?.map(cat => cat.id) || [],
                    image: null,
                })

                setAllCategories(categoriesRes.data)

                if (product.image_url) {
                    setPreviewUrl(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image_url.replace(/^\/+/, '')}`
                    )
                }
            } catch (err) {
                console.error('Failed loading product:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [slug])

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    const handleChange = (e) => {
        const { name, value } = e.target

        setForm(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleCategoryToggle = (id) => {
        setForm(prev => ({
            ...prev,
            categories: prev.categories.includes(id)
                ? prev.categories.filter(cat => cat !== id)
                : [...prev.categories, id],
        }))
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]

        if (!file) return

        setForm(prev => ({
            ...prev,
            image: file,
        }))

        const imagePreview = URL.createObjectURL(file)
        setPreviewUrl(imagePreview)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!productId) return

        try {
            const formData = new FormData()

            formData.append('title', form.title)
            formData.append('sku', form.sku)
            formData.append('description', form.description)
            formData.append('price', form.price)
            formData.append('stock_quantity', form.stock_quantity)

            form.categories.forEach(catId => {
                formData.append('category_ids', catId)
            })

            if (form.image) {
                formData.append('image', form.image)
            }

            await api.patch(
                `/api/v1/product/${productId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            )

            router.push('/user/product')
        } catch (err) {
            console.error('Update failed:', err)
            alert('Failed to update product')
        }
    }

    if (loading) {
        return (
            <AdminOnly>
                <div className="flex justify-center items-center min-h-[400px]">
                    <p className="text-lg text-gray-500">
                        Loading product...
                    </p>
                </div>
            </AdminOnly>
        )
    }

    return (
        <AdminOnly>
            <div className="max-w-4xl mx-auto bg-white border shadow-lg rounded-xl p-8 mt-8">
                <h1 className="text-3xl font-bold mb-8">
                    ✏️ Edit Product
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block mb-2 font-medium">
                            Product Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            SKU
                        </label>

                        <input
                            type="text"
                            name="sku"
                            value={form.sku}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Description
                        </label>

                        <textarea
                            name="description"
                            rows={4}
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3"
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 font-medium">
                                Price
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                                required
                            />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">
                                Stock Quantity
                            </label>

                            <input
                                type="number"
                                name="stock_quantity"
                                value={form.stock_quantity}
                                onChange={handleChange}
                                className="w-full border rounded-lg p-3"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block mb-3 font-medium">
                            Categories
                        </label>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {allCategories.map(cat => (
                                <label
                                    key={cat.id}
                                    className="flex items-center gap-2 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.categories.includes(cat.id)}
                                        onChange={() =>
                                            handleCategoryToggle(cat.id)
                                        }
                                    />
                                    {cat.name}
                                </label>
                            ))}
                        </div>
                    </div>
                    {/* Image Section */}
                    <div>
                        <label className="block mb-2 font-medium text-gray-700">
                            Product Image
                        </label>

                        <div className="flex items-center gap-4">
                            {previewUrl && (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-28 h-28 object-cover rounded-md border shadow-sm"
                                />
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="text-sm border rounded p-2 flex-1"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
                    >
                        Update Product
                    </button>
                </form>
            </div>
        </AdminOnly>
    )
}