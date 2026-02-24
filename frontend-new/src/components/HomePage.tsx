"use client";
import { AnimatedTestimonialsDemo } from "./ui/demo-testimonials";
import NoticiasCarousel from "@/components/NoticiasCarousel";
import { ImagesSliderDemo } from "./ui/demo-images-slider";

const HomePage = () => {
  return (
    <div className="bg-[#D8B8C4]">
      {/* HERO - Slider de imágenes con Amets Goien */}
      <section id="inicio" className="h-screen">
        <ImagesSliderDemo />
      </section>

      {/* SECCIÓN SOBRE AMETSGOIEN */}
      <section id="ong" className="min-h-screen flex items-center justify-center py-20" style={{ backgroundColor: '#F3E8F7' }}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-16">
              {/* Columna izquierda - Texto */}
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8A4D76] text-left mb-8 tracking-tight">
                  Sobre AMETSGOIEN
                </h1>
                <p className="text-base md:text-lg lg:text-xl mb-6" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
                  AMETSGOIEN trabaja por ofrecer apoyo integral a mujeres migrantes y sus hijos, priorizando la dignidad, la seguridad emocional y el acompañamiento humano.
                </p>
                <p className="text-base md:text-lg lg:text-xl mb-8" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
                  Creemos en la importancia de construir un refugio seguro, cálido y humano, donde cada mujer pueda reencontrar su fuerza, recuperar esperanza y avanzar hacia una vida estable.
                </p>
                {/* Botones de colaborar y voluntariado */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="/colaborar">
                    <button 
                      className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 px-8 py-3 text-lg w-full sm:w-auto"
                      style={{ 
                        backgroundColor: '#8A4D76', 
                        color: 'white',
                        letterSpacing: '0.3px',
                      }}
                    >
                      Colaborar / Donar
                    </button>
                  </a>
                  <a href="/voluntarios">
                    <button 
                      className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 px-8 py-3 text-lg border-2 w-full sm:w-auto"
                      style={{ 
                        color: '#8A4D76',
                        borderColor: '#8A4D76',
                        backgroundColor: 'white',
                        letterSpacing: '0.3px',
                      }}
                    >
                      🤝 Hazte Voluntario
                    </button>
                  </a>
                </div>
              </div>
              {/* Columna derecha - Logo */}
              <div className="w-full h-[400px] lg:h-[500px] rounded-2xl shadow-xl bg-white flex items-center justify-center p-8 md:p-12 lg:p-16">
                <img 
                  src="/logo-blanco.svg" 
                  alt="Logo Ametsgoien" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Video dentro de la sección Sobre AMETSGOIEN */}
            <div className="mt-12">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-[#8A4D76] text-center mb-8 tracking-tight">
                Nuestra Historia
              </h3>
              <div className="w-full max-w-2xl mx-auto">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe 
                    className="absolute top-0 left-0 w-full h-full rounded-2xl shadow-2xl"
                    src="https://www.youtube.com/embed/iCzmfyUELgA"
                    title="Presentación Amets Goien"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE ÚLTIMAS NOTICIAS */}
      <section id="noticias" className="py-16 bg-[#E8D5F2]">
        <div className="w-full px-4 md:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <NoticiasCarousel />
          </div>
        </div>
      </section>

      {/* SECCIÓN DE TESTIMONIOS */}
      <section id="testimonios" className="min-h-screen flex items-center justify-center py-20" style={{ backgroundColor: '#F3E8F7' }}>
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

      {/* SECCIÓN DE VOLUNTARIADO */}
      <section className="py-20" style={{ backgroundColor: '#8A4D76' }}>
        <div className="max-w-5xl mx-auto px-4 md:px-8 text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            ¿Quieres formar parte del cambio?
          </h2>
          <p className="text-xl md:text-2xl opacity-90 mb-8 max-w-3xl mx-auto">
            Tu tiempo y dedicación pueden transformar vidas. Únete como voluntario/a y ayúdanos a construir un refugio seguro para mujeres migrantes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/voluntarios">
              <button
                className="rounded-full font-bold px-10 py-4 text-lg bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
                style={{ color: '#8A4D76' }}
              >
                🤝 Hazte Voluntario
              </button>
            </a>
            <a href="/colaborar">
              <button
                className="rounded-full font-bold px-10 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-[#8A4D76] hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                💜 Hacer una Donación
              </button>
            </a>
            <a href="/contacto">
              <button
                className="rounded-full font-bold px-10 py-4 text-lg bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
                style={{ color: '#8A4D76' }}
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
