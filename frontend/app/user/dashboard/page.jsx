"use client";

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
                console.error(err);
            }
        };

        fetchStats();
    }, []);
    return (
        <AdminOnly>
            <div className="p-6">
                <div className="bg-white rounded-lg shadow border p-6">
                    <h1 className="text-2xl font-bold">
                        Welcome, {
                            user?.email
                                ?.split("@")[0]
                                ?.replace(/^./, c => c.toUpperCase())
                        }
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Email: {user?.email}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

                        <div className="bg-white border rounded-lg p-6 shadow-sm">
                            <h3 className="text-gray-500 text-sm">Total Products</h3>
                            <p className="text-3xl font-bold mt-2">
                                {stats.total_products}
                            </p>
                        </div>

                        <div className="bg-white border rounded-lg p-6 shadow-sm">
                            <h3 className="text-gray-500 text-sm">Total Orders</h3>
                            <p className="text-3xl font-bold mt-2">
                                {stats.total_orders}
                            </p>
                        </div>

                        <div className="bg-white border rounded-lg p-6 shadow-sm">
                            <h3 className="text-gray-500 text-sm">Total Users</h3>
                            <p className="text-3xl font-bold mt-2">
                                {stats.total_users}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <h3 className="text-gray-500">Revenue</h3>
                            <p className="text-3xl font-bold">
                                ₹{stats.revenue.toLocaleString("en-IN")}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border">

                            <h3 className="text-gray-500">Low Stock Alerts</h3>
                            <p className="text-2xl font-bold mt-2 text-red-400">
                                {stats.low_stock_count > 0 ? stats.low_stock_count : "None"}
                            </p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow border">
                            <h3 className="text-gray-500">Pending Orders</h3>
                            <p className="text-2xl font-bold mt-2 text-blue-400">
                                {stats.pending_orders}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                        {/* Flipkart Dashboard Table Header Title */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-white">
                            <h3 className="font-semibold text-sm text-gray-800 uppercase tracking-wide">
                                Recent Orders Tracker
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm text-gray-800">
                                {/* Table Core Columns Header */}
                                <thead>
                                    <tr className="bg-gray-50 text-gray-500 font-medium text-xs border-b border-gray-200 uppercase tracking-wider">
                                        <th className="px-4 py-3 font-semibold">Order ID</th>
                                        <th className="px-4 py-3 font-semibold">Customer</th>
                                        <th className="px-4 py-3 font-semibold">Amount</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                    </tr>
                                </thead>

                                {/* Table Interactive Content Body */}
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {stats.recent_orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-gray-500 font-normal">
                                                No recent orders found.
                                            </td>
                                        </tr>
                                    ) : (
                                        stats.recent_orders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className="hover:bg-gray-50/50 transition-colors"
                                            >
                                                {/* Column 1: Order ID Reference */}
                                                <td className="px-4 py-2 font-medium text-gray-900">
                                                    <span className="text-[#2874f0] hover:underline cursor-pointer">
                                                        #{order.id}
                                                    </span>
                                                    <span className="block text-[11px] text-gray-400 font-sans mt-0.5">
                                                        {new Date(order.created_at).toLocaleDateString("en-IN")}
                                                    </span>
                                                </td>

                                                {/* Column 2: Customer Name Map */}
                                                <td className="px-4 py-3 text-gray-700 font-medium">
                                                    {order.customer_name || order.user?.name || "Manoj"}
                                                </td>

                                                {/* Column 3: Localized Currency Valuation */}
                                                <td className="px-4 py-3 font-semibold text-gray-900">
                                                    ₹{Number(order.total_price).toLocaleString("en-IN")}
                                                </td>

                                                {/* Column 4: Dynamic State Badge Pill */}
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`inline-block px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-semibold
                                        ${order.status === 'Confirmed' || order.status === 'Shipped'
                                                                ? 'bg-green-50 text-green-700 border border-green-100'
                                                                : 'bg-yellow-50 text-yellow-700 border border-yellow-100'
                                                            }`}
                                                    >
                                                        {order.status}
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
        </AdminOnly >
    );
}