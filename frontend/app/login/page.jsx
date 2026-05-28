'use client'

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

const LoginPage = () => {
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.is_admin) {
        router.replace("/user/dashboard");
      } else {
        router.replace("/user/order");
      }
    }
  }, [user, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);
    try {
      await login({ email, password });
    } catch (err) {
      console.error("Login component caught error:", err);
      setAuthError(err.response?.data?.detail || "Invalid email credentials or wrong password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow mt-8 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Login to Account</h2>

      {authError && (
        <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded border border-red-200 font-medium">
          {authError}
        </div>
      )}

      <form onSubmit={handleSubmit} method="POST" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="example@domain.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded text-black focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className={`w-full text-white p-2 rounded font-medium transition-colors ${isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isSubmitting ? "Verifying..." : "Login"}
        </button>
      </form>
      <div className="mt-4 text-center text-sm text-gray-600">
        Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register here</Link>
      </div>
    </div>
  );
};

export default LoginPage;
