'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const navbarRef = useRef(null);
  const lastScroll = useRef(0);
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Brand Logo with Premium Glow */}
          <Link
            href="/"
            className="text-lg sm:text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 flex items-center gap-2 select-none tracking-tight"
          >
            🛒 Manoj Cart
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-300"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navigation Elements */}
          {mobileMenuOpen && (
            <div
              className="
      lg:hidden
      absolute
      top-full
      left-0
      right-0
      bg-[#0B0F19]
      border-b
      border-white/[0.04]
      px-4
      py-6
      shadow-2xl
    "
            >
              <div className="flex flex-col gap-5">

                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-bold uppercase tracking-wider ${pathname === link.href
                        ? "text-emerald-400"
                        : "text-slate-300"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-white/10 pt-4">

                  {!mounted || loading ? (
                    <span className="text-slate-500 text-xs">
                      Checking...
                    </span>
                  ) : user ? (
                    <div className="flex flex-col gap-4">

                      {user.is_admin ? (
                        <Link
                          href="/user/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-sm font-bold text-emerald-400"
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <Link
                          href="/user/order"
                          onClick={() => setMobileMenuOpen(false)}
                          className="text-sm font-bold text-emerald-400"
                        >
                          My Orders
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="text-left text-rose-500 font-bold"
                      >
                        Logout
                      </button>

                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">

                      <Link
                        href="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center border border-white/10 py-2 rounded-lg"
                      >
                        Login
                      </Link>

                      <Link
                        href="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-black py-2 rounded-lg font-bold"
                      >
                        Register
                      </Link>

                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* 🛠️ CRITICAL SPACING BUFFER: Prevents the fixed nav overlay from clipping your Hero layout content */}
      <div className="h-[76px] w-full bg-[#0B0F19] pointer-events-none" />
    </>
  );
};

export default Navbar;
