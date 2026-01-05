"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import Image from 'next/image';

export default function AgregarProducto() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // ESTADOS PARA ARCHIVOS Y PREVIEWS
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainPreview, setMainPreview] = useState<string>("");

  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  const [videoFile, setVideoFile] = useState<File | null>(null);

  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stock: '10',
    category: 'Tecnología',
    slug: '',
    description: ''
  });

  // --- MANEJADORES DE ARCHIVOS ---

  // 1. Imagen Principal
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMainImage(file);
      setMainPreview(URL.createObjectURL(file)); // Crear preview local
    }
  };

  // 2. Galería (Múltiples imágenes)
  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setGalleryImages(prev => [...prev, ...newFiles]); // Agregar a las existentes
      
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Función para quitar una imagen de la galería seleccionada
  const removeGalleryImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // 3. Video
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setVideoFile(file);
  };

  // Limpiar memoria de previews al desmontar
  useEffect(() => {
    return () => {
      if (mainPreview) URL.revokeObjectURL(mainPreview);
      galleryPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [mainPreview, galleryPreviews]);


  // --- FUNCIÓN DE SUBIDA A SUPABASE STORAGE ---
  const uploadFile = async (file: File, pathPrefix: string = "") => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${pathPrefix}${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;
    
    const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
    return publicUrl;
  };


  // --- ENVÍO DEL FORMULARIO ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainImage) {
      toast.error("Debes seleccionar una imagen principal");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Creando producto y subiendo archivos...");

    try {
      // 1. Insertar Producto en BD
      const slugLimpio = formData.slug.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          category: formData.category,
          slug: slugLimpio,
          description: formData.description
        })
        .select()
        .single();

      if (productError) throw productError;
      const productId = product.id;

      // 2. Subir Imagen Principal (is_primary: true)
      const mainUrl = await uploadFile(mainImage, "main_");
      await supabase.from('product_images').insert({
        product_id: productId, url: mainUrl, is_primary: true, media_type: 'image'
      });

      // 3. Subir Galería (En paralelo para rapidez)
      if (galleryImages.length > 0) {
        await Promise.all(galleryImages.map(async (file) => {
          const url = await uploadFile(file, "gallery_");
          return supabase.from('product_images').insert({
            product_id: productId, url: url, is_primary: false, media_type: 'image'
          });
        }));
      }

      // 4. Subir Video (Opcional)
      if (videoFile) {
        const videoUrl = await uploadFile(videoFile, "video_");
        await supabase.from('product_images').insert({
          product_id: productId, url: videoUrl, is_primary: false, media_type: 'video'
        });
      }

      toast.dismiss(toastId);
      toast.success("¡Producto publicado exitosamente!");
      router.push('/admin');

    } catch (error: any) {
      console.error(error);
      toast.dismiss(toastId);
      toast.error("Error al crear producto", { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100">
        
        <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Nuevo Producto</h1>
            <p className="text-gray-500 mt-1">Completa la información y sube la multimedia.</p>
          </div>
          <Link href="/admin" className="px-4 py-2 rounded-xl bg-gray-100 font-bold text-gray-600 hover:bg-gray-200 transition-colors">
            Cancelar
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* COLUMNA IZQUIERDA: DATOS */}
            <div className="space-y-6">
              <div>
                <label className="label-admin">Nombre del Producto</label>
                <input type="text" required className="input-admin"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-admin">Precio ($CLP)</label>
                  <input type="number" required className="input-admin"
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="label-admin">Stock Inicial</label>
                  <input type="number" required className="input-admin"
                    value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="label-admin">Categoría</label>
                  <select className="input-admin appearance-none cursor-pointer bg-[url('/chevron-down.svg')] bg-no-repeat bg-[center_right_1rem]"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Hogar">Hogar</option>
                    <option value="Moda">Moda</option>
                    <option value="Juguetes">Juguetes</option>
                    <option value="Belleza">Belleza</option>
                  </select>
                </div>
                <div>
                  <label className="label-admin">Slug (URL amigable)</label>
                  <input type="text" required placeholder="ej: audifonos-bluetooth-pro" className="input-admin font-mono text-sm"
                    value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="label-admin">Descripción Detallada</label>
                <textarea required rows={5} className="input-admin resize-none"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
            </div>

            {/* COLUMNA DERECHA: MULTIMEDIA */}
            <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-200/50">
              
              {/* 1. FOTO PRINCIPAL */}
              <div>
                <label className="label-admin mb-3 block">📸 Foto Principal (Portada)</label>
                
                <label className={`cursor-pointer flex flex-col items-center justify-center h-48 border-3 border-dashed rounded-2xl transition-all hover:bg-gray-100 group overflow-hidden relative ${mainPreview ? 'border-orange-500 bg-orange-50/30' : 'border-gray-300'}`}>
                  {mainPreview ? (
                    <Image src={mainPreview} alt="Preview" fill className="object-cover" />
                  ) : (
                     <div className="text-center text-gray-400 group-hover:text-gray-600">
                       <span className="text-4xl block mb-2">+</span>
                       <span className="font-bold text-sm">Click para subir portada</span>
                     </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleMainImageChange} className="hidden" />
                  {mainPreview && <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold">Cambiar Imagen</div>}
                </label>
              </div>

              {/* 2. GALERÍA CARRUSEL */}
              <div>
                <label className="label-admin mb-3 flex justify-between items-center">
                   <span>🎞️ Carrusel de Fotos (Opcional)</span>
                   <span className="text-[10px] bg-gray-200 px-2 py-1 rounded-full text-gray-600">{galleryImages.length} seleccionadas</span>
                </label>

                 {/* Grid de Previews */}
                 {galleryPreviews.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {galleryPreviews.map((src, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                        <Image src={src} alt="Gallery" fill className="object-cover" />
                        <button type="button" onClick={() => removeGalleryImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                      </div>
                    ))}
                  </div>
                 )}
                
                <label className="cursor-pointer block w-full p-3 text-center border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-all font-bold text-sm text-gray-500">
                  Agregar más fotos al carrusel
                  <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
                </label>
              </div>

              {/* 3. VIDEO */}
              <div>
                <label className="label-admin mb-3 block">🎥 Video Demostrativo (Opcional)</label>
                 <label className={`cursor-pointer flex items-center gap-4 p-4 border-2 border-dashed rounded-2xl transition-all hover:bg-purple-50 group ${videoFile ? 'border-purple-500 bg-purple-50/50' : 'border-gray-300'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${videoFile ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-400 group-hover:text-gray-600'}`}>
                      ▶
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <span className="font-bold text-sm block truncate">{videoFile ? videoFile.name : "Subir archivo de video"}</span>
                       <span className="text-xs text-gray-500">{videoFile ? "Listo para subir" : "MP4, WebM (Máx 50MB recomendado)"}</span>
                    </div>
                  <input type="file" accept="video/*" onChange={handleVideoChange} className="hidden" />
                </label>
              </div>

            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button type="submit" disabled={loading || !mainImage} className="w-full bg-black text-white py-5 rounded-2xl font-black text-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-black/10 hover:shadow-black/20 transform hover:-translate-y-1">
              {loading ? "✨ Publicando Producto..." : "Publicar Producto Ahora 🚀"}
            </button>
             <p className="text-center text-gray-400 text-xs mt-4">Asegúrate de que toda la información sea correcta antes de publicar.</p>
          </div>
        </form>
      </div>
      
      {/* Estilos rápidos para inputs */}
      <style jsx>{`
        .label-admin {
          @apply block text-xs font-bold uppercase text-gray-500 mb-2 tracking-wider;
        }
        .input-admin {
          @apply w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl outline-none focus:border-black focus:bg-white transition-all font-medium text-gray-900;
        }
      `}</style>
    </div>
  );
}