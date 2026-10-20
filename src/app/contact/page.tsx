import Link from "next/link";
import { LegalPage } from "@/components/editorial/legal-page";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Contacta con OddWin Studios", description: "Contacta con Oddwin Studios para edición, desarrollo, producción creativa, correcciones editoriales o fuentes.", path: "/contact" });

export default function ContactPage() {
  return (
    <LegalPage label="Contacto" title="Hablemos de tu proyecto" intro="Cuéntanos qué quieres crear, en qué mercados y qué tipo de colaboración tienes en mente." path="/contact" updated="2026-10-20">
      <section>
        <h2>Edición y producción</h2>
        {site.contactEmail ? (
          <p>
            Escríbenos a <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> con una breve descripción. Podemos hablar de juegos originales, apoyo al desarrollo, tráilers, animación y requisitos de colaboración.
          </p>
        ) : (
          <p>Aún no se ha configurado una dirección pública de contacto.</p>
        )}
      </section>
      <section>
        <h2>Correcciones editoriales</h2>
        <p>Para proponer una corrección o una fuente, incluye la página, el dato concreto y, si es posible, un enlace a la documentación del proveedor.</p>
      </section>
      <section>
        <h2>Programas de casino</h2>
        <p>Nuestro directorio de afiliación aún no está activo. Revisamos las solicitudes según los criterios del <Link href="/casinos">directorio de casinos</Link>; no activamos enlaces hasta verificar la oferta y el mercado.</p>
      </section>
    </LegalPage>
  );
}
