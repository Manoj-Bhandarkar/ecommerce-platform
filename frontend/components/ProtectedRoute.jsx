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
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-3 text-sm text-gray-600">Checking authorization...</p>
            </div>
        );
    }
    return children;
};
export default ProtectedRoute;