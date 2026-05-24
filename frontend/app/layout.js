import "./globals.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Manoj Cart",
  description: "A simple shopping cart application built with Next.js and FastAPI.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900">
        <AuthProvider>
          <Navbar />

          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>

          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}