import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, orderId, total, items } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Cantarita Store <onboarding@resend.dev>', // Usa este email de prueba por ahora
      to: [email], // En modo prueba solo puedes enviarte a ti mismo (el email con el que te registraste en Resend)
      subject: `Confirmación de Compra #${orderId}`,
      html: `
        <h1>¡Gracias por tu compra!</h1>
        <p>Tu pedido <strong>${orderId}</strong> ha sido recibido exitosamente.</p>
        <p>Total pagado: <strong>$${total.toLocaleString('es-CL')}</strong></p>
        <hr />
        <h3>Detalle:</h3>
        <ul>
          ${items.map((item: any) => `<li>${item.title} x${item.quantity}</li>`).join('')}
        </ul>
      `,
    });

    if (error) return NextResponse.json({ error }, { status: 500 });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}