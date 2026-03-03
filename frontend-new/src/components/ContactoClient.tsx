"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface FormErrors {
  [key: string]: string;
}

export default function ContactoClient() {
  const { t } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    mensaje: "",
    consentimiento: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [generalError, setGeneralError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setSuccess(false);

    if (!formData.consentimiento) {
      setErrors({ consentimiento: t('contact.errorConsent') });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/contacto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          nombre: "",
          apellidos: "",
          email: "",
          mensaje: "",
          consentimiento: false
        });
        // Scroll to top para ver el mensaje de éxito
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const data = await response.json();
        console.error("Error del servidor:", data);
        
        // Procesar errores campo por campo
        if (data.errors && Array.isArray(data.errors)) {
          const fieldErrors: FormErrors = {};
          data.errors.forEach((error: any) => {
            fieldErrors[error.field] = error.message;
          });
          setErrors(fieldErrors);
        } else {
          setGeneralError(data.message || t('contact.errorSend'));
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setGeneralError(t('contact.errorConnection'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div id="main-content" className="min-h-screen pt-20 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#E8D5F2' }} role="main">
        <div className="max-w-3xl mx-auto py-8">
          <button
            onClick={() => router.push("/")}
            className="mb-4 px-5 py-2 rounded-full bg-white text-[#8A4D76] font-semibold hover:shadow-md transition-all text-sm"
          >
            ← {t('contact.backButton')}
          </button>

          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: '#8A4D76' }}>
              {t('contact.title')}
            </h1>
            <p className="text-base text-gray-700 mb-6">
              {t('contact.subtitle')}
            </p>

            {success && (
              <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-400 text-green-800 text-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-semibold">✓ {t('contact.successMessage')}</p>
                  </div>
                </div>
              </div>
            )}

            {generalError && (
              <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-400 text-red-800 text-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p>{generalError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-1 text-sm">
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => {
                      setFormData({ ...formData, nombre: e.target.value });
                      if (errors.nombre) {
                        setErrors({ ...errors, nombre: '' });
                      }
                    }}
                    className={`w-full px-3 py-2 rounded-lg border text-gray-900 bg-white focus:outline-none text-sm transition-colors ${
                      errors.nombre 
                        ? 'border-red-400 focus:border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:border-[#8A4D76]'
                    }`}
                    required
                  />
                  {errors.nombre && (
                    <p className="mt-1 text-xs text-red-600 flex items-start gap-1">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.nombre}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="apellidos" className="block text-gray-700 font-semibold mb-1 text-sm">
                    {t('contact.form.surname')} *
                  </label>
                  <input
                    type="text"
                    id="apellidos"
                    value={formData.apellidos}
                    onChange={(e) => {
                      setFormData({ ...formData, apellidos: e.target.value });
                      if (errors.apellidos) {
                        setErrors({ ...errors, apellidos: '' });
                      }
                    }}
                    className={`w-full px-3 py-2 rounded-lg border text-gray-900 bg-white focus:outline-none text-sm transition-colors ${
                      errors.apellidos 
                        ? 'border-red-400 focus:border-red-500 bg-red-50' 
                        : 'border-gray-300 focus:border-[#8A4D76]'
                    }`}
                    required
                  />
                  {errors.apellidos && (
                    <p className="mt-1 text-xs text-red-600 flex items-start gap-1">
                      <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.apellidos}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-1 text-sm">
                  {t('contact.form.email')} *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg border text-gray-900 bg-white focus:outline-none text-sm transition-colors ${
                    errors.email 
                      ? 'border-red-400 focus:border-red-500 bg-red-50' 
                      : 'border-gray-300 focus:border-[#8A4D76]'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 flex items-start gap-1">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-gray-700 font-semibold mb-1 text-sm">
                  {t('contact.form.message')} *
                </label>
                <textarea
                  id="mensaje"
                  value={formData.mensaje}
                  onChange={(e) => {
                    setFormData({ ...formData, mensaje: e.target.value });
                    if (errors.mensaje) {
                      setErrors({ ...errors, mensaje: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 rounded-lg border text-gray-900 bg-white focus:outline-none h-32 resize-none text-sm transition-colors ${
                    errors.mensaje 
                      ? 'border-red-400 focus:border-red-500 bg-red-50' 
                      : 'border-gray-300 focus:border-[#8A4D76]'
                  }`}
                  required
                />
                {errors.mensaje && (
                  <p className="mt-1 text-xs text-red-600 flex items-start gap-1">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.mensaje}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="consentimiento"
                    checked={formData.consentimiento}
                    onChange={(e) => {
                      setFormData({ ...formData, consentimiento: e.target.checked });
                      if (errors.consentimiento) {
                        setErrors({ ...errors, consentimiento: '' });
                      }
                    }}
                    className={`mt-1 w-4 h-4 text-[#8A4D76] border rounded focus:ring-[#8A4D76] transition-colors ${
                      errors.consentimiento ? 'border-red-400' : 'border-gray-300'
                    }`}
                    required
                  />
                  <label htmlFor="consentimiento" className="text-gray-700 text-xs">
                    {t('contact.form.consent')}{" "}
                    <a 
                      href="/privacidad" 
                      className="font-semibold hover:underline"
                      style={{ color: '#8A4D76' }}
                    >
                      {t('contact.form.privacyPolicy')}
                    </a>
                    {" "}{t('contact.form.consentEnd')} *
                  </label>
                </div>
                {errors.consentimiento && (
                  <p className="mt-1 text-xs text-red-600 flex items-start gap-1 ml-6">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.consentimiento}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#8A4D76' }}
              >
                {loading ? t('contact.form.sending') : t('contact.form.send')}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
