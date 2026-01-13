import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SkipNavigation from "@/components/SkipNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ametsgoien - Acogida y acompañamiento a mujeres migrantes",
  description: "Asociación dedicada a proporcionar acogida, apoyo integral y acompañamiento a mujeres migrantes y sus familias. Construyendo un refugio seguro y digno.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SkipNavigation />
        {children}
      </body>
    </html>
  );
}
