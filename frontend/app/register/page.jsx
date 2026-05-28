'use client'

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

const RegisterPage = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setIsSubmitting(true);

    try {
      console.log("Submitting payload to context...", { email });
      await register({ email, password });

      // Clear input fields immediately on success
      setEmail("");
      setPassword("");

      // Set the success message (Notice we removed the 3-second redirect timer)
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
        setErrorMsg("No network response received from backend. Check if FastAPI is running.");
      } else {
        setErrorMsg(`Request Setup Error: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow mt-8 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Register Account</h2>

      {/* Success Notification Banner with Action Button */}
      {successMsg && (
        <div className="p-4 mb-6 text-sm text-green-800 bg-green-100 rounded-lg border border-green-200 font-medium space-y-3">
          <p>{successMsg}</p>
          <div>
            <Link 
              href="/login" 
              className="inline-block bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded text-xs font-semibold transition-colors"
            >
              Go to Login Page →
            </Link>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded border border-red-200 font-medium">
          {errorMsg}
        </div>
      )}

      {/* Hide or disable the form completely once registration is finished successfully */}
      {!successMsg ? (
        <form onSubmit={handleSubmit} method="POST" className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="example@domain.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
              disabled={isSubmitting}
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
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-black"
              disabled={isSubmitting}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full p-2 rounded text-white font-medium transition-colors ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Your Account..." : "Register"}
          </button>
        </form>
      ) : null}

      <div className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login here</Link>
      </div>
    </div>
  );
};

export default RegisterPage;
