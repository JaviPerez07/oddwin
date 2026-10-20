import Link from "next/link";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { Container } from "@/components/editorial/container";
import { Mark } from "@/components/editorial/status";
import { SlotCover } from "@/components/slots/slot-cover";
import { getProviders, getSlots } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Estudios — Proveedores de slots del catálogo",
  description: "Los estudios cuyos juegos hemos analizado y sus mecánicas más características.",
  path: "/providers",
});

export default async function ProvidersPage() {
  const [providers, slots] = await Promise.all([getProviders(), getSlots()]);
  return (
    <Container className="pt-5">
      <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Estudios", path: "/providers" }]} />
      <header className="mt-6 max-w-3xl">
        <p className="label text-accent">Estudios del catálogo</p>
        <h1 className="headline mt-2 text-[2.4rem] sm:text-[3rem]">Quién está detrás de cada juego</h1>
        <p className="mt-3 text-[1.2rem] leading-snug text-fg-2">
          Cada estudio tiene sus preferencias: motores a los que vuelve y estructuras de bonus que perfecciona. Conocerlo ayuda a entender el juego desde el primer giro.
        </p>
      </header>
      <ol className="mt-10 border-t border-line">
        {providers.map((p, i) => {
          const theirs = slots.filter((s) => s.providerId === p.id);
          return (
            <li key={p.id} className="grid gap-4 border-b border-line py-6 md:grid-cols-[2rem_minmax(0,1fr)_minmax(0,1.2fr)] md:gap-8">
              <span className="figure text-sm text-fg-3">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="headline text-[1.8rem]">
                  <Link href={`/providers/${p.slug}`} className="hover:text-accent">
                    {p.name}
                  </Link>
                </h2>
                <p className="mt-2 leading-snug text-fg-2">{p.description}</p>
                <p className="ui mt-3 text-sm">
                  <Link href={`/providers/${p.slug}`} className="font-semibold text-accent hover:underline">
                    Ficha del estudio →
                  </Link>
                  {p.officialWebsite.value ? (
                    <span className="ml-4 text-fg-3">
                      {new URL(p.officialWebsite.value).hostname}
                      <Mark status={p.officialWebsite.status} />
                    </span>
                  ) : null}
                </p>
              </div>
              <ul className="grid grid-cols-3 gap-3">
                {theirs.map((s) => (
                  <li key={s.id}>
                    <Link href={`/slots/${s.slug}`} className="group block">
                      <SlotCover artwork={s.artwork} name={s.name} aspect="4/3" size="sm" sizes="200px" />
                      <span className="mt-2 block text-sm font-semibold group-hover:text-accent">{s.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </Container>
  );
}
