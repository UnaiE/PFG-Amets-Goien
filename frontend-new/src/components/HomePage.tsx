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
      <section id="inicio" className="h-screen">
        <ImagesSliderDemo />
      </section>

      {/* SECCIÓN SOBRE AMETS GOIEN */}
      <section id="ong" className="min-h-screen flex items-center justify-center py-20" style={{ backgroundColor: '#D8B8C4' }}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              {/* Columna izquierda - Texto */}
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8A4D76] text-left mb-8 tracking-tight">
                  Sobre AMETS GOIEN
                </h2>
                <p className="text-base md:text-lg lg:text-xl mb-6" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
                  AMETS GOIEN trabaja por ofrecer apoyo integral a mujeres migrantes y sus hijos, priorizando la dignidad, la seguridad emocional y el acompañamiento humano.
                </p>
                <p className="text-base md:text-lg lg:text-xl" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
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
      <section id="colabora" className="min-h-screen flex items-center justify-center py-20" style={{ backgroundColor: '#D8B8C4' }}>
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8A4D76] text-center mb-8 tracking-tight">
              Colabora con AMETS GOIEN
            </h2>
            <p className="mb-8 max-w-3xl mx-auto text-base md:text-lg lg:text-xl" style={{ color: '#6B5D5F', lineHeight: '1.5' }}>
              Tu apoyo transforma vidas y ayuda a construir un espacio seguro, humano y digno para mujeres migrantes.
            </p>
            <a href="/colaborar">
              <button 
                className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 px-8 py-3 text-lg md:text-xl"
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
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE ÚLTIMAS NOTICIAS */}
      <section id="noticias" className="min-h-screen flex items-center justify-center py-20 bg-[#D8B8C4]">
        <div className="w-full px-4 md:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <Gallery4Demo />
          </div>
        </div>
      </section>

      {/* SECCIÓN DE TESTIMONIOS */}
      <section id="testimonios" className="min-h-screen flex items-center justify-center py-20" style={{ backgroundColor: '#D8B8C4' }}>
        <div className="w-full px-4 md:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8A4D76] text-left mb-12 tracking-tight">
              Testimonios
            </h2>
            <div className="flex justify-center">
              <AnimatedTestimonialsDemo />
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE ACTIVIDADES */}
      <section id="actividades" className="min-h-screen flex items-center justify-center py-20 bg-[#D8B8C4]">
        <div className="w-full px-4 md:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#8A4D76] mb-8 text-left tracking-tight">
              Actividades y Talleres
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl text-[#4A3A3C] mb-12 text-left max-w-4xl">
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
                {actividades.map((actividad, index) => {
                  // Colores de fondo alternados para cada tarjeta
                  const colors = [
                    { bg: 'bg-gradient-to-br from-purple-100 to-pink-100', border: 'border-purple-300', icon: '🎨' },
                    { bg: 'bg-gradient-to-br from-blue-100 to-cyan-100', border: 'border-blue-300', icon: '📚' },
                    { bg: 'bg-gradient-to-br from-green-100 to-teal-100', border: 'border-green-300', icon: '🌱' },
                    { bg: 'bg-gradient-to-br from-yellow-100 to-orange-100', border: 'border-yellow-300', icon: '✨' },
                    { bg: 'bg-gradient-to-br from-rose-100 to-red-100', border: 'border-rose-300', icon: '❤️' },
                    { bg: 'bg-gradient-to-br from-indigo-100 to-purple-100', border: 'border-indigo-300', icon: '🎭' }
                  ];
                  const colorScheme = colors[index % colors.length];
                  
                  return (
                    <div 
                      key={actividad.id}
                      className={`${colorScheme.bg} rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 px-8 py-8 text-left border-2 ${colorScheme.border} flex flex-col justify-between min-h-[220px] transform hover:-translate-y-2 hover:scale-105 group relative overflow-hidden`}
                    >
                      {/* Icono decorativo en la esquina */}
                      <div className="absolute top-4 right-4 text-5xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 group-hover:rotate-12 transform">
                        {colorScheme.icon}
                      </div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-4xl">{colorScheme.icon}</span>
                          <h3 className="text-3xl font-bold text-[#8A4D76] group-hover:text-[#6B3A5E] transition-colors duration-300">
                            {actividad.titulo}
                          </h3>
                        </div>
                        
                        {actividad.fecha && (
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xl">📅</span>
                            <p className="text-lg font-semibold text-[#8A4D76] bg-white/50 px-3 py-1 rounded-full inline-block">
                              {actividad.fecha}
                            </p>
                          </div>
                        )}
                        
                        <p className="text-lg text-[#4A3A3C] leading-relaxed">
                          {actividad.descripcion}
                        </p>
                      </div>
                      
                      {/* Elemento decorativo de fondo */}
                      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mb-16 group-hover:scale-150 transition-transform duration-500"></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SECCIÓN DE CONTACTO */}
      <section id="contacto" className="min-h-screen flex items-center justify-center py-20 bg-[#F5ECE6]">
        <div className="w-full px-4 md:px-0">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8A4D76] mb-8 tracking-tight">
              Contacto
            </h2>
            <p className="text-lg md:text-xl text-[#4A3A3C] mb-10 max-w-xl mx-auto">
              Para más información o colaboración, visita nuestra página de contacto.
            </p>
            <a href="/contacto">
              <button
                className="rounded-full font-medium px-8 py-3 text-lg md:text-xl bg-[#8A4D76] text-white shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
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
