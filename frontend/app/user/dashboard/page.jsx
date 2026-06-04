'use client';

import { useAuth } from "@/context/AuthContext";
import AdminOnly from "@/components/AdminOnly";
import { useEffect, useState } from "react";
import api from "@/utils/axios";

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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/v1/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Error loading administrative datasets:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminOnly>
      <div className="bg-[#0B0F19] min-h-screen text-white p-6 sm:p-8 md:p-12 relative overflow-hidden">
        {/* Decorative Ambient Radial Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />

        <div className="container mx-auto max-w-7xl space-y-10 relative z-10">
          
          {/* Welcome User Banner */}
          <div className="border-b border-white/[0.04] pb-6 space-y-1">
            <h1 className="text-3xl font-black tracking-tight">
              Welcome, {
                user?.email
                  ?.split("@")[0]
                  ?.replace(/^./, c => c.toUpperCase()) || "Admin"
              }
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-light tracking-wide">
              Secure Terminal Authorization Token: <span className="text-emerald-400 font-mono font-medium">{user?.email}</span>
            </p>
          </div>

          {/* Metric Infographics Grid Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="bg-[#111625] border border-white/[0.04] rounded-2xl p-6 shadow-xl">
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Products</h3>
              <p className="text-3xl font-black mt-3 text-slate-100 font-mono">{stats.total_products}</p>
            </div>

            <div className="bg-[#111625] border border-white/[0.04] rounded-2xl p-6 shadow-xl">
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Orders</h3>
              <p className="text-3xl font-black mt-3 text-slate-100 font-mono">{stats.total_orders}</p>
            </div>

            <div className="bg-[#111625] border border-white/[0.04] rounded-2xl p-6 shadow-xl">
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Total Users</h3>
              <p className="text-3xl font-black mt-3 text-slate-100 font-mono">{stats.total_users}</p>
            </div>

            <div className="bg-[#111625] border border-white/[0.04] rounded-2xl p-6 shadow-xl">
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Gross Revenue</h3>
              <p className="text-3xl font-black mt-3 text-emerald-400 font-mono">
                ₹{stats.revenue?.toLocaleString("en-IN") || "0"}
              </p>
            </div>

            <div className="bg-[#111625] border border-white/[0.04] rounded-2xl p-6 shadow-xl">
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Low Stock Alerts</h3>
              <p className={`text-3xl font-black mt-3 font-mono ${stats.low_stock_count > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-500 font-light text-base'}`}>
                {stats.low_stock_count > 0 ? stats.low_stock_count : "Optimal Matrix"}
              </p>
            </div>

            <div className="bg-[#111625] border border-white/[0.04] rounded-2xl p-6 shadow-xl">
              <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest">Pending Allocations</h3>
              <p className="text-3xl font-black mt-3 text-amber-400 font-mono">{stats.pending_orders}</p>
            </div>

          </div>

          {/* Data Table Track List Section */}
          <div className="bg-[#111625] rounded-2xl border border-white/[0.04] shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/[0.04] bg-white/[0.01]">
              <h3 className="font-black text-xs text-slate-400 uppercase tracking-widest">
                Recent Orders Tracker
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-950/40 text-slate-400 font-black text-xs border-b border-white/[0.04] uppercase tracking-wider">
                    <th className="px-6 py-4">Order Allocation ID</th>
                    <th className="px-6 py-4">Customer Profile</th>
                    <th className="px-6 py-4">Sovereign Amount</th>
                    <th className="px-6 py-4 text-right">Status Key</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.02]">
                  {stats.recent_orders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-light">
                        No recent active deployments registered in this window.
                      </td>
                    </tr>
                  ) : (
                    stats.recent_orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-white/[0.01] transition-colors duration-150"
                      >
                        <td className="px-6 py-4">
                          <div className="space-y-0.5">
                            <span className="text-emerald-400 font-mono font-black hover:underline cursor-pointer text-base">
                              #{order.id}
                            </span>
                            <span className="block text-[10px] text-slate-500 font-mono font-medium">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN") : "Recent"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-300 font-bold tracking-tight">
                          {order.customer_name || order.user?.name || "Manoj"}
                        </td>

                        <td className="px-6 py-4 font-mono font-black text-slate-200">
                          ₹{Number(order.total_price).toLocaleString("en-IN")}
                        </td>

                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-lg text-[9px] uppercase tracking-widest font-black border ${
                              order.status === 'confirmed' || order.status === 'shipped' || order.status === 'success'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {order.status || "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </AdminOnly>
  );
}
