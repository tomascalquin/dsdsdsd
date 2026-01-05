"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Link from "next/link";

export default function ProductReviews({ productId }: { productId: number }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  async function fetchReviews() {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    
    if (data) setReviews(data);
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);

    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      user_id: user.id,
      user_name: user.email?.split("@")[0], // Usamos la parte inicial del correo como nombre
      rating,
      comment
    });

    if (error) {
      toast.error("Error al publicar reseña");
    } else {
      toast.success("¡Gracias por tu opinión!");
      setComment("");
      setRating(5);
      fetchReviews(); // Recargar reseñas
    }
    setSubmitting(false);
  }

  // Calcular promedio
  const average = reviews.length 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mt-12">
      <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
        Opiniones de Clientes
        <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-500">
          ⭐ {average} ({reviews.length})
        </span>
      </h3>

      {/* LISTA DE RESEÑAS */}
      <div className="space-y-6 mb-10 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <p className="text-gray-400">Cargando opiniones...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-400 italic">Sé el primero en opinar sobre este producto.</p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-sm">{rev.user_name}</p>
                  <div className="flex text-yellow-400 text-xs">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < rev.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{rev.comment}</p>
            </div>
          ))
        )}
      </div>

      {/* FORMULARIO */}
      {user ? (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-sm mb-4">Escribe una reseña</h4>
          
          <div className="mb-4">
            <label className="block text-xs font-bold uppercase text-gray-400 mb-2">Calificación</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <textarea
            required
            placeholder="¿Qué te pareció el producto?"
            className="w-full p-3 rounded-xl border border-gray-200 text-sm mb-4 focus:ring-2 focus:ring-black outline-none"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button 
            type="submit" 
            disabled={submitting}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {submitting ? "Publicando..." : "Enviar Opinión"}
          </button>
        </form>
      ) : (
        <div className="bg-gray-50 p-6 rounded-2xl text-center border border-dashed border-gray-300">
          <p className="text-sm text-gray-500 mb-3">Debes iniciar sesión para escribir una reseña.</p>
          <Link href="/login" className="text-black font-bold underline hover:text-orange-500">
            Ingresar ahora
          </Link>
        </div>
      )}
    </div>
  );
}