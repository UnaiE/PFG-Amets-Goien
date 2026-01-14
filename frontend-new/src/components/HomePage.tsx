"use client";
import { AnimatedTestimonialsDemo } from "./ui/demo-testimonials";
import Gallery4Demo from "@/components/blocks/gallery4-demo";
import { ImagesSliderDemo } from "./ui/demo-images-slider";

const HomePage = () => {
  return (
    <div className="bg-[#D8B8C4]">
      {/* HERO - Slider de imágenes con Amets Goien */}
      <section id="inicio" className="h-screen">
        <ImagesSliderDemo />
      </section>

      {/* SECCIÓN SOBRE AMETSGOIEN */}
      <section id="ong" className="min-h-screen flex items-center justify-center py-20" style={{ backgroundColor: '#D8B8C4' }}>
        <div className="w-full px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center mb-16">
              {/* Columna izquierda - Texto */}
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#8A4D76] text-left mb-8 tracking-tight">
                  Sobre AMETSGOIEN
                </h2>
                <p className="text-base md:text-lg lg:text-xl mb-6" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
                  AMETSGOIEN trabaja por ofrecer apoyo integral a mujeres migrantes y sus hijos, priorizando la dignidad, la seguridad emocional y el acompañamiento humano.
                </p>
                <p className="text-base md:text-lg lg:text-xl mb-8" style={{ color: '#4A3A3C', lineHeight: '1.7' }}>
                  Creemos en la importancia de construir un refugio seguro, cálido y humano, donde cada mujer pueda reencontrar su fuerza, recuperar esperanza y avanzar hacia una vida estable.
                </p>
                {/* Botón de colaborar */}
                <a href="/colaborar">
                  <button 
                    className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 px-8 py-3 text-lg"
                    style={{ 
                      backgroundColor: '#8A4D76', 
                      color: 'white',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Colaborar / Donar
                  </button>
                </a>
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
                <video 
                  className="w-full rounded-2xl shadow-2xl"
                  style={{ maxHeight: '400px' }}
                  controls
                  preload="metadata"
                >
                  <source src="/video-ametsgoien.mp4" type="video/mp4" />
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE ÚLTIMAS NOTICIAS */}
      <section id="noticias" className="py-16 bg-[#D8B8C4]">
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

      {/* SECCIÓN DE CONTACTO */}
      <section id="contacto" className="min-h-screen flex items-center justify-center py-20 bg-[#E8D5F2]">
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
