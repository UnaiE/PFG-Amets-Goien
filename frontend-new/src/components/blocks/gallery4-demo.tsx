import { Gallery4 } from "@/components/blocks/gallery4";

const demoData = {
  title: "Noticias",
  description:
    "Descubre las últimas noticias y logros de AMETS GOIEN. Aquí compartimos historias de superación, eventos y proyectos que transforman vidas.",
  items: [
    {
      id: "evento1",
      title: "Taller de Cocina Multicultural",
      description:
        "Un espacio de encuentro donde mujeres migrantes comparten recetas tradicionales y fortalecen lazos comunitarios.",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1080&q=80",
    },
    {
      id: "evento2",
      title: "Jornada de Integración Cultural",
      description:
        "Celebramos la diversidad con música, gastronomía y actividades que promueven la convivencia y el respeto.",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1080&q=80",
    },
    {
      id: "noticia1",
      title: "Nuevo Programa de Apoyo Legal",
      description:
        "Lanzamos un servicio de asesoría jurídica gratuita para mujeres migrantes en proceso de regularización.",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1080&q=80",
    },
    {
      id: "noticia2",
      title: "Historias de Superación",
      description:
        "Conoce el testimonio de Ana, que gracias al acompañamiento de AMETS GOIEN logró estabilidad y esperanza.",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1080&q=80",
    },
    {
      id: "evento3",
      title: "Taller de Autocuidado y Bienestar",
      description:
        "Sesiones de mindfulness y salud mental para fortalecer el bienestar integral de nuestras beneficiarias.",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1080&q=80",
    },
  ],
};

const Gallery4Demo = () => {
  return (
    <section className="w-full py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-4">
        <Gallery4 {...demoData} />
      </div>
    </section>
  );
};

export default Gallery4Demo;
