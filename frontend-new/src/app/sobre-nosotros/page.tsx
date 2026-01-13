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
                  <strong>Ametsgoien</strong> es una asociación sin ánimo de lucro dedicada a proporcionar acogida, 
                  apoyo y acompañamiento integral a mujeres migrantes y sus familias que se encuentran en 
                  situación de vulnerabilidad.
                </p>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  Fundada con la visión de construir un refugio seguro y digno, trabajamos día a día para 
                  ofrecer no solo alojamiento temporal, sino también herramientas que permitan a estas mujeres 
                  alcanzar la autonomía económica y social.
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Creemos firmemente en el poder transformador de la solidaridad, el respeto y el acompañamiento 
                  personalizado como pilares fundamentales de nuestra labor.
                </p>
              </div>
              <div className="bg-gray-100 rounded-2xl p-8 border-l-4 border-[#8A4D76]">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>Nuestra Historia</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ametsgoien nació de la necesidad urgente de ofrecer un espacio seguro para mujeres que 
                  han tenido que dejar atrás sus países en busca de mejores oportunidades. Desde nuestros 
                  inicios, hemos trabajado incansablemente para convertir este sueño en realidad, creando 
                  programas que van más allá del simple alojamiento.
                </p>
              </div>
            </div>
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
                  Alojamiento Seguro
                </h3>
                <p className="text-gray-700 text-center">
                  Proporcionamos un espacio digno, seguro y acogedor donde las mujeres y sus hijos pueden 
                  vivir mientras reconstruyen sus vidas y encuentran estabilidad.
                </p>
              </div>

              {/* Formación */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4 text-center">📚</div>
                <h3 className="text-xl font-bold mb-3 text-center" style={{ color: '#8A4D76' }}>
                  Formación y Talleres
                </h3>
                <p className="text-gray-700 text-center">
                  Ofrecemos talleres de formación laboral, idiomas, informática y habilidades para la vida 
                  que facilitan la inserción sociolaboral y el desarrollo personal.
                </p>
              </div>

              {/* Apoyo Psicológico */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4 text-center">💚</div>
                <h3 className="text-xl font-bold mb-3 text-center" style={{ color: '#8A4D76' }}>
                  Apoyo Psicológico
                </h3>
                <p className="text-gray-700 text-center">
                  Brindamos acompañamiento psicológico y emocional para ayudar a superar traumas, 
                  fortalecer la autoestima y fomentar el bienestar mental.
                </p>
              </div>

              {/* Asesoramiento Legal */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4 text-center">⚖️</div>
                <h3 className="text-xl font-bold mb-3 text-center" style={{ color: '#8A4D76' }}>
                  Asesoramiento Legal
                </h3>
                <p className="text-gray-700 text-center">
                  Orientamos en trámites legales, documentación, solicitudes de asilo y otros procesos 
                  administrativos necesarios para regularizar su situación.
                </p>
              </div>

              {/* Acompañamiento Social */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4 text-center">🤝</div>
                <h3 className="text-xl font-bold mb-3 text-center" style={{ color: '#8A4D76' }}>
                  Acompañamiento Social
                </h3>
                <p className="text-gray-700 text-center">
                  Acompañamos en la búsqueda de empleo, gestiones administrativas, acceso a recursos 
                  sociales y todo lo necesario para lograr la autonomía.
                </p>
              </div>

              {/* Actividades Comunitarias */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4 text-center">🎨</div>
                <h3 className="text-xl font-bold mb-3 text-center" style={{ color: '#8A4D76' }}>
                  Actividades Comunitarias
                </h3>
                <p className="text-gray-700 text-center">
                  Organizamos actividades culturales, recreativas y deportivas que fomentan la integración, 
                  el sentido de comunidad y el desarrollo de vínculos positivos.
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
                  Respetamos y defendemos la dignidad de cada persona, sin importar su origen o situación.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#8A4D76]">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8A4D76' }}>Solidaridad</h3>
                <p className="text-gray-700 text-sm">
                  Trabajamos juntos para construir una sociedad más justa e inclusiva para todos.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#8A4D76]">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8A4D76' }}>Empoderamiento</h3>
                <p className="text-gray-700 text-sm">
                  Proporcionamos herramientas para que cada mujer alcance su máximo potencial.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#8A4D76]">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8A4D76' }}>Compromiso</h3>
                <p className="text-gray-700 text-sm">
                  Nos comprometemos plenamente con la transformación positiva de vidas.
                </p>
              </div>
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
