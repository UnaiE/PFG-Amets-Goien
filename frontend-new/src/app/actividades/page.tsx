/**
 * @file ActividadesPage - Página de Actividades y Talleres
 * @route /actividades
 * @description Página dedicada a mostrar todas las actividades y talleres de AMETS GOIEN
 */
"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      const response = await fetch("http://localhost:4000/api/actividades");
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
          <div className="max-w-6xl mx-auto">
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
              <div className="space-y-6">
                {actividades.map((actividad) => (
                  <div
                    key={actividad.id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200"
                  >
                    <div className="p-8">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <h3 className="text-2xl md:text-3xl font-bold text-[#8A4D76] flex-1">
                          {actividad.titulo}
                        </h3>
                        {actividad.fecha && (
                          <div className="bg-[#E8D5F2] px-4 py-2 rounded-lg border border-[#8A4D76]/20">
                            <p className="text-sm font-semibold text-[#8A4D76]">
                              {actividad.fecha}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {actividad.descripcion}
                      </p>

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                          Publicado: {new Date(actividad.created_at).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
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

