// API configuration and helper functions
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_ENDPOINT = `${API_BASE_URL}/api`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

// Tareas API
export const tareasAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener tareas");
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener tarea");
    return response.json();
  },

  create: async (tareaData: any) => {
    const response = await fetch(`${API_BASE_URL}/tareas`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(tareaData)
    });
    if (!response.ok) throw new Error("Error al crear tarea");
    return response.json();
  },

  update: async (id: number, tareaData: any) => {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(tareaData)
    });
    if (!response.ok) throw new Error("Error al actualizar tarea");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al eliminar tarea");
    return response.json();
  }
};

// Noticias API
export const noticiasAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/noticias`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener noticias");
    return response.json();
  },

  create: async (noticiaData: any) => {
    const response = await fetch(`${API_BASE_URL}/noticias`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(noticiaData)
    });
    if (!response.ok) throw new Error("Error al crear noticia");
    return response.json();
  },

  update: async (id: number, noticiaData: any) => {
    const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(noticiaData)
    });
    if (!response.ok) throw new Error("Error al actualizar noticia");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/noticias/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al eliminar noticia");
    return response.json();
  }
};

// Actividades API
export const actividadesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/actividades`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener actividades");
    return response.json();
  },

  create: async (actividadData: any) => {
    const response = await fetch(`${API_BASE_URL}/actividades`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(actividadData)
    });
    if (!response.ok) throw new Error("Error al crear actividad");
    return response.json();
  },

  update: async (id: number, actividadData: any) => {
    const response = await fetch(`${API_BASE_URL}/actividades/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(actividadData)
    });
    if (!response.ok) throw new Error("Error al actualizar actividad");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/actividades/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al eliminar actividad");
    return response.json();
  }
};

// Residentes API
export const residentesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/residentes`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener residentes");
    return response.json();
  },

  getById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/residentes/${id}`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al obtener residente");
    return response.json();
  },

  create: async (residenteData: any) => {
    const response = await fetch(`${API_BASE_URL}/residentes`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(residenteData)
    });
    if (!response.ok) throw new Error("Error al crear residente");
    return response.json();
  },

  update: async (id: number, residenteData: any) => {
    const response = await fetch(`${API_BASE_URL}/residentes/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(residenteData)
    });
    if (!response.ok) throw new Error("Error al actualizar residente");
    return response.json();
  },

  delete: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/residentes/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error("Error al eliminar residente");
    return response.json();
  }
};

// Users/Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error("Inicio de sesión fallido");
    return response.json();
  },

  logout: () => {
    localStorage.removeItem("token");
  }
};
