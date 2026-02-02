/**
 * @file PrivacidadPage - Página de Política de Privacidad
 * @route /privacidad
 * @description Política de privacidad GDPR con información sobre tratamiento de datos personales
 */
"use client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacidadPage() {
  const router = useRouter();

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-24 px-4 md:px-8 lg:px-16 bg-[#E8D5F2]">
        <div className="max-w-4xl mx-auto py-12">
          <button
            onClick={() => router.back()}
            className="mb-6 px-6 py-2 rounded-full bg-white text-[#8A4D76] font-semibold hover:shadow-md transition-all"
          >
            ← Volver
          </button>

          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-gray-200">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-[#8A4D76]">
              Política de Privacidad
            </h1>

            <div className="space-y-8 text-gray-700 leading-relaxed">

              {/* 1 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  1. Responsable del tratamiento
                </h2>
                <p className="mb-3">
                  El responsable del tratamiento de los datos personales recabados a través de este sitio web es la asociación <strong>AMETSGOIEN</strong>, entidad sin ánimo de lucro dedicada al acompañamiento social y comunitario.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-[#8A4D76]">
                  <p className="text-sm mb-1"><strong>Denominación:</strong> Asociación AMETSGOIEN PARA LA ACOGIDA Y LA INTEGRACIÓN SOCICULTURAL</p>
                  <p className="text-sm mb-1"><strong>CIF:</strong> [G23919251]</p>
                  <p className="text-sm mb-1"><strong>Dirección:</strong> CL/ BURGOS, 4-1 48460, ORDUÑA, BIZKAIA, España</p>
                  <p className="text-sm mb-1"><strong>Email:</strong> ametsgoien@gmail.com</p>
                  <p className="text-sm"><strong>Teléfono:</strong> +34 697 858 343</p>
                </div>
                <p className="mt-3">
                  Para cualquier cuestión relacionada con la protección de datos personales, puedes contactar a través de los medios facilitados arriba.
                </p>
              </section>

              {/* 2 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  2. Marco legal aplicable
                </h2>
                <p>
                  El tratamiento de los datos personales se realiza conforme a lo dispuesto en el Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (Reglamento General de Protección de Datos – RGPD), así como en la Ley Orgánica 3/2018, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD).
                </p>
              </section>

              {/* 3 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  3. Datos personales tratados
                </h2>
                <p>
                  A través de este sitio web se podrán recabar los siguientes datos personales:
                </p>
                <div className="mt-3 space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Formulario de contacto:</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                      <li>Nombre y apellidos</li>
                      <li>Dirección de correo electrónico</li>
                      <li>Contenido del mensaje o consulta</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Donaciones y colaboraciones:</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                      <li>Nombre y apellidos</li>
                      <li>Email</li>
                      <li>Teléfono (opcional)</li>
                      <li>Dirección (opcional)</li>
                      <li>Datos de pago procesados por <strong>Stripe</strong> (tarjeta bancaria)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* 4 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  4. Finalidad del tratamiento
                </h2>
                <p>
                  Los datos personales facilitados serán tratados exclusivamente para las siguientes finalidades:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Responder a consultas o solicitudes de información.</li>
                  <li>Gestionar solicitudes de colaboración o contacto con la entidad.</li>
                  <li>Mantener comunicaciones relacionadas con la actividad de AMETSGOIEN, cuando el usuario lo haya autorizado expresamente.</li>
                </ul>
              </section>

              {/* 5 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  5. Base jurídica del tratamiento
                </h2>
                <p>
                  La base legal para el tratamiento de los datos es el consentimiento expreso del usuario, otorgado al enviar el formulario de contacto y aceptar la presente política de privacidad.
                </p>
              </section>

              {/* 6 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  6. Conservación de los datos
                </h2>
                <p>
                  Los datos personales se conservarán únicamente durante el tiempo necesario para atender la consulta realizada y, posteriormente, durante los plazos legalmente exigidos para el cumplimiento de posibles obligaciones legales.
                </p>
              </section>

              {/* 7 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  7. Destinatarios y encargados de tratamiento
                </h2>
                <p className="mb-3">
                  Los datos no serán cedidos a terceros, salvo obligación legal. No obstante, para la correcta prestación del servicio, AMETSGOIEN utiliza los siguientes proveedores externos que actúan como encargados del tratamiento:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2 text-gray-700">
                  <li><strong>Stripe</strong> (procesamiento de pagos): Los datos de pago se procesan de forma segura a través de Stripe, Inc., que cumple con el estándar PCI-DSS. AMETSGOIEN no almacena datos completos de tarjetas bancarias. Más información en <a href="https://stripe.com/es/privacy" target="_blank" rel="noopener noreferrer" className="text-[#8A4D76] hover:underline">stripe.com/privacy</a></li>
                  <li><strong>Servicio de hosting web</strong>: Para el alojamiento del sitio web</li>
                  <li><strong>Servicio de email</strong>: Para el envío de confirmaciones y comunicaciones</li>
                </ul>
                <p className="mt-3">
                  Con todos los proveedores se han adoptado las garantías exigidas por la normativa vigente mediante acuerdos de confidencialidad y cláusulas contractuales.
                </p>
              </section>

              {/* 8 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  8. Derechos de las personas interesadas
                </h2>
                <p>
                  El usuario puede ejercer en cualquier momento los siguientes derechos:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Acceso a sus datos personales</li>
                  <li>Rectificación de datos inexactos</li>
                  <li>Supresión de sus datos</li>
                  <li>Oposición al tratamiento</li>
                  <li>Limitación del tratamiento</li>
                  <li>Portabilidad de los datos</li>
                </ul>
                <p className="mt-3">
                  Asimismo, tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) a través de su sitio web: <strong>www.aepd.es</strong>.
                </p>
              </section>

              {/* 9 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  9. Medidas de seguridad
                </h2>
                <p>
                  AMETSGOIEN adopta las medidas técnicas y organizativas necesarias para garantizar un nivel de seguridad adecuado al riesgo, evitando la pérdida, alteración, acceso no autorizado o divulgación indebida de los datos personales.
                </p>
              </section>

              {/* 10 */}
              <section id="reembolsos">
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  10. Política de reembolsos y cancelaciones
                </h2>
                <p className="mb-3">
                  Las donaciones realizadas a AMETSGOIEN son contribuciones voluntarias destinadas a financiar proyectos de acogida y acompañamiento social.
                </p>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Donaciones puntuales:</h3>
                    <p className="text-gray-700">
                      Una vez procesada la donación, esta es definitiva. Si detectas un error en tu donación, contacta con nosotros en <strong>ametsgoien@gmail.com</strong> en un plazo de 48 horas y evaluaremos tu caso de forma individualizada.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Donaciones recurrentes (suscripciones):</h3>
                    <p className="text-gray-700 mb-2">
                      Puedes cancelar tu suscripción en cualquier momento sin coste adicional. Para ello:
                    </p>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
                      <li>Accede al enlace de gestión enviado en el email de confirmación</li>
                      <li>O contacta con nosotros en ametsgoien@gmail.com</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                      La cancelación será efectiva desde el siguiente periodo de facturación. Las cantidades ya abonadas no son reembolsables.
                    </p>
                  </div>
                </div>
              </section>

              {/* 11 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  11. Modificaciones de la política
                </h2>
                <p>
                  AMETSGOIEN se reserva el derecho a modificar la presente política de privacidad para adaptarla a cambios legislativos o a nuevos tratamientos de datos. Cualquier modificación será publicada en esta misma página.
                </p>
              </section>

              <div className="mt-10 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Última actualización:</strong> Enero 2026
                </p>
                <p className="text-sm text-gray-600">
                  Para consultas sobre política de privacidad, reembolsos o gestión de suscripciones, contacta: <strong>ametsgoien@gmail.com</strong>
                </p>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
