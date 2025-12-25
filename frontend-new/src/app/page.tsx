/**
 * @file HomePage - Página Principal del Sitio Público
 * @route /
 * @description Página de inicio con slider de imágenes, sección de bienvenida y enlaces a noticias
 */
import Navbar from "../components/Navbar";
import HomePage from "../components/HomePage";
import Footer from "../components/Footer";

export default function Page() {
  return (
    <>
      <Navbar />
      <HomePage />
      <Footer />
    </>
  );
}
