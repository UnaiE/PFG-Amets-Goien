const Footer = () => {
  return (
    <footer className="text-white px-4 md:px-8 lg:px-12" style={{ backgroundColor: '#6b3f7a' }}>
      <div className="max-w-7xl mx-auto py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {/* Columna 1: Logo + Derechos */}
          <div>
            <h3 className="text-white text-xl md:text-2xl font-bold mb-3 md:mb-4">Amets Goien</h3>
            <p className="text-white/80 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
              Construyendo un refugio seguro junto a mujeres migrantes.
            </p>
            <p className="text-white/60 text-xs md:text-sm">
              © 2025 Amets Goien.<br />
              Todos los derechos reservados.
            </p>
          </div>
          {/* Columna 2: Redes Sociales */}
          <div>
            <h4 className="text-white font-semibold text-base md:text-lg mb-3 md:mb-4">Síguenos</h4>
            <div className="flex flex-col space-y-3">
              <a href="https://www.instagram.com/ametsgoien/" target="_blank" rel="noopener noreferrer" className="flex items-center text-white/80 hover:text-white transition-colors">
                {/* Instagram SVG */}
                <svg className="w-4 h-4 mr-3 flex-shrink-0 max-w-[1.5rem] max-h-[1.5rem]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>
          {/* Columna 3: Contacto */}
          <div>
            <h4 className="text-white font-semibold text-base md:text-lg mb-3 md:mb-4">Contacto</h4>
            <ul className="space-y-2 md:space-y-3 text-sm md:text-base">
              <li className="flex items-start text-white/80">
                {/* Ubicación SVG */}
                <svg className="w-4 h-4 mr-3 mt-1 flex-shrink-0 max-w-[1.5rem] max-h-[1.5rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Calle Principal 123<br />28001 Orduña, España</span>
              </li>
              <li className="flex items-center text-white/80">
                {/* Email SVG */}
                <svg className="w-4 h-4 mr-3 flex-shrink-0 max-w-[1.5rem] max-h-[1.5rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@ametsgoien.org" className="hover:text-white transition-colors">
                  info@ametsgoien.org
                </a>
              </li>
              <li className="flex items-center text-white/80">
                {/* Teléfono SVG */}
                <svg className="w-4 h-4 mr-3 flex-shrink-0 max-w-[1.5rem] max-h-[1.5rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+34697858343" className="hover:text-white transition-colors">
                  +34 697 858 343
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* Barra inferior */}
      <div className="border-t border-white/20 px-12">
        <div className="max-w-7xl mx-auto py-6 text-center">
          <p className="text-white/60 text-sm mb-2">
            Desarrollado con ❤️ para crear un mundo más inclusivo
          </p>
          <div className="text-white/60 text-xs">
            <a href="/privacidad" className="hover:text-white transition-colors underline">
              Política de Privacidad
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
