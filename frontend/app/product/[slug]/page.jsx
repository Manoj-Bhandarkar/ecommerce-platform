'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import api from "@/utils/axios";

const ProductDetailPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/${slug}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push(`/login?redirect=/product/${product.slug}`);
      return;
    }

    setAdding(true);
    try {
      await api.post("/api/v1/cart/add", {
        product_id: product.id,
        quantity: 1,
      });
      router.push("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <ProductDetailSkeleton />;
  if (!product) {
    return (
      <div className="bg-[#0B0F19] min-h-screen text-white flex flex-col items-center justify-center p-6 space-y-4">
        <p className="text-xl font-bold text-slate-400">Premium Product Not Found</p>
        <Link href="/product" className="text-sm font-black text-emerald-400 hover:underline">← Back to Catalog</Link>
      </div>
    );
  }

  const imageUrl = product.image_url?.startsWith("http")
    ? product.image_url
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image_url}`;

  return (
    <div className="bg-[#0B0F19] min-h-screen text-white pb-32 relative">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* LEFT SIDE: Product Gallery & Description Sheet */}
        <div className="space-y-12 w-full">
          {/* Product Image Display Frame */}
          <div className="relative w-full h-[380px] sm:h-[460px] md:h-[500px] bg-slate-950/40 rounded-3xl border border-white/[0.04] p-8 flex items-center justify-center shadow-2xl">
            <Image
              src={imageUrl}
              alt={product.title || "Product Showcase Image"}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-contain p-8 select-none"
              priority
              unoptimized
            />
          </div>

          {/* Detailed Specifications Block */}
          <div className="space-y-6 pt-4 bg-[#111625]/30 p-8 rounded-3xl border border-white/[0.02]">
            <h3 className="text-lg font-black uppercase tracking-wider text-slate-200 border-b border-white/[0.04] pb-3">
              Product Specifications
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line">
              {product.description || "No supplemental description has been cataloged for this item yet."}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: Standard Buy Box Dashboard Panel */}
        <div className="w-full">
          <div className="w-full bg-[#111625] rounded-3xl border border-white/[0.04] p-8 lg:p-10 shadow-2xl space-y-6">
            
            {/* Category Badging */}
            <div className="flex flex-wrap gap-2">
              {product.categories?.map((cat) => (
                <span
                  key={cat.id}
                  className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] uppercase font-black tracking-widest select-none"
                >
                  {cat.name}
                </span>
              )) || (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] uppercase font-black tracking-widest select-none">
                  Premium Category
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight pt-2">
              {product.title}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base font-light tracking-wide">
              {product.description || "Exclusive drop available for a limited time."}
            </p>

            {/* Trust Metrics */}
            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-sm">★★★★★</span>
                <span className="text-slate-400 font-bold ml-1">(4.9) Verified Review</span>
              </div>
              <span>•</span>
              <div>
                In Stock: <span className="text-emerald-400 font-bold">{product.stock_quantity ?? 0} units</span>
              </div>
            </div>

            <div className="h-[1px] bg-white/[0.04] w-full pt-2" />

            {/* Price Block */}
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Price</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-white tracking-tight">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-500 line-through font-medium">
                  ₹{Math.round(product.price * 1.25).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Add To Cart CTA Button */}
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock_quantity <= 0}
              className="
                w-full
                bg-gradient-to-r
                from-emerald-500
                to-teal-500
                hover:from-emerald-400
                hover:to-teal-400
                text-slate-950
                py-4
                rounded-xl
                font-black
                text-xs
                uppercase
                tracking-wider
                text-center
                transition-all
                duration-300
                shadow-xl
                shadow-emerald-500/10
                hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-20
                disabled:cursor-not-allowed
                disabled:hover:scale-100
                cursor-pointer
                block
              "
            >
              {adding ? "Securing Allocation..." : product.stock_quantity > 0 ? "Add To Cart Drop" : "Allocation Depleted"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

// Shimmer Loaders
const ProductDetailSkeleton = () => (
  <div className="bg-[#0B0F19] min-h-screen text-white py-12 animate-pulse">
    <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
      <div className="bg-slate-950/40 h-[480px] rounded-3xl border border-white/[0.04]" />
      <div className="bg-[#111625] h-[380px] rounded-3xl border border-white/[0.04] p-10 space-y-6">
        <div className="h-4 bg-slate-800 rounded w-1/4" />
        <div className="h-8 bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-800 rounded w-1/2" />
        <div className="h-[1px] bg-white/[0.04]" />
        <div className="h-8 bg-slate-800 rounded w-1/3" />
        <div className="h-12 bg-slate-800 rounded w-full pt-4" />
      </div>
    </div>
  </div>
);

export default ProductDetailPage;
