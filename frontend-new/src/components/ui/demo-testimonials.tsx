import { AnimatedTestimonials } from "./animated-testimonials";

export function AnimatedTestimonialsDemo() {
  const testimonials = [
    {
      quote: "Encontrar un espacio seguro y humano marca la diferencia entre el miedo y la dignidad. Ametsgoien representa esa acogida real que muchas mujeres necesitamos.",
      name: "Mariana",
      designation: "Beneficiaria",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
      id: "mariana",
      fullStory: "Mariana llegó al País Vasco hace más de una década con la esperanza de encontrar una solución médica y poder reunirse con su hijo. Como madre sola y mujer migrada, se enfrentó desde el inicio a numerosas dificultades: la falta de empadronamiento, la ausencia de documentación, el acceso limitado al empleo y, especialmente, la imposibilidad de encontrar una vivienda digna para ella y su hijo.\n\nDurante años vivió situaciones de discriminación en el acceso a la vivienda, tanto por tener un hijo como por su origen. Compartió espacios en los que no se sentía segura ni bienvenida, y donde incluso las acciones cotidianas eran motivo de juicio. A estas dificultades se sumaron los obstáculos para acceder a la educación pública y a becas escolares, lo que hizo aún más complejo garantizar la estabilidad de su hijo.\n\nA pesar de todo, Mariana también encontró redes de apoyo en asociaciones, colectivos de mujeres migradas y espacios comunitarios donde se sintió acompañada y comprendida. Desde su experiencia, defiende la importancia de una acogida real, basada en la voluntad y la empatía, libre de discriminación.\n\nMariana destaca el valor de iniciativas como Ametsgoien, que ofrecen espacios cercanos, cálidos y seguros, capaces de acompañar de manera humana a mujeres y familias en situaciones de gran vulnerabilidad. Para ella, acoger no es solo abrir una casa, sino abrir los brazos y acercar los corazones."
    },
    {
      quote: "Como madre, lo más importante es sentirte protegida y acompañada. Un lugar seguro puede cambiarlo todo.",
      name: "Emadolis",
      designation: "Beneficiaria",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
      id: "emadolis",
      fullStory: "Emadolis emigró desde Nicaragua buscando un futuro mejor y nuevas oportunidades. Llegó embarazada y, tras ser abandonada por el padre de su hijo, se encontró en una situación de extrema vulnerabilidad. Sin documentación, sin trabajo y con un bebé recién nacido, llegó a vivir en la calle y a enfrentarse sola a un parto especialmente duro.\n\nLa búsqueda de vivienda fue una de las mayores dificultades. En muchos lugares se le negó el alquiler por tener un hijo, y en otros se le impusieron condiciones que limitaban incluso el derecho de su bebé a jugar o hacer ruido. Vivió momentos de gran angustia, incertidumbre y miedo, especialmente al no saber dónde dormir ni cómo alimentar a su hijo.\n\nEn medio de esa situación, Emadolis encontró apoyo humano y emocional en personas que le ofrecieron escucha, palabras de ánimo y acompañamiento. Ese apoyo fue clave para recuperar fuerzas y seguir adelante.\n\nDesde su experiencia como madre, defiende la necesidad de espacios seguros donde mujeres y niños puedan convivir sin miedo, con empatía y respeto. Considera fundamental la existencia de asociaciones como Ametsgoien, que ofrecen protección, cercanía y la posibilidad de sentirse, aunque sea por un tiempo, como en casa."
    },
    {
      quote: "Sin apoyo y sin vivienda, la vida se vuelve insostenible. Las asociaciones que acompañan de verdad cambian destinos.",
      name: "Berita",
      designation: "Beneficiaria",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
      id: "berita",
      fullStory: "Berita decidió emigrar para ofrecer un futuro mejor a sus hijos y la posibilidad de acceder a estudios que en su país eran inaccesibles. Llegó al País Vasco con expectativas de trabajo y estabilidad, pero pronto se encontró con una realidad muy distinta. La persona que le prometió apoyo al llegar no cumplió lo acordado, lo que la llevó a quedarse sola y sin un lugar donde vivir.\n\nDurante sus primeros meses pasó por situaciones extremas, incluida una noche durmiendo en un parque. Gracias a la ayuda puntual de personas solidarias, logró encontrar alojamiento temporal y, tras una búsqueda constante, accedió a su primer empleo como trabajadora interna. Aquel trabajo supuso una experiencia muy dura, marcada por jornadas exhaustivas, trato desigual y un fuerte impacto físico y emocional.\n\nLa falta de documentación y de nómina le impidió durante años acceder a una vivienda propia, obligándola a aceptar condiciones precarias para poder mantenerse y enviar dinero a sus hijos. Esta situación la llevó incluso a retrasar la reunificación familiar por miedo a no poder ofrecerles un entorno seguro.\n\nBerita subraya la importancia de contar con asociaciones que acompañen, orienten y protejan a mujeres migradas, especialmente a aquellas con hijos pequeños. Para ella, iniciativas como Ametsgoien son fundamentales para evitar que más mujeres pasen por situaciones de exclusión y para construir una acogida más justa y humana."
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
