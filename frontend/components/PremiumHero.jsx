'use client';

import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const PremiumHero = () => {
  const containerRef = useRef(null);
  const visualStageRef = useRef(null);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  useGSAP(() => {
    // 1. Fluid Orchestrated Text Entrance Timeline
    const tl = gsap.timeline();

    tl.from('.anim-badge', { opacity: 0, scale: 0.8, y: 15, duration: 0.5, ease: 'power3.out' })
      .from('.anim-title', { opacity: 0, y: 40, duration: 0.7, ease: 'power4.out' }, '-=0.2')
      .from('.anim-subtitle', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .from('.anim-buttons', { opacity: 0, y: 15, duration: 0.5, ease: 'power3.out' }, '-=0.4')
      .from('.anim-trust', { opacity: 0, duration: 0.8 }, '-=0.2');

    // 2. Complex Multi-Frequency Tag Floater Engines
    gsap.from('.interactive-tag', {
      opacity: 0,
      y: 160,
      rotation: () => gsap.utils.random(-15, 15),
      stagger: 0.1,
      duration: 1.4,
      ease: 'back.out(1.5)',
      onComplete: () => {
        // Individual elements float at custom intervals for realistic weight
        gsap.to('.tag-S', { y: '-=12', repeat: -1, yoyo: true, duration: 2.2, ease: 'sine.inOut' });
        gsap.to('.tag-A', { y: '-=8', repeat: -1, yoyo: true, duration: 1.8, ease: 'sine.inOut', delay: 0.2 });
        gsap.to('.tag-L', { y: '-=14', repeat: -1, yoyo: true, duration: 2.5, ease: 'sine.inOut', delay: 0.1 });
        gsap.to('.tag-E', { y: '-=10', repeat: -1, yoyo: true, duration: 2.0, ease: 'sine.inOut', delay: 0.3 });
      }
    });

    // 3. Discount Sticker Glow Loop
    gsap.from('.anim-sticker', { scale: 0, opacity: 0, delay: 0.9, duration: 0.5, ease: 'back.out(2)' });
    gsap.to('.anim-sticker', { rotation: 5, repeat: -1, yoyo: true, duration: 2, ease: 'sine.inOut' });

  }, { scope: containerRef });

  // 4. Combined Mouse Physics Engine (3D Tilt + Background Dynamic Spotlamp Glow)
  const handleMouseMove = (e) => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;

    if (!containerRef.current) return;
    const { clientX, clientY } = e;

    // Ambient Background Spotlamp Tracking
    const rect = containerRef.current.getBoundingClientRect();
    const bgX = clientX - rect.left;
    const bgY = clientY - rect.top;
    containerRef.current.style.setProperty('--mouse-x', `${bgX}px`);
    containerRef.current.style.setProperty('--mouse-y', `${bgY}px`);

    // 3D Graphic Grid Matrix Tilting
    if (!visualStageRef.current) return;
    const stageRect = visualStageRef.current.getBoundingClientRect();
    const xRel = (clientX - stageRect.left) / stageRect.width - 0.5;
    const yRel = (clientY - stageRect.top) / stageRect.height - 0.5;

    gsap.to('.graphic-perspective-box', {
      rotationY: xRel * 30,
      rotationX: -yRel * 30,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 1024) return;
    gsap.to('.graphic-perspective-box', { rotationY: 0, rotationX: 0, duration: 0.8, ease: 'power3.out' });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={isDesktop ? handleMouseMove : undefined}
      onMouseLeave={isDesktop ? handleMouseLeave : undefined}
      className="relative min-h-screen flex items-center py-12 sm:py-16 lg:py-20 bg-[#0B0F19] text-white overflow-hidden transition-all duration-300 before:content-[''] before:absolute before:inset-0 before:opacity-[0.15] before:pointer-events-none before:bg-[radial-gradient(circle_800px_at_var(--mouse-x,0px)_var(--mouse-y,0px),#10B981_0%,transparent_100%)]"
    >
      {/* Decorative Matrix Background Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">

        {/* Left Side: Dynamic Text & Interaction Assets */}
        <div className="flex flex-col items-start  lg:items-start text-center lg:text-left space-y-6">
          <div className="anim-badge inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest select-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Exclusive Launch Offer
          </div>

          <h1 className="anim-title text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-black tracking-tight leading-[1.05]">
            The Next Generation <br />
            of <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Digital Luxury</span>
          </h1>

          <p className="anim-subtitle text-slate-400 text-sm sm:text-base lg:text-lg max-w-lg leading-relaxed font-light">
            Experience curated fashion drops and bleeding-edge smart devices unified under a zero-compromise premium marketplace ecosystem.
          </p>

          {/* Interactive Button Clusters */}
          <div className="anim-buttons flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-2">
            <Link
              href="/product"
              className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black tracking-wide text-sm px-8 py-4 rounded-xl shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-emerald-400/30 active:scale-[0.98] w-full sm:w-auto text-center"
            >
              Explore Drops <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>

            <Link
              href="/product"
              className="backdrop-blur-md bg-white/5 border border-white/10 text-white font-semibold text-sm px-8 py-4 rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto duration-300 text-center"
            >
              View Lookbook
            </Link>
          </div>

          {/* Micro Trust Badge Infographics */}
          <div className="anim-trust flex flex-col sm:flex-row gap-8 sm:gap-8 pt-8 border-t border-white/5 w-full max-w-lg max-w-sm text-xs text-slate-500 tracking-wider uppercase font-medium">
            <div>🚀 <span className="text-slate-300 font-bold ml-1">Free Priority</span> Delivery</div>
            <div>🛡️ <span className="text-slate-300 font-bold ml-1">2-Year Official</span> Warranty</div>
          </div>
        </div>

        {/* Right Side: 3D Parallax Perspective Stage */}
        <div
          ref={visualStageRef}
          className="relative flex justify-center lg:justify-end items-center w-full min-h-[320px] sm:min-h-[440px] [perspective:1200px]"
        >
          {/* Inner 3D Transformer Canvas */}
          <div className="graphic-perspective-box relative flex gap-2 sm:gap-4 items-center p-4 sm:p-8 lg:p-12 bg-white/[0.02] border border-white/5 rounded-3xl [transform-style:preserve-3d] shadow-2xl backdrop-blur-3xl">

            {/* Absolute Rotating Accent Sticker */}
            <div className="anim-sticker absolute -top-3 sm:-left-6 left-1/2 sm:left-auto z-30 bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 font-black text-xs px-3 text-]10px] sm:px-4 py-2 rounded-2xl shadow-xl shadow-orange-500/20 tracking-wider uppercase select-none [transform:translateZ(50px)] -translate-x-1/2 sm:translate-x-0">

              🔥 SAVE UP TO 50%
            </div>

            {/* Asymmetric S-A-L-E Custom Layout Array */}
            {[
              { char: 'S', tagClass: 'tag-S', grad: 'from-emerald-500 to-emerald-600' },
              { char: 'A', tagClass: 'tag-A', grad: 'from-teal-500 to-teal-600' },
              { char: 'L', tagClass: 'tag-L', grad: 'from-cyan-500 to-cyan-600' },
              { char: 'E', tagClass: 'tag-E', grad: 'from-emerald-600 to-teal-600' }
            ].map((item, idx) => (
              <div
                key={idx}
                className={`interactive-tag ${item.tagClass} w-[52px] h-[130px] sm:w-[75px] sm:h-[185px] lg:w-[95px] lg:h-[230px] bg-gradient-to-b ${item.grad} rounded-b-3xl rounded-t-[45px] flex flex-col items-center justify-end pb-5 sm:pb-8 relative shadow-2xl shadow-black/40 [transform-style:preserve-3d]`}
              >

                {/* Structural Thread Eyelet */}
                <div className="w-3.5 h-3.5 bg-[#0B0F19] rounded-full absolute top-7 shadow-inner [transform:translateZ(10px)]" />

                {/* Glassmorph Overlap Overlay */}
                <div className="absolute inset-0 bg-white/5 rounded-b-3xl rounded-t-[45px] pointer-events-none opacity-40 border-t border-white/20" />

                {/* Typography Character Frame */}
                <span className="text-white text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight select-none font-serif [transform:translateZ(30px)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                  {item.char}
                </span>
              </div>
            ))}

          </div>
        </div>

      </div>
    </section>
  );
};

export default PremiumHero;
