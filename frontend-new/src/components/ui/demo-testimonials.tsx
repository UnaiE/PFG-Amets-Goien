import { AnimatedTestimonials } from "./animated-testimonials";
import { useLanguage } from '@/contexts/LanguageContext';

export function AnimatedTestimonialsDemo() {
  const { t } = useLanguage();
  
  const testimonials = [
    {
      quote: t('home.testimonials.mariana.quote'),
      name: t('home.testimonials.mariana.name'),
      designation: t('home.testimonials.mariana.designation'),
      src: "/mariana.png",
      id: "mariana",
      fullStory: t('home.testimonials.mariana.fullStory')
    },
    {
      quote: t('home.testimonials.emadolis.quote'),
      name: t('home.testimonials.emadolis.name'),
      designation: t('home.testimonials.emadolis.designation'),
      src: "/emadolis.png",
      id: "emadolis",
      fullStory: t('home.testimonials.emadolis.fullStory')
    },
    {
      quote: t('home.testimonials.berita.quote'),
      name: t('home.testimonials.berita.name'),
      designation: t('home.testimonials.berita.designation'),
      src: "/berita.png",
      id: "berita",
      fullStory: t('home.testimonials.berita.fullStory')
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
