import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes.js';
import actividadRoutes from './routes/actividadRoutes.js';
import colaboradorRoutes from './routes/colaboradorRoutes.js';
import empleadoRoutes from './routes/empleadoRoutes.js';
import noticiaRoutes from './routes/noticiaRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
import residenteRoutes from './routes/residenteRoutes.js';
import contactoRoutes from './routes/contactoRoutes.js';
import redsysRoutes from './routes/redsysRoutes.js';
import donacionRoutes from './routes/donacionRoutes.js';
import newsletterRoutes from './routes/newsletterRoutes.js';
import estadisticasRoutes from './routes/estadisticasRoutes.js';

const app = express();

// ========================================
// CONFIGURACIÓN: Trust proxy para Railway/producción
// ========================================
// Railway, Heroku, etc. usan proxies reversos que añaden X-Forwarded-For
// Esto permite a rate-limit identificar correctamente las IPs de los clientes
app.set('trust proxy', 1); // 1 = confiar en el primer proxy (Railway)

// ========================================
// SEGURIDAD: Helmet para headers HTTP seguros
// ========================================
app.use(helmet({
  contentSecurityPolicy: false, // Deshabilitado para recursos externos
  crossOriginEmbedderPolicy: false, // Compatibilidad con recursos externos
  crossOriginResourcePolicy: false // Permitir que el frontend cargue imágenes del backend
}));

// ========================================
// SEGURIDAD: Rate Limiting general
// ========================================
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting estricto para autenticación
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos de login
  message: 'Demasiados intentos de inicio de sesión, por favor intenta de nuevo más tarde.',
  skipSuccessfulRequests: true // No cuenta requests exitosos
});

// Rate limiting para formularios públicos
const formLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Máximo 10 envíos por hora
  message: 'Demasiados envíos de formulario, por favor intenta de nuevo más tarde.'
});

// CORS configurado para permitir requests desde el frontend
app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origin (como Postman, mobile apps, etc)
    if (!origin) {
      return callback(null, true);
    }
    
    // Permitir localhost para desarrollo
    if (origin.includes('localhost')) {
      return callback(null, true);
    }
    
    // Permitir todas las URLs de Vercel (producción y preview)
    if (origin.includes('vercel.app')) {
      return callback(null, true);
    }
    
    // Permitir el frontend configurado en variables de entorno
    if (process.env.FRONTEND_URL && origin.startsWith(process.env.FRONTEND_URL)) {
      return callback(null, true);
    }
    
    // Bloquear otros orígenes
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Parse JSON y URL-encoded bodies
// Redsys envía datos en formato application/x-www-form-urlencoded
app.use(express.json()); // Para la mayoría de endpoints
app.use(express.urlencoded({ extended: true })); // Para Redsys webhooks

// Health check route (sin rate limiting)
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ========================================
// RUTAS CON RATE LIMITING
// ========================================
// Rutas de autenticación (rate limiting estricto)
app.use('/api/users/login', authLimiter);
app.use('/api/users/register', authLimiter);

// Rutas de formularios públicos (rate limiting moderado)
app.use('/api/contacto', formLimiter);
app.use('/api/payment/redsys/create', formLimiter); // Redsys payment creation
app.use('/api/colaboradores/registro-voluntario', formLimiter); // Registro de voluntarios

// Aplicar rate limiting general a todas las rutas de API
app.use('/api/', generalLimiter);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/colaboradores', colaboradorRoutes);
app.use('/api/empleados', empleadoRoutes);
app.use('/api/noticias', noticiaRoutes);
app.use('/api/tareas', tareaRoutes);
app.use('/api/residentes', residenteRoutes);
app.use('/api/actividades', actividadRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/payment/redsys', redsysRoutes); // Rutas de Redsys
app.use('/api/donaciones', donacionRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/estadisticas', estadisticasRoutes); // Estadísticas públicas

export default app;
