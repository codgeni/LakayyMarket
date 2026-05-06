"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { Plus, Trash2, LayoutDashboard, Package, ShoppingBag, PlusCircle, X, Upload, Loader2, CheckCircle2, ChevronRight, Store, ArrowUpRight, BarChart3, Settings } from "lucide-react";

export default function SellerDashboard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "Artisanat",
    location: "Port-au-Prince",
    image: null as File | null,
  });

  useEffect(() => {
    async function checkSellerStatus() {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        
        if (data?.role !== 'seller') {
          router.push("/become-seller");
        } else {
          setSellerProfile(data);
          fetchSellerProducts();
        }
      }
    }
    checkSellerStatus();
  }, [user, router]);

  async function fetchSellerProducts() {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (e) {
      console.error("Error fetching seller products", e);
    } finally {
      setLoading(false);
    }
  }

  const handleUploadImage = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${user?.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUploading(true);
    try {
      let imageUrl = "";
      if (newProduct.image) {
        imageUrl = await handleUploadImage(newProduct.image);
      }

      const { error } = await supabase.from("products").insert({
        seller_id: user.id,
        seller_name: sellerProfile?.business_name || user.fullName || "Artisan",
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        location: sellerProfile?.location || "Port-au-Prince",
        image_url: imageUrl,
      });

      if (error) throw error;

      setShowAddModal(false);
      setNewProduct({ name: "", description: "", price: "", category: "Artisanat", location: "Port-au-Prince", image: null });
      fetchSellerProducts();
    } catch (e) {
      console.error("Error adding product", e);
      alert("Erreur lors de l'ajout du produit.");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      fetchSellerProducts();
    } catch (e) {
      console.error("Error deleting product", e);
    }
  };

  if (!isLoaded || loading && !sellerProfile) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <div className="mx-auto max-w-[1450px] px-6 py-8">
        
        {/* Dashboard Banner - Stripe/Clerk Style */}
        <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 shadow-2xl transition-all mb-12">
           {/* Animated Gradient Background */}
           <div className="absolute inset-0">
             <div className="absolute -top-1/2 -left-1/4 h-full w-full bg-brand-600/20 blur-[120px]" />
             <div className="absolute -bottom-1/2 -right-1/4 h-full w-full bg-indigo-500/20 blur-[120px]" />
           </div>

           <div className="relative z-10 p-10 md:p-16 flex flex-col md:flex-row md:items-center justify-between gap-10">
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 backdrop-blur-md border border-white/10">
                    <Store className="h-4 w-4 text-brand-300" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Espace Vendeur</span>
                 </div>
                 <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                    {sellerProfile?.business_name || "Votre Boutique"}
                 </h1>
                 <p className="text-lg font-medium text-slate-400 max-w-lg">
                    Bienvenue dans votre tableau de bord. Gérez vos créations et suivez la croissance de votre artisanat.
                 </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-5 font-black text-slate-950 shadow-2xl transition-all hover:bg-brand-50 hover:scale-105 active:scale-95"
                >
                  <PlusCircle className="h-5 w-5" />
                  Nouvel Article
                </button>
                <Link href="/seller/settings" className="w-full sm:w-auto p-5 rounded-2xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all flex items-center justify-center">
                   <Settings className="h-5 w-5" />
                </Link>
              </div>
           </div>
        </section>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: "Articles Actifs", val: products.length, icon: Package, color: "text-brand-600", bg: "bg-brand-50" },
             { label: "Ventes HTG", val: "0", icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
             { label: "Vues Totales", val: "0", icon: ArrowUpRight, color: "text-indigo-600", bg: "bg-indigo-50" },
             { label: "Nouveaux Clients", val: "0", icon: CheckCircle2, color: "text-amber-600", bg: "bg-amber-50" }
           ].map((stat, i) => (
             <div key={i} className="group rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm shadow-slate-200/50 transition-all hover:shadow-premium hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                   <div className={`h-12 w-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="h-6 w-6" />
                   </div>
                   <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <ChevronRight className="h-4 w-4" />
                   </div>
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                   <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.val}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Main Content Area */}
        <div className="rounded-[3rem] border border-slate-100 bg-white shadow-premium overflow-hidden">
           <div className="p-8 md:p-10 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                    <Package className="h-5 w-5" />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight">Votre Inventaire</h3>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{products.length} Articles</span>
                 <div className="h-4 w-px bg-slate-100 mx-1" />
                 <button className="text-xs font-bold text-brand-600 hover:opacity-80">Tout Voir</button>
              </div>
           </div>
           
           <div className="p-8 md:p-10">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-50 animate-pulse rounded-3xl" />)}
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {products.map((product) => (
                    <div key={product.id} className="group relative flex flex-col rounded-[2rem] border border-slate-100 p-2.5 transition-all hover:border-brand-100 hover:shadow-premium">
                       <div className="relative aspect-video rounded-[1.5rem] overflow-hidden bg-slate-50">
                          <Image src={product.image_url || "https://images.unsplash.com/photo-1544648397-72fc8f9d87f0?q=80&w=400"} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-all" />
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="absolute right-3 top-3 h-10 w-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:scale-110 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                          >
                             <Trash2 className="h-5 w-5" />
                          </button>
                       </div>
                       <div className="px-3 py-5">
                          <h4 className="text-base font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                          <div className="flex items-center justify-between mt-3">
                             <div className="flex flex-col">
                                <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Prix</span>
                                <span className="text-lg font-black text-slate-900 tracking-tight">{product.price.toLocaleString()} HTG</span>
                             </div>
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest border border-slate-100 px-3 py-1.5 rounded-full">{product.category}</span>
                          </div>
                          <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-50">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" /> En ligne
                             </span>
                             <button className="text-[10px] font-black text-slate-900 uppercase tracking-widest hover:text-brand-600">Modifier</button>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                   <div className="h-20 w-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mb-6">
                      <ShoppingBag className="h-10 w-10" />
                   </div>
                   <h4 className="text-2xl font-black text-slate-900 tracking-tight">Votre boutique est vide</h4>
                   <p className="mt-4 text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">Commencez à vendre vos créations en ajoutant votre premier produit.</p>
                   <button 
                     onClick={() => setShowAddModal(true)} 
                     className="mt-8 flex items-center gap-2 text-brand-600 font-black uppercase text-xs tracking-[0.2em] hover:opacity-80"
                   >
                      Ajouter un article <ChevronRight className="h-4 w-4" />
                   </button>
                </div>
              )}
           </div>
        </div>

      </div>

      {/* Add Product Modal - Polished */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute right-10 top-10 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="mb-12">
               <div className="h-14 w-14 bg-brand-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-600/20 mb-6">
                  <Plus className="h-8 w-8" />
               </div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">Mettre en Vente</h3>
               <p className="text-slate-500 font-medium mt-2">Partagez votre chef-d'œuvre avec la communauté Lakay.</p>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 px-1">Nom de l'article</label>
                    <input required type="text" placeholder="Ex: Chapeau de paille fin" className="input-premium" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 px-1">Prix de vente (HTG)</label>
                    <input required type="number" placeholder="2500" className="input-premium" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 px-1">Description détaillée</label>
                  <textarea rows={4} placeholder="Matériaux used, temps de confection, histoire..." className="input-premium resize-none" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 px-1">Sélectionner une Catégorie</label>
                    <select className="input-premium appearance-none cursor-pointer" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                       <option value="Artisanat">Artisanat d'Art</option>
                       <option value="Vêtements">Mode & Design</option>
                       <option value="Agricole">Produits Locaux</option>
                       <option value="Electronique">Technique</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 px-1">Photo du produit</label>
                    <div className="relative group flex h-[58px] w-full items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition-all hover:bg-white hover:border-brand-500">
                       <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files?.[0] || null })} />
                       <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                          <Upload className="h-4 w-4" />
                          {newProduct.image ? newProduct.image.name : "Sélectionner Image"}
                       </div>
                    </div>
                  </div>
               </div>

               <div className="pt-6">
                 <button disabled={uploading} type="submit" className="w-full rounded-[1.5rem] bg-slate-900 py-6 text-xl font-black text-white shadow-2xl transition-all hover:bg-brand-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3">
                    {uploading ? (
                      <Loader2 className="h-8 w-8 animate-spin" />
                    ) : (
                      <>Publier mon Article <ArrowUpRight className="h-6 w-6" /></>
                    )}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
