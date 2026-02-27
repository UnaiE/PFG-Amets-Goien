/**
 * @file SobreNosotrosPage - Página Sobre la Asociación
 * @route /sobre-nosotros
 * @description Página informativa sobre Amets Goien, su misión, visión y equipo
 */
"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RemodelacionTimeline from "@/components/RemodelacionTimeline";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SobreNosotrosPage() {
  const { t } = useLanguage();

  return (
    <>
      <Navbar />
      <div id="main-content" className="min-h-screen pt-20" style={{ backgroundColor: '#E8D5F2' }} role="main">
        
        {/* Hero Section */}
        <section className="py-16 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#8A4D76' }}>
          <div className="max-w-6xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('about.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              {t('about.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Quiénes Somos */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: '#8A4D76' }}>
              {t('about.whoWeAre.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  <strong>Ametsgoien</strong> {t('about.whoWeAre.p1')} <strong>Aitor Arbaiza</strong> y <strong>Josu Beaskoetxea</strong>, 
                  {t('about.whoWeAre.p1b')}
                </p>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {t('about.whoWeAre.p2')} <em>"{t('about.whoWeAre.p2quote')}"</em>. {t('about.whoWeAre.p2b')}
                </p>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {t('about.whoWeAre.p3')} <strong>"{t('about.whoWeAre.p3quote')}"</strong>. 
                  {t('about.whoWeAre.p3b')}
                </p>
              </div>
              <div className="bg-gray-100 rounded-2xl p-8 border-l-4 border-[#8A4D76]">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>{t('about.whoWeAre.historyTitle')}</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {t('about.whoWeAre.historyP1')}
                  <em>"{t('about.whoWeAre.historyP1quote')}"</em>.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {t('about.whoWeAre.historyP2')}
                  <strong>{t('about.whoWeAre.historyP2b')}</strong> {t('about.whoWeAre.historyP2c')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Video Entrevista */}
        <section className="py-16 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#F3E8F7' }}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center" style={{ color: '#8A4D76' }}>
              {t('about.video.title')}
            </h2>
            <p className="text-center text-gray-700 text-lg mb-8">
              {t('about.video.subtitle')}
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
              "{t('about.video.quote')}"
            </p>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="py-16 px-4 md:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 gap-4 md:gap-8">
              
              {/* Misión */}
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border-t-4 border-[#8A4D76]">
                
                <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-4" style={{ color: '#8A4D76' }}>{t('about.mission.title')}</h3>
                <p className="text-gray-700 text-sm md:text-lg leading-relaxed">
                  {t('about.mission.text')}
                </p>
              </div>

              {/* Visión */}
              <div className="bg-white rounded-2xl shadow-lg p-4 md:p-8 border-t-4 border-[#8A4D76]">
                
                <h3 className="text-xl md:text-3xl font-bold mb-2 md:mb-4" style={{ color: '#8A4D76' }}>{t('about.vision.title')}</h3>
                <p className="text-gray-700 text-sm md:text-lg leading-relaxed">
                  {t('about.vision.text')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Qué Hacemos */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: '#8A4D76' }}>
              {t('about.whatWeDo.title')}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              
              {/* Alojamiento */}
              <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                
                <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 text-center" style={{ color: '#8A4D76' }}>
                  {t('about.whatWeDo.housing.title')}
                </h3>
                <p className="text-gray-700 text-xs md:text-base text-center">
                  {t('about.whatWeDo.housing.text')}
                </p>
              </div>

              {/* Acompañamiento */}
              <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                
                <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 text-center" style={{ color: '#8A4D76' }}>
                  {t('about.whatWeDo.support.title')}
                </h3>
                <p className="text-gray-700 text-xs md:text-base text-center">
                  {t('about.whatWeDo.support.text')}
                </p>
              </div>

              {/* Comunidad */}
              <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-200 hover:shadow-lg transition-shadow">

                <h3 className="text-base md:text-xl font-bold mb-2 md:mb-3 text-center" style={{ color: '#8A4D76' }}>
                  {t('about.whatWeDo.community.title')}
                </h3>
                <p className="text-gray-700 text-xs md:text-base text-center">
                  {t('about.whatWeDo.community.text')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline de Remodelación */}
        <section className="py-16" style={{ backgroundColor: '#F3E8F7' }}>
          <RemodelacionTimeline />
        </section>

        {/* Valores */}
        <section className="py-16 px-4 md:px-8 lg:px-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center" style={{ color: '#8A4D76' }}>
              {t('about.values.title')}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#8A4D76]">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8A4D76' }}>{t('about.values.welcome')}</h3>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#8A4D76]">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8A4D76' }}>{t('about.values.protect')}</h3>
  
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#8A4D76]">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8A4D76' }}>{t('about.values.promote')}</h3>
                
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md text-center border-b-4 border-[#8A4D76]">
                <h3 className="text-xl font-bold mb-2" style={{ color: '#8A4D76' }}>{t('about.values.integrate')}</h3>
                
              </div>
            </div>
          </div>
        </section>

        

        {/* Call to Action */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: '#8A4D76' }}>
              {t('about.cta.title')}
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              {t('about.cta.subtitle')}
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a href="/colaborar">
                <button 
                  className="px-8 py-4 rounded-full font-bold text-white hover:shadow-2xl hover:scale-105 transition-all text-lg"
                  style={{ backgroundColor: '#8A4D76' }}
                >
                   {t('about.cta.donate')}
                </button>
              </a>
              <a href="/voluntarios">
                <button 
                  className="px-8 py-4 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all text-lg border-2"
                  style={{ 
                    color: '#8A4D76',
                    borderColor: '#8A4D76',
                    backgroundColor: 'white'
                  }}
                >
                   {t('about.cta.volunteer')}
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
                   {t('about.cta.contact')}
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
