/**
 * @file ResidentesPage - Gestión de Base de Datos de Residentes
 * @route /dashboard/residentes
 * @description CRUD completo para gestión de residentes con búsqueda y notificaciones
 */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Residente {
  id: number;
  nombre: string;
  apellidos: string;
  nacionalidad: string | null;
  fecha_nacimiento: string | null;
  edad: number | null;
  fecha_entrada: string | null;
  fecha_salida: string | null;
  sexo: string | null;
  situacion: string | null;
  anotacion: string | null;
  direccion: string | null;
  enlaces_documentos: string | null;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function ResidentesPage() {
  const router = useRouter();
  const [residentes, setResidentes] = useState<Residente[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResidente, setEditingResidente] = useState<Residente | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<Partial<Residente>>({
    nombre: "",
    apellidos: "",
    nacionalidad: "",
    fecha_nacimiento: "",
    edad: undefined,
    fecha_entrada: "",
    fecha_salida: "",
    sexo: "",
    situacion: "",
    anotacion: "",
    direccion: "",
    enlaces_documentos: ""
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/acceso-interno");
      return;
    }
    fetchResidentes();
  }, [router]);

  const fetchResidentes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/residentes`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setResidentes(data);
      } else if (response.status === 401) {
        router.push("/acceso-interno");
      }
    } catch (error) {
      console.error("Error fetching residentes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/residentes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification("Residente creado/a exitosamente", "success");
        resetForm();
        fetchResidentes();
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.message || "No se pudo crear"}`, "error");
      }
    } catch (error) {
      console.error("Error creating residente:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResidente) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/residentes/${editingResidente.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification("Residente actualizado/a exitosamente", "success");
        resetForm();
        fetchResidentes();
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.message || "No se pudo actualizar"}`, "error");
      }
    } catch (error) {
      console.error("Error updating residente:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/residentes/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        showNotification("Residente eliminado/a exitosamente", "success");
        fetchResidentes();
        setShowDeleteConfirm(null);
      } else {
        showNotification("Error al eliminar", "error");
      }
    } catch (error) {
      console.error("Error deleting residente:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleEdit = (residente: Residente) => {
    setEditingResidente(residente);
    setFormData({
      nombre: residente.nombre,
      apellidos: residente.apellidos,
      nacionalidad: residente.nacionalidad || "",
      fecha_nacimiento: residente.fecha_nacimiento || "",
      edad: residente.edad || undefined,
      fecha_entrada: residente.fecha_entrada || "",
      fecha_salida: residente.fecha_salida || "",
      sexo: residente.sexo || "",
      situacion: residente.situacion || "",
      anotacion: residente.anotacion || "",
      direccion: residente.direccion || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredResidentes = residentes.filter((residente) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      residente.nombre.toLowerCase().includes(searchLower) ||
      residente.apellidos.toLowerCase().includes(searchLower) ||
      (residente.nacionalidad?.toLowerCase().includes(searchLower) || false) ||
      (residente.situacion?.toLowerCase().includes(searchLower) || false) ||
      (residente.direccion?.toLowerCase().includes(searchLower) || false)
    );
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingResidente(null);
    setFormData({
      nombre: "",
      apellidos: "",
      nacionalidad: "",
      fecha_nacimiento: "",
      edad: undefined,
      fecha_entrada: "",
      fecha_salida: "",
      sexo: "",
      situacion: "",
      anotacion: "",
      direccion: "",
      enlaces_documentos: ""
    });
  };

  // Función para exportar datos a JSON
  const exportToJSON = () => {
    const dataStr = JSON.stringify(residentes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `residentes_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Datos exportados exitosamente', 'success');
  };

  // Función para exportar datos a CSV
  const exportToCSV = () => {
    if (residentes.length === 0) {
      showNotification('No hay datos para exportar', 'info');
      return;
    }
    
    const headers = ['ID', 'Nombre', 'Apellidos', 'Nacionalidad', 'Fecha Nacimiento', 'Edad', 'Fecha Entrada', 'Fecha Salida', 'Sexo', 'Situación', 'Anotación', 'Dirección', 'Enlaces Documentos'];
    const csvContent = [
      headers.join(','),
      ...residentes.map(r => [
        r.id,
        `"${r.nombre || ''}"`,
        `"${r.apellidos || ''}"`,
        `"${r.nacionalidad || ''}"`,
        r.fecha_nacimiento || '',
        r.edad || '',
        r.fecha_entrada || '',
        r.fecha_salida || '',
        `"${r.sexo || ''}"`,
        `"${r.situacion || ''}"`,
        `"${r.anotacion?.replace(/"/g, '""') || ''}"`,
        `"${r.direccion || ''}"`,
        `"${r.enlaces_documentos || ''}"`
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `residentes_backup_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Datos exportados exitosamente', 'success');
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
                Gestión de Residentes
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

          {/* Botón Nuevo/a Residente */}
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="mb-6 px-8 py-3 rounded-2xl text-white font-semibold hover:shadow-xl transition-all"
            style={{ backgroundColor: '#8A4D76' }}
          >
            {showForm ? "Cancelar" : "+ Nuevo/a Residente"}
          </button>

          {/* Buscador */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar por nombre, apellidos, nacionalidad, situación o dirección..."
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
                {editingResidente ? "Editar Residente" : "Nuevo/a Residente"}
              </h2>
              <form onSubmit={editingResidente ? handleUpdate : handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  <label className="block text-gray-800 font-semibold mb-2">Nacionalidad</label>
                  <input
                    type="text"
                    value={formData.nacionalidad || ""}
                    onChange={(e) => setFormData({ ...formData, nacionalidad: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Fecha de Nacimiento</label>
                  <input
                    type="date"
                    value={formData.fecha_nacimiento || ""}
                    onChange={(e) => setFormData({ ...formData, fecha_nacimiento: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Edad</label>
                  <input
                    type="number"
                    value={formData.edad || ""}
                    onChange={(e) => setFormData({ ...formData, edad: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Sexo</label>
                  <select
                    value={formData.sexo || ""}
                    onChange={(e) => setFormData({ ...formData, sexo: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Fecha de Entrada</label>
                  <input
                    type="date"
                    value={formData.fecha_entrada || ""}
                    onChange={(e) => setFormData({ ...formData, fecha_entrada: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Fecha de Salida</label>
                  <input
                    type="date"
                    value={formData.fecha_salida || ""}
                    onChange={(e) => setFormData({ ...formData, fecha_salida: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Situación</label>
                  <input
                    type="text"
                    value={formData.situacion || ""}
                    onChange={(e) => setFormData({ ...formData, situacion: e.target.value })}
                    placeholder="Ej: Activa, Salida definitiva..."
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Dirección</label>
                  <input
                    type="text"
                    value={formData.direccion || ""}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-800 font-semibold mb-2">Enlaces de Documentos 🔗</label>
                  <input
                    type="text"
                    value={formData.enlaces_documentos || ""}
                    onChange={(e) => setFormData({ ...formData, enlaces_documentos: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                    placeholder="Ej: https://drive.google.com/..."
                  />
                  <p className="text-sm text-gray-600 mt-1">Enlaces a Drive, fotos DNI, etc.</p>
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
                    {editingResidente ? "Actualizar" : "Crear"}
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

          {/* Lista de Residentes */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
              Listado de Residentes ({filteredResidentes.length}{searchTerm && ` de ${residentes.length}`})
            </h2>
            
            {filteredResidentes.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-200">
                <p className="text-gray-600">
                  {searchTerm ? `No se encontraron residentes con "${searchTerm}"` : "No hay residentes registrados/as"}
                </p>
              </div>
            ) : (
              filteredResidentes.map((residente) => (
                <div key={residente.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: '#8A4D76' }}>
                        {residente.nombre} {residente.apellidos}
                      </h3>
                      {residente.nacionalidad && (
                        <p className="text-gray-700 mt-1">Nacionalidad: {residente.nacionalidad}</p>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(residente)}
                        className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
                        style={{ backgroundColor: '#8A4D76' }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(residente.id)}
                        className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:opacity-90 transition-all"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-800">
                    {residente.edad && (
                      <p><strong>Edad:</strong> {residente.edad} años</p>
                    )}
                    {residente.fecha_nacimiento && (
                      <p><strong>Fecha Nacimiento:</strong> {new Date(residente.fecha_nacimiento).toLocaleDateString('es-ES')}</p>
                    )}
                    {residente.sexo && (
                      <p><strong>Sexo:</strong> {residente.sexo}</p>
                    )}
                    {residente.fecha_entrada && (
                      <p><strong>Fecha Entrada:</strong> {new Date(residente.fecha_entrada).toLocaleDateString('es-ES')}</p>
                    )}
                    {residente.fecha_salida && (
                      <p><strong>Fecha Salida:</strong> {new Date(residente.fecha_salida).toLocaleDateString('es-ES')}</p>
                    )}
                    {residente.situacion && (
                      <p><strong>Situación:</strong> {residente.situacion}</p>
                    )}
                    {residente.direccion && (
                      <p className="md:col-span-2"><strong>Dirección:</strong> {residente.direccion}</p>
                    )}
                    {residente.enlaces_documentos && (
                      <p className="md:col-span-3">
                        <strong>Documentos:</strong>{' '}
                        <a 
                          href={residente.enlaces_documentos} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline font-semibold"
                        >
                          🔗 Abrir enlace
                        </a>
                      </p>
                    )}
                  </div>

                  {residente.anotacion && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-gray-800"><strong>Anotaciones:</strong></p>
                      <p className="text-gray-700 mt-2 whitespace-pre-wrap">{residente.anotacion}</p>
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
                ¿Estás seguro/a de que deseas eliminar este/a residente? Esta acción no se puede deshacer.
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
