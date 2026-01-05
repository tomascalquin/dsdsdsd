"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setOrders(data)
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: string) {
    await supabase.from('orders').update({ status: newStatus }).eq('id', id)
    fetchOrders()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando panel...</div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-black">
      {/* HEADER DEL ADMIN */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-black">Panel de Control</h1>
           <p className="text-gray-500">Gestiona tus pedidos y productos</p>
        </div>
        
        {/* BOTÓN PARA AGREGAR PRODUCTO */}
        <Link 
          href="/admin/agregar-producto" 
          className="bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <span>+</span> Agregar Nuevo Producto
        </Link>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
           <h2 className="font-bold text-xl">Últimos Pedidos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4">Cliente</th>
                <th className="p-4">Contacto</th>
                <th className="p-4">Total</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{order.customer_name || "Anónimo"}</p>
                    <p className="text-xs text-gray-500">{order.address}, {order.city}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{order.customer_email}</p>
                    <p className="text-sm text-gray-500">{order.phone}</p>
                  </td>
                  <td className="p-4 font-mono font-bold">
                    ${order.total?.toLocaleString('es-CL')}
                  </td>
                  <td className="p-4">
                    <select 
                      value={order.status} 
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={`text-xs font-bold px-2 py-1 rounded-full border-0 cursor-pointer ${
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
                        <a href={`https://wa.me/${order.phone}`} target="_blank" className="text-green-600 hover:underline text-sm font-bold flex items-center gap-1">
                          WhatsApp ↗
                        </a>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
             <div className="p-10 text-center text-gray-400">No hay pedidos aún.</div>
          )}
        </div>
      </div>
    </div>
  )
}