'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/axios';

const statusColors = {
    success: 'bg-green-100 text-green-700',
    failed: 'bg-red-100 text-red-700',
    pending: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-gray-100 text-gray-700',
};

export default function PaymentsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPayments = async () => {
        try {
            const res = await api.get('/api/v1/payment');
            setPayments(res.data);
        } catch (err) {
            console.error('Failed to fetch payments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!payments.length) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-10">
                <div className="bg-white border rounded shadow-sm p-12 text-center">
                    <div className="text-6xl mb-4">💳</div>
                    <h2 className="text-xl font-semibold text-gray-800">
                        No Payments Found
                    </h2>
                    <p className="text-gray-500 mt-2">
                        Your payment history will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
       <div className="min-h-screen bg-[#f1f3f6] py-6">
    <div className="max-w-[1140px] mx-auto px-2">
        <h1 className="text-xl font-medium mb-4 text-gray-800 flex items-center gap-2">
            💳 Payment History
        </h1>

        <div className="space-y-3">
            {payments.map((payment) => (
                <div
                    key={payment.id}
                    className="bg-white border border-gray-200 rounded-sm shadow-xs"
                >
                    {/* Explicit 5-Column Grid Layout with Consistent Labels */}
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-start text-sm text-gray-800">
                        
                        {/* Column 1: Identification References */}
                        <div className="space-y-1">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                                Payment Details
                            </p>
                            <div className="space-y-0.5">
                                <h2 className="font-semibold text-gray-900">
                                    Payment #{payment.id}
                               </h2>
                                <p className="text-xs text-gray-500">
                                    Order <span className="text-[#2874f0] font-medium">#{payment.order_id}</span>
                                </p>
                            </div>
                        </div>

                        {/* Column 2: Gateway Configuration & Metadata IDs */}
                        <div className="space-y-1">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                                Gateway Identifiers
                            </p>
                            <div className="text-xs space-y-0.5 text-gray-600">
                                <p className="font-medium text-sm text-gray-800 capitalize mb-0.5">
                                    {payment.payment_gateway}
                                </p>
                                {payment.pg_order_id && (
                                    <p className="truncate">
                                        <span className="font-medium text-gray-400">Order ID:</span>{" "}
                                        <span className="font-mono">{payment.pg_order_id}</span>
                                    </p>
                                )}
                                {payment.pg_payment_id && (
                                    <p className="truncate">
                                        <span className="font-medium text-gray-400">Pay ID:</span>{" "}
                                        <span className="font-mono">{payment.pg_payment_id}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Column 3: Exact Amount Valuation */}
                        <div className="space-y-1">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                                Amount
                            </p>
                            <p className="font-bold text-gray-900 text-base">
                                ₹{Number(payment.amount).toLocaleString('en-IN')}
                            </p>
                        </div>

                        {/* Column 4: Base Transaction Settlement Status */}
                        <div className="space-y-1">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                                Payment Status
                            </p>
                            <p
                                className={`font-semibold inline-flex items-center gap-1.5 ${
                                    payment.is_paid ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${payment.is_paid ? 'bg-green-600' : 'bg-red-600'}`} />
                                {payment.is_paid ? 'Paid' : 'Unpaid'}
                            </p>
                        </div>

                        {/* Column 5: Global Order State Pill Badge */}
                        <div className="space-y-1 md:text-right">
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                                Order Status
                            </p>
                            <span
                                className={`inline-block px-2 py-0.5 rounded-sm text-[10px] uppercase tracking-wider font-semibold ${
                                    statusColors[payment.status] || 'bg-gray-100 text-gray-700'
                                }`}
                            >
                                {payment.status}
                            </span>
                        </div>
                        
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>


    );
}