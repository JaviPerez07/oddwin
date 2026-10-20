import { LegalPage } from "@/components/editorial/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Condiciones de uso", description: "Condiciones para utilizar la web de OddWin Studios.", path: "/terms" });

export default function TermsPage() {
  return (
    <LegalPage label="Legal" title="Condiciones de uso" intro="Esta web ofrece información editorial y general. No constituye asesoramiento financiero ni una invitación a jugar." path="/terms" updated="2026-10-20" draft>
      <section>
        <h2>Precisión</h2>
        <p>
          Indicamos el estado de verificación de cada cifra, pero los juegos cambian y los operadores los configuran de forma distinta. Consulta siempre la pantalla de información del juego.
        </p>
      </section>
      <section>
        <h2>Edad y ubicación</h2>
        <p>La web se dirige a adultos. Debes comprobar la legalidad del juego en tu ubicación. Las notas de mercado son una referencia inicial, sin constituir asesoramiento jurídico.</p>
      </section>
      <section>
        <h2>Contenido</h2>
        <p>Los textos y diagramas son propios. Los nombres y marcas pertenecen a sus titulares y se utilizan para identificar los juegos analizados.</p>
      </section>
    </LegalPage>
  );
}
