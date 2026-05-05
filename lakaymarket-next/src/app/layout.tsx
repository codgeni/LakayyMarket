import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/context/cart-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "LakayMarket | Votre Marché Local Authentique",
  description: "Découvrez l'authenticité de l'artisanat local haïtien sur LakayMarket.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <CartProvider>
        <html lang="fr" className={`${jakarta.variable} h-full antialiased`}>
          <body className="min-h-full flex flex-col font-sans">
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  );
}
