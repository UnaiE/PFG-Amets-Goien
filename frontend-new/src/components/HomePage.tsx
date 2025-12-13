"use client";
import { useEffect, useState } from "react";
import { AnimatedTestimonialsDemo } from "./ui/demo-testimonials";
import Gallery4Demo from "@/components/blocks/gallery4-demo";
import { ImagesSliderDemo } from "./ui/demo-images-slider";

const HomePage = () => {
  const [actividades, setActividades] = useState<any[]>([]);
  const [loadingActividades, setLoadingActividades] = useState(true);

  useEffect(() => {
    fetchActividades();
  }, []);

  const fetchActividades = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/actividades");
      
      if (response.ok) {
        const data = await response.json();
        // Mostrar solo las 6 primeras actividades (las más recientes por ORDER BY id DESC)
        setActividades(data.slice(0, 6));
      }
    } catch (error) {
      console.error("Error fetching actividades:", error);
    } finally {
      setLoadingActividades(false);
    }
  };


  return (
    <div className="bg-[#D8B8C4]">
      {/* HERO - Slider de imágenes con Amets Goien */}
      <section id="inicio">
        <ImagesSliderDemo />
      </section>
      {/* SECCIÓN SOBRE AMETS GOIEN */}
      <section id="ong" className="min-h-screen flex items-center py-12 md:py-16 lg:py-20" style={{ backgroundColor: '#D8B8C4' }}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Columna izquierda - Texto */}
            <div>
              {/* Título unificado para sección SOBRE */}
              <h2 className="text-3xl md:text-4xl font-semibold text-[#8A4D76] text-left mb-8 tracking-tight">
                Sobre AMETS GOIEN
              </h2>
              <p className="text-base md:text-lg mb-6" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
                AMETS GOIEN trabaja por ofrecer apoyo integral a mujeres migrantes y sus hijos, priorizando la dignidad, la seguridad emocional y el acompañamiento humano.
              </p>
              <p className="text-base md:text-lg" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
                Creemos en la importancia de construir un refugio seguro, cálido y humano, donde cada mujer pueda reencontrar su fuerza, recuperar esperanza y avanzar hacia una vida estable.
              </p>
            </div>
            {/* Columna derecha - Imagen placeholder */}
            <div className="w-full h-[400px] lg:h-[500px] rounded-2xl shadow-xl" style={{ backgroundColor: '#B89E93' }}></div>
          </div>
          </div>
        </div>
      </section>
      {/* BLOQUE DE LLAMADA A LA ACCIÓN */}
      <section id="colabora" className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#D8B8C4' }}>
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            {/* Título unificado para sección COLABORA */}
            <h2 className="text-3xl md:text-4xl font-semibold text-[#8A4D76] text-center mb-8 tracking-tight">
              Colabora con AMETS GOIEN
            </h2>
            <p className="mb-8 max-w-3xl mx-auto text-base md:text-lg" style={{ color: '#6B5D5F', lineHeight: '1.5' }}>
              Tu apoyo transforma vidas y ayuda a construir un espacio seguro, humano y digno para mujeres migrantes.
            </p>
            <button 
              className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 px-6 py-2 text-base md:text-lg"
              style={{ 
                backgroundColor: 'white', 
                color: '#8A4D76',
                border: '2.5px solid #8A4D76',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Colaborar / Donar
            </button>
          </div>
        </div>
      </section>
      {/* SECCIÓN DE ÚLTIMAS NOTICIAS */}
        <section id="noticias" className="py-24 bg-[#D8B8C4]">
          <div className="w-full px-4 md:px-16">
            <div className="max-w-7xl mx-auto w-full">

              <Gallery4Demo />
            </div>
          </div>
        </section>
      {/* SECCIÓN DE TESTIMONIOS */}
      <section id="testimonios" className="h-screen flex flex-col py-20" style={{ backgroundColor: '#D8B8C4' }}>
        <div className="w-full px-16">
          <div className="max-w-7xl mx-auto w-full">
            {/* Título unificado para sección TESTIMONIOS */}
            <h2 className="text-3xl md:text-4xl font-semibold text-[#8A4D76] text-left mb-8 tracking-tight">
              Testimonios
            </h2>
            <div className="flex justify-center">
              <AnimatedTestimonialsDemo />
            </div>
          </div>
        </div>
      </section>
      {/* SECCIÓN DE ACTIVIDADES */}

      <section className="min-h-screen flex flex-col justify-center bg-[#D8B8C4]">
        <div className="w-full px-4 md:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-6xl font-bold text-[#8A4D76] mb-8 mt-12 text-left">
              Actividades y Talleres
            </h2>
            <p className="text-2xl text-[#4A3A3C] mb-12 text-left max-w-4xl">
              Cada semana ofrecemos actividades formativas y comunitarias abiertas a mujeres del programa y voluntariado. Este tablón se actualiza según la programación semanal.
            </p>
            
            {loadingActividades ? (
              <div className="text-center py-8">
                <p className="text-xl text-[#8A4D76]">Cargando actividades...</p>
              </div>
            ) : actividades.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xl text-gray-600">No hay actividades programadas actualmente.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-2 md:px-8 py-8">
                {actividades.map((actividad) => (
                  <div 
                    key={actividad.id}
                    className="bg-white rounded-3xl shadow-lg transition-all px-8 py-8 text-left border border-[#D8BFB3] flex flex-col justify-between min-h-[220px]"
                  >
                    <h3 className="text-3xl font-bold text-[#8A4D76] mb-2">{actividad.titulo}</h3>
                    {actividad.fecha && (
                      <p className="text-lg font-semibold text-[#8A4D76] mb-2">{actividad.fecha}</p>
                    )}
                    <p className="text-lg text-[#4A3A3C]">{actividad.descripcion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      {/* SECCIÓN DE CONTACTO */}

      <section className="py-24 flex flex-col items-center justify-center bg-[#F5ECE6]">
        <div className="w-full px-4 md:px-0">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-[#8A4D76] mb-6">Contacto</h2>
            <p className="text-xl text-[#4A3A3C] mb-10">Para más información o colaboración, visita nuestra página de contacto.</p>
            <a href="/contacto">
              <button
                className="rounded-2xl font-semibold px-10 py-4 text-2xl bg-[#8A4D76] text-white shadow-lg hover:scale-105 transition-all duration-300 mx-auto"
                style={{ boxShadow: "0 8px 24px 0 rgba(138,77,118,0.18)" }}
              >
                Ir a la página de contacto
              </button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
