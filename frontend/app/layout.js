import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "Manoj Cart Drops | Premium Digital Marketplace",
  description: "Curated fashion drops and bleeding-edge smart devices unified under a zero-compromise premium digital marketplace ecosystem.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body className="bg-[#0B0F19] text-slate-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
        <AuthProvider>
          {/* Main Navigation Header */}
          <Navbar />
          
          {/* Central Core Frame Component Yield Viewport */}
          <main className="min-h-[85vh] relative z-10">
            {children}
          </main>
          
          {/* Bottom Footnote Registry Component */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
