"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  className,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  className?: string;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => Math.floor(Math.random() * 21) - 10;
  const isActive = (index: number) => index === active;

  return (
    <div className={`max-w-sm md:max-w-4xl mx-auto px-4 md:px-8 lg:px-12 py-8 md:py-20 ${className ?? ""}`}
      style={{ position: "relative", zIndex: 1 }}>
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20">
        <div>
          <div className="relative h-64 md:h-80 w-full" style={{ zIndex: 1 }}>
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 2
                      : 1,
                    y: isActive(index) ? [0, -80, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                  style={{ zIndex: isActive(index) ? 2 : 1 }}
                >
                  <Image
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center shadow-xl"
                    style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.12)" }}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        <div className="flex justify-between flex-col py-4 md:py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className=""
          >
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#8A4D76] mb-2">
              {testimonials[active].name}
            </h3>
            <p className="text-sm md:text-base lg:text-lg text-[#4A3A3C] mb-4">
              {testimonials[active].designation}
            </p>
            <motion.p className="text-base md:text-lg lg:text-xl text-[#4A3A3C] mt-4 md:mt-8 font-medium" style={{ lineHeight: "1.7" }}>
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(10px)",
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>
          <div className="flex gap-3 md:gap-4 pt-6 md:pt-12 justify-center md:justify-start">
            <button
              onClick={handlePrev}
              className="h-10 w-10 md:h-9 md:w-9 rounded-full bg-[#8A4D76] flex items-center justify-center group/button shadow-md hover:bg-[#a98bb0] transition-colors"
            >
              <IconArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-white group-hover/button:rotate-12 transition-transform duration-300" />
            </button>
            <button
              onClick={handleNext}
              className="h-10 w-10 md:h-9 md:w-9 rounded-full bg-[#8A4D76] flex items-center justify-center group/button shadow-md hover:bg-[#a98bb0] transition-colors"
            >
              <IconArrowRight className="h-5 w-5 md:h-6 md:w-6 text-white group-hover/button:-rotate-12 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
