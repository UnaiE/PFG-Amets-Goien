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
import paymentRoutes from './routes/paymentRoutes.js';
import donacionRoutes from './routes/donacionRoutes.js';

const app = express();

// ========================================
// SEGURIDAD: Helmet para headers HTTP seguros
// ========================================
app.use(helmet({
  contentSecurityPolicy: false, // Deshabilitado para permitir Stripe
  crossOriginEmbedderPolicy: false // Compatibilidad con recursos externos
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

// Parse JSON (excepto para webhook de Stripe)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

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
app.use('/api/payment/create-intent', formLimiter);

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
app.use('/api/payment', paymentRoutes);
app.use('/api/donaciones', donacionRoutes);

export default app;
