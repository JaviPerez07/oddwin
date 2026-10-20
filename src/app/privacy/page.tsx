import { LegalPage } from "@/components/editorial/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Privacidad", description: "Qué datos guarda OddWin Studios sobre sus visitantes y con qué finalidad.", path: "/privacy" });

export default function PrivacyPage() {
  return (
    <LegalPage label="Legal" title="Privacidad" intro="Recogemos los datos mínimos. Aquí explicamos qué hace actualmente la web." path="/privacy" updated="2026-10-20" draft>
      <section>
        <h2>En tu dispositivo</h2>
        <ul>
          <li>Guardamos el mercado que eliges en el almacenamiento local de tu navegador para recordarlo. No nos lo envía.</li>
          <li>Si activamos la analítica y la aceptas, tu elección de consentimiento se guarda del mismo modo.</li>
        </ul>
      </section>
      <section>
        <h2>Analítica</h2>
        <p>
          La analítica está desactivada por defecto. Si se configura, no envía datos hasta que aceptas. Solo registra visitas, búsquedas, uso de filtros y clics de salida, sin cookies.
        </p>
      </section>
      <section>
        <h2>Clics de salida</h2>
        <p>Si existen listados comerciales, solo se registra la oferta, el mercado y la hora del clic.</p>
      </section>
      <section>
        <h2>Registros del alojamiento</h2>
        <p>Cloudflare aloja esta web y puede procesar registros técnicos para prestar y proteger el servicio. Los plazos de conservación dependen de su configuración y sus condiciones de privacidad.</p>
      </section>
    </LegalPage>
  );
}
