"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'pedidos' | 'productos'>('pedidos');
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos al cambiar de pestaña
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === 'pedidos') {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setOrders(data || []);
      } else {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_images(url)')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  }

  // Actualizar estado del pedido
  async function updateStatus(id: string, newStatus: string) {
    const toastId = toast.loading("Actualizando estado...");
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    
    if (error) {
      toast.dismiss(toastId);
      toast.error("Error al actualizar");
    } else {
      toast.dismiss(toastId);
      toast.success(`Pedido marcado como ${newStatus}`);
      fetchData(); // Recargar lista
    }
  }

  // Eliminar Producto
  async function deleteProduct(id: number) {
    if (!confirm("⚠️ ¿Estás seguro? Esto borrará el producto permanentemente.")) {
      return;
    }

    const toastId = toast.loading("Eliminando producto...");
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;

      toast.dismiss(toastId);
      toast.success("Producto eliminado");
      fetchData(); // Recargar lista
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error("No se pudo eliminar", { description: error.message });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div>
             <h1 className="text-3xl font-black tracking-tight">Panel de Control</h1>
             <p className="text-gray-500 text-sm">Administración general de DropsC</p>
          </div>
          <Link 
            href="/admin/agregar-producto" 
            className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg hover:scale-105"
          >
            <span>+</span> Nuevo Producto
          </Link>
        </div>

        {/* PESTAÑAS DE NAVEGACIÓN */}
        <div className="flex gap-2 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`pb-3 px-6 font-bold text-sm transition-all relative ${
              activeTab === 'pedidos' 
                ? 'text-orange-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            📦 PEDIDOS
            {activeTab === 'pedidos' && <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full"></span>}
          </button>
          <button
            onClick={() => setActiveTab('productos')}
            className={`pb-3 px-6 font-bold text-sm transition-all relative ${
              activeTab === 'productos' 
                ? 'text-orange-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🛍️ PRODUCTOS
            {activeTab === 'productos' && <span className="absolute bottom-0 left-0 w-full h-1 bg-orange-600 rounded-t-full"></span>}
          </button>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <div className="py-20 text-center text-gray-400 animate-pulse">Cargando datos...</div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            
            {/* --- TABLA DE PEDIDOS --- */}
            {activeTab === 'pedidos' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-6 font-bold">Orden ID</th>
                      <th className="p-6 font-bold">Cliente</th>
                      <th className="p-6 font-bold">Total</th>
                      <th className="p-6 font-bold">Estado</th>
                      <th className="p-6 font-bold text-right">Contacto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                       <tr><td colSpan={5} className="p-10 text-center text-gray-400">No hay pedidos registrados aún.</td></tr>
                    ) : orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-6 font-mono text-xs text-gray-500 font-bold">
                          {order.order_id || order.id.slice(0,8)}
                          <div className="text-[10px] text-gray-400 font-normal mt-1">
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-6">
                          <p className="font-bold text-sm text-gray-900">{order.customer_name || "Invitado"}</p>
                          <p className="text-xs text-gray-500">{order.customer_email}</p>
                        </td>
                        <td className="p-6 font-black text-gray-900">
                          ${order.total?.toLocaleString('es-CL')}
                        </td>
                        <td className="p-6">
                          <select 
                            value={order.status} 
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 cursor-pointer outline-none transition-all ${
                              order.status === 'pagado' ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                              order.status === 'pendiente' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
                              order.status === 'enviado' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="pagado">Pagado</option>
                            <option value="enviado">Enviado</option>
                            <option value="rechazado">Rechazado</option>
                          </select>
                        </td>
                        <td className="p-6 text-right">
                           {order.phone && (
                              <a 
                                href={`https://wa.me/${order.phone}`} 
                                target="_blank" 
                                className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-100 transition-colors"
                              >
                                WhatsApp ↗
                              </a>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* --- GRILLA DE PRODUCTOS --- */}
            {activeTab === 'productos' && (
              <div className="p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.length === 0 ? (
                  <div className="col-span-full py-20 text-center text-gray-400">
                    <p className="mb-4 text-xl">Tu inventario está vacío.</p>
                    <Link href="/admin/agregar-producto" className="text-orange-500 font-bold underline">¡Agrega tu primer producto!</Link>
                  </div>
                ) : products.map((product) => (
                  <div key={product.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group relative">
                    
                    {/* Imagen */}
                    <div className="relative aspect-square bg-gray-100">
                      <img 
                        src={product.product_images?.[0]?.url || "/placeholder.png"} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Badge de Stock */}
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold shadow-sm">
                        Stock: {product.stock}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-gray-900 truncate mb-1" title={product.title}>{product.title}</h3>
                      <div className="flex justify-between items-center mb-4">
                         <p className="text-gray-500 text-xs font-medium">${product.price?.toLocaleString('es-CL')}</p>
                         <span className="text-[10px] uppercase text-gray-400 font-bold bg-gray-50 px-2 rounded-full">{product.category}</span>
                      </div>
                      
                      {/* ACCIONES: EDITAR / BORRAR */}
                      <div className="flex gap-2">
                        <Link 
                          href={`/admin/editar-producto/${product.id}`}
                          className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-black hover:text-white transition-all text-center flex items-center justify-center gap-1"
                        >
                          ✏️ Editar
                        </Link>
                        
                        <button 
                           onClick={() => deleteProduct(product.id)}
                           className="w-10 py-2.5 border border-red-100 bg-red-50 text-red-500 rounded-xl text-xs font-bold hover:bg-red-500 hover:text-white transition-all"
                           title="Eliminar producto"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}