"use client";

import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TestimonioPage() {
  const params = useParams();
  const id = params.id as string;
  const { t } = useLanguage();
  
  // Map testimonial IDs to translation keys
  const testimonialIds = ['mariana', 'emadolis', 'berita'];
  
  if (!testimonialIds.includes(id)) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 flex items-center justify-center" style={{ backgroundColor: '#E8D5F2' }}>
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4" style={{ color: '#8A4D76' }}>
              {t('home.testimonials.notFound')}
            </h1>
            <Link href="/#testimonios">
              <button className="px-6 py-3 rounded-full bg-[#8A4D76] text-white hover:bg-[#a98bb0] transition-colors">
                {t('home.testimonials.backToTestimonials')}
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Get testimonial data from translations
  const testimonialData = t(`home.testimonials.${id}`) as {
    quote: string;
    name: string;
    designation: string;
    fullStory: string;
  };
  
  const testimonial = {
    ...testimonialData,
    src: `/${id}.png`,
    id: id,
  };

  // Safety check for fullStory
  const fullStoryText = testimonial.fullStory || "";
  const paragraphs = fullStoryText.split(/\\n\\n|\\n/);

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20" style={{ backgroundColor: '#E8D5F2' }}>
        {/* Hero con imagen */}
        <section className="py-12 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#8A4D76' }}>
          <div className="max-w-4xl mx-auto">
            <Link href="/#testimonios">
              <button className="mb-6 text-white hover:underline flex items-center gap-2">
                ← {t('home.testimonials.backToTestimonials')}
              </button>
            </Link>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1">
                <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto rounded-full overflow-hidden shadow-2xl">
                  <Image
                    src={testimonial.src}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:col-span-2 text-white text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  {testimonial.name}
                </h1>
                <p className="text-xl md:text-2xl opacity-90">
                  {testimonial.designation}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Historia completa */}
        <section className="py-16 px-4 md:px-8 lg:px-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <blockquote className="text-3xl md:text-4xl font-bold mb-8 text-[#8A4D76] italic">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="prose prose-lg max-w-none">
                {paragraphs.filter(p => p.trim()).map((paragraph, index) => (
                  <p key={index} className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6" style={{ lineHeight: '1.8' }}>
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <Link href="/colaborar">
                  <button 
                    className="w-full md:w-auto px-8 py-4 rounded-full font-medium text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    style={{ 
                      backgroundColor: '#8A4D76', 
                      color: 'white',
                    }}
                  >
                    {t('home.testimonials.helpMore')} {testimonial.name}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
