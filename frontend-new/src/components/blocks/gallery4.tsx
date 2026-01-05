"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export interface Gallery4Item {
  id: string;
  noticiaId?: number;
  title: string;
  description: string;
  fullContent?: string;
  href: string;
  image: string;
}

export interface Gallery4Props {
  title?: string;
  description?: string;
  items: Gallery4Item[];
  expandedNoticia?: number | null;
  onNoticiaClick?: (noticiaId: number) => void;
}

const data = [
  {
    id: "shadcn-ui",
    title: "shadcn/ui: Building a Modern Component Library",
    description:
      "Explore how shadcn/ui revolutionized React component libraries by providing a unique approach to component distribution and customization, making it easier for developers to build beautiful, accessible applications.",
    href: "https://ui.shadcn.com",
    image:
      "https://images.unsplash.com/photo-1551250928-243dc937c49d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjN8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: "tailwind",
    title: "Tailwind CSS: The Utility-First Revolution",
    description:
      "Discover how Tailwind CSS transformed the way developers style their applications, offering a utility-first approach that speeds up development while maintaining complete design flexibility.",
    href: "https://tailwindcss.com",
    image:
      "https://images.unsplash.com/photo-1551250928-e4a05afaed1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjR8fHx8fHwyfHwxNzIzODA2OTM5fA&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: "astro",
    title: "Astro: The All-in-One Web Framework",
    description:
      "Learn how Astro's innovative 'Islands Architecture' and zero-JS-by-default approach is helping developers build faster websites while maintaining rich interactivity where needed.",
    href: "https://astro.build",
    image:
      "https://images.unsplash.com/photo-1536735561749-fc87494598cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxNzd8fHx8fHwyfHwxNzIzNjM0NDc0fA&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: "react",
    title: "React: Pioneering Component-Based UI",
    description:
      "See how React continues to shape modern web development with its component-based architecture, enabling developers to build complex user interfaces with reusable, maintainable code.",
    href: "https://react.dev",
    image:
      "https://images.unsplash.com/photo-1548324215-9133768e4094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMzF8fHx8fHwyfHwxNzIzNDM1MzA1fA&ixlib=rb-4.0.3&q=80&w=1080",
  },
  {
    id: "nextjs",
    title: "Next.js: The React Framework for Production",
    description:
      "Explore how Next.js has become the go-to framework for building full-stack React applications, offering features like server components, file-based routing, and automatic optimization.",
    href: "https://nextjs.org",
    image:
      "https://images.unsplash.com/photo-1550070881-a5d71eda5800?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w2NDI3NzN8MHwxfGFsbHwxMjV8fHx8fHwyfHwxNzIzNDM1Mjk4fA&ixlib=rb-4.0.3&q=80&w=1080",
  },
];

const Gallery4 = ({
  title = "Case Studies",
  description = "Discover how leading companies and developers are leveraging modern web technologies to build exceptional digital experiences. These case studies showcase real-world applications and success stories.",
  items = data,
  expandedNoticia = null,
  onNoticiaClick,
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentSlide(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  // Auto-scroll cuando se expande una noticia
  useEffect(() => {
    if (!carouselApi || expandedNoticia === null) {
      return;
    }
    // Encontrar el índice de la noticia expandida
    const expandedIndex = items.findIndex(item => item.noticiaId === expandedNoticia);
    if (expandedIndex !== -1) {
      // Deslizar a esa noticia
      setTimeout(() => {
        carouselApi.scrollTo(expandedIndex);
      }, 100);
    }
  }, [expandedNoticia, carouselApi, items]);

  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto bg-transparent">
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 md:mb-14 lg:mb-16 bg-transparent">
          <div className="flex flex-col gap-2 md:gap-4 flex-1">
            <h2 className="text-2xl md:text-3xl font-semibold text-[#8a6783] tracking-tight">
              {title}
            </h2>
            <p className="max-w-lg text-[#444] text-sm md:text-base lg:text-lg font-medium opacity-90">{description}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollPrev();
              }}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto bg-[#8a6783] border-2 border-[#8a6783] shadow-lg hover:bg-[#a98bb0] hover:border-[#a98bb0] transition-colors h-8 w-8 md:h-10 md:w-10"
            >
              <ArrowLeft className="size-4 md:size-5 text-white transition-colors group-hover:text-[#f7f5f2]" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                carouselApi?.scrollNext();
              }}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto bg-[#8a6783] border-2 border-[#8a6783] shadow-lg hover:bg-[#a98bb0] hover:border-[#a98bb0] transition-colors h-8 w-8 md:h-10 md:w-10"
            >
              <ArrowRight className="size-4 md:size-5 text-white transition-colors group-hover:text-[#f7f5f2]" />
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full overflow-hidden">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            align: "start",
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
        >
          <CarouselContent className="ml-0 -mr-4">
            {items.map((item) => {
              const isExpanded = expandedNoticia === item.noticiaId;
              
              return (
                <CarouselItem
                  key={item.id}
                  className={`pr-12 flex-shrink-0 transition-all duration-500 ${
                    isExpanded 
                      ? 'basis-full md:basis-[90%] lg:basis-[75%]' 
                      : 'basis-[90%] md:basis-[48%] lg:basis-[32%]'
                  }`}
                >
                  <div 
                    onClick={() => item.noticiaId && onNoticiaClick?.(item.noticiaId)}
                    className="group rounded-xl cursor-pointer h-full w-full"
                  >
                    <div className={`group relative overflow-hidden rounded-xl transition-all duration-500 w-full ${
                      isExpanded 
                        ? 'min-h-[550px] md:min-h-[650px] max-h-[80vh]' 
                        : 'h-full min-h-[450px] md:min-h-[500px]'
                    }`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className={`absolute h-full w-full object-cover object-center transition-all duration-500 ${
                          isExpanded 
                            ? 'scale-110 blur-md opacity-20' 
                            : 'group-hover:scale-105'
                        }`}
                      />
                      {/* Overlay oscuro */}
                      <div className={`absolute inset-0 h-full transition-all duration-500 z-0 ${
                        isExpanded ? 'bg-black/95' : 'bg-black/65'
                      }`} />
                      
                      <div className={`absolute inset-0 flex flex-col p-6 md:p-8 z-10 ${
                        isExpanded ? 'justify-start overflow-y-auto' : 'justify-end'
                      }`}>
                        <div className={`transition-all duration-500 flex-shrink-0 ${
                          isExpanded ? 'mb-6' : 'mb-3 pt-4 md:mb-4 md:pt-4'
                        }`}>
                          <h3 className={`font-bold text-white drop-shadow-2xl transition-all duration-500 ${
                            isExpanded ? 'text-2xl md:text-3xl lg:text-4xl mb-5' : 'text-xl md:text-2xl lg:text-3xl'
                          }`}>
                            {item.title}
                          </h3>
                        </div>
                        
                        <div className={`text-white drop-shadow-lg transition-all duration-500 ${
                          isExpanded 
                            ? 'mb-6 text-base md:text-lg leading-relaxed overflow-y-auto pr-3 flex-grow' 
                            : 'mb-8 line-clamp-3 md:mb-10 text-sm md:text-base flex-shrink-0'
                        }`}>
                          {isExpanded ? item.fullContent : item.description}
                        </div>
                        
                        <div className={`flex items-center text-sm md:text-base font-bold transition-all duration-300 flex-shrink-0 ${
                          isExpanded 
                            ? 'text-yellow-300 hover:text-yellow-100 mt-4' 
                            : 'text-white hover:text-yellow-200'
                        }`}>
                          {isExpanded ? 'Cerrar' : 'Leer más'}
                          <ArrowRight className={`ml-2 size-5 transition-transform ${
                            isExpanded 
                              ? 'rotate-180' 
                              : 'group-hover:translate-x-1'
                          }`} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        <div className="mt-8 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                currentSlide === index ? "bg-primary" : "bg-primary/20"
              }`}
              onClick={() => carouselApi?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export { Gallery4 };
