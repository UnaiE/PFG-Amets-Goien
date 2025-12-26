import express from 'express';
import { createPaymentIntent, confirmPayment, stripeWebhook } from '../controllers/paymentController.js';

const router = express.Router();

// Ruta para crear Payment Intent
router.post('/create-intent', createPaymentIntent);

// Ruta para confirmar pago
router.post('/confirm', confirmPayment);

// Webhook de Stripe (debe ser POST con raw body)
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
