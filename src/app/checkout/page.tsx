"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// ... (Mantén tu const comunasPorRegion igual, no la borres)
const comunasPorRegion: Record<string, string[]> = {
  "XV": ["Arica", "Camarones", "Putre", "General Lagos"],
  "I": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"],
  "II": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"],
  "III": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"],
  "IV": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"],
  "V": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"],
  "RM": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Santiago", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"],
  "VI": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"],
  "VII": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"],
  "XVI": ["Chillán", "Bulnes", "Chillán Viejo", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Quirihue", "Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Ránquil", "Trehuaco", "San Carlos", "Coihueco", "Ñiquén", "San Fabián", "San Nicolás"],
  "VIII": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curaulahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"],
  "IX": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"],
  "XIV": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"],
  "X": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"],
  "XI": ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"],
  "XII": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
};

export default function CheckoutPage() {
  const { cart, total } = useCart();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Estados del Formulario
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    region: "",
    phone: "",
  });

  // Cargar usuario
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFormData(prev => ({ ...prev, email: user.email || "" }));
      }
    };
    getUser();
  }, []);

  // Redirigir si carrito vacío
  useEffect(() => {
    if (cart.length === 0) {
      router.push("/carrito");
    }
  }, [cart, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si cambia la región, reseteamos la ciudad para obligar a elegir una válida
    if (name === "region") {
      setFormData((prev) => ({ 
        ...prev, 
        [name]: value,
        city: "" // Borramos la ciudad anterior
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        toast.error("Por favor inicia sesión para continuar");
        router.push("/login?redirect=/checkout");
        return;
      }

      // 🟢 PASO 1: Guardar la cabecera de la orden
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total: total,
          status: "pending",
          shipping_address: `${formData.address}, ${formData.apartment}, ${formData.city}, ${formData.region}`,
          contact_phone: formData.phone,
          // NOTA: Ya no enviamos "items" aquí porque van en su propia tabla
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 🟢 PASO 2: Guardar CADA producto en la tabla "order_items"
      // Preparamos los datos para insertarlos todos de una vez (Bulk Insert)
      const orderItems = cart.map((item) => ({
        order_id: orderData.id,    // El ID de la orden que acabamos de crear
        product_id: item.id,       // El ID del producto
        quantity: 1,               // Cantidad (si tu carrito soporta más, usa item.quantity)
        price: item.price          // Guardamos el precio al momento de la compra
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 🔵 PASO 3: Iniciar Webpay
      toast.info("Conectando con Webpay...");

      const response = await fetch("/api/webpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          orderId: orderData.id, 
          returnUrl: `${window.location.origin}/webpay/return`, 
          finalUrl: `${window.location.origin}/webpay/final`    
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al conectar con Webpay");
      }

      // Redirección Automática
      const form = document.createElement("form");
      form.action = result.url;
      form.method = "POST";

      const tokenInput = document.createElement("input");
      tokenInput.type = "hidden";
      tokenInput.name = "token_ws";
      tokenInput.value = result.token;

      form.appendChild(tokenInput);
      document.body.appendChild(form);
      
      form.submit(); 

    } catch (error: any) {
      console.error(error);
      toast.error("Error: " + error.message);
      setLoading(false);
    }
  };

  if (cart.length === 0) return null; 

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Encabezado */}
        <div className="flex items-center justify-center mb-10">
           <span className="text-sm font-bold text-gray-400">Carrito</span>
           <span className="mx-4 text-gray-300">/</span>
           <span className="text-sm font-bold text-black">Checkout</span>
           <span className="mx-4 text-gray-300">/</span>
           <span className="text-sm font-bold text-gray-400">Pago</span>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* COLUMNA IZQUIERDA: Formulario */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Sección Contacto */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6">Información de Contacto</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:bg-white transition-all outline-none"
                    placeholder="+56 9 1234 5678"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Sección Dirección */}
            <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-black text-gray-900 mb-6">Dirección de Envío</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                  <input type="text" name="firstName" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" required />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apellido</label>
                  <input type="text" name="lastName" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" required />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dirección (Calle y Número)</label>
                  <input type="text" name="address" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" placeholder="Av. Providencia 1234" required />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Depto / Oficina (Opcional)</label>
                  <input type="text" name="apartment" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" placeholder="Torre B, Depto 204" />
                </div>

                {/* SELECTOR DE REGIONES (Todo Chile) */}
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Región</label>
                  <select name="region" onChange={handleInputChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none" required>
                    <option value="">Seleccionar...</option>
                    <option value="XV">Arica y Parinacota</option>
                    <option value="I">Tarapacá</option>
                    <option value="II">Antofagasta</option>
                    <option value="III">Atacama</option>
                    <option value="IV">Coquimbo</option>
                    <option value="V">Valparaíso</option>
                    <option value="RM">Metropolitana</option>
                    <option value="VI">O'Higgins</option>
                    <option value="VII">Maule</option>
                    <option value="XVI">Ñuble</option>
                    <option value="VIII">Biobío</option>
                    <option value="IX">Araucanía</option>
                    <option value="XIV">Los Ríos</option>
                    <option value="X">Los Lagos</option>
                    <option value="XI">Aysén</option>
                    <option value="XII">Magallanes</option>
                  </select>
                </div>

                {/* SELECTOR DE COMUNAS (Dinámico) */}
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Ciudad / Comuna</label>
                  <select 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none disabled:bg-gray-100 disabled:text-gray-400" 
                    required
                    disabled={!formData.region}
                  >
                    <option value="">Seleccionar...</option>
                    {formData.region && comunasPorRegion[formData.region]?.map((comuna) => (
                      <option key={comuna} value={comuna}>
                        {comuna}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </section>

             <button 
                type="submit" 
                disabled={loading}
                className="lg:hidden w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg disabled:opacity-50"
              >
                {loading ? "Procesando..." : "Ir a Pagar"}
              </button>
          </div>

          {/* COLUMNA DERECHA: Resumen */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 lg:sticky lg:top-24">
              <h3 className="text-xl font-black text-gray-900 mb-6">Resumen del Pedido</h3>
              
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="relative h-16 w-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                      <img src={item.image || "/placeholder.png"} alt={item.title} className="object-cover w-full h-full" />
                      <span className="absolute top-0 right-0 bg-gray-500 text-white text-[10px] px-1.5 py-0.5 rounded-bl-lg font-bold">x1</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.title}</p>
                      <p className="text-sm text-gray-500">${item.price.toLocaleString("es-CL")}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString("es-CL")}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-bold">Gratis</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100 mb-8">
                <span className="text-lg font-bold text-gray-900">Total a pagar</span>
                <span className="text-3xl font-black text-gray-900">${total.toLocaleString("es-CL")}</span>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Conectando Webpay...
                  </span>
                ) : (
                  "Ir a Pagar"
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs">
                 <span>🔒 Pago seguro vía Webpay</span>
              </div>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
}