/**
 * @file redsysController.js
 * @description Controlador para procesar pagos con Redsys (TPV Virtual de La Caixa)
 */

import Colaborador from '../models/Colaborador.js';
import Donacion from '../models/Donacion.js';
import { enviarEmailDonacion } from '../services/emailService.js';
import {
  createRedsysPayment,
  verifyRedsysResponse,
  generateOrderId,
  decodeRedsysParams,
  getResponseCodeInfo
} from '../services/redsysService.js';

/**
 * Crea los parámetros para iniciar un pago con Redsys
 * POST /api/payment/redsys/create
 */
export const createRedsysTransaction = async (req, res) => {
  try {
    const { amount, metodoPago, colaboradorData } = req.body;

    console.log('📦 Creando transacción Redsys:', { amount, metodoPago, colaboradorData });

    // Validar datos
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Cantidad inválida' });
    }

    if (!metodoPago || !['tarjeta', 'bizum'].includes(metodoPago)) {
      return res.status(400).json({ 
        message: 'Método de pago inválido. Debe ser "tarjeta" o "bizum"' 
      });
    }

    if (!colaboradorData.nombre || !colaboradorData.apellidos || !colaboradorData.email) {
      return res.status(400).json({ message: 'Datos del colaborador incompletos' });
    }

    // Generar ID de orden único
    const orderId = generateOrderId('DON');
    
    console.log('🔢 Order ID generado:', orderId);

    // NO crear colaborador aquí - se creará en el webhook cuando el pago sea exitoso

    // Crear registro de donación en estado "pendiente" SIN colaborador_id aún
    const periodicidad = colaboradorData.periodicidad || 'puntual';
    const metodoPagoTexto = metodoPago === 'tarjeta' ? 'Redsys (Tarjeta)' : 'Redsys (Bizum)';
    const anotacion = `Donación ${periodicidad} de ${amount}€ vía ${metodoPagoTexto} - Pendiente de confirmación`;

    let donacionId;
    try {
      const nuevaDonacion = await Donacion.create({
        colaborador_id: null, // Se asignará cuando el pago sea exitoso
        cantidad: amount,
        metodo_pago: metodoPagoTexto,
        redsys_order_id: orderId,
        periodicidad: periodicidad,
        estado: 'pendiente',
        anotacion: anotacion,
        // Guardar datos del colaborador temporalmente en la anotación
        metadata: JSON.stringify(colaboradorData)
      });
      donacionId = nuevaDonacion.id;
      console.log('✅ Donación creada en estado pendiente (sin colaborador):', donacionId);
    } catch (error) {
      console.error('Error creando donación:', error);
      return res.status(500).json({ message: 'Error al registrar la donación' });
    }

    // Construir URLs de retorno
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const urlOk = `${baseUrl}/colaborar/exito?orderId=${orderId}`;
    const urlKo = `${baseUrl}/colaborar/error?orderId=${orderId}`;
    const urlNotification = `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/payment/redsys/notification`;

    console.log('🔔 URLs configuradas para Redsys:');
    console.log('  - URL OK:', urlOk);
    console.log('  - URL KO:', urlKo);
    console.log('  - URL WEBHOOK:', urlNotification);

    // Crear parámetros de pago para Redsys
    const redsysParams = createRedsysPayment({
      orderId: orderId,
      amount: amount,
      metodoPago: metodoPago, // 'tarjeta' o 'bizum'
      description: `Donación Amets Goien - ${colaboradorData.nombre} ${colaboradorData.apellidos}`,
      urlOk: urlOk,
      urlKo: urlKo,
      urlNotification: urlNotification,
      customerEmail: colaboradorData.email,
      customerName: `${colaboradorData.nombre} ${colaboradorData.apellidos}`
    });

    console.log('✅ Parámetros Redsys generados para orderId:', orderId);

    // Devolver parámetros al frontend
    res.json({
      success: true,
      orderId: orderId,
      donacionId: donacionId,
      // No devolver colaboradorId porque aún no se ha creado
      redsysParams: {
        Ds_SignatureVersion: redsysParams.Ds_SignatureVersion,
        Ds_MerchantParameters: redsysParams.Ds_MerchantParameters,
        Ds_Signature: redsysParams.Ds_Signature,
        redsysUrl: redsysParams.redsysUrl
      }
    });

  } catch (error) {
    console.error('❌ Error en createRedsysTransaction:', error);
    res.status(500).json({ 
      message: 'Error al procesar el pago', 
      error: error.message 
    });
  }
};

/**
 * Maneja la notificación automática de Redsys (webhook)
 * POST /api/payment/redsys/notification
 */
export const handleRedsysNotification = async (req, res) => {
  try {
    console.log('\n' + '═'.repeat(70));
    console.log('📩 WEBHOOK RECIBIDO DE REDSYS');
    console.log('═'.repeat(70));
    console.log('Timestamp:', new Date().toISOString());
    console.log('IP origen:', req.ip || req.connection.remoteAddress);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body completo:', JSON.stringify(req.body, null, 2));
    console.log('═'.repeat(70) + '\n');

    const { Ds_MerchantParameters, Ds_Signature } = req.body;

    if (!Ds_MerchantParameters || !Ds_Signature) {
      console.error('❌ Parámetros faltantes en la notificación');
      return res.status(400).send('Parámetros faltantes');
    }

    // Verificar firma
    const verification = verifyRedsysResponse(Ds_MerchantParameters, Ds_Signature);

    if (!verification.valid) {
      console.error('❌ Firma inválida en notificación de Redsys');
      console.error('Esperada:', verification.expectedSignature);
      console.error('Recibida:', verification.receivedSignature);
      return res.status(400).send('Firma inválida');
    }

    console.log('✅ Firma verificada correctamente');

    const params = verification.params;
    const orderId = params.Ds_Order;
    const responseCode = params.Ds_Response;
    const authCode = params.Ds_AuthorisationCode;
    const amount = parseInt(params.Ds_Amount) / 100; // Convertir de céntimos a euros
    const cardCountry = params.Ds_Card_Country;
    const cardBrand = params.Ds_Card_Brand;
    const processedPayMethod = params.Ds_ProcessedPayMethod; // 68 = Bizum, 3 = Tarjeta

    // Detectar método de pago real
    let metodoPagoReal = 'Redsys';
    if (processedPayMethod === '68') {
      metodoPagoReal = 'Bizum';
    } else if (cardBrand) {
      metodoPagoReal = `Tarjeta (${cardBrand})`;
    } else {
      metodoPagoReal = 'Tarjeta';
    }

    const responseInfo = getResponseCodeInfo(responseCode);

    console.log('📋 Detalles de la transacción:');
    console.log('  - Order ID:', orderId);
    console.log('  - Código de respuesta:', responseCode, '-', responseInfo.message);
    console.log('  - Código de autorización:', authCode);
    console.log('  - Cantidad:', amount, '€');
    console.log('  - Método de pago:', metodoPagoReal);

    // Buscar donación por order_id
    const donacion = await Donacion.findByRedsysOrderId(orderId);

    if (!donacion) {
      console.error('❌ Donación no encontrada para order_id:', orderId);
      return res.status(404).send('Donación no encontrada');
    }

    // Actualizar estado de la donación
    if (responseInfo.success) {
      // Pago exitoso - AHORA crear o encontrar el colaborador
      let colaboradorId;
      let colaboradorData;

      try {
        // Extraer datos del colaborador guardados en la anotación
        if (donacion.metadata) {
          colaboradorData = JSON.parse(donacion.metadata);
        } else {
          // Fallback: intentar extraer del anotacion (método antiguo)
          console.warn('⚠️ Metadata no encontrado, usando fallback');
          colaboradorData = null;
        }

        if (colaboradorData) {
          // Buscar colaborador existente por email
          const colaboradorExistente = await Colaborador.findByEmail(colaboradorData.email);
          
          if (colaboradorExistente) {
            colaboradorId = colaboradorExistente.id;
            console.log('✅ Colaborador existente encontrado:', colaboradorId);
            
            // Actualizar anotación del colaborador con la nueva donación
            const fechaActual = new Date().toISOString().split('T')[0];
            const nuevaAnotacion = colaboradorExistente.anotacion 
              ? `${colaboradorExistente.anotacion}\n[${fechaActual}] Nueva donación: ${amount}€ vía ${metodoPagoReal}` 
              : `[${fechaActual}] Donación: ${amount}€ vía ${metodoPagoReal}`;
            
            // Si era voluntario y ahora dona, actualizar a 'ambos'
            if (colaboradorExistente.tipo_colaboracion === 'voluntario') {
              await Colaborador.update(colaboradorId, {
                ...colaboradorExistente,
                tipo_colaboracion: 'ambos',
                anotacion: nuevaAnotacion
              });
              console.log('✅ Colaborador actualizado de "voluntario" a "ambos" con nueva anotación');
            } else {
              // Actualizar solo la anotación
              await Colaborador.update(colaboradorId, {
                ...colaboradorExistente,
                anotacion: nuevaAnotacion
              });
              console.log('✅ Anotación del colaborador actualizada con nueva donación');
            }
          } else {
            // Crear nuevo colaborador
            const nuevoColaborador = await Colaborador.create({
              nombre: colaboradorData.nombre,
              apellidos: colaboradorData.apellidos,
              email: colaboradorData.email,
              telefono: colaboradorData.telefono || null,
              direccion: colaboradorData.direccion || null,
              anotacion: colaboradorData.anotacion || null,
              tipo_colaboracion: 'monetario',
              periodicidad: donacion.periodicidad
            });
            colaboradorId = nuevoColaborador.id;
            console.log('✅ Nuevo colaborador creado:', colaboradorId);
          }
        } else {
          console.error('❌ No se pudo obtener datos del colaborador');
          colaboradorId = null;
        }
      } catch (colaboradorError) {
        console.error('❌ Error procesando colaborador:', colaboradorError);
        colaboradorId = null;
      }

      // Actualizar donación con estado completada, colaborador_id y anotación mejorada
      await Donacion.update(donacion.id, {
        estado: 'completada',
        colaborador_id: colaboradorId,
        redsys_auth_code: authCode,
        redsys_response_code: responseCode,
        metodo_pago: metodoPagoReal,
        anotacion: `Donación ${donacion.periodicidad} de ${amount}€ vía ${metodoPagoReal} | Auth: ${authCode} | ${responseInfo.message}`.trim()
      });

      console.log('✅ Donación actualizada a "completada":', donacion.id);

      // Enviar email de confirmación
      try {
        if (colaboradorId) {
          const colaborador = await Colaborador.findById(colaboradorId);
          if (colaborador) {
            await enviarEmailDonacion({
              nombre: colaborador.nombre,
              apellidos: colaborador.apellidos,
              email: colaborador.email,
              cantidad: amount,
              periodicidad: donacion.periodicidad,
              metodoPago: metodoPagoReal,
              orderId: orderId
            });
            console.log('✅ Email de confirmación enviado');
          }
        }
      } catch (emailError) {
        console.error('⚠️ Error enviando email de confirmación:', emailError);
        // No fallar la transacción por error de email
      }

    } else {
      // Pago fallido - NO crear colaborador
      await Donacion.update(donacion.id, {
        estado: 'fallida',
        redsys_response_code: responseCode,
        anotacion: `Donación ${donacion.periodicidad} de ${amount}€ FALLIDA | Error: ${responseInfo.message}`.trim()
      });

      console.log('❌ Donación marcada como "fallida":', donacion.id);
    }

    // Responder a Redsys (debe ser una respuesta vacía con código 200)
    res.status(200).send();

  } catch (error) {
    console.error('❌ Error procesando notificación de Redsys:', error);
    res.status(500).send('Error interno');
  }
};

/**
 * Maneja el retorno del usuario desde Redsys (URL OK)
 * GET /api/payment/redsys/return
 */
export const handleRedsysReturn = async (req, res) => {
  try {
    console.log('🔙 Usuario retornó de Redsys');
    console.log('Query params:', req.query);

    const { Ds_MerchantParameters, Ds_Signature } = req.query;

    if (!Ds_MerchantParameters || !Ds_Signature) {
      return res.status(400).json({ 
        success: false, 
        message: 'Parámetros faltantes' 
      });
    }

    // Verificar firma
    const verification = verifyRedsysResponse(Ds_MerchantParameters, Ds_Signature);

    if (!verification.valid) {
      return res.status(400).json({ 
        success: false, 
        message: 'Firma inválida' 
      });
    }

    const params = verification.params;
    const orderId = params.Ds_Order;
    const responseCode = params.Ds_Response;
    const responseInfo = getResponseCodeInfo(responseCode);

    // Devolver información del pago
    res.json({
      success: responseInfo.success,
      orderId: orderId,
      responseCode: responseCode,
      message: responseInfo.message,
      params: params
    });

  } catch (error) {
    console.error('❌ Error en handleRedsysReturn:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error procesando el resultado del pago' 
    });
  }
};

/**
 * Consulta el estado de una donación por orderId
 * GET /api/payment/redsys/status/:orderId
 */
export const checkPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const donacion = await Donacion.findByRedsysOrderId(orderId);

    if (!donacion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Donación no encontrada' 
      });
    }

    const colaborador = await Colaborador.findById(donacion.colaborador_id);

    res.json({
      success: true,
      donacion: {
        id: donacion.id,
        orderId: orderId,
        redsys_order_id: donacion.redsys_order_id,
        cantidad: donacion.cantidad,
        estado: donacion.estado,
        periodicidad: donacion.periodicidad,
        metodoPago: donacion.metodo_pago,
        fechaCreacion: donacion.created_at,
        colaborador: colaborador ? {
          nombre: colaborador.nombre,
          apellidos: colaborador.apellidos,
          email: colaborador.email
        } : null
      }
    });

  } catch (error) {
    console.error('Error consultando estado del pago:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al consultar el estado del pago' 
    });
  }
};

export default {
  createRedsysTransaction,
  handleRedsysNotification,
  handleRedsysReturn,
  checkPaymentStatus
};
