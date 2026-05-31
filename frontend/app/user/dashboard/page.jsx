"use client";

import { useAuth } from "@/context/AuthContext";
import AdminOnly from "@/components/AdminOnly";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <AdminOnly>
            <div className="p-6">
                <div className="bg-white rounded-lg shadow border p-6">
                    <h1 className="text-2xl font-bold">
                        Welcome, {
                            user?.email
                                ?.split("@")[0]
                                ?.replace(/^./, c => c.toUpperCase())
                        }
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Email: {user?.email}
                    </p>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold">Products</h3>
                            <p className="text-sm text-gray-500">
                                Manage products
                            </p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold">Orders</h3>
                            <p className="text-sm text-gray-500">
                                Manage orders
                            </p>
                        </div>

                        <div className="border rounded-lg p-4">
                            <h3 className="font-semibold">Users</h3>
                            <p className="text-sm text-gray-500">
                                Manage users
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminOnly>
    );
}