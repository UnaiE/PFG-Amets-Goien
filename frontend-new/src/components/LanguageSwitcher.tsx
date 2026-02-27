"use client";
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'es', label: 'ES', icon: '/esp.png' },
    { code: 'eu', label: 'EU', icon: '/eus.png' },
    { code: 'en', label: 'EN', icon: '/eng.png' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as 'es' | 'eu' | 'en');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-white hover:opacity-80 transition-opacity duration-200 px-2 py-1"
        aria-label="Seleccionar idioma"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {currentLanguage?.icon && (
          <img 
            src={currentLanguage.icon} 
            alt={currentLanguage.label}
            className="w-4 h-4 object-contain"
          />
        )}
        <span className="text-base font-semibold">{currentLanguage?.label}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-1 w-28 bg-white rounded-md shadow-lg overflow-hidden z-50 border border-gray-200"
          role="menu"
          aria-label="Menu de idiomas"
        >
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2 flex items-center justify-center gap-2 transition-colors font-semibold text-base ${
                language === lang.code 
                  ? 'bg-[#8A4D76] text-white' 
                  : 'text-gray-800 hover:bg-gray-100'
              }`}
              role="menuitem"
            >
              <img 
                src={lang.icon} 
                alt={lang.label}
                className="w-4 h-4 object-contain"
              />
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
