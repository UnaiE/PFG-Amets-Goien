"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function VoluntariosPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    mensaje: ""
  });
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{type: 'success' | 'error' | null, message: string}>({type: null, message: ''});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!aceptaPrivacidad) {
      setSubmitStatus({
        type: 'error',
        message: 'Debes aceptar la política de privacidad y el envío de comunicaciones para continuar.'
      });
      return;
    }
    
    setLoading(true);
    setSubmitStatus({type: null, message: ''});

    try {
      const response = await fetch(`${API_URL}/api/colaboradores/registro-voluntario`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || '¡Gracias por registrarte como voluntario!'
        });
        // Limpiar formulario
        setFormData({
          nombre: "",
          apellidos: "",
          email: "",
          telefono: "",
          direccion: "",
          mensaje: ""
        });
        setAceptaPrivacidad(false);
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.message || 'Hubo un error al procesar tu registro'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Error de conexión. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20" style={{ backgroundColor: '#E8D5F2' }}>
        <div className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Botón Volver */}
          <button
            onClick={() => router.push("/")}
            className="mb-6 px-5 py-2 rounded-full bg-white text-[#8A4D76] font-semibold hover:shadow-md transition-all text-sm"
          >
            ← Volver
          </button>

          {/* Layout de dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* COLUMNA IZQUIERDA - Información */}
            <div className="space-y-6">
              
              {/* Encabezado principal */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h1 className="text-4xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                   Hazte Voluntario/a
                </h1>
                <p className="text-gray-700 text-lg leading-relaxed">
                  Tu tiempo, energía y compromiso pueden cambiar vidas. En Ametsgoien, cada voluntario es una pieza fundamental para alcanzar nuestros objetivos y apoyar a quienes más lo necesitan.
                </p>
              </div>

              {/* ¿Qué hacen nuestros voluntarios? */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                  ¿Qué hacen nuestros voluntarios?
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">➣</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Apoyo en actividades</h3>
                      <p className="text-gray-600 text-sm">Participación en eventos y programas comunitarios.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">➣</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Acompañamiento</h3>
                      <p className="text-gray-600 text-sm">Escucha activa y apoyo emocional a personas en situación de vulnerabilidad.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">➣</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Difusión</h3>
                      <p className="text-gray-600 text-sm">Ayuda en redes sociales, comunicación y sensibilización social.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl flex-shrink-0">➣</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-1">Enseñanza de habilidades</h3>
                      <p className="text-gray-600 text-sm">Alimentar con tus conocimientos y ayudar a personas a desarrollar nuevas habilidades.</p>
                    </div>
                  </div>
                </div>
              </div>


              {/* Comunicaciones */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                   Mantente informado
                </h2>
                <p className="text-gray-700 mb-3">
                  Como voluntario/a, recibirás periódicamente:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 flex-shrink-0">✓</span>
                    <span>Información sobre próximas actividades y eventos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 flex-shrink-0">✓</span>
                    <span>Noticias y actualizaciones de la asociación</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 flex-shrink-0">✓</span>
                    <span>Oportunidades para colaborar según tu disponibilidad</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-2 flex-shrink-0">✓</span>
                    <span>Convocatorias de reuniones y encuentros de voluntarios</span>
                  </li>
                </ul>
                <p className="text-gray-500 text-sm mt-4 italic">
                  Puedes darte de baja de nuestras comunicaciones en cualquier momento.
                </p>
              </div>

            </div>

            {/* COLUMNA DERECHA - Formulario */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 lg:sticky lg:top-24 h-fit">
            
            {/* Título */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#8A4D76' }}>
                Formulario de Registro
              </h2>
              <p className="text-gray-600 text-sm">
                Completa tus datos y nos pondremos en contacto contigo pronto.
              </p>
            </div>

            {/* Mensajes de estado */}
            {submitStatus.type && (
              <div className={`mb-4 p-4 rounded-lg ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-200 text-green-800' 
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="text-sm font-medium">{submitStatus.message}</p>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Nombre y Apellidos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-1 text-sm">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label htmlFor="apellidos" className="block text-gray-700 font-semibold mb-1 text-sm">
                    Apellidos <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    placeholder="Tus apellidos"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-1 text-sm">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                  placeholder="tu@email.com"
                />
              </div>

              {/* Teléfono y Localidad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="telefono" className="block text-gray-700 font-semibold mb-1 text-sm">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    placeholder="+34 600 000 000"
                  />
                </div>

                <div>
                  <label htmlFor="direccion" className="block text-gray-700 font-semibold mb-1 text-sm">
                    Localidad
                  </label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    placeholder="Tu ciudad"
                  />
                </div>
              </div>

              {/* Mensaje */}
              <div>
                <label htmlFor="mensaje" className="block text-gray-700 font-semibold mb-1 text-sm">
                  Cuéntanos sobre ti
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm resize-none"
                  placeholder="Disponibilidad, habilidades que puedas aportar, experiencia previa..."
                />
              </div>

              {/* Checkbox de privacidad */}
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={aceptaPrivacidad}
                    onChange={(e) => setAceptaPrivacidad(e.target.checked)}
                    required
                    className="mt-1 w-4 h-4 text-[#8A4D76] border border-gray-300 rounded focus:ring-[#8A4D76] cursor-pointer"
                  />
                  <span className="ml-2 text-gray-700 text-xs leading-relaxed">
                    He leído y acepto la{' '}
                    <a 
                      href="/privacidad" 
                      target="_blank" 
                      className="text-[#8A4D76] underline hover:text-[#6d3c5e] font-semibold"
                    >
                      política de privacidad
                    </a>
                    {' '}y autorizo a Ametsgoien a contactarme y enviarme comunicaciones relacionadas con la actividad de la asociación.
                  </span>
                </label>
              </div>

              {/* Botón submit */}
              <button
                type="submit"
                disabled={loading || !aceptaPrivacidad}
                className="w-full py-3 px-6 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                style={{ backgroundColor: '#8A4D76' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  'Registrarme como Voluntario'
                )}
              </button>

            </form>
          </div>
          {/* Fin COLUMNA DERECHA - Formulario */}

          </div>
          {/* Fin layout de dos columnas */}

        </div>
      </div>
      <Footer />
    </>
  );
}
