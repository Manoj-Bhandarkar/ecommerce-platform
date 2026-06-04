'use client';

import { useAuth } from '@/context/AuthContext';
import AdminOnly from '@/components/AdminOnly';
import { useEffect, useState } from 'react';
import api from '@/utils/axios';

export default function Dashboard() {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    total_users: 0,
    revenue: 0,
    low_stock_count: 0,
    recent_orders: [],
    pending_orders: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/api/v1/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <AdminOnly>
        <div className="bg-[#0B0F19] min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
            <p className="text-xs uppercase tracking-widest text-slate-500 font-black">
              Loading Dashboard...
            </p>
          </div>
        </div>
      </AdminOnly>
    );
  }

  return (
    <AdminOnly>
      <div className="bg-[#0B0F19] min-h-screen text-white px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          {/* Header */}
          <div className="border-b border-white/[0.04] pb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black">
              Welcome,{' '}
              {user?.email
                ?.split('@')[0]
                ?.replace(/^./, (c) => c.toUpperCase()) || 'Admin'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 mt-2 break-all">
              Logged in as:{' '}
              <span className="text-emerald-400 font-mono">
                {user?.email}
              </span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            <div className="bg-[#111625] rounded-2xl border border-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Total Products
              </p>
              <h2 className="text-3xl font-black mt-3">
                {stats.total_products}
              </h2>
            </div>

            <div className="bg-[#111625] rounded-2xl border border-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Total Orders
              </p>
              <h2 className="text-3xl font-black mt-3">
                {stats.total_orders}
              </h2>
            </div>

            <div className="bg-[#111625] rounded-2xl border border-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Total Users
              </p>
              <h2 className="text-3xl font-black mt-3">
                {stats.total_users}
              </h2>
            </div>

            <div className="bg-[#111625] rounded-2xl border border-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Revenue
              </p>
              <h2 className="text-3xl font-black text-emerald-400 mt-3">
                ₹{stats.revenue?.toLocaleString('en-IN') || '0'}
              </h2>
            </div>

            <div className="bg-[#111625] rounded-2xl border border-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Low Stock
              </p>

              {stats.low_stock_count > 0 ? (
                <h2 className="text-3xl font-black text-rose-400 mt-3">
                  {stats.low_stock_count}
                </h2>
              ) : (
                <h2 className="text-lg font-semibold text-slate-500 mt-4">
                  All Good
                </h2>
              )}
            </div>

            <div className="bg-[#111625] rounded-2xl border border-white/[0.04] p-5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                Pending Orders
              </p>
              <h2 className="text-3xl font-black text-amber-400 mt-3">
                {stats.pending_orders}
              </h2>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-[#111625] rounded-2xl border border-white/[0.04] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 border-b border-white/[0.04]">
              <h2 className="text-sm sm:text-base font-black">
                Recent Orders
              </h2>
            </div>

            {stats.recent_orders?.length === 0 ? (
              <div className="p-10 text-center text-slate-500">
                No recent orders found.
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.04] bg-slate-950/30">
                        <th className="px-6 py-4 text-left text-xs uppercase text-slate-400">
                          Order ID
                        </th>

                        <th className="px-6 py-4 text-left text-xs uppercase text-slate-400">
                          Customer
                        </th>

                        <th className="px-6 py-4 text-left text-xs uppercase text-slate-400">
                          Amount
                        </th>

                        <th className="px-6 py-4 text-right text-xs uppercase text-slate-400">
                          Status
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {stats.recent_orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-white/[0.03]"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-emerald-400 font-bold">
                                #{order.id}
                              </p>

                              <p className="text-xs text-slate-500">
                                {order.created_at
                                  ? new Date(
                                      order.created_at
                                    ).toLocaleDateString('en-IN')
                                  : '-'}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {order.customer_name ||
                              order.user?.name ||
                              'Customer'}
                          </td>

                          <td className="px-6 py-4 font-semibold">
                            ₹
                            {Number(
                              order.total_price || 0
                            ).toLocaleString('en-IN')}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <span
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                ['confirmed', 'shipped', 'success'].includes(
                                  order.status
                                )
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : 'bg-amber-500/10 text-amber-400'
                              }`}
                            >
                              {order.status || 'Pending'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-white/[0.04]">
                  {stats.recent_orders.map((order) => (
                    <div key={order.id} className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-emerald-400 font-bold">
                            #{order.id}
                          </p>

                          <p className="text-xs text-slate-500">
                            {order.created_at
                              ? new Date(
                                  order.created_at
                                ).toLocaleDateString('en-IN')
                              : '-'}
                          </p>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                            ['confirmed', 'shipped', 'success'].includes(
                              order.status
                            )
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}
                        >
                          {order.status || 'Pending'}
                        </span>
                      </div>

                      <div>
                        <p className="text-slate-400 text-xs">
                          Customer
                        </p>
                        <p className="font-semibold">
                          {order.customer_name ||
                            order.user?.name ||
                            'Customer'}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-400 text-xs">
                          Amount
                        </p>
                        <p className="font-bold text-lg">
                          ₹
                          {Number(
                            order.total_price || 0
                          ).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AdminOnly>
  );
}