import Link from "next/link";
import { Mail, Phone, Globe, Share } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          
          {/* Brand */}
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 font-bold text-white dark:bg-slate-100 dark:text-slate-900">
                LM
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                LakayMarket
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600 dark:text-slate-400">
              Soutenez l&apos;artisanat local haïtien. Votre marché en ligne pour découvrir le meilleur de notre culture, directement de chez vous.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="#" className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-brand-900/20 transition-all">
                <Globe className="h-4 w-4" />
              </Link>
              <Link href="#" className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-brand-50 hover:text-brand-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-brand-900/20 transition-all">
                <Share className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Boutique</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/#" className="hover:text-brand-600 transition-colors">Tous les produits</Link></li>
              <li><Link href="/#" className="hover:text-brand-600 transition-colors">Artisanat</Link></li>
              <li><Link href="/#" className="hover:text-brand-600 transition-colors">Vêtements</Link></li>
              <li><Link href="/#" className="hover:text-brand-600 transition-colors">Nouveautés</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">S'informer</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li><Link href="/a-propos" className="hover:text-brand-600 transition-colors">À propos</Link></li>
              <li><Link href="/conditions" className="hover:text-brand-600 transition-colors">Conditions d&apos;utilisation</Link></li>
              <li><Link href="/contact" className="hover:text-brand-600 transition-colors">Contact</Link></li>
              <li><Link href="/become-seller" className="font-semibold text-brand-600 hover:opacity-80 transition-opacity">Devenir Artisan</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Aide</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400" />
                <span>support@lakaymarket.ht</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>+509 0000 0000</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 border-t border-slate-200 pt-8 dark:border-slate-800">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} LakayMarket. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs font-medium text-slate-400">Paiements sécurisés via :</span>
              <div className="flex gap-4 grayscale opacity-60">
                <img src="https://via.placeholder.com/80x20?text=MonCash" alt="MonCash" className="h-5" style={{ filter: 'grayscale(1)', opacity: 0.6 }} />
                <img src="https://via.placeholder.com/80x20?text=NatCash" alt="NatCash" className="h-5" style={{ filter: 'grayscale(1)', opacity: 0.6 }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
