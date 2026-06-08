'use client';

import { useState, useEffect, useRef, Suspense } from "react";
import axios from "axios";
import ProductCard from "@/components/ProductCard";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useSearchParams } from "next/navigation";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const pageContainerRef = useRef(null);
  const limit = 20; // 20 is perfectly divisible by 1, 2, and 4 columns for balanced rows

  // High-Performance Search Debouncing Engine
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1); // Reset back to page 1 on fresh filter entry
    }, 400); // 400ms delay protects your backend API limits

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  // Unified Request Fetch Loop Handler
  useEffect(() => {
    // Guard: Avoid double triggers if state variables are still undefined or null on mount
    if (category === undefined) return;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) {
          params.append("category", category);
        }
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (debouncedSearch && debouncedSearch.trim() !== "") {
          params.append("title", debouncedSearch.trim());
        }


        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/search/?${params.toString()}`
        );

        setProducts(res.data?.items || []);
        setTotalPages(Math.ceil((res.data?.total || 0) / limit) || 1);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, page, limit, debouncedSearch]);

  // Smooth Stagger Reveal Animations for fresh product drops
  useGSAP(() => {
    if (loading || products.length === 0) return;

    gsap.fromTo('.catalog-product-wrapper',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: "power2.out"
      }
    );
  }, { scope: pageContainerRef, dependencies: [loading, products] });

  return (
    <div
      ref={pageContainerRef}
      className="bg-[#0B0F19] min-h-screen text-white px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 space-y-8"
    >
      {/* Structural Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-b border-white/[0.04] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            {category
              ? `🛍️ ${category.charAt(0).toUpperCase() + category.slice(1)}`
              : "🛍️ All Products"}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-light">
            Browse through our curated collection of luxury fashion and premium gadgets.
          </p>
        </div>

        <div className="w-full lg:max-w-md relative">
          <input
            type="text"
            placeholder="Search our collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-5 py-3 bg-[#111625] text-slate-100 placeholder-slate-500 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner"
          />

          <span className="absolute right-4 top-3.5 opacity-40 text-sm select-none pointer-events-none">
            🔍
          </span>
        </div>
      </div>

      {/* Main Structural Yield Grid Section */}
      {loading ? (
        <ProductPageSkeletonGrid />
      ) : products.length === 0 ? (
        <div className="text-center py-12 sm:py-24 text-slate-500 bg-[#111625]/20 rounded-3xl border border-white/[0.04] border-dashed max-w-2xl mx-auto space-y-2">
          <p className="text-lg font-bold text-slate-400">
            No Premium Products Found
          </p>

          <p className="text-sm font-light text-slate-500">
            Try adjusting your keywords or browse another category drop.
          </p>
        </div>
      ) : (
        <>
          {/* Synchronized Catalog Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {products.map((product) => (
              <div
                key={product.id || product._id}
                className="catalog-product-wrapper opacity-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Premium Glassmorph Pagination Control Footer */}
          <div className="flex flex-wrap justify-center items-center pt-10 gap-2 sm:gap-3 select-none">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 sm:px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-black bg-white/[0.02] border border-white/[0.04] text-slate-300 hover:bg-emerald-500 hover:text-slate-950 hover:border-transparent disabled:opacity-30 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="px-3 sm:px-5 py-2.5 rounded-xl text-xs font-bold tracking-wide bg-[#111625] border border-white/[0.04] text-slate-400 text-center">
              {page} / {totalPages}
            </span>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 sm:px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-black bg-white/[0.02] border border-white/[0.04] text-slate-300 hover:bg-emerald-500 hover:text-slate-950 hover:border-transparent disabled:opacity-30 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Catalog Page Internal Shimmer Layout Loader
const ProductPageSkeletonGrid = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="bg-[#111625] p-5 rounded-2xl border border-white/[0.04] space-y-5 animate-pulse">
        <div className="bg-slate-950/40 h-48 w-full rounded-xl" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 rounded w-1/4" />
          <div className="h-4 bg-slate-800 rounded w-5/6" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="h-8 bg-slate-800 rounded w-2/5" />
        </div>
      </div>
    ))}
  </div>
);
export default function ProductCatalog() {
  return (
    <Suspense fallback={<ProductPageSkeletonGrid />}>
      <ProductPage />
    </Suspense>
  );
}
