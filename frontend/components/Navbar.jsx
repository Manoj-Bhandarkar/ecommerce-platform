'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent layout flashes on initial SSR mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/product", label: "Products" },
    { href: "/cart", label: "Cart" },
  ];

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[9999] bg-[#0B0F19]/90 backdrop-blur-xl border-b border-white/[0.04] shadow-lg shadow-black/40 block"
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          
          <Link
            href="/"
            className="text-lg sm:text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 flex items-center gap-2 select-none tracking-tight"
          >
            🛒 Manoj Cart
          </Link>

      
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${
                  pathname === link.href ? "text-emerald-400" : "text-slate-300 hover:text-emerald-400"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Desktop Auth Section */}
            <div className="border-l border-white/10 pl-6 flex items-center gap-4">
              {!mounted || loading ? (
                <span className="text-slate-500 text-xs">Checking...</span>
              ) : user ? (
                <div className="flex items-center gap-4">
                  {user.is_admin ? (
                    <Link href="/user/dashboard" className="text-sm font-bold text-emerald-400 hover:text-emerald-300">
                      Dashboard
                    </Link>
                  ) : (
                    <Link href="/user/order" className="text-sm font-bold text-emerald-400 hover:text-emerald-300">
                      My Orders
                    </Link>
                  )}
                  <button onClick={() => logout()} className="text-sm font-bold text-rose-500 hover:text-rose-400 cursor-pointer">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link href="/login" className="text-sm font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-white/10">
                    Login
                  </Link>
                  <Link href="/register" className="text-sm font-bold text-black bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 rounded-lg hover:scale-105 transition-transform">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-300 cursor-pointer"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-[#0B0F19] border-b border-white/[0.04] px-4 py-6 shadow-2xl z-[9999]">
              <div className="flex flex-col gap-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-sm font-bold uppercase tracking-wider ${
                      pathname === link.href ? "text-emerald-400" : "text-slate-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-white/10 pt-4">
                  {!mounted || loading ? (
                    <span className="text-slate-500 text-xs">Checking...</span>
                  ) : user ? (
                    <div className="flex flex-col gap-4">
                      {user.is_admin ? (
                        <Link href="/user/dashboard" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-emerald-400">
                          Dashboard
                        </Link>
                      ) : (
                        <Link href="/user/order" onClick={() => setMobileMenuOpen(false)} className="text-sm font-bold text-emerald-400">
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
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-center border border-white/10 py-2 rounded-lg">
                        Login
                      </Link>
                      <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="text-center bg-gradient-to-r from-emerald-500 to-teal-500 text-black py-2 rounded-lg font-bold">
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

      {/* Spacing Buffer */}
      <div className="h-[76px] w-full bg-[#0B0F19] pointer-events-none" />
    </>
  );
};

export default Navbar;
