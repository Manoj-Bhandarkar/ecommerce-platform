'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from '@/lib/gsap';

export default function FadeUp({ children }) {
  const ref = useRef();

  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y: 80,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: ref.current,
        start: 'top 85%',
      },
    });
  });

  return <div ref={ref}>{children}</div>;
}