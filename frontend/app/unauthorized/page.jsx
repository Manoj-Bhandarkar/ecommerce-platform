'use client';

import Link from "next/link";

const Unauthorized = () => {
  return (
    <div className="bg-[#0B0F19] min-h-[85vh] flex flex-col items-center justify-center px-6 relative overflow-hidden text-center">
      {/* Dynamic Ambient Red/Rose Blur Backmesh Layer to reflect authorization alert */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

      {/* Main Content Box Wrapper */}
      <div className="max-w-md bg-[#111625] rounded-3xl border border-white/[0.04] p-8 sm:p-12 shadow-2xl space-y-6 relative z-10 flex flex-col items-center">
        
        {/* Abstract Security Warning Badge Indicator */}
        <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center text-2xl select-none shadow-lg shadow-rose-500/5 animate-pulse">
          🛡️
        </div>

        {/* Structural Text Headings */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Access Protocol Denied
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-xs">
            Your authorization keys do not have sufficient permissions to decrypt or view this resource module.
          </p>
        </div>

        {/* Premium Alignment Action Routing Key Button */}
        <Link
          href="/"
          className="
            w-full
            mt-2
            bg-gradient-to-r
            from-emerald-500
            to-teal-500
            hover:from-emerald-400
            hover:to-teal-400
            text-slate-950
            py-3.5
            rounded-xl
            font-black
            text-xs
            uppercase
            tracking-wider
            text-center
            transition-all
            duration-300
            shadow-xl
            shadow-emerald-500/10
            hover:scale-[1.02]
            active:scale-[0.98]
            block
          "
        >
          Return to Secure Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
