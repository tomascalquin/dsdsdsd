export default function TerminosPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto prose prose-blue">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Términos y Condiciones</h1>
        
        <p className="text-gray-500 mb-6">Última actualización: Enero 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">1. General</h2>
          <p className="text-gray-600">
            Bienvenido a <strong>DropsC Store</strong>. Al comprar en nuestro sitio, aceptas estos términos. 
            Nos reservamos el derecho de modificar precios y stock sin previo aviso.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">2. Envíos y Despachos</h2>
          <p className="text-gray-600">
            Realizamos envíos a todo Chile a través de couriers externos. Los tiempos de entrega son estimados:
          </p>
          <ul className="list-disc pl-5 text-gray-600 mt-2 space-y-1">
            <li><strong>Región Metropolitana:</strong> 2 a 4 días hábiles.</li>
            <li><strong>Otras Regiones:</strong> 3 a 7 días hábiles (dependiendo de la zona).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">3. Pagos</h2>
          <p className="text-gray-600">
            Utilizamos <strong>Webpay Plus</strong> (Transbank) para procesar pagos de forma segura. 
            No guardamos los datos de tu tarjeta. Tu pedido se procesará una vez confirmado el pago.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">4. Cambios y Devoluciones (Garantía Legal)</h2>
          <p className="text-gray-600">
            Según la Ley del Consumidor en Chile, tienes derecho a la <strong>Garantía Legal (6x3)</strong>. 
            Si el producto viene con fallas de fábrica, tienes 6 meses para pedir:
          </p>
          <ul className="list-disc pl-5 text-gray-600 mt-2 space-y-1">
            <li>Cambio del producto.</li>
            <li>Reparación gratuita.</li>
            <li>Devolución del dinero.</li>
          </ul>
          <p className="text-gray-600 mt-4 text-sm italic">
            *No aplica por gusto personal o talla incorrecta (derecho a retracto), salvo que se indique expresamente lo contrario en la descripción del producto.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">5. Privacidad</h2>
          <p className="text-gray-600">
            Tus datos personales (nombre, dirección, teléfono) son confidenciales y solo se usan para procesar tu envío.
          </p>
        </section>
      </div>
    </div>
  );
}