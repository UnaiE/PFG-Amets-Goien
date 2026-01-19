/**
 * @file ColaboradoresPage - Gestión de Base de Datos de Colaboradores
 * @route /dashboard/colaboradores
 * @description CRUD completo para gestión de colaboradores con búsqueda y notificaciones
 */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Colaborador {
  id: number;
  nombre: string;
  apellidos: string;
  email: string | null;
  telefono: string | null;
  direccion: string | null;
  anotacion: string | null;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function ColaboradoresPage() {
  const router = useRouter();
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<Colaborador | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<Colaborador>>({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: "",
    anotacion: ""
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingColaborador(null);
    setFormData({
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      direccion: "",
      anotacion: ""
    });
  };

  const filteredColaboradores = colaboradores.filter((colaborador) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      colaborador.nombre.toLowerCase().includes(searchLower) ||
      colaborador.apellidos.toLowerCase().includes(searchLower) ||
      (colaborador.email?.toLowerCase().includes(searchLower) || false) ||
      (colaborador.telefono?.toLowerCase().includes(searchLower) || false) ||
      (colaborador.direccion?.toLowerCase().includes(searchLower) || false)
    );
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/acceso-interno");
      return;
    }
    fetchColaboradores();
  }, [router]);

  const fetchColaboradores = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/colaboradores`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setColaboradores(data);
      } else if (response.status === 401) {
        router.push("/acceso-interno");
      }
    } catch (error) {
      console.error("Error fetching colaboradores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/colaboradores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification("Colaborador/a creado/a exitosamente", "success");
        resetForm();
        fetchColaboradores();
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.message || "No se pudo crear"}`, "error");
      }
    } catch (error) {
      console.error("Error creating colaborador:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingColaborador) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/colaboradores/${editingColaborador.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification("Colaborador/a actualizado/a exitosamente", "success");
        resetForm();
        fetchColaboradores();
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.message || "No se pudo actualizar"}`, "error");
      }
    } catch (error) {
      console.error("Error updating colaborador:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/colaboradores/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        showNotification("Colaborador/a eliminado/a exitosamente", "success");
        fetchColaboradores();
        setShowDeleteConfirm(null);
      } else {
        showNotification("Error al eliminar", "error");
      }
    } catch (error) {
      console.error("Error deleting colaborador:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleEdit = (colaborador: Colaborador) => {
    setEditingColaborador(colaborador);
    setFormData({
      nombre: colaborador.nombre,
      apellidos: colaborador.apellidos,
      email: colaborador.email || "",
      telefono: colaborador.telefono || "",
      direccion: colaborador.direccion || "",
      anotacion: colaborador.anotacion || ""
    });
    setShowForm(true);
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <button
                onClick={() => router.push("/dashboard")}
                className="mb-4 px-6 py-2 rounded-full bg-white text-[#8A4D76] font-semibold hover:shadow-md transition-all"
              >
                ← Volver al Dashboard
              </button>
              <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#8A4D76' }}>
                Gestión de Colaboradores
              </h1>
            </div>
          </div>

          {/* Botón Nuevo/a Colaborador/a */}
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="mb-6 px-8 py-3 rounded-2xl text-white font-semibold hover:shadow-xl transition-all"
            style={{ backgroundColor: '#8A4D76' }}
          >
            {showForm ? "Cancelar" : "+ Nuevo/a Colaborador/a"}
          </button>

          {/* Buscador */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar por nombre, apellidos, email, teléfono o dirección..."
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
                {editingColaborador ? "Editar Colaborador/a" : "Nuevo/a Colaborador/a"}
              </h2>
              <form onSubmit={editingColaborador ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    placeholder="Calle, número, ciudad..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-800 font-semibold mb-2">Anotaciones</label>
                  <textarea
                    value={formData.anotacion || ""}
                    onChange={(e) => setFormData({ ...formData, anotacion: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white h-32"
                    placeholder="Notas adicionales, observaciones..."
                  />
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
                  >
                    {editingColaborador ? "Actualizar" : "Crear"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 py-3 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de Colaboradores */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
              Listado de Colaboradores ({filteredColaboradores.length}{searchTerm && ` de ${colaboradores.length}`})
            </h2>
            
            {filteredColaboradores.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-200">
                <p className="text-gray-600">
                  {searchTerm ? `No se encontraron colaboradores con "${searchTerm}"` : "No hay colaboradores registrados/as"}
                </p>
              </div>
            ) : (
              filteredColaboradores.map((colaborador) => (
                <div key={colaborador.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: '#8A4D76' }}>
                        {colaborador.nombre} {colaborador.apellidos}
                      </h3>
                      {colaborador.email && (
                        <p className="text-gray-700 mt-1">📧 {colaborador.email}</p>
                      )}
                      {colaborador.telefono && (
                        <p className="text-gray-700 mt-1">📱 {colaborador.telefono}</p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(colaborador)}
                        className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
                        style={{ backgroundColor: '#8A4D76' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(colaborador.id)}
                        className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:opacity-90 transition-all"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 text-gray-800">
                    {colaborador.direccion && (
                      <p><strong>Dirección:</strong> {colaborador.direccion}</p>
                    )}
                  </div>

                  {colaborador.anotacion && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-800"><strong>Anotaciones:</strong></p>
                      <p className="text-gray-700 mt-2 whitespace-pre-wrap">{colaborador.anotacion}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Notificación personalizada */}
        {notification && (
          <div className="fixed top-24 right-8 z-50 transition-all duration-300 ease-in-out transform translate-x-0">
            <div className={`rounded-2xl shadow-xl p-4 min-w-[300px] ${
              notification.type === 'success' ? 'bg-green-500' :
              notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
            }`}>
              <p className="text-white font-semibold">{notification.message}</p>
            </div>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                Confirmar eliminación
              </h3>
              <p className="text-gray-700 mb-6">
                ¿Estás seguro/a de que deseas eliminar este/a colaborador/a? Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="flex-1 py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
                >
                  Sí, eliminar
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
      </div>
    </>
  );
}
