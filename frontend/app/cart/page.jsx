'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const fetchCart = async () => {
    try {
      const res = await api.get('/api/v1/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchCart();
      }
    }
  }, [authLoading, user]);

  const updateCart = async (method, url, itemId) => {
    setUpdatingItemId(itemId);
    try {
      await api[method](url);
      await fetchCart();
    } catch (err) {
      console.error('Cart update failed:', err);
    } finally {
      setUpdatingItemId(null);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="bg-[#0B0F19] min-h-screen text-slate-400 flex items-center justify-center font-medium tracking-wide">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
          <p className="text-xs uppercase font-black tracking-widest text-slate-500">Securing Allocation Data...</p>
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="bg-[#0B0F19] min-h-screen text-white flex items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-6 bg-[#111625] p-10 rounded-3xl border border-white/[0.04] shadow-2xl">
          <div className="text-5xl select-none animate-bounce">🛒</div>
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight">Your Cart is Empty</h2>
            <p className="text-xs text-slate-400 font-light">No items are reserved under your active deployment token.</p>
          </div>
          <button
            onClick={() => router.push('/product')}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/10 cursor-pointer block"
          >
            Explore Catalog Drops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F19] min-h-screen text-white pb-24 pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-8 flex items-center gap-3">
          🛒 Your Cart Drop
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT CONTAINER: Multi-Item Cards Stack */}
          <div className="lg:col-span-8 space-y-4">
            {cart.items.map((item) => {
              const itemImageUrl = item.product_image?.startsWith("http")
                ? item.product_image
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}/${item.product_image}`;

              const isItemBusy = updatingItemId === item.id;

              return (
                <div
                  key={item.id}
                  className={`bg-[#111625] border border-white/[0.04] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row gap-4 sm:gap-6 shadow-xl transition-opacity duration-200 ${isItemBusy ? 'opacity-40 pointer-events-none' : 'opacity-100'
                    }`}
                >
                  {/* Left Block: Media Display & Responsive Counter */}
                  <div className="w-full sm:w-28 flex-shrink-0 flex flex-col items-center">
                    <div className="w-24 h-24 sm:w-24 sm:h-24 relative bg-slate-950/40 rounded-xl p-2 border border-white/[0.02] flex items-center justify-center">
                      <Image
                        src={itemImageUrl}
                        alt={item.product_title || "Product Image"}
                        fill
                        sizes="96px"
                        className="object-contain p-2 select-none"
                        unoptimized
                      />
                    </div>

                    {/* Operational Counter Buttons */}
                    <div className="flex items-center justify-between gap-1 mt-4 bg-slate-950/40 border border-white/[0.04] rounded-xl p-1 w-full select-none">
                      <button
                        onClick={() =>
                          updateCart(
                            "patch",
                            `/api/v1/cart/decrease/${item.product_id}`,
                            item.id
                          )
                        }
                        disabled={item.quantity <= 1 || isItemBusy}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-20 disabled:hover:bg-transparent disabled:hover:text-white text-sm transition-all cursor-pointer font-bold"
                      >
                        -
                      </button>

                      <span className="text-xs font-mono font-bold w-6 text-center text-slate-200">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateCart(
                            "patch",
                            `/api/v1/cart/increase/${item.product_id}`,
                            item.id
                          )
                        }
                        disabled={isItemBusy}
                        className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[0.04] bg-white/[0.02] hover:bg-emerald-500 hover:text-slate-950 disabled:opacity-20 text-sm transition-all cursor-pointer font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Right Block: Details Meta Content Workspace */}
                  <div className="flex flex-col justify-between flex-grow py-1 min-w-0">
                    <div className="space-y-2">
                      <h2 className="font-bold text-slate-200 text-sm sm:text-base tracking-tight leading-snug line-clamp-2 break-words">
                        {item.product_title}
                      </h2>
                      <div className="flex flex-wrap flex-wrap items-baseline gap-2">
                        <span className="text-xl font-black text-white font-mono">
                          ₹{Number(item.price).toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-slate-500 line-through font-mono">
                          ₹{Math.round(item.price * 1.25).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Operational Destruct Actions */}
                    <div className="flex flex-wrap gap-4 sm:gap-6 mt-4 text-[11px] font-black uppercase tracking-wider">


                      <button
                        onClick={() =>
                          updateCart(
                            "delete",
                            `/api/v1/cart/delete/${item.id}`,
                            item.id
                          )
                        }
                        disabled={isItemBusy}
                        className="text-rose-500 hover:text-rose-400 hover:underline transition-colors cursor-pointer"
                      >
                        Remove Allocation
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT CONTAINER: Price Details Balance Sheet Panel */}
          <div className="lg:col-span-4">
            <div className="bg-[#111625] rounded-2xl border border-white/[0.04] shadow-xl overflow-hidden lg:sticky lg:top-24">
              <div className="border-b border-white/[0.04] px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">
                Price Details
              </div>

              <div className="p-6 space-y-4 text-sm text-slate-400 font-light">
                <div className="flex justify-between">
                  <span>Gross Valuation ({cart.total_quantity} units)</span>
                  <span className="font-mono font-medium text-slate-200">₹{Number(cart.total_price).toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>Priority Secure Logistics</span>
                  <span className="text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
                    Free Drop
                  </span>
                </div>

                <div className="border-t border-white/[0.04] pt-4 flex justify-between items-baseline text-white">
                  <span className="font-bold text-base">Net Total Amount</span>
                  <span className="font-mono font-black text-2xl text-emerald-400">
                    ₹{Number(cart.total_price).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Checkout Routing Trigger Button */}
              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 py-3 sm:py-4 rounded-xl font-black text-xs uppercase tracking-wider text-center transition-all duration-300 shadow-xl shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98] cursor-pointer block"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CartPage;