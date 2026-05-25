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
  }, [page, searchTerm])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        🛍️ All Products
      </h1>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Search by product title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border rounded"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Search
        </button>
      </form>

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-8 gap-4">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-4 py-2 border rounded bg-gray-100">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProductPage