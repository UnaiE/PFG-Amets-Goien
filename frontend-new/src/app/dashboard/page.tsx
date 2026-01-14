/**
 * @file DashboardPage - Panel de Administración Principal
 * @route /dashboard
 * @description Dashboard con gestión de noticias, actividades, foro de tareas y acceso a BD
 */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

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
            <button
              onClick={handleLogout}
              className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Cerrar Sesión
            </button>
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
  const [noticiaData, setNoticiaData] = useState({
    titulo: "",
    contenido: "",
    url_imagen: "",
    creado_por: ""
  });
  const [actividadData, setActividadData] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    creador_id: 1
  });

  useEffect(() => {
    fetchNoticias();
    fetchActividades();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchNoticias = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/noticias");
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
      const response = await fetch("http://localhost:4000/api/actividades");
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
      const username = getUserFromToken();
      
      const response = await fetch("http://localhost:4000/api/noticias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...noticiaData,
          creado_por: username
        })
      });

      if (response.ok) {
        showNotification("Noticia creada exitosamente", "success");
        setShowNoticiaForm(false);
        setNoticiaData({ titulo: "", contenido: "", url_imagen: "", creado_por: "" });
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
      const response = await fetch(`http://localhost:4000/api/noticias/${id}`, {
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

  const handleCreateActividad = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const username = getUserFromToken();
      
      const response = await fetch("http://localhost:4000/api/actividades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...actividadData,
          creador_id: username
        })
      });

      if (response.ok) {
        showNotification("Actividad creada exitosamente", "success");
        setShowActividadForm(false);
        setActividadData({ titulo: "", descripcion: "", fecha: "", creador_id: 1 });
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
      const response = await fetch(`http://localhost:4000/api/actividades/${id}`, {
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

      <h2 className="text-4xl font-bold mb-4" style={{ color: '#8A4D76' }}>
        Publicación de Noticias y Actividades
      </h2>
      <p className="text-lg text-gray-700 mb-8">
        Crear, editar y publicar contenido que aparecerá en la página principal. Las noticias se mostrarán
        en la sección pública de artículos y las actividades en el tablón semanal.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Publicar Noticias */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-3xl font-bold mb-4" style={{ color: '#8A4D76' }}>
            Publicar Noticias
          </h3>
          <p className="text-gray-700 mb-6">
            Crear nuevas noticias, editar las existentes y gestionar su aparición en la web pública.
          </p>
          <button
            onClick={() => setShowNoticiaForm(!showNoticiaForm)}
            className="w-full py-3 rounded-full text-white font-semibold hover:shadow-xl transition-all"
            style={{ backgroundColor: '#8A4D76' }}
          >
            {showNoticiaForm ? "Cancelar" : "Nueva noticia"}
          </button>

          {showNoticiaForm && (
            <form onSubmit={handleCreateNoticia} className="mt-6 space-y-4">
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
                Crear Noticia
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
                    <button
                      onClick={() => setShowDeleteConfirmNoticia(noticia.id)}
                      className="mt-2 px-4 py-1 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card Publicar Actividades */}
        <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200">
          <h3 className="text-3xl font-bold mb-4" style={{ color: '#8A4D76' }}>
            Publicar Actividades
          </h3>
          <p className="text-gray-700 mb-6">
            Añadir, actualizar o eliminar actividades del tablón semanal visible en la web pública.
          </p>
          <button
            onClick={() => setShowActividadForm(!showActividadForm)}
            className="w-full py-3 rounded-full text-white font-semibold hover:shadow-xl transition-all"
            style={{ backgroundColor: '#8A4D76' }}
          >
            {showActividadForm ? "Cancelar" : "Nueva actividad"}
          </button>

          {showActividadForm && (
            <form onSubmit={handleCreateActividad} className="mt-6 space-y-4">
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
                Crear Actividad
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
                    <button
                      onClick={() => setShowDeleteConfirmActividad(actividad.id)}
                      className="mt-2 px-4 py-1 rounded-full bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
                    >
                      Eliminar
                    </button>
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
  const [tareaData, setTareaData] = useState({
    titulo: "",
    descripcion: "",
    estado: "Pendiente",
    asignado_a: "",
    creado_por: ""
  });

  useEffect(() => {
    fetchTareas();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const fetchTareas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:4000/api/tareas", {
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

  const handleCreateTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const username = getUserFromToken();
      
      const response = await fetch("http://localhost:4000/api/tareas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...tareaData,
          creado_por: username
        })
      });

      if (response.ok) {
        showNotification("Tarea creada exitosamente", "success");
        setShowTareaForm(false);
        setTareaData({ titulo: "", descripcion: "", estado: "Pendiente", asignado_a: "", creado_por: "" });
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
      
      const response = await fetch(`http://localhost:4000/api/tareas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ...tarea,
          estado: nuevoEstado
        })
      });

      if (response.ok) {
        showNotification(`Estado actualizado a: ${nuevoEstado}`, "success");
        fetchTareas(); // Refrescar lista
      } else {
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
      const response = await fetch(`http://localhost:4000/api/tareas/${id}`, {
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
  };

  const handleUpdateTarea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTarea) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/tareas/${editingTarea.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(tareaData)
      });

      if (response.ok) {
        showNotification("Tarea actualizada exitosamente", "success");
        setShowTareaForm(false);
        setEditingTarea(null);
        setTareaData({ titulo: "", descripcion: "", estado: "Pendiente", asignado_a: "", creado_por: "" });
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
    setTareaData({ titulo: "", descripcion: "", estado: "Pendiente", asignado_a: "", creado_por: "" });
  };

  if (loading) {
    return <div className="text-center py-8">Cargando tareas...</div>;
  }

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

      <h2 className="text-4xl font-bold mb-4" style={{ color: '#8A4D76' }}>
        Foro Interno de Tareas
      </h2>
      <p className="text-lg text-gray-700 mb-8">
        Espacio interno donde el equipo puede publicar, comentar y revisar tareas pendientes.
      </p>

      {/* Lista de tareas */}
      <div className="space-y-4 mb-6">
        {tareas.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay tareas pendientes</p>
        ) : (
          tareas.map((tarea) => (
            <div key={tarea.id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold" style={{ color: '#8A4D76' }}>
                  {tarea.titulo}
                </h3>
                <span 
                  className={`px-4 py-2 rounded-full font-semibold text-sm ${
                    tarea.estado === 'Finalizada' ? 'bg-green-100 text-green-800' :
                    tarea.estado === 'Asignada' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {tarea.estado}
                </span>
              </div>
              {tarea.descripcion && (
                <p className="text-gray-600 mb-2">{tarea.descripcion}</p>
              )}
              <p className="text-gray-600 mb-2">Publicado por: {tarea.creado_por || "Sistema"}</p>
              <p className="font-semibold mb-4" style={{ color: '#8A4D76' }}>
                Asignada a: {tarea.asignado_a || "Sin asignar"}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEditTarea(tarea)}
                  className="px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#8A4D76' }}
                >
                  Modificar
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(tarea.id)}
                  className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:opacity-90 transition-all"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Botón nueva tarea */}
      <button
        onClick={() => {
          if (!showTareaForm) {
            setEditingTarea(null);
            setTareaData({ titulo: "", descripcion: "", estado: "Pendiente", asignado_a: "", creado_por: "" });
          }
          setShowTareaForm(!showTareaForm);
        }}
        className="px-8 py-4 rounded-2xl text-white font-semibold text-lg hover:shadow-xl transition-all mb-6"
        style={{ backgroundColor: '#8A4D76' }}
      >
        {showTareaForm ? "Cancelar" : "Publicar nueva tarea"}
      </button>

      {/* Formulario de nueva tarea */}
      {showTareaForm && (
        <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
          <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
            {editingTarea ? "Modificar Tarea" : "Nueva Tarea"}
          </h3>
          <form onSubmit={editingTarea ? handleUpdateTarea : handleCreateTarea} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Título</label>
              <input
                type="text"
                placeholder="Título de la tarea"
                value={tareaData.titulo}
                onChange={(e) => setTareaData({ ...tareaData, titulo: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Descripción</label>
              <textarea
                placeholder="Descripción de la tarea"
                value={tareaData.descripcion}
                onChange={(e) => setTareaData({ ...tareaData, descripcion: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 h-32 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Asignada a</label>
              <input
                type="text"
                placeholder="Nombre de la persona asignada (opcional)"
                value={tareaData.asignado_a}
                onChange={(e) => setTareaData({ ...tareaData, asignado_a: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Estado inicial</label>
              <select
                value={tareaData.estado}
                onChange={(e) => setTareaData({ ...tareaData, estado: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 text-gray-900 bg-white"
              >
                <option>Pendiente</option>
                <option>Asignada</option>
                <option>Finalizada</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700"
            >
              {editingTarea ? "Actualizar Tarea" : "Crear Tarea"}
            </button>
            {editingTarea && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full py-3 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </form>
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
      <h2 className="text-4xl font-bold mb-8" style={{ color: '#8A4D76' }}>
        Gestión de Base de Datos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
