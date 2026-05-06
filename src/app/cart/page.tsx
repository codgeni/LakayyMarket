"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/cart-context";
import { Trash2, Plus, Minus, CreditCard, Wallet, ArrowRight, ShoppingBag, X } from "lucide-react";

export default function CartPage() {
  const { items, addItem, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const handlePayment = (method: "MonCash" | "NatCash") => {
    alert(`Paiement ${method} sélectionné!\n\nMontant total: ${totalPrice.toLocaleString()} HTG\n\nNote: Cette fonctionnalité est un placeholder. L'intégration API sera ajoutée manuellement ultérieurement.`);
    setShowPaymentModal(false);
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-8 py-20">
        <div className="relative h-48 w-48 rounded-[3rem] bg-slate-50 flex items-center justify-center text-slate-200 dark:bg-slate-900">
           <ShoppingBag className="h-24 w-24" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Votre panier est vide</h2>
          <p className="text-slate-500 font-medium">Découvrez nos produits authentiques et commencez vos achats.</p>
        </div>
        <Link 
          href="/" 
          className="rounded-2xl bg-brand-600 px-8 py-4 font-bold text-white shadow-xl shadow-brand-500/20 transition-all hover:bg-brand-700 hover:scale-105 active:scale-95"
        >
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-10">
          Votre Panier
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="glass rounded-[2rem] p-6 flex flex-col sm:flex-row gap-6 items-center shadow-lg shadow-slate-200/50 dark:shadow-none">
                <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-2xl">
                  <Image src={item.image_url || "https://images.unsplash.com/photo-1544648397-72fc8f9d87f0?q=80&w=400"} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-2 text-center sm:text-left">
                   <h3 className="text-xl font-bold text-slate-900 dark:text-white">{item.name}</h3>
                   <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{item.seller_name}</p>
                   <div className="flex items-center justify-center sm:justify-start gap-4 pt-2">
                      <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-full bg-white dark:bg-slate-900 p-1">
                         <button className="p-1 text-slate-500 hover:text-brand-600"><Minus className="h-4 w-4" /></button>
                         <span className="px-4 text-sm font-black">{item.quantity}</span>
                         <button onClick={() => addItem(item)} className="p-1 text-slate-500 hover:text-brand-600"><Plus className="h-4 w-4" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 className="h-5 w-5" />
                      </button>
                   </div>
                </div>
                <div className="text-right flex flex-col sm:items-end">
                   <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
                     {(item.price * item.quantity).toLocaleString()}
                   </span>
                   <span className="text-xs font-bold text-slate-400">HTG</span>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="space-y-6">
            <div className="glass rounded-[2rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none sticky top-24">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Récapitulatif</h3>
               
               <div className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <div className="flex justify-between">
                    <span>Sous-total ({totalItems} articles)</span>
                    <span className="text-slate-900 dark:text-white font-bold">{totalPrice.toLocaleString()} HTG</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de livraison</span>
                     <span className="text-emerald-600 font-bold uppercase tracking-widest text-[10px]">Calculés au paiement</span>
                  </div>
               </div>

               <div className="pt-6 space-y-6 text-center">
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-bold text-slate-900 dark:text-white">Total</span>
                    <div className="text-right">
                       <span className="text-4xl font-black text-brand-600 dark:text-brand-400">
                         {totalPrice.toLocaleString()}
                       </span>
                       <span className="ml-1 text-sm font-bold text-slate-400 uppercase">HTG</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-5 text-lg font-black text-white shadow-xl transition-all hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] dark:bg-white dark:text-slate-900"
                  >
                    Passer au Paiement <ArrowRight className="h-5 w-5" />
                  </button>
                  
                  <Link href="/" className="block text-sm font-bold text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                    Continuer mes achats
                  </Link>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Payment Modal Placeholder */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md scale-in-center glass rounded-[3rem] p-10 shadow-[0_32px_120px_-15px_rgba(0,0,0,0.3)] dark:shadow-none bg-white">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute right-8 top-8 rounded-full bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-3 mb-10">
              <h3 className="text-3xl font-black tracking-tight text-slate-900">Méthodes de Paiement</h3>
              <p className="text-sm font-medium text-slate-500">Sélectionnez votre portefeuille préféré pour valider votre commande de <span className="text-brand-600 font-bold">{totalPrice.toLocaleString()} HTG</span>.</p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={() => handlePayment("MonCash")}
                className="group w-full flex items-center justify-between rounded-2xl bg-[#FFD700]/10 border-2 border-[#FFD700] p-6 transition-all hover:bg-[#FFD700]/20 hover:scale-[1.03] active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-xl bg-[#FFD700] flex items-center justify-center text-slate-900">
                      <Wallet className="h-6 w-6" />
                   </div>
                   <div className="text-left leading-tight">
                      <span className="block font-black text-slate-900">MonCash</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B]">Paiement instantané</span>
                   </div>
                </div>
                <ArrowRight className="h-5 w-5 text-[#B8860B] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>

              <button 
                onClick={() => handlePayment("NatCash")}
                className="group w-full flex items-center justify-between rounded-2xl bg-[#00A651]/10 border-2 border-[#00A651] p-6 transition-all hover:bg-[#00A651]/20 hover:scale-[1.03] active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                   <div className="h-12 w-12 rounded-xl bg-[#00A651] flex items-center justify-center text-white">
                      <CreditCard className="h-6 w-6" />
                   </div>
                   <div className="text-left leading-tight">
                      <span className="block font-black text-slate-900">NatCash</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#006837]">Paiement sécurisé</span>
                   </div>
                </div>
                <ArrowRight className="h-5 w-5 text-[#006837] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            <p className="mt-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
              Soutenez l'industrie locale
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
