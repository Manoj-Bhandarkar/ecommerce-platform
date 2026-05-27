import Link from "next/link";

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6">
            <h1 className="text-4xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-3 text-gray-600 text-center">You do not have permission to view this page.</p>
            <Link href="/" className="mt-6 px-5 py-2 bg-black text-white rounded-lg">Go Back Home</Link>
        </div>
    );
};

export default Unauthorized;