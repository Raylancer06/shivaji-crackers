import type { Metadata } from "next";
import "@fontsource-variable/mona-sans";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SparkleCanvas } from "@/components/SparkleCanvas";
import { CartToast } from "@/components/CartToast";
import { FloatingCartBar } from "@/components/FloatingCartBar";
import { BackToTop } from "@/components/BackToTop";

export const metadata: Metadata = {
  title: "Sivaji Firecracker | Authentic Factory Direct Green Fireworks & Price List",
  description: "Official Sivaji Firecracker online store. 100% CSIR-NEERI Green Certified fireworks with Hyderabad direct delivery and up to 80% off wholesale rates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@fontsource-variable/mona-sans@5.3.0/index.min.css"
        />
      </head>
      <body className="antialiased bg-[#FAF7F2] text-[#1C1411] selection:bg-festive-gold/30 selection:text-heritage-maroon">
        <AuthProvider>
          <CartProvider>
            <ScrollProgress />
            <SparkleCanvas />
            {children}
            <CartToast />
            <FloatingCartBar />
            <BackToTop />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
