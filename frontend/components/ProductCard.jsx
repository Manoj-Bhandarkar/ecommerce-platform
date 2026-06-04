'use client';

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ product }) => {
  const cardRef = useRef(null);
  
  const imageUrl = product.image_url?.startsWith('http')
    ? product.image_url
    : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${product.image_url}`;

  // Use a fallback calculation to avoid resetting discount values on every component re-render loop
  const discount = product.discount || 15;

  useGSAP(() => {
    // 3D Magnetic Parallax Hover Logic
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      gsap.to(card, {
        rotationY: x * 15,
        rotationX: -y * 15,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.4,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotationY: 0,
        rotationX: 0,
        ease: "power3.out",
        duration: 0.6,
      });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="
        group
        bg-[#111625]
        rounded-2xl
        overflow-hidden
        border
        border-white/[0.04]
        shadow-lg
        hover:shadow-emerald-500/5
        hover:border-white/[0.1]
        transition-all
        duration-300
        h-full
        flex
        flex-col
        [transform-style:preserve-3d]
      "
    >
      {/* Image Gallery wrapper */}
      <div className="relative overflow-hidden bg-slate-950/40 w-full h-64 flex items-center justify-center [transform:translateZ(20px)]">
        <Image
          src={imageUrl}
          alt={product.title || "Product Image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="
            object-contain
            p-6
            transition-transform
            duration-700
            ease-out
            group-hover:scale-110
          "
          priority={false}
        />

        {/* Dynamic Discount Tag */}
        <div className="absolute top-3 left-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full shadow-lg shadow-emerald-500/10 tracking-wide select-none">
          -{discount}%
        </div>

        {/* Quick View Cover Overlay */}
        <Link 
          href={`/product/${product.slug}`}
          className="
            absolute
            inset-0
            bg-slate-950/80
            backdrop-blur-sm
            text-white
            text-xs
            font-bold
            tracking-widest
            uppercase
            flex
            items-center
            justify-center
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
            z-10
          "
        >
          Quick View
        </Link>
      </div>

      {/* Product Content Meta Metadata */}
      <div className="p-5 flex flex-col flex-grow [transform:translateZ(15px)]">
        <p className="text-[10px] uppercase tracking-widest text-emerald-400 font-bold mb-2">
          {product.category || "Premium Collection"}
        </p>

        <Link href={`/product/${product.slug}`} className="block group/title">
          <h2 className="text-base font-bold text-slate-200 line-clamp-2 min-h-[48px] tracking-tight group-hover/title:text-emerald-400 transition-colors duration-200">
            {product.title}
          </h2>
        </Link>

        {/* Star Rating Info Row */}
        <div className="flex items-center mt-3">
          <div className="flex text-amber-400 text-xs tracking-tighter">
            ★★★★★
          </div>
          <span className="ml-2 text-xs font-medium text-slate-500">
            ({product.rating || "4.8"})
          </span>
        </div>

        {/* Pricing Layout Block */}
        <div className="flex items-baseline gap-2 mt-4 flex-grow justify-start">
          <span className="text-xl font-black text-white tracking-tight">
            ₹{Number(product.price).toLocaleString('en-IN')}
          </span>

          <span className="text-xs text-slate-500 line-through">
            ₹{Math.round(product.price * 1.25).toLocaleString('en-IN')}
          </span>
        </div>

        {/* Action Button: Replaced with interactive link layer to solve HTML nesting bug */}
        <Link
          href={`/product/${product.slug}`}
          className="
            w-full
            mt-5
            bg-gradient-to-r
            from-emerald-500/10
            to-teal-500/10
            hover:from-emerald-500
            hover:to-teal-500
            border
            border-emerald-500/20
            hover:border-transparent
            text-emerald-400
            hover:text-slate-950
            py-3
            rounded-xl
            font-black
            text-xs
            uppercase
            tracking-wider
            text-center
            transition-all
            duration-300
            shadow-lg
            shadow-emerald-500/5
            block
          "
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
