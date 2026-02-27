"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from '@/contexts/LanguageContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function VoluntariosPage() {
  const router = useRouter();
  const { t } = useLanguage();
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
          message: data.message || t('volunteer.form.success')
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
          message: data.message || t('volunteer.form.error')
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus({
        type: 'error',
        message: t('volunteer.form.connectionError')
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
            ← {t('common.back')}
          </button>

          {/* Layout de dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* COLUMNA IZQUIERDA - Información */}
            <div className="space-y-6">
              
              {/* Encabezado principal */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h1 className="text-4xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                  {t('volunteer.title')}
                </h1>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {t('volunteer.subtitle')}
                </p>
              </div>

              {/* ¿Qué hacen nuestros voluntarios? */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                  {t('volunteer.whatDo')}
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('volunteer.activities.support')}</h3>
                    <p className="text-gray-600 text-sm">{t('volunteer.activities.supportDesc')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('volunteer.activities.accompaniment')}</h3>
                    <p className="text-gray-600 text-sm">{t('volunteer.activities.accompanimentDesc')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('volunteer.activities.dissemination')}</h3>
                    <p className="text-gray-600 text-sm">{t('volunteer.activities.disseminationDesc')}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{t('volunteer.activities.admin')}</h3>
                    <p className="text-gray-600 text-sm">{t('volunteer.activities.adminDesc')}</p>
                  </div>
                </div>
              </div>

              


              {/* Comunicaciones */}
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                  {t('volunteer.communications')}
                </h2>
                <p className="text-gray-700 mb-3">
                  {t('volunteer.communicationsDesc')}
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li>{t('volunteer.communicationsList.activities')}</li>
                  <li>{t('volunteer.communicationsList.news')}</li>
                  <li>{t('volunteer.communicationsList.opportunities')}</li>
                  <li>{t('volunteer.communicationsList.meetings')}</li>
                </ul>
                <p className="text-gray-500 text-sm mt-4 italic">
                  {t('volunteer.unsubscribe')}
                </p>
              </div>

            </div>

            {/* COLUMNA DERECHA - Formulario */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200 lg:sticky lg:top-24 h-fit">
            
            {/* Título */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#8A4D76' }}>
                {t('volunteer.formTitle')}
              </h2>
              <p className="text-gray-600 text-sm">
                {t('volunteer.formSubtitle')}
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
                    {t('volunteer.form.name')} <span className="text-red-500">*</span>
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
                    {t('volunteer.form.surname')} <span className="text-red-500">*</span>
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
                  {t('volunteer.form.email')} <span className="text-red-500">*</span>
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
                    {t('volunteer.form.phone')}
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
                    {t('volunteer.form.location')}
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
                  {t('volunteer.form.message')}
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm resize-none"
                  placeholder={t('volunteer.form.messagePlaceholder')}
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
                    {t('volunteer.form.privacy')}{' '}
                    <a 
                      href="/privacidad" 
                      className="text-[#8A4D76] underline hover:text-[#6d3c5e] font-semibold"
                    >
                      {t('volunteer.form.privacyLink')}
                    </a>
                    {' '}{t('volunteer.form.privacyText')}
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
                    {t('volunteer.form.sending')}
                  </span>
                ) : (
                  t('volunteer.form.submit')
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
