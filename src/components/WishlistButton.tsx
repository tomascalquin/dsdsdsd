"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function WishlistButton({ productId }: { productId: number }) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (user) checkWishlist();
  }, [user]);

  async function checkWishlist() {
    const { data } = await supabase
      .from("wishlist")
      .select("id")
      .eq("user_id", user?.id)
      .eq("product_id", productId)
      .maybeSingle();
    
    if (data) setIsLiked(true);
  }

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault(); // Evita que se abra el link del producto
    e.stopPropagation();

    if (!user) {
      toast.error("Debes iniciar sesión para guardar favoritos");
      return;
    }

    if (isLiked) {
      // Borrar
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      if (!error) {
        setIsLiked(false);
        toast.success("Eliminado de favoritos");
      }
    } else {
      // Agregar
      const { error } = await supabase
        .from("wishlist")
        .insert({ user_id: user.id, product_id: productId });
      if (!error) {
        setIsLiked(true);
        toast.success("¡Guardado en favoritos!");
      }
    }
  }

  return (
    <button
      onClick={toggleWishlist}
      className={`p-2 rounded-full transition-all shadow-sm hover:scale-110 ${
        isLiked ? "bg-red-50 text-red-500" : "bg-white text-gray-400 hover:text-red-500"
      }`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}