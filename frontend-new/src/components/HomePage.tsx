import { AnimatedTestimonialsDemo } from "./ui/demo-testimonials";
import Gallery4Demo from "@/components/blocks/gallery4-demo";

const HomePage = () => {
  // Importing the animated testimonials component


  return (
    <div className="bg-white">
      {/* HERO - Nombre grande de Amets Goien */}
      <section className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#D8BFB3' }}>
        <div className="w-full px-16">
          <div className="max-w-7xl mx-auto w-full text-center">
            <h1 className="text-6xl md:text-7xl font-bold mb-8" style={{ color: '#8A4D76', lineHeight: '1.1' }}>
              Amets Goien
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#4A3A3C', lineHeight: '1.2' }}>
              Acogida, dignidad y acompañamiento
            </h2>
            <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto" style={{ color: '#6B5D5F', lineHeight: '1.5' }}>
              Construyendo un refugio seguro junto a mujeres migrantes.
            </p>
            <button 
              className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer px-6 py-2"
              style={{ 
                backgroundColor: 'white', 
                color: '#8A4D76',
                border: '2.5px solid #8A4D76',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Descubre Nuestro Trabajo
            </button>
          </div>
        </div>
      </section>
      {/* SECCIÓN SOBRE AMETS GOIEN */}
      <section className="min-h-screen flex items-center py-20" style={{ backgroundColor: '#D8BFB3' }}>
        <div className="w-full px-16">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Columna izquierda - Texto */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8" style={{ color: '#8A4D76', lineHeight: '1.2' }}>
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
      <section className="min-h-[40vh] flex items-center justify-center" style={{ backgroundColor: '#D8BFB3' }}>
        <div className="w-full px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6" style={{ color: '#8A4D76', lineHeight: '1.1' }}>
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
        <section className="py-24 bg-[#F5F0EB]">
          <div className="w-full px-4 md:px-16">
            <div className="max-w-7xl mx-auto w-full">
              <Gallery4Demo />
            </div>
          </div>
        </section>
      {/* SECCIÓN DE TESTIMONIOS */}
      <section className="h-screen flex flex-col py-20" style={{ backgroundColor: '#FAF6F2' }}>
        <div className="w-full px-16">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-5xl md:text-6xl font-bold mb-24 text-center" style={{ color: '#8A4D76' }}>
              Testimonios
            </h2>
            <div className="flex justify-center">
              <AnimatedTestimonialsDemo />
            </div>
          </div>
        </div>
      </section>
      {/* SECCIÓN DE ACTIVIDADES */}

      <section className="min-h-screen flex flex-col justify-center bg-[#F5F0EB]">
        <div className="w-full px-4 md:px-16">
          <div className="max-w-7xl mx-auto w-full">
            <h2 className="text-6xl font-bold text-[#8A4D76] mb-8 mt-12 text-left">
              Actividades y Talleres
            </h2>
            <p className="text-2xl text-[#4A3A3C] mb-12 text-left max-w-4xl">
              Cada semana ofrecemos actividades formativas y comunitarias abiertas a mujeres del programa y voluntariado. Este tablón se actualiza según la programación semanal.
            </p>
            {/* GRID DE ACTIVIDADES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 px-2 md:px-8 py-8">
              {/* Card 1 */}
              <div className="bg-white rounded-3xl shadow-lg transition-all px-8 py-8 text-left border border-[#D8BFB3] flex flex-col justify-between min-h-[220px]">
                <h3 className="text-3xl font-bold text-[#8A4D76] mb-2">Taller de Capacitación Laboral</h3>
                <p className="text-lg font-semibold text-[#8A4D76] mb-2">15 de Diciembre, 2025</p>
                <p className="text-lg text-[#4A3A3C]">Formación profesional enfocada en habilidades digitales y empleabilidad para mujeres migrantes.</p>
              </div>
              {/* Card 2 */}
              <div className="bg-white rounded-3xl shadow-lg transition-all px-8 py-8 text-left border border-[#D8BFB3] flex flex-col justify-between min-h-[220px]">
                <h3 className="text-3xl font-bold text-[#8A4D76] mb-2">Jornada de Integración Cultural</h3>
                <p className="text-lg font-semibold text-[#8A4D76] mb-2">20 de Diciembre, 2025</p>
                <p className="text-lg text-[#4A3A3C]">Encuentro intercultural con actividades, música y gastronomía de diferentes países.</p>
              </div>
              {/* Card 3 */}
              <div className="bg-white rounded-3xl shadow-lg transition-all px-8 py-8 text-left border border-[#D8BFB3] flex flex-col justify-between min-h-[220px]">
                <h3 className="text-3xl font-bold text-[#8A4D76] mb-2">Sesión de Apoyo Psicológico</h3>
                <p className="text-lg font-semibold text-[#8A4D76] mb-2">Todos los Lunes</p>
                <p className="text-lg text-[#4A3A3C]">Espacio seguro de acompañamiento emocional y terapia grupal para el bienestar integral.</p>
              </div>
              {/* Card 4 */}
              <div className="bg-white rounded-3xl shadow-lg transition-all px-8 py-8 text-left border border-[#D8BFB3] flex flex-col justify-between min-h-[220px]">
                <h3 className="text-3xl font-bold text-[#8A4D76] mb-2">Clases de Español</h3>
                <p className="text-lg font-semibold text-[#8A4D76] mb-2">Martes y Jueves, 18:00h</p>
                <p className="text-lg text-[#4A3A3C]">Cursos de español para facilitar la integración lingüística y mejorar oportunidades laborales.</p>
              </div>
              {/* Card 5 */}
              <div className="bg-white rounded-3xl shadow-lg transition-all px-8 py-8 text-left border border-[#D8BFB3] flex flex-col justify-between min-h-[220px]">
                <h3 className="text-3xl font-bold text-[#8A4D76] mb-2">Asesoramiento Legal</h3>
                <p className="text-lg font-semibold text-[#8A4D76] mb-2">Miércoles, 10:00 - 14:00h</p>
                <p className="text-lg text-[#4A3A3C]">Orientación jurídica gratuita sobre derechos, documentación y procesos de regularización.</p>
              </div>
              {/* Card 6 */}
              <div className="bg-white rounded-3xl shadow-lg transition-all px-8 py-8 text-left border border-[#D8BFB3] flex flex-col justify-between min-h-[220px]">
                <h3 className="text-3xl font-bold text-[#8A4D76] mb-2">Taller de Autocuidado</h3>
                <p className="text-lg font-semibold text-[#8A4D76] mb-2">5 de Enero, 2026</p>
                <p className="text-lg text-[#4A3A3C]">Actividades de bienestar, mindfulness y cuidado personal para fortalecer la salud mental.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SECCIÓN DE CONTACTO */}

      <section className="py-24 flex flex-col items-center justify-center bg-[#F5ECE6]">
        <div className="w-full px-4 md:px-0">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-5xl font-bold text-[#8A4D76] mb-6">Contacto</h2>
            <p className="text-xl text-[#4A3A3C] mb-10">Para más información o colaboración, visita nuestra página de contacto.</p>
            <button
              className="rounded-2xl font-semibold px-10 py-4 text-2xl bg-[#8A4D76] text-white shadow-lg hover:scale-105 transition-all duration-300 mx-auto"
              style={{ boxShadow: "0 8px 24px 0 rgba(138,77,118,0.18)" }}
            >
              Ir a la página de contacto
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
