"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  url_imagen?: string;
  creado_por_username?: string;
  creado_en?: string;
}

export default function NoticiasCarousel() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNoticia, setSelectedNoticia] = useState<Noticia | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? noticias.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === noticias.length - 1 ? 0 : prev + 1));
  };

  const getVisibleNoticias = () => {
    if (noticias.length === 0) return [];
    
    const visible = [];
    const totalVisible = Math.min(3, noticias.length);
    
    for (let i = 0; i < totalVisible; i++) {
      const index = (currentIndex + i) % noticias.length;
      visible.push(noticias[index]);
    }
    
    return visible;
  };

  if (loading) {
    return (
      <div className="w-full py-16 text-center">
        <p className="text-xl text-[#8A4D76]">Cargando noticias...</p>
      </div>
    );
  }

  if (noticias.length === 0) {
    return (
      <div className="w-full py-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8A4D76] text-center mb-6">
          Noticias
        </h2>
        <p className="text-lg text-gray-600 text-center">
          No hay noticias publicadas aún.
        </p>
      </div>
    );
  }

  const visibleNoticias = getVisibleNoticias();

  return (
    <>
      <div className="w-full py-6 md:py-10">
        {/* Título */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8A4D76] text-center mb-8 md:mb-12 tracking-tight px-4">
          Últimas Noticias
        </h2>

        {/* Controles de navegación */}
        <div className="flex justify-center gap-3 md:gap-4 mb-6 md:mb-8">
          <Button
            onClick={handlePrev}
            variant="ghost"
            size="icon"
            className="bg-[#8A4D76] hover:bg-[#a98bb0] text-white rounded-full h-10 w-10 md:h-12 md:w-12 shadow-lg transition-all"
          >
            <ArrowLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
          <Button
            onClick={handleNext}
            variant="ghost"
            size="icon"
            className="bg-[#8A4D76] hover:bg-[#a98bb0] text-white rounded-full h-10 w-10 md:h-12 md:w-12 shadow-lg transition-all"
          >
            <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
          </Button>
        </div>

        {/* Grid de noticias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 max-w-7xl mx-auto">
          {visibleNoticias.map((noticia) => (
            <div
              key={noticia.id}
              className="group relative bg-white rounded-lg md:rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 md:hover:-translate-y-2"
              onClick={() => setSelectedNoticia(noticia)}
            >
              {/* Imagen */}
              <div className="relative h-48 sm:h-56 overflow-hidden">
                <img
                  src={
                    noticia.url_imagen ||
                    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1080&q=80"
                  }
                  alt={noticia.titulo}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Contenido */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-[#8A4D76] mb-2 sm:mb-3 line-clamp-2 group-hover:text-[#a98bb0] transition-colors">
                  {noticia.titulo}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 mb-3 sm:mb-4">
                  {noticia.contenido}
                </p>
                
                <div className="inline-flex items-center text-[#8A4D76] font-semibold text-sm group-hover:text-[#a98bb0] transition-colors">
                  Leer más
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicadores de posición */}
        <div className="flex justify-center gap-2 mt-6 md:mt-8 px-4">
          {noticias.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-6 sm:w-8 bg-[#8A4D76]"
                  : "w-2 bg-[#8A4D76]/30 hover:bg-[#8A4D76]/50"
              }`}
              aria-label={`Ir a noticia ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Modal de noticia completa */}
      {selectedNoticia && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-300"
          onClick={() => setSelectedNoticia(null)}
        >
          <div
            className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4 duration-500"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen destacada */}
            <div className="relative h-48 sm:h-64 md:h-96 overflow-hidden rounded-t-xl sm:rounded-t-2xl">
              <img
                src={
                  selectedNoticia.url_imagen ||
                  "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1080&q=80"
                }
                alt={selectedNoticia.titulo}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Botón cerrar */}
              <button
                onClick={() => setSelectedNoticia(null)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white/90 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-lg transition-all"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-[#8A4D76]" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-4 sm:p-6 md:p-10">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#8A4D76] mb-4 sm:mb-6">
                {selectedNoticia.titulo}
              </h2>

              {/* Contenido completo */}
              <div className="prose prose-sm sm:prose-base md:prose-lg max-w-none">
                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed whitespace-pre-wrap">
                  {selectedNoticia.contenido}
                </p>
              </div>

              {/* Botón de cierre inferior */}
              <div className="mt-6 sm:mt-8 flex justify-center">
                <Button
                  onClick={() => setSelectedNoticia(null)}
                  className="bg-[#8A4D76] hover:bg-[#a98bb0] text-white px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-base rounded-full shadow-lg transition-all w-full sm:w-auto"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
