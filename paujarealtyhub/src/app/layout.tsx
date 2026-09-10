import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pauja-realty-hub.vercel.app"),

  title: {
    default: "PaujaRealtyHub | Property Marketplace in Nigeria",
    template: "%s | PaujaRealtyHub",
  },

  description:
    "Discover properties, trusted agents, businesses and property services across Nigeria with PaujaRealtyHub.",

  keywords: [
    "Nigeria real estate",
    "property for sale in Nigeria",
    "property for rent in Nigeria",
    "houses for sale in Lagos",
    "real estate agents Nigeria",
    "property marketplace Nigeria",
    "PaujaRealtyHub",
  ],

  authors: [
    {
      name: "PaujaRealtyHub",
    },
  ],

  creator: "PaujaRealtyHub",
  publisher: "PaujaRealtyHub",

  openGraph: {
    title: "PaujaRealtyHub | Property Marketplace in Nigeria",
    description:
      "Discover properties, trusted agents, businesses and property services across Nigeria.",
    url: "https://pauja-realty-hub.vercel.app",
    siteName: "PaujaRealtyHub",
    locale: "en_NG",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "PaujaRealtyHub | Property Marketplace in Nigeria",
    description:
      "Discover properties, trusted agents, businesses and property services across Nigeria.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}