"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ProductCard from "@/components/ProductCard"

const ProductPage = () => {
    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)

    const limit = 5

    const fetchProducts = async () => {
        setLoading(true)

        try {
            const params = new URLSearchParams()

            params.append("page", page)
            params.append("limit", limit)

            if (searchTerm.trim() !== "") {
                params.append("title", searchTerm)
            }

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/search/?${params.toString()}`
            )

            setProducts(res.data.items)
            setTotalPages(Math.ceil(res.data.total / limit))

        } catch (err) {
            console.error("Error fetching products:", err)

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [page])

    const handleSearch = (e) => {
        e.preventDefault()
        setPage(1)
        fetchProducts()
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">
                    🛍️ Products
                </h1>

                <p className="text-gray-500">
                    {products.length} products found
                </p>
            </div>

            {/* Filters */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
                <form
                    onSubmit={handleSearch}
                    className="flex flex-col md:flex-row gap-3"
                >
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 border rounded-lg px-4 py-2"
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
                    >
                        Search
                    </button>
                </form>
            </div>

            {/* Loading */}
            {loading ? (
                <p className="text-center">
                    Loading products...
                </p>

            ) : products.length === 0 ? (

                <p className="text-center">
                    No products found.
                </p>

            ) : (
                <>
                    {/* Products */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center gap-3 mt-10">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            ← Previous
                        </button>

                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setPage(index + 1)}
                                className={`px-4 py-2 rounded-lg ${page === index + 1
                                        ? "bg-blue-600 text-white"
                                        : "border"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page === totalPages}
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            Next →
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}

export default ProductPage