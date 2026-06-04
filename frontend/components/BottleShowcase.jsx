'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function BottleShowcase() {
    const containerRef = useRef(null);
    const bottleRef = useRef(null);

    useGSAP(() => {
        const sections = gsap.utils.toArray('.showcase-section');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 1.2,
            },
        });

        // Section 1 -> Section 2
        tl.to(bottleRef.current, {
            x: -250,
            rotation: -20,
            scale: 1.05,
            duration: 1,
        })

            // Section 2 -> Section 3
            .to(bottleRef.current, {
                x: 0,
                rotation: 0,
                scale: 1.25,
                duration: 1,
            })

            // Final Position
            .to(bottleRef.current, {
                x: 250,
                rotation: 15,
                scale: 1.1,
                duration: 1,
            });

        // Text animations
        sections.forEach((section) => {
            gsap.from(section.querySelectorAll('.animate-content'), {
                opacity: 0,
                y: 80,
                duration: 1,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                },
            });
        });

        // Floating bottle
        gsap.to('.bottle-wrapper', {
            y: -12,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="relative bg-[#0B0F19] text-white">

            {/* Fixed Bottle */}
            <div className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none">

                <div
                    ref={bottleRef}
                    className="bottle-wrapper relative"
                >
                    {/* Glow */}
                    <div className="absolute inset-0 bg-emerald-500/20 blur-[120px] rounded-full scale-75" />

                    <Image
                        src="/showcase-bottle.png"
                        alt="Bottle"
                        width={100}
                        height={240}
                        priority
                        className="relative z-10 object-contain"
                    />
                </div>

            </div>

            {/* SECTION 1 */}
            <section className="showcase-section min-h-screen flex items-center px-6 sm:px-12 md:px-24 relative z-10">

                <div className="max-w-xl space-y-6">
                    <span className="animate-content inline-flex bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1 rounded-full text-xs font-bold uppercase">
                        Premium Formula
                    </span>

                    <h1 className="animate-content text-5xl md:text-7xl font-black leading-none">
                        Pure Luxury.
                    </h1>

                    <p className="animate-content text-slate-400 max-w-md">
                        Crafted for modern lifestyles with premium ingredients
                        and a timeless aesthetic.
                    </p>
                </div>

            </section>

            {/* SECTION 2 */}
            <section className="showcase-section min-h-screen flex items-center justify-end px-6 sm:px-12 md:px-24 relative z-10">

                <div className="max-w-md bg-[#111625]/70 backdrop-blur-xl p-8 rounded-3xl border border-white/5">

                    <h2 className="animate-content text-4xl font-black mb-4">
                        Inside The Formula
                    </h2>

                    <p className="animate-content text-slate-400">
                        Botanical extracts, luxury fragrance layers,
                        and handcrafted production techniques.
                    </p>

                    <div className="animate-content mt-8 grid grid-cols-2 gap-4 text-sm">
                        <div>🌿 Organic</div>
                        <div>✨ Premium</div>
                        <div>⚡ Long Lasting</div>
                        <div>💎 Luxury Grade</div>
                    </div>

                </div>

            </section>

            {/* SECTION 3 */}
            <section className="showcase-section min-h-screen flex items-center justify-center px-6 relative z-10 text-center">

                <div className="max-w-2xl space-y-8">

                    <h2 className="animate-content text-5xl md:text-7xl font-black">
                        Experience Excellence
                    </h2>

                    <p className="animate-content text-slate-400 max-w-lg mx-auto">
                        Every drop is engineered to deliver elegance,
                        sophistication, and confidence.
                    </p>

                    <button className="animate-content bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-4 rounded-xl text-black font-bold">
                        Shop Now
                    </button>

                </div>

            </section>

        </div>
    );
}