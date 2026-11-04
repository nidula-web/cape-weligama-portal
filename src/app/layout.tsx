import type { Metadata, Viewport } from "next";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
  title: "Boutique Guest Concierge & Experience Map | South Coast Sri Lanka",
  description:
    "Curated in-room guest concierge and interactive hotspot compendium for luxury boutique hotels and private villas in Ahangama, Weligama, and Galle.",
  applicationName: "Boutique Guest Concierge",
  authors: [{ name: "Luxury Hospitality South Coast Sri Lanka" }],
  keywords: [
    "Sri Lanka",
    "Ahangama",
    "Weligama",
    "Galle Fort",
    "Boutique Hotel",
    "Concierge",
    "Experience Map",
    "Luxury Villa",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#FAFAF8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased bg-[#FAFAF8]">
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-[#FAFAF8] text-[#1A1A1A]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
