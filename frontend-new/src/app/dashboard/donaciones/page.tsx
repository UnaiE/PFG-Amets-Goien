"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Función helper para obtener el rol del usuario desde el token
function getUserRoleFromToken(): string {
  const token = localStorage.getItem("token");
  if (!token) return "";
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    return payload.role || "";
  } catch (error) {
    console.error("Error decoding token:", error);
    return "";
  }
}

interface Donacion {
  id: number;
  colaborador_id: number;
  colaborador_nombre?: string;
  colaborador_email?: string;
  cantidad: string;
  metodo_pago: string;
  stripe_payment_intent_id: string;
  stripe_subscription_id: string;
  periodicidad: string;
  estado: string;
  anotacion: string;
  created_at: string;
  updated_at: string;
}

export default function DonacionesPage() {
  const router = useRouter();
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriodicidad, setFilterPeriodicidad] = useState("todas");
  const [filterEstado, setFilterEstado] = useState("todos");

  useEffect(() => {
    // Verificar si hay token y si es admin
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/acceso-interno");
      return;
    }

    const role = getUserRoleFromToken();
    if (role !== 'admin') {
      router.push("/dashboard");
      return;
    }

    fetchDonaciones();
  }, [router]);

  const fetchDonaciones = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/donaciones`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDonaciones(data);
      } else {
        console.error("Error fetching donaciones");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCantidad = (cantidad: string) => {
    return parseFloat(cantidad).toFixed(2) + '€';
  };

  // Funciones de exportación para donaciones
  const exportDonacionesToJSON = () => {
    const dataStr = JSON.stringify(donacionesFiltradas, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donaciones_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportDonacionesToCSV = () => {
    if (donacionesFiltradas.length === 0) {
      alert('No hay donaciones para exportar');
      return;
    }
    
    const headers = ['ID', 'Colaborador', 'Email', 'Cantidad', 'Método Pago', 'Periodicidad', 'Estado', 'Payment Intent ID', 'Subscription ID', 'Anotación', 'Fecha Creación'];
    const csvContent = [
      headers.join(','),
      ...donacionesFiltradas.map(d => [
        d.id,
        `"${d.colaborador_nombre || ''}"`,
        `"${d.colaborador_email || ''}"`,
        d.cantidad,
        `"${d.metodo_pago}"`,
        `"${d.periodicidad}"`,
        `"${d.estado}"`,
        `"${d.stripe_payment_intent_id || ''}"`,
        `"${d.stripe_subscription_id || ''}"`,
        `"${d.anotacion?.replace(/"/g, '""') || ''}"`,
        d.created_at || ''
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `donaciones_backup_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getEstadoBadge = (estado: string) => {
    const colors: Record<string, string> = {
      'completada': 'bg-green-100 text-green-800',
      'pendiente': 'bg-yellow-100 text-yellow-800',
      'procesando': 'bg-blue-100 text-blue-800',
      'fallido': 'bg-red-100 text-red-800'
    };
    return colors[estado] || 'bg-gray-100 text-gray-800';
  };

  const getPeriodicidadBadge = (periodicidad: string) => {
    const colors: Record<string, string> = {
      'puntual': 'bg-purple-100 text-purple-800',
      'mensual': 'bg-blue-100 text-blue-800',
      'trimestral': 'bg-indigo-100 text-indigo-800',
      'semestral': 'bg-pink-100 text-pink-800',
      'anual': 'bg-orange-100 text-orange-800'
    };
    return colors[periodicidad] || 'bg-gray-100 text-gray-800';
  };

  // Filtrar donaciones
  const donacionesFiltradas = donaciones.filter(donacion => {
    const matchSearch = 
      donacion.colaborador_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donacion.colaborador_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donacion.cantidad.includes(searchTerm);
    
    const matchPeriodicidad = filterPeriodicidad === "todas" || donacion.periodicidad === filterPeriodicidad;
    const matchEstado = filterEstado === "todos" || donacion.estado === filterEstado;

    return matchSearch && matchPeriodicidad && matchEstado;
  });

  // Calcular estadísticas
  const totalDonaciones = donacionesFiltradas.length;
  const totalRecaudado = donacionesFiltradas
    .filter(d => d.estado === 'completada')
    .reduce((sum, d) => sum + parseFloat(d.cantidad), 0);
  const donacionesRecurrentes = donacionesFiltradas.filter(d => d.periodicidad !== 'puntual').length;

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 px-4 md:px-8 lg:px-16 flex items-center justify-center" style={{ backgroundColor: '#E8D5F2' }}>
          <p className="text-xl" style={{ color: '#8A4D76' }}>Cargando donaciones...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#E8D5F2' }}>
        <div className="max-w-7xl mx-auto py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2" style={{ color: '#8A4D76' }}>
                Historial de Donaciones
              </h1>
              <p className="text-gray-700">Vista de solo lectura de todas las donaciones registradas</p>
            </div>
            <div className="flex gap-3">
              {/* Botones de exportación */}
              <button
                onClick={exportDonacionesToJSON}
                className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 hover:shadow-lg transition-all flex items-center gap-2"
                title="Exportar donaciones a JSON"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                JSON
              </button>
              <button
                onClick={exportDonacionesToCSV}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-lg transition-all flex items-center gap-2"
                title="Exportar donaciones a CSV"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                CSV
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2 rounded-full bg-white text-[#8A4D76] hover:shadow-md transition-all"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Donaciones</h3>
              <p className="text-3xl font-bold" style={{ color: '#8A4D76' }}>{totalDonaciones}</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Total Recaudado</h3>
              <p className="text-3xl font-bold" style={{ color: '#8A4D76' }}>{totalRecaudado.toFixed(2)}€</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Donaciones Recurrentes</h3>
              <p className="text-3xl font-bold" style={{ color: '#8A4D76' }}>{donacionesRecurrentes}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Buscar</label>
                <input
                  type="text"
                  placeholder="Nombre, email o cantidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Periodicidad</label>
                <select
                  value={filterPeriodicidad}
                  onChange={(e) => setFilterPeriodicidad(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                >
                  <option value="todas">Todas</option>
                  <option value="puntual">Puntual</option>
                  <option value="mensual">Mensual</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                <select
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                >
                  <option value="todos">Todos</option>
                  <option value="completada">Completada</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="procesando">Procesando</option>
                  <option value="fallido">Fallido</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tabla de donaciones */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#E8D5F2' }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Fecha</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Colaborador</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Cantidad</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Periodicidad</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Método</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {donacionesFiltradas.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No se encontraron donaciones
                      </td>
                    </tr>
                  ) : (
                    donacionesFiltradas.map((donacion) => (
                      <tr key={donacion.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatFecha(donacion.created_at)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {donacion.colaborador_nombre || `ID: ${donacion.colaborador_id}`}
                          </div>
                          {donacion.colaborador_email && (
                            <div className="text-xs text-gray-500">{donacion.colaborador_email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">
                          {formatCantidad(donacion.cantidad)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPeriodicidadBadge(donacion.periodicidad)}`}>
                            {donacion.periodicidad}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoBadge(donacion.estado)}`}>
                            {donacion.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {donacion.metodo_pago || 'Tarjeta'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-blue-900 mb-2">ℹ️ Información</h3>
            <p className="text-sm text-blue-800">
              Esta vista es de solo lectura. Para gestionar colaboradores o ver detalles completos, 
              visita la sección de <strong>Colaboradores</strong> en el dashboard.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
