"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation'; // Ojo: importar useParams si es necesario, pero en Next 13+ page props traen params
import Link from 'next/link';
import { toast } from 'sonner';
import { use } from 'react'; // Necesario para desenrollar params en Next.js 15

export default function EditarProducto({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  // Desempaquetamos los params (Next.js 15 requiere await o use)
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stock: '',
    category: 'Tecnología',
    slug: '',
    description: ''
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  async function fetchProduct() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      toast.error("Error al cargar producto");
      router.push('/admin');
      return;
    }

    setFormData({
      title: data.title,
      price: data.price.toString(),
      stock: data.stock.toString(),
      category: data.category || 'Tecnología',
      slug: data.slug,
      description: data.description
    });
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const toastId = toast.loading("Actualizando...");

    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: formData.title,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          category: formData.category,
          slug: formData.slug,
          description: formData.description
        })
        .eq('id', productId);

      if (error) throw error;

      toast.dismiss(toastId);
      toast.success("Producto actualizado correctamente");
      router.push('/admin');
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error("Error al guardar", { description: error.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Editar Producto</h1>
            <p className="text-gray-500 mt-1">Modificando ID: {productId}</p>
          </div>
          <Link href="/admin" className="px-4 py-2 rounded-xl bg-gray-100 font-bold text-gray-600 hover:bg-gray-200 transition-colors">
            Cancelar
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="label-admin">Nombre del Producto</label>
            <input type="text" required className="input-admin"
              value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-admin">Precio ($)</label>
              <input type="number" required className="input-admin"
                value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="label-admin">Stock</label>
              <input type="number" required className="input-admin"
                value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
              <div>
              <label className="label-admin">Categoría</label>
              <select className="input-admin cursor-pointer"
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="Tecnología">Tecnología</option>
                <option value="Hogar">Hogar</option>
                <option value="Moda">Moda</option>
                <option value="Juguetes">Juguetes</option>
                <option value="Belleza">Belleza</option>
              </select>
            </div>
            <div>
              <label className="label-admin">Slug</label>
              <input type="text" required className="input-admin"
                value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="label-admin">Descripción</label>
            <textarea required rows={5} className="input-admin"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button type="submit" disabled={saving} className="w-full bg-black text-white py-4 rounded-2xl font-black text-lg hover:bg-gray-900 disabled:opacity-50 transition-all">
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .label-admin { @apply block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider; }
        .input-admin { @apply w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-black focus:bg-white transition-all font-medium text-gray-900; }
      `}</style>
    </div>
  );
}