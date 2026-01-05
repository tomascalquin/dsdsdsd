"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function WebPayReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processWebPayReturn = async () => {
      try {
        const token_ws = searchParams.get('token_ws');
        
        if (!token_ws) {
          throw new Error('Token no proporcionado');
        }

        // Confirmar transacción con WebPay
        const response = await fetch('/api/webpay/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token_ws }),
        });

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Buscar la orden por el token de WebPay
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('webpay_token', token_ws)
          .single();

        if (orderError || !order) {
          throw new Error('Orden no encontrada');
        }

        // Actualizar estado de la orden
        const status = data.status === 'AUTHORIZED' ? 'pagado' : 'rechazado';
        
        await supabase
          .from('orders')
          .update({
            status: status,
            webpay_status: data.status,
            webpay_amount: data.amount,
            webpay_transaction_date: data.transactionDate
          })
          .eq('id', order.id);

        // Redirigir según el resultado
        if (data.status === 'AUTHORIZED') {
          router.push('/gracias?webpay=success');
        } else {
          router.push('/carrito?webpay=failed');
        }

      } catch (error: any) {
        console.error('Error procesando retorno WebPay:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    processWebPayReturn();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Procesando tu pago...</p>
          <p className="text-sm text-gray-400 mt-2">Por favor espera, no cierres esta ventana</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Error en el Proceso</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => router.push('/carrito')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
          >
            Volver al Carrito
          </button>
        </div>
      </div>
    );
  }

  return null;
}