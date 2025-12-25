/**
 * @file ContactoPage - Página de Formulario de Contacto
 * @route /contacto
 * @description Formulario de contacto público con envío de emails vía SMTP
 */
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactoPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    email: "",
    mensaje: "",
    consentimiento: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.consentimiento) {
      setError("Debes aceptar el consentimiento para enviar el formulario");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:4000/api/contacto", {
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
      } else {
        const data = await response.json();
        setError(data.message || "Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error de conexión. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#F5ECE6' }}>
        <div className="max-w-4xl mx-auto py-12">
          <button
            onClick={() => router.push("/")}
            className="mb-6 px-6 py-2 rounded-full bg-white text-[#8A4D76] font-semibold hover:shadow-md transition-all"
          >
            ← Volver al inicio
          </button>

          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-200">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#8A4D76' }}>
              Contacto
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              ¿Tienes alguna pregunta o deseas colaborar con nosotros? Completa el formulario y nos pondremos en contacto contigo lo antes posible.
            </p>

            {success && (
              <div className="mb-6 p-4 rounded-lg bg-green-100 border border-green-400 text-green-700">
                ✓ Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-100 border border-red-400 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-gray-700 font-semibold mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="apellidos" className="block text-gray-700 font-semibold mb-2">
                  Apellidos *
                </label>
                <input
                  type="text"
                  id="apellidos"
                  value={formData.apellidos}
                  onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-gray-700 font-semibold mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none h-40 resize-none"
                  required
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentimiento"
                  checked={formData.consentimiento}
                  onChange={(e) => setFormData({ ...formData, consentimiento: e.target.checked })}
                  className="mt-1 w-5 h-5 text-[#8A4D76] border-2 border-gray-300 rounded focus:ring-[#8A4D76]"
                  required
                />
                <label htmlFor="consentimiento" className="text-gray-700 text-sm">
                  Acepto que mis datos personales sean utilizados para responder a mi consulta, de acuerdo con la{" "}
                  <a 
                    href="/privacidad" 
                    className="font-semibold hover:underline"
                    style={{ color: '#8A4D76' }}
                  >
                    política de privacidad
                  </a>
                  {" "}de Amets Goien. *
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full text-white font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#8A4D76' }}
              >
                {loading ? "Enviando..." : "Enviar mensaje"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
