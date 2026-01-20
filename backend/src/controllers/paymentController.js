import Stripe from 'stripe';
import Colaborador from '../models/Colaborador.js';
import Donacion from '../models/Donacion.js';
import { enviarEmailDonacion } from '../services/emailService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Mapeo de periodicidad a intervalos de Stripe
const getStripeInterval = (periodicidad) => {
  const intervalMap = {
    'mensual': { interval: 'month', interval_count: 1 },
    'trimestral': { interval: 'month', interval_count: 3 },
    'semestral': { interval: 'month', interval_count: 6 },
    'anual': { interval: 'year', interval_count: 1 },
    'puntual': null
  };
  return intervalMap[periodicidad] || null;
};

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, colaboradorData } = req.body;

    // DEBUG: Ver qué datos llegan
    console.log('📦 Datos recibidos:', { amount, colaboradorData });

    // Validar datos
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Cantidad inválida' });
    }

    if (!colaboradorData.email) {
      return res.status(400).json({ message: 'Email es requerido' });
    }

    const periodicidad = colaboradorData.periodicidad || 'puntual';
    const stripeInterval = getStripeInterval(periodicidad);
    
    console.log('🔄 Periodicidad detectada:', periodicidad);
    console.log('⚙️ Stripe interval:', stripeInterval);

    // Si es donación recurrente, crear suscripción
    if (stripeInterval) {
      console.log('🔄 Creando suscripción con Payment Intent embebido...');
      
      // Buscar o crear cliente de Stripe
      const customers = await stripe.customers.list({
        email: colaboradorData.email,
        limit: 1
      });

      let customer;
      if (customers.data.length > 0) {
        customer = customers.data[0];
        console.log('✅ Cliente existente:', customer.id);
      } else {
        customer = await stripe.customers.create({
          email: colaboradorData.email,
          name: `${colaboradorData.nombre} ${colaboradorData.apellidos}`,
          metadata: {
            telefono: colaboradorData.telefono || '',
            direccion: colaboradorData.direccion || ''
          }
        });
        console.log('✅ Nuevo cliente creado:', customer.id);
      }

      // Crear precio para la suscripción
      const price = await stripe.prices.create({
        product_data: {
          name: `Donación ${periodicidad} - Ametsgoien`
        },
        unit_amount: Math.round(amount * 100),
        currency: 'eur',
        recurring: {
          interval: stripeInterval.interval,
          interval_count: stripeInterval.interval_count
        }
      });
      
      console.log('✅ Precio creado:', price.id);

      // Crear un Payment Intent para el primer pago
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'eur',
        customer: customer.id,
        setup_future_usage: 'off_session', // Guardar método de pago para futuros cargos
        metadata: {
          colaborador_nombre: colaboradorData.nombre,
          colaborador_apellidos: colaboradorData.apellidos,
          colaborador_email: colaboradorData.email,
          colaborador_telefono: colaboradorData.telefono || '',
          colaborador_direccion: colaboradorData.direccion || '',
          colaborador_anotacion: colaboradorData.anotacion || '',
          periodicidad: periodicidad,
          cantidad: amount.toString(),
          price_id: price.id, // Para crear la suscripción después del pago
          subscription_mode: 'true'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      console.log('✅ Payment Intent creado:', paymentIntent.id);

      res.json({
        subscriptionMode: true,
        priceId: price.id,
        customerId: customer.id,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } else {
      // Donación puntual - crear Payment Intent normal
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'eur',
        metadata: {
          colaborador_nombre: colaboradorData.nombre,
          colaborador_apellidos: colaboradorData.apellidos,
          colaborador_email: colaboradorData.email,
          colaborador_telefono: colaboradorData.telefono || '',
          colaborador_direccion: colaboradorData.direccion || '',
          colaborador_anotacion: colaboradorData.anotacion || '',
          periodicidad: 'puntual',
          cantidad: amount.toString()
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        subscriptionMode: false,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    }
  } catch (error) {
    console.error('Error creando Payment Intent:', error);
    res.status(500).json({ message: 'Error al procesar el pago', error: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, sessionId } = req.body;

    console.log('✅ Confirmación de pago recibida:', { paymentIntentId, sessionId });
    
    if (paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status === 'succeeded') {
        // Verificar si ya existe en BD
        let donacion = await Donacion.getByPaymentIntentId(paymentIntentId);
        
        if (!donacion) {
          // Procesar y guardar en BD
          const metadata = paymentIntent.metadata;
          
          const existingColaboradores = await Colaborador.getAll();
          let colaborador = existingColaboradores.find(c => c.email === metadata.colaborador_email);
          
          if (!colaborador) {
            colaborador = await Colaborador.create({
              nombre: metadata.colaborador_nombre,
              apellidos: metadata.colaborador_apellidos,
              email: metadata.colaborador_email,
              telefono: metadata.colaborador_telefono || null,
              direccion: metadata.colaborador_direccion || null,
              anotacion: metadata.colaborador_anotacion || null,
              periodicidad: metadata.periodicidad || 'puntual',
              stripe_subscription_id: null
            });
          }
          
          // Si es modo suscripción, crear la suscripción en Stripe
          let subscriptionId = null;
          if (metadata.subscription_mode === 'true' && metadata.price_id) {
            console.log('🔄 Creando suscripción en Stripe...');
            
            const paymentMethodId = paymentIntent.payment_method;
            
            if (paymentMethodId) {
              try {
                await stripe.paymentMethods.attach(paymentMethodId, {
                  customer: paymentIntent.customer,
                });
                
                await stripe.customers.update(paymentIntent.customer, {
                  invoice_settings: {
                    default_payment_method: paymentMethodId,
                  },
                });
              } catch (err) {
                console.log('⚠️ Método de pago ya adjuntado');
              }
            }
            
            const subscription = await stripe.subscriptions.create({
              customer: paymentIntent.customer,
              items: [{ price: metadata.price_id }],
              default_payment_method: paymentMethodId,
              metadata: {
                colaborador_nombre: metadata.colaborador_nombre,
                colaborador_apellidos: metadata.colaborador_apellidos,
                colaborador_email: metadata.colaborador_email,
                periodicidad: metadata.periodicidad,
                cantidad: metadata.cantidad
              }
            });
            
            subscriptionId = subscription.id;
            console.log('✅ Suscripción creada:', subscriptionId);
            
            await Colaborador.update(colaborador.id, {
              stripe_subscription_id: subscriptionId,
              periodicidad: metadata.periodicidad
            });
          }
          
          await Donacion.create({
            colaborador_id: colaborador.id,
            cantidad: parseFloat(metadata.cantidad),
            metodo_pago: 'tarjeta',
            stripe_payment_intent_id: paymentIntentId,
            stripe_subscription_id: subscriptionId || null,
            periodicidad: metadata.periodicidad || 'puntual',
            estado: 'completada',
            anotacion: subscriptionId 
              ? `Primer pago de suscripción ${metadata.periodicidad}: ${metadata.cantidad}€`
              : `Donación puntual: ${metadata.cantidad}€`
          });
          
          console.log('✅ Donación guardada en BD');
        }
        
        res.json({
          success: true,
          estado: 'completada'
        });
      } else {
        res.json({
          success: false,
          estado: paymentIntent.status
        });
      }
    } else if (sessionId) {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      
      res.json({
        success: session.payment_status === 'paid',
        estado: session.payment_status
      });
    } else {
      res.status(400).json({ message: 'Payment Intent ID o Session ID requerido' });
    }
  } catch (error) {
    console.error('Error confirmando pago:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al confirmar el pago', 
      error: error.message 
    });
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
            anotacion: metadata.colaborador_anotacion || null,
            periodicidad: metadata.periodicidad || 'puntual',
            stripe_subscription_id: null
          });
        }
        
        // Si es modo suscripción, crear la suscripción ahora
        let subscriptionId = null;
        if (metadata.subscription_mode === 'true' && metadata.price_id) {
          console.log('🔄 Creando suscripción después del primer pago...');
          
          // Obtener el método de pago usado
          const paymentMethodId = paymentIntent.payment_method;
          
          // Adjuntar el método de pago al cliente si no lo está
          if (paymentMethodId) {
            try {
              await stripe.paymentMethods.attach(paymentMethodId, {
                customer: paymentIntent.customer,
              });
              
              // Establecer como método de pago por defecto
              await stripe.customers.update(paymentIntent.customer, {
                invoice_settings: {
                  default_payment_method: paymentMethodId,
                },
              });
              
              console.log('✅ Método de pago adjuntado al cliente');
            } catch (err) {
              console.log('⚠️ Método de pago ya adjuntado:', err.message);
            }
          }
          
          // Crear la suscripción
          const subscription = await stripe.subscriptions.create({
            customer: paymentIntent.customer,
            items: [{ price: metadata.price_id }],
            default_payment_method: paymentMethodId,
            metadata: {
              colaborador_nombre: metadata.colaborador_nombre,
              colaborador_apellidos: metadata.colaborador_apellidos,
              colaborador_email: metadata.colaborador_email,
              colaborador_telefono: metadata.colaborador_telefono || '',
              colaborador_direccion: metadata.colaborador_direccion || '',
              colaborador_anotacion: metadata.colaborador_anotacion || '',
              periodicidad: metadata.periodicidad,
              cantidad: metadata.cantidad
            }
          });
          
          subscriptionId = subscription.id;
          console.log('✅ Suscripción creada:', subscriptionId);
          
          // Actualizar colaborador con subscription_id
          await Colaborador.update(colaborador.id, {
            stripe_subscription_id: subscriptionId,
            periodicidad: metadata.periodicidad
          });
        }

        // Crear donación completada
        await Donacion.create({
          colaborador_id: colaborador.id,
          cantidad: parseFloat(metadata.cantidad),
          metodo_pago: 'tarjeta',
          stripe_payment_intent_id: paymentIntent.id,
          stripe_subscription_id: subscriptionId || null,
          periodicidad: metadata.periodicidad || 'puntual',
          estado: 'completada',
          anotacion: subscriptionId 
            ? `Primer pago de suscripción ${metadata.periodicidad}: ${metadata.cantidad}€ via tarjeta`
            : `Donación puntual: ${metadata.cantidad}€ via tarjeta`
        });
        
        // Enviar email de confirmación
        if (subscriptionId) {
          await enviarEmailDonacion({
            email: metadata.colaborador_email,
            nombre: metadata.colaborador_nombre,
            cantidad: metadata.cantidad,
            periodicidad: metadata.periodicidad,
            stripeSubscriptionId: subscriptionId
          });
        }
      }
      break;

    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`✅ Checkout Session ${session.id} completed!`);
      
      // Solo procesar si es una suscripción
      if (session.mode === 'subscription' && session.subscription) {
        const sessionMetadata = session.metadata;
        const subscription = await stripe.subscriptions.retrieve(session.subscription);

        // Buscar o crear colaborador
        const allColaboradores = await Colaborador.getAll();
        let colaborador = allColaboradores.find(c => c.email === sessionMetadata.colaborador_email);

        if (!colaborador) {
          colaborador = await Colaborador.create({
            nombre: sessionMetadata.colaborador_nombre,
            apellidos: sessionMetadata.colaborador_apellidos,
            email: sessionMetadata.colaborador_email,
            telefono: sessionMetadata.colaborador_telefono || null,
            direccion: sessionMetadata.colaborador_direccion || null,
            anotacion: sessionMetadata.colaborador_anotacion || null,
            periodicidad: sessionMetadata.periodicidad,
            stripe_subscription_id: session.subscription
          });
        } else {
          // Actualizar con el subscription_id
          await Colaborador.update(colaborador.id, {
            ...colaborador,
            periodicidad: sessionMetadata.periodicidad,
            stripe_subscription_id: session.subscription
          });
        }

        // Crear donación inicial
        await Donacion.create({
          colaborador_id: colaborador.id,
          cantidad: parseFloat(sessionMetadata.cantidad),
          metodo_pago: 'tarjeta',
          stripe_payment_intent_id: subscription.latest_invoice,
          stripe_subscription_id: session.subscription,
          periodicidad: sessionMetadata.periodicidad,
          estado: 'completada',
          anotacion: `Donación ${sessionMetadata.periodicidad}: ${sessionMetadata.cantidad}€ via tarjeta`
        });
      }
      break;

    case 'invoice.payment_succeeded':
      // Se ejecuta cada vez que se cobra una suscripción
      const invoice = event.data.object;
      console.log(`✅ Invoice ${invoice.id} paid for subscription ${invoice.subscription}!`);
      
      if (invoice.subscription) {
        // Buscar colaborador por subscription_id
        const colaboradores = await Colaborador.getAll();
        const colaborador = colaboradores.find(c => c.stripe_subscription_id === invoice.subscription);

        if (colaborador) {
          // Crear donación por el pago recurrente
          await Donacion.create({
            colaborador_id: colaborador.id,
            cantidad: invoice.amount_paid / 100, // Convertir de centavos
            metodo_pago: 'tarjeta',
            stripe_payment_intent_id: invoice.payment_intent,
            stripe_subscription_id: invoice.subscription,
            periodicidad: colaborador.periodicidad,
            estado: 'completada',
            anotacion: `Pago recurrente ${colaborador.periodicidad}: ${(invoice.amount_paid / 100)}€ via tarjeta`
          });
          console.log(`📝 Donación recurrente registrada para colaborador ${colaborador.id}`);
          
          // Enviar email de confirmación para pago recurrente
          await enviarEmailDonacion({
            email: colaborador.email,
            nombre: colaborador.nombre,
            cantidad: (invoice.amount_paid / 100).toString(),
            periodicidad: colaborador.periodicidad,
            stripeSubscriptionId: invoice.subscription
          });
        }
      }
      break;

    case 'customer.subscription.deleted':
      // Cuando se cancela una suscripción
      const canceledSubscription = event.data.object;
      console.log(`❌ Subscription ${canceledSubscription.id} canceled!`);
      
      // Actualizar colaborador para remover subscription_id
      const allColabs = await Colaborador.getAll();
      const colab = allColabs.find(c => c.stripe_subscription_id === canceledSubscription.id);
      
      if (colab) {
        await Colaborador.update(colab.id, {
          ...colab,
          stripe_subscription_id: null,
          anotacion: (colab.anotacion || '') + ' [Suscripción cancelada]'
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
