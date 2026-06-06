'use client';

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import gsap from "@/lib/gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from "@gsap/react";
import PremiumHero from "@/components/PremiumHero";
import FeaturedCategories from "@/components/FeaturedCategories";
import ProductCard from "@/components/ProductCard";
import BottleShowcase from "@/components/BottleShowcase";
gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [clothings, setClothings] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [footwear, setFootwear] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);

  useEffect(() => {
    const fetchProductByCategories = async () => {
      try {
        const [clothingsRes, electronicsRes, footwearRes, accessoriesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/search/?categories=clothings&limit=4`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/search/?categories=electronics&limit=4`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/search/?categories=footwear&limit=4`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/product/search/?categories=accessories&limit=4`)
        ]);
        setClothings(clothingsRes.data?.items || []);
        setElectronics(electronicsRes.data?.items || []);
        setFootwear(footwearRes.data?.items || []);
        setAccessories(accessoriesRes.data?.items || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 300);
      }
    };
    fetchProductByCategories();
  }, []);

  // GSAP ScrollTrigger Section Reveals
  useGSAP(() => {
    if (loading) return;

    const sections = gsap.utils.toArray('.scroll-reveal-section');

    sections.forEach((section) => {
      // Animate Section Headers smoothly
      gsap.fromTo(section.querySelector('.section-header'),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );

      // Stagger individual card grid items as they pass the viewport
      gsap.fromTo(section.querySelectorAll('.product-wrapper'),
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section.querySelector('.products-grid'),
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });
  }, { scope: containerRef, dependencies: [loading] });

  return (
    <BottleShowcase>
      <div ref={containerRef} className="bg-[#0B0F19] min-h-screen text-white pb-24 space-y-24">
        {/* Premium Hero Stage Component */}
        <PremiumHero />

        {/* Featured Categories Carousel Grid */}
        <FeaturedCategories />

        {/* Trending Fashion Section */}
        <section className="scroll-reveal-section container mx-auto px-4 space-y-8">
          <div className="section-header flex justify-between items-end border-b border-white/[0.04] pb-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                🔥 Trending Fashion
              </h2>
              <p className="text-slate-400 text-xs lg:text-sm mt-1">
                Discover our most popular fashion picks.
              </p>
            </div>
            <Link href="product?category=clothings" className="text-xs lg:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors duration-200 uppercase tracking-wider">
              View All →
            </Link>
          </div>

          {loading ? (
            <ProductSkeletonGrid />
          ) : clothings.length === 0 ? (
            <div className="text-center py-16 text-slate-500 bg-[#111625]/40 rounded-2xl border border-white/[0.04] border-dashed">
              No clothing products found.
            </div>
          ) : (
            <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {clothings.map((product) => (
                <div key={product.id || product._id} className="product-wrapper">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Best Electronics Section */}
        <section className="scroll-reveal-section container mx-auto px-4 space-y-8">
          <div className="section-header flex justify-between items-end border-b border-white/[0.04] pb-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                ⚡ Best Electronics
              </h2>
              <p className="text-slate-400 text-xs lg:text-sm mt-1">
                Top-rated gadgets and smart devices.
              </p>
            </div>
            <Link href="product?category=electronics" className="text-xs lg:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors duration-200 uppercase tracking-wider">
              View All →
            </Link>
          </div>

          {loading ? (
            <ProductSkeletonGrid />
          ) : electronics.length === 0 ? (
            <div className="text-center py-16 text-slate-500 bg-[#111625]/40 rounded-2xl border border-white/[0.04] border-dashed">
              No electronics products found.
            </div>
          ) : (
            <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {electronics.map((product) => (
                <div key={product.id || product._id} className="product-wrapper">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="scroll-reveal-section container mx-auto px-4 space-y-8">
          <div className="section-header flex justify-between items-end border-b border-white/[0.04] pb-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                👟 Trending Footwear
              </h2>
              <p className="text-slate-400 text-xs lg:text-sm mt-1">
                Best shoes and footwear collection.
              </p>
            </div>

            <Link
              href="product?category=footwear"
              className="text-xs lg:text-sm font-bold text-emerald-400 hover:text-emerald-300"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <ProductSkeletonGrid />
          ) : footwear.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No footwear products found.
            </div>
          ) : (
            <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {footwear.map((product) => (
                <div key={product.id || product._id} className="product-wrapper">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
        <section className="scroll-reveal-section container mx-auto px-4 space-y-8">
          <div className="section-header flex justify-between items-end border-b border-white/[0.04] pb-4">
            <div>
              <h2 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
                👜 Accessories
              </h2>
              <p className="text-slate-400 text-xs lg:text-sm mt-1">
                Watches, bags and premium accessories.
              </p>
            </div>

            <Link
              href="product?category=accessories"
              className="text-xs lg:text-sm font-bold text-emerald-400 hover:text-emerald-300"
            >
              View All →
            </Link>
          </div>

          {loading ? (
            <ProductSkeletonGrid />
          ) : accessories.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              No accessories products found.
            </div>
          ) : (
            <div className="products-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {accessories.map((product) => (
                <div key={product.id || product._id} className="product-wrapper">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </BottleShowcase>
  );
}

// Premium Shimmer Skeleton Grid Loader
const ProductSkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-[#111625] p-5 rounded-2xl border border-white/[0.04] space-y-5 animate-pulse">
        <div className="bg-slate-950/40 h-48 w-full rounded-xl" />
        <div className="space-y-2">
          <div className="h-3 bg-slate-800 rounded w-1/3" />
          <div className="h-4 bg-slate-800 rounded w-5/6" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-slate-800 rounded w-1/4" />
          <div className="h-8 bg-slate-800 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);
