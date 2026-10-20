import { LegalPage } from "@/components/editorial/legal-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Cómo analizamos", description: "Cómo investiga OddWin Studios, verifica los datos de cada análisis y decide cuándo puede aparecer en buscadores.", path: "/methodology" });

export default function MethodologyPage() {
  return (
    <LegalPage label="Criterios editoriales" title="Cómo analizamos" intro="Cada cifra está respaldada por una fuente identificada y fechada o lleva una marca visible de su estado de verificación." path="/methodology" updated="2026-10-20">
      <section>
        <h2>Nuestras marcas de verificación</h2>
        <ul>
          <li><strong>Sin marca</strong> — verificado: confirmado en una fuente primaria o secundaria fiable, consultada por un editor y con fecha registrada.</li>
          <li><strong>Punto ámbar · Pendiente de verificación</strong> — tenemos una referencia, como un resultado de búsqueda o notas propias, pero aún no la hemos confirmado en la fuente original.</li>
          <li><strong>Círculo rojo · Fuentes contradictorias</strong> — las fuentes discrepan. Omitimos el dato hasta resolver la discrepancia y mostramos las referencias.</li>
          <li><strong>Círculo gris · Sin fuente</strong> — todavía no hay una fuente documentada para este campo.</li>
        </ul>
      </section>
      <section>
        <h2>Qué consideramos una fuente</h2>
        <p>
          Por orden de preferencia: página oficial y tabla de pagos del proveedor, registro público de un regulador y fuentes secundarias fiables. Cada análisis enumera sus fuentes, uso, tipo, resultado y fecha de consulta.
        </p>
      </section>
      <section>
        <h2>Versiones de RTP</h2>
        <p>
          Muchos juegos tienen varias configuraciones de RTP y el operador elige la disponible. Las mostramos por separado, sin combinarlas en una cifra. Comprueba siempre la pantalla de información del juego.
        </p>
      </section>
      <section>
        <h2>Cuándo publicamos un análisis</h2>
        <p>
          Un análisis solo se indexa en buscadores tras verificar el RTP, la volatilidad y el premio máximo, con aprobación editorial. Hasta entonces es visible con la marca «en verificación» y la directiva noindex. El código aplica esta regla automáticamente.
        </p>
      </section>
      <section>
        <h2>Qué no hacemos</h2>
        <ul>
          <li>Describir sesiones de juego que no hemos realizado.</li>
          <li>Publicar estrellas, puntuaciones o cantidades de reseñas que no hemos recopilado.</li>
          <li>Ordenar operadores según su comisión.</li>
          <li>Sugerir que una estrategia mejora los resultados del juego.</li>
        </ul>
      </section>
    </LegalPage>
  );
}
