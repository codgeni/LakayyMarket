"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { Store, Loader2, Image as ImageIcon, CheckCircle2, ChevronRight } from "lucide-react";

export default function BecomeSellerPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    async function checkExistingProfile() {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        
        if (data?.role === 'seller') {
          router.push("/seller/dashboard");
        } else {
          setChecking(false);
        }
      } else if (isLoaded) {
        setChecking(false);
      }
    }
    checkExistingProfile();
  }, [user, isLoaded, router]);

  const [formData, setFormData] = useState({
    legalFullName: "",
    businessName: "",
    phoneNumber: "",
    address: "",
    location: "Port-au-Prince",
    specialization: "Artisanat",
  });

  if (!isLoaded || checking) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      </div>
    );
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const uploadLogo = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id}/logo-${Math.random()}.${fileExt}`;
    const filePath = `logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("seller-assets")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("seller-assets").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let logoUrl = "";
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      }

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: user.fullName || user.username || formData.legalFullName,
        legal_full_name: formData.legalFullName,
        email: user.primaryEmailAddress?.emailAddress,
        role: "seller",
        business_name: formData.businessName,
        business_logo_url: logoUrl,
        phone_number: formData.phoneNumber,
        address: formData.address,
        location: formData.location,
        specialization: formData.specialization,
      });

      if (error) throw error;

      router.push("/seller/dashboard");
    } catch (error) {
      console.error("Error becoming seller:", error);
      alert("Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 py-16 px-4">
      <div className="mx-auto max-w-xl">
        <div className="rounded-[2.5rem] bg-white p-8 md:p-14 shadow-premium border border-slate-100/50">
          
          <div className="text-center mb-12">
            <div className="mx-auto h-20 w-20 bg-brand-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-brand-600/30 mb-8">
              <Store className="h-10 w-10" />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 leading-tight">
              Devenez Artisan Lakay
            </h1>
            <p className="mt-4 text-slate-500 font-medium leading-relaxed">
              Rejoignez l&apos;élite des artisans haïtiens et vendez vos créations au monde entier.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Logo Section */}
            <div className="flex flex-col items-center">
               <div className="relative group">
                  <div className="h-28 w-28 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center text-slate-400 overflow-hidden hover:border-brand-500 hover:bg-white transition-all duration-300">
                     {logoPreview ? (
                       <img src={logoPreview} alt="Preview" className="h-full w-full object-cover" />
                     ) : (
                       <>
                         <ImageIcon className="h-7 w-7 mb-2" />
                         <span className="text-[10px] font-black uppercase tracking-widest">Logo Boutique</span>
                       </>
                     )}
                     <input type="file" accept="image/*" onChange={handleLogoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                  {logoPreview && (
                    <div className="absolute -right-2 -top-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-xl border-2 border-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
               
               {/* Identity */}
               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-1">Informations Légales</h3>
                  <div className="space-y-5">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Nom Complet Légal</label>
                       <input
                         required
                         type="text"
                         placeholder="Jean-Baptiste Duval"
                         className="input-premium"
                         value={formData.legalFullName}
                         onChange={(e) => setFormData({ ...formData, legalFullName: e.target.value })}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Nom de l&apos;entreprise</label>
                       <input
                         required
                         type="text"
                         placeholder="Ex: Atelier Créatif Lakay"
                         className="input-premium"
                         value={formData.businessName}
                         onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                       />
                    </div>
                  </div>
               </div>

               {/* Contact */}
               <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-1">Contact & Siège</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Téléphone</label>
                       <input
                         required
                         type="tel"
                         placeholder="+509 0000 0000"
                         className="input-premium"
                         value={formData.phoneNumber}
                         onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Département</label>
                       <select
                         className="input-premium appearance-none cursor-pointer"
                         value={formData.location}
                         onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                       >
                         <option value="Port-au-Prince">Ouest (P-a-P)</option>
                         <option value="Cap-Haïtien">Nord (Cap-H)</option>
                         <option value="Jacmel">Sud-Est (Jacmel)</option>
                         <option value="Les Cayes">Sud (Cayes)</option>
                         <option value="Gonaïves">Artibonite</option>
                       </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">Adresse Détaillée</label>
                     <textarea
                       required
                       rows={3}
                       placeholder="Rue, Numéro, Zone..."
                       className="input-premium resize-none"
                       value={formData.address}
                       onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                     />
                  </div>
               </div>

            </div>

            <div className="pt-6">
              <button
                disabled={loading}
                type="submit"
                className="group w-full flex items-center justify-center gap-2 rounded-[1.5rem] bg-slate-900 py-6 text-xl font-black text-white shadow-2xl transition-all hover:bg-brand-600 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                  <>
                    Finaliser mon Inscription <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed px-4">
                En continuant, vous attestez de l&apos;exactitude des données et acceptez les conditions générales de vente.
              </p>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
