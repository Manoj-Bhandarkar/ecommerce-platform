'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/axios';

const statusColors = {
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  cancelled: 'bg-white/[0.02] border-white/[0.04] text-slate-400',
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/api/v1/payment');
      setPayments(res.data || []);
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
      <div className="bg-[#0B0F19] min-h-[85vh] text-slate-400 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
          <p className="text-xs uppercase font-black tracking-widest text-slate-500">
            Loading Payments...
          </p>
        </div>
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="bg-[#0B0F19] min-h-[85vh] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-6 bg-[#111625] p-8 rounded-3xl border border-white/[0.04] shadow-2xl">
          <div className="text-5xl">💳</div>

          <div>
            <h2 className="text-xl font-black">
              No Payment Records
            </h2>

            <p className="text-sm text-slate-400 mt-2">
              No transactions found for this account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F19] min-h-[85vh] text-white p-4 sm:p-6 md:p-8 lg:p-12">
      <div className="container mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="border-b border-white/[0.04] pb-6">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-3">
            💳 Transaction History
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            View payment records and transaction status.
          </p>
        </div>

        {/* Payment Cards */}
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-[#111625] border border-white/[0.04] rounded-2xl shadow-xl hover:border-white/[0.08] transition-all duration-300"
            >
              <div className="p-5 sm:p-6">

                {/* Mobile Layout */}
                <div className="flex flex-col gap-6 lg:grid lg:grid-cols-5 lg:items-center">

                  {/* Payment Info */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">
                      Payment
                    </p>

                    <h3 className="font-mono font-bold text-lg">
                      #{payment.id}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      Order #{payment.order_id}
                    </p>
                  </div>

                  {/* Gateway */}
                  <div className="lg:col-span-2">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">
                      Gateway Details
                    </p>

                    <p className="font-semibold capitalize text-slate-200">
                      {payment.payment_gateway || 'Secure Core'}
                    </p>

                    {payment.pg_order_id && (
                      <p className="text-xs text-slate-400 break-all mt-1">
                        PG Order: {payment.pg_order_id}
                      </p>
                    )}

                    {payment.pg_payment_id && (
                      <p className="text-xs text-slate-400 break-all mt-1">
                        PG Payment: {payment.pg_payment_id}
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">
                      Amount
                    </p>

                    <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                      ₹{Number(payment.amount).toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Settlement */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">
                      Settlement
                    </p>

                    <div
                      className={`flex items-center gap-2 text-xs font-bold uppercase ${payment.is_paid
                        ? 'text-emerald-400'
                        : 'text-rose-400'
                        }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${payment.is_paid
                          ? 'bg-emerald-400'
                          : 'bg-rose-400'
                          }`}
                      />
                      {payment.is_paid ? 'Paid' : 'Pending'}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="lg:text-right">
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">
                      Status
                    </p>

                    <span
                      className={`inline-block px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-widest font-black border ${statusColors[payment.status?.toLowerCase()] ||
                        'bg-white/[0.02] border-white/[0.04] text-slate-400'
                        }`}
                    >
                      {payment.status || 'Processing'}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}