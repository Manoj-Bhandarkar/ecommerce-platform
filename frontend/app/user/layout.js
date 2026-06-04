import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/user/Sidebar";

export default function UserLayout({ children }) {
  return (
    <ProtectedRoute>
      {/* 💎 PREMIUM DARK MATRIX WRAPPER CONTAINER ENGINE */}
      <div className="bg-[#0B0F19] min-h-[calc(100vh-76px)] flex text-white relative overflow-hidden">
        
        {/* 1. Left Fixed Navigational Sidebar Hub */}
        <Sidebar />
        
        {/* 2. Right Scalable Content Canvas Panel */}
        <main 
          role="main" 
          className="flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-8 py-8 w-full bg-[#0B0F19]"
        >
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </main>

      </div>
    </ProtectedRoute>
  );
}
