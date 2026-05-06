"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { UserButton, SignInButton, SignUpButton, Show } from "@clerk/nextjs";
import { ShoppingCart, Heart, Search, User, Menu } from "lucide-react";

export function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="group flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 font-bold text-white shadow-lg transition-all group-hover:scale-110 dark:bg-slate-100 dark:text-slate-900">
                LM
              </div>
              <span className="hidden text-xl font-bold tracking-tight text-slate-900 group-hover:text-brand-600 dark:text-white sm:block page-transition">
                LakayMarket
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-6 md:flex">
              <Link href="/#" className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">Boutique</Link>
            </div>
          </div>

          {/* Search Bar - Stripe Style */}
          <div className="hidden max-w-lg flex-1 md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-3 flex items-center text-slate-400 transition-colors group-focus-within:text-brand-500">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Rechercher un produit, une catégorie ou un artisan haïtien..."
                className="w-full rounded-full border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:border-brand-500/50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 dark:border-slate-800 dark:bg-slate-900/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-4">
            
            <Show when="signed-out">
              <div className="hidden items-center gap-4 md:flex">
                <SignInButton mode="modal">
                  <button className="text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white page-transition">
                    Connexion
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 hover:scale-105 active:scale-95 dark:bg-slate-100 dark:text-slate-900 page-transition">
                    S&apos;inscrire
                  </button>
                </SignUpButton>
              </div>
            </Show>

            <Show when="signed-in">
              <div className="flex items-center gap-4">
                <Link
                  href="/become-seller"
                  className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm hover:border-brand-500 hover:text-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 sm:block page-transition"
                >
                  Vendre sur Lakay
                </Link>
              </div>
            </Show>

            {/* Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button className="rounded-full p-2.5 text-slate-500 hover:bg-slate-50 hover:text-brand-600 dark:hover:bg-slate-900 transition-all">
                <Heart className="h-5 w-5" />
              </button>
              
              <Link href="/cart" className="relative group rounded-full p-2.5 text-slate-500 hover:bg-slate-50 hover:text-brand-600 dark:hover:bg-slate-900 transition-all">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white shadow-md transition-transform group-hover:scale-110">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>

            <Show when="signed-in">
              <div className="ml-2 flex items-center border-l border-slate-100 pl-4 dark:border-slate-800">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-brand-500/20 transition-all",
                    },
                  }}
                />
              </div>
            </Show>

            <Show when="signed-out">
              <div className="md:hidden">
                <SignInButton mode="modal">
                  <button className="rounded-full bg-slate-100 p-2.5 text-slate-600 hover:bg-slate-200">
                    <User className="h-5 w-5" />
                  </button>
                </SignInButton>
              </div>
            </Show>
            
            <button className="rounded-full p-2.5 text-slate-500 hover:bg-slate-50 md:hidden">
              <Menu className="h-5 w-5" />
            </button>

          </div>
        </div>
      </div>
    </nav>
  );
}
