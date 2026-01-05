"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'pedidos' | 'productos'>('pedidos')
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Cargar datos según la pestaña activa
  useEffect(() => {
    fetchData()
  }, [activeTab])

  async function fetchData() {
    setLoading(true)
    if (activeTab === 'pedidos') {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      if (data) setOrders(data)
    } else {
      const { data } = await supabase
        .from('products')
        .select('*, product_images(url)')
        .order('created_at', { ascending: false })
      if (data) setProducts(data)
    }
    setLoading(false)
  }

  // Función para actualizar estado del pedido
  async function updateStatus(id: string, newStatus: string) {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    fetchData()
  }

  // --- FUNCIÓN PARA ELIMINAR PRODUCTO ---
  async function deleteProduct(id: number) {
    if (!confirm("⚠️ ¿Estás seguro de eliminar este producto? Esta acción borrará el producto y no se puede deshacer.")) {
      return;
    }

    try {
      // Al borrar el producto, Supabase borrará automáticamente las imágenes asociadas en la BD
      // gracias a la regla "ON DELETE CASCADE" que configuramos antes.
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert("Producto eliminado correctamente");
      fetchData(); // Refrescar la lista

    } catch (error: any) {
      alert("Error al eliminar: " + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
             <h1 className="text-3xl font-black">Panel de Control</h1>
             <p className="text-gray-500">Administra tu tienda</p>
          </div>
          <Link 
            href="/admin/agregar-producto" 
            className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg"
          >
            <span>+</span> Nuevo Producto
          </Link>
        </div>

        {/* PESTAÑAS */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`pb-3 px-4 font-bold text-sm transition-all ${
              activeTab === 'pedidos' 
                ? 'text-orange-600 border-b-2 border-orange-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            📦 PEDIDOS ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('productos')}
            className={`pb-3 px-4 font-bold text-sm transition-all ${
              activeTab === 'productos' 
                ? 'text-orange-600 border-b-2 border-orange-600' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            🛍️ MIS PRODUCTOS ({products.length})
          </button>
        </div>

        {/* CONTENIDO */}
        {loading ? (
          <div className="py-20 text-center text-gray-400">Cargando datos...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* --- TABLA DE PEDIDOS --- */}
            {activeTab === 'pedidos' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Orden ID</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-mono text-xs text-gray-500">
                          {order.order_id || order.id.slice(0,8)}
                        </td>
                        <td className="p-4">
                          <p className="font-bold">{order.customer_name || "Invitado"}</p>
                          <p className="text-xs text-gray-500">{order.customer_email}</p>
                        </td>
                        <td className="p-4 font-bold">
                          ${order.total?.toLocaleString('es-CL')}
                        </td>
                        <td className="p-4">
                          <select 
                            value={order.status} 
                            onChange={(e) => updateStatus(order.id, e.target.value)}
                            className={`text-xs font-bold px-3 py-1 rounded-full border-0 cursor-pointer outline-none ${
                              order.status === 'pagado' ? 'bg-green-100 text-green-700' :
                              order.status === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <option value="pendiente">Pendiente</option>
                            <option value="pagado">Pagado</option>
                            <option value="enviado">Enviado</option>
                          </select>
                        </td>
                        <td className="p-4">
                           {order.phone && (
                              <a href={`https://wa.me/${order.phone}`} target="_blank" className="text-green-600 text-sm font-bold hover:underline">
                                WhatsApp ↗
                              </a>
                           )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && <div className="p-10 text-center text-gray-400">No hay pedidos aún.</div>}
              </div>
            )}

            {/* --- LISTA DE PRODUCTOS (NUEVO) --- */}
            {activeTab === 'productos' && (
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden group hover:shadow-lg transition-all bg-white">
                    <div className="relative aspect-square bg-gray-100">
                      <img 
                        src={product.product_images?.[0]?.url || "/placeholder.png"} 
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button 
                           onClick={() => deleteProduct(product.id)}
                           className="bg-white text-red-600 p-2 rounded-full shadow-md hover:bg-red-50"
                           title="Eliminar producto"
                         >
                           🗑️
                         </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm truncate">{product.title}</h3>
                      <p className="text-gray-500 text-sm mb-3">${product.price?.toLocaleString('es-CL')}</p>
                      
                      <button 
                         onClick={() => deleteProduct(product.id)}
                         className="w-full py-2 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
                {products.length === 0 && (
                  <div className="col-span-full py-20 text-center text-gray-400">
                    No tienes productos. ¡Agrega uno arriba!
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  )
}