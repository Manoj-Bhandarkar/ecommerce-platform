import "./globals.css";

export const metadata = {
  title: "Manoj Cart",
  description: "Ecommerce application built with Next.js and FastAPI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}