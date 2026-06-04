'use client';

import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Hero = () => {
  const heroRef = useRef(null);
  const tagsRef = useRef(null);

  useGSAP(() => {
    // Left side typography entrance timeline
    const tl = gsap.timeline();
    
    tl.from('.hero-tag', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    })
    .from('.hero-title', {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-subtitle', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-buttons', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-stats', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out'
    }, '-=0.4');

    // Right graphic staggered slide up & drop in entrance
    gsap.from('.hero-tag-item', {
      y: 140,
      rotationX: -45,
      opacity: 0,
      duration: 1.2,
      stagger: 0.12,
      ease: 'back.out(1.4)',
      onComplete: () => {
        // Continuous, subtle organic floating loop
        gsap.to('.hero-tag-item', {
          y: '-=8',
          repeat: -1,
          yoyo: true,
          duration: 2,
          stagger: {
            each: 0.2,
            from: "random"
          },
          ease: 'sine.inOut'
        });
      }
    });

    // Discount badge smooth pop-in & shake loop
    gsap.from('.discount-badge', {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      delay: 0.8,
      ease: 'back.out(2)'
    });

    gsap.to('.discount-badge', {
      y: -6,
      repeat: -1,
      yoyo: true,
      duration: 1.4,
      ease: 'sine.inOut'
    });

  }, { scope: heroRef });

  // 3D Interactive Mouse Move Physics for the tags container
  const handleMouseMove = (e) => {
    if (!tagsRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = tagsRef.current.getBoundingClientRect();
    
    // Calculate distance from container center (-0.5 to 0.5)
    const xRel = (clientX - left) / width - 0.5;
    const yRel = (clientY - top) / height - 0.5;

    // Tilt the tag group toward the mouse coordinates
    gsap.to('.hero-image-container', {
      rotationY: xRel * 25,
      rotationX: -yRel * 25,
      ease: 'power2.out',
      duration: 0.5
    });
  };

  // Smoothly reset 3D rotation when cursor exits the area
  const handleMouseLeave = () => {
    gsap.to('.hero-image-container', {
      rotationY: 0,
      rotationX: 0,
      ease: 'power3.out',
      duration: 0.8
    });
  };

  return (
    <section
      ref={heroRef}
      className="min-h-[90vh] bg-gradient-to-br from-emerald-50/40 via-white to-teal-50/30 flex items-center py-16 lg:py-24 overflow-hidden"
    >
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* Left Side: Brand & Text Assets */}
        <div className="flex flex-col items-start z-10">
          <span className="hero-tag inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3.5 py-1.5 rounded-full text-xs font-bold mb-6 border border-emerald-200/40 tracking-wide uppercase select-none">
            ✨ Premium Collections 2026
          </span>

          <h1 className="hero-title text-[42px] sm:text-5xl lg:text-[62px] font-black text-slate-900 leading-[1.1] tracking-tight">
            Elevate Style & <br />
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Electronics
            </span> <br />
            Seamlessly
          </h1>

          <p className="hero-subtitle text-slate-500 text-sm sm:text-base mt-6 max-w-md leading-relaxed">
            Discover precision-engineered gadgets and curated trend-setting apparel designed to complete your premium lifestyle ecosystem.
          </p>

          <div className="hero-buttons flex flex-wrap gap-4 mt-8 w-full sm:w-auto">
            <Link
              href="/product"
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-center px-8 py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-xl shadow-emerald-600/15 hover:shadow-emerald-600/25 hover:-translate-y-0.5 active:translate-y-0"
            >
              Shop Collection
            </Link>

            <Link
              href="/product"
              className="border border-slate-200 bg-white text-slate-700 text-center px-8 py-3.5 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Products
            </Link>
          </div>

          {/* Clean Metric Infographics */}
          <div className="hero-stats flex gap-10 sm:gap-14 mt-14 pt-8 border-t border-slate-100 w-full max-w-md">
            <div>
              <h3 className="text-2xl font-black text-slate-900">50K+</h3>
              <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-wider">Customers</p>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">10K+</h3>
              <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-wider">Products</p>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">24/7</h3>
              <p className="text-slate-400 text-xs font-medium mt-1 uppercase tracking-wider">Support</p>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive 3D Interactive Tag Area */}
        <div 
          ref={tagsRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex justify-center lg:justify-end items-center w-full min-h-[400px] cursor-grab active:cursor-grabbing [perspective:1000px]"
        >
          {/* Inner 3D perspective orientation node box wrapper */}
          <div className="hero-image-container relative flex gap-3 lg:gap-4 items-center p-8 [transform-style:preserve-3d]">
            
            {/* Absolute Floating Sticker Badge */}
            <div className="discount-badge absolute -top-4 -right-2 z-30 bg-teal-500 text-white px-4 py-2 rounded-full font-black text-xs shadow-xl shadow-teal-500/20 flex items-center gap-1 tracking-wider uppercase [transform:translateZ(40px)] select-none">
              🔥 Up To 50% OFF
            </div>

            {/* Render loop generating the modular price cards */}
            {['S', 'A', 'L', 'E'].map((letter, index) => (
              <div
                key={index}
                className="hero-tag-item w-[72px] h-[170px] sm:w-[85px] sm:h-[195px] lg:w-[95px] lg:h-[220px] bg-gradient-to-b from-emerald-500 to-emerald-600 rounded-b-2xl rounded-t-[40px] flex flex-col items-center justify-end pb-8 relative shadow-xl shadow-emerald-900/10 [transform-style:preserve-3d]"
              >
                {/* Embedded Thread Tag Hole */}
                <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-7 shadow-inner [transform:translateZ(10px)]" />

                {/* Main Visual Text String */}
                <span className="text-white text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter select-none font-serif [transform:translateZ(25px)] drop-shadow-md">
                  {letter}
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
