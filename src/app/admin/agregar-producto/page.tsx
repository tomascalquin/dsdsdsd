"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AgregarProducto() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Estados para archivos
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    slug: '',
    description: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'image') setImageFile(e.target.files[0]);
      if (type === 'video') setVideoFile(e.target.files[0]);
    }
  };

  // Función auxiliar para subir archivos al Storage
  const uploadFile = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!imageFile) throw new Error("La imagen principal es obligatoria");

      // 1. CREAR PRODUCTO
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          price: parseFloat(formData.price),
          slug: formData.slug.toLowerCase().replace(/ /g, '-'),
          description: formData.description
        })
        .select()
        .single();

      if (productError) throw productError;

      // 2. SUBIR Y GUARDAR FOTO PRINCIPAL
      const imageUrl = await uploadFile(imageFile);
      await supabase.from('product_images').insert({
        product_id: product.id,
        url: imageUrl,
        is_primary: true,
        media_type: 'image' // <--- Marcamos como imagen
      });

      // 3. SUBIR VIDEO (Si existe)
      if (videoFile) {
        const videoUrl = await uploadFile(videoFile);
        await supabase.from('product_images').insert({
          product_id: product.id,
          url: videoUrl,
          is_primary: false,
          media_type: 'video' // <--- Marcamos como video
        });
      }

      alert("¡Producto y video subidos con éxito!");
      router.push('/admin');

    } catch (error: any) {
      console.error(error);
      alert("Error: " + (error.message || "Error desconocido"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black">Nuevo Producto Multimedia</h1>
          <Link href="/admin" className="text-sm font-bold text-gray-400 hover:text-black">Cancelar</Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* DATOS BÁSICOS */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nombre</label>
              <input 
                type="text" required
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                placeholder="Ej: Drone 4K Profesional"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Precio</label>
                <input 
                  type="number" required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                  placeholder="99990"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Slug (URL)</label>
                <input 
                  type="text" required
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                  placeholder="drone-4k"
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Descripción</label>
              <textarea 
                required rows={4}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-black outline-none transition-all"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 my-6"></div>

          {/* ZONA MULTIMEDIA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* INPUT IMAGEN */}
            <div className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all ${imageFile ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-black'}`}>
              <label className="cursor-pointer block">
                <span className="text-2xl block mb-2">📸</span>
                <span className="font-bold text-sm block">{imageFile ? "Imagen Seleccionada" : "Subir Portada"}</span>
                <span className="text-xs text-gray-400 block mt-1">(Obligatorio)</span>
                <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, 'image')} className="hidden" />
              </label>
            </div>

            {/* INPUT VIDEO */}
            <div className={`p-6 rounded-2xl border-2 border-dashed text-center transition-all ${videoFile ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-purple-500'}`}>
              <label className="cursor-pointer block">
                <span className="text-2xl block mb-2">🎥</span>
                <span className="font-bold text-sm block">{videoFile ? "Video Seleccionado" : "Subir Video"}</span>
                <span className="text-xs text-gray-400 block mt-1">(Opcional .mp4)</span>
                <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, 'video')} className="hidden" />
              </label>
            </div>

          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "Subiendo Archivos..." : "Publicar Producto"}
          </button>
        </form>
      </div>
    </div>
  );
}