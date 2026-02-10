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
  metadataBase: new URL('https://ametsgoien.org'),
  title: {
    default: "Ametsgoien - Acogida y acompañamiento a mujeres migrantes",
    template: "%s | Ametsgoien"
  },
  description: "Asociación sin ánimo de lucro dedicada a proporcionar acogida, apoyo integral y acompañamiento a mujeres migrantes y sus familias en situación de vulnerabilidad. Ofrecemos alojamiento, orientación legal, apoyo psicológico y programas de integración en Bilbao, País Vasco.",
  keywords: [
    "ametsgoien",
    "amets goien",
    "asociación mujeres migrantes",
    "acogida mujeres",
    "refugio mujeres Bilbao",
    "apoyo mujeres migrantes",
    "integración social",
    "mujeres vulnerables",
    "asociación Bilbao",
    "ayuda mujeres",
    "ONG mujeres",
    "asilo mujeres",
    "acompañamiento migrantes",
    "País Vasco",
    "inclusión social",
    "solidaridad",
    "voluntariado Bilbao"
  ],
  authors: [{ name: "Asociación Ametsgoien" }],
  creator: "Asociación Ametsgoien",
  publisher: "Asociación Ametsgoien",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Ametsgoien - Acogida y acompañamiento a mujeres migrantes",
    description: "Asociación sin ánimo de lucro dedicada a proporcionar acogida, apoyo integral y acompañamiento a mujeres migrantes y sus familias en situación de vulnerabilidad.",
    url: 'https://ametsgoien.org',
    siteName: 'Ametsgoien',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ametsgoien - Asociación de ayuda a mujeres migrantes',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ametsgoien - Acogida y acompañamiento a mujeres migrantes',
    description: 'Asociación sin ánimo de lucro dedicada a proporcionar acogida, apoyo integral y acompañamiento a mujeres migrantes y sus familias.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Añadir cuando tengas las cuentas configuradas:
    // google: 'tu-codigo-de-verificacion-de-google',
    // yandex: 'tu-codigo-de-verificacion-de-yandex',
    // bing: 'tu-codigo-de-verificacion-de-bing',
  },
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
