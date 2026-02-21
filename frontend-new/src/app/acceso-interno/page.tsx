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
      <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#E8D5F2' }}>
        <div className="w-full max-w-md">
          {/* Card principal */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            {/* Logo pequeño */}
            <div className="flex justify-center mb-6">
              <img 
                src="/logo.png" 
                alt="Ametsgoien" 
                className="h-16 w-auto"
              />
            </div>

            {/* Header simple */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-center mb-2" style={{ color: '#8A4D76' }}>
                Acceso Interno
              </h1>
              <p className="text-gray-500 text-sm text-center">
                Panel de administración
              </p>
            </div>
          
            {/* Mensaje de error */}
            {error && (
              <div 
                role="alert"
                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm"
              >
                {error}
              </div>
            )}
          
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo Usuario */}
              <div>
                <label 
                  htmlFor="usuario-login" 
                  className="block text-sm font-medium mb-1.5 text-gray-700"
                >
                  Usuario
                </label>
                <input
                  id="usuario-login"
                  type="text"
                  placeholder="Nombre de usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8A4D76] focus:ring-1 focus:ring-[#8A4D76] transition-colors text-gray-800"
                  required
                  disabled={loading}
                  autoComplete="username"
                />
              </div>
            
              {/* Campo Contraseña */}
              <div>
                <label 
                  htmlFor="contrasena-login" 
                  className="block text-sm font-medium mb-1.5 text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  id="contrasena-login"
                  type="password"
                  placeholder="Contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#8A4D76] focus:ring-1 focus:ring-[#8A4D76] transition-colors text-gray-800"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            
              {/* Botón de envío */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                style={{ backgroundColor: '#8A4D76' }}
              >
                {loading ? "Verificando..." : "Iniciar sesión"}
              </button>
            </form>
          
            {/* Pie del formulario */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-center text-gray-500 text-xs">
                Solo personal autorizado
              </p>
            </div>
          </div>

          {/* Link volver */}
          <div className="mt-4 text-center">
            <a 
              href="/" 
              className="text-sm text-gray-600 hover:text-[#8A4D76] transition-colors"
            >
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
