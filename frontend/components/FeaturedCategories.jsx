'use client';

import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// CRITICAL FIX: Always register the plugin on the client side file safely
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
    slug: 'clothings',
  },
  {
    name: 'Accessories',
    icon: '⌚',
    description: 'Complete your look',
    slug: 'clothings',
  },
];

const FeaturedCategories = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    // Elegant fade-up animation for the header section
    gsap.from('.category-header', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });

    // Target the card class correctly with safe viewport fallbacks
    gsap.from('.category-card-animator', {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.categories-grid',
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="container mx-auto px-4 py-16 min-h-[400px] clear-both overflow-hidden"
    >
      {/* Header Container Wrapper */}
      <div className="category-header text-center mb-12">
        <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 select-none">
          Categories
        </span>

        <h2 className="text-3xl lg:text-4xl font-black text-white mt-4 tracking-tight">
          Shop By Category
        </h2>

        <p className="text-slate-400 mt-3 text-sm lg:text-base max-w-xl mx-auto leading-relaxed">
          Explore our carefully selected collections designed to match your lifestyle and needs.
        </p>
      </div>

      {/* Grid Container */}
      <div className="categories-grid grid grid-cols-2 lg:grid-cols-4 gap-6 w-full min-h-[200px]">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/product?category=${category.slug}`}
            className="category-card-animator block group"
          >
            <div
              className="
                bg-[#111625]
                rounded-2xl
                p-6
                lg:p-8
                text-center
                shadow-lg
                border
                border-white/[0.04]
                group-hover:border-white/[0.1]
                group-hover:shadow-emerald-500/5
                group-hover:-translate-y-2
                transition-all
                duration-300
                h-full
              "
            >
              {/* Animated Floating Emoji Frame */}
              <div className="text-4xl lg:text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 select-none filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
                {category.icon}
              </div>

              {/* Title */}
              <h3 className="font-black text-slate-200 text-lg lg:text-xl tracking-tight group-hover:text-emerald-400 transition-colors duration-200">
                {category.name}
              </h3>

              {/* Description */}
              <p className="text-slate-400 mt-2 text-xs lg:text-sm leading-relaxed">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
