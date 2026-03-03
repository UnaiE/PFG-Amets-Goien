/**
 * @file verify-webhook-config.js
 * @description Verifica la configuración del webhook de Redsys
 * 
 * Este script:
 * 1. Verifica que BACKEND_URL esté configurado correctamente
 * 2. Comprueba que NO sea localhost
 * 3. Intenta hacer ping al endpoint del webhook
 * 4. Muestra la URL exacta que debería recibir Redsys
 */

console.log('\n' + '═'.repeat(70));
console.log('🔍 VERIFICACIÓN DE CONFIGURACIÓN DEL WEBHOOK');
console.log('═'.repeat(70));

// 1. Verificar BACKEND_URL
console.log('\n1️⃣  Verificando BACKEND_URL...\n');

const backendUrl = process.env.BACKEND_URL;

if (!backendUrl) {
  console.error('❌ ERROR: La variable BACKEND_URL no está definida');
  console.log('\n💡 Solución:');
  console.log('   En Railway, ve a Variables de Entorno y añade:');
  console.log('   BACKEND_URL=https://tu-app.railway.app');
  console.log('   (Reemplaza con tu URL real de Railway)');
  process.exit(1);
}

console.log(`✅ BACKEND_URL definida: ${backendUrl}`);

// 2. Verificar que NO sea localhost
console.log('\n2️⃣  Verificando que NO sea localhost...\n');

const isLocalhost = backendUrl.includes('localhost') || 
                    backendUrl.includes('127.0.0.1') ||
                    backendUrl.includes('0.0.0.0');

if (isLocalhost) {
  console.error('❌ ERROR CRÍTICO: BACKEND_URL apunta a localhost');
  console.log('\n🚨 PROBLEMA:');
  console.log('   Redsys no puede alcanzar localhost desde internet.');
  console.log('   Por eso el webhook nunca se ejecuta.');
  console.log('\n💡 Solución:');
  console.log('   En Railway, actualiza BACKEND_URL con tu URL pública:');
  console.log('   BACKEND_URL=https://tu-app.railway.app');
  console.log('   (Busca tu URL en el dashboard de Railway)');
  process.exit(1);
}

console.log('✅ No es localhost - correcto para producción');

// 3. Verificar protocolo HTTPS
console.log('\n3️⃣  Verificando protocolo HTTPS...\n');

if (!backendUrl.startsWith('https://')) {
  console.warn('⚠️  ADVERTENCIA: BACKEND_URL no usa HTTPS');
  console.log('   Redsys requiere HTTPS en producción.');
  console.log('   Asegúrate de usar https:// en tu URL.');
} else {
  console.log('✅ Usa HTTPS - correcto para Redsys');
}

// 4. Mostrar URL del webhook completa
console.log('\n4️⃣  URL del webhook que recibirá Redsys:\n');

const webhookUrl = `${backendUrl}/api/payment/redsys/notification`;
console.log(`   ${webhookUrl}`);

// 5. Probar accesibilidad del endpoint
console.log('\n5️⃣  Probando accesibilidad del endpoint...\n');

try {
  const response = await fetch(webhookUrl, {
    method: 'GET', // Intentar GET primero para ver si el servidor responde
  });
  
  console.log(`✅ Endpoint respondió con status: ${response.status}`);
  
  if (response.status === 404) {
    console.log('   ℹ️  404 es normal si el endpoint solo acepta POST');
    console.log('   El servidor está accesible desde internet.');
  } else if (response.status === 200) {
    console.log('   ✅ El servidor está accesible y respondió OK');
  } else {
    console.log(`   ℹ️  Status ${response.status} - el servidor responde pero con error`);
    console.log('   Esto es normal si el endpoint requiere datos específicos.');
  }
  
  // Intentar POST con datos vacíos
  console.log('\n6️⃣  Probando con POST (sin parámetros válidos)...\n');
  
  const postResponse = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'test=1'
  });
  
  console.log(`   Respuesta POST: ${postResponse.status}`);
  
  if (postResponse.status === 400) {
    console.log('   ✅ 400 Bad Request es CORRECTO - el webhook está funcionando');
    console.log('   (Rechaza la petición porque falta Ds_MerchantParameters)');
  } else if (postResponse.status === 200) {
    console.log('   ⚠️  200 OK - inesperado, debería rechazar peticiones sin firma');
  } else {
    console.log(`   ℹ️  Status ${postResponse.status} - revisar logs del servidor`);
  }
  
} catch (error) {
  console.error('\n❌ ERROR: No se puede alcanzar el endpoint');
  console.error(`   ${error.message}`);
  console.log('\n🚨 PROBLEMA:');
  console.log('   El webhook no es accesible desde internet.');
  console.log('\n💡 Posibles causas:');
  console.log('   1. BACKEND_URL incorrecta (no coincide con tu deployment)');
  console.log('   2. El servidor de Railway no está corriendo');
  console.log('   3. El dominio no existe o no resuelve');
  console.log('\n🔧 Verifica en Railway:');
  console.log('   - Ve a tu servicio backend');
  console.log('   - Busca "Domains" o "Public URL"');
  console.log('   - Copia la URL exacta y úsala en BACKEND_URL');
  process.exit(1);
}

// Resumen final
console.log('\n' + '═'.repeat(70));
console.log('📋 RESUMEN DE CONFIGURACIÓN');
console.log('═'.repeat(70));
console.log(`\nBackend URL: ${backendUrl}`);
console.log(`Webhook URL: ${webhookUrl}`);
console.log('\n✅ Configuración correcta para recibir webhooks de Redsys');
console.log('\n💡 IMPORTANTE:');
console.log('   Redsys en modo TEST puede NO enviar webhooks automáticamente.');
console.log('   Algunas entidades requieren configuración manual del webhook');
console.log('   en el panel de Redsys.');
console.log('\n🔗 Para verificar en Redsys:');
console.log('   1. Accede al panel de Redsys (admin)');
console.log('   2. Ve a "Configuración" > "TPV Virtual"');
console.log('   3. Verifica que la URL de notificación esté configurada:');
console.log(`      ${webhookUrl}`);
console.log('\n' + '═'.repeat(70) + '\n');
