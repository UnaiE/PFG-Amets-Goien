"use client";
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
    // Si estamos en otra página, navegar primero a home
    if (pathname !== '/') {
      router.push(`/#${targetId}`);
      setMobileMenuOpen(false);
      return;
    }
    
    // Si ya estamos en home, hacer scroll
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className="fixed top-0 w-full z-50 transition-all duration-300 shadow-md px-4 md:px-8 lg:px-12"
      style={{ backgroundColor: '#8A4D76' }}
    >
      <div className="max-w-7xl mx-auto py-2 md:py-2">
        <div className="flex items-center justify-between">
          {/* Logo a la izquierda */}
          <div className="flex items-center">
            <h1 className="text-white text-sm md:text-base font-bold tracking-wide">
              AMETS GOIEN
            </h1>
          </div>
          
          {/* Menú hamburguesa (móvil) */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-5">
            <a 
              href="#inicio"
              onClick={(e) => handleNavClick(e, 'inicio')}
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
              href="/sobre-nosotros"
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
              onClick={(e) => handleNavClick(e, 'noticias')}
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
              href="/actividades"
              className="text-white no-underline hover:scale-110 transition-all duration-200"
              style={{ 
                textDecoration: 'none', 
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
            >
              Actividades
            </a>
            <a
              href="/colaborar"
            >
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
            </a>
            <a 
              href="/acceso-interno" 
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

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-[#8A4D76] shadow-lg py-4 px-4">
            <div className="flex flex-col space-y-4">
              <a 
                href="#inicio"
                onClick={(e) => handleNavClick(e, 'inicio')}
                className="text-white text-sm font-medium py-2 hover:bg-white/10 rounded-lg px-3 transition-colors"
              >
                Inicio
              </a>
              <a 
                href="/sobre-nosotros"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-sm font-medium py-2 hover:bg-white/10 rounded-lg px-3 transition-colors"
              >
                La ONG
              </a>
              <a 
                href="#noticias"
                onClick={(e) => handleNavClick(e, 'noticias')}
                className="text-white text-sm font-medium py-2 hover:bg-white/10 rounded-lg px-3 transition-colors"
              >
                Noticias
              </a>
              <a 
                href="/actividades"
                className="text-white text-sm font-medium py-2 hover:bg-white/10 rounded-lg px-3 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Actividades
              </a>
              <a
                href="/colaborar"
                onClick={() => setMobileMenuOpen(false)}
              >
                <button 
                  className="rounded-full font-medium px-6 py-2 bg-white text-[#8A4D76] border-2 border-[#8A4D76] w-full"
                >
                  Colabora
                </button>
              </a>
              <a 
                href="/acceso-interno" 
                className="text-white text-sm font-medium py-2 hover:bg-white/10 rounded-lg px-3 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Acceso interno
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
