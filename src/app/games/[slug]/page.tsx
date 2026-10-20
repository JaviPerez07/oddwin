import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clapperboard } from "lucide-react";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { Container } from "@/components/editorial/container";
import { studioProjects } from "@/data/studio-projects";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return studioProjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/games/[slug]">) {
  const { slug } = await params;
  const project = studioProjects.find((item) => item.slug === slug);
  if (!project) return {};
  return pageMetadata({ title: `${project.name} — Oddwin Studios`, description: project.premise, path: `/games/${project.slug}` });
}

export default async function GamePage({ params }: PageProps<"/games/[slug]">) {
  const { slug } = await params;
  const project = studioProjects.find((item) => item.slug === slug);
  if (!project) notFound();
  const isAura = project.slug === "aura";

  return (
    <>
      <Container className="pt-5"><Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Nuestros juegos", path: "/games" }, { name: project.name, path: `/games/${project.slug}` }]} /></Container>
      <section className="relative isolate mt-4 min-h-[34rem] overflow-hidden border-y border-white/10 sm:min-h-[42rem]">
        <Image src={project.conceptImage} alt="" fill priority sizes="100vw" className="-z-20 object-cover object-center" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#08090d]/95 via-[#08090d]/65 to-[#08090d]/10" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#08090d] via-transparent to-[#08090d]/35" />
        <Container className="flex min-h-[34rem] flex-col justify-between pb-10 pt-8 sm:min-h-[42rem] sm:pb-14">
          <div className="max-w-4xl">
            <p className="label flex items-center gap-2 text-cyan"><span className="studio-signal size-1.5 rounded-full bg-cyan" /> Oddwin Studios / Creación original / En desarrollo</p>
            <h1 className="display-title mt-5 text-[4.2rem] leading-[0.86] sm:text-[6.5rem]">{project.name}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">{project.premise}</p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/contact" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-commercial px-5 text-sm font-bold text-black hover:bg-[#ffda8a]">Hablemos de edición <ArrowUpRight className="size-4" /></Link>
              <span className="rounded-full border border-white/20 bg-black/25 px-3 py-2 text-xs text-white/75 backdrop-blur">{isAura ? "Arte del concepto actual" : "Arte conceptual / Dirección visual"}</span>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        {isAura ? (
          <section className="grid gap-8 lg:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] lg:items-center lg:gap-14" aria-labelledby="aura-trailer-heading">
            <div><p className="label text-violet"><Clapperboard className="mr-2 inline size-3.5" /> Producción del estudio / AURA</p><h2 id="aura-trailer-heading" className="display-title mt-4 text-[2.8rem] sm:text-[4rem]">Un mundo en movimiento.</h2><p className="mt-4 max-w-md leading-relaxed text-fg-2">Un fragmento de la campaña de AURA. Solicita una presentación privada de la versión jugable y la documentación completa del proyecto.</p></div>
            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black p-2 shadow-[0_28px_90px_-40px_rgb(132_75_255/0.4)]"><video controls preload="none" playsInline poster="/games/aura/aura-keyart.webp" className="aspect-video w-full rounded-lg object-cover" aria-label="Tráiler cinematográfico de AURA, seis segundos, con subtítulos en español"><source src="/games/aura/aura-trailer-6s-en.mp4" type="video/mp4" /><track kind="subtitles" src="/games/aura/aura-trailer-es.vtt" srcLang="es" label="Español" default /></video><span className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur">Versión de 6 segundos</span></div>
          </section>
        ) : (
          <section className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.025] p-5 sm:p-7"><div><p className="label text-commercial">Arte conceptual</p><p className="mt-2 text-sm text-fg-2">Propuesta de dirección de arte. No es una captura del juego.</p></div><span className="figure text-xs text-fg-3">PROYECTO / EN DESARROLLO</span></section>
        )}

        <section className="mt-14 grid gap-8 border-t border-white/10 pt-10 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] md:gap-14" aria-labelledby="world-heading">
          <div><p className="label text-commercial">El mundo</p><h2 id="world-heading" className="display-title mt-3 text-[2.3rem] sm:text-[3rem]">Del concepto<br />al juego.</h2></div>
          <div className="grid gap-7 sm:grid-cols-2"><article className="border-l border-violet/50 pl-5"><h3 className="display-title text-[1.55rem]">Universo y dirección</h3><p className="mt-3 leading-relaxed text-fg-2">{project.world}</p></article><article className="border-l border-cyan/50 pl-5"><h3 className="display-title text-[1.55rem]">Enfoque del estudio</h3><p className="mt-3 leading-relaxed text-fg-2">{project.focus}</p></article></div>
        </section>

        <section className="mt-14 flex flex-col gap-5 border-y border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-3xl text-xs leading-relaxed text-fg-3">Este proyecto está en desarrollo. Esta página no acredita certificación, aprobación de mercado ni disponibilidad con dinero real. El estado de producción y los requisitos de colaboración se confirman directamente.</p><div className="flex shrink-0 gap-3"><Link href="/games" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-xs font-semibold text-white/80 hover:border-white/45"><ArrowLeft className="size-3.5" /> Todos los juegos</Link><Link href="/contact" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-xs font-bold text-black hover:bg-commercial">Consultar colaboración <ArrowRight className="size-3.5" /></Link></div></section>
      </Container>
    </>
  );
}
