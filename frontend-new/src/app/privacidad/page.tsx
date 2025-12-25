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

      <main className="min-h-screen pt-24 px-4 md:px-8 lg:px-16 bg-[#F5ECE6]">
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
                <p>
                  El responsable del tratamiento de los datos personales recabados a través de este sitio web es la asociación <strong>AMETS GOIEN</strong>, entidad sin ánimo de lucro dedicada al acompañamiento social y comunitario.
                </p>
                <p className="mt-2">
                  Para cualquier cuestión relacionada con la protección de datos personales, puedes contactar a través del correo electrónico facilitado en esta web.
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
                  A través del formulario de contacto se podrán recabar los siguientes datos personales:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>Nombre y apellidos</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Contenido del mensaje o consulta</li>
                </ul>
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
                  <li>Mantener comunicaciones relacionadas con la actividad de AMETS GOIEN, cuando el usuario lo haya autorizado expresamente.</li>
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
                <p>
                  Los datos no serán cedidos a terceros, salvo obligación legal. No obstante, para la correcta prestación del servicio, AMETS GOIEN podrá utilizar proveedores externos que actúan como encargados del tratamiento (por ejemplo, servicios de envío de correo electrónico o alojamiento web), con los que se han adoptado las garantías exigidas por la normativa vigente.
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
                  AMETS GOIEN adopta las medidas técnicas y organizativas necesarias para garantizar un nivel de seguridad adecuado al riesgo, evitando la pérdida, alteración, acceso no autorizado o divulgación indebida de los datos personales.
                </p>
              </section>

              {/* 10 */}
              <section>
                <h2 className="text-2xl font-bold mb-3 text-[#8A4D76]">
                  10. Modificaciones de la política
                </h2>
                <p>
                  AMETS GOIEN se reserva el derecho a modificar la presente política de privacidad para adaptarla a cambios legislativos o a nuevos tratamientos de datos. Cualquier modificación será publicada en esta misma página.
                </p>
              </section>

              <div className="mt-10 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Última actualización:</strong> Diciembre 2025
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
