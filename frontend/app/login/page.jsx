'use client';

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import Link from "next/link";

const LoginContainer = () => {
  const { login, user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.is_admin) {
        router.push(redirect || "/user/dashboard");
      } else {
        router.push(redirect || "/user/order");
      }
    }
  }, [user, loading, router, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (err) {
      setAuthError(
        err.response?.data?.detail ||
        "Invalid email credentials or wrong password."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="w-full max-w-md bg-[#111625] rounded-2xl sm:rounded-3xl border border-white/[0.04] p-5 sm:p-8 md:p-10 shadow-2xl space-y-6">

      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
          Welcome Back
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
          Access your premium security profile and secure drops.
        </p>
      </div>

      {/* Error */}
      {authError && (
        <div className="p-4 text-xs text-rose-400 bg-rose-500/10 rounded-xl border border-rose-500/20 font-medium leading-relaxed">
          ⚠️ {authError}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="space-y-5"
      >
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Email Address
          </label>

          <input
            type="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm outline-none transition-all duration-300"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Password
          </label>

          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-slate-950/40 text-slate-100 placeholder-slate-600 border border-white/[0.04] focus:border-emerald-500/50 rounded-xl text-sm outline-none transition-all duration-300"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="
            w-full
            py-3 sm:py-3.5
            rounded-xl
            bg-gradient-to-r
            from-emerald-500
            to-teal-500
            hover:from-emerald-400
            hover:to-teal-400
            text-slate-950
            font-black
            text-xs
            uppercase
            tracking-wider
            transition-all
            duration-300
            shadow-xl
            shadow-emerald-500/10
            hover:scale-[1.01]
            active:scale-[0.99]
            disabled:opacity-30
            disabled:cursor-not-allowed
            cursor-pointer
          "
        >
          {isSubmitting ? "Verifying Keys..." : "Authorize Login"}
        </button>
      </form>

      {/* Register Link */}
      <div className="pt-2 text-center text-xs sm:text-sm text-slate-500">
        Don't have a secure profile?{" "}
        <Link
          href="/register"
          className="text-emerald-400 hover:text-emerald-300 font-bold underline"
        >
          Register here
        </Link>
      </div>
    </div>
  );
};

const LoginPage = () => {
  return (
    <div className="bg-[#0B0F19] min-h-screen flex items-center justify-center px-4 sm:px-6 py-8 relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none" />

      <Suspense
        fallback={
          <div className="w-full max-w-md bg-[#111625] rounded-3xl border border-white/[0.04] p-6 sm:p-10 animate-pulse">
            <div className="h-6 bg-slate-800 rounded w-1/3 mb-4" />
            <div className="h-4 bg-slate-800 rounded w-1/2 mb-6" />
            <div className="h-12 bg-slate-800 rounded w-full" />
          </div>
        }
      >
        <LoginContainer />
      </Suspense>
    </div>
  );
};

export default LoginPage;