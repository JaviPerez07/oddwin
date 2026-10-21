import { LegalPage } from "@/components/editorial/legal-page";
import { responsibleMessage, spanishHelp } from "@/config/editorial";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Juego responsable", description: "Ayuda en España: Jugar Bien, FEJAR y autoexclusión mediante el RGIAJ de la DGOJ.", path: "/responsible-gambling" });

export default function ResponsibleGamblingPage() {
  return (
    <LegalPage label="Criterios editoriales" title="Juego responsable" intro="+18 | Juega con responsabilidad" path="/responsible-gambling" updated="2026-10-21">
      <p>{responsibleMessage}</p>
      <section>
        <h2>Datos que conviene recordar</h2>
        <ul>
          <li>Las tragaperras tienen ventaja matemática para el operador a largo plazo. No son una forma de obtener ingresos.</li>
          <li>Cada giro es independiente. Ningún juego está «a punto» de pagar.</li>
          <li>El RTP es una media a largo plazo y no predice una sesión.</li>
          <li>Ninguna estrategia, patrón u horario cambia las probabilidades de una tragaperras.</li>
          <li>No arriesgues dinero que necesitas. Intentar recuperar las pérdidas puede aumentarlas.</li>
        </ul>
      </section>
      <section>
        <h2>Ayuda y autoexclusión en España</h2>
        <ul>
          {spanishHelp.map((help) => (
            <li key={help.url}>
              <a href={help.url} target="_blank" rel="noopener noreferrer">{help.name}</a> — {help.description}
              {help.phone ? <> <a href="tel:900200225">Llamar al 900 200 225</a></> : null}
            </li>
          ))}
        </ul>
        <p>El RGIAJ permite solicitar la prohibición de acceso a los juegos que requieren identificación previa, incluido el juego en línea. Consulta en la página oficial los trámites, el alcance y las condiciones de inscripción.</p>
      </section>
      <section>
        <h2>Prohibido a menores de 18 años</h2>
        <p>La sección editorial y el contenido comercial se dirigen exclusivamente a personas adultas en España. Una selección de mercado no acredita la edad ni la elegibilidad para jugar.</p>
      </section>
    </LegalPage>
  );
}
