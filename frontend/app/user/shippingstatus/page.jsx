'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/axios';
import AdminOnly from '@/components/AdminOnly';

const statusColors = {
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    processing: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    shipped: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

const shippingOptions = ["pending", "processing", "shipped", "delivered", "cancelled"];

const AdminShippingUpdateStatusPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("");
    const [searchUserId, setSearchUserId] = useState("");

    const fetchOrders = async (statusFilter = "", userId = "") => {
        try {
            setLoading(true);
            const res = await api.get("/api/v1/order/admin/all", {
                params: {
                    shipping_status: statusFilter || undefined,
                    user_id: userId || undefined,
                },
            });
            setOrders(res.data || []);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleFilterChange = (e) => {
        const selected = e.target.value;
        setFilterStatus(selected);
        fetchOrders(selected, searchUserId);
    };

    const handleUserSearch = () => {
        fetchOrders(filterStatus, searchUserId);
    };

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await api.patch(`/api/v1/shipping/status/status/${orderId}`, { status: newStatus });
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId
                        ? { ...order, shipping_status: { ...order.shipping_status, status: newStatus } }
                        : order
                )
            );
        } catch (err) {
            alert("Failed to update shipping status");
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="bg-[#0B0F19] min-h-[85vh] text-slate-400 flex items-center justify-center font-medium tracking-wide">
                <div className="flex flex-col items-center gap-3">
                    <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
                    <p className="text-xs uppercase font-black tracking-widest text-slate-500">Retrieving Fulfillment Records...</p>
                </div>
            </div>
        );
    }

    return (
        <AdminOnly>
            <div className="bg-[#0B0F19] min-h-screen text-white p-6 sm:p-8 md:p-12 relative overflow-hidden">
                {/* Ambient Radial Backmesh Layer */}
                <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-emerald-500/5 blur-[140px] pointer-events-none" />

                <div className="container mx-auto max-w-5xl space-y-8 relative z-10">

                    {/* Header Block Title */}
                    <div className="border-b border-white/[0.04] pb-6">
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
                            🚚 Dispatch & Fulfillment Management
                        </h1>
                        <p className="text-xs text-slate-400 font-light mt-1">
                            Track global client allocations, search unique users, and deploy real-time status matrix updates.
                        </p>
                    </div>

                    {/* Filters Management Row Grid */}
                    <div className="mb-6 flex flex-wrap items-center gap-6 bg-[#111625] border border-white/[0.04] p-5 rounded-2xl shadow-xl">
                        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-slate-400">
                            <label className="select-none">Shipping Filter:</label>
                            <select
                                value={filterStatus}
                                onChange={handleFilterChange}
                                className="bg-[#0B0F19]/60 text-slate-100 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 outline-none cursor-pointer appearance-none shadow-inner"
                            >
                                {/* Styled explicitly to prevent light theme background overrides from the browser agent defaults */}
                                <option value="" className="bg-[#111625] text-slate-400 font-bold uppercase tracking-wider">
                                    All Statuses
                                </option>

                                {shippingOptions.map((status) => (
                                    <option
                                        key={status}
                                        value={status}
                                        className="bg-[#111625] text-slate-200 font-bold uppercase tracking-wider checked:bg-emerald-500/10 checked:text-emerald-400"
                                    >
                                        {status.toUpperCase()}
                                    </option>
                                ))}
                            </select>
                        </div>


                        <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-wider text-slate-400 flex-1 min-w-[280px]">
                            <label className="select-none">User Query ID:</label>
                            <div className="flex gap-2 flex-1 max-w-xs items-center">
                                <input
                                    type="number"
                                    placeholder="e.g. 104"
                                    value={searchUserId}
                                    onChange={(e) => setSearchUserId(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-xs font-bold font-mono transition-all duration-300 outline-none shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                    onClick={handleUserSearch}
                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md shadow-emerald-500/10 cursor-pointer whitespace-nowrap h-full self-stretch flex items-center justify-center"
                                >
                                    Search
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Orders Map Listing Stack */}
                    {orders.length === 0 ? (
                        <div className="text-center py-20 text-slate-500 bg-[#111625]/20 rounded-3xl border border-white/[0.04] border-dashed max-w-xl mx-auto space-y-2">
                            <p className="text-base font-bold text-slate-400">
                                No Active Dispatches Listed
                            </p>
                            <p className="text-xs font-light text-slate-500">
                                Try adjusting your tracking filters or search criteria queries.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-[#111625] rounded-3xl border border-white/[0.04] p-6 sm:p-8 shadow-2xl space-y-6"
                                >
                                    {/* Header */}
                                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-white/[0.04] pb-4 gap-4">
                                        <div>
                                            <h2 className="text-lg font-black text-slate-200 font-mono">
                                                Allocation #{order.id}
                                            </h2>
                                            <div className="flex flex-wrap gap-2 text-[11px] text-slate-500">
                                                <span>
                                                    Client:
                                                    <span className="text-slate-300 font-bold ml-1">
                                                        {order.shipping_address?.name || "Premium Client"}
                                                    </span>
                                                </span>
                                                <span>•</span>
                                                <span>{order.email}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span
                                                className={`px-3 py-1.5 rounded-xl text-[9px] uppercase tracking-widest font-black border ${statusColors[
                                                    order.shipping_status?.status?.toLowerCase()
                                                ] ||
                                                    "bg-white/[0.02] border-white/[0.04] text-slate-400"
                                                    }`}
                                            >
                                                {order.shipping_status?.status || "PENDING"}
                                            </span>

                                            <select
                                                value={order.shipping_status?.status || "pending"}
                                                onChange={(e) =>
                                                    handleUpdateStatus(order.id, e.target.value)
                                                }
                                                className="bg-slate-950/40 text-slate-300 border border-white/[0.04] rounded-xl px-3 py-1.5 text-xs font-bold uppercase"
                                            >
                                                {shippingOptions.map((status) => (
                                                    <option key={status} value={status}>
                                                        {status.toUpperCase()}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="grid md:grid-cols-2 gap-6 text-sm">
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">
                                                📍 Destination Logistics
                                            </h4>
                                            <p className="text-slate-400 leading-relaxed">
                                                {order.shipping_address?.address_line1}
                                                {order.shipping_address?.address_line2 &&
                                                    `, ${order.shipping_address.address_line2}`}
                                                <br />
                                                {order.shipping_address?.city},{" "}
                                                {order.shipping_address?.state} —{" "}
                                                {order.shipping_address?.pin_code},{" "}
                                                {order.shipping_address?.country}
                                            </p>
                                        </div>

                                        <div className="md:text-right text-xs font-mono text-slate-500">
                                            Deployment Request:
                                            <br />
                                            {new Date(order.created_at).toLocaleString("en-IN")}
                                        </div>
                                    </div>

                                    {/* Products */}
                                    <div className="overflow-x-auto rounded-xl border border-white/[0.04]">
                                        <table className="w-full text-sm">
                                            <thead className="bg-slate-900">
                                                <tr>
                                                    <th className="p-3 text-left">Product</th>
                                                    <th className="p-3 text-left">Price</th>
                                                    <th className="p-3 text-left">Qty</th>
                                                    <th className="p-3 text-left">Subtotal</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {order.order_items?.map((item) => (
                                                    <tr
                                                        key={item.id}
                                                        className="border-t border-white/[0.04]"
                                                    >
                                                        <td className="p-3">
                                                            {item.product?.title || "N/A"}
                                                        </td>
                                                        <td className="p-3">
                                                            ₹{item.price}
                                                        </td>
                                                        <td className="p-3">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="p-3">
                                                            ₹
                                                            {(
                                                                item.price *
                                                                item.quantity
                                                            ).toFixed(2)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-end">
                                        <div className="text-right">
                                            <p className="text-xs uppercase text-slate-500">
                                                Order Total
                                            </p>
                                            <p className="text-xl font-black text-emerald-400">
                                                ₹{Number(order.total_price).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminOnly>
    );
};

export default AdminShippingUpdateStatusPage;