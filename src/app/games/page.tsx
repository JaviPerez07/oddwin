import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { Container } from "@/components/editorial/container";
import { studioProjects } from "@/data/studio-projects";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Juegos originales en desarrollo — Oddwin Studios",
  description: "Descubre los conceptos originales de Oddwin Studios y solicita una presentación privada.",
  path: "/games",
});

const otherProjects = studioProjects.filter((project) => project.slug !== "aura");

export default function GamesPage() {
  return (
    <>
      <Container className="pt-5">
        <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Nuestros juegos", path: "/games" }]} />
      </Container>
      <section className="relative py-10 sm:py-16">
        <Container>
          <header className="mb-9 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.65fr)] lg:items-end">
            <div><p className="label text-cyan">Creaciones originales / Nuestros proyectos</p><h1 className="display-title mt-4 text-[3.3rem] sm:text-[5rem]">Juegos con<br /><span className="text-commercial">su propia órbita.</span></h1></div>
            <p className="max-w-lg leading-relaxed text-fg-2">Mundos que invitan a jugar. Nuestros conceptos están en desarrollo; mostramos las versiones actuales y la documentación en presentaciones privadas.</p>
          </header>

          <Link href="/games/aura" className="group relative isolate grid min-h-[31rem] overflow-hidden rounded-2xl border border-white/15 bg-[#0b0a10] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <div className="relative z-10 flex flex-col justify-between p-6 sm:p-10 lg:p-12">
              <span className="label flex items-center gap-2 text-violet"><span className="studio-signal size-1.5 rounded-full bg-violet" /> Proyecto 001 / En desarrollo</span>
              <span><span className="display-title block text-[4.8rem] leading-[0.85] sm:text-[6.5rem]">AURA</span><span className="mt-3 block text-xs font-semibold uppercase tracking-[0.22em] text-white/55">La fuerza celeste despierta</span><span className="mt-5 block max-w-md leading-relaxed text-fg-2">Un santuario mítico. Manos doradas alrededor de un núcleo celeste inestable. El primer universo original que presentamos a nuestros colaboradores.</span><span className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-commercial px-5 text-sm font-bold text-black transition-transform group-hover:-translate-y-0.5">Entra en el mundo de AURA <ArrowUpRight className="size-4" /></span></span>
              <span className="figure text-xs text-white/35">JUEGO / ANIMACIÓN / SONIDO</span>
            </div>
            <div className="absolute inset-0 -z-10 lg:static lg:z-0">
              <Image src="/games/aura/aura-keyart.webp" alt="Arte de AURA: unas manos doradas sostienen una esfera violeta en un santuario ancestral" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover object-[56%_center] opacity-65 transition-transform duration-1000 group-hover:scale-[1.045] lg:opacity-100" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0b0a10] via-[#0b0a10]/75 to-transparent lg:bg-gradient-to-r lg:from-[#0b0a10] lg:via-[#0b0a10]/25 lg:to-transparent" />
              <div className="absolute bottom-5 right-5 hidden rounded-full border border-white/25 bg-black/35 px-3 py-2 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white/75 backdrop-blur lg:block">Arte original del juego</div>
            </div>
          </Link>

          <div className="mt-14 flex items-end justify-between gap-4 border-b border-white/15 pb-4"><div><p className="label text-commercial">En desarrollo</p><h2 className="display-title mt-2 text-[2.3rem] sm:text-[3rem]">Otros mundos toman forma.</h2></div><span className="figure hidden text-xs text-fg-3 sm:block">002—003 / EN DESARROLLO</span></div>
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {otherProjects.map((project, i) => (
              <li key={project.slug}>
                <Link href={`/games/${project.slug}`} className="studio-tilt group relative isolate flex min-h-[25rem] flex-col justify-between overflow-hidden rounded-xl border border-white/15 bg-black p-5 sm:min-h-[30rem] sm:p-7">
                  <Image src={project.conceptImage} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="-z-20 object-cover transition-transform duration-700 group-hover:scale-[1.045]" />
                  <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-[#09090d] via-[#09090d]/45 to-[#09090d]/10" />
                  <span className="flex items-center justify-between"><span className="label rounded-full border border-white/20 bg-black/35 px-3 py-2 text-white/75 backdrop-blur">Proyecto 00{i + 2} / En desarrollo</span><ArrowUpRight className="size-5 text-white/70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" /></span>
                  <span><span className="mb-3 inline-block rounded-full border border-commercial/40 bg-black/35 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-commercial backdrop-blur">Arte conceptual · No es una captura del juego</span><span className={`display-title block text-[2.5rem] text-white sm:text-[3.5rem]`}>{project.name}</span><span className="mt-1 block text-xs font-semibold uppercase tracking-[0.15em] text-white/65">{i === 0 ? "LA CÁMARA PERDIDA" : "CANAL 13"}</span><span className="mt-4 block max-w-lg text-sm leading-relaxed text-white/75">{project.premise}</span></span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-7 max-w-3xl text-xs leading-relaxed text-fg-3">Estos proyectos están en desarrollo. Todavía no son juegos certificados ni lanzados con dinero real. Su estado, los materiales técnicos y los requisitos se revisan directamente. Las imágenes son arte conceptual original del estudio.</p>
        </Container>
      </section>
    </>
  );
}
