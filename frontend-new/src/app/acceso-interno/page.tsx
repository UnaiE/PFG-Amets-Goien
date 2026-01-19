/**
 * @file LoginPage - Página de Acceso Interno (Login)
 * @route /acceso-interno
 * @description Página de autenticación con JWT para acceso al dashboard administrativo
 */
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function AccesoInterno() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: usuario, password: contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar token y redirigir
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard"; // Redirigir al panel interno
      } else {
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (err) {
      setError("Error de conexión con el servidor");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ backgroundColor: '#E8D5F2' }}>
        <div className="w-full max-w-md">
          {/* Card principal */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 rounded-full mb-4" style={{ backgroundColor: '#E8D5F2' }}>
                <svg 
                  className="w-12 h-12" 
                  style={{ color: '#8A4D76' }}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: '#8A4D76' }}>
                Acceso Interno
              </h1>
              <p className="text-gray-600 text-lg">
                Zona privada para personal autorizado
              </p>
            </div>
          
            {/* Mensaje de error con mejor diseño */}
            {error && (
              <div 
                role="alert"
                aria-live="polite"
                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
              >
                <div className="flex items-start">
                  <svg 
                    className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-800 font-medium">{error}</p>
                </div>
              </div>
            )}
          
            {/* Formulario mejorado */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Usuario */}
              <div>
                <label 
                  htmlFor="usuario-login" 
                  className="block text-sm font-semibold mb-2" 
                  style={{ color: '#8A4D76' }}
                >
                  Usuario
                </label>
                <input
                  id="usuario-login"
                  type="text"
                  placeholder="Introduce tu nombre de usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#8A4D76] focus:ring-2 focus:ring-[#8A4D76]/20 transition-all text-base text-gray-800 placeholder-gray-400"
                  required
                  disabled={loading}
                  aria-required="true"
                  autoComplete="username"
                />
              </div>
            
              {/* Campo Contraseña */}
              <div>
                <label 
                  htmlFor="contrasena-login" 
                  className="block text-sm font-semibold mb-2" 
                  style={{ color: '#8A4D76' }}
                >
                  Contraseña
                </label>
                <input
                  id="contrasena-login"
                  type="password"
                  placeholder="Introduce tu contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#8A4D76] focus:ring-2 focus:ring-[#8A4D76]/20 transition-all text-base text-gray-800 placeholder-gray-400"
                  required
                  disabled={loading}
                  aria-required="true"
                  autoComplete="current-password"
                />
              </div>
            
              {/* Botón de envío */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#8A4D76' }}
                aria-label={loading ? "Procesando inicio de sesión" : "Iniciar sesión"}
              >
                {loading ? (
                  <>
                    <svg 
                      className="animate-spin h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <span>Iniciar Sesión</span>
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          
            {/* Mensaje informativo */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm leading-relaxed">
                🔒 Acceso restringido al personal de Ametsgoien.<br />
                Si necesitas acceso, contacta con la administración.
              </p>
            </div>
          </div>

          {/* Información adicional fuera del card */}
          <div className="mt-6 text-center">
            <a 
              href="/" 
              className="text-sm font-medium hover:underline transition-all"
              style={{ color: '#8A4D76' }}
            >
              ← Volver a la página principal
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
