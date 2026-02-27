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

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 px-4 md:px-8 lg:px-16 bg-[#E8D5F2]">
        <div className="max-w-4xl mx-auto py-12">
          <button
            onClick={() => router.back()}
            className="mb-6 px-6 py-2 rounded-full bg-white text-[#8A4D76] font-semibold hover:shadow-md transition-all"
          >
            ← {t('privacy.backButton')}
          </button>

          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-200">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#8A4D76]">
              {t('privacy.title')}
            </h1>

            <div className="space-y-8 text-gray-700 leading-relaxed">

              {/* 1 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section1.title')}
                </h2>
                <p className="mb-3">
                  {t('privacy.section1.intro')}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#8A4D76]">
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
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section2.title')}
                </h2>
                <p>
                  {t('privacy.section2.text')}
                </p>
              </section>

              {/* 3 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section3.title')}
                </h2>
                <p>
                  {t('privacy.section3.intro')}
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{t('privacy.section3.contactForm')}</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                      {Array.isArray(t('privacy.section3.contactItems')) && (t('privacy.section3.contactItems') as string[]).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">{t('privacy.section3.donations')}</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                      {Array.isArray(t('privacy.section3.donationItems')) && (t('privacy.section3.donationItems') as string[]).map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* 4 */}
              <section>
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
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section5.title')}
                </h2>
                <p>
                  {t('privacy.section5.text')}
                </p>
              </section>

              {/* 6 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section6.title')}
                </h2>
                <p>
                  {t('privacy.section6.text')}
                </p>
              </section>

              {/* 7 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section7.title')}
                </h2>
                <p className="mb-3">
                  {t('privacy.section7.intro')}
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-700">
                  <li><strong>Stripe</strong> {t('privacy.section7.stripe')} <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener noreferrer" className="text-[#8A4D76] hover:underline">stripe.com/privacy</a></li>
                  <li><strong>Vercel Inc.</strong> {t('privacy.section7.vercel')} <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#8A4D76] hover:underline">vercel.com/privacy</a></li>
                  <li><strong>Railway Corp.</strong> {t('privacy.section7.railway')} <a href="https://railway.app/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[#8A4D76] hover:underline">railway.app/privacy</a></li>
                  <li><strong>SendGrid (Twilio Inc.)</strong> {t('privacy.section7.sendgrid')} <a href="https://www.twilio.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[#8A4D76] hover:underline">twilio.com/privacy</a></li>
                </ul>
                <p className="mt-3">
                  {t('privacy.section7.guarantees')}
                </p>
              </section>

              {/* 8 */}
              <section>
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
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section9.title')}
                </h2>
                <p>
                  {t('privacy.section9.text')}
                </p>
              </section>

              {/* 10 */}
              <section id="reembolsos">
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
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  {t('privacy.section11.title')}
                </h2>
                <p>
                  {t('privacy.section11.text')}
                </p>
              </section>

              <div className="mt-10 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>{t('privacy.footer.lastUpdate')}</strong> {t('privacy.footer.lastUpdateDate')}
                </p>
                <p className="text-sm text-gray-600">
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
