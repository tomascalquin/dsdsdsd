import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext"; // <--- 1. IMPORTAR

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cantarita - Tienda de Mimbre",
  description: "Artesanía de lujo de Chimbarongo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* 2. ENVOLVER TODO CON EL PROVIDER */}
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
        </CartProvider>
      </body>
    </html>
  );
}