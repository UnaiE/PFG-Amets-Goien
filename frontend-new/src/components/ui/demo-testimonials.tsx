import { AnimatedTestimonials } from "./animated-testimonials";

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote: "La atención y el acompañamiento han sido clave para mi proceso. Me sentí escuchada y apoyada en todo momento.",
      name: "María López",
      designation: "Beneficiaria",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
    },
    {
      quote: "Gracias a AMETS GOIEN recuperé mi estabilidad y esperanza. El equipo es muy humano y profesional.",
      name: "Ana Torres",
      designation: "Beneficiaria",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote: "El apoyo legal y emocional me ayudó a salir adelante. Recomiendo la ONG a todas las mujeres migrantes.",
      name: "Sofía Martínez",
      designation: "Beneficiaria",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
