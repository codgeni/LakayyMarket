"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/context/cart-context";
import { useUser } from "@clerk/nextjs";
import { 
  MapPin, ShoppingCart, Heart, ShieldCheck, ArrowLeft, 
  Loader2, Star, CheckCircle2, MessageSquare, Plus, Minus,
  Truck, RotateCcw, User
} from "lucide-react";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, isLoaded: userLoaded } = useUser();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const { addItem } = useCart();

  // Review Form State
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ""
  });

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Product
        const { data: prodData, error: prodError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();
        
        if (prodError) throw prodError;
        setProduct(prodData);

        // Fetch Reviews
        const { data: revData } = await supabase
          .from("reviews")
          .select("*")
          .eq("product_id", id)
          .order("created_at", { ascending: false });
        
        setReviews(revData || []);

        // Check Purchase Status if user logged in
        if (user) {
          const { data: orderData } = await supabase
            .from("orders")
            .select("id")
            .eq("user_id", user.id)
            .eq("product_id", id)
            .limit(1);
          
          setHasPurchased(!!orderData?.length);
        }
      } catch (e) {
        console.error("Error fetching data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, user]);

  const handleBuyNow = async () => {
    if (!user) {
      alert("Veuillez vous connecter pour acheter.");
      return;
    }

    try {
      // Simulate automatic purchase
      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        product_id: product.id,
        seller_id: product.seller_id || "unknown",
        amount: product.price * quantity,
        status: "completed"
      });

      if (error) throw error;
      
      setHasPurchased(true);
      addItem({ ...product, quantity });
      alert("Merci pour votre achat ! Vous pouvez maintenant laisser votre avis.");
    } catch (err) {
      console.error("Purchase error:", err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmittingReview(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        product_id: id,
        user_id: user.id,
        user_name: user.fullName || user.username || "Client Lakay",
        rating: newReview.rating,
        comment: newReview.comment
      });

      if (error) throw error;

      // Refresh reviews
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("product_id", id)
        .order("created_at", { ascending: false });
      
      setReviews(data || []);
      setShowReviewForm(false);
      setNewReview({ rating: 5, comment: "" });
    } catch (err) {
      console.error("Review submission error:", err);
      alert("Erreur lors de l'envoi de l'avis.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !userLoaded) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-6 min-h-screen">
        <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
          <MessageSquare className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Produit non trouvé</h2>
        <Link href="/" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-600 transition-all">
          Retour à la boutique
        </Link>
      </div>
    );
  }

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="flex-1 bg-white">
      
      {/* Breadcrumbs - High Contrast */}
      <div className="border-b border-slate-100 bg-[#FAFAFA]">
        <div className="mx-auto max-w-[1450px] px-6 py-4">
           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Link href="/" className="hover:text-blue-600 transition-colors">Accueil</Link>
              <ArrowLeft className="h-3 w-3" />
              <span className="text-blue-600">{product.category}</span>
              <ArrowLeft className="h-3 w-3" />
              <span className="text-slate-900 truncate max-w-[200px]">{product.name}</span>
           </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1450px] px-6 py-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          
          {/* Gallery Column (5 units) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 bg-slate-50 group">
              <Image
                src={product.image_url || "https://images.unsplash.com/photo-1544648397-72fc8f9d87f0?q=80&w=1200"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-8 left-8 flex gap-2">
                 <span className="rounded-xl border border-slate-100 bg-white/95 px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700 shadow-lg backdrop-blur-md">
                   {product.category}
                 </span>
              </div>
              <button className="absolute top-8 right-8 h-14 w-14 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-xl transition-all active:scale-95">
                 <Heart className="h-6 w-6" />
              </button>
            </div>

            {/* Thumbnails Mockup */}
            <div className="grid grid-cols-4 gap-4">
               {[1,2,3,4].map(i => (
                 <button key={i} className={`aspect-square rounded-[1.5rem] border-2 transition-all overflow-hidden ${i === 1 ? 'border-blue-600 bg-blue-50' : 'border-transparent bg-slate-50 hover:border-slate-200'}`}>
                    <Image src={product.image_url || "https://images.unsplash.com/photo-1544648397-72fc8f9d87f0?q=80&w=400"} alt="" width={200} height={200} className={`h-full w-full object-cover ${i !== 1 && 'opacity-50'}`} />
                 </button>
               ))}
            </div>
          </div>

          {/* Info Column (7 units) */}
          <div className="lg:col-span-7 flex flex-col space-y-10">
            
            <div className="space-y-6">
               <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1">
                     {[1,2,3,4,5].map(star => (
                       <Star key={star} className={`h-4 w-4 ${star <= Math.round(parseFloat(averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                     ))}
                     <span className="ml-2 text-xs font-black text-slate-900 tracking-tight">{averageRating} Avis</span>
                  </div>
                  <span className="text-slate-200">|</span>
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-600 uppercase tracking-widest">
                     <CheckCircle2 className="h-4 w-4" /> En Stock
                  </div>
               </div>

               <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                 {product.name}
               </h1>

               <div className="flex items-center gap-6 border-b border-slate-50 pb-8">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center text-xs font-black">
                        {product.seller_name.substring(0,2).toUpperCase()}
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-900">{product.seller_name}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Artisan Vérifié</p>
                     </div>
                  </div>
                  <div className="h-8 w-px bg-slate-100" />
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-widest">
                     <MapPin className="h-3.5 w-3.5 text-blue-500" />
                     {product.location}
                  </div>
               </div>
            </div>

            <div className="space-y-2">
               <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">
                    {product.price.toLocaleString()}
                  </span>
                  <span className="text-xl font-black text-blue-600">HTG</span>
               </div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">TVA incluse • Livraison locale disponible</p>
            </div>

            <div className="space-y-4">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Description</h3>
               <p className="text-lg leading-relaxed text-slate-600 font-medium">
                 {product.description || "Cette création artisanale unique témoigne du savoir-faire exceptionnel de nos artisans locaux. Fabriqué avec passion et des matériaux de première qualité."}
               </p>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Dimensions / Taille</h3>
                  <div className="flex gap-3">
                     {['S', 'M', 'L', 'XL'].map(s => (
                       <button key={s} className={`h-14 w-14 rounded-2xl flex items-center justify-center text-xs font-black transition-all ${s === 'M' ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-100'}`}>
                          {s}
                       </button>
                     ))}
                  </div>
               </div>
               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Quantité</h3>
                  <div className="flex items-center gap-4">
                     <div className="flex items-center rounded-2xl border border-slate-100 bg-slate-50 p-1">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="h-12 w-12 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white hover:text-blue-600 transition-all"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center text-sm font-black text-slate-900">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="h-12 w-12 rounded-xl flex items-center justify-center text-slate-500 hover:bg-white hover:text-blue-600 transition-all"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            {/* Action Group */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
               <button 
                 onClick={handleBuyNow}
                 className="flex-1 rounded-3xl bg-slate-900 py-6 text-lg font-black text-white shadow-2xl transition-all hover:bg-blue-600 hover:scale-[1.02] active:scale-[0.98]"
               >
                 Acheter Maintenant
               </button>
               <button 
                 onClick={() => addItem({ ...product, quantity })}
                 className="flex-1 rounded-3xl border-2 border-slate-100 bg-white py-6 text-lg font-black text-slate-900 transition-all hover:border-blue-600 hover:text-blue-600 group"
               >
                 <ShoppingCart className="h-6 w-6 inline-block mr-3 group-hover:scale-110 transition-transform" />
                 Ajouter au Panier
               </button>
            </div>

            {/* Benefits Trust */}
            <div className="grid grid-cols-3 gap-6 py-10 border-t border-slate-50 mt-4">
               {[
                 { icon: ShieldCheck, label: "Sécurisé" },
                 { icon: Truck, label: "Express" },
                 { icon: RotateCcw, label: "Retour 14j" }
               ].map((b, i) => (
                 <div key={i} className="flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-600 border border-slate-100">
                       <b.icon className="h-6 w-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{b.label}</span>
                 </div>
               ))}
            </div>

          </div>
        </div>

        {/* Reviews Section - Verified Purchase Logic */}
        <section className="mt-32 pt-20 border-t border-slate-50">
           <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-16">
              <div className="max-w-md">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Ce que nos clients disent</h2>
                 <p className="mt-4 text-slate-500 font-medium leading-relaxed">
                    Seuls les clients ayant acheté ce produit peuvent laisser un avis. Nous garantissons l&apos;authenticité de chaque retour.
                 </p>
                 <div className="mt-8 flex items-center gap-4">
                    <div className="text-5xl font-black text-slate-900">{averageRating}</div>
                    <div>
                       <div className="flex gap-1 mb-1">
                          {[1,2,3,4,5].map(s => <Star key={s} className={`h-4 w-4 ${s <= Math.round(parseFloat(averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />)}
                       </div>
                       <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{reviews.length} Avis Clients</p>
                    </div>
                 </div>
              </div>

              {/* Review Write Trigger */}
              <div className="flex-1 flex justify-end">
                 {hasPurchased ? (
                   !showReviewForm ? (
                     <button 
                       onClick={() => setShowReviewForm(true)}
                       className="rounded-2xl bg-blue-600 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 hover:scale-105 transition-all"
                     >
                       Écrire un Avis
                     </button>
                   ) : (
                     <div className="w-full max-w-xl bg-slate-50 rounded-[2rem] p-8 animate-in slide-in-from-top-4 duration-500">
                        <h4 className="text-lg font-black text-slate-900 mb-6">Votre Expérience</h4>
                        <form onSubmit={handleSubmitReview} className="space-y-6">
                           <div className="flex items-center gap-3 mb-2">
                              {[1,2,3,4,5].map(s => (
                                <button key={s} type="button" onClick={() => setNewReview({...newReview, rating: s})} className="transition-transform active:scale-90">
                                   <Star className={`h-8 w-8 ${s <= newReview.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                                </button>
                              ))}
                           </div>
                           <textarea 
                             required 
                             placeholder="Qu'avez-vous pensé de ce produit ?" 
                             className="w-full rounded-2xl border-none bg-white p-5 text-sm font-medium focus:ring-4 focus:ring-blue-100 min-h-[120px]"
                             value={newReview.comment}
                             onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                           />
                           <div className="flex justify-end gap-3">
                              <button type="button" onClick={() => setShowReviewForm(false)} className="px-6 py-4 text-xs font-black uppercase text-slate-400">Annuler</button>
                              <button 
                                disabled={submittingReview}
                                type="submit" 
                                className="rounded-xl bg-slate-900 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg disabled:opacity-50"
                              >
                                {submittingReview ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publier l'Avis"}
                              </button>
                           </div>
                        </form>
                     </div>
                   )
                 ) : (
                   <div className="flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-2xl text-slate-400 text-xs font-bold uppercase tracking-widest border border-slate-100">
                      <ShieldCheck className="h-5 w-5" /> Achetez pour laisser un avis
                   </div>
                 )}
              </div>
           </div>

           {/* Review List */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {reviews.map((rev) => (
                <div key={rev.id} className="group flex flex-col rounded-[2rem] border border-slate-100 bg-white p-8 shadow-sm transition-all hover:shadow-premium">
                   <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white text-xs font-black">
                            <User className="h-5 w-5" />
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900">{rev.user_name}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Achat Vérifié</p>
                         </div>
                      </div>
                      <div className="flex gap-0.5">
                         {[1,2,3,4,5].map(s => <Star key={s} className={`h-3 w-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />)}
                      </div>
                   </div>
                   <p className="flex-1 text-sm font-medium text-slate-600 leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                   </p>
                   <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                         {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                      <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Utile ?</button>
                   </div>
                </div>
              ))}

              {reviews.length === 0 && (
                <div className="col-span-full py-20 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                   <div className="h-16 w-16 mx-auto bg-white rounded-2xl flex items-center justify-center text-slate-200 mb-4">
                      <Star className="h-8 w-8" />
                   </div>
                   <h4 className="text-lg font-black text-slate-900 tracking-tight">Aucun avis pour le moment</h4>
                   <p className="text-sm text-slate-400 font-medium">Soyez le premier à partager votre expérience après l&apos;achat !</p>
                </div>
              )}
           </div>
        </section>

        {/* Floating Chat Trigger */}
        <div className="fixed bottom-8 right-8 z-[60]">
           <button className="h-16 w-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-blue-600 hover:scale-110 transition-all group relative border-4 border-white">
              <MessageSquare className="h-7 w-7" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              
              {/* Tooltip */}
              <div className="absolute right-20 bg-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Contacter l&apos;Artisan
              </div>
           </button>
        </div>

      </div>
    </div>
  );
}
