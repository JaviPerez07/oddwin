import Link from "next/link";
import { LegalPage } from "@/components/editorial/legal-page";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: `Sobre ${site.name}`, description: `Conoce ${site.name}, sus proyectos originales, sus servicios y sus criterios editoriales.`, path: "/about" });

export default function AboutPage() {
  return (
    <LegalPage label="El estudio" title={`Sobre ${site.name}`} intro="Un estudio independiente que crea conceptos de casino originales y producción cinematográfica para empresas del sector." path="/about" updated="2026-10-20">
      <section>
        <h2>Quiénes somos</h2>
        <p>
          {site.name} es un estudio independiente fundado por Javi Pérez y Nico. No se presenta como operador con licencia, proveedor certificado o sociedad constituida salvo confirmación expresa de ese estado.
        </p>
      </section>
      <section>
        <h2>Qué hacemos</h2>
        <p>
          Desarrollamos conceptos originales de slots y ofrecemos producción para juegos y campañas. Puedes ver nuestros proyectos en el <Link href="/games">catálogo de juegos</Link>; están en desarrollo y no se presentan como juegos certificados ni lanzados con dinero real.
        </p>
      </section>
      <section>
        <h2>Nuestras páginas editoriales</h2>
        <p>
          La revista de slots es una sección editorial de la web. Indicamos el estado de verificación de cada dato y cualquier relación comercial. Nuestros juegos no figuran como recomendaciones independientes. Consulta <Link href="/methodology">cómo analizamos</Link>.
        </p>
      </section>
      <section>
        <h2>Estado de afiliación a casinos</h2>
        <p>
          Estamos pendientes de la aprobación de los programas de afiliación. No hay ofertas ni enlaces de seguimiento activos. Si esto cambia, indicaremos la relación comercial, verificaremos los mercados y actualizaremos nuestra <Link href="/affiliate-disclosure">información sobre afiliación</Link>.
        </p>
      </section>
      <section>
        <h2>Material gráfico</h2>
        <p>
          Solo mostramos arte oficial con permiso de su titular. Cuando falta ese permiso, presentamos el nombre del juego y el estudio en un panel sencillo, con diagramas explicativos de sus mecánicas, sin imitar su arte.
        </p>
      </section>
    </LegalPage>
  );
}
