/**
 * @file PrivacidadPage - Página de Política de Privacidad
 * @route /privacidad
 * @description Política de privacidad GDPR con información sobre tratamiento de datos personales
 */
"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacidadPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const sectionIds = [
    'section1',
    'section2',
    'section3',
    'section4',
    'section5',
    'section6',
    'section7',
    'section8',
    'section9',
    'section10',
    'section11'
  ];

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 px-4 md:px-8 lg:px-16 bg-slate-100">
        <div className="max-w-5xl mx-auto py-10 md:py-14">
          <button
            onClick={() => router.back()}
            className="mb-6 px-5 py-2 rounded-full bg-white text-[#8A4D76] font-semibold border border-slate-200 hover:shadow-sm transition-all"
          >
            ← {t('privacy.backButton')}
          </button>

          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="px-7 md:px-12 py-8 border-b border-slate-200 bg-gradient-to-r from-[#8A4D76] to-[#6f3d5f]">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {t('privacy.title')}
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-3xl">
                {t('privacy.subtitle')}
              </p>
            </div>

            <div className="px-7 md:px-12 py-6 border-b border-slate-200 bg-slate-50">
              <h2 className="text-sm uppercase tracking-wide text-slate-500 font-semibold mb-3">{t('privacy.indexTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {sectionIds.map((sectionId) => (
                  <a
                    key={sectionId}
                    href={`#${sectionId}`}
                    className="text-sm text-slate-700 hover:text-[#8A4D76] hover:underline"
                  >
                    {t(`privacy.${sectionId}.title`)}
                  </a>
                ))}
              </div>
            </div>

            <div className="px-7 md:px-12 py-8 md:py-10 space-y-8 text-slate-700 leading-relaxed">

              {/* 1 */}
              <section id="section1" className="scroll-mt-28">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section1.title')}
                </h2>
                <p className="mb-3">
                  {t('privacy.section1.intro')}
                </p>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-sm mb-1"><strong>{t('privacy.section1.name')}</strong> {t('privacy.section1.nameValue')}</p>
                  <p className="text-sm mb-1"><strong>{t('privacy.section1.cif')}</strong> {t('privacy.section1.cifValue')}</p>
                  <p className="text-sm mb-1"><strong>{t('privacy.section1.address')}</strong> {t('privacy.section1.addressValue')}</p>
                  <p className="text-sm mb-1"><strong>{t('privacy.section1.email')}</strong> {t('privacy.section1.emailValue')}</p>
                  <p className="text-sm"><strong>{t('privacy.section1.phone')}</strong> {t('privacy.section1.phoneValue')}</p>
                </div>
                <p className="mt-3">
                  {t('privacy.section1.contact')}
                </p>
              </section>

              {/* 2 */}
              <section id="section2" className="scroll-mt-28">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section2.title')}
                </h2>
                <p>
                  {t('privacy.section2.text')}
                </p>
              </section>

              {/* 3 */}
              <section id="section3" className="scroll-mt-28">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section3.title')}
                </h2>
                <p>
                  {t('privacy.section3.intro')}
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{t('privacy.section3.contactForm')}</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-slate-700">
                      {Array.isArray(t('privacy.section3.contactItems')) && (t('privacy.section3.contactItems') as string[]).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{t('privacy.section3.donations')}</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-slate-700">
                      {Array.isArray(t('privacy.section3.donationItems')) && (t('privacy.section3.donationItems') as string[]).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* 4 */}
              <section id="section4" className="scroll-mt-28">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section4.title')}
                </h2>
                <p>
                  {t('privacy.section4.intro')}
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  {Array.isArray(t('privacy.section4.purposes')) && (t('privacy.section4.purposes') as string[]).map((purpose: string, index: number) => (
                    <li key={index}>{purpose}</li>
                  ))}
                </ul>
              </section>

              {/* 5 */}
              <section id="section5" className="scroll-mt-28">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section5.title')}
                </h2>
                <p>
                  {t('privacy.section5.text')}
                </p>
              </section>

              {/* 6 */}
              <section id="section6" className="scroll-mt-28">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section6.title')}
                </h2>
                <p>
                  {t('privacy.section6.text')}
                </p>
              </section>

              {/* 7 */}
              <section id="section7" className="scroll-mt-28">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section7.title')}
                </h2>
                <p className="mb-3">
                  {t('privacy.section7.intro')}
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-slate-700">
                  <li><strong>Redsys (La Caixa)</strong> Procesamiento seguro de pagos con tarjeta y Bizum. <a href="https://www.redsys.es/politica-de-privacidad.html" target="_blank" rel="noopener noreferrer" className="text-[#8A4D76] hover:underline">redsys.es/privacidad</a></li>
                  <li><strong>Vercel Inc.</strong> {t('privacy.section7.vercel')} <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#8A4D76] hover:underline">vercel.com/privacy</a></li>
                  <li><strong>Railway Corp.</strong> {t('privacy.section7.railway')} <a href="https://railway.app/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[#8A4D76] hover:underline">railway.app/privacy</a></li>
                  <li><strong>SendGrid (Twilio Inc.)</strong> {t('privacy.section7.sendgrid')} <a href="https://www.twilio.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[#8A4D76] hover:underline">twilio.com/privacy</a></li>
                </ul>
                <p className="mt-3">
                  {t('privacy.section7.guarantees')}
                </p>
              </section>

              {/* 8 */}
              <section id="section8" className="scroll-mt-28">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section8.title')}
                </h2>
                <p>
                  {t('privacy.section8.intro')}
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  {Array.isArray(t('privacy.section8.rights')) && (t('privacy.section8.rights') as string[]).map((right: string, index: number) => (
                    <li key={index}>{right}</li>
                  ))}
                </ul>
                <p className="mt-3">
                  {t('privacy.section8.complaint')} <strong>{t('privacy.section8.aepd')}</strong>.
                </p>
              </section>

              {/* 9 */}
              <section id="section9" className="scroll-mt-28">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section9.title')}
                </h2>
                <p>
                  {t('privacy.section9.text')}
                </p>
              </section>

              {/* 10 */}
              <section id="section10" className="scroll-mt-28">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section10.title')}
                </h2>
                <p className="mb-3">
                  {t('privacy.section10.intro')}
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{t('privacy.section10.oneTime')}</h3>
                    <p className="text-gray-700">
                      {t('privacy.section10.oneTimeText')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{t('privacy.section10.recurring')}</h3>
                    <p className="text-gray-700 mb-2">
                      {t('privacy.section10.recurringIntro')}
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                      {Array.isArray(t('privacy.section10.recurringSteps')) && (t('privacy.section10.recurringSteps') as string[]).map((step: string, index: number) => (
                        <li key={index}>{step}</li>
                      ))}
                    </ul>
                    <p className="text-gray-700 mt-2">
                      {t('privacy.section10.recurringNote')}
                    </p>
                  </div>
                </div>
              </section>

              {/* 11 */}
              <section id="section11" className="scroll-mt-28">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section11.title')}
                </h2>
                <p>
                  {t('privacy.section11.text')}
                </p>
              </section>

              <div id="reembolsos" className="mt-10 p-5 bg-slate-100 rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600 mb-2">
                  <strong>{t('privacy.footer.lastUpdate')}</strong> {t('privacy.footer.lastUpdateDate')}
                </p>
                <p className="text-sm text-slate-600">
                  {t('privacy.footer.contactInfo')} <strong>{t('privacy.footer.contactEmail')}</strong>
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
