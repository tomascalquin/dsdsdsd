"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function UserProfile() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchOrders();
    }
  }, [user, authLoading, router]);

  async function fetchOrders() {
    // Traemos las órdenes Y los productos dentro de ellas
    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          quantity,
          price,
          products ( title, product_images (url) )
        )
      `)
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (error) console.error("Error cargando pedidos:", error);
    if (data) setOrders(data);
    setLoading(false);
  }

  if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* CABECERA PERFIL */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Mi Cuenta</h1>
            <p className="text-gray-500">Bienvenido de vuelta, {user?.email?.split("@")[0]}</p>
          </div>
          <div className="text-right bg-gray-50 px-4 py-2 rounded-xl">
             <span className="block text-xs font-bold uppercase text-gray-400">Email registrado</span>
             <span className="font-mono text-sm font-bold">{user?.email}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6 ml-2">Historial de Pedidos ({orders.length})</h2>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <p className="text-gray-400 mb-4 text-lg">Aún no has realizado compras.</p>
            <Link href="/" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg">
              Ir a la Tienda
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                
                {/* BARRA DE ESTADO */}
                <div className="bg-gray-50/80 p-6 border-b border-gray-100 flex flex-wrap gap-6 justify-between items-center">
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Orden #</p>
                    <p className="font-mono font-bold text-gray-900 text-sm">{order.order_id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Fecha</p>
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(order.created_at).toLocaleDateString("es-CL", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-400 mb-1">Total</p>
                    <p className="font-black text-gray-900">${order.total?.toLocaleString("es-CL")}</p>
                  </div>
                  <div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      order.status === 'pagado' ? 'bg-green-100 text-green-700' :
                      order.status === 'enviado' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'rechazado' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* PRODUCTOS COMPRADOS */}
                <div className="p-6 space-y-4">
                  {order.order_items.map((item: any, i: number) => {
                    const imgUrl = item.products?.product_images?.[0]?.url || "/placeholder.png";
                    return (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0 relative">
                          <Image src={imgUrl} alt="Producto" fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm line-clamp-1">{item.products?.title || "Producto no disponible"}</p>
                          <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-sm text-gray-900">
                          ${item.price?.toLocaleString("es-CL")}
                        </p>
                      </div>
                    )
                  })}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}