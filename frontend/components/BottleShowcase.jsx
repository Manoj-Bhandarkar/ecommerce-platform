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

        // मुख्य टाइमलाइन - जी बॉटलला फक्त डावीकडे-उजवीकडे हलवेल
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=3500", // फुटर येण्याच्या आधीच हे ॲनिमेशन संपेल
                scrub: 1,
                invalidateOnRefresh: true,
            },
        });

        // सुरुवातीला y: 0 ठेवणे
        gsap.set(bottleRef.current, {
            x: mobile ? 120 : 550,
            y: 0,
            rotation: 15,
        });

        tl
            // 🛠️ मास्टर बदल: इथून आपण 'y' पूर्णपणे काढला आहे! 
            // बॉटल फक्त डावीकडे आणि उजवीकडे जाईल, एका जागी स्थिर राहून स्क्रोल होईल.
            .to(bottleRef.current, {
                x: mobile ? -120 : -550,
                rotation: -20,
                duration: 1,
            })
            .to(bottleRef.current, {
                x: mobile ? 120 : 550,
                rotation: 20,
                duration: 1,
            })
            .to(bottleRef.current, {
                x: mobile ? -120 : -550,
                rotation: -15,
                duration: 1,
            });

        // 🛠️ रिपेरेंटिंग ट्रिगर: जेव्हा फुटर येईल तेव्हाच बॉटल जागेवरून हलून बॉक्समध्ये जाईल
        ScrollTrigger.create({
            trigger: "#footer-bottle-box",
            start: "top bottom", 
            end: "bottom bottom", 
            scrub: true,
            onUpdate: (self) => {
                const targetBox = document.getElementById('footer-bottle-box');
                const bottle = bottleRef.current;

                if (targetBox && bottle) {
                    // प्रोग्रेस ८०% च्या पुढे गेल्यावर (फुटर स्क्रीनवर सेट होताना)
                    if (self.progress > 0.8) {
                        if (bottle.parentElement !== targetBox) {
                            targetBox.appendChild(bottle);
                            
                            // फुटर बॉक्सच्या अगदी मधोमध बसवण्यासाठी पोझिशन रिसेट
                            gsap.set(bottle, { 
                                position: "absolute", 
                                top: "50%", 
                                left: "50%", 
                                xPercent: -50, 
                                yPercent: -50, 
                                x: 0, 
                                y: 0, 
                                rotation: 0, 
                                scale: mobile ? 1.4 : 1.8 
                            });
                        }
                    } else {
                        // युझरने वर स्क्रोल करताच बॉटल पुन्हा मूळ फिक्स्ड स्क्रीनवर येईल
                        const fixedContainer = document.getElementById('fixed-bottle-stage');
                        if (fixedContainer && bottle.parentElement !== fixedContainer) {
                            fixedContainer.appendChild(bottle);
                            
                            // फिक्स्ड स्क्रीनवर येताच आधीचे को-ऑर्डिनेट्स पूर्ववत करणे
                            gsap.set(bottle, { 
                                position: "relative", 
                                top: "auto", 
                                left: "auto", 
                                xPercent: 0, 
                                yPercent: 0, 
                                x: tl.getProperty(bottle, "x"), // मुख्य टाइमलाइनची चालू डावी-उजवी पोझिशन मिळवणे
                                rotation: tl.getProperty(bottle, "rotation"),
                                scale: 1 
                            });
                        }
                    }
                }
            }
        });

        // स्वतंत्र फ्लोटिंग इफेक्ट
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
            {/* Fixed Bottle Container */}
            <div className="fixed inset-0 z-20 md:z-30 flex items-center justify-center pointer-events-none overflow-visible">
                <div id="fixed-bottle-stage" className="w-[40px] sm:w-[60px] md:w-[80px] lg:w-[80px] flex items-center justify-center">
                    <div
                        ref={bottleRef}
                        className="bottle-wrapper relative w-full h-auto"
                    >
                        <div className="absolute inset-0 bg-emerald-500/20 blur-[80px] rounded-full scale-75 pointer-events-none" />
                        <Image
                            src="/showcase-bottle.png"
                            alt="Bottle"
                            width={160}
                            height={320}
                            className="w-full h-auto object-contain"
                        />
                    </div>
                </div>
            </div>

            {children}
        </div>
    );
}
