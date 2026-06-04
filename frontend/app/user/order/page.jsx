'use client';
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "@/lib/gsap";
import { useEffect, useState } from 'react';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';

// Premium Theme Color Status Protocol Maps
const statusColors = {
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  shipped: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  cancelled: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const router = useRouter();
  const pageRef = useRef(null);
  const containerRef = useRef(null);
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/v1/order');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    if (!confirm("Are you certain you want to request cancellation for this order allocation?")) return;
    setCancellingId(id);

    try {
      const res = await api.patch(`/api/v1/order/cancel/${id}`);
      console.log("SUCCESS:", res.data);
      await fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.detail || "Cancellation request failed on server connection.");
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🛠️ CRITICAL FIX: Safe structural lifecycle check prevents target missing warnings
  useGSAP(() => {
    if (loading || orders.length === 0) return;

    gsap.fromTo('.order-card-animator',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power2.out',
      }
    );
  }, { scope: pageRef, dependencies: [loading, orders] });

  if (loading) {
    return (
      <div className="bg-[#0B0F19] min-h-[85vh] text-slate-400 flex items-center justify-center font-medium tracking-wide">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
          <p className="text-xs uppercase font-black tracking-widest text-slate-500">Decrypting Order History Allocation...</p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="bg-[#0B0F19] min-h-[85vh] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-6 bg-[#111625] p-10 rounded-3xl border border-white/[0.04] shadow-2xl">
          <div className="text-5xl select-none animate-bounce">📦</div>
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight">No Active Orders</h2>
            <p className="text-xs text-slate-400 font-light">You haven't requested any custom digital drops or allocations yet.</p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider py-3 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/10 cursor-pointer block"
          >
            Start Shopping Drop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F19] min-h-[85vh] text-white p-6 sm:p-8 md:p-12">
      <div className="container mx-auto max-w-4xl space-y-8">

        {/* Section Top Bar Header Row */}
        <div className="border-b border-white/[0.04] pb-6">
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
            📋 Order History Matrix
          </h1>
          <p className="text-xs text-slate-400 font-light mt-1">
            Track, examine, and modify active allocations deployed under this user key.
          </p>
        </div>

        {/* Orders Listing Track */}
        <div className="space-y-8">{/* Orders Listing Track */}
          <div
            ref={containerRef}
            className="space-y-8"
          >
            {orders.map((order) => {
              const isRowBusy = cancellingId === order.id;

              return (
                <div
                  key={order.id}
                  className={`order-card bg-[#111625] rounded-3xl border border-white/[0.04] p-6 sm:p-8 shadow-2xl space-y-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/20 hover:shadow-emerald-500/10 ${isRowBusy
                    ? "opacity-40 pointer-events-none"
                    : "opacity-100"
                    }`}
                >
                  {/* Header */}
                  <div className="flex justify-between items-center border-b border-white/[0.04] pb-4 flex-wrap gap-3">
                    <div>
                      <h2 className="text-lg font-black text-slate-200 tracking-tight font-mono">
                        Order #{order.id}
                      </h2>

                      <p className="text-[11px] text-slate-500">
                        {new Date(order.created_at).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-widest font-black border ${statusColors[order.status] ||
                        "bg-white/[0.02] border-white/[0.04] text-slate-400"
                        }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  {/* Shipping */}
                  <div className="grid md:grid-cols-2 gap-6 border-b border-white/[0.04] pb-6">
                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-slate-500 font-black">
                        Customer
                      </h4>

                      <p className="text-slate-300 font-bold">
                        {order.shipping_address?.name}
                      </p>

                      <p className="text-xs text-slate-500">
                        {order.email}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-widest text-slate-500 font-black">
                        Shipping Address
                      </h4>

                      <p className="text-sm text-slate-400">
                        {order.shipping_address?.address_line1}
                        {order.shipping_address?.address_line2 &&
                          `, ${order.shipping_address.address_line2}`}
                        <br />
                        {order.shipping_address?.city},{" "}
                        {order.shipping_address?.state}
                        {" - "}
                        {order.shipping_address?.pin_code}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    <h4 className="text-xs uppercase tracking-widest text-slate-500 font-black">
                      Order Items
                    </h4>

                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="bg-slate-950/40 border border-white/[0.02] p-4 rounded-xl flex justify-between items-center"
                      >
                        <div>
                          <p className="font-semibold text-slate-200">
                            {item.product?.title}
                          </p>

                          <p className="text-xs text-slate-500">
                            Qty: {item.quantity}
                          </p>
                        </div>

                        <span className="font-bold text-emerald-400">
                          ₹{Number(item.price).toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center border-t border-white/[0.04] pt-4">
                    <div>
                      <p className="text-xs text-slate-500 uppercase">
                        Total Amount
                      </p>

                      <p className="text-2xl font-black text-emerald-400">
                        ₹{Number(order.total_price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {(order.shipping_status?.status === "pending" ||
                      !order.shipping_status) &&
                      order.status !== "cancelled" && (
                        <button
                          onClick={() => cancelOrder(order.id)}
                          disabled={isRowBusy}
                          className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all duration-300 disabled:opacity-30"
                        >
                          {isRowBusy
                            ? "Cancelling..."
                            : "Cancel Order"}
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}