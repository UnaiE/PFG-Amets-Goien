"use client";
import { useState } from "react";
import { useLanguage } from '@/contexts/LanguageContext';

interface TimelineVideo {
  url: string;
  platform: 'youtube' | 'instagram';
  id: string;
  fecha: string;
}

const videosData: TimelineVideo[] = [
  {
    url: "https://youtube.com/shorts/R3-by_dBEYA",
    platform: "youtube",
    id: "R3-by_dBEYA",
    fecha: "6-8 Nov 2025"
  },
  {
    url: "https://youtube.com/shorts/OkmARxUOL84?feature=share",
    platform: "youtube",
    id: "OkmARxUOL84",
    fecha: "15-16 Nov 2025"
  },
  {
    url: "https://youtube.com/shorts/kPJj0L7etj0",
    platform: "youtube",
    id: "kPJj0L7etj0",
    fecha: "22-23 Nov 2025"
  },
  {
    url: "https://youtube.com/shorts/Y9gZ6pfB7RU?feature=share",
    platform: "youtube",
    id: "Y9gZ6pfB7RU",
    fecha: "29-30 Nov 2025"
  },
  {
    url: "https://youtube.com/shorts/L31CEi9Z8SY",
    platform: "youtube",
    id: "L31CEi9Z8SY",
    fecha: "6-7 Dic 2025"
  },
  {
    url: "https://youtu.be/yV5uMMOneU0",
    platform: "youtube",
    id: "yV5uMMOneU0",
    fecha: "13-14 Dic 2025"
  },
  {
    url: "https://youtu.be/e6aiIBKEJZ8",
    platform: "youtube",
    id: "e6aiIBKEJZ8",
    fecha: "19-23 Dic 2025"
  },
  {
    url: "https://youtube.com/shorts/s0WDDnXrz-c",
    platform: "youtube",
    id: "s0WDDnXrz-c",
    fecha: "11-27 Dic 2025"
  },
  {
    url: "https://youtu.be/-U0TibC6JwU",
    platform: "youtube",
    id: "-U0TibC6JwU",
    fecha: "26-30 Dic 2025"
  },
  {
    url: "https://youtu.be/Pe4k2G99lTM",
    platform: "youtube",
    id: "Pe4k2G99lTM",
    fecha: "2-5 Ene 2026"
  }
];

export default function RemodelacionTimeline() {
  const { t } = useLanguage();
  const [loadedVideos, setLoadedVideos] = useState<Set<number>>(new Set());

  const handleVideoLoad = (index: number) => {
    setLoadedVideos(prev => new Set(prev).add(index));
  };

  const videoTranslations = t('timeline.videos') as Array<{ title: string; description: string }>;

  return (
    <div className="w-full py-12 md:py-20 px-2 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Título de la sección */}
        <div className="text-center mb-8 md:mb-20 px-2">
          <h2 className="text-xl md:text-4xl font-bold mb-2 md:mb-6" style={{ color: '#8A4D76' }}>
            {t('timeline.title')}
          </h2>
          <p className="text-sm md:text-lg text-gray-700 max-w-3xl mx-auto">
            {t('timeline.description')}
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Línea vertical central */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 md:w-1.5 rounded-full"
            style={{ backgroundColor: '#8A4D76' }}
          />

          {/* Timeline items */}
          <div className="space-y-6 md:space-y-20">
            {videosData.map((video, index) => {
              const isLeft = index % 2 === 0;
              
              return (
                <div 
                  key={video.id} 
                  className={`relative flex flex-row items-center ${
                    isLeft ? 'flex-row-reverse' : ''
                  }`}
                >
                  {/* Punto en la línea */}
                  <div 
                    className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 md:w-8 md:h-8 rounded-full border-2 md:border-4 border-white shadow-lg z-10"
                    style={{ backgroundColor: '#8A4D76' }}
                  />

                  {/* Contenido */}
                  <div className={`w-5/12 ${isLeft ? 'text-right pr-3 md:pr-12' : 'text-left pl-3 md:pl-12'}`}>
                    {/* Badge de fase */}
                    <div className={`inline-block mb-1 md:mb-4 px-2 md:px-5 py-0.5 md:py-2 rounded-full text-white font-semibold text-[10px] md:text-base shadow-md`}
                         style={{ backgroundColor: '#8A4D76' }}>
                      {video.fecha}
                    </div>
                    
                    {/* Título y descripción */}
                    <h3 className="text-xs md:text-2xl lg:text-3xl font-bold mb-0.5 md:mb-3 leading-tight" style={{ color: '#8A4D76' }}>
                      {videoTranslations[index]?.title || ''}
                    </h3>
                    <p className="text-gray-600 text-[10px] md:text-lg leading-relaxed hidden sm:block">
                      {videoTranslations[index]?.description || ''}
                    </p>
                  </div>

                  {/* Espacio central */}
                  <div className="w-2/12" />

                  {/* Video */}
                  <div className="w-5/12">
                    <div className="relative bg-gray-900 rounded-lg md:rounded-2xl overflow-hidden shadow-md md:shadow-2xl hover:shadow-lg md:hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] md:hover:scale-105"
                         style={{ aspectRatio: '9/16', maxHeight: '650px' }}>
                      {/* Skeleton loader */}
                      {!loadedVideos.has(index) && (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse flex items-center justify-center z-10">
                          <div className="flex flex-col items-center gap-1 md:gap-2">
                            <svg className="animate-spin h-6 w-6 md:h-12 md:w-12 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-gray-600 text-[9px] md:text-sm hidden sm:block">
                              {video.platform === 'instagram' ? t('timeline.loadingInstagram') : t('timeline.loadingYoutube')}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Embed según plataforma */}
                      {video.platform === 'youtube' ? (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${video.id}?rel=0&modestbranding=1`}
                          title={videoTranslations[index]?.title || ''}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          onLoad={() => handleVideoLoad(index)}
                        />
                      ) : (
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.instagram.com/reel/${video.id}/embed/`}
                          title={videoTranslations[index]?.title || ''}
                          frameBorder="0"
                          scrolling="no"
                          allowTransparency={true}
                          loading="lazy"
                          onLoad={() => handleVideoLoad(index)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        
      </div>
    </div>
  );
}
