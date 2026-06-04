'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useHasMounted } from "@/hooks/useHasMounted";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const hasMounted = useHasMounted();

  // Premium Shimmering Skeleton Loader Node
  if (!hasMounted || loading) {
    return (
      <aside className="w-64 bg-[#111625] border-r border-white/[0.04] min-h-screen p-6 hidden md:block">
        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 select-none">Control Panel</h2>
        <nav className="flex flex-col gap-3 animate-pulse">
          <div className="h-9 bg-slate-900/60 rounded-xl w-full" />
          <div className="h-9 bg-slate-900/60 rounded-xl w-11/12" />
          <div className="h-9 bg-slate-900/60 rounded-xl w-4/5" />
        </nav>
      </aside>
    );
  }

  // Unified Conditional Navigation Array Matrix Map
  const navItems = [
    ...(user?.is_admin ? [
      { name: "⚡ Dashboard", href: "/user/dashboard" },
      { name: "📦 Product List", href: "/user/product" },
      { name: "📂 Category List", href: "/user/category" },
      { name: "🚚 Dispatch Orders", href: "/user/shippingstatus" },
    ] : []),
    { name: "📋 My Orders", href: "/user/order" },
    { name: "📍 Shipping Address", href: "/user/address" },
    { name: "💳 Payment History", href: "/user/payments" },
  ];

  return (
    <aside className="w-64 bg-[#111625] border-r border-white/[0.04] min-h-screen p-6 hidden md:flex flex-col justify-between shrink-0 select-none">
      
      {/* Upper Navigation Links Area */}
      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 pl-4 border-l-2 border-emerald-400">
          Control Panel
        </h2>
        
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            // Evaluates link matching accurately, preventing root homepage collisions
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 block ${
                  isActive 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/[0.02]" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile Disconnect Anchor */}
      <div className="pt-6 border-t border-white/[0.04]">
        <button
          onClick={logout}
          className="
            w-full
            bg-rose-500/10
            border
            border-rose-500/20
            hover:bg-rose-600
            text-rose-400
            hover:text-white
            hover:border-transparent
            py-3
            rounded-xl
            font-black
            text-xs
            uppercase
            tracking-wider
            text-center
            transition-all
            duration-300
            cursor-pointer
            block
          "
        >
          Disconnect Terminal
        </button>
      </div>
    </aside>
  );
}
