"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Colaborador {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  tipo_colaboracion: string;
}

export default function NewsletterPage() {
  const router = useRouter();
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  
  const [formData, setFormData] = useState({
    asunto: "",
    mensaje: "",
    destinatarios_tipo: "todos" // 'todos', 'monetario', 'voluntario', 'ambos'
  });

  const [stats, setStats] = useState({
    total: 0,
    monetario: 0,
    voluntario: 0,
    ambos: 0
  });

  const [sendStatus, setSendStatus] = useState<{type: 'success' | 'error' | null, message: string}>({
    type: null,
    message: ''
  });

  const [showSendConfirm, setShowSendConfirm] = useState(false);

  // Cargar colaboradores al montar
  useEffect(() => {
    fetchColaboradores('todos');
  }, []);

  const fetchColaboradores = async (tipo: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/acceso-interno');
        return;
      }

      const response = await fetch(`${API_URL}/api/newsletter/colaboradores?tipo=${tipo}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setColaboradores(data.colaboradores || []);
        
        // Calcular estadísticas
        const all = await fetchAllColaboradores(token);
        setStats({
          total: all.length,
          monetario: all.filter((c: Colaborador) => c.tipo_colaboracion === 'monetario' || c.tipo_colaboracion === 'ambos').length,
          voluntario: all.filter((c: Colaborador) => c.tipo_colaboracion === 'voluntario' || c.tipo_colaboracion === 'ambos').length,
          ambos: all.filter((c: Colaborador) => c.tipo_colaboracion === 'ambos').length
        });
      } else if (response.status === 401) {
        router.push('/acceso-interno');
      }
    } catch (error) {
      console.error('Error al cargar colaboradores:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllColaboradores = async (token: string): Promise<Colaborador[]> => {
    const response = await fetch(`${API_URL}/api/newsletter/colaboradores?tipo=todos`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      return data.colaboradores || [];
    }
    return [];
  };

  const handleTipoChange = (tipo: string) => {
    setFormData({ ...formData, destinatarios_tipo: tipo });
    fetchColaboradores(tipo);
  };

  const handleSendTest = async () => {
    if (!formData.asunto || !formData.mensaje) {
      setSendStatus({
        type: 'error',
        message: 'El asunto y el mensaje son obligatorios'
      });
      return;
    }

    setSending(true);
    setSendStatus({type: null, message: ''});

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/newsletter/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          asunto: formData.asunto,
          mensaje: formData.mensaje
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSendStatus({
          type: 'success',
          message: data.message || 'Email de prueba enviado exitosamente'
        });
      } else {
        setSendStatus({
          type: 'error',
          message: data.message || 'Error al enviar email de prueba'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSendStatus({
        type: 'error',
        message: 'Error de conexión al enviar email de prueba'
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendNewsletter = async () => {
    if (!formData.asunto || !formData.mensaje) {
      setSendStatus({
        type: 'error',
        message: 'El asunto y el mensaje son obligatorios'
      });
      return;
    }

    if (colaboradores.length === 0) {
      setSendStatus({
        type: 'error',
        message: 'No hay destinatarios para enviar'
      });
      return;
    }

    // Mostrar modal de confirmación
    setShowSendConfirm(true);
  };

  const confirmSendNewsletter = async () => {
    setShowSendConfirm(false);

    setSending(true);
    setSendStatus({type: null, message: ''});

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/newsletter/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          asunto: formData.asunto,
          mensaje: formData.mensaje,
          destinatarios_tipo: formData.destinatarios_tipo
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSendStatus({
          type: 'success',
          message: `✅ ${data.message}\n\nExitosos: ${data.exitosos}\nFallidos: ${data.fallidos}`
        });
        // Limpiar formulario
        setFormData({
          asunto: "",
          mensaje: "",
          destinatarios_tipo: "todos"
        });
      } else {
        setSendStatus({
          type: 'error',
          message: data.message || 'Error al enviar newsletter'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      setSendStatus({
        type: 'error',
        message: 'Error de conexión al enviar newsletter'
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#E8D5F2' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/dashboard')}
            className="mb-4 px-5 py-2 rounded-full bg-white text-[#8A4D76] font-semibold hover:shadow-md transition-all text-sm"
          >
            ← Volver al Dashboard
          </button>
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#8A4D76' }}>
            Newsletter
          </h1>
          <p className="text-gray-700 text-lg">
            Envía mensajes a tus colaboradores y voluntarios
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Total Colaboradores</h3>
            <p className="text-3xl font-bold" style={{ color: '#8A4D76' }}>{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Donantes</h3>
            <p className="text-3xl font-bold text-green-600">{stats.monetario}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Voluntarios</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.voluntario}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Ambos</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.ambos}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Formulario */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#8A4D76' }}>
              Redactar Newsletter
            </h2>

            {sendStatus.type && (
              <div className={`mb-6 p-4 rounded-lg whitespace-pre-wrap ${
                sendStatus.type === 'success' 
                  ? 'bg-green-50 border-l-4 border-green-500 text-green-700' 
                  : 'bg-red-50 border-l-4 border-red-500 text-red-700'
              }`}>
                {sendStatus.message}
              </div>
            )}

            <div className="space-y-6">
              
              {/* Destinatarios */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Destinatarios
                </label>
                <select
                  value={formData.destinatarios_tipo}
                  onChange={(e) => handleTipoChange(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8A4D76] focus:border-[#8A4D76] transition-all"
                >
                  <option value="todos">Todos los colaboradores ({stats.total})</option>
                  <option value="monetario">Solo donantes ({stats.monetario})</option>
                  <option value="voluntario">Solo voluntarios ({stats.voluntario})</option>
                  <option value="ambos">Ambos tipos ({stats.ambos})</option>
                </select>
              </div>

              {/* Asunto */}
              <div>
                <label htmlFor="asunto" className="block text-sm font-bold text-gray-800 mb-2">
                  Asunto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="asunto"
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8A4D76] focus:border-[#8A4D76] transition-all placeholder-gray-400"
                  placeholder="Asunto del email"
                />
              </div>

              {/* Mensaje */}
              <div>
                <label htmlFor="mensaje" className="block text-sm font-bold text-gray-800 mb-2">
                  Mensaje <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="mensaje"
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  rows={12}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[#8A4D76] focus:border-[#8A4D76] transition-all resize-none placeholder-gray-400"
                  placeholder="Escribe tu mensaje aquí...&#10;&#10;Puedes usar saltos de línea. &#10;El mensaje se enviará con formato HTML."
                />
                <p className="text-xs text-gray-500 mt-2">
                  El email incluirá automáticamente el nombre del destinatario y el footer de Ametsgoien
                </p>
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  onClick={handleSendTest}
                  disabled={sending || !formData.asunto || !formData.mensaje}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {sending ? 'Enviando...' : 'Enviar Prueba'}
                </button>
                <button
                  onClick={handleSendNewsletter}
                  disabled={sending || !formData.asunto || !formData.mensaje || colaboradores.length === 0}
                  className="flex-1 py-3 px-4 rounded-lg font-semibold text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{ backgroundColor: '#8A4D76' }}
                >
                  {sending ? 'Enviando...' : `Enviar a ${colaboradores.length}`}
                </button>
              </div>

            </div>
          </div>

          {/* Lista de destinatarios */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#8A4D76' }}>
              Destinatarios ({colaboradores.length})
            </h2>

            {loading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : colaboradores.length === 0 ? (
              <p className="text-gray-500">No hay destinatarios para el filtro seleccionado</p>
            ) : (
              <div className="max-h-[600px] overflow-y-auto space-y-3">
                {colaboradores.map(colaborador => (
                  <div key={colaborador.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <p className="font-semibold text-gray-900">
                      {colaborador.nombre} {colaborador.apellidos}
                    </p>
                    <p className="text-sm text-gray-600">{colaborador.email}</p>
                    <span className={`inline-block mt-2 px-2 py-1 rounded text-xs font-medium ${
                      colaborador.tipo_colaboracion === 'monetario' ? 'bg-green-100 text-green-800' :
                      colaborador.tipo_colaboracion === 'voluntario' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {colaborador.tipo_colaboracion}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal de confirmación de envío */}
        {showSendConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4">
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#8A4D76' }}>
                Confirmar envío
              </h3>
              <p className="text-gray-700 mb-2">
                ¿Estás seguro/a de que deseas enviar esta newsletter?
              </p>
              <div className="bg-purple-50 border-l-4 border-[#8A4D76] p-4 rounded mb-6">
                <p className="text-sm font-semibold text-gray-800">
                  <span className="text-[#8A4D76]">{colaboradores.length}</span> destinatario{colaboradores.length !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Asunto: <span className="font-medium">{formData.asunto}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  ⚠️ Esta acción no se puede deshacer
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={confirmSendNewsletter}
                  className="flex-1 py-3 rounded-full text-white font-semibold hover:opacity-90 transition-all"
                  style={{ backgroundColor: '#8A4D76' }}
                >
                  Sí, enviar
                </button>
                <button
                  onClick={() => setShowSendConfirm(false)}
                  className="flex-1 py-3 rounded-full bg-gray-500 text-white font-semibold hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
