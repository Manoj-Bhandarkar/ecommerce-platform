'use client';

import Link from "next/link";

export default function Footer() {
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
        ],
    };

    return (
        <footer className="bg-[#0B0F19] border-t border-white/[0.04] text-slate-400 pt-14 sm:pt-16 lg:pt-20 pb-8">

            {/* Main Footer */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">

                <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-white/[0.04]"
                >

                    {/* Brand */}
                    <div className="lg:col-span-2 text-center sm:text-left">

                        <Link
                            href="/"
                            className="inline-block text-2xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"
                        >
                            🛒 Manoj Cart
                        </Link>

                        <p className="mt-4 text-sm text-slate-500 max-w-md leading-relaxed">
                            Experience curated fashion drops and cutting-edge
                            technology products in one premium marketplace.
                        </p>

                    </div>

                    {/* Shop */}
                    <div className="text-center sm:text-left">

                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-200 mb-4">
                            Shop
                        </h4>

                        <ul className="space-y-3">
                            {footerLinks.shop.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-emerald-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </div>

                    {/* Support */}
                    <div className="text-center sm:text-left">

                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-200 mb-4">
                            Support
                        </h4>

                        <ul className="space-y-3">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-emerald-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </div>

                    {/* Company */}
                    <div className="text-center sm:text-left">

                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-200 mb-4">
                            Company
                        </h4>

                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm hover:text-emerald-400 transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                    </div>

                </div>

                {/* Bottom Footer */}
                <div
                    className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600 "
                >

                    <div className="text-center md:text-left">
                        © {currentYear}{' '}
                        <span className="font-bold text-slate-500">
                            Manoj Cart
                        </span>
                        . All rights reserved.
                    </div>

                    <div
                        className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center"
                    >
                        <span className="hover:text-slate-400 transition-colors">
                            Designed for Luxury
                        </span>

                        <span className="hover:text-slate-400 transition-colors">
                            Secure Checkout 🔒
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}