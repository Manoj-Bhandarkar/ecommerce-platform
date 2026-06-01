'use client'

import Link from 'next/link'

const ProductCard = ({ product }) => {

  const imageUrl = product.image_url
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image_url.replace(/^\/+/, '')}`
    : "/placeholder.png"

  return (
    <div className="bg-white rounded-xl shadow p-4 transition duration-300 hover:shadow-xl hover:-translate-y-1">

      <Link href={`/product/${product.slug}`}>

        <img
          className="w-full h-56   object-contain bg-gray-100 rounded-lg p-2"
          src={imageUrl}
          alt={product.title}
          onError={(e) => {
            e.target.src = "/placeholder.png"
          }}
        />

        <h2 className="text-lg font-semibold mt-3 line-clamp-2 min-h-[3.5rem]">
          {product.title}
        </h2>

        <p className="text-gray-600 mt-2 font-medium">
          ₹ {Number(product.price).toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </p>

      </Link>
    </div>
  )
}

export default ProductCard