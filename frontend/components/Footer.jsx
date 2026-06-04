'use client';

import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: "Trending Fashion", href: "/product?category=clothings" },
      { label: "Best Electronics", href: "/product?category=electronics" },
      { label: "New Arrivals", href: "/product" },
      { label: "Exclusive Drops", href: "/product" },
    ],
    support: [
      { label: "Track Order", href: "/user/order" },
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "Help Center", href: "/support" },
    ],
    company: [
      { label: "Our Story", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ]
  };

  return (
    <footer className="bg-[#0B0F19] border-t border-white/[0.04] text-slate-400 pt-16 pb-8 tracking-tight">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-white/[0.04]">
        
        {/* Column 1: Brand Info Block */}
        <div className="lg:col-span-2 space-y-4">
          <Link
            href="/"
            className="text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent select-none tracking-tight inline-block"
          >
            🛒 Manoj Cart
          </Link>
          <p className="text-sm text-slate-500 max-w-sm leading-relaxed font-light">
            Experience curated fashion drops and bleeding-edge smart devices unified under a zero-compromise premium digital marketplace ecosystem.
          </p>
        </div>

        {/* Column 2: Shop Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-200">Shop</h4>
          <ul className="space-y-2.5 text-sm">
            {footerLinks.shop.map((link, idx) => (
              <li key={idx}>
                <Link href={link.href} className="hover:text-emerald-400 transition-colors duration-200 font-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Support Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-200">Support</h4>
          <ul className="space-y-2.5 text-sm">
            {footerLinks.support.map((link, idx) => (
              <li key={idx}>
                <Link href={link.href} className="hover:text-emerald-400 transition-colors duration-200 font-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Company Links */}
        <div className="space-y-4">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-200">Company</h4>
          <ul className="space-y-2.5 text-sm">
            {footerLinks.company.map((link, idx) => (
              <li key={idx}>
                <Link href={link.href} className="hover:text-emerald-400 transition-colors duration-200 font-light">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom Copyright & Legal Frame */}
      <div className="container mx-auto px-6 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-600 font-medium">
        <div>
          © {currentYear} <span className="text-slate-500 font-bold">Manoj Cart</span>. All rights reserved.
        </div>
        <div className="flex gap-6">
          <span className="cursor-default hover:text-slate-400 transition-colors">Designed for Luxury</span>
          <span className="cursor-default hover:text-slate-400 transition-colors">Secure Checkout 🔒</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
