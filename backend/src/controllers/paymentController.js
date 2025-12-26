import Stripe from 'stripe';
import Colaborador from '../models/Colaborador.js';
import Donacion from '../models/Donacion.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, colaboradorData } = req.body;

    // Validar datos
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Cantidad inválida' });
    }

    if (!colaboradorData.email) {
      return res.status(400).json({ message: 'Email es requerido' });
    }

    // NO guardar colaborador aún - solo crear Payment Intent
    // Los datos se guardarán cuando el pago sea exitoso
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency: 'eur',
      metadata: {
        // Guardar TODOS los datos del colaborador en metadata
        colaborador_nombre: colaboradorData.nombre,
        colaborador_apellidos: colaboradorData.apellidos,
        colaborador_email: colaboradorData.email,
        colaborador_telefono: colaboradorData.telefono || '',
        colaborador_direccion: colaboradorData.direccion || '',
        colaborador_anotacion: colaboradorData.anotacion || '',
        importe: amount.toString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creando Payment Intent:', error);
    res.status(500).json({ message: 'Error al procesar el pago', error: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Payment Intent ID requerido' });
    }

    // Verificar el estado del pago en Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Si el pago fue exitoso, guardar colaborador y donación
    if (paymentIntent.status === 'succeeded') {
      // Verificar si ya existe la donación
      let donacion = await Donacion.getByPaymentIntentId(paymentIntentId);
      
      if (!donacion) {
        // Extraer datos del metadata
        const metadata = paymentIntent.metadata;
        
        // Buscar o crear colaborador
        const existingColaboradores = await Colaborador.getAll();
        let colaborador = existingColaboradores.find(c => c.email === metadata.colaborador_email);
        
        if (!colaborador) {
          colaborador = await Colaborador.create({
            nombre: metadata.colaborador_nombre,
            apellidos: metadata.colaborador_apellidos,
            email: metadata.colaborador_email,
            telefono: metadata.colaborador_telefono || null,
            direccion: metadata.colaborador_direccion || null,
            anotacion: metadata.colaborador_anotacion || null
          });
        }

        // Crear donación completada
        await Donacion.create({
          colaborador_id: colaborador.id,
          importe: parseFloat(metadata.importe),
          metodo_pago: 'tarjeta',
          stripe_payment_intent_id: paymentIntentId,
          estado: 'completada'
        });
      }

      res.json({
        success: true,
        estado: 'completada',
        paymentStatus: paymentIntent.status
      });
    } else {
      // No guardar nada si el pago no fue exitoso
      res.json({
        success: false,
        estado: paymentIntent.status,
        paymentStatus: paymentIntent.status
      });
    }
  } catch (error) {
    console.error('Error confirmando pago:', error);
    res.status(500).json({ message: 'Error al confirmar el pago', error: error.message });
  }
};

// Webhook para recibir eventos de Stripe
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar el evento
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`✅ PaymentIntent ${paymentIntent.id} succeeded!`);
      
      // Verificar si ya existe la donación
      let donacion = await Donacion.getByPaymentIntentId(paymentIntent.id);
      
      if (!donacion) {
        // Extraer datos del metadata
        const metadata = paymentIntent.metadata;
        
        // Buscar o crear colaborador
        const existingColaboradores = await Colaborador.getAll();
        let colaborador = existingColaboradores.find(c => c.email === metadata.colaborador_email);
        
        if (!colaborador) {
          colaborador = await Colaborador.create({
            nombre: metadata.colaborador_nombre,
            apellidos: metadata.colaborador_apellidos,
            email: metadata.colaborador_email,
            telefono: metadata.colaborador_telefono || null,
            direccion: metadata.colaborador_direccion || null,
            anotacion: metadata.colaborador_anotacion || null
          });
        }

        // Crear donación completada
        await Donacion.create({
          colaborador_id: colaborador.id,
          importe: parseFloat(metadata.importe),
          metodo_pago: 'tarjeta',
          stripe_payment_intent_id: paymentIntent.id,
          estado: 'completada'
        });
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log(`❌ PaymentIntent ${failedPayment.id} failed!`);
      // NO guardar nada en BD si el pago falla
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
