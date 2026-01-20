/**
 * @file ColaborarPage - Página de Donaciones y Colaboración
 * @route /colaborar
 * @description Página para realizar donaciones mediante Bizum o tarjeta, guardando datos del colaborador
 */
"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface DonacionForm {
  nombre: string;
  apellidos: string;
  email: string;
  prefijoTelefono: string;
  telefono: string;
  direccion: string;
  anotacion: string;
  cantidad: string;
  periodicidad: 'puntual' | 'mensual' | 'trimestral' | 'semestral' | 'anual';
  metodoPago: 'tarjeta' | '';
  aceptaPolitica: boolean;
}

function ColaborarPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    aceptaPolitica: false
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' | 'info' } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
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

  // Detectar retorno de Stripe Checkout
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const sessionId = searchParams.get('session_id');

    if (success === 'true' && sessionId) {
      // Confirmar la suscripción con el backend (en segundo plano)
      fetch(`${API_URL}/api/payment/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ sessionId })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setMensaje({ 
            texto: "¡Suscripción activada! Gracias por tu donación recurrente. Recibirás un email de confirmación.", 
            tipo: "success" 
          });
        } else {
          setMensaje({ 
            texto: "Donación procesada. Recibirás un email de confirmación en breve.", 
            tipo: "success" 
          });
        }
      })
      .catch(error => {
        console.error("Error confirmando suscripción:", error);
        setMensaje({ 
          texto: "Donación procesada. Recibirás un email de confirmación en breve.", 
          tipo: "success" 
        });
      });

      // Limpiar URL inmediatamente
      router.replace('/colaborar', { scroll: false });
    } else if (canceled === 'true') {
      setMensaje({ 
        texto: "Donación cancelada. Puedes intentarlo de nuevo cuando quieras.", 
        tipo: "error" 
      });
      // Limpiar URL
      router.replace('/colaborar', { scroll: false });
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.aceptaPolitica) {
      setMensaje({ texto: "Debes aceptar la política de privacidad", tipo: "error" });
      return;
    }

    if (!formData.metodoPago) {
      setMensaje({ texto: "Selecciona un método de pago", tipo: "error" });
      return;
    }

    if (!formData.cantidad || parseFloat(formData.cantidad) <= 0) {
      setMensaje({ texto: "Ingresa una cantidad válida", tipo: "error" });
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
        anotacion: formData.anotacion ? 
          `Donación ${formData.periodicidad}: ${formData.cantidad}€ - ${formData.anotacion}` : 
          `Donación ${formData.periodicidad}: ${formData.cantidad}€ via tarjeta`
      };

      // Para tarjeta, crear Payment Intent o Suscripción con Stripe
      const response = await fetch(`${API_URL}/api/payment/create-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: parseFloat(formData.cantidad),
          colaboradorData
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Si es suscripción, redirigir a Stripe Checkout
        if (data.subscriptionMode) {
          // Redirigir a la URL de Stripe Checkout
          window.location.href = data.sessionUrl;
        } else {
          // Donación puntual - mostrar formulario de pago
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
          setShowPaymentForm(true);
        }
      } else {
        const error = await response.json();
        setMensaje({ texto: error.message || "Error al procesar la donación", tipo: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje({ texto: "Error de conexión. Intenta nuevamente.", tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    const esRecurrente = formData.periodicidad !== 'puntual';
    const textoRecurrente = esRecurrente 
      ? ` Te enviaremos un correo de confirmación con los detalles de tu suscripción ${formData.periodicidad}.` 
      : ' Te enviaremos un correo de confirmación.';
    
    setMensaje({ 
      texto: `🎉 ¡Donación confirmada! Gracias por tu contribución de ${formData.cantidad}€.${textoRecurrente}`, 
      tipo: "success" 
    });
    
    // Resetear formulario
    setTimeout(() => {
      setFormData({
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
        aceptaPolitica: false
      });
      setShowPaymentForm(false);
      setClientSecret(null);
    }, 3000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setMensaje({ texto: errorMessage, tipo: "error" });
  };

  return (
    <>
      <Navbar />
      <div id="main-content" className="min-h-screen pt-20" style={{ backgroundColor: '#E8D5F2' }} role="main">
        
        {/* Notificación de confirmación de suscripción */}
        {mensaje && !searchParams.get('success') && !searchParams.get('canceled') && (
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
              Tu ayuda transforma vidas
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Cada donación contribuye a ofrecer un refugio seguro, apoyo integral y oportunidades de futuro para mujeres refugiadas y sus hijos en nuestra casa de acogida en Orduña.
            </p>
          </div>
        </section>

        {/* Formulario de Donación y Sección de Impacto en paralelo */}
        <section className="py-12 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Columna Izquierda: Información de Impacto */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                    ¿Cómo ayuda tu donación?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Cada aportación contribuye directamente a mantener nuestra casa de acogida en Orduña, donde ofrecemos dignidad, solidaridad y amor a mujeres refugiadas y sus familias.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-3xl">🏠</div>
                    <div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#8A4D76' }}>Casa de Acogida</h3>
                      <p className="text-gray-700 text-sm">Nuestra casa de 12 habitaciones en Orduña, renovada por más de 40 voluntarios, proporciona un hogar seguro y digno.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-3xl">❤️</div>
                    <div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#8A4D76' }}>Acompañamiento Humano</h3>
                      <p className="text-gray-700 text-sm">Priorizamos la dignidad y seguridad emocional, ofreciendo apoyo psicológico y acompañamiento en cada etapa.</p>
                    </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="text-3xl">🌱</div>
                    <div>
                      <h3 className="text-lg font-bold mb-1" style={{ color: '#8A4D76' }}>Construyendo Futuro</h3>
                      <p className="text-gray-700 text-sm">"Gota a gota" ayudamos a cada mujer a reencontrar su fuerza y avanzar hacia una vida estable e independiente.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-5 border-l-4 border-[#8A4D76]">
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#8A4D76' }}>El impacto de tu aportación</h3>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <p><strong>30€</strong> - Alimentación para una familia durante una semana</p>
                    <p><strong>60€</strong> - Material escolar y educativo para los niños</p>
                    <p><strong>100€</strong> - Mantenimiento mensual de una habitación</p>
                    <p><strong>200€</strong> - Apoyo integral mensual para una familia</p>
                    <p className="text-xs italic mt-3">Tu donación ayuda a mantener la asociación, dirigida con amor y solidaridad.</p>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Formulario de Donación */}
              <div>
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 sticky top-24">
              <h2 className="text-3xl font-bold mb-2 text-center" style={{ color: '#8A4D76' }}>
                Haz tu donación
              </h2>
              <p className="text-center text-gray-600 mb-6">Completa el formulario para realizar tu aportación</p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
              {/* Datos Personales en Grid Compacto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="donacion-nombre" className="block text-gray-800 font-semibold mb-1 text-sm">Nombre *</label>
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
                  <label htmlFor="donacion-apellidos" className="block text-gray-800 font-semibold mb-1 text-sm">Apellidos *</label>
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
                  <label htmlFor="donacion-email" className="block text-gray-800 font-semibold mb-1 text-sm">Email *</label>
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
                  <label htmlFor="donacion-telefono" className="block text-gray-800 font-semibold mb-1 text-sm">Teléfono</label>
                  <div className="flex gap-2">
                    <select
                      id="donacion-prefijo"
                      value={formData.prefijoTelefono}
                      onChange={(e) => setFormData({ ...formData, prefijoTelefono: e.target.value })}
                      className="px-2 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                      aria-label="Prefijo telefónico"
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
                      placeholder="600000000"
                      aria-label="Número de teléfono"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="donacion-direccion" className="block text-gray-800 font-semibold mb-1 text-sm">Dirección</label>
                  <input
                    type="text"
                    id="donacion-direccion"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-sm"
                    placeholder="Calle, número, ciudad..."
                    aria-label="Dirección postal"
                  />
                </div>
              </div>

              {/* Cantidad a Donar */}
              <fieldset>
                <legend className="block text-gray-800 font-semibold mb-2 text-sm">Cantidad a Donar *</legend>
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
                  placeholder="Otra cantidad"
                  required
                  aria-required="true"
                  aria-label="Cantidad personalizada a donar"
                />
              </fieldset>

              {/* Periodicidad */}
              <fieldset>
                <legend className="block text-gray-800 font-semibold mb-2 text-sm">Periodicidad *</legend>
                <div className="grid grid-cols-3 gap-2" role="group" aria-label="Seleccionar periodicidad de la donación">
                  {[
                    { value: 'puntual', label: 'Puntual' },
                    { value: 'mensual', label: 'Mensual' },
                    { value: 'trimestral', label: 'Trimestral' },
                    { value: 'semestral', label: 'Semestral' },
                    { value: 'anual', label: 'Anual' }
                  ].map((opcion) => (
                    <button
                      key={opcion.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, periodicidad: opcion.value as any })}
                      className={`py-2 px-3 rounded-lg font-semibold text-xs transition-all ${
                        formData.periodicidad === opcion.value
                          ? 'text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:border-[#8A4D76]'
                      }`}
                      style={formData.periodicidad === opcion.value ? { backgroundColor: '#8A4D76' } : {}}
                      aria-pressed={formData.periodicidad === opcion.value}
                      aria-label={`Donación ${opcion.label.toLowerCase()}`}
                    >
                      {opcion.label}
                    </button>
                  ))}
                </div>
                {formData.periodicidad !== 'puntual' && (
                  <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <p className="text-xs text-blue-800 font-semibold mb-1">
                      💳 Donación Recurrente
                    </p>
                    <p className="text-xs text-blue-700">
                      {formData.metodoPago === 'tarjeta' 
                        ? `Se creará una suscripción automática ${formData.periodicidad}. Podrás cancelarla en cualquier momento desde tu panel de gestión.`
                        : `Se creará una suscripción automática con tu tarjeta. Elige "Tarjeta Bancaria" como método de pago.`
                      }
                    </p>
                  </div>
                )}
              </fieldset>

              {/* Método de Pago Compacto */}
              <fieldset>
                <legend className="block text-gray-800 font-semibold mb-2 text-sm">Método de Pago *</legend>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, metodoPago: 'tarjeta' })}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      formData.metodoPago === 'tarjeta'
                        ? 'border-[#8A4D76] bg-purple-50'
                        : 'border-gray-300 bg-white hover:border-[#8A4D76]'
                    }`}
                    aria-pressed={formData.metodoPago === 'tarjeta'}
                    aria-label="Pagar con tarjeta de crédito o débito"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: '#8A4D76' }} aria-hidden="true">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">Tarjeta Bancaria</h3>
                        <p className="text-xs text-gray-600">Pago seguro con Stripe • Soporta suscripciones automáticas</p>
                      </div>
                    </div>
                  </button>

                  {/* Información de Bizum para donaciones manuales */}
                  <div className="p-4 rounded-lg border-2 border-gray-300 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0" style={{ backgroundColor: '#8A4D76' }} aria-hidden="true">B</div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">También puedes donar por Bizum</h3>
                        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-2">
                          <p className="text-xs text-gray-600 mb-1">Envía tu donación al número:</p>
                          <div className="flex items-center justify-between">
                            <p className="text-2xl font-bold" style={{ color: '#8A4D76' }}>12892</p>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText('12892');
                                setBizumCopiado(true);
                                setTimeout(() => setBizumCopiado(false), 2000);
                              }}
                              className={`px-3 py-1 text-xs rounded-full transition-all ${
                                bizumCopiado 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              }`}
                              aria-label="Copiar número de Bizum"
                            >
                              {bizumCopiado ? '✓ Copiado' : 'Copiar'}
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 italic">
                          💡 Recuerda incluir tu nombre en el concepto para que podamos agradecerte personalmente
                        </p>
                      </div>
                    </div>
                  </div>
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
                    Acepto la{" "}
                    <a href="/privacidad" className="font-semibold hover:underline" style={{ color: '#8A4D76' }}>
                      política de privacidad
                    </a>
                    {" "}y autorizo el tratamiento de mis datos *
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
                  disabled={loading}
                  className="w-full py-3 rounded-full text-white font-bold hover:shadow-lg transition-all disabled:opacity-50"
                  style={{ backgroundColor: '#8A4D76' }}
                >
                  {loading ? "Procesando..." : `Donar ${formData.cantidad ? formData.cantidad + '€' : ''}`}
                </button>
              )}
              </form>

              {/* Formulario de pago con tarjeta (Stripe) */}
              {showPaymentForm && clientSecret && paymentIntentId && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                    Completar Pago
                  </h3>
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm 
                      amount={parseFloat(formData.cantidad)} 
                      paymentIntentId={paymentIntentId}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                </div>
              )}
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
      </div>
      <Footer />
    </>
  );
}

export default function ColaborarPage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <div className="min-h-screen pt-20 flex items-center justify-center" style={{ backgroundColor: '#E8D5F2' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8A4D76] mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando...</p>
          </div>
        </div>
      </>
    }>
      <ColaborarPageContent />
    </Suspense>
  );
}
