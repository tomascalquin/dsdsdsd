"use client"
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

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

  if (loading) return <p className="p-10 text-center">Cargando pedidos...</p>

  return (
    <div className="p-6 bg-white min-h-screen text-black">
      <h1 className="text-3xl font-bold mb-6">Pedidos por Procesar (AliExpress)</h1>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Producto</th>
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Dirección / Ciudad</th>
              <th className="border p-2">WhatsApp</th>
              <th className="border p-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-sm">
                <td className="border p-2 font-medium">{order.product_name}</td>
                <td className="border p-2">{order.customer_name}</td>
                <td className="border p-2 text-xs">
                  {order.address}, {order.city}
                  <button 
                    onClick={() => navigator.clipboard.writeText(`${order.customer_name}, ${order.address}, ${order.city}`)}
                    className="ml-2 text-blue-500 underline"
                  >
                    Copiar
                  </button>
                </td>
                <td className="border p-2">
                  <a href={`https://wa.me/${order.phone}`} target="_blank" className="text-green-600 font-bold">
                    Chat
                  </a>
                </td>
                <td className="border p-2">
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="pagado">Pagado</option>
                    <option value="comprado_ali">Comprado en Ali</option>
                    <option value="enviado">Enviado al Cliente</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}