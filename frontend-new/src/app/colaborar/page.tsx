/**
 * @file ColaborarPage - Página de Donaciones y Colaboración
 * @route /colaborar
 * @description Página para realizar donaciones mediante Bizum o tarjeta, guardando datos del colaborador
 */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

interface DonacionForm {
  nombre: string;
  apellidos: string;
  email: string;
  prefijoTelefono: string;
  telefono: string;
  direccion: string;
  anotacion: string;
  cantidad: string;
  metodoPago: 'bizum' | 'tarjeta' | '';
  aceptaPolitica: boolean;
}

export default function ColaborarPage() {
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
    metodoPago: "",
    aceptaPolitica: false
  });
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState<{ texto: string; tipo: 'success' | 'error' } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

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
      // Guardar los datos del colaborador en la BD
      const colaboradorData = {
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        email: formData.email,
        telefono: formData.telefono ? `${formData.prefijoTelefono} ${formData.telefono}` : null,
        direccion: formData.direccion || null,
        anotacion: formData.anotacion ? 
          `Donación: ${formData.cantidad}€ - ${formData.anotacion}` : 
          `Donación: ${formData.cantidad}€ via ${formData.metodoPago}`
      };

      if (formData.metodoPago === 'bizum') {
        // Para Bizum, guardar colaborador y mostrar instrucciones
        const response = await fetch("http://localhost:4000/api/colaboradores", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(colaboradorData)
        });

        if (response.ok) {
          setMensaje({ 
            texto: `¡Gracias por tu colaboración de ${formData.cantidad}€!`, 
            tipo: "success" 
          });
          
          setTimeout(() => {
            alert(`Envía ${formData.cantidad}€ al número de Bizum: 600 000 000\nConcepto: Donación Amets Goien`);
            
            // Resetear formulario
            setFormData({
              nombre: "",
              apellidos: "",
              email: "",
              prefijoTelefono: "+34",
              telefono: "",
              direccion: "",
              anotacion: "",
              cantidad: "",
              metodoPago: "",
              aceptaPolitica: false
            });
          }, 1000);
        } else {
          const error = await response.json();
          setMensaje({ texto: error.message || "Error al procesar la donación", tipo: "error" });
        }
      } else {
        // Para tarjeta, crear Payment Intent con Stripe
        const response = await fetch("http://localhost:4000/api/payment/create-intent", {
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
          setClientSecret(data.clientSecret);
          setShowPaymentForm(true);
        } else {
          const error = await response.json();
          setMensaje({ texto: error.message || "Error al procesar la donación", tipo: "error" });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje({ texto: "Error de conexión. Intenta nuevamente.", tipo: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setMensaje({ 
      texto: `¡Pago exitoso! Gracias por tu donación de ${formData.cantidad}€`, 
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
      <div className="min-h-screen pt-20 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#F5ECE6' }}>
        <div className="max-w-4xl mx-auto py-8 md:py-12">
          {/* Encabezado */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#8A4D76' }}>
              Colaborar con Amets Goien
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              Tu donación ayuda a construir un refugio seguro para mujeres migrantes y sus hijos. 
              Cada aporte cuenta y transforma vidas.
            </p>
          </div>

          {/* Formulario de Donación */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Datos Personales */}
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#8A4D76' }}>
                  Tus Datos
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-800 font-semibold mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      value={formData.apellidos}
                      onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-800 font-semibold mb-2">
                      Teléfono
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={formData.prefijoTelefono}
                        onChange={(e) => setFormData({ ...formData, prefijoTelefono: e.target.value })}
                        className="px-3 py-3 rounded-xl border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                      >
                        <option value="+34">🇪🇸 +34</option>
                        <option value="+33">🇫🇷 +33</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+49">🇩🇪 +49</option>
                        <option value="+39">🇮🇹 +39</option>
                        <option value="+351">🇵🇹 +351</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+52">🇲🇽 +52</option>
                        <option value="+54">🇦🇷 +54</option>
                        <option value="+56">🇨🇱 +56</option>
                        <option value="+57">🇨🇴 +57</option>
                        <option value="+58">🇻🇪 +58</option>
                        <option value="+51">🇵🇪 +51</option>
                        <option value="+593">🇪🇨 +593</option>
                        <option value="+591">🇧🇴 +591</option>
                        <option value="+598">🇺🇾 +598</option>
                        <option value="+212">🇲🇦 +212</option>
                        <option value="+213">🇩🇿 +213</option>
                        <option value="+216">🇹🇳 +216</option>
                      </select>
                      <input
                        type="tel"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                        placeholder="600 000 000"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-800 font-semibold mb-2">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                      placeholder="Calle, número, piso, ciudad, código postal"
                    />
                  </div>
                </div>
              </div>

              {/* Mensaje Opcional */}
              <div>
                <label className="block text-gray-800 font-semibold mb-2">
                  Mensaje de Apoyo (opcional)
                </label>
                <textarea
                  value={formData.anotacion}
                  onChange={(e) => setFormData({ ...formData, anotacion: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none h-32"
                  placeholder="Comparte unas palabras de apoyo o tu motivación para colaborar..."
                />
              </div>

              {/* Cantidad a Donar */}
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#8A4D76' }}>
                  Cantidad a Donar
                </h2>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[5, 10, 20].map((cantidad) => (
                    <button
                      key={cantidad}
                      type="button"
                      onClick={() => setFormData({ ...formData, cantidad: cantidad.toString() })}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                        formData.cantidad === cantidad.toString()
                          ? 'text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-[#8A4D76]'
                      }`}
                      style={formData.cantidad === cantidad.toString() ? { backgroundColor: '#8A4D76' } : {}}
                    >
                      {cantidad}€
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={formData.cantidad}
                    onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                    placeholder="Otra cantidad personalizada"
                    required
                  />
                  <span className="text-gray-700 font-semibold text-lg">€</span>
                </div>
              </div>

              {/* Método de Pago */}
              <div>
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#8A4D76' }}>
                  Método de Pago
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, metodoPago: 'bizum' })}
                    className={`p-6 rounded-2xl border-3 transition-all text-left ${
                      formData.metodoPago === 'bizum'
                        ? 'border-[#8A4D76] bg-purple-50 shadow-lg scale-105'
                        : 'border-gray-300 bg-white hover:border-[#8A4D76]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8A4D76' }}>
                        <span className="text-white text-2xl font-bold">B</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Bizum</h3>
                        <p className="text-gray-600 text-sm">Pago rápido y seguro</p>
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, metodoPago: 'tarjeta' })}
                    className={`p-6 rounded-2xl border-3 transition-all text-left ${
                      formData.metodoPago === 'tarjeta'
                        ? 'border-[#8A4D76] bg-purple-50 shadow-lg scale-105'
                        : 'border-gray-300 bg-white hover:border-[#8A4D76]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8A4D76' }}>
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">Tarjeta</h3>
                        <p className="text-gray-600 text-sm">Débito o crédito</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Política de Privacidad */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.aceptaPolitica}
                    onChange={(e) => setFormData({ ...formData, aceptaPolitica: e.target.checked })}
                    className="mt-1 w-5 h-5 rounded border-gray-300 text-[#8A4D76] focus:ring-[#8A4D76]"
                    required
                  />
                  <span className="text-gray-700">
                    Acepto la{" "}
                    <a 
                      href="/privacidad" 
                      target="_blank"
                      className="font-semibold hover:underline"
                      style={{ color: '#8A4D76' }}
                    >
                      política de privacidad
                    </a>
                    {" "}y autorizo el tratamiento de mis datos para procesar esta donación *
                  </span>
                </label>
              </div>

              {/* Mensaje de respuesta */}
              {mensaje && (
                <div className={`p-4 rounded-xl ${
                  mensaje.tipo === 'success' ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'
                }`}>
                  <p className={mensaje.tipo === 'success' ? 'text-green-800' : 'text-red-800'}>
                    {mensaje.texto}
                  </p>
                </div>
              )}

              {/* Botón de Enviar */}
              {!showPaymentForm && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full text-white font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: '#8A4D76' }}
                >
                  {loading ? "Procesando..." : `Donar ${formData.cantidad ? formData.cantidad + '€' : ''}`}
                </button>
              )}
            </form>

            {/* Formulario de pago con tarjeta (Stripe) */}
            {showPaymentForm && clientSecret && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                  Completar Pago
                </h3>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm 
                    amount={parseFloat(formData.cantidad)} 
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              </div>
            )}
          </div>

          {/* Información adicional */}
          <div className="mt-8 text-center text-gray-600">
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
      <Footer />
    </>
  );
}
