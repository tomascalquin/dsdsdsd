import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/WhatsAppButton";
import MarqueeBanner from "@/components/MarqueeBanner";
import CartSidebar from "@/components/CartSidebar";

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "DropsC | Store",
  description: "Tienda oficial DropsC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      {/* CORRECCIÓN AQUÍ: Agregamos 'overflow-x-hidden' al final de la clase */}
      <body className={`${jakarta.className} antialiased bg-gray-50 text-slate-900 overflow-x-hidden`}>
        <AuthProvider>
          <CartProvider> 
            <CartSidebar />
            <Toaster position="top-center" richColors />  
            <MarqueeBanner />
            <Navbar />
            <main className="min-h-screen flex flex-col">
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}