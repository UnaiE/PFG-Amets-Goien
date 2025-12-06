"use client";
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className="fixed top-0 w-full z-50 transition-all duration-300 shadow-md px-12"
      style={{ backgroundColor: '#8A4D76' }}
    >
      <div className="max-w-7xl mx-auto py-2">
        <div className="flex items-center justify-between">
          {/* Logo a la izquierda */}
          <div className="flex items-center">
            <h1 className="text-white text-base font-bold tracking-wide">
              AMETS GOIEN
            </h1>
          </div>
          {/* Navegación a la derecha */}
          <div className="flex items-center" style={{ gap: '1.2rem' }}>
            <a 
              href="#inicio" 
              className="text-white no-underline hover:scale-110 transition-all duration-200"
              style={{ 
                textDecoration: 'none', 
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Inicio
            </a>
            <a 
              href="#ong" 
              className="text-white no-underline hover:scale-110 transition-all duration-200"
              style={{ 
                textDecoration: 'none', 
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              La ONG
            </a>
            <a 
              href="#noticias" 
              className="text-white no-underline hover:scale-110 transition-all duration-200"
              style={{ 
                textDecoration: 'none', 
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Noticias
            </a>
            <a 
              href="#testimonios" 
              className="text-white no-underline hover:scale-110 transition-all duration-200"
              style={{ 
                textDecoration: 'none', 
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Testimonios
            </a>
            <button 
              className="rounded-full font-medium hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer px-6 py-2 md:px-8 md:py-2"
              style={{ 
                backgroundColor: 'white', 
                color: '#8A4D76',
                border: '2.5px solid #8A4D76',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Colabora
            </button>
            <a 
              href="#acceso" 
              className="text-white no-underline hover:scale-110 transition-all duration-200"
              style={{ 
                textDecoration: 'none', 
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Acceso interno
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
