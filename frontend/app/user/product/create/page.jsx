'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/axios'
import AdminOnly from '@/components/AdminOnly'

const ProductCreatePage = () => {
  const router = useRouter()
  const [preview, setPreview] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    sku: '',
    price: '',
    stock_quantity: '',
    category_ids: [],
    image: null,
  })

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/v1/categories')
        setCategories(res.data)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target

    if (type === 'file') {
      const file = files?.[0]

      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      if (file) {
        setPreview(URL.createObjectURL(file))
      }

      return
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = new FormData()
      payload.append('title', formData.title)
      payload.append('description', formData.description)
      payload.append('sku', formData.sku)
      payload.append('price', formData.price)
      payload.append('stock_quantity', formData.stock_quantity)
      formData.category_ids.forEach((id) => payload.append('category_ids', id))
      if (formData.image) payload.append('image', formData.image)

      await api.post('/api/v1/product/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      router.push('/user/product')
    } catch (err) {
      console.error('Failed to create product:', err)
      setError('Failed to create product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminOnly>
      <div className="p-6 bg-white rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">➕ Add New Product</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border p-0 rounded"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            min={0}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="stock_quantity"
            placeholder="Stock Quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
            min={0}
            className="w-full border p-2 rounded"
          />

          <div>
            <label className="block text-sm font-medium mb-3">
              Categories
            </label>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((cat) => (
                <label
                  key={cat.id}
                  className={`flex items-center gap-2 border rounded-lg p-3 cursor-pointer transition
        ${formData.category_ids.includes(cat.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.category_ids.includes(cat.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData((prev) => ({
                          ...prev,
                          category_ids: [...prev.category_ids, cat.id],
                        }))
                      } else {
                        setFormData((prev) => ({
                          ...prev,
                          category_ids: prev.category_ids.filter(
                            (id) => id !== cat.id
                          ),
                        }))
                      }
                    }}
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700">
              Product Image
            </label>

            <div className="flex items-center gap-4">
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-28 h-28 object-cover rounded-md border shadow-sm"
                />
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="text-sm border rounded p-2 flex-1"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </AdminOnly>
  )
}

export default ProductCreatePage
