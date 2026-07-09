import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/components/CartProvider";
import { SiteChrome } from "@/components/SiteChrome";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_STORE_NAME || "Auto Order Store",
  description: "Automatic digital product store with instant QRIS payment"
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <CartProvider>
            <SiteChrome storeName={settings.storeName}>{children}</SiteChrome>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
