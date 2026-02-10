/**
 * @file ActividadesPage - Página de Actividades y Talleres
 * @route /actividades
 * @description Página dedicada a mostrar todas las actividades y talleres de AMETS GOIEN
 */
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Actividad {
  id: number;
  titulo: string;
  descripcion: string;
  fecha?: string;
  created_at: string;
}

export default function ActividadesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActividades();
  }, []);

  const fetchActividades = async () => {
    try {
      const response = await fetch(`${API_URL}/api/actividades`);
      if (response.ok) {
        const data = await response.json();
        setActividades(data);
      }
    } catch (error) {
      console.error("Error fetching actividades:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div id="main-content" className="min-h-screen pt-20" style={{ backgroundColor: '#E8D5F2' }} role="main">
        {/* Hero Section */}
        <section className="py-20 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#8A4D76' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                Actividades y Talleres
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Espacios de formación, crecimiento personal y encuentro comunitario diseñados para apoyar a las mujeres en su camino hacia la autonomía y el bienestar.
              </p>
            </div>
          </div>
        </section>

        {/* Lista de actividades */}
        <section className="py-16 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#8A4D76]"></div>
                <p className="text-2xl text-[#8A4D76] mt-4">Cargando actividades...</p>
              </div>
            ) : actividades.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-2xl text-gray-600 font-semibold">No hay actividades programadas actualmente.</p>
                <p className="text-lg text-gray-500 mt-2">Vuelve pronto para ver las próximas actividades.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {actividades.map((actividad) => (
                  <div
                    key={actividad.id}
                    className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#8A4D76]/30 hover:-translate-y-1"
                  >
                    {/* Barra superior decorativa con fecha */}
                    <div className="bg-gradient-to-r from-[#8A4D76] to-[#A65D8E] px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-semibold text-white">
                          {actividad.fecha || 'Fecha por confirmar'}
                        </span>
                      </div>
                      <div className="bg-white/20 px-2 py-1 rounded">
                        <span className="text-xs text-white font-medium">Actividad</span>
                      </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-[#8A4D76] mb-3 line-clamp-2 group-hover:text-[#6B3A5E] transition-colors">
                        {actividad.titulo}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed text-sm mb-4 line-clamp-3">
                        {actividad.descripcion}
                      </p>

                      {/* Footer con icono de publicación */}
                      <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-xs text-gray-500">
                          {new Date(actividad.created_at).toLocaleDateString('es-ES', { 
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Sección de contacto */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#8A4D76] mb-4">
              ¿Necesitas más información?
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Para consultas sobre las actividades o cualquier otra información, puedes contactarnos.
            </p>
            <a href="/contacto">
              <button 
                className="px-8 py-4 bg-[#8A4D76] text-white rounded-full font-semibold text-lg hover:bg-[#6B3A5E] transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Ir a Contacto
              </button>
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

