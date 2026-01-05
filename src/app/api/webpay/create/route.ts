import { NextRequest, NextResponse } from 'next/server';
import { webPayService } from '@/lib/webpay';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, orderId, returnUrl, finalUrl } = body;

    // Validar datos de entrada
    if (!amount || !orderId || !returnUrl || !finalUrl) {
      return NextResponse.json(
        { error: 'Faltan datos requeridos para la transacción' },
        { status: 400 }
      );
    }

    // Validar monto
    if (amount <= 0) {
      return NextResponse.json(
        { error: 'El monto debe ser mayor a 0' },
        { status: 400 }
      );
    }

    // Crear transacción WebPay
    const result = await webPayService.createTransaction({
      amount,
      orderId,
      returnUrl,
      finalUrl
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Error en API WebPay Create:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}