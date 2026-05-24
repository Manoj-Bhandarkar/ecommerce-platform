'use client'

import Link from 'next/link'

const ProductCard = ({product}) => {
  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
      <Link href={`/product/${product.slug}`}>
        <img
          className="w-full h-48 object-cover rounded"
          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image_url.replace(/^\/+/, '')}`}
          alt={product.title}
        />
        <p className="font-bold text-lg font-semibold mt-2 line-clamp-2 min-h-[3.5rem]">{product.title}</p>
        <p className="font-bold text-gray-600 mt-1">₹ {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </Link>
    </div>
  )
}

export default ProductCard
