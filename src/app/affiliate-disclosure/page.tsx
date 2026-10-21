import { affiliateDisclosure } from "@/config/editorial";
import { LegalPage } from "@/components/editorial/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Información sobre afiliación", description: "Estado de afiliación, criterios para verificar casinos y separación entre relaciones comerciales y análisis editorial.", path: "/affiliate-disclosure" });

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage label="Criterios editoriales" title="Información sobre afiliación" intro="Oddwin Studios desarrolla juegos de casino originales y publica una revista de slots. Si se aprueban ofertas de afiliación, indicaremos claramente las relaciones comerciales." path="/affiliate-disclosure" updated="2026-10-21">
      <p>{affiliateDisclosure}</p>
      <section>
        <h2>Estado actual</h2>
        <p>Ningún programa de afiliación ha aprobado esta web y no hay operadores publicados. Ningún enlace genera ingresos actualmente. Los juegos del estudio se presentan como creaciones propias en desarrollo (AURA, Obsidian y Dead Air), excluidas de los rankings editoriales, sin constituir recomendaciones independientes ni ofertas de casino.</p>
      </section>
      <section>
        <h2>Cómo funcionarían los listados</h2>
        <ul>
          <li>Los bloques comerciales llevan la etiqueta «Comercial» y están separados del análisis editorial.</li>
          <li>Solo promocionamos operadores cuya licencia española se haya confirmado en el registro de la DGOJ.</li>
          <li>Los enlaces pasan por una redirección en nuestro dominio que comprueba, al hacer clic, que la oferta sigue aprobada, vigente y válida para tu mercado. El destino procede exclusivamente de nuestros registros.</li>
          <li>Los enlaces muestran «Enlace de afiliado» e incluyen <code>rel=&quot;sponsored noopener&quot;</code>.</li>
          <li>La comisión nunca determina el orden ni qué juegos analizamos.</li>
        </ul>
      </section>
      <section>
        <h2>Qué registramos al hacer clic</h2>
        <p>La oferta, el mercado y la hora. Sin dirección IP, huella del dispositivo ni cookies.</p>
      </section>
    </LegalPage>
  );
}
