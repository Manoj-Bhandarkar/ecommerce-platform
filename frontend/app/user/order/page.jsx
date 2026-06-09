'use client';

import { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from '@/lib/gsap';
import api from '@/utils/axios';
import { useRouter } from 'next/navigation';

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
    if (
      !confirm(
        'Are you certain you want to request cancellation for this order allocation?'
      )
    )
      return;

    setCancellingId(id);

    try {
      await api.patch(`/api/v1/order/cancel/${id}`);
      await fetchOrders();
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
        'Cancellation request failed on server connection.'
      );
    } finally {
      setCancellingId(null);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useGSAP(
    () => {
      if (loading || orders.length === 0) return;

      gsap.fromTo(
        '.order-card',
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    },
    {
      scope: pageRef,
      dependencies: [loading, orders],
    }
  );

  if (loading) {
    return (
      <div className="bg-[#0B0F19] min-h-[85vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
          <p className="text-xs uppercase font-black tracking-widest text-slate-500">
            Loading Orders...
          </p>
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="bg-[#0B0F19] min-h-[85vh] flex items-center justify-center p-6">
        <div className="max-w-sm w-full bg-[#111625] border border-white/[0.04] rounded-3xl p-10 text-center space-y-5">
          <div className="text-5xl">📦</div>

          <div>
            <h2 className="text-xl font-black text-white">
              No Orders Found
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              You haven't placed any orders yet.
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 rounded-xl transition"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={pageRef}
      className="bg-[#0B0F19] min-h-screen text-white p-6 sm:p-8 md:p-12"
    >
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-white/[0.04] pb-6">
          <h1 className="text-2xl sm:text-3xl font-black">
            📋 Order History
          </h1>

          <p className="text-sm text-slate-400 mt-2">
            Track all your purchases and shipping updates.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const isBusy = cancellingId === order.id;

            return (
              <div
                key={order.id}
                className={`order-card bg-[#111625] border border-white/[0.04] rounded-3xl p-6 shadow-xl transition ${isBusy ? 'opacity-50 pointer-events-none' : ''
                  }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/[0.04] pb-4">
                  <div>
                    <h2 className="font-black text-lg">
                      Order #{order.id}
                    </h2>

                    <p className="text-xs text-slate-500">
                      {new Date(order.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black border ${statusColors[order.status] ||
                      'bg-white/5 text-slate-400 border-white/10'
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 py-5 border-b border-white/[0.04]">
                  <div>
                    <h4 className="text-xs uppercase text-slate-500 font-black mb-2">
                      Customer
                    </h4>

                    <p className="font-semibold">
                      {order.shipping_address?.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {order.email}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-slate-500 font-black mb-2">
                      Shipping Address
                    </h4>

                    <p className="text-sm text-slate-400">
                      {order.shipping_address?.address_line1}
                      {order.shipping_address?.address_line2 &&
                        `, ${order.shipping_address.address_line2}`}
                      <br />
                      {order.shipping_address?.city},{' '}
                      {order.shipping_address?.state} -
                      {' '}
                      {order.shipping_address?.pin_code}
                    </p>
                    <p className="text-sm text-slate-500">
                      {order.shipping_address?.phone_number}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 py-5 border-b border-white/[0.04]">
                  <div>
                    <h4 className="text-xs uppercase text-slate-500 font-black mb-2">
                      Shipping Status
                    </h4>

                    <span
                      className={`px-3 py-1 rounded-lg text-[10px] uppercase font-black border ${statusColors[order.status] ||
                        'bg-white/5 text-slate-400 border-white/10'
                        }`}
                    >
                      {order.shipping_status?.status}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs uppercase text-slate-500 font-black mb-2">
                      Shipping Update
                    </h4>

                    <p className="text-sm text-slate-400">
                      {order.shipping_status?.updated_at &&
                        new Date(order.shipping_status.updated_at).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true
                        })
                      }
                    </p>

                  </div>
                </div>


                <div className="space-y-3 py-5">
                  <h4 className="text-xs uppercase text-slate-500 font-black">
                    Order Items
                  </h4>

                  {order.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950/40 border border-white/[0.03] rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
                    >
                      <div>
                        <p className="font-semibold">
                          {item.product?.title}
                        </p>

                        <p className="text-xs text-slate-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <span className="font-bold text-emerald-400">
                        ₹{Number(item.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/[0.04] pt-4 flex flex-col sm:flex-row gap-4 sm:justify-between sm:items-center">
                  <div>
                    <p className="text-xs uppercase text-slate-500">
                      Total
                    </p>

                    <p className="text-xl sm:text-2xl font-black text-emerald-400">
                      ₹{Number(order.total_price).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {(order.shipping_status?.status === 'pending' ||
                    !order.shipping_status) &&
                    order.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        disabled={isBusy}
                        className="px-5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition text-xs font-black uppercase"
                      >
                        {isBusy ? 'Cancelling...' : 'Cancel Order'}
                      </button>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}