'use client';

import { useEffect, useState } from 'react';
import api from '@/utils/axios';

// Premium Theme Color Status Protocol Maps
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
      <div className="bg-[#0B0F19] min-h-[85vh] text-slate-400 flex items-center justify-center font-medium tracking-wide">
        <div className="flex flex-col items-center gap-3">
          <span className="w-8 h-8 rounded-full border-2 border-emerald-400/20 border-t-emerald-400 animate-spin" />
          <p className="text-xs uppercase font-black tracking-widest text-slate-500">Decrypting Ledger Balance Sheets...</p>
        </div>
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="bg-[#0B0F19] min-h-[85vh] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-sm space-y-6 bg-[#111625] p-10 rounded-3xl border border-white/[0.04] shadow-2xl">
          <div className="text-5xl select-none animate-bounce">💳</div>
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight">No Financial Logs</h2>
            <p className="text-xs text-slate-400 font-light">No transaction audit parameters are currently registered under this account key.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0F19] min-h-[85vh] text-white p-6 sm:p-8 md:p-12">
      <div className="container mx-auto max-w-6xl space-y-6">
        
        {/* Section Title Header Block */}
        <div className="border-b border-white/[0.04] pb-6">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
            💳 Transaction Ledger History
          </h1>
          <p className="text-xs text-slate-400 font-light mt-1">
            Review archived gateway clearances, order references, and live settlement states.
          </p>
        </div>

        {/* Ledger Track Listing Stack */}
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-[#111625] border border-white/[0.04] rounded-2xl shadow-xl hover:border-white/[0.08] hover:shadow-emerald-500/[0.01] transition-all duration-300 overflow-hidden"
            >
              {/* Clean 5-Column Perspective Grid Engine */}
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 items-center text-sm">

                {/* Column 1: Core Target Identifiers */}
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Allocation Meta</p>
                  <div className="space-y-0.5">
                    <h2 className="font-bold text-slate-200 font-mono text-base tracking-tight">
                      Pay #{payment.id}
                    </h2>
                    <p className="text-xs font-mono text-slate-400">
                      Order: <span className="text-emerald-400 font-black">#{payment.order_id}</span>
                    </p>
                  </div>
                </div>

                {/* Column 2: Gateway Router & ID Fields */}
                <div className="space-y-1.5 md:col-span-1 sm:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Gateway String</p>
                  <div className="text-[11px] space-y-0.5 text-slate-400 font-medium">
                    <p className="font-bold text-sm text-slate-200 capitalize tracking-tight pb-0.5">
                      {payment.payment_gateway || "Secure Core"}
                    </p>
                    {payment.pg_order_id && (
                      <p className="truncate max-w-[180px]">
                        <span className="text-slate-600 font-semibold">PG_ORD:</span>{" "}
                        <span className="font-mono text-slate-300 font-bold">{payment.pg_order_id}</span>
                      </p>
                    )}
                    {payment.pg_payment_id && (
                      <p className="truncate max-w-[180px]">
                        <span className="text-slate-600 font-semibold">PG_PAY:</span>{" "}
                        <span className="font-mono text-slate-300 font-bold">{payment.pg_payment_id}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Column 3: Local Capital Value */}
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Sovereign Valuation</p>
                  <p className="font-mono font-black text-white text-lg tracking-tight">
                    ₹{Number(payment.amount).toLocaleString('en-IN')}
                  </p>
                </div>

                {/* Column 4: Base Settle Condition Check */}
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Settlement Verification</p>
                  <p
                    className={`font-black uppercase tracking-wider text-xs inline-flex items-center gap-1.5 ${
                      payment.is_paid ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${payment.is_paid ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                    {payment.is_paid ? 'Cleared' : 'Unsettled'}
                  </p>
                </div>

                {/* Column 5: Global Layout Status Badges */}
                <div className="space-y-1 md:text-right md:justify-self-end">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 md:text-right">Workflow State</p>
                  <span
                    className={`inline-block px-3 py-1.5 rounded-xl text-[9px] uppercase tracking-widest font-black border select-none ${
                      statusColors[payment.status?.toLowerCase()] || 'bg-white/[0.02] border-white/[0.04] text-slate-400'
                    }`}
                  >
                    {payment.status || "Processing"}
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
