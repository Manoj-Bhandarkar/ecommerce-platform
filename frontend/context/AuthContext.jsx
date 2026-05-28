"use client";

// 💡 FIX: Added useCallback to the react import string below
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // This function can now run safely without throwing ReferenceErrors
  const fetchUser = useCallback(async () => {
    try {
      const res = await api.get("/api/v1/account/me");
      setUser(res.data);
      return res.data;
    } catch (error) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (data) => {
    try {
      setLoading(true);
      await api.post("/api/v1/auth/login", data);
      const loggedInUser = await fetchUser();

      if (loggedInUser) {
        if (loggedInUser.is_admin) {
          router.push("/user/dashboard");
        } else {
          //router.push("/user/order");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/v1/account/logout");
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      setUser(null);
      router.push("/login");
    }
  };

const register = async (data) => {
  try {
    setLoading(true);
    const res = await api.post("/api/v1/account/register", data);
    return res.data; // 💡 CRITICAL: Ensure this data extraction payload return exists
  } catch (err) {
    console.error("Registration endpoint error:", err);
    throw err;
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
