'use client';

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import Link from "next/link";

const RegisterPage = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      console.log("Submitting registration payload...", { email });
      await register({ email, password });

      // Reset dynamic input hooks on server validation match
      setEmail("");
      setPassword("");
      setSuccessMsg("Registration completed successfully! You can now log in to your account.");
    } catch (err) {
      console.error("Component caught an execution error:", err);

      if (err.response) {
        console.log("Error response payload from server:", err.response.data);
        const detail = err.response.data?.detail;
        
        if (Array.isArray(detail)) {
          setErrorMsg(detail.map(item => `${item.loc?.join(".") || "Input Value"}: ${item.msg}`).join(", "));
        } else if (typeof detail === "string") {
          setErrorMsg(detail);
        } else {
          setErrorMsg(`Server validation rejected request (Status Code: ${err.response.status})`);
        }
      } else if (err.request) {
        setErrorMsg("No network response received from backend. Check if your API is running.");
      } else {
        setErrorMsg(`Request Setup Error: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0B0F19] min-h-[85vh] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Ambient Blur Backdrop Glow Overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* Main Form Box Container */}
      <div className="w-full max-w-md bg-[#111625] rounded-3xl border border-white/[0.04] p-8 sm:p-10 shadow-2xl space-y-6 relative z-10">
        
        {/* Structural Text Headings */}
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-white">Create Account</h2>
          <p className="text-xs text-slate-400 font-light">Join Manoj Cart to claim exclusive product drops and fast allocations.</p>
        </div>

        {/* Success Banner Overlay Panel */}
        {successMsg && (
          <div className="p-5 text-xs text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20 font-medium tracking-wide space-y-4 leading-relaxed">
            <p className="flex items-center gap-2">✨ {successMsg}</p>
            <div>
              <Link 
                href="/login" 
                className="inline-block bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black tracking-wider uppercase text-[10px] px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-500/10 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                Go to Login Page →
              </Link>
            </div>
          </div>
        )}

        {/* High-Contrast Error Indicator Panels */}
        {errorMsg && (
          <div className="p-4 text-xs text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 font-medium tracking-wide leading-relaxed animate-pulse">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Render authentication input loops conditionally */}
        {!successMsg ? (
          <form onSubmit={handleSubmit} method="POST" className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner disabled:opacity-40"
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Secure Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm transition-all duration-300 outline-none shadow-inner disabled:opacity-40"
                disabled={isSubmitting}
                required
              />
            </div>

            {/* Premium Form Submission CTA Trigger Key */}
            <button
              type="submit"
              disabled={isSubmitting}
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
                hover:scale-[1.01]
                active:scale-[0.99]
                disabled:opacity-20
                disabled:cursor-not-allowed
                disabled:hover:scale-100
                cursor-pointer
                block
              "
            >
              {isSubmitting ? "Deploying Core Credentials..." : "Initialize Registration"}
            </button>
          </form>
        ) : null}

        {/* Alternative Inter-Page Navigation */}
        <div className="pt-2 text-center text-xs text-slate-500 font-medium tracking-wide">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
