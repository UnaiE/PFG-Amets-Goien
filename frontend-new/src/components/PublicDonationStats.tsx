"use client";
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface DesgloseDestino {
  destino: string;
  cantidad_donaciones: number;
  total: number;
  porcentaje: string;
}

interface EstadisticasDonaciones {
  total_recaudado: number;
  total_donaciones: number;
  desglose_por_destino: DesgloseDestino[];
}

export default function PublicDonationStats() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<EstadisticasDonaciones | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_URL}/api/estadisticas/donaciones-publicas`);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error al cargar estadísticas:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getDestinoLabel = (destino: string) => {
    const labels: { [key: string]: string } = {
      casa: t('collaborate.stats.destinations.house'),
      comida: t('collaborate.stats.destinations.food'),
      ropa: t('collaborate.stats.destinations.clothing'),
      estudios: t('collaborate.stats.destinations.education'),
      salud: t('collaborate.stats.destinations.health'),
      general: t('collaborate.stats.destinations.general'),
      otro: t('collaborate.stats.destinations.other')
    };
    return labels[destino] || destino;
  };

  const getDestinoColor = (index: number) => {
    const colors = [
      '#8A4D76',
      '#9B5F8C',
      '#AC70A0',
      '#BD82B3',
      '#CE93C7',
      '#DFA5DB',
      '#F0B7EE'
    ];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
          <div className="space-y-3">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error ||!stats) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center border-2 border-gray-200">
        <div className="text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">{t('collaborate.stats.errorLoading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border-2" style={{ borderColor: '#8A4D76' }}>
      {/* Título */}
      <div className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: '#8A4D76' }}>
          {t('collaborate.stats.title')}
        </h3>
        <p className="text-gray-600 text-sm">
          {t('collaborate.stats.subtitle')}
        </p>
      </div>

      {/* Total Recaudado */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 mb-6 text-center border-2 border-purple-200">
        <p className="text-sm font-semibold text-gray-600 mb-2">
          {t('collaborate.stats.totalRaised')}
        </p>
        <p className="text-4xl md:text-5xl font-bold mb-1" style={{ color: '#8A4D76' }}>
          {stats.total_recaudado.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
        </p>
        <p className="text-xs text-gray-500">
          {stats.total_donaciones} {t('collaborate.stats.donations')}
        </p>
      </div>

      {/* Desglose por Destino */}
      {stats.desglose_por_destino.length > 0 && (
        <div>
          <h4 className="text-lg font-bold mb-4 text-gray-800">
            {t('collaborate.stats.breakdownTitle')}
          </h4>
          
          <div className="space-y-3">
            {stats.desglose_por_destino.map((item, index) => (
              <div
                key={item.destino}
                className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getDestinoColor(index) }}
                    ></div>
                    <span className="font-semibold text-gray-900">
                      {getDestinoLabel(item.destino || 'general')}
                    </span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: getDestinoColor(index) }}>
                    {item.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}€
                  </span>
                </div>
                
                {/* Barra de progreso */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${item.porcentaje}%`,
                      backgroundColor: getDestinoColor(index)
                    }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">
                    {item.cantidad_donaciones} {t('collaborate.stats.donations')}
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {item.porcentaje}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Nota informativa */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-center text-gray-500">
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('collaborate.stats.onlyRedsys')}
        </p>
      </div>
    </div>
  );
}
