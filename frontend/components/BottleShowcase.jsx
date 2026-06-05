'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

export default function BottleShowcase({ children }) {
    const containerRef = useRef(null);
    const bottleRef = useRef(null);

    useGSAP(() => {
        const mobile = window.innerWidth < 640;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=4500",
                scrub: 1,
                invalidateOnRefresh: true,
            },
        });

        gsap.set(bottleRef.current, {
            x: mobile ? 120 : 550,
            y: -300,
            rotation: 15,
            force3D:true,
        });

        tl
            .to(bottleRef.current, {
                x: mobile ? -120 : -550,
                y: 700,
                rotation: -20,
                ease: "none",
                duration: 1,
            })
            .to(bottleRef.current, {
                x: mobile ? 120 : 550,
                y: 1500,
                rotation: 20,
                ease: "none",
                duration: 1,
            })
            .to(bottleRef.current, {
                x: mobile ? -120 : -550,
                y: 2400,
                rotation: -15,
                duration: 1,
            })
            .to(bottleRef.current, {
                x: () => {
                    const targetBox = document.getElementById('footer-bottle-box');
                    if (!targetBox) return mobile ? -120 : -550;
                    const boxRect = targetBox.getBoundingClientRect();
                    return boxRect.left - (window.innerWidth / 2) + (boxRect.width / 2);
                },
                y: () => {
                    const targetBox = document.getElementById('footer-bottle-box');
                    if (!targetBox) return 2400;
                    const boxRect = targetBox.getBoundingClientRect();
                    // इथे आपण 'window.scrollY' ऐवजी फक्त व्ह्यूपोर्ट अंतर मोजत आहोत जेणेकरून फिक्स्ड घटक गायब होणार नाही
                    return boxRect.top - (window.innerHeight / 2) + (boxRect.height / 2);
                },
                rotation: 0,
                scale: mobile ? 1.2 : 1.5,
                ease: "none",
                duration: 1.2,
            });

        gsap.to('.bottle-wrapper', {
            y: -12,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });


    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className="relative bg-[#0B0F19] text-white overflow-x-hidden"
        >

            {/* Fixed Bottle */}
            <div className="fixed inset-0 z-20 md:z-30 flex items-center justify-center pointer-events-none overflow-visible">

                <div
                    ref={bottleRef} 
                    className="bottle-wrapper relative w-[20px] sm:w-[60px] md:w-[80px] lg:w-[80px] will-change-transform"
                >
                    <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full scale-75" />

                    <Image
                        src="/showcase-bottle.png"
                        alt="Bottle"
                        width={160}
                        height={320}
                        className="w-full h-auto object-contain"
                    />
                </div>

            </div>

            {children}

        </div>
    );
}