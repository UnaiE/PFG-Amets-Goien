/**
 * @file UsuariosPage - Gestión de Usuarios Internos
 * @route /dashboard/usuarios
 * @description CRUD completo para gestión de usuarios con acceso al panel interno
 */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "${API_URL}";

interface Usuario {
  id: number;
  username: string;
  role: string;
  email: string | null;
  created_at: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function UsuariosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Usuario | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user",
    email: ""
  });

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingUsuario(null);
    setFormData({
      username: "",
      password: "",
      role: "user",
      email: ""
    });
  };

  const filteredUsuarios = usuarios.filter((usuario) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      usuario.username.toLowerCase().includes(searchLower) ||
      usuario.role.toLowerCase().includes(searchLower) ||
      (usuario.email?.toLowerCase().includes(searchLower) || false)
    );
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/acceso-interno");
      return;
    }
    
    // Verificar que el usuario sea admin
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      const userRole = payload.role || "";
      
      if (userRole !== 'admin') {
        router.push("/dashboard");
        return;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      router.push("/acceso-interno");
      return;
    }
    
    fetchUsuarios();
  }, [router]);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("${API_URL}/api/users", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else if (response.status === 401) {
        router.push("/acceso-interno");
      }
    } catch (error) {
      console.error("Error fetching usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      showNotification("Nombre de usuario y contraseña son obligatorios", "error");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("${API_URL}/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        showNotification("Usuario creado exitosamente", "success");
        resetForm();
        fetchUsuarios();
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.message || error.msg || "No se pudo crear"}`, "error");
      }
    } catch (error) {
      console.error("Error creating usuario:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUsuario) return;

    try {
      const token = localStorage.getItem("token");
      const updateData: any = {
        username: formData.username,
        role: formData.role,
        email: formData.email
      };
      
      // Solo incluir password si se proporcionó uno nuevo
      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await fetch(`${API_URL}/api/users/${editingUsuario.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        showNotification("Usuario actualizado exitosamente", "success");
        resetForm();
        fetchUsuarios();
      } else {
        const error = await response.json();
        showNotification(`Error: ${error.message || "No se pudo actualizar"}`, "error");
      }
    } catch (error) {
      console.error("Error updating usuario:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/users/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        showNotification("Usuario eliminado exitosamente", "success");
        fetchUsuarios();
        setShowDeleteConfirm(null);
      } else {
        showNotification("Error al eliminar", "error");
      }
    } catch (error) {
      console.error("Error deleting usuario:", error);
      showNotification("Error de conexión", "error");
    }
  };

  const handleEdit = (usuario: Usuario) => {
    setEditingUsuario(usuario);
    setFormData({
      username: usuario.username,
      password: "", // No mostrar la contraseña existente
      role: usuario.role,
      email: usuario.email || ""
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
                  ¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer y perderá el acceso al sistema.
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
                Gestión de Usuarios Internos
              </h1>
              <p className="text-gray-600 mt-2">Administra las cuentas con acceso al panel interno</p>
            </div>
          </div>

          {/* Botón Nuevo Usuario */}
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="mb-6 px-8 py-3 rounded-2xl text-white font-semibold hover:shadow-xl transition-all"
            style={{ backgroundColor: '#8A4D76' }}
          >
            {showForm ? "Cancelar" : "+ Nuevo Usuario"}
          </button>

          {/* Buscador */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Buscar por nombre de usuario, rol o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 rounded-2xl border-2 border-gray-300 text-gray-900 bg-white focus:border-[#8A4D76] focus:outline-none text-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Formulario */}
          {showForm && (
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
              <h2 className="text-2xl font-bold mb-6" style={{ color: '#8A4D76' }}>
                {editingUsuario ? "Editar Usuario" : "Crear Nuevo Usuario"}
              </h2>
              <form onSubmit={editingUsuario ? handleUpdate : handleCreate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre de Usuario *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#8A4D76] focus:outline-none text-gray-900"
                      placeholder="Ej: admin_amets"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Contraseña {editingUsuario ? "(dejar vacío para no cambiar)" : "*"}
                    </label>
                    <input
                      type="password"
                      required={!editingUsuario}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#8A4D76] focus:outline-none text-gray-900"
                      placeholder={editingUsuario ? "Nueva contraseña" : "Contraseña"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Rol *
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#8A4D76] focus:outline-none text-gray-900"
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-[#8A4D76] focus:outline-none text-gray-900"
                      placeholder="usuario@ametsgoien.org"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-2xl text-white font-semibold hover:shadow-xl transition-all"
                    style={{ backgroundColor: '#8A4D76' }}
                  >
                    {editingUsuario ? "Actualizar Usuario" : "Crear Usuario"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-8 py-3 rounded-2xl bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de usuarios */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#8A4D76' }}>
              Usuarios Registrados ({filteredUsuarios.length})
            </h2>
            
            {filteredUsuarios.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {searchTerm ? "No se encontraron usuarios con ese criterio" : "No hay usuarios registrados"}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredUsuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="border-2 border-gray-200 rounded-2xl p-6 hover:border-[#8A4D76] transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {usuario.username}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            usuario.role === 'admin' 
                              ? 'bg-purple-100 text-purple-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {usuario.role === 'admin' ? '👑 Admin' : '👤 Usuario'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
                          {usuario.email && (
                            <p><strong>Email:</strong> {usuario.email}</p>
                          )}
                          <p>
                            <strong>Creado:</strong> {new Date(usuario.created_at).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEdit(usuario)}
                          className="px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(usuario.id)}
                          className="px-4 py-2 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-all"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
