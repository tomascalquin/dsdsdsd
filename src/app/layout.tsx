import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext"; // <--- IMPORTAR

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cantarita | Store",
  description: "Tienda oficial",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${jakarta.className} antialiased bg-gray-50 text-slate-900`}>
        <AuthProvider> {/* <--- 1. ENVOLVER PRIMERO CON AUTH */}
          <CartProvider> {/* <--- 2. LUEGO EL CART */}
            <Navbar />
            <main className="min-h-screen flex flex-col">
              {children}
            </main>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}