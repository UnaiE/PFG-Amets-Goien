"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RedsysPaymentForm from "@/components/RedsysPaymentForm";
import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Control para habilitar/deshabilitar donaciones
const DONATIONS_DISABLED = false; // Cambiado a false para habilitar Redsys

interface DonacionForm {
  nombre: string;
  apellidos: string;
  email: string;
  prefijoTelefono: string;
  telefono: string;
  direccion: string;
  anotacion: string;
  cantidad: string;
  periodicidad: 'puntual'; // Solo donaciones puntuales
  metodoPago: 'tarjeta' | 'bizum' | ''; // Dos métodos separados
  destino: string; // Destino de la donación (opcional)
  destino_personalizado: string; // Destino personalizado si elige "otro"
  aceptaPolitica: boolean;
}

export default function ColaborarClient() {
  const { t, language } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState<DonacionForm>({
    nombre: "",
    apellidos: "",
    email: "",
    prefijoTelefono: "+34",
    telefono: "",
    direccion: "",
    anotacion: "",
    cantidad: "",
    periodicidad: "puntual",
    metodoPago: "",
    destino: "",
    destino_personalizado: "",
    aceptaPolitica: false
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' | 'info' } | null>(null);
  const [redsysParams, setRedsysParams] = useState<any>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [bizumCopiado, setBizumCopiado] = useState(false);

  // Auto-ocultar mensaje después de 5 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.aceptaPolitica) {
      setMensaje({ texto: t('collaborate.donation.errors.privacyRequired'), tipo: "error" });
      return;
    }

    if (!formData.metodoPago) {
      setMensaje({ texto: t('collaborate.donation.errors.paymentRequired'), tipo: "error" });
      return;
    }

    if (!formData.cantidad || parseFloat(formData.cantidad) <= 0) {
      setMensaje({ texto: t('collaborate.donation.errors.amountRequired'), tipo: "error" });
      return;
    }

    setLoading(true);
    setMensaje(null);

    try {
      // Preparar datos del colaborador
      const colaboradorData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        telefono: formData.telefono ? `${formData.prefijoTelefono} ${formData.telefono}` : null,
        direccion: formData.direccion || null,
        periodicidad: formData.periodicidad,
        destino: formData.destino || null,
        destino_personalizado: formData.destino_personalizado || null,
        anotacion: formData.anotacion ? 
          `Donación puntual: ${formData.cantidad}€ - ${formData.anotacion}` : 
          `Donación puntual: ${formData.cantidad}€ via Redsys`
      };

      // Crear transacción con Redsys
      const response = await fetch(`${API_URL}/api/payment/redsys/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: parseFloat(formData.cantidad),
          metodoPago: formData.metodoPago, // 'tarjeta' o 'bizum'
          colaboradorData
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        console.log('✅ Transacción Redsys creada:', data);
        
        // Guardar parámetros de Redsys y mostrar formulario de pago
        if (data.redsysParams) {
          setRedsysParams(data.redsysParams);
          setOrderId(data.orderId);
          setShowPaymentForm(true);
        } else {
          setMensaje({ texto: t('collaborate.donation.errors.initError'), tipo: "error" });
        }
      } else {
        const error = await response.json();
        setMensaje({ texto: error.message || t('collaborate.donation.errors.processError'), tipo: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje({ texto: t('collaborate.donation.errors.connectionError'), tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div id="main-content" className="min-h-screen pt-20" style={{ backgroundColor: '#E8D5F2' }} role="main">
        
        {/* Notificación de confirmación */}
        {mensaje && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
            <div className={`px-6 py-4 rounded-xl shadow-2xl ${
              mensaje.tipo === 'success' ? 'bg-green-500' : mensaje.tipo === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}>
              <p className="text-white font-semibold text-center">
                {mensaje.tipo === 'success' ? '✅' : mensaje.tipo === 'error' ? '❌' : 'ℹ️'} {mensaje.texto}
              </p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <section className="py-12 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#8A4D76' }}>
          <div className="max-w-6xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('collaborate.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              {t('collaborate.hero.subtitle')}
            </p>
          </div>
        </section>

        {/* Sección: Cómo ayudamos con tus donaciones */}
        <section className="py-16 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#E8D5F2' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                {t('collaborate.howWeUse.title')}
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                {t('collaborate.howWeUse.subtitle2')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-3 mb-12">
              {[
                { 
                  icono: '🏠', 
                  titulo: t('collaborate.howWeUse.items.housing.title'), 
                  descripcion: t('collaborate.howWeUse.items.housing.description'),
                  porcentaje: '',
                  color: '#8A4D76'
                },
                { 
                  icono: '🍽️', 
                  titulo: t('collaborate.howWeUse.items.food.title'), 
                  descripcion: t('collaborate.howWeUse.items.food.description'),
                  porcentaje: '',
                  color: '#A05A89'
                },
                { 
                  icono: '👩‍⚕️', 
                  titulo: t('collaborate.howWeUse.items.psychological.title'), 
                  descripcion: t('collaborate.howWeUse.items.psychological.description'),
                  porcentaje: '',
                  color: '#B876A2'
                },
                { 
                  icono: '🌐', 
                  titulo: t('collaborate.howWeUse.items.social.title'), 
                  descripcion: t('collaborate.howWeUse.items.social.description'),
                  porcentaje: '',
                  color: '#B876A2'
                },
                { 
                  icono: '📚', 
                  titulo: t('collaborate.howWeUse.items.education.title'), 
                  descripcion: t('collaborate.howWeUse.items.education.description'),
                  porcentaje: '',
                  color: '#D092BB'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-300">
                  <div className="text-3xl md:text-5xl mb-2 md:mb-4 text-center">{item.icono}</div>
                  <div className="text-center mb-2 md:mb-3">
                    <span className="text-2xl md:text-3xl font-bold" style={{ color: item.color }}>
                      {item.porcentaje}
                    </span>
                  </div>
                  <h3 className="text-base md:text-xl font-bold mb-2 text-center" style={{ color: '#8A4D76' }}>
                    {item.titulo}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 text-center">
                    {item.descripcion}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4" style={{ borderColor: '#8A4D76' }}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#8A4D76' }}>
                    {t('collaborate.howWeUse.impact.title')}
                  </h3>
                  <p className="text-gray-700">
                    {t('collaborate.howWeUse.impact.text')}
                  </p>
                </div>
                <button
                  onClick={() => {
                    const formulario = document.getElementById('form-donacion');
                    if (formulario) {
                      const yOffset = -100; // Offset para el navbar fijo
                      const y = formulario.getBoundingClientRect().top + window.pageYOffset + yOffset;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }}
                  className="flex-shrink-0 px-8 py-4 rounded-full text-white font-bold hover:shadow-xl transition-all text-lg whitespace-nowrap"
                  style={{ backgroundColor: '#8A4D76' }}
                >
                  {t('collaborate.howWeUse.impact.button')} →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Formulario de Donación y Sección de Impacto en paralelo */}
        <section id="formulario-donacion" className="py-12 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Columna Izquierda: Testimonio e Impacto */}
              <div className="space-y-6">
                {/* Testimonio Real */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4" style={{ borderColor: '#8A4D76' }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-2" style={{ color: '#8A4D76' }}>
                        {t('collaborate.testimonials.title')}
                      </h3>
                      <div className="w-16 h-1 rounded" style={{ backgroundColor: '#F89E3A' }}></div>
                    </div>
                  </div>
                  
                  <blockquote className="relative">
                    <div className="text-6xl absolute -top-4 -left-2 opacity-20" style={{ color: '#8A4D76' }}>"</div>
                    <p className="text-gray-700 italic text-lg leading-relaxed mb-4 pl-6">
                      {t('collaborate.testimonials.main.quote')}
                    </p>
                    <footer className="text-right">
                      <cite className="text-sm text-gray-600 not-italic font-semibold">
                        — {t('collaborate.testimonials.main.author')}
                      </cite>
                    </footer>
                  </blockquote>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                      {t('collaborate.testimonials.main.context')}
                    </p>
                    <p className="text-sm text-gray-700 font-semibold">
                      "{t('collaborate.testimonials.main.quote2')}"
                    </p>
                  </div>
                </div>

                {/* Por qué donar - FAQ Compacto */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                    {t('collaborate.whyDonate.title')}
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#8A4D76' }}>
                        ✓
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{t('collaborate.whyDonate.reasons.transparency.title')}</h4>
                        <p className="text-sm text-gray-600">{t('collaborate.whyDonate.reasons.transparency.text')}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#8A4D76' }}>
                        ✓
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{t('collaborate.whyDonate.reasons.impact.title')}</h4>
                        <p className="text-sm text-gray-600">{t('collaborate.whyDonate.reasons.impact.text')}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#8A4D76' }}>
                        ✓
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{t('collaborate.whyDonate.reasons.humanTreatment.title')}</h4>
                        <p className="text-sm text-gray-600">{t('collaborate.whyDonate.reasons.humanTreatment.text')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mensaje de confianza */}
                <div className="bg-purple-50 rounded-2xl p-8 border-2 border-purple-200">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#8A4D76' }}>
                      {t('collaborate.whyDonate.supportMessage.title')}
                    </h3>
                    <p className="text-gray-700">
                      {t('collaborate.whyDonate.supportMessage.text')}
                    </p>
                  </div>
                </div>

                {/* Otras historias */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h4 className="text-lg font-bold mb-4 text-center" style={{ color: '#8A4D76' }}>
                    {t('collaborate.testimonials.moreStories.title')}
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 italic mb-2">
                        "{t('collaborate.testimonials.moreStories.story1.quote')}"
                      </p>
                      <p className="text-xs text-gray-600 font-semibold">— {t('collaborate.testimonials.moreStories.story1.author')}</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 italic mb-2">
                        "{t('collaborate.testimonials.moreStories.story2.quote')}"
                      </p>
                      <p className="text-xs text-gray-600 font-semibold">— {t('collaborate.testimonials.moreStories.story2.author')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Formulario de Donación */}
              <div id="form-donacion">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 sticky top-24">
              <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: '#8A4D76' }}>
                {t('collaborate.donation.title')}
              </h2>
              <p className="text-center text-gray-600 mb-6">{t('collaborate.donation.subtitle')}</p>
              
              {/* Mensaje de donaciones deshabilitadas */}
              {DONATIONS_DISABLED && (
                <div className="mb-6 p-5 rounded-lg border-2 border-yellow-400 bg-yellow-50">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <h3 className="font-bold text-yellow-800 mb-2">
                        {t('collaborate.donation.temporarilyDisabled')}
                      </h3>
                      <p className="text-sm text-yellow-700 mb-3">
                        {t('collaborate.donation.disabledMessage')}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const seccion = document.getElementById('otras-formas-donar');
                          if (seccion) {
                            const yOffset = -80;
                            const y = seccion.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                          }
                        }}
                        className="text-sm font-semibold text-yellow-800 hover:text-yellow-900 underline flex items-center gap-1"
                      >
                        {t('collaborate.donation.otherOptionsLink')} ↓
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-5">
              <fieldset disabled={DONATIONS_DISABLED} className="space-y-5">
              {/* Datos Personales en Grid Compacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="donacion-nombre" className="block text-gray-800 font-semibold mb-1 text-sm">{t('volunteer.form.name')} *</label>
                  <input
                    type="text"
                    id="donacion-nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="donacion-apellidos" className="block text-gray-800 font-semibold mb-1 text-sm">{t('volunteer.form.surname')} *</label>
                  <input
                    type="text"
                    id="donacion-apellidos"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="donacion-email" className="block text-gray-800 font-semibold mb-1 text-sm">{t('volunteer.form.email')} *</label>
                  <input
                    type="email"
                    id="donacion-email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="donacion-telefono" className="block text-gray-800 font-semibold mb-1 text-sm">{t('collaborate.donation.phone')}</label>
                  <div className="flex gap-2">
                    <select
                      id="donacion-prefijo"
                      value={formData.prefijoTelefono}
                      onChange={(e) => setFormData({ ...formData, prefijoTelefono: e.target.value })}
                      className="px-2 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                      aria-label={t('collaborate.donation.phonePrefix')}
                    >
                      <option value="+34">+34</option>
                      <option value="+33">+33</option>
                      <option value="+1">+1</option>
                    </select>
                    <input
                      type="tel"
                      id="donacion-telefono"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                      placeholder={t('collaborate.donation.phonePlaceholder')}
                      aria-label={t('collaborate.donation.phone')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="donacion-direccion" className="block text-gray-800 font-semibold mb-1 text-sm">{t('collaborate.donation.address')}</label>
                  <input
                    type="text"
                    id="donacion-direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    placeholder={t('collaborate.donation.addressPlaceholder')}
                    aria-label={t('collaborate.donation.address')}
                  />
                </div>
              </div>

              {/* Cantidad a Donar */}
              <fieldset>
                <legend className="block text-gray-800 font-semibold mb-2 text-sm">{t('collaborate.donation.amount')} *</legend>
                <div className="grid grid-cols-4 gap-2 mb-3" role="group" aria-label="Cantidades predefinidas">
                  {[10, 20, 50, 100].map((cantidad) => (
                    <button
                      key={cantidad}
                      type="button"
                      onClick={() => setFormData({ ...formData, cantidad: cantidad.toString() })}
                      className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                        formData.cantidad === cantidad.toString()
                          ? 'text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:border-[#8A4D76]'
                      }`}
                      style={formData.cantidad === cantidad.toString() ? { backgroundColor: '#8A4D76' } : {}}
                      aria-pressed={formData.cantidad === cantidad.toString()}
                      aria-label={`Donar ${cantidad} euros`}
                    >
                      {cantidad}€
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  id="donacion-cantidad"
                  min="1"
                  step="1"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                  placeholder={t('collaborate.donation.amountPlaceholder')}
                  required
                  aria-required="true"
                  aria-label="Cantidad personalizada a donar"
                />
              </fieldset>

              {/* Destino de la Donación (Opcional) */}
              <fieldset>
                <legend className="block text-gray-800 font-semibold mb-2 text-sm">
                  {t('collaborate.donation.destination')} <span className="text-gray-500 text-xs">{t('collaborate.donation.optional')}</span>
                </legend>
                <select
                  id="donacion-destino"
                  value={formData.destino}
                  onChange={(e) => setFormData({ ...formData, destino: e.target.value, destino_personalizado: '' })}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                  aria-label="Destino de la donación"
                >
                  <option value="">{t('collaborate.donation.destinationGeneral')}</option>
                  <option value="casa">{t('collaborate.donation.destinationHouse')}</option>
                  <option value="comida">{t('collaborate.donation.destinationFood')}</option>
                  <option value="ropa">{t('collaborate.donation.destinationClothing')}</option>
                  <option value="estudios">{t('collaborate.donation.destinationEducation')}</option>
                  <option value="salud">{t('collaborate.donation.destinationHealth')}</option>
                  <option value="otro">{t('collaborate.donation.destinationOther')}</option>
                </select>
                
                {formData.destino === 'otro' && (
                  <div className="mt-3">
                    <label htmlFor="donacion-destino-personalizado" className="block text-gray-700 font-medium mb-1 text-sm">
                      {t('collaborate.donation.destinationSpecify')}
                    </label>
                    <input
                      type="text"
                      id="donacion-destino-personalizado"
                      value={formData.destino_personalizado}
                      onChange={(e) => setFormData({ ...formData, destino_personalizado: e.target.value })}
                      maxLength={255}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                      placeholder={t('collaborate.donation.destinationPlaceholder')}
                      aria-label="Destino personalizado"
                    />
                  </div>
                )}
                
                <p className="text-xs text-gray-500 mt-2">
                  {t('collaborate.donation.destinationDescription')}
                </p>
              </fieldset>

              {/* Nota: Periodicidad siempre es 'puntual' - donaciones únicas */}

              {/* Método de Pago - Dos botones separados: Tarjeta y Bizum */}
              <fieldset>
                <legend className="block text-gray-800 font-semibold mb-2 text-sm">{t('collaborate.donation.paymentMethod')} *</legend>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {/* Botón Tarjeta */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, metodoPago: 'tarjeta' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.metodoPago === 'tarjeta'
                        ? 'border-[#8A4D76] bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-[#8A4D76]'
                    }`}
                    aria-pressed={formData.metodoPago === 'tarjeta'}
                    aria-label="Pagar con tarjeta de crédito o débito"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#8A4D76' }} aria-hidden="true">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Tarjeta</h3>
                        <p className="text-xs text-gray-600">Visa, Mastercard, Maestro</p>
                      </div>
                    </div>
                  </button>

                  {/* Botón Bizum */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, metodoPago: 'bizum' })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.metodoPago === 'bizum'
                        ? 'border-[#8A4D76] bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-[#8A4D76]'
                    }`}
                    aria-pressed={formData.metodoPago === 'bizum'}
                    aria-label="Pagar con Bizum"
                  >
                    <div className="flex flex-col items-center text-center gap-2">
                      {/* Imagen de Bizum según idioma */}
                      <img 
                        src={language === 'eu' ? '/bizumEU.png' : '/bizumES.png'} 
                        alt="Bizum" 
                        className="h-12 w-auto object-contain"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">Bizum</h3>
                        <p className="text-xs text-gray-600">Pago instantáneo</p>
                      </div>
                    </div>
                  </button>
                </div>

                <p className="text-xs text-gray-600 text-center mb-3">
                  🔒 {t('collaborate.redsys.secureProcessed')}
                </p>

                  {/* Enlace a otras formas de pago */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-xs text-gray-700">
                      💼 <strong>{t('collaborate.redsys.otherFormsTitle')}</strong> {t('collaborate.redsys.otherFormsText')} <span className="font-mono font-semibold">12892</span>.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          const seccion = document.getElementById('otras-formas-donar');
                          if (seccion) {
                            const yOffset = -80;
                            const y = seccion.getBoundingClientRect().top + window.pageYOffset + yOffset;
                            window.scrollTo({ top: y, behavior: 'smooth' });
                          }
                        }}
                        className="text-purple-600 hover:text-purple-800 underline font-semibold"
                      >
                        {t('collaborate.redsys.seeDetails')}
                      </button>
                    </p>
                  </div>
              </fieldset>

              {/* Política de Privacidad */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <label htmlFor="donacion-politica" className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="donacion-politica"
                    checked={formData.aceptaPolitica}
                    onChange={(e) => setFormData({ ...formData, aceptaPolitica: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-[#8A4D76] focus:ring-[#8A4D76]"
                    required
                    aria-required="true"
                  />
                  <span className="text-gray-700 text-xs">
                    {t('collaborate.donation.privacyConsent')}{" "}
                    <a href="/privacidad" className="font-semibold hover:underline" style={{ color: '#8A4D76' }}>
                      {t('collaborate.donation.privacyLink')}
                    </a>
                    {" "}{t('collaborate.donation.authorizeData')} *
                  </span>
                </label>
              </div>

              {/* Mensaje de respuesta */}
              {mensaje && (
                <div 
                  className={`p-3 rounded-lg text-sm ${
                    mensaje.tipo === 'success' ? 'bg-green-50 border border-green-500 text-green-800' : 'bg-red-50 border border-red-500 text-red-800'
                  }`}
                  role="alert"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {mensaje.texto}
                </div>
              )}

              {/* Botón de Enviar */}
              {!showPaymentForm && (
                <button
                  type="submit"
                  disabled={loading || DONATIONS_DISABLED}
                  className="w-full py-3 rounded-full text-white font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#8A4D76' }}
                >
                  {loading ? t('collaborate.donation.submitting') : `${t('collaborate.donation.donateAmount')} ${formData.cantidad ? formData.cantidad + '€' : ''}`}
                </button>
              )}

              {/* Formulario de pago con Redsys (La Caixa) */}
              {showPaymentForm && redsysParams && orderId && (
                <div className="mt-6">
                  <RedsysPaymentForm 
                    amount={parseFloat(formData.cantidad)} 
                    redsysParams={redsysParams}
                    orderId={orderId}
                  />
                </div>
              )}
              </fieldset>
              </form>
            </div>

            {/* Información adicional */}
            <div className="mt-6 text-center text-gray-600">
              <p className="text-sm">
                🔒 Todas las transacciones son seguras y encriptadas
              </p>
              <p className="text-sm mt-2">
                ¿Necesitas ayuda? Contacta con nosotros en{" "}
                <a href="mailto:info@ametsgoien.org" className="font-semibold hover:underline" style={{ color: '#8A4D76' }}>
                  info@ametsgoien.org
                </a>
              </p>
            </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección: Otras formas de Donar */}
        <section id="otras-formas-donar" className="py-16 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: '#8A4D76' }}>
              {t('collaborate.otherWays.title')}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {t('collaborate.otherWays.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Bizum */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white p-2 shadow-md">
                    <img src="/Bizum.png" alt="Logo Bizum" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t('collaborate.donation.bizum')}</h3>
                </div>
                <div className="bg-white rounded-xl p-4 border border-purple-200 mb-4">
                  <p className="text-sm text-gray-600 mb-2">{t('collaborate.bizumInfo.sendTo')}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-4xl font-bold" style={{ color: '#8A4D76' }}>12892</p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('12892');
                        setBizumCopiado(true);
                        setTimeout(() => setBizumCopiado(false), 2000);
                      }}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        bizumCopiado 
                          ? 'bg-green-500 text-white' 
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                      aria-label={t('collaborate.bizumInfo.copy')}
                    >
                      {bizumCopiado ? `✓ ${t('collaborate.bizumInfo.copied')}` : t('collaborate.bizumInfo.copy')}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                   <strong>{t('collaborate.bizumInfo.remember')}</strong> {t('collaborate.bizumInfo.note')}
                </p>
              </div>

              {/* Cuentas Bancarias */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{t('collaborate.bankTransfer.title')}</h3>
                </div>
                
                {/* Titular */}
                <div className="bg-blue-100 border-l-4 border-blue-600 p-4 mb-4 rounded">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Titular de las cuentas:</p>
                  <p className="text-sm font-bold text-blue-900">ASOCIACION AMETSGOIEN PARA LA ACOGIDA Y LA INTEGRACION SOCIOCULTURAL</p>
                </div>

                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-500 mb-1">Kutxabank</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">ES66 2095 0010 4091 2611 9437</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-500 mb-1">La Caixa</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">ES38 2100 3771 2722 0022 2525</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-500 mb-1">Santander</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">ES91 0049 0260 1624 1160 5455</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                   <strong>{t('collaborate.bankTransfer.concept')}</strong> {t('collaborate.bankTransfer.conceptText')}
                </p>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/contacto"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white hover:shadow-lg transition-all"
                style={{ backgroundColor: '#8A4D76' }}
              >
                {t('collaborate.contact')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
