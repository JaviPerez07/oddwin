import Link from "next/link";
import { LegalPage } from "@/components/editorial/legal-page";
import { internationalHelp, markets } from "@/data/markets";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Juego responsable", description: "Recursos de ayuda, sistemas de autoexclusión por mercado e información sobre cómo funcionan las slots.", path: "/responsible-gambling" });

export default function ResponsibleGamblingPage() {
  return (
    <LegalPage label="Criterios editoriales" title="Juego responsable" intro="Las slots están diseñadas con ventaja para el operador a largo plazo. No arriesgues dinero que necesitas y detente si jugar deja de ser una actividad de ocio." path="/responsible-gambling" updated="2026-10-20">
      <section>
        <h2>Datos que conviene recordar</h2>
        <ul>
          <li>Cada giro es independiente. Ningún juego está «a punto» de pagar.</li>
          <li>El RTP es una media a largo plazo y no predice una sesión.</li>
          <li>Ninguna estrategia, patrón u horario cambia las probabilidades de una slot.</li>
          <li>Intentar recuperar las pérdidas suele aumentarlas.</li>
        </ul>
      </section>
      <section>
        <h2>Ayuda gratuita y confidencial</h2>
        <ul>
          {internationalHelp.map((h) => (
            <li key={h.url}>
              <a href={h.url} target="_blank" rel="noopener noreferrer">{h.name}</a> — {h.description}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Autoexclusión por mercado</h2>
        <ul>
          {markets.filter((m) => m.selfExclusion).map((m) => (
            <li key={m.code}>
              <strong>{m.countryName}:</strong>{" "}
              <a href={m.selfExclusion!.url} target="_blank" rel="noopener noreferrer">{m.selfExclusion!.name}</a> — {m.selfExclusion!.description}{" "}
              <Link href={`/markets/${m.code}`}>Notas del mercado</Link>
            </li>
          ))}
        </ul>
        <p>Estas referencias están pendientes de verificación con las páginas actuales de cada regulador. Confirma siempre la información en la web oficial.</p>
      </section>
      <section>
        <h2>¿Menor de 18 años?</h2>
        <p>Esta web es solo para adultos. El juego está prohibido para menores en todos los mercados que cubrimos (19+ en Ontario).</p>
      </section>
    </LegalPage>
  );
}
