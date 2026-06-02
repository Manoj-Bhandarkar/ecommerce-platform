"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  
  // 💡 FIX: Prevent layout flashes on initial SSR mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/product", label: "Products" },
    { href: "/cart", label: "Cart" },
  ];

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-800">
          🛒 Manoj Cart
        </Link>

        <div className="space-x-4 flex items-center text-gray-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                pathname === link.href
                  ? "font-semibold text-blue-600 underline"
                  : "hover:text-blue-600 transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}

          {/* Render placeholder space while Next.js finishes SSR/hydration check */}
          {!mounted || loading ? (
            <span className="text-gray-400 animate-pulse text-sm">Checking...</span>
          ) : user ? (
            <>
              {/* 💡 ENHANCEMENT: Show Dashboard for Admins, Orders for Regular Users */}
              {user.is_admin ? (
                <Link 
                  href="/user/dashboard" 
                  className={`hover:text-blue-600 transition-colors ${pathname === "/user/dashboard" ? "font-semibold text-blue-600" : ""}`}
                >
                  Dashboard
                </Link>
              ) : (
                <Link 
                  href="/user/order" 
                  className={`hover:text-blue-600 transition-colors ${pathname === "/user/order" ? "font-semibold text-blue-600" : ""}`}
                >
                  My Orders
                </Link>
              )}
              
              <button
                onClick={logout}
                className="hover:underline font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                href="/login" 
                className={`hover:text-blue-600 transition-colors ${pathname === "/login" ? "font-semibold text-blue-600" : ""}`}
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className={`hover:text-blue-600 transition-colors ${pathname === "/register" ? "font-semibold text-blue-600" : ""}`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
