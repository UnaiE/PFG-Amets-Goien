"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

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

  // Preparar datos para gráficas
  // 1. Donaciones por mes (últimos 6 meses)
  const prepareMonthlyData = () => {
    const monthlyData: Record<string, { mes: string, cantidad: number, total: number }> = {};
    const now = new Date();
    
    // Inicializar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
      monthlyData[key] = { mes: monthName, cantidad: 0, total: 0 };
    }
    
    // Agrupar donaciones completadas por mes
    donacionesFiltradas
      .filter(d => d.estado === 'completada')
      .forEach(donacion => {
        const date = new Date(donacion.created_at);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyData[key]) {
          monthlyData[key].cantidad += 1;
          monthlyData[key].total += parseFloat(donacion.cantidad);
        }
      });
    
    return Object.values(monthlyData);
  };

  // 2. Distribución por periodicidad
  const preparePeriodicidadData = () => {
    const periodicidadCount: Record<string, number> = {
      'puntual': 0,
      'mensual': 0,
      'trimestral': 0,
      'semestral': 0,
      'anual': 0
    };
    
    donacionesFiltradas.forEach(d => {
      if (periodicidadCount[d.periodicidad] !== undefined) {
        periodicidadCount[d.periodicidad]++;
      }
    });
    
    return Object.entries(periodicidadCount)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  };

  // 3. Distribución por estado
  const prepareEstadoData = () => {
    const estadoCount: Record<string, number> = {};
    
    donacionesFiltradas.forEach(d => {
      estadoCount[d.estado] = (estadoCount[d.estado] || 0) + 1;
    });
    
    return Object.entries(estadoCount).map(([estado, cantidad]) => ({
      estado,
      cantidad
    }));
  };

  // 4. Distribución por método de pago
  const prepareMetodoPagoData = () => {
    const metodoCount: Record<string, { monto: number, cantidad: number }> = {};
    
    donacionesFiltradas
      .filter(d => d.estado === 'completada')
      .forEach(d => {
        const metodo = d.metodo_pago || 'Tarjeta';
        if (!metodoCount[metodo]) {
          metodoCount[metodo] = { monto: 0, cantidad: 0 };
        }
        metodoCount[metodo].monto += parseFloat(d.cantidad);
        metodoCount[metodo].cantidad += 1;
      });
    
    return Object.entries(metodoCount).map(([name, data]) => ({
      name,
      value: data.monto,
      cantidad: data.cantidad
    }));
  };

  // Colores para las gráficas
  const COLORS = ['#8A4D76', '#B85F9A', '#D88BB8', '#E8A5C9', '#F5C1DA', '#FFD4E5'];

  const monthlyData = prepareMonthlyData();
  const periodicidadData = preparePeriodicidadData();
  const estadoData = prepareEstadoData();
  const metodoPagoData = prepareMetodoPagoData();

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
          <div className="mb-8">
            {/* Botón Volver - Siempre visible arriba */}
            <button
              onClick={() => router.push('/dashboard')}
              className="mb-4 px-4 py-2 sm:px-6 rounded-full bg-white text-[#8A4D76] font-semibold hover:shadow-md transition-all inline-block"
            >
              ← Volver al Dashboard
            </button>
            
            {/* Contenedor responsive del título y botones */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2" style={{ color: '#8A4D76' }}>
                  Historial de Donaciones
                </h1>
                <p className="text-gray-700 text-sm sm:text-base">Vista de solo lectura de todas las donaciones registradas</p>
              </div>
              
              {/* Botones de exportación - Responsive */}
              <div className="flex flex-row gap-2 sm:gap-3">
                <button
                  onClick={exportDonacionesToJSON}
                  className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 rounded-xl bg-green-600 text-white text-sm sm:text-base font-semibold hover:bg-green-700 hover:shadow-lg transition-all flex items-center justify-center gap-1 sm:gap-2"
                  title="Exportar donaciones a JSON"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  JSON
                </button>
                <button
                  onClick={exportDonacionesToCSV}
                  className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 rounded-xl bg-blue-600 text-white text-sm sm:text-base font-semibold hover:bg-blue-700 hover:shadow-lg transition-all flex items-center justify-center gap-1 sm:gap-2"
                  title="Exportar donaciones a CSV"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  CSV
                </button>
              </div>
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

          {/* Gráficas */}
          <div className="mb-8 space-y-6">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>Análisis de Datos</h2>
            
            {/* Primera fila: Evolución temporal y Distribución por periodicidad */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfica de evolución temporal */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Evolución Temporal (Últimos 6 meses)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" style={{ fontSize: '12px' }} />
                    <YAxis yAxisId="left" style={{ fontSize: '12px' }} />
                    <YAxis yAxisId="right" orientation="right" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                      formatter={(value: any, name?: string) => {
                        if (name === 'total') return [value.toFixed(2) + '€', 'Total Recaudado'];
                        return [value, 'Cantidad de Donaciones'];
                      }}
                    />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="cantidad" 
                      stroke="#8A4D76" 
                      strokeWidth={2}
                      name="Cantidad"
                      dot={{ fill: '#8A4D76', r: 4 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="total" 
                      stroke="#B85F9A" 
                      strokeWidth={2}
                      name="Total (€)"
                      dot={{ fill: '#B85F9A', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfica de distribución por periodicidad */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Distribución por Periodicidad</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={periodicidadData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => entry.name && entry.percent ? `${entry.name}: ${(entry.percent * 100).toFixed(0)}%` : ''}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {periodicidadData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Segunda fila: Estado y Método de pago */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfica de distribución por estado */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Distribución por Estado</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={estadoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="estado" style={{ fontSize: '12px' }} />
                    <YAxis style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                      formatter={(value: any) => [value, 'Cantidad']}
                    />
                    <Legend />
                    <Bar dataKey="cantidad" fill="#8A4D76" name="Cantidad" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Gráfica de método de pago */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Recaudación por Método de Pago</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={metodoPagoData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => entry.name && entry.value ? `${entry.name}: ${entry.value.toFixed(2)}€` : ''}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {metodoPagoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                      formatter={(value: any, name, props: any) => [
                        `${value.toFixed(2)}€ (${props.payload.cantidad} donaciones)`,
                        'Total'
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
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
        </div>
      </div>
    </>
  );
}
