/**
 * @file TrabajadoresPage - Gestión de Base de Datos de Trabajadores
 * @route /dashboard/trabajadores
 * @description CRUD completo para gestión de trabajadores/empleados con búsqueda y notificaciones
 */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Empleado {
  id: number;
  nombre: string;
  apellidos: string;
  edad: number | null;
  dni: string | null;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  cargo: string | null;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function TrabajadoresPage() {
  const router = useRouter();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmpleado, setEditingEmpleado] = useState<Empleado | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<Empleado>>({
    nombre: "",
    apellidos: "",
    edad: undefined,
    dni: "",
    email: "",
    telefono: "",
    direccion: "",
    cargo: ""
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingEmpleado(null);
    setFormData({
      nombre: "",
      apellidos: "",
      edad: undefined,
      dni: "",
      email: "",
      telefono: "",
      direccion: "",
      cargo: ""
    });
  };

  // Función para exportar datos a JSON
  const exportToJSON = () => {
    const dataStr = JSON.stringify(empleados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trabajadores_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Datos exportados exitosamente', 'success');
  };

  // Función para exportar datos a CSV
  const exportToCSV = () => {
    if (empleados.length === 0) {
      showNotification('No hay datos para exportar', 'info');
      return;
    }
    
    const headers = ['ID', 'Nombre', 'Apellidos', 'Edad', 'DNI', 'Email', 'Teléfono', 'Dirección', 'Cargo'];
    const csvContent = [
      headers.join(','),
      ...empleados.map(e => [
        e.id,
        `"${e.nombre || ''}"`,
        `"${e.apellidos || ''}"`,
        e.edad || '',
        `"${e.dni || ''}"`,
        `"${e.email || ''}"`,
        `"${e.telefono || ''}"`,
        `"${e.direccion || ''}"`,
        `"${e.cargo || ''}"`
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trabajadores_backup_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Datos exportados exitosamente', 'success');
  };

  const filteredEmpleados = empleados.filter((empleado) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      empleado.nombre.toLowerCase().includes(searchLower) ||
      empleado.apellidos.toLowerCase().includes(searchLower) ||
      (empleado.dni?.toLowerCase().includes(searchLower) || false) ||
      (empleado.email?.toLowerCase().includes(searchLower) || false) ||
      (empleado.telefono?.toLowerCase().includes(searchLower) || false) ||
      (empleado.cargo?.toLowerCase().includes(searchLower) || false)
    );
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/acceso-interno");
      return;
    }
    fetchEmpleados();
  }, [router]);

  const fetchEmpleados = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/empleados`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEmpleados(data);
      } else if (response.status === 401) {
        router.push("/acceso-interno");
      }
    } catch (error) {
      console.error("Error fetching empleados:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/empleados`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification("Trabajador/a creado/a exitosamente", "success");
        resetForm();
        fetchEmpleados();
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.message || "No se pudo crear"}`, "error");
      }
    } catch (error) {
      console.error("Error creating empleado:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmpleado) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/empleados/${editingEmpleado.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification("Trabajador/a actualizado/a exitosamente", "success");
        resetForm();
        fetchEmpleados();
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.message || "No se pudo actualizar"}`, "error");
      }
    } catch (error) {
      console.error("Error updating empleado:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/empleados/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        showNotification("Trabajador/a eliminado/a exitosamente", "success");
        fetchEmpleados();
        setShowDeleteConfirm(null);
      } else {
        showNotification("Error al eliminar", "error");
      }
    } catch (error) {
      console.error("Error deleting empleado:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleEdit = (empleado: Empleado) => {
    setEditingEmpleado(empleado);
    setFormData({
      nombre: empleado.nombre,
      apellidos: empleado.apellidos,
      edad: empleado.edad || undefined,
      dni: empleado.dni || "",
      email: empleado.email || "",
      telefono: empleado.telefono || "",
      direccion: empleado.direccion || "",
      cargo: empleado.cargo || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-20 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#E8D5F2' }}>
          <div className="text-center py-20">
            <p className="text-2xl text-gray-700">Cargando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#E8D5F2' }}>
        <div className="max-w-7xl mx-auto py-8">
          {/* Notificación */}
          {notification && (
            <div className="fixed top-24 right-8 z-50 animate-slide-in">
              <div className={`rounded-2xl shadow-xl p-4 min-w-[300px] ${
                notification.type === 'success' ? 'bg-green-500' :
                notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
              }`}>
                <p className="text-white font-semibold">{notification.message}</p>
              </div>
            </div>
          )}

          {/* Modal de confirmación */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4">
                <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                  Confirmar eliminación
                </h3>
                <p className="text-gray-700 mb-6">
                  ¿Estás seguro de eliminar este/a trabajador/a? Esta acción no se puede deshacer.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleDelete(showDeleteConfirm)}
                    className="flex-1 py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
                  >
                    Eliminar
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 py-3 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-8">
            <div>
              <button
                onClick={() => router.push("/dashboard")}
                className="mb-4 px-6 py-2 rounded-full bg-white text-[#8A4D76] font-semibold hover:shadow-md transition-all"
              >
                ← Volver al Dashboard
              </button>
              <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#8A4D76' }}>
                Gestión de Trabajadores
              </h1>
            </div>
            
            {/* Botones de exportación */}
            <div className="flex gap-3">
              <button
                onClick={exportToJSON}
                className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 hover:shadow-lg transition-all flex items-center gap-2"
                title="Descargar copia de seguridad en formato JSON"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                JSON
              </button>
              <button
                onClick={exportToCSV}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 hover:shadow-lg transition-all flex items-center gap-2"
                title="Descargar copia de seguridad en formato CSV (Excel)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                CSV
              </button>
            </div>
          </div>

          {/* Botón Nuevo/a Trabajador/a */}
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="mb-6 px-8 py-3 rounded-2xl text-white font-semibold hover:shadow-xl transition-all"
            style={{ backgroundColor: '#8A4D76' }}
          >
            {showForm ? "Cancelar" : "+ Nuevo/a Trabajador/a"}
          </button>

          {/* Buscador */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar por nombre, apellidos, DNI, email, teléfono o cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 font-bold text-xl"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-200">
              <h2 className="text-3xl font-bold mb-6" style={{ color: '#8A4D76' }}>
                {editingEmpleado ? "Editar Trabajador/a" : "Nuevo/a Trabajador/a"}
              </h2>
              <form onSubmit={editingEmpleado ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Apellidos *</label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Edad</label>
                  <input
                    type="number"
                    value={formData.edad || ""}
                    onChange={(e) => setFormData({ ...formData, edad: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                    min="18"
                    max="120"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">DNI</label>
                  <input
                    type="text"
                    value={formData.dni || ""}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                    placeholder="12345678A"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                    placeholder="ejemplo@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.telefono || ""}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                    placeholder="+34 600 000 000"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-800 font-semibold mb-2">Dirección</label>
                  <input
                    type="text"
                    value={formData.direccion || ""}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                    placeholder="Calle, Número, Piso, Ciudad, CP"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-800 font-semibold mb-2">Cargo</label>
                  <input
                    type="text"
                    value={formData.cargo || ""}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                    placeholder="ej: Enfermero/a, Cuidador/a, Administrador/a, etc."
                  />
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full text-white font-semibold hover:shadow-xl transition-all"
                    style={{ backgroundColor: '#8A4D76' }}
                  >
                    {editingEmpleado ? "Actualizar" : "Crear"}
                  </button>
                  {showForm && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 py-3 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}

          {/* Contador de resultados */}
          <div className="mb-4">
            <p className="text-gray-700 font-semibold">
              {searchTerm
                ? `${filteredEmpleados.length} resultado${filteredEmpleados.length !== 1 ? 's' : ''} encontrado${filteredEmpleados.length !== 1 ? 's' : ''}`
                : `Total: ${empleados.length} trabajador${empleados.length !== 1 ? 'es' : ''}`}
            </p>
          </div>

          {/* Lista de trabajadores */}
          <div className="space-y-4">
            {filteredEmpleados.length === 0 ? (
              <div className="bg-white rounded-3xl shadow-lg p-12 text-center border border-gray-200">
                <p className="text-2xl text-gray-500">
                  {searchTerm ? "No se encontraron trabajadores con ese criterio" : "No hay trabajadores registrados"}
                </p>
              </div>
            ) : (
              filteredEmpleados.map((empleado) => (
                <div key={empleado.id} className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold mb-2" style={{ color: '#8A4D76' }}>
                        {empleado.nombre} {empleado.apellidos}
                      </h3>
                      {empleado.cargo && (
                        <p className="text-lg font-semibold text-gray-700 mb-2">
                          🏷️ {empleado.cargo}
                        </p>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700">
                        {empleado.edad && (
                          <p>
                            <span className="font-semibold">Edad:</span> {empleado.edad} años
                          </p>
                        )}
                        {empleado.dni && (
                          <p>
                            <span className="font-semibold">DNI:</span> {empleado.dni}
                          </p>
                        )}
                        {empleado.email && (
                          <p>
                            <span className="font-semibold">Email:</span> {empleado.email}
                          </p>
                        )}
                        {empleado.telefono && (
                          <p>
                            <span className="font-semibold">Teléfono:</span> {empleado.telefono}
                          </p>
                        )}
                        {empleado.direccion && (
                          <p className="md:col-span-2">
                            <span className="font-semibold">Dirección:</span> {empleado.direccion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleEdit(empleado)}
                      className="px-6 py-2 rounded-full text-white font-semibold hover:opacity-90 transition-all"
                      style={{ backgroundColor: '#8A4D76' }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(empleado.id)}
                      className="px-6 py-2 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
