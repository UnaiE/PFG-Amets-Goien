/**
 * @file SobreNosotrosPage - Página Sobre la Asociación
 * @route /sobre-nosotros
 * @description Página informativa sobre Amets Goien, su misión, visión y equipo
 */
"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SobreNosotrosPage() {
  return (
    <>
      <Navbar />
      <div id="main-content" className="min-h-screen pt-20" style={{ backgroundColor: '#E8D5F2' }} role="main">
        
        {/* Hero Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#8A4D76' }}>
          <div className="max-w-6xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Sobre Ametsgoien
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Acogida, dignidad y acompañamiento para mujeres migrantes
            </p>
          </div>
        </section>

        {/* Quiénes Somos */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: '#8A4D76' }}>
              ¿Quiénes somos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  <strong>Ametsgoien</strong> es una asociación fundada por <strong>Aitor Arbaiza</strong> y <strong>Josu Beaskoetxea</strong>, 
                  un matrimonio de Alonsotegi con tres hijos adolescentes que decidieron transformar una inquietud íntima en un proyecto colectivo.
                </p>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Todo comenzó con una historia que les marcó profundamente: <em>"No podía entender cómo una mujer con un bebé recién nacido 
                  podía estar en la calle en el Bilbao de 2023"</em>. Aquel caso, llegado a través de la red solidaria CVX y el Centro Ignacio Ellacuría, 
                  les hizo preguntarse: ¿qué podemos hacer nosotros?
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  La respuesta fue clara: <strong>"Si las instituciones no pueden dar una solución, decidimos endeudarnos de amor"</strong>. 
                  Así nació Ametsgoien, una casa de 12 habitaciones en Orduña convertida en hogar seguro para mujeres migradas con menores a su cargo.
                </p>
              </div>
              <div className="bg-gray-100 rounded-2xl p-8 border-l-4 border-[#8A4D76]">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>Nuestra Historia</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Durante la crisis de Ucrania, la familia acogió en su propia casa a cuatro mujeres y un traductor. 
                  <em>"Pasamos de cinco a nueve en casa. Tuvimos que reorganizarlo todo, pero nuestros hijos lo vivieron con naturalidad"</em>.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Esa experiencia confirmó que estaban preparados para algo más grande. Con un préstamo familiar y bancario, 
                  adquirieron una casona de 185.000 euros. Y lo que vino después superó todas las expectativas: 
                  <strong>más de 40 voluntarios</strong> de Barcelona, Burgos, San Sebastián, Balmaseda, Bilbao y Orduña 
                  se unieron para lijar, pintar, barnizar y dar vida a este sueño colectivo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Video Entrevista */}
        <section className="py-16 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#F3E8F7' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: '#8A4D76' }}>
              Conoce Ametsgoien
            </h2>
            <p className="text-center text-gray-700 text-lg mb-8">
              Descubre la historia detrás de nuestro proyecto en esta entrevista
            </p>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe 
                className="absolute top-0 left-0 w-full h-full rounded-xl shadow-2xl"
                src="https://www.youtube.com/embed/3Y2qE_eaICo"
                title="Entrevista Ametsgoien"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-center text-gray-600 text-sm mt-4 italic">
              "A veces la solidaridad llega en goteo... pero llega" - Azul Tejerina
            </p>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="py-16 px-4 md:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Misión */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#8A4D76]">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-3xl font-bold mb-4" style={{ color: '#8A4D76' }}>Nuestra Misión</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Proporcionar acogida segura, apoyo integral y acompañamiento personalizado a mujeres migrantes 
                  y sus familias, ofreciendo herramientas para su desarrollo personal, formación laboral y 
                  autonomía económica, siempre desde el respeto a su dignidad y derechos humanos.
                </p>
              </div>

              {/* Visión */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-[#8A4D76]">
                <div className="text-5xl mb-4">🌟</div>
                <h3 className="text-3xl font-bold mb-4" style={{ color: '#8A4D76' }}>Nuestra Visión</h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Ser una organización de referencia en la acogida y acompañamiento de mujeres migrantes, 
                  reconocida por su impacto transformador en las vidas de las personas a las que servimos, 
                  y por contribuir a una sociedad más inclusiva, justa y solidaria.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Qué Hacemos */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: '#8A4D76' }}>
              ¿Qué hacemos?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Alojamiento */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4 text-center">🏠</div>
                <h3 className="text-xl font-bold mb-3 text-center" style={{ color: '#8A4D76' }}>
                  Hogar Seguro
                </h3>
                <p className="text-gray-700 text-center">
                  Una casa de 12 habitaciones en Orduña, renovada con el esfuerzo de decenas de voluntarios, 
                  donde las mujeres y sus hijos encuentran un espacio digno y acogedor.
                </p>
              </div>

              {/* Acompañamiento */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4 text-center">🤝</div>
                <h3 className="text-xl font-bold mb-3 text-center" style={{ color: '#8A4D76' }}>
                  Acompañamiento Integral
                </h3>
                <p className="text-gray-700 text-center">
                  Apoyo personalizado en gestiones administrativas, búsqueda de empleo, formación y todo 
                  lo necesario para lograr la autonomía.
                </p>
              </div>

              {/* Comunidad */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4 text-center">💜</div>
                <h3 className="text-xl font-bold mb-3 text-center" style={{ color: '#8A4D76' }}>
                  Solidaridad Comunitaria
                </h3>
                <p className="text-gray-700 text-center">
                  Un proyecto construido "gota a gota" por una comunidad de voluntarios que creen 
                  en el poder transformador de la ayuda mutua.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="py-16 px-4 md:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: '#8A4D76' }}>
              Nuestros Valores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#8A4D76]">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8A4D76' }}>Dignidad</h3>
                <p className="text-gray-700 text-sm">
                  "Para una madre con hijos, tener un baño propio es la diferencia entre la seguridad y el miedo."
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#8A4D76]">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8A4D76' }}>Solidaridad</h3>
                <p className="text-gray-700 text-sm">
                  Un proyecto construido por la comunidad: voluntarios que llegan "en goteo", pero que llegan.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#8A4D76]">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8A4D76' }}>Amor</h3>
                <p className="text-gray-700 text-sm">
                  "Decidimos endeudarnos de amor" - El motor que impulsa cada acción de Ametsgoien.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#8A4D76]">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8A4D76' }}>Comunidad</h3>
                <p className="text-gray-700 text-sm">
                  Esto lo construye la comunidad, unidos por el sentido y el propósito común.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonio Esperanza */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 md:p-12 shadow-xl border-l-4 border-[#8A4D76]">
              <div className="text-6xl mb-4 text-center">💬</div>
              <blockquote className="text-xl md:text-2xl text-gray-800 italic text-center mb-6 leading-relaxed">
                "Yo sé exactamente lo que viven esas mujeres porque yo lo viví. Si puedo ayudar, ayudo. 
                Todo lo que he recibido quiero devolverlo."
              </blockquote>
              <p className="text-center text-gray-600 font-semibold">
                — Esperanza Acevedo
              </p>
              <p className="text-center text-gray-500 text-sm mt-2">
                Voluntaria del proyecto y antigua solicitante de asilo, ahora con empleo estable y hogar propio
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#8A4D76' }}>
              Únete a nuestra causa
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              Tu apoyo puede transformar vidas. Juntos podemos construir un futuro mejor para las mujeres migrantes y sus familias.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="/colaborar">
                <button 
                  className="px-8 py-4 rounded-full font-bold text-white hover:shadow-2xl hover:scale-105 transition-all text-lg"
                  style={{ backgroundColor: '#8A4D76' }}
                >
                  Donar Ahora
                </button>
              </a>
              <a href="/contacto">
                <button 
                  className="px-8 py-4 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all text-lg border-2"
                  style={{ 
                    color: '#8A4D76',
                    borderColor: '#8A4D76',
                    backgroundColor: 'white'
                  }}
                >
                  Contactar
                </button>
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
