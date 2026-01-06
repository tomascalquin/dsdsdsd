"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import ProductCard from "@/components/ProductCard";

export default function UserDashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'pedidos' | 'datos' | 'favoritos'>('pedidos');
  const [loading, setLoading] = useState(true);

  // Estados de Datos
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    address: "",
    city: ""
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      loadAllData();
    }
  }, [user, authLoading, activeTab]);

  async function loadAllData() {
    setLoading(true);
    try {
      // 1. Cargar Perfil (Datos Personales)
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          phone: profileData.phone || "",
          address: profileData.address || "",
          city: profileData.city || ""
        });
      }

      // 2. Cargar Pedidos (Solo si estamos en la tab pedidos)
      if (activeTab === 'pedidos') {
        const { data: ordersData } = await supabase
          .from("orders")
          .select(`*, order_items ( quantity, price, products ( title, product_images (url) ) )`)
          .eq("user_id", user?.id)
          .order("created_at", { ascending: false });
        if (ordersData) setOrders(ordersData);
      }

      // 3. Cargar Favoritos (Solo si estamos en la tab favoritos)
      if (activeTab === 'favoritos') {
        const { data: wishData } = await supabase
          .from("wishlist")
          .select(`product_id, products ( * , product_images (url, is_primary) )`)
          .eq("user_id", user?.id);
        
        // Formateamos para que ProductCard lo entienda
        if (wishData) {
          const formattedWishlist = wishData.map((item: any) => item.products);
          setWishlist(formattedWishlist);
        }
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // --- GUARDAR PERFIL ---
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    const toastId = toast.loading("Guardando cambios...");
    
    // Si el perfil no existe, lo creamos (upsert)
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        ...profile,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast.dismiss(toastId);
      toast.error("Error al guardar");
    } else {
      toast.dismiss(toastId);
      toast.success("Perfil actualizado correctamente");
    }
  }

  if (authLoading) return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-3xl font-black mb-8">Mi Cuenta</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* SIDEBAR DE NAVEGACIÓN */}
          <div className="md:col-span-1 space-y-2">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 mb-6 text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">👤</div>
              <p className="font-bold truncate">{user?.email?.split("@")[0]}</p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>

            <nav className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setActiveTab('pedidos')}
                className={`w-full text-left px-6 py-4 font-bold text-sm transition-all flex items-center gap-3 ${activeTab === 'pedidos' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                📦 Mis Pedidos
              </button>
              <button 
                onClick={() => setActiveTab('favoritos')}
                className={`w-full text-left px-6 py-4 font-bold text-sm transition-all flex items-center gap-3 ${activeTab === 'favoritos' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                ❤️ Lista de Deseos
              </button>
              <button 
                onClick={() => setActiveTab('datos')}
                className={`w-full text-left px-6 py-4 font-bold text-sm transition-all flex items-center gap-3 ${activeTab === 'datos' ? 'bg-black text-white' : 'hover:bg-gray-50'}`}
              >
                ⚙️ Datos Personales
              </button>
              <button 
                onClick={() => signOut()}
                className="w-full text-left px-6 py-4 font-bold text-sm text-red-500 hover:bg-red-50 transition-all flex items-center gap-3 border-t border-gray-100"
              >
                🚪 Cerrar Sesión
              </button>
            </nav>
          </div>

          {/* ÁREA DE CONTENIDO PRINCIPAL */}
          <div className="md:col-span-3">
            
            {loading ? (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center animate-pulse">
                Cargando información...
              </div>
            ) : (
              <>
                {/* --- PESTAÑA 1: PEDIDOS --- */}
                {activeTab === 'pedidos' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-bold">Historial de Compras</h2>
                    {orders.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <p className="text-gray-400 mb-4">No tienes pedidos aún.</p>
                        <Link href="/" className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800">Ir a comprar</Link>
                      </div>
                    ) : orders.map((order) => (
                      <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50/80 p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                          <div>
                            <p className="text-xs font-bold uppercase text-gray-400">Orden #{order.order_id}</p>
                            <p className="text-sm font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                              order.status === 'pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>{order.status}</span>
                          </div>
                        </div>
                        <div className="p-6">
                          {order.order_items.map((item: any, i: number) => (
                            <div key={i} className="flex items-center gap-4 mb-4 last:mb-0">
                               <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative border border-gray-200">
                                 <Image src={item.products?.product_images?.[0]?.url || "/placeholder.png"} fill alt="img" className="object-cover" />
                               </div>
                               <div className="flex-1">
                                 <p className="font-bold text-sm">{item.products?.title}</p>
                                 <p className="text-xs text-gray-500">x{item.quantity}</p>
                               </div>
                               <p className="font-bold text-sm">${item.price?.toLocaleString('es-CL')}</p>
                            </div>
                          ))}
                          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm text-gray-500">Total Pagado</span>
                            <span className="text-xl font-black">${order.total?.toLocaleString('es-CL')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* --- PESTAÑA 2: DATOS PERSONALES --- */}
                {activeTab === 'datos' && (
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">Editar Información</h2>
                    <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nombre Completo</label>
                        <input 
                          type="text" 
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                          value={profile.full_name}
                          onChange={e => setProfile({...profile, full_name: e.target.value})}
                          placeholder="Ej: Juan Pérez"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Teléfono</label>
                          <input 
                            type="tel" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                            value={profile.phone}
                            onChange={e => setProfile({...profile, phone: e.target.value})}
                            placeholder="+56 9..."
                          />
                        </div>
                        <div>
                           <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Ciudad</label>
                           <input 
                            type="text" 
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                            value={profile.city}
                            onChange={e => setProfile({...profile, city: e.target.value})}
                            placeholder="Santiago"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Dirección de Envío</label>
                        <input 
                          type="text" 
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none"
                          value={profile.address}
                          onChange={e => setProfile({...profile, address: e.target.value})}
                          placeholder="Av. Siempre Viva 742..."
                        />
                      </div>
                      <button type="submit" className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg">
                        Guardar Cambios
                      </button>
                    </form>
                  </div>
                )}

                {/* --- PESTAÑA 3: FAVORITOS --- */}
                {activeTab === 'favoritos' && (
                  <div>
                    <h2 className="text-xl font-bold mb-6">Lista de Deseos ({wishlist.length})</h2>
                    {wishlist.length === 0 ? (
                      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <p className="text-gray-400 mb-4">No tienes favoritos guardados.</p>
                        <Link href="/" className="text-black font-bold underline">Explorar tienda</Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((product) => {
                          const mainImage = product.product_images?.find((img: any) => img.is_primary)?.url 
                            || product.product_images?.[0]?.url 
                            || "/placeholder.png";

                          return (
                            <ProductCard 
                              key={product.id}
                              id={product.id}
                              title={product.title} 
                              price={product.price}
                              image={mainImage}
                              slug={product.slug}
                            />
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}