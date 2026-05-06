"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, ShoppingCart, ChevronRight, CheckCircle2, Info } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    category: string;
    location: string;
    seller_name: string;
    seller_id?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { user } = useUser();

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      alert("Veuillez vous connecter pour acheter.");
      return;
    }

    try {
      // Simulate purchase logic as requested
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        product_id: product.id,
        seller_id: product.seller_id || "unknown",
        amount: product.price,
        status: "completed"
      });

      if (error) throw error;
      
      addItem(product);
      alert(`Paiement réussi pour ${product.name}! Vous pouvez maintenant laisser un avis sur la page de détails.`);
    } catch (err) {
      console.error("Purchase error:", err);
      alert("Erreur lors de l'achat.");
    }
  };

  return (
    <div className="group relative flex flex-col rounded-[2rem] border border-slate-100 bg-white p-2.5 transition-all hover:border-blue-100 hover:shadow-premium cursor-pointer overflow-hidden">
      
      {/* Clickable Area for Detail Page */}
      <Link href={`/product/${product.id}`} className="absolute inset-x-0 top-0 h-[80%] z-10" />

      {/* Image Section - Original 4:3 Aspect Ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-slate-50">
        <Image
          src={product.image_url || "https://images.unsplash.com/photo-1544648397-72fc8f9d87f0?q=80&w=400"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges - Original Style */}
        <div className="absolute left-3 top-3 flex gap-2">
           <span className="rounded-lg border border-slate-100 bg-white/95 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-700 shadow-sm backdrop-blur-md">
             {product.category}
           </span>
           <span className="rounded-lg bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-md">
             Nouveau
           </span>
        </div>

        {/* Wishlist Button */}
        <button className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-400 opacity-0 shadow-lg backdrop-blur-md transition-all hover:text-red-500 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-20">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col px-3 py-5">
        <div className="flex justify-between items-start gap-3 mb-1">
          <h3 className="text-base font-medium text-slate-900 leading-snug line-clamp-2 min-h-[3rem]">
            {product.name}
          </h3>
          <span className="text-base font-semibold text-blue-600 tracking-tight whitespace-nowrap">
            {product.price.toLocaleString()} HTG
          </span>
        </div>

        {/* Location & Time - Original Style */}
        <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 mt-2 mb-4">
           <MapPin className="h-3 w-3" />
           <span>{product.location}</span>
           <span className="h-1 w-1 rounded-full bg-slate-200 mx-1" />
           <span>Il y a 2h</span>
        </div>

        <div className="mt-auto flex flex-col gap-4 pt-4 border-t border-slate-50">
           {/* Seller Identity - Original Circle Avatar Style */}
           <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 border border-blue-200 text-[10px] font-black text-blue-700">
                {product.seller_name.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-slate-600">{product.seller_name}</span>
           </div>

           {/* Actions - Original Dual Button Style */}
           <div className="flex gap-2">
              <button 
                onClick={handleBuyNow}
                className="flex-[2] flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95 z-20"
              >
                <ShoppingCart className="h-4 w-4" />
                Ajouter au panier
              </button>
              <Link 
                href={`/product/${product.id}`}
                className="flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-700 transition-all hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 z-20"
              >
                <Info className="h-4 w-4" />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
