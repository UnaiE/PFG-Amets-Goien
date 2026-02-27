"use client";
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLanguage();

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

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileMenuOpen]);

  return (
    <nav 
      className="fixed top-0 w-full z-50 transition-all duration-300 shadow-md px-4 md:px-8 lg:px-12"
      style={{ backgroundColor: '#8A4D76' }}
      role="navigation"
      aria-label="Navegación principal"
    >
      <div className="max-w-7xl mx-auto py-2 md:py-2">
        <div className="flex items-center justify-between">
          {/* Logo a la izquierda */}
          <div className="flex items-center">
            <a href="/" className="flex items-center" aria-label="Ir a inicio">
              <div className="bg-white rounded-full px-3 py-2 shadow-md" style={{ border: '2px solid #8A4D76' }}>
                <img 
                  src="/logo.png" 
                  alt="Ametsgoien" 
                  className="h-8 md:h-10 w-auto"
                />
              </div>
            </a>
          </div>
          
          {/* Menú hamburguesa (móvil) y selector de idiomas */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button 
              className="text-white p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Cerrar menú de navegación" : "Abrir menú de navegación"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>

          {/* Navegación desktop */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4 xl:gap-5" role="menubar">
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
              aria-label="Ir a la sección de inicio"
              role="menuitem"
            >
              {t('nav.home')}
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
              aria-label="Conocer más sobre la organización"
              role="menuitem"
            >
              {t('nav.association')}
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
              aria-label="Ir a la sección de noticias"
              role="menuitem"
            >
              {t('nav.news')}
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
              aria-label="Ver actividades y talleres"
              role="menuitem"
            >
              {t('nav.activities')}
            </a>
            <a 
              href="/voluntarios"
              className="text-white no-underline hover:scale-110 transition-all duration-200"
              style={{ 
                textDecoration: 'none', 
                fontSize: '12px',
                fontWeight: '500',
                letterSpacing: '0.3px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
              }}
              aria-label="Regístrate como voluntario"
              role="menuitem"
            >
              {t('nav.volunteer')}
            </a>
            <a
              href="/colaborar"
              aria-label="Hacer una donación"
              role="menuitem"
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
                tabIndex={-1}
              >
              {t('nav.collaborate')}
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
              aria-label="Acceso para personal interno"
              role="menuitem"
            >
              {t('nav.internal')}
            </a>
            
            {/* Selector de idiomas */}
            <LanguageSwitcher />
          </div>
        </div>

        {/* Menú móvil */}
        {mobileMenuOpen && (
          <div id="mobile-menu" className="md:hidden absolute top-full left-0 w-full bg-[#8A4D76] shadow-lg py-4 px-4" role="menu" aria-label="Menú de navegación móvil">
            <div className="flex flex-col space-y-4">
              <a 
                href="#inicio"
                onClick={(e) => handleNavClick(e, 'inicio')}
                className="text-white text-sm font-medium py-2 hover:bg-white/10 rounded-lg px-3 transition-colors"
              >
                {t('nav.home')}
              </a>
              <a 
                href="/sobre-nosotros"
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-sm font-medium py-2 hover:bg-white/10 rounded-lg px-3 transition-colors"
              >
                {t('nav.association')}
              </a>
              <a 
                href="#noticias"
                onClick={(e) => handleNavClick(e, 'noticias')}
                className="text-white text-sm font-medium py-2 hover:bg-white/10 rounded-lg px-3 transition-colors"
              >
                {t('nav.news')}
              </a>
              <a 
                href="/actividades"
                className="text-white text-sm font-medium py-2 hover:bg-white/10 rounded-lg px-3 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.activities')}
              </a>
              <a 
                href="/voluntarios"
                className="text-white text-sm font-medium py-2 hover:bg-white/10 rounded-lg px-3 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.volunteer')}
              </a>
              <a
                href="/colaborar"
                onClick={() => setMobileMenuOpen(false)}
              >
                <button 
                  className="rounded-full font-medium px-6 py-2 bg-white text-[#8A4D76] border-2 border-[#8A4D76] w-full"
                >
                  {t('nav.collaborate')}
                </button>
              </a>
              <a 
                href="/acceso-interno" 
                className="text-white text-sm font-medium py-2 hover:bg-white/10 rounded-lg px-3 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.internal')}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
