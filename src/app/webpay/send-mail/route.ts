import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import OrderReceipt from '@/emails/OrderReceipt'; // Importamos la plantilla

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, orderId, total, items, customerName } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'DropsC Store <onboarding@resend.dev>', // Cambia esto cuando verifiques tu dominio en Resend
      to: [email],
      subject: `Confirmación de pedido #${orderId}`,
      // AQUÍ OCURRE LA MAGIA: Usamos 'react' en lugar de 'html'
      react: OrderReceipt({ 
        orderId, 
        total, 
        items, 
        customerName: customerName || "Cliente" 
      }),
    });

    if (error) {
      console.error("Error enviando email:", error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error en API send-mail:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}