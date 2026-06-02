'use client'

import { useEffect, useState } from 'react'
import api from '@/utils/axios'
import AdminOnly from '@/components/AdminOnly'
import { useRouter } from 'next/navigation'

const CategoryPage = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const router = useRouter()

    const fetchCategories = async () => {
        try {
            const res = await api.get('/api/v1/categories/')
            setCategories(res.data)
        } catch (err) {
            console.error('Failed to fetch categories:', err)
            alert('Failed to fetch categories')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this category?')) return
        try {
            await api.delete(`/api/v1/categories/${id}`)
            setCategories(categories.filter(cat => cat.id !== id))
        } catch (err) {
            console.error('Failed to delete category:', err)
            alert('Failed to delete category')
        }
    }
    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase())
    )
    useEffect(() => {
        fetchCategories()
    }, [])

    if (loading) return <p className="p-4 text-center">Loading categories...</p>

    return (
        <AdminOnly>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">
                            📂 Categories
                        </h1>

                        <p className="text-gray-500 text-sm">
                            Total Categories: {categories.length}
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/user/category/create')}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        ➕ Add Category
                    </button>
                </div>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                    />
                </div>

                {categories.length === 0 ? (
                    <p>No categories found.</p>
                ) : (
                    <div className="bg-white rounded-lg shadow border overflow-hidden">
                        <div className="px-6 py-4 border-b">
                            <h2 className="text-lg font-semibold uppercase tracking-wide text-gray-700">
                                Categories
                            </h2>
                        </div>

                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600 uppercase">
                                        Category
                                    </th>

                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase">
                                        Category Wise Products
                                    </th>

                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredCategories.map((cat) => (
                                    <tr
                                        key={cat.id}
                                        className="border-t hover:bg-gray-50 transition"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {cat.name}
                                                </p>

                                                <p className="text-sm text-gray-500">
                                                    Category ID #{cat.id}
                                                </p>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-center font-medium">
                                            {cat.products_count ?? 0}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminOnly>
    )
}

export default CategoryPage
