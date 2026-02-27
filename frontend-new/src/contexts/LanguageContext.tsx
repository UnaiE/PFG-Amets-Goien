"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'es' | 'eu' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('es');
  const [translations, setTranslations] = useState<Record<string, any>>({});

  // Cargar traducciones
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const trans = await import(`@/locales/${language}.json`);
        setTranslations(trans.default);
      } catch (error) {
        console.error(`Error loading translations for ${language}:`, error);
      }
    };
    loadTranslations();
  }, [language]);

  // Persistir idioma en localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['es', 'eu', 'en'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Función de traducción con soporte para claves anidadas y arrays/objetos
  const t = (key: string): any => {
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Retornar la clave si no se encuentra traducción
      }
    }
    
    // Retornar el valor tal cual (puede ser string, array u objeto)
    return value !== undefined ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
