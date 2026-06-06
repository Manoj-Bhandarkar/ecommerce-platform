'use client';

import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const categories = [
  {
    name: 'Fashion',
    icon: '👕',
    description: 'Trendy styles & apparel',
    slug: 'clothings',
  },
  {
    name: 'Electronics',
    icon: '💻',
    description: 'Latest gadgets & devices',
    slug: 'electronics',
  },
  {
    name: 'Footwear',
    icon: '👟',
    description: 'Comfort meets style',
    slug: 'footwear',
  },
  {
    name: 'Accessories',
    icon: '⌚',
    description: 'Complete your look',
    slug: 'accessories',
  },
];

export default function FeaturedCategories() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from('.category-header', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 90%',
      },
    });

    gsap.from('.category-card-animator', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.categories-grid',
        start: 'top 90%',
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 overflow-hidden"
    >
      {/* Header */}
      <div className="category-header text-center mb-10 lg:mb-14">

        <span className="inline-flex text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 select-none">
          Categories
        </span>

        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white mt-5 tracking-tight">
          Shop By Category
        </h2>

        <p className="text-slate-400 mt-4 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Explore our carefully selected collections designed to match
          your lifestyle and needs.
        </p>

      </div>

      {/* Categories Grid */}
      <div
        className="categories-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
      >
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/product?category=${category.slug}`}
            className="category-card-animator group"
          >
            <div
              className="bg-[#111625] rounded-2xl p-5 sm:p-6 lg:p-8 border border-white/[0.04] shadow-lg h-full min-h-[220px] flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/20 hover:shadow-emerald-500/10"
            >
              <div
                className="text-5xl lg:text-6xl mb-5 select-none transition-transform duration-300 group-hover:scale-110"
              >
                {category.icon}
              </div>

              <h3
                className="text-lg sm:text-xl font-black text-slate-200 tracking-tight transition-colors duration-300 group-hover:text-emerald-400"
              >
                {category.name}
              </h3>

              <p
                className="mt-3 text-sm text-slate-400 leading-relaxed"
              >
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}