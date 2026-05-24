"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const { user, loading, logout } = useAuth();

  const pathname = usePathname();

  const navLinks = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/products",
      label: "Products",
    },
    {
      href: "/cart",
      label: "Cart",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-rose-600"
        >
          🛒 Manoj Cart
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition hover:text-rose-600 ${pathname === link.href
                ? "text-rose-600 font-semibold"
                : "text-gray-700"
                }`}
            >
              {link.label}
            </Link>
          ))}

          {loading ? (
            <span className="text-sm text-gray-400 animate-pulse">
              Loading...
            </span>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/user/orders"
                className={`transition hover:text-rose-600 ${pathname === "/user/orders"
                  ? "text-rose-600 font-semibold"
                  : "text-gray-700"
                  }`}
              >
                My Orders
              </Link>

              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-700 hover:text-rose-600 transition"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;