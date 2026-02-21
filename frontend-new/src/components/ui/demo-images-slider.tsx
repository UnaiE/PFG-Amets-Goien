"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "@/components/ui/images-slider";

export function ImagesSliderDemo() {
  const images = [
    "/header5.jpeg",
    "/header1.jpg",
    "/header2.jpeg",
    "/header3.jpg",
    "/header4.jpg",
    
  ];
  return (
    <ImagesSlider className="h-screen" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <h1 className="text-6xl md:text-7xl font-bold mb-8 text-white drop-shadow-2xl" style={{ lineHeight: '1.1' }}>
          Ametsgoien
        </h1>
        <h2 className="text-3xl md:text-4xl font-semibold text-white text-center mb-8 tracking-tight drop-shadow-lg">
          Acogida, dignidad y acompañamiento
        </h2>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-white drop-shadow-lg text-center" style={{ lineHeight: '1.5' }}>
          Construyendo un refugio seguro junto a mujeres migrantes.
        </p>
        <a href="/sobre-nosotros">
          <button 
            className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer px-6 py-2"
            style={{ 
              backgroundColor: 'white', 
              color: '#8A4D76',
              border: '2.5px solid #8A4D76',
              letterSpacing: '0.3px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
            }}
          >
            Descubre Nuestro Trabajo
          </button>
        </a>
      </motion.div>
    </ImagesSlider>
  );
}
