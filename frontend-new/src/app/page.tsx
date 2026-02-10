/**
 * @file HomePage - Página Principal del Sitio Público
 * @route /
 * @description Página de inicio con slider de imágenes, sección de bienvenida y enlaces a noticias
 */
import Navbar from "../components/Navbar";
import HomePage from "../components/HomePage";
import Footer from "../components/Footer";
import Script from "next/script";

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Ametsgoien',
    alternateName: 'Asociación Amets Goien',
    url: 'https://ametsgoien.org',
    logo: 'https://ametsgoien.org/logo.png',
    description: 'Asociación sin ánimo de lucro dedicada a proporcionar acogida, apoyo integral y acompañamiento a mujeres migrantes y sus familias en situación de vulnerabilidad.',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Orduña',
      addressRegion: 'Vizcaya',
      addressCountry: 'ES'
    },
    areaServed: {
      '@type': 'Place',
      name: 'País Vasco, España'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'ametsgoien@gmail.com',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'Basque']
    },
    sameAs: [
       'https://www.instagram.com/ametsgoien/'
    ],
    knowsAbout: [
      'Acogida de mujeres migrantes',
      'Apoyo a mujeres en situación de vulnerabilidad',
      'Integración social',
      'Acompañamiento a familias migrantes',
      'Orientación legal',
      'Apoyo psicológico'
    ]
  };

  return (
    <>
      <Script
        id="json-ld-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <HomePage />
      <Footer />
    </>
  );
}
