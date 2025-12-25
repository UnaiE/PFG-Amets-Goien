/**
 * @file LoginPage - Página de Acceso Interno (Login)
 * @route /acceso-interno
 * @description Página de autenticación con JWT para acceso al dashboard administrativo
 */
"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
      const response = await fetch("http://localhost:4000/api/users/login", {
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
      <div className="min-h-screen flex items-center justify-center px-4 pt-20" style={{ backgroundColor: '#D8B8C4' }}>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4" style={{ color: '#8A4D76' }}>
            Acceso Interno
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Zona privada. Solo personal autorizado.
          </p>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="Usuario"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#8A4D76] transition-colors text-base text-gray-800 placeholder-gray-400"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-[#8A4D76] transition-colors text-base text-gray-800 placeholder-gray-400"
                required
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full font-semibold text-white text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#8A4D76' }}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
          
          <p className="text-center text-gray-500 text-sm mt-6">
            Acceso restringido. Si no tienes cuenta, contacta con la administración.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
