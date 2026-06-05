"use client";

import { useAuth } from "@/context/AuthContext";
import { useHasMounted } from "@/hooks/useHasMounted";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProtectedRoute = ({ children, adminOnly = false }) => {

    const { user, loading } = useAuth();
    const hasMounted = useHasMounted();
    const router = useRouter();

    useEffect(() => {
        if (!loading && hasMounted) {
            if (!user) {
                router.replace("/login");
            }
            else if (adminOnly && !user.is_admin) {
                router.replace("/unauthorized");
            }
        }
    }, [user, loading, hasMounted, adminOnly, router]);

    if (!hasMounted || loading || !user || (adminOnly && !user.is_admin)) {
        return (
            <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-4">
                <div className="flex flex-col items-center text-center">

                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20"></div>

                        <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                    </div>

                    <h2 className="mt-6 text-lg sm:text-xl font-bold text-white">
                        Verifying Access
                    </h2>

                    <p className="mt-2 text-sm text-slate-400 max-w-xs">
                        Please wait while we securely verify your account permissions.
                    </p>

                </div>
            </div>
        );
    }
    return children;
};
export default ProtectedRoute;