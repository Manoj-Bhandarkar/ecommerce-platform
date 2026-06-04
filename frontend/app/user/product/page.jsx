'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/utils/axios';
import Link from 'next/link';
import Image from 'next/image';
import AdminOnly from '@/components/AdminOnly';
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Internal Shimmer Loader layout component declared safely inside the single-file scope
const AdminProductPageLoader = () => (
    <div className="space-y-4 w-full">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-[#111625] p-5 rounded-2xl border border-white/[0.04] flex gap-5 animate-pulse">
                <div className="bg-slate-950/40 w-24 h-24 rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-3 bg-slate-800 rounded w-2/3" />
                    <div className="h-3 bg-slate-800 rounded w-1/4" />
                </div>
            </div>
        ))}
    </div>
);

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    const containerRef = useRef(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/v1/product?limit=${limit}&page=${page}`);
            setProducts(res.data?.items || []);
            setTotalPages(Math.ceil((res.data?.total || 0) / (res.data?.limit || limit)) || 1);
        } catch (err) {
            console.error('Failed to fetch products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [page]);

    // Premium GSAP Stagger Reveal Entry Engine
    useGSAP(() => {
        if (loading || products.length === 0) return;

        gsap.fromTo('.admin-product-row',
            { opacity: 0, y: 20 },
            {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.06,
                ease: "power2.out"
            }
        );
    }, { scope: containerRef, dependencies: [loading, products] });

    const handleDelete = async (id) => {
        if (!confirm('Are you absolutely certain you want to purge this product asset from the database?')) return;
        try {
            await api.delete(`/api/v1/product/${id}`);
            if (page === 1) {
                fetchProducts();
            } else {
                setPage(1);
            }
        } catch (err) {
            console.error('Failed to delete product:', err);
        }
    };

    const formatImage = (url) => url?.replace(/\\/g, '/');

    return (
        <AdminOnly>
            <div ref={containerRef} className="bg-[#0B0F19] min-h-screen text-white px-4 py-6 sm:px-6 md:px-8 lg:px-12 xl:px-12 xl:px-16 relative overflow-hidden">
                {/* Dynamic Background Blur Mesh Layer */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none" />

                <div className="container mx-auto max-w-7xl space-y-6 relative z-10">

                    {/* Header Row Bar Block */}
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/[0.04] pb-6">
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
                                📦 Inventory Products
                            </h1>
                            <p className="text-xs text-slate-400 font-light mt-0.5">
                                Current Batch Slots Loaded: <span className="text-emerald-400 font-mono font-bold">{products.length} units</span>
                            </p>
                        </div>
                        <Link
                            href="/user/product/create"
                            className="sm:self-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-lg shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-center"
                        >
                            + Add Product
                        </Link>
                    </div>

                    {/* Core Conditional Rendering Engine */}
                    {loading ? (
                        <AdminProductPageLoader />
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 bg-[#111625]/20 rounded-3xl border border-white/[0.04] border-dashed max-w-xl mx-auto space-y-2">
                            <p className="text-base font-bold text-slate-400">No Products Cataloged</p>
                            <p className="text-xs font-light text-slate-500">Deploy fresh visual merchandise listings using the addition panels.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {products.map((product) => {
                                const isLowStock = product.stock_quantity <= 5;
                                const productImgUrl = product.image_url
                                    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/${formatImage(product.image_url)}`
                                    : '/placeholder.png';

                                return (
                                    <div
                                        key={product.id}
                                        className="admin-product-row bg-[#111625] border border-white/[0.04] p-4 sm:p-5 lg:p-6 rounded-2xl flex flex-col md:flex-row gap-4lg:gap-6 hover:border-white/[0.1] hover:shadow-xl shadow-black/10 transition-all duration-300 opacity-0"
                                    >
                                        {/* Media Display Asset Block */}
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 relative bg-slate-950/40 rounded-xl p-2 border border-white/[0.02] flex items-center justify-center flex-shrink-0 self-center sm:self-start">
                                            <Image
                                                src={productImgUrl}
                                                alt={product.title || "Product Thumbnail"}
                                                fill
                                                sizes="96px"
                                                className="object-contain p-2 select-none"
                                                unoptimized
                                            />
                                        </div>

                                        {/* Metadata Content Descriptions Frame */}
                                        <div className="flex-1 space-y-2 text-center md:text-left min-w-0">
                                            <div className="space-y-0.5">
                                                <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-200 tracking-tight line-clamp-2">{product.title}</h2>
                                                <p className="text-xs font-mono text-slate-500 font-semibold">
                                                    SKU Identifier: <span className="text-slate-400">{product.sku || "N/A"}</span>
                                                </p>
                                            </div>
                                            <p className="text-xs sm:text-sm text-slate-400 font-light line-clamp-3 max-w-2xl leading-relaxed">{product.description}</p>

                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 pt-2 text-sm font-medium">
                                                <span className="font-mono font-black text-slate-200">₹{Number(product.price).toLocaleString('en-IN')}</span>
                                                <span className="text-slate-700 font-light">|</span>
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-md text-[9px] uppercase tracking-widest font-black border select-none ${isLowStock
                                                        ? "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse"
                                                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                        }`}
                                                >
                                                    Stock: {product.stock_quantity} {isLowStock && "⚠️"}
                                                </span>
                                            </div>

                                            {/* Category Pills Map row */}
                                            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                                                {product.categories?.map((cat) => (
                                                    <span
                                                        key={cat.id}
                                                        className="text-[9px] uppercase tracking-wider font-bold bg-white/[0.02] border border-white/[0.04] text-slate-400 px-2 py-0.5 rounded-md"
                                                    >
                                                        {cat.name}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Modification Action Clusters Column */}
                                        <div className="flex flex-col sm:flex-row sm:flex-col items-center justify-center gap-2 border-t sm:border-t-0 border-white/[0.02] pt-4 md:pt-0 shrink-0 w-full md:w-auto md:min-w-[120px]">
                                            <Link
                                                href={`/user/product/edit/${product.slug}`}
                                                className="w-full md:w-24 px-4 py-2.5 text-center rounded-xl text-xs font-black uppercase tracking-wider bg-white/[0.02] border border-white/[0.04] text-slate-300 hover:bg-white/[0.08] hover:text-white transition-all duration-200 cursor-pointer"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="w-full md:w-24 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:border-transparent transition-all duration-200 cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Premium Glassmorph Pagination Control Footers */}
                    {products.length > 0 && (
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-white/[0.04] select-none">
                            <button
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                disabled={page === 1 || loading}
                                className="px-4 py-2 rounded-xl uppercase tracking-wider font-black bg-white/[0.02] border border-white/[0.04] text-slate-300 hover:bg-emerald-500 hover:text-slate-950 hover:border-transparent disabled:opacity-20 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed">
                                ⬅ Prev
                            </button>
                            <p className="text-slate-400 text-sm font-medium">
                                Page {page} of {totalPages}
                            </p>
                            <button onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={page === totalPages || loading} className="px-4 py-2 rounded-xl uppercase tracking-wider font-black bg-white/[0.02] border border-white/[0.04] text-slate-300 hover:bg-emerald-500 hover:text-slate-950 hover:border-transparent disabled:opacity-20 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed">
                                Next ➡
                            </button>
                        </div>

                    )}
                </div>
            </div>

        </AdminOnly>

    )
}
