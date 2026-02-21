"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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

export default function ColaborarClient() {
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
        
        // Tanto para puntual como para suscripción, mostrar formulario de pago
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
          setShowPaymentForm(true);
        } else {
          setMensaje({ texto: "Error al inicializar el pago", tipo: "error" });
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
              Tu ayuda transforma vidas
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Cada donación contribuye a ofrecer un refugio seguro, apoyo integral y oportunidades de futuro para mujeres refugiadas y sus hijos en nuestra casa de acogida en Orduña.
            </p>
          </div>
        </section>

        {/* Sección: Cómo ayudamos con tus donaciones */}
        <section className="py-16 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#E8D5F2' }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                ¿Cómo usamos tus donaciones?
              </h2>
              <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                Cada euro que aportas se destina íntegramente a mejorar la vida de las mujeres y familias que acogemos. Aquí te mostramos cómo invertimos tu ayuda:
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { 
                  icono: '🏠', 
                  titulo: 'Alojamiento', 
                  descripcion: 'Mantenimiento de la casa de acogida en Orduña',
                  porcentaje: '40%',
                  color: '#8A4D76'
                },
                { 
                  icono: '🍽️', 
                  titulo: 'Alimentación', 
                  descripcion: 'Comida nutritiva para las familias residentes',
                  porcentaje: '25%',
                  color: '#A05A89'
                },
                { 
                  icono: '👩‍⚕️', 
                  titulo: 'Apoyo Psicológico', 
                  descripcion: 'Acompañamiento emocional y terapias',
                  porcentaje: '20%',
                  color: '#B876A2'
                },
                { 
                  icono: '📚', 
                  titulo: 'Educación', 
                  descripcion: 'Material escolar y formación para madres e hijos',
                  porcentaje: '15%',
                  color: '#D092BB'
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-300">
                  <div className="text-5xl mb-4 text-center">{item.icono}</div>
                  <div className="text-center mb-3">
                    <span className="text-3xl font-bold" style={{ color: item.color }}>
                      {item.porcentaje}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center" style={{ color: '#8A4D76' }}>
                    {item.titulo}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {item.descripcion}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-l-4" style={{ borderColor: '#8A4D76' }}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex-shrink-0 text-6xl">💝</div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2" style={{ color: '#8A4D76' }}>
                    Tu aportación, por pequeña que sea, marca la diferencia
                  </h3>
                  <p className="text-gray-700">
                    Operamos con total transparencia y eficiencia. El 100% de las donaciones va directamente a los programas de apoyo. 
                    Los gastos administrativos se cubren mediante subvenciones y colaboraciones institucionales.
                  </p>
                </div>
                <button
                  onClick={() => document.getElementById('formulario-donacion')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex-shrink-0 px-8 py-4 rounded-full text-white font-bold hover:shadow-xl transition-all text-lg whitespace-nowrap"
                  style={{ backgroundColor: '#8A4D76' }}
                >
                  Donar ahora →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Formulario de Donación y Sección de Impacto en paralelo */}
        <section id="formulario-donacion" className="py-12 px-4 md:px-8 lg:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Columna Izquierda: Testimonio e Impacto */}
              <div className="space-y-6">
                {/* Testimonio Real */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4" style={{ borderColor: '#8A4D76' }}>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">💬</div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2" style={{ color: '#8A4D76' }}>
                        Testimonios reales
                      </h3>
                      <div className="w-16 h-1 rounded" style={{ backgroundColor: '#F89E3A' }}></div>
                    </div>
                  </div>
                  
                  <blockquote className="relative">
                    <div className="text-6xl absolute -top-4 -left-2 opacity-20" style={{ color: '#8A4D76' }}>"</div>
                    <p className="text-gray-700 italic text-lg leading-relaxed mb-4 pl-6">
                      Encontrar un espacio seguro y humano marca la diferencia entre el miedo y la dignidad. Ametsgoien representa esa acogida real que muchas mujeres necesitamos.
                    </p>
                    <footer className="text-right">
                      <cite className="text-sm text-gray-600 not-italic font-semibold">
                        — Mariana, Beneficiaria
                      </cite>
                    </footer>
                  </blockquote>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-3">
                      Mariana llegó al País Vasco buscando encontrar solución médica y reunirse con su hijo. Como madre sola y mujer migrada, enfrentó discriminación en el acceso a la vivienda y dificultades en cada paso.
                    </p>
                    <p className="text-sm text-gray-700 font-semibold">
                      "Para mí, acoger no es solo abrir una casa, sino abrir los brazos y acercar los corazones."
                    </p>
                  </div>
                </div>

                {/* Por qué donar - FAQ Compacto */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                    ¿Por qué donar a Amets Goien?
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#8A4D76' }}>
                        ✓
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">100% transparencia</h4>
                        <p className="text-sm text-gray-600">Cada euro va directamente a los programas de apoyo</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#8A4D76' }}>
                        ✓
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Impacto real y medible</h4>
                        <p className="text-sm text-gray-600">Tu donación ayuda directamente a las familias acogidas en nuestra casa de Orduña</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: '#8A4D76' }}>
                        ✓
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Trato humano y cercano</h4>
                        <p className="text-sm text-gray-600">No somos un número, somos una familia que acoge con amor</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mensaje de confianza */}
                <div className="bg-purple-50 rounded-2xl p-8 border-2 border-purple-200">
                  <div className="text-center">
                    <div className="text-5xl mb-4">💝</div>
                    <h3 className="text-xl font-bold mb-3" style={{ color: '#8A4D76' }}>
                      Tu apoyo marca la diferencia
                    </h3>
                    <p className="text-gray-700">
                      Con tu donación ayudas a mantener nuestra casa de acogida en Orduña, donde ofrecemos dignidad, solidaridad y amor a mujeres refugiadas y sus familias.
                    </p>
                  </div>
                </div>

                {/* Otras historias */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h4 className="text-lg font-bold mb-4 text-center" style={{ color: '#8A4D76' }}>
                    Más historias de esperanza
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 italic mb-2">
                        "Como madre, lo más importante es sentirte protegida y acompañada. Un lugar seguro puede cambiarlo todo."
                      </p>
                      <p className="text-xs text-gray-600 font-semibold">— Emadolis</p>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700 italic mb-2">
                        "Sin apoyo y sin vivienda, la vida se vuelve insostenible. Las asociaciones que acompañan de verdad cambian destinos."
                      </p>
                      <p className="text-xs text-gray-600 font-semibold">— Berita</p>
                    </div>
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

                  {/* Enlace a otras formas de pago */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-blue-800 mb-2">
                      💡 <strong>¿Prefieres Bizum o transferencia bancaria?</strong>
                    </p>
                    <p className="text-xs text-blue-700 mb-3">
                      Consulta la sección "Otras formas de donar" al final de la página para ver todas las opciones disponibles.
                    </p>
                    <button
                      type="button"
                      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline"
                    >
                      Ver opciones de pago alternativas 
                    </button>
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

        {/* Sección: Otras formas de Donar */}
        <section className="py-16 px-4 md:px-8 lg:px-16 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: '#8A4D76' }}>
              Otras formas de Donar
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Si tienes algún problema al realizar tu donación o quieres más información sobre otras formas de pago, no lo dudes y contáctanos
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Bizum */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-white p-2 shadow-md">
                    <img src="/Bizum.png" alt="Logo Bizum" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Bizum</h3>
                </div>
                <div className="bg-white rounded-xl p-4 border border-purple-200 mb-4">
                  <p className="text-sm text-gray-600 mb-2">Envía tu donación al número:</p>
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
                      aria-label="Copiar número de Bizum"
                    >
                      {bizumCopiado ? '✓ Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  💡 <strong>Recuerda:</strong> Incluye tu nombre en el concepto para que podamos agradecerte personalmente
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
                  <h3 className="text-2xl font-bold text-gray-900">Transferencia Bancaria</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-500 mb-1">BBVA</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">ES52 0182 1290 35 0010853001</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-xs text-gray-500 mb-1">Kutxabank</p>
                    <p className="font-mono text-sm font-semibold text-gray-900">ES06 2095 0000 70 9101227989</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-4">
                  💡 <strong>Concepto:</strong> "Donación" + tu nombre
                </p>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/contacto"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white hover:shadow-lg transition-all"
                style={{ backgroundColor: '#F89E3A' }}
              >
                Contactar
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
