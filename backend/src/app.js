import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimit({windowMs: 15 * 60 * 1000, max: 100}));

// Rutas
app.use('/api/users', userRoutes);

export default app;
