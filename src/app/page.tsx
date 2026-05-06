"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/product-card";
import { Search, Filter, MapPin, Tag, ChevronRight, PackageSearch, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    location: "all",
    search: "",
  });

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase.from("products").select("*");
        
        if (filters.category !== "all") {
          query = query.eq("category", filters.category);
        }
        if (filters.location !== "all") {
          query = query.eq("location", filters.location);
        }
        if (filters.search) {
          query = query.ilike("name", `%${filters.search}%`);
        }

        const { data, error } = await query.order("created_at", { ascending: false });
        if (error) throw error;
        setProducts(data || []);
      } catch (e) {
        console.error("Error fetching products", e);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [filters]);

  return (
    <div className="flex flex-col bg-white">
      
      {/* Hero Section - Standard Card Width */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-6">
        <div className="relative h-[380px] w-full overflow-hidden rounded-[3rem] bg-slate-950 shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&q=80&w=2070"
            alt="Marché local Haïti"
            fill
            priority
            className="object-cover opacity-80"
          />
          
          {/* Dark Blue Overlay */}
          <div className="absolute inset-0 bg-slate-950/60 transition-opacity z-10" />
          
          {/* Centered Content */}
          <div className="relative z-20 flex h-full flex-col items-center justify-center text-center px-6 md:px-20">
            <div className="mb-4 rounded-full border border-white/20 bg-white/10 px-6 py-1.5 backdrop-blur-md">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                Découvrez l'authenticité
              </span>
            </div>
            
            <h1 className="mb-4 text-4xl font-black tracking-tight text-white sm:text-6xl leading-tight">
              Bienvenue à Lakay Market
            </h1>
            
            <p className="max-w-2xl text-base font-medium text-slate-200 leading-relaxed">
              Votre marché en ligne pour soutenir l'artisanat, les producteurs locaux et découvrir le meilleur de notre culture, directement de chez vous.
            </p>
          </div>
        </div>
      </section>

      {/* Main Catalog Section */}
      <div id="boutique" className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-24 sm:px-6 lg:flex-row lg:px-8">
        
        {/* Sidebar Filter - Enhanced Contrast */}
        <aside className="w-full shrink-0 lg:w-72">
          <div className="sticky top-28 space-y-10">
            
            <div className="space-y-6">
              <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-900 px-1">
                <Filter className="h-4 w-4 text-brand-600" />
                Catégories
              </h2>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {[
                  { id: "all", label: "Tous les Articles", icon: ShoppingBag },
                  { id: "Artisanat", label: "Artisanat d'Art", icon: Sparkles },
                  { id: "Vêtements", label: "Mode & Design", icon: Tag },
                  { id: "Agricole", label: "Produits de la Terre", icon: MapPin },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilters({ ...filters, category: cat.id })}
                    className={`flex items-center justify-between gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all ${
                      filters.category === cat.id
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <cat.icon className={`h-4.5 w-4.5 ${filters.category === cat.id ? "text-brand-400" : "text-slate-400"}`} />
                      {cat.label}
                    </div>
                    {filters.category === cat.id && <ChevronRight className="h-4 w-4 opacity-50" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-slate-100">
              <h2 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-900 px-1">
                <MapPin className="h-4 w-4 text-brand-600" />
                Localisation
              </h2>
              <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                {["all", "Port-au-Prince", "Cap-Haïtien", "Jacmel"].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => setFilters({ ...filters, location: loc })}
                    className={`flex items-center justify-between rounded-2xl px-5 py-3.5 text-sm font-bold transition-all ${
                      filters.location === loc
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {loc === "all" ? "Toute l'île" : loc}
                    {filters.location === loc && <ChevronRight className="h-4 w-4 opacity-50" />}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 space-y-12">
          
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
             <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tight text-slate-900 capitalize">
                  {filters.category === 'all' ? 'Collection Complète' : filters.category}
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  {products.length} trésors trouvés dans cette catégorie.
                </p>
             </div>
             
              {/* Search in Content */}
              <div className="relative w-full sm:w-80">
                 <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                 <input 
                   type="text" 
                   placeholder="Rechercher parmi les trésors haïtiens..." 
                   className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 py-3.5 pl-11 pr-4 text-xs font-bold outline-none transition-all placeholder:text-slate-400 focus:border-brand-500/30 focus:bg-white focus:ring-4 focus:ring-brand-500/5"
                   value={filters.search}
                   onChange={(e) => setFilters({...filters, search: e.target.value})}
                 />
              </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-[450px] w-full animate-pulse rounded-[2.5rem] bg-slate-50" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {products.map((product) => (
                <div key={product.id} className="animate-fade-in">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[3rem] bg-slate-50 py-32 text-center border-2 border-dashed border-slate-200">
              <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-xl text-slate-200 mb-6">
                <PackageSearch className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Aucun produit trouvé</h3>
              <p className="mt-4 text-slate-500 font-medium max-w-xs leading-relaxed">
                Essayez d'ajuster vos filtres ou effectuez une nouvelle recherche.
              </p>
              <button 
                onClick={() => setFilters({ category: "all", location: "all", search: "" })}
                className="mt-8 text-brand-600 font-black flex items-center gap-2 hover:opacity-80"
              >
                Réinitialiser les filtres <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
