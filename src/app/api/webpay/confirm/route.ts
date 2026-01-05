import { NextRequest, NextResponse } from 'next/server';
import { webPayService } from '@/lib/webpay';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    // 1. Validaciones básicas
    if (!token) {
      return NextResponse.json({ error: 'Token es requerido' }, { status: 400 });
    }

    // 2. Confirmar transacción con Transbank
    // Esto "cierra" la venta en el banco. Si no se hace, se anula el pago.
    const result = await webPayService.confirmTransaction({ token });

    if (result.error) {
      // Si Transbank dice error, marcamos la orden como fallida en BD (opcional)
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // 3. Verificar si el pago fue APROBADO
    // status puede ser 'AUTHORIZED', 'FAILED', 'REJECTED', etc.
    if (result.status === 'AUTHORIZED') {
      
      // 4. Actualizar estado del pedido en Supabase
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'pagado',          // Estado para tu panel admin
          payment_status: 'paid',    // Estado interno de pago
          payment_method: 'webpay',
          // Opcional: Podrías guardar las últimas 4 cifras si Transbank las devolviera en el result
        })
        .eq('order_id', result.orderId); // Buscamos por el ID de orden que generamos (ej: ORDER_123...)

      if (updateError) {
        console.error("Error actualizando Supabase:", updateError);
        // No fallamos la request porque el pago en el banco SÍ se hizo, solo falló nuestra BD
      }
    } else {
      // Si el pago fue rechazado por el banco
      await supabase
        .from('orders')
        .update({ status: 'rechazado', payment_status: 'rejected' })
        .eq('order_id', result.orderId);
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error en API WebPay Confirm:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al confirmar pago' },
      { status: 500 }
    );
  }
}