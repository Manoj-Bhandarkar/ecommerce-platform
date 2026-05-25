'use client'
import React from 'react'
import { useState, useEffect } from "react"
import axios from 'axios'
import { useParams } from 'next/navigation'

const ProductDetailPage = () => {
    const { slug } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/${slug}`
                )
                setProduct(res.data)
            } catch (err) {
                console.error("Error fetching product:", err)
            } finally {
                setLoading(false)
            }
        }
        if (slug) {
            fetchProduct()
        }
    }, [slug])

    if (loading) {
        return <div className="p-6 text-center">Loading...</div>
    }
    if (!product) {
        return <div className="p-6 text-center">Product not found.</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
            <div className='grid md:grid-cols-2 gap-6'>
                <img
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image_url.replace(/\\/g, "/")}`}
                    alt="Product Image"
                    className="w-full h-auto rounded-lg"
                />
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.title} - {product.sku}</h1>
                    <p className="text-gray-700 mb-4">
                        {product.description || "No description available."}
                    </p>
                    <p className="text-2xl font-semibold mb-4">₹{Number(product.price).toLocaleString()}</p>
                    <p className="text-gray-600 mb-4">In stock: {product.stock_quantity || 0}</p>
                    {/* category */}
                    <div className='flex gap-2 mb-4'>
                        {product.categories?.map((cat) => (
                            <span key={cat.id} className="px-2 py-1 bg-gray-200 text-gray-800 rounded">
                                {cat.name}
                            </span>
                        ))}

                    </div>

                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage