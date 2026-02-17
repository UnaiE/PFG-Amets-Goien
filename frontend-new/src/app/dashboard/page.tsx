/**
 * @file DashboardPage - Panel de Administración Principal
 * @route /dashboard
 * @description Dashboard con gestión de noticias, actividades, foro de tareas y acceso a BD
 */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

// Función helper para decodificar el JWT y obtener el nombre del usuario
function getUserFromToken(): string {
  const token = localStorage.getItem("token");
  if (!token) return "";
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    return payload.username || payload.nombre || "";
  } catch (error) {
    console.error("Error decoding token:", error);
    return "";
  }
}

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

export default function Dashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<"publicacion" | "foro" | "gestion">("publicacion");

  useEffect(() => {
    // Verificar si hay token
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/acceso-interno");
      return;
    }

    // Restaurar la sección activa guardada
    const savedSection = localStorage.getItem("dashboardActiveSection") as "publicacion" | "foro" | "gestion" | null;
    if (savedSection && ["publicacion", "foro", "gestion"].includes(savedSection)) {
      setActiveSection(savedSection);
    }
  }, [router]);

  // Guardar la sección activa cuando cambie
  const handleSectionChange = (section: "publicacion" | "foro" | "gestion") => {
    setActiveSection(section);
    localStorage.setItem("dashboardActiveSection", section);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-20 px-4 md:px-8 lg:px-16" style={{ backgroundColor: '#E8D5F2' }}>
        <div className="max-w-7xl mx-auto py-8">
          {/* Header con botón de cerrar sesión */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold" style={{ color: '#8A4D76' }}>
              Panel de Administración
            </h1>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-md">
                <div className="flex items-center justify-center w-10 h-10 rounded-full" style={{ backgroundColor: '#8A4D76' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-500">Conectado como</p>
                  <p className="font-semibold" style={{ color: '#8A4D76' }}>{getUserFromToken() || "Usuario"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Navegación entre secciones */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={() => handleSectionChange("publicacion")}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeSection === "publicacion"
                  ? "text-white shadow-lg"
                  : "bg-white text-[#8A4D76] hover:shadow-md"
              }`}
              style={activeSection === "publicacion" ? { backgroundColor: '#8A4D76' } : {}}
            >
              Publicación de Noticias y Actividades
            </button>
            <button
              onClick={() => handleSectionChange("foro")}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeSection === "foro"
                  ? "text-white shadow-lg"
                  : "bg-white text-[#8A4D76] hover:shadow-md"
              }`}
              style={activeSection === "foro" ? { backgroundColor: '#8A4D76' } : {}}
            >
              Foro Interno de Tareas
            </button>
            <button
              onClick={() => handleSectionChange("gestion")}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeSection === "gestion"
                  ? "text-white shadow-lg"
                  : "bg-white text-[#8A4D76] hover:shadow-md"
              }`}
              style={activeSection === "gestion" ? { backgroundColor: '#8A4D76' } : {}}
            >
              Gestión de Base de Datos
            </button>
          </div>

          {/* Contenido de secciones */}
          {activeSection === "publicacion" && <PublicacionSection />}
          {activeSection === "foro" && <ForoSection />}
          {activeSection === "gestion" && <GestionSection />}
        </div>
      </div>
    </>
  );
}

// Interfaz de notificación
interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

// Sección de Publicación de Noticias y Actividades
function PublicacionSection() {
  const [showNoticiaForm, setShowNoticiaForm] = useState(false);
  const [showActividadForm, setShowActividadForm] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [noticias, setNoticias] = useState<any[]>([]);
  const [actividades, setActividades] = useState<any[]>([]);
  const [showDeleteConfirmNoticia, setShowDeleteConfirmNoticia] = useState<number | null>(null);
  const [showDeleteConfirmActividad, setShowDeleteConfirmActividad] = useState<number | null>(null);
  const [editingNoticia, setEditingNoticia] = useState<any>(null);
  const [editingActividad, setEditingActividad] = useState<any>(null);
  const [noticiaData, setNoticiaData] = useState({
    titulo: "",
    contenido: "",
    url_imagen: ""
  });
  const [actividadData, setActividadData] = useState({
    titulo: "",
    descripcion: "",
    fecha: ""
  });

  useEffect(() => {
    fetchNoticias();
    fetchActividades();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Funciones de exportación para noticias
  const exportNoticiasToJSON = () => {
    const dataStr = JSON.stringify(noticias, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `noticias_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Noticias exportadas exitosamente', 'success');
  };

  const exportNoticiasToCSV = () => {
    if (noticias.length === 0) {
      showNotification('No hay noticias para exportar', 'info');
      return;
    }
    
    const headers = ['ID', 'Título', 'Contenido', 'URL Imagen', 'Creado Por', 'Fecha Creación'];
    const csvContent = [
      headers.join(','),
      ...noticias.map(n => [
        n.id,
        `"${n.titulo || ''}"`,
        `"${n.contenido?.replace(/"/g, '""') || ''}"`,
        `"${n.url_imagen || ''}"`,
        `"${n.creado_por_username || ''}"`,
        n.created_at || ''
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `noticias_backup_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Noticias exportadas exitosamente', 'success');
  };

  // Funciones de exportación para actividades
  const exportActividadesToJSON = () => {
    const dataStr = JSON.stringify(actividades, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `actividades_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Actividades exportadas exitosamente', 'success');
  };

  const exportActividadesToCSV = () => {
    if (actividades.length === 0) {
      showNotification('No hay actividades para exportar', 'info');
      return;
    }
    
    const headers = ['ID', 'Título', 'Descripción', 'Fecha', 'Fecha Creación'];
    const csvContent = [
      headers.join(','),
      ...actividades.map(a => [
        a.id,
        `"${a.titulo || ''}"`,
        `"${a.descripcion?.replace(/"/g, '""') || ''}"`,
        a.fecha || '',
        a.created_at || ''
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `actividades_backup_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Actividades exportadas exitosamente', 'success');
  };

  const fetchNoticias = async () => {
    try {
      const response = await fetch(`${API_URL}/api/noticias`);
      if (response.ok) {
        const data = await response.json();
        setNoticias(data);
      }
    } catch (error) {
      console.error("Error fetching noticias:", error);
    }
  };

  const fetchActividades = async () => {
    try {
      const response = await fetch(`${API_URL}/api/actividades`);
      if (response.ok) {
        const data = await response.json();
        setActividades(data);
      }
    } catch (error) {
      console.error("Error fetching actividades:", error);
    }
  };

  const handleCreateNoticia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/api/noticias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(noticiaData)
      });

      if (response.ok) {
        showNotification("Noticia creada exitosamente", "success");
        setShowNoticiaForm(false);
        setNoticiaData({ titulo: "", contenido: "", url_imagen: "" });
        fetchNoticias(); // Refrescar lista
      } else {
        showNotification("Error al crear noticia", "error");
      }
    } catch (error) {
      console.error("Error creating noticia:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleDeleteNoticia = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/noticias/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        showNotification("Noticia eliminada exitosamente", "success");
        setShowDeleteConfirmNoticia(null);
        fetchNoticias(); // Refrescar lista
      } else {
        showNotification("Error al eliminar noticia", "error");
      }
    } catch (error) {
      console.error("Error deleting noticia:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleEditNoticia = (noticia: any) => {
    setEditingNoticia(noticia);
    setNoticiaData({
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      url_imagen: noticia.url_imagen || ""
    });
    setShowNoticiaForm(true);
  };

  const handleUpdateNoticia = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/noticias/${editingNoticia.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(noticiaData)
      });

      if (response.ok) {
        showNotification("Noticia actualizada exitosamente", "success");
        setShowNoticiaForm(false);
        setEditingNoticia(null);
        setNoticiaData({ titulo: "", contenido: "", url_imagen: "" });
        fetchNoticias();
      } else {
        showNotification("Error al actualizar noticia", "error");
      }
    } catch (error) {
      console.error("Error updating noticia:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleCancelEditNoticia = () => {
    setEditingNoticia(null);
    setNoticiaData({ titulo: "", contenido: "", url_imagen: "" });
    setShowNoticiaForm(false);
  };

  const handleCreateActividad = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${API_URL}/api/actividades`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(actividadData)
      });

      if (response.ok) {
        showNotification("Actividad creada exitosamente", "success");
        setShowActividadForm(false);
        setActividadData({ titulo: "", descripcion: "", fecha: "" });
        fetchActividades(); // Refrescar lista
      } else {
        showNotification("Error al crear actividad", "error");
      }
    } catch (error) {
      console.error("Error creating actividad:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleDeleteActividad = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/actividades/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        showNotification("Actividad eliminada exitosamente", "success");
        setShowDeleteConfirmActividad(null);
        fetchActividades(); // Refrescar lista
      } else {
        showNotification("Error al eliminar actividad", "error");
      }
    } catch (error) {
      console.error("Error deleting actividad:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleEditActividad = (actividad: any) => {
    setEditingActividad(actividad);
    setActividadData({
      titulo: actividad.titulo,
      descripcion: actividad.descripcion,
      fecha: actividad.fecha || ""
    });
    setShowActividadForm(true);
  };

  const handleUpdateActividad = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/actividades/${editingActividad.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(actividadData)
      });

      if (response.ok) {
        showNotification("Actividad actualizada exitosamente", "success");
        setShowActividadForm(false);
        setEditingActividad(null);
        setActividadData({ titulo: "", descripcion: "", fecha: "" });
        fetchActividades();
      } else {
        showNotification("Error al actualizar actividad", "error");
      }
    } catch (error) {
      console.error("Error updating actividad:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleCancelEditActividad = () => {
    setEditingActividad(null);
    setActividadData({ titulo: "", descripcion: "", fecha: "" });
    setShowActividadForm(false);
  };

  return (
    <div>
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

      {/* Modal de confirmación de eliminación de noticia */}
      {showDeleteConfirmNoticia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
              Confirmar eliminación
            </h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de eliminar esta noticia? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteNoticia(showDeleteConfirmNoticia)}
                className="flex-1 py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowDeleteConfirmNoticia(null)}
                className="flex-1 py-3 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación de actividad */}
      {showDeleteConfirmActividad && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
              Confirmar eliminación
            </h3>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de eliminar esta actividad? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteActividad(showDeleteConfirmActividad)}
                className="flex-1 py-3 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
              >
                Eliminar
              </button>
              <button
                onClick={() => setShowDeleteConfirmActividad(null)}
                className="flex-1 py-3 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Publicar Noticias */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-3xl font-bold" style={{ color: '#8A4D76' }}>
              Publicar Noticias
            </h3>
            {/* Botones de exportación de noticias */}
            <div className="flex gap-2">
              <button
                onClick={exportNoticiasToJSON}
                className="px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-all"
                title="Exportar noticias a JSON"
              >
                JSON
              </button>
              <button
                onClick={exportNoticiasToCSV}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all"
                title="Exportar noticias a CSV"
              >
                CSV
              </button>
            </div>
          </div>
          <p className="text-gray-700 mb-6">
            Crear nuevas noticias, editar las existentes y gestionar su aparición en la web pública.
          </p>
          <button
            onClick={() => {
              if (showNoticiaForm && editingNoticia) {
                handleCancelEditNoticia();
              } else {
                setShowNoticiaForm(!showNoticiaForm);
                if (!showNoticiaForm) {
                  setEditingNoticia(null);
                  setNoticiaData({ titulo: "", contenido: "", url_imagen: "" });
                }
              }
            }}
            className="w-full py-3 rounded-full text-white font-semibold hover:shadow-xl transition-all"
            style={{ backgroundColor: '#8A4D76' }}
          >
            {showNoticiaForm ? "Cancelar" : "Nueva noticia"}
          </button>

          {showNoticiaForm && (
            <form onSubmit={editingNoticia ? handleUpdateNoticia : handleCreateNoticia} className="mt-6 space-y-4">
              {editingNoticia && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-blue-700 font-semibold">Editando noticia</p>
                </div>
              )}
              <input
                type="text"
                placeholder="Título de la noticia"
                value={noticiaData.titulo}
                onChange={(e) => setNoticiaData({ ...noticiaData, titulo: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                required
              />
              <textarea
                placeholder="Contenido"
                value={noticiaData.contenido}
                onChange={(e) => setNoticiaData({ ...noticiaData, contenido: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 h-32 text-gray-900 bg-white"
                required
              />
              <input
                type="text"
                placeholder="URL de imagen"
                value={noticiaData.url_imagen}
                onChange={(e) => setNoticiaData({ ...noticiaData, url_imagen: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700"
              >
                {editingNoticia ? "Actualizar Noticia" : "Crear Noticia"}
              </button>
            </form>
          )}

          {/* Lista de noticias existentes */}
          <div className="mt-6">
            <h4 className="font-bold text-lg mb-3" style={{ color: '#8A4D76' }}>Noticias Publicadas</h4>
            {noticias.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay noticias publicadas</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {noticias.map((noticia) => (
                  <div key={noticia.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900">{noticia.titulo}</h5>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{noticia.contenido}</p>
                    {noticia.creado_por_username && (
                      <p className="text-xs text-gray-500 mt-2">
                        📝 Publicado por: <span className="font-semibold">{noticia.creado_por_username}</span>
                      </p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditNoticia(noticia)}
                        className="px-4 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-all"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirmNoticia(noticia.id)}
                        className="px-4 py-1 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card Publicar Actividades */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-3xl font-bold" style={{ color: '#8A4D76' }}>
              Publicar Actividades
            </h3>
            {/* Botones de exportación de actividades */}
            <div className="flex gap-2">
              <button
                onClick={exportActividadesToJSON}
                className="px-3 py-2 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-all"
                title="Exportar actividades a JSON"
              >
                JSON
              </button>
              <button
                onClick={exportActividadesToCSV}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-all"
                title="Exportar actividades a CSV"
              >
                CSV
              </button>
            </div>
          </div>
          <p className="text-gray-700 mb-6">
            Añadir, actualizar o eliminar actividades del tablón semanal visible en la web pública.
          </p>
          <button
            onClick={() => {
              if (showActividadForm && editingActividad) {
                handleCancelEditActividad();
              } else {
                setShowActividadForm(!showActividadForm);
                if (!showActividadForm) {
                  setEditingActividad(null);
                  setActividadData({ titulo: "", descripcion: "", fecha: "" });
                }
              }
            }}
            className="w-full py-3 rounded-full text-white font-semibold hover:shadow-xl transition-all"
            style={{ backgroundColor: '#8A4D76' }}
          >
            {showActividadForm ? "Cancelar" : "Nueva actividad"}
          </button>

          {showActividadForm && (
            <form onSubmit={editingActividad ? handleUpdateActividad : handleCreateActividad} className="mt-6 space-y-4">
              {editingActividad && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-blue-700 font-semibold">Editando actividad</p>
                </div>
              )}
              <input
                type="text"
                placeholder="Título de la actividad"
                value={actividadData.titulo}
                onChange={(e) => setActividadData({ ...actividadData, titulo: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                required
              />
              <textarea
                placeholder="Descripción"
                value={actividadData.descripcion}
                onChange={(e) => setActividadData({ ...actividadData, descripcion: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 h-32 text-gray-900 bg-white"
                required
              />
              <input
                type="text"
                placeholder="Fecha (ej: 15 de Diciembre, 2025 o Martes y Jueves, 18:00h)"
                value={actividadData.fecha}
                onChange={(e) => setActividadData({ ...actividadData, fecha: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700"
              >
                {editingActividad ? "Actualizar Actividad" : "Crear Actividad"}
              </button>
            </form>
          )}

          {/* Lista de actividades existentes */}
          <div className="mt-6">
            <h4 className="font-bold text-lg mb-3" style={{ color: '#8A4D76' }}>Actividades Publicadas</h4>
            {actividades.length === 0 ? (
              <p className="text-gray-500 text-sm">No hay actividades publicadas</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {actividades.map((actividad) => (
                  <div key={actividad.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-900">{actividad.titulo}</h5>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{actividad.descripcion}</p>
                    {actividad.fecha && (
                      <p className="text-xs text-gray-500 mt-1">📅 {actividad.fecha}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditActividad(actividad)}
                        className="px-4 py-1 rounded-full bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-all"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirmActividad(actividad.id)}
                        className="px-4 py-1 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Sección del Foro Interno de Tareas
function ForoSection() {
  const [tareas, setTareas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTareaForm, setShowTareaForm] = useState(false);
  const [editingTarea, setEditingTarea] = useState<any>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [vistaActiva, setVistaActiva] = useState<'kanban' | 'lista'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAsignado, setFilterAsignado] = useState('todos');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [showAsignarModal, setShowAsignarModal] = useState<number | null>(null);
  const [tareaData, setTareaData] = useState({
    titulo: "",
    descripcion: "",
    estado: "sin asignar",
    asignado_a: "",
    creado_por: ""
  });

  useEffect(() => {
    fetchTareas();
    fetchUsuarios();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Funciones de exportación para tareas
  const exportTareasToJSON = () => {
    const dataStr = JSON.stringify(tareas, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tareas_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Tareas exportadas exitosamente', 'success');
  };

  const exportTareasToCSV = () => {
    if (tareas.length === 0) {
      showNotification('No hay tareas para exportar', 'info');
      return;
    }
    
    const headers = ['ID', 'Título', 'Descripción', 'Estado', 'Asignado A', 'Creado Por', 'Fecha Creación', 'Fecha Actualización'];
    const csvContent = [
      headers.join(','),
      ...tareas.map(t => [
        t.id,
        `"${t.titulo || ''}"`,
        `"${t.descripcion?.replace(/"/g, '""') || ''}"`,
        `"${t.estado || ''}"`,
        `"${t.asignado_a || ''}"`,
        `"${t.creado_por || ''}"`,
        t.created_at || '',
        t.updated_at || ''
      ].join(','))
    ].join('\n');

    const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tareas_backup_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Tareas exportadas exitosamente', 'success');
  };

  const fetchTareas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/tareas`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setTareas(data);
      }
    } catch (error) {
      console.error("Error fetching tareas:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        // Si no es admin, al menos agregar el usuario actual
        const currentUser = getUserFromToken();
        if (currentUser) {
          setUsuarios([{ username: currentUser }]);
        }
      }
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      // Si hay error, al menos agregar el usuario actual
      const currentUser = getUserFromToken();
      if (currentUser) {
        setUsuarios([{ username: currentUser }]);
      }
    }
  };

  const handleCreateTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const username = getUserFromToken();
      
      // Asignación automática de estado: si hay usuario asignado, cambiar a "asignado"
      const estadoFinal = tareaData.asignado_a ? "asignado" : "sin asignar";
      
      const response = await fetch(`${API_URL}/api/tareas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...tareaData,
          estado: estadoFinal,
          creado_por: username
        })
      });

      if (response.ok) {
        showNotification("Tarea creada exitosamente", "success");
        setShowTareaForm(false);
        setTareaData({ titulo: "", descripcion: "", estado: "sin asignar", asignado_a: "", creado_por: "" });
        fetchTareas(); // Refrescar lista
      } else {
        showNotification("Error al crear tarea", "error");
      }
    } catch (error) {
      console.error("Error creating tarea:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleUpdateEstado = async (id: number, nuevoEstado: string) => {
    try {
      const token = localStorage.getItem("token");
      const tarea = tareas.find(t => t.id === id);
      
      if (!tarea) {
        showNotification("Tarea no encontrada", "error");
        return;
      }
      
      const response = await fetch(`${API_URL}/api/tareas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: tarea.titulo,
          descripcion: tarea.descripcion,
          estado: nuevoEstado,
          asignado_a: tarea.asignado_a
        })
      });

      if (response.ok) {
        showNotification(`Estado actualizado a: ${nuevoEstado}`, "success");
        fetchTareas(); // Refrescar lista
      } else {
        const errorData = await response.json();
        console.error('Error al actualizar:', errorData);
        showNotification("Error al actualizar estado", "error");
      }
    } catch (error) {
      console.error("Error updating tarea:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleDeleteTarea = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/tareas/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        showNotification("Tarea eliminada exitosamente", "success");
        setShowDeleteConfirm(null);
        fetchTareas(); // Refrescar lista
      } else {
        showNotification("Error al eliminar tarea", "error");
      }
    } catch (error) {
      console.error("Error deleting tarea:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleAsignarTarea = async (tareaId: number, usuarioSeleccionado: string) => {
    try {
      const token = localStorage.getItem("token");
      const tarea = tareas.find(t => t.id === tareaId);
      
      if (!tarea) {
        showNotification("Tarea no encontrada", "error");
        return;
      }
      
      const response = await fetch(`${API_URL}/api/tareas/${tareaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          titulo: tarea.titulo,
          descripcion: tarea.descripcion,
          estado: "asignado",
          asignado_a: usuarioSeleccionado
        })
      });

      if (response.ok) {
        showNotification(`Tarea asignada a ${usuarioSeleccionado}`, "success");
        setShowAsignarModal(null);
        fetchTareas();
      } else {
        showNotification("Error al asignar tarea", "error");
      }
    } catch (error) {
      console.error("Error asignando tarea:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleEditTarea = (tarea: any) => {
    setEditingTarea(tarea);
    setTareaData({
      titulo: tarea.titulo,
      descripcion: tarea.descripcion || "",
      estado: tarea.estado,
      asignado_a: tarea.asignado_a || "",
      creado_por: tarea.creado_por || ""
    });
    setShowTareaForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarea) return;

    try {
      const token = localStorage.getItem("token");
      
      // Asignación automática de estado: si hay usuario asignado, cambiar a "asignado"
      const estadoFinal = tareaData.asignado_a ? "asignado" : tareaData.estado;
      
      const response = await fetch(`${API_URL}/api/tareas/${editingTarea.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...tareaData,
          estado: estadoFinal
        })
      });

      if (response.ok) {
        showNotification("Tarea actualizada exitosamente", "success");
        setShowTareaForm(false);
        setEditingTarea(null);
        setTareaData({ titulo: "", descripcion: "", estado: "sin asignar", asignado_a: "", creado_por: "" });
        fetchTareas();
      } else {
        showNotification("Error al actualizar tarea", "error");
      }
    } catch (error) {
      console.error("Error updating tarea:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditingTarea(null);
    setShowTareaForm(false);
    setTareaData({ titulo: "", descripcion: "", estado: "sin asignar", asignado_a: "", creado_por: "" });
  };

  // Filtrar tareas
  const tareasFiltradas = tareas.filter(tarea => {
    const matchSearch = 
      tarea.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarea.asignado_a?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchAsignado = filterAsignado === 'todos' || 
      (filterAsignado === 'sin_asignar' && !tarea.asignado_a) ||
      (filterAsignado === 'asignado' && tarea.asignado_a) ||
      (tarea.asignado_a === filterAsignado);
    
    return matchSearch && matchAsignado;
  });

  // Agrupar tareas por estado para vista Kanban
  const tareasKanban = {
    'sin asignar': tareasFiltradas.filter(t => t.estado === 'sin asignar' || t.estado === 'Sin asignar'),
    'asignado': tareasFiltradas.filter(t => t.estado === 'asignado' || t.estado === 'Asignado' || t.estado === 'Asignada'),
    'realizado': tareasFiltradas.filter(t => t.estado === 'realizado' || t.estado === 'Realizado' || t.estado === 'Finalizada')
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#8A4D76' }}></div>
      </div>
    );
  }

  const TareaCard = ({ tarea, columnColor }: { tarea: any, columnColor: string }) => (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all p-3 sm:p-4 border-l-4" style={{ borderLeftColor: columnColor }}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-bold text-gray-900 text-sm sm:text-base lg:text-lg pr-2">{tarea.titulo}</h4>
        <button
          onClick={() => setShowDeleteConfirm(tarea.id)}
          className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          title="Eliminar tarea"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      {tarea.descripcion && (
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{tarea.descripcion}</p>
      )}
      <div className="space-y-1 sm:space-y-2 mb-2 sm:mb-3">
        {tarea.asignado_a && (
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-purple-100">
              <svg className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#8A4D76' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-700">{tarea.asignado_a}</span>
          </div>
        )}
        {tarea.creado_por_username && (
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Creado por {tarea.creado_por_username}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => handleEditTarea(tarea)}
          className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-all"
          style={{ backgroundColor: '#8A4D76' }}
        >
          Editar
        </button>
        {tarea.estado !== 'realizado' && tarea.estado !== 'Realizado' && tarea.estado !== 'Finalizada' && (
          <button
            onClick={() => {
              if (tarea.estado === 'sin asignar' || tarea.estado === 'Sin asignar') {
                setShowAsignarModal(tarea.id);
              } else {
                handleUpdateEstado(tarea.id, 'realizado');
              }
            }}
            className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 rounded-lg bg-green-500 text-white text-xs sm:text-sm font-semibold hover:bg-green-600 transition-all"
          >
            {tarea.estado === 'sin asignar' || tarea.estado === 'Sin asignar' ? 'Asignar' : 'Completar'}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div>
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

      {/* Modal de asignación de tarea */}
      {showAsignarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 w-full">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
              Asignar tarea
            </h3>
            <p className="text-gray-700 mb-4">
              Selecciona el usuario al que deseas asignar esta tarea:
            </p>
            <select
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none mb-6"
              onChange={(e) => {
                if (e.target.value) {
                  handleAsignarTarea(showAsignarModal, e.target.value);
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Seleccionar usuario...</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id || usuario.username} value={usuario.username}>
                  {usuario.username}
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowAsignarModal(null)}
              className="w-full py-3 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
            >
              Cancelar
            </button>
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
              ¿Estás seguro de eliminar esta tarea? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteTarea(showDeleteConfirm)}
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

      {/* Header responsive */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div className="flex-1">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2" style={{ color: '#8A4D76' }}>
              Foro Interno de Tareas
            </h2>
            <p className="text-sm sm:text-base text-gray-600">Gestiona las tareas del equipo de manera eficiente</p>
          </div>
          
          {/* Botones de exportación de tareas */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={exportTareasToJSON}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-green-600 text-white text-xs sm:text-sm font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2"
              title="Exportar tareas a JSON"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              JSON
            </button>
            <button
              onClick={exportTareasToCSV}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              title="Exportar tareas a CSV"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              CSV
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border-l-4 border-yellow-400">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Sin Asignar</p>
          <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#8A4D76' }}>{tareasKanban['sin asignar'].length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border-l-4 border-blue-400">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Asignadas</p>
          <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#8A4D76' }}>{tareasKanban['asignado'].length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border-l-4 border-green-400">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Realizadas</p>
          <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#8A4D76' }}>{tareasKanban['realizado'].length}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border-l-4" style={{ borderLeftColor: '#8A4D76' }}>
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total</p>
          <p className="text-2xl sm:text-3xl font-bold" style={{ color: '#8A4D76' }}>{tareasFiltradas.length}</p>
        </div>
      </div>

      {/* Filtros y controles - Responsive */}
      <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Búsqueda */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
            />
          </div>
          
          {/* Filtro por usuario */}
          <div className="flex-1 sm:flex-none">
            <select
              value={filterAsignado}
              onChange={(e) => setFilterAsignado(e.target.value)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
            >
              <option value="todos">Todas las tareas</option>
              <option value="sin_asignar">Sin asignar</option>
              <option value="asignado">Asignadas</option>
              {usuarios.map(usuario => (
                <option key={usuario.id || usuario.username} value={usuario.username}>
                  {usuario.username}
                </option>
              ))}
            </select>
          </div>
          
          {/* Botones de vista y nueva tarea */}
          <div className="flex gap-2">
            <div className="flex gap-1 sm:gap-2">
              <button
                onClick={() => setVistaActiva('kanban')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all ${
                  vistaActiva === 'kanban' 
                    ? 'text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={vistaActiva === 'kanban' ? { backgroundColor: '#8A4D76' } : {}}
                title="Vista Kanban"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </button>
              <button
                onClick={() => setVistaActiva('lista')}
                className={`px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all ${
                  vistaActiva === 'lista' 
                    ? 'text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                style={vistaActiva === 'lista' ? { backgroundColor: '#8A4D76' } : {}}
                title="Vista Lista"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => {
                if (!showTareaForm) {
                  setEditingTarea(null);
                  setTareaData({ titulo: "", descripcion: "", estado: "sin asignar", asignado_a: "", creado_por: "" });
                }
                setShowTareaForm(!showTareaForm);
              }}
              className="px-4 sm:px-6 py-2 text-xs sm:text-sm rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center gap-1 sm:gap-2"
              style={{ backgroundColor: '#8A4D76' }}
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden xs:inline">{showTareaForm ? "Cancelar" : "Nueva Tarea"}</span>
              <span className="xs:hidden">{showTareaForm ? "✕" : "Nueva"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulario de nueva/editar tarea */}
      {showTareaForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-2" style={{ borderColor: '#8A4D76' }}>
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
            {editingTarea ? "✏️ Modificar Tarea" : "➕ Nueva Tarea"}
          </h3>
          <form onSubmit={editingTarea ? handleUpdateTarea : handleCreateTarea} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Título *</label>
              <input
                type="text"
                placeholder="Título de la tarea"
                value={tareaData.titulo}
                onChange={(e) => setTareaData({ ...tareaData, titulo: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
              <textarea
                placeholder="Describe los detalles de la tarea..."
                value={tareaData.descripcion}
                onChange={(e) => setTareaData({ ...tareaData, descripcion: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 h-32 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Asignada a</label>
                <select
                  value={tareaData.asignado_a}
                  onChange={(e) => {
                    const nuevoAsignado = e.target.value;
                    setTareaData({ 
                      ...tareaData, 
                      asignado_a: nuevoAsignado,
                      // Asignación automática: si selecciona usuario, cambiar a "asignado"
                      estado: nuevoAsignado ? "asignado" : "sin asignar"
                    });
                  }}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                >
                  <option value="">Sin asignar</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id || usuario.username} value={usuario.username}>
                      {usuario.username}
                    </option>
                  ))}
                </select>
              </div>
              {editingTarea && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Estado</label>
                  <select
                    value={tareaData.estado}
                    onChange={(e) => setTareaData({ ...tareaData, estado: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none"
                    disabled={tareaData.asignado_a !== ""}
                  >
                    <option value="sin asignar">Sin asignar</option>
                    <option value="asignado">Asignado</option>
                    <option value="realizado">Realizado</option>
                  </select>
                  {tareaData.asignado_a && (
                    <p className="text-xs text-gray-500 mt-1">El estado se actualiza automáticamente al asignar</p>
                  )}
                </div>
              )}
            </div>
            {!editingTarea && (
              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                💡 <strong>Nota:</strong> Si asignas un usuario, la tarea se creará con estado "Asignado" automáticamente. Si no, quedará "Sin asignar".
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all"
              >
                {editingTarea ? "💾 Actualizar Tarea" : "✅ Crear Tarea"}
              </button>
              {editingTarea && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 py-3 rounded-lg bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Vista Kanban - Responsive */}
      {vistaActiva === 'kanban' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Columna: Sin Asignar */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-4 border-yellow-400">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
              <h3 className="font-bold text-base sm:text-lg text-gray-800">Sin Asignar</h3>
              <span className="ml-auto bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                {tareasKanban['sin asignar'].length}
              </span>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
              {tareasKanban['sin asignar'].length === 0 ? (
                <p className="text-center text-gray-400 py-4 text-sm">No hay tareas</p>
              ) : (
                tareasKanban['sin asignar'].map(tarea => (
                  <TareaCard key={tarea.id} tarea={tarea} columnColor="#FBBF24" />
                ))
              )}
            </div>
          </div>

          {/* Columna: Asignadas */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-4 border-blue-400">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-400"></div>
              <h3 className="font-bold text-base sm:text-lg text-gray-800">Asignadas</h3>
              <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                {tareasKanban['asignado'].length}
              </span>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
              {tareasKanban['asignado'].length === 0 ? (
                <p className="text-center text-gray-400 py-4 text-sm">No hay tareas</p>
              ) : (
                tareasKanban['asignado'].map(tarea => (
                  <TareaCard key={tarea.id} tarea={tarea} columnColor="#60A5FA" />
                ))
              )}
            </div>
          </div>

          {/* Columna: Realizadas */}
          <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-4 border-green-400">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
              <h3 className="font-bold text-base sm:text-lg text-gray-800">Realizadas</h3>
              <span className="ml-auto bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs sm:text-sm font-semibold">
                {tareasKanban['realizado'].length}
              </span>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
              {tareasKanban['realizado'].length === 0 ? (
                <p className="text-center text-gray-400 py-4 text-sm">No hay tareas</p>
              ) : (
                tareasKanban['realizado'].map(tarea => (
                  <TareaCard key={tarea.id} tarea={tarea} columnColor="#34D399" />
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Vista Lista - Responsive */
        <div className="space-y-2 sm:space-y-3">
          {tareasFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
              <svg className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 text-base sm:text-lg">No hay tareas que mostrar</p>
            </div>
          ) : (
            tareasFiltradas.map(tarea => {
              const estadoColor = 
                tarea.estado === 'sin asignar' || tarea.estado === 'Sin asignar' ? '#FBBF24' :
                tarea.estado === 'asignado' || tarea.estado === 'Asignado' || tarea.estado === 'Asignada' ? '#60A5FA' : '#34D399';
              return (
                <div key={tarea.id} className="bg-white rounded-lg sm:rounded-xl shadow-md p-3 sm:p-5 border-l-4 hover:shadow-lg transition-all" style={{ borderLeftColor: estadoColor }}>
                  <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">{tarea.titulo}</h3>
                        <span 
                          className="px-2 sm:px-3 py-1 rounded-full font-semibold text-xs w-fit"
                          style={{
                            backgroundColor: estadoColor + '20',
                            color: estadoColor
                          }}
                        >
                          {tarea.estado}
                        </span>
                      </div>
                      {tarea.descripcion && (
                        <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3">{tarea.descripcion}</p>
                      )}
                      <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                        {tarea.asignado_a && (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: '#8A4D76' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-semibold text-gray-700">{tarea.asignado_a}</span>
                          </div>
                        )}
                        {tarea.creado_por_username && (
                          <div className="flex items-center gap-1 sm:gap-2 text-gray-500">
                            <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Creado por {tarea.creado_por_username}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:ml-4">
                      <button
                        onClick={() => handleEditTarea(tarea)}
                        className="px-3 sm:px-4 py-2 rounded-lg text-white text-xs sm:text-sm font-semibold hover:opacity-90 transition-all"
                        style={{ backgroundColor: '#8A4D76' }}
                      >
                        Editar
                      </button>
                      {tarea.estado !== 'realizado' && tarea.estado !== 'Realizado' && tarea.estado !== 'Finalizada' && (
                        <button
                          onClick={() => {
                            if (tarea.estado === 'sin asignar' || tarea.estado === 'Sin asignar') {
                              setShowAsignarModal(tarea.id);
                            } else {
                              handleUpdateEstado(tarea.id, 'realizado');
                            }
                          }}
                          className="px-3 sm:px-4 py-2 rounded-lg bg-green-500 text-white text-xs sm:text-sm font-semibold hover:bg-green-600 transition-all"
                        >
                          {tarea.estado === 'sin asignar' || tarea.estado === 'Sin asignar' ? '→ Asignar' : '✓ Completar'}
                        </button>
                      )}
                      <button
                        onClick={() => setShowDeleteConfirm(tarea.id)}
                        className="px-3 sm:px-4 py-2 rounded-lg bg-red-500 text-white text-xs sm:text-sm font-semibold hover:bg-red-600 transition-all"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// Sección de Gestión de Base de Datos
function GestionSection() {
  const router = useRouter();
  const userRole = getUserRoleFromToken();
  
  const categorias = [
    {
      titulo: "Residentes",
      descripcion: "Acceso a fichas personales, historial y seguimiento.",
      ruta: "/dashboard/residentes"
    },
    {
      titulo: "Colaboradores",
      descripcion: "Personas que apoyan con tiempo, donaciones o servicios.",
      ruta: "/dashboard/colaboradores"
    },
    {
      titulo: "Trabajadores",
      descripcion: "Gestión del personal autorizado para acceder al panel.",
      ruta: "/dashboard/trabajadores"
    },
    {
      titulo: "Donaciones",
      descripcion: "Historial completo de donaciones registradas en el sistema (solo lectura).",
      ruta: "/dashboard/donaciones",
      soloAdmin: true
    },
    {
      titulo: "Usuarios Internos",
      descripcion: "Crear y gestionar cuentas autorizadas para acceder al panel interno.",
      ruta: "/dashboard/usuarios",
      soloAdmin: true
    }
  ];
  
  // Filtrar categorías según el rol del usuario
  const categoriasFiltradas = categorias.filter(categoria => 
    !categoria.soloAdmin || userRole === 'admin'
  );

  return (
    <div>
      

      <div className={`grid grid-cols-1 md:grid-cols-2 ${categoriasFiltradas.length > 4 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'} gap-6`}>
        {categoriasFiltradas.map((categoria, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg p-6 border border-gray-200 flex flex-col justify-between min-h-[280px]"
          >
            <div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                {categoria.titulo}
              </h3>
              <p className="text-gray-700 mb-6">
                {categoria.descripcion}
              </p>
            </div>
            <button
              className="w-full py-3 rounded-full text-white font-semibold hover:shadow-xl transition-all"
              style={{ backgroundColor: '#8A4D76' }}
              onClick={() => {
                localStorage.setItem("dashboardActiveSection", "gestion");
                router.push(categoria.ruta);
              }}
            >
              Gestionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
