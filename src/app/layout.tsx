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
  // 1. IMPORTANTE: Tu dominio real (sin esto las fotos no cargan en WhatsApp)
  metadataBase: new URL("https://dropsc.app"), 

  // 2. Título Inteligente:
  // "default" es para el Home. 
  // "template" agrega tu marca automáticamente a las otras páginas (ej: "Zapatillas | DropsC")
  title: {
    default: "DropsC Store | Tu tienda online",
    template: "%s | DropsC Store",
  },
  description: "Encuentra los mejores productos con envío rápido a todo Chile.",

  // 3. OpenGraph (Cómo se ve en WhatsApp/Facebook)
  openGraph: {
    title: "DropsC Store | Ofertas Exclusivas",
    description: "Envíos a todo Chile y pago seguro con Webpay.",
    url: "https://dropsc.app",
    siteName: "DropsC Store",
    images: [
      {
        url: "/hero-banner.png", // Asegúrate de que esta imagen exista en la carpeta public/
        width: 1200,
        height: 630,
        alt: "DropsC Store Banner",
      },
    ],
    locale: "es_CL",
    type: "website",
  },

  // 4. Twitter Card (Cómo se ve en X)
  twitter: {
    card: "summary_large_image",
    title: "DropsC Store",
    description: "Los mejores productos en un solo lugar.",
    images: ["/hero-banner.png"], // La misma imagen
  },
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