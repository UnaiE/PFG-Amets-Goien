"use client";
import { useEffect, useState } from "react";
import { Gallery4 } from "@/components/blocks/gallery4";

const Gallery4Demo = () => {
  const [noticias, setNoticias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedNoticia, setExpandedNoticia] = useState<number | null>(null);

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      // Hacemos la llamada sin autenticación para que sea pública
      const response = await fetch(`${API_URL}/api/noticias`);
      
      if (response.ok) {
        const data = await response.json();
        setNoticias(data);
      }
    } catch (error) {
      console.error("Error fetching noticias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNoticiaClick = (noticiaId: number) => {
    setExpandedNoticia(expandedNoticia === noticiaId ? null : noticiaId);
  };

  const demoData = {
    title: "",
    description:
      "Descubre las últimas noticias y logros de AMETSGOIEN. Aquí compartimos historias de superación, eventos y proyectos que transforman vidas.",
    items: noticias.map((noticia) => ({
      id: `noticia-${noticia.id}`,
      noticiaId: noticia.id,
      title: noticia.titulo,
      description: noticia.contenido?.substring(0, 150) + "..." || "Sin descripción",
      fullContent: noticia.contenido || "Sin contenido completo",
      href: "#",
      image: noticia.url_imagen || "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1080&q=80"
    })),
    expandedNoticia,
    onNoticiaClick: handleNoticiaClick
  };

  if (loading) {
    return (
      <section className="w-full py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xl text-[#8A4D76]">Cargando noticias...</p>
        </div>
      </section>
    );
  }

  if (noticias.length === 0) {
    return (
      <section className="w-full py-10 md:py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-[#8A4D76] mb-4">Noticias</h2>
          <p className="text-lg text-gray-600">No hay noticias publicadas aún.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-6 md:py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8A4D76] text-left mb-12 tracking-tight">
          Noticias
        </h2>
        <Gallery4 {...demoData} />
      </div>
    </section>
  );
};

export default Gallery4Demo;
