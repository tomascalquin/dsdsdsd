import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0f1115] text-gray-400 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm">
        
        {/* COLUMNA 1: MARCA */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white font-black text-xl">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-black">dC</div>
            dropsC
          </div>
          <p className="leading-relaxed">
            Expertos en tendencias virales y productos de alta calidad. Llevamos lo extraordinario a tu puerta.
          </p>
          <div className="flex gap-4 pt-2">
            {/* Redes Sociales Falsas (Pon las tuyas) */}
            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">Ig</a>
            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">Fb</a>
            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all">Tk</a>
          </div>
        </div>

        {/* COLUMNA 2: ENLACES RÁPIDOS */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Tienda</h3>
          <ul className="space-y-3">
            <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
            <li><Link href="/#catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
            <li><Link href="/carrito" className="hover:text-white transition-colors">Carrito</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Mi Cuenta</Link></li>
          </ul>
        </div>

        {/* COLUMNA 3: LEGALES (Clave para confianza) */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Legal</h3>
          <ul className="space-y-3">
            <li><Link href="/terminos" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
            <li><Link href="/privacidad" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
            <li><Link href="/envios" className="hover:text-white transition-colors">Políticas de Envío</Link></li>
            <li><Link href="/devoluciones" className="hover:text-white transition-colors">Cambios y Devoluciones</Link></li>
          </ul>
        </div>

        {/* COLUMNA 4: CONTACTO */}
        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Contacto</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span>📍</span> Santiago, Chile
            </li>
            <li className="flex gap-3">
              <span>📧</span> contacto@dropsc.store
            </li>
            <li className="flex gap-3">
              <span>📱</span> +56 9 6612 8934 
            </li>
          </ul>
        </div>

      </div>
      
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2026 dropsC. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <span>Visa</span>
          <span>Mastercard</span>
          <span>WebPay</span>
        </div>
      </div>
    </footer>
  );
}