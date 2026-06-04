'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const navbarRef = useRef(null);
  const lastScroll = useRef(0);
  const [mounted, setMounted] = useState(false);

  // Prevent layout flashes on initial SSR mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Smooth Adaptive Scroll Autohide Logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (currentScroll > lastScroll.current && currentScroll > 100) {
        // Scrolling Down - Hide Navbar
        gsap.to(navbarRef.current, {
          y: -100,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        // Scrolling Up - Reveal Navbar
        gsap.to(navbarRef.current, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }

      lastScroll.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial Entrance Animation Engine
  useGSAP(() => {
    gsap.from(navbarRef.current, {
      y: -80,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
  }, { scope: navbarRef });

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/product", label: "Products" },
    { href: "/cart", label: "Cart" },
  ];

  return (
    <>
      {/* Fixed Layout Core */}
      <nav
        ref={navbarRef}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-white/[0.04] shadow-lg shadow-black/20"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Brand Logo with Premium Glow */}
          <Link
            href="/"
            className="text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 flex items-center gap-2 select-none tracking-tight"
          >
            🛒 Manoj Cart
          </Link>

          {/* Navigation Elements */}
          <div className="space-x-6 flex items-center text-sm font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative py-1 transition-colors duration-200 uppercase tracking-wider text-xs font-bold ${
                    isActive
                      ? "text-emerald-400"
                      : "hover:text-emerald-400 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-emerald-400 after:to-teal-400 after:transition-all hover:after:w-full"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Divider Line */}
            <span className="w-[1px] h-4 bg-white/10" />

            {/* Authentication Conditional Render Blocks */}
            {!mounted || loading ? (
              <span className="text-slate-500 animate-pulse text-xs tracking-wider uppercase font-bold">
                Checking...
              </span>
            ) : user ? (
              <div className="flex items-center gap-6">
                {user.is_admin ? (
                  <Link
                    href="/user/dashboard"
                    className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                      pathname === "/user/dashboard" ? "text-emerald-400" : "hover:text-emerald-400"
                    }`}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/user/order"
                    className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                      pathname === "/user/order" ? "text-emerald-400" : "hover:text-emerald-400"
                    }`}
                  >
                    My Orders
                </Link>
                )}

                <button
                  onClick={logout}
                  className="text-xs font-bold uppercase tracking-wider text-rose-500 hover:text-rose-400 hover:underline transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className={`text-xs font-bold uppercase tracking-wider transition-colors duration-200 px-3 py-1.5 rounded-lg ${
                    pathname === "/login" 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "hover:text-emerald-400"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-xs font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4 py-2 rounded-xl transition-all duration-300 shadow-md shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🛠️ CRITICAL SPACING BUFFER: Prevents the fixed nav overlay from clipping your Hero layout content */}
      <div className="h-[76px] w-full bg-[#0B0F19] pointer-events-none" />
    </>
  );
};

export default Navbar;
