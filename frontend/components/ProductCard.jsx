'use client'

import Link from 'next/link'

const ProductCard = () => {
  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
      <Link href="/product/sample-slug">
        <img
          className="w-full h-48 object-cover rounded"
          src="placeholder.png"
          alt="Sample Product"
        />
        <h2 className="text-lg font-semibold mt-2">Sample Product</h2>
        <p className="text-gray-600">₹ 1,999</p>
      </Link>
    </div>
  )
}

export default ProductCard
