/**
 * @file redsysService.js
 * @description Servicio para integración con Redsys (TPV Virtual de La Caixa)
 * @docs https://pagosonline.redsys.es/desarrolladores.html
 */

import crypto from 'crypto';

// Configuración de Redsys
const REDSYS_CONFIG = {
  // Entorno de TEST
  test: {
    merchantCode: '369230081',
    terminal: '1',
    currency: '978', // EUR
    secretKey: 'sq7HjrUOBfKmC576ILgskD5srU870gJ7',
    url: 'https://sis-t.redsys.es:25443/sis/realizarPago'
  },
  // Entorno de PRODUCCIÓN (se configurará después del pase a producción)
  production: {
    merchantCode: '369230081',
    terminal: '1',
    currency: '978',
    secretKey: '', // Se configurará al pasar a producción
    url: 'https://sis.redsys.es/sis/realizarPago'
  }
};

// Usar entorno de test por defecto
const ENV = process.env.REDSYS_ENV || 'test';
const CONFIG = REDSYS_CONFIG[ENV];

/**
 * Genera una clave de cifrado derivada de la clave secreta
 * @param {string} orderId - Número de pedido
 * @returns {Buffer} - Clave derivada
 */
function generate3DESKey(orderId) {
  const secretKeyBytes = Buffer.from(CONFIG.secretKey, 'base64');
  const cipher = crypto.createCipheriv('des-ede3-cbc', secretKeyBytes, Buffer.alloc(8, 0));
  cipher.setAutoPadding(false);
  
  const orderBytes = Buffer.concat([
    Buffer.from(orderId, 'utf8'),
    Buffer.alloc(8 - (orderId.length % 8), 0)
  ]);
  
  return Buffer.concat([cipher.update(orderBytes), cipher.final()]);
}

/**
 * Genera la firma HMAC SHA256
 * @param {string} merchantParameters - Parámetros en Base64
 * @param {Buffer} key - Clave de cifrado
 * @returns {string} - Firma en Base64
 */
function generateSignature(merchantParameters, key) {
  const hmac = crypto.createHmac('sha256', key);
  hmac.update(merchantParameters);
  return hmac.digest('base64');
}

/**
 * Crea los parámetros para una transacción de Redsys
 * @param {Object} paymentData - Datos del pago
 * @param {string} paymentData.orderId - ID de la orden (único, 4-12 caracteres)
 * @param {number} paymentData.amount - Cantidad en euros
 * @param {string} paymentData.metodoPago - Método de pago: 'tarjeta' o 'bizum'
 * @param {string} paymentData.description - Descripción del pago
 * @param {string} paymentData.urlOk - URL de retorno si el pago es exitoso
 * @param {string} paymentData.urlKo - URL de retorno si el pago falla
 * @param {string} paymentData.urlNotification - URL para notificaciones
 * @param {string} paymentData.customerEmail - Email del cliente
 * @param {string} paymentData.customerName - Nombre del cliente
 * @returns {Object} - Parámetros firmados para Redsys
 */
export function createRedsysPayment(paymentData) {
  const {
    orderId,
    amount,
    metodoPago,
    description,
    urlOk,
    urlKo,
    urlNotification,
    customerEmail,
    customerName
  } = paymentData;

  // Validar orderId (debe ser único y tener entre 4 y 12 caracteres)
  if (!orderId || orderId.length < 4 || orderId.length > 12) {
    throw new Error('Order ID debe tener entre 4 y 12 caracteres');
  }

  // Convertir cantidad a céntimos (Redsys espera la cantidad en céntimos)
  const amountInCents = Math.round(amount * 100).toString();

  // Construir objeto de parámetros del comercio
  const merchantParameters = {
    DS_MERCHANT_AMOUNT: amountInCents,
    DS_MERCHANT_ORDER: orderId,
    DS_MERCHANT_MERCHANTCODE: CONFIG.merchantCode,
    DS_MERCHANT_CURRENCY: CONFIG.currency,
    DS_MERCHANT_TRANSACTIONTYPE: '0', // 0 = Autorización
    DS_MERCHANT_TERMINAL: CONFIG.terminal,
    DS_MERCHANT_MERCHANTURL: urlNotification,
    DS_MERCHANT_URLOK: urlOk,
    DS_MERCHANT_URLKO: urlKo,
    DS_MERCHANT_PRODUCTDESCRIPTION: description,
    DS_MERCHANT_CONSUMERLANGUAGE: '001', // 001 = Español
    DS_MERCHANT_MERCHANTNAME: 'Amets Goien',
  };

  // Añadir datos del titular si están disponibles
  if (customerEmail) {
    merchantParameters.DS_MERCHANT_TITULAR = customerEmail;
  }

  // Configurar método de pago específico
  // El usuario ya eligió en el frontend, así que restringimos a ese método:
  // 'C' = Solo tarjeta
  // 'z' = Solo Bizum
  if (metodoPago === 'tarjeta') {
    merchantParameters.Ds_Merchant_Paymethods = 'C';
  } else if (metodoPago === 'bizum') {
    merchantParameters.Ds_Merchant_Paymethods = 'z';
  }
  // Si no se especifica, Redsys mostrará todas las opciones (por si acaso)

  // Convertir a JSON y luego a Base64
  const merchantParamsJSON = JSON.stringify(merchantParameters);
  const merchantParamsBase64 = Buffer.from(merchantParamsJSON, 'utf8').toString('base64');

  // Generar firma
  const key = generate3DESKey(orderId);
  const signature = generateSignature(merchantParamsBase64, key);

  return {
    Ds_SignatureVersion: 'HMAC_SHA256_V1',
    Ds_MerchantParameters: merchantParamsBase64,
    Ds_Signature: signature,
    redsysUrl: CONFIG.url,
    merchantParameters: merchantParameters // Para debugging
  };
}

/**
 * Verifica la firma de la respuesta de Redsys
 * @param {string} merchantParamsBase64 - Parámetros en Base64 de la respuesta
 * @param {string} signatureReceived - Firma recibida de Redsys
 * @returns {Object} - { valid: boolean, params: Object }
 */
export function verifyRedsysResponse(merchantParamsBase64, signatureReceived) {
  try {
    // Decodificar parámetros
    const merchantParamsJSON = Buffer.from(merchantParamsBase64, 'base64').toString('utf8');
    const params = JSON.parse(merchantParamsJSON);

    // Generar clave y firma esperada
    const orderId = params.Ds_Order;
    const key = generate3DESKey(orderId);
    const expectedSignature = generateSignature(merchantParamsBase64, key);

    // Convertir firma recibida de Base64 URL-safe a Base64 estándar
    // Redsys envía la firma en formato URL-safe donde:
    // - '_' reemplaza a '/'
    // - '-' reemplaza a '+'
    const signatureStandard = signatureReceived
      .replace(/_/g, '/')
      .replace(/-/g, '+');

    // Comparar firmas
    const valid = expectedSignature === signatureStandard;

    return {
      valid,
      params,
      expectedSignature,
      receivedSignature: signatureStandard
    };
  } catch (error) {
    console.error('Error verificando respuesta de Redsys:', error);
    return {
      valid: false,
      error: error.message
    };
  }
}

/**
 * Genera un ID de orden único
 * @param {string} prefix - Prefijo opcional (máx 4 caracteres)
 * @returns {string} - ID de orden único (12 caracteres)
 */
export function generateOrderId(prefix = 'DON') {
  // Generar timestamp + random para garantizar unicidad
  const timestamp = Date.now().toString().slice(-6); // Últimos 6 dígitos del timestamp
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  // Formato: PREFIJO + 6 dígitos timestamp + 3 dígitos random = 12 caracteres máximo
  const orderId = `${prefix}${timestamp}${random}`;
  
  // Asegurar que no excede 12 caracteres
  return orderId.slice(0, 12);
}

/**
 * Decodifica los parámetros de Redsys
 * @param {string} merchantParamsBase64 - Parámetros en Base64
 * @returns {Object} - Parámetros decodificados
 */
export function decodeRedsysParams(merchantParamsBase64) {
  try {
    const merchantParamsJSON = Buffer.from(merchantParamsBase64, 'base64').toString('utf8');
    return JSON.parse(merchantParamsJSON);
  } catch (error) {
    console.error('Error decodificando parámetros de Redsys:', error);
    return null;
  }
}

/**
 * Obtiene el código de respuesta con su descripción
 * @param {string} responseCode - Código de respuesta de Redsys
 * @returns {Object} - { code, success, message }
 */
export function getResponseCodeInfo(responseCode) {
  // Códigos de autorización exitosa
  const successCodes = [
    '0000', '0900' // Transacción autorizada
  ];

  const isSuccess = successCodes.includes(responseCode);

  // Mensajes comunes
  const messages = {
    '0000': 'Transacción autorizada para pagos y preautorizaciones',
    '0900': 'Transacción autorizada para devoluciones y confirmaciones',
    '0101': 'Tarjeta caducada',
    '0102': 'Tarjeta bloqueada temporalmente',
    '0106': 'Número de intentos de PIN excedido',
    '0125': 'Tarjeta no efectiva',
    '0129': 'Código de seguridad (CVV2/CVC2) incorrecto',
    '0180': 'Tarjeta ajena al servicio',
    '0184': 'Error en la autenticación del titular',
    '0190': 'Denegación del emisor sin especificar motivo',
    '0191': 'Fecha de caducidad errónea',
    '0202': 'Tarjeta bloqueada temporalmente',
    '0904': 'Comercio no registrado',
    '0909': 'Error de sistema',
    '0913': 'Pedido repetido',
    '0944': 'Sesión incorrecta',
    '0950': 'Operación de devolución no permitida',
    '9915': 'Operación cancelada por el usuario',
    '9928': 'Operación cancelada por el titular',
    '9929': 'Operación rechazada por el módulo de fraude',
  };

  return {
    code: responseCode,
    success: isSuccess,
    message: messages[responseCode] || `Código de respuesta: ${responseCode}`
  };
}

export default {
  createRedsysPayment,
  verifyRedsysResponse,
  generateOrderId,
  decodeRedsysParams,
  getResponseCodeInfo
};
