'use client'

import { useEffect, useState } from 'react'
import api from '@/utils/axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const CartPage = () => {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updatingItemId, setUpdatingItemId] = useState(null)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const fetchCart = async () => {
    try {
      const res = await api.get('/api/v1/cart')
      setCart(res.data)
    } catch (err) {
      console.error('Failed to fetch cart:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login')
      } else {
        fetchCart()
      }
    }
  }, [authLoading, user])

  const updateCart = async (method, url, itemId) => {
    setUpdatingItemId(itemId) // temporary id marker
    try {
      // if (method === 'patch') await api.patch(url)
      await api[method](url)
      fetchCart()
    } catch (err) {
      console.error('Cart update failed:', err)
    } finally {
      setUpdatingItemId(null)
    }
  }

  if (loading || authLoading) {
    return <div className="text-center py-8 text-gray-600">Loading...</div>
  }

  if (!cart || cart.items.length === 0) {
    return <div className="text-center py-8 text-gray-600">🛒 Your cart is empty</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">🛒 Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map(item => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 p-4 flex gap-4"
            >
              {/* Product Image */}
              <div className="w-28 flex-shrink-0">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.product_image}`}
                  alt={item.product_title}
                  className="w-28 h-28 object-contain"
                />

                {/* Quantity Controls */}
                <div className="flex items-center justify-center gap-2 mt-3">
                  <button
                    onClick={() =>
                      updateCart(
                        "patch",
                        `/api/v1/cart/decrease/${item.product_id}`,
                        item.id
                      )
                    }
                    className="w-8 h-8 border rounded-full"
                  >
                    -
                  </button>

                  <span className="w-10 text-center">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateCart(
                        "patch",
                        `/api/v1/cart/increase/${item.product_id}`,
                        item.id
                      )
                    }
                    className="w-8 h-8 border rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div className="flex-1">
                <h2 className="font-medium text-gray-900">
                  {item.product_title}
                </h2>

                <div className="mt-3">
                  <span className="text-xl font-semibold">
                    ₹{item.price}
                  </span>
                </div>

                <div className="flex gap-6 mt-4">
                  <button
                    className="font-medium hover:text-blue-600"
                  >
                    SAVE FOR LATER
                  </button>

                  <button
                    onClick={() =>
                      updateCart(
                        "delete",
                        `/api/v1/cart/delete/${item.id}`,
                        item.id
                      )
                    }
                    className="font-medium hover:text-red-600"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-4">
            <div className="p-4 border-b text-gray-500 uppercase text-sm font-medium">
              Price Details
            </div>

            <div className="p-4 space-y-4">
              <div className="flex justify-between">
                <span>
                  Price ({cart.total_quantity} items)
                </span>
                <span>
                  ₹{cart.total_price}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="text-green-600">
                  FREE
                </span>
              </div>

              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total Amount</span>
                <span>
                  ₹{cart.total_price}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gray-50">
              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-[#fb641b] hover:bg-[#f95302] text-white py-3 font-medium"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
