import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clapperboard, Gamepad2, Layers3, MoveUpRight, Sparkles } from "lucide-react";
import { Container } from "@/components/editorial/container";
import { site } from "@/config/site";
import { StudioHero, StudioTicker } from "@/components/studio/studio-hero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${site.name} — Mundos originales, creados para jugar`,
  description: "Oddwin Studios crea slots originales y producción cinematográfica para editores, agregadores y operadores.",
  path: "/",
});

const craft = [
  { no: "01", icon: Gamepad2, title: "Mundos de juego", body: "Conceptos con una premisa clara, un estilo reconocible y una mecánica que da sentido a su mundo.", tint: "text-violet", stripe: "bg-violet" },
  { no: "02", icon: Layers3, title: "De la idea al juego", body: "Prototipos, documentación matemática y materiales para evaluar la experiencia y planificar su producción.", tint: "text-cyan", stripe: "bg-cyan" },
  { no: "03", icon: Clapperboard, title: "Un estreno a su altura", body: "Tráilers y piezas de campaña que nacen del propio juego y trasladan su carácter a cada canal.", tint: "text-commercial", stripe: "bg-commercial" },
];

export default function HomePage() {
  return (
    <>
      <StudioHero />
      <StudioTicker />

      <Container as="section" id="studio-intro" className="grid gap-7 py-16 sm:py-24 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16" aria-labelledby="intro-title">
        <div>
          <p className="label text-cyan">01 / El estudio</p>
          <h2 id="intro-title" className="display-title mt-4 max-w-2xl text-[2.9rem] sm:text-[4rem]">Un juego que deja huella.</h2>
        </div>
        <div className="flex flex-col justify-end">
          <p className="max-w-2xl text-xl leading-relaxed text-fg-2 sm:text-2xl">Primero imaginamos el mundo. Después, hacemos que cada detalle del juego forme parte de él.</p>
          <p className="mt-4 max-w-xl leading-relaxed text-fg-3">Somos un estudio independiente especializado en slots originales, prototipos jugables y producción cinematográfica para editores, agregadores y operadores.</p>
          <Link href="/services" className="mt-6 inline-flex w-fit items-center gap-2 border-b border-commercial/60 pb-2 text-sm font-semibold text-commercial transition-colors hover:border-commercial hover:text-white">Así trabajamos <ArrowRight className="size-4" /></Link>
        </div>
      </Container>

      <section className="relative overflow-hidden border-y border-white/10 bg-[#101018] py-16 sm:py-24" aria-labelledby="aura-title">
        <div aria-hidden className="pointer-events-none absolute -left-52 top-20 size-[35rem] rounded-full bg-violet/10 blur-[100px]" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:gap-16">
          <Link href="/games/aura" className="group relative block">
            <div className="absolute -inset-3 rotate-[-2deg] rounded-[1.5rem] border border-violet/30 transition-transform duration-500 group-hover:rotate-[-1deg]" aria-hidden />
            <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black shadow-[0_40px_100px_-45px_rgb(132_75_255/0.45)]">
              <div className="relative aspect-[1.23/1] sm:aspect-[1.5/1]">
                <Image src="/games/aura/aura-keyart.webp" alt="AURA: dos manos doradas sostienen una esfera celeste violeta en un santuario de obsidiana" fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.035]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/10" />
                <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/45 px-3 py-1.5 text-[0.62rem] font-semibold uppercase tracking-[0.13em] text-white backdrop-blur"><span className="size-1.5 rounded-full bg-cyan" /> Creación original / En desarrollo</span>
                <span className="absolute bottom-5 left-5"><span className="display-title block text-[3.8rem] leading-none text-white sm:text-[5.5rem]">AURA</span><span className="mt-1 block text-sm tracking-[0.15em] text-white/65">EL PODER ANCESTRAL DESPIERTA</span></span>
                <span className="absolute bottom-5 right-5 grid size-12 place-items-center rounded-full border border-white/35 bg-black/30 text-white backdrop-blur transition-all group-hover:border-commercial group-hover:bg-commercial group-hover:text-black"><MoveUpRight className="size-5" /></span>
              </div>
            </div>
          </Link>

          <div className="lg:py-10">
            <p className="label flex items-center gap-2 text-violet"><Sparkles className="size-3.5" /> Creación original / 001</p>
            <h2 id="aura-title" className="display-title mt-4 text-[3.4rem] sm:text-[5rem]">Un mundo<br /><span className="text-violet">despierta.</span></h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-fg-2">AURA nace de un santuario olvidado, unas manos cubiertas de oro y un núcleo celeste inestable. Desarrollamos el juego, la animación y la campaña como partes de un mismo universo.</p>
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 border-y border-white/10 py-4 text-xs font-semibold uppercase tracking-[0.13em] text-white/65">
              <span>Concepto de juego</span><span>Versión jugable</span><span>Producción cinematográfica</span>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/games/aura" className="inline-flex min-h-12 items-center gap-3 rounded-full bg-violet px-5 text-sm font-bold text-[#130b20] transition-colors hover:bg-[#c29dff]">Descubre AURA <ArrowUpRight className="size-4" /></Link>
              <span className="text-xs text-fg-3">Presentaciones privadas para empresas</span>
            </div>
          </div>
        </Container>
      </section>

      <Container as="section" className="py-16 sm:py-24" aria-labelledby="craft-title">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="label text-commercial">02 / Nuestro oficio</p>
            <h2 id="craft-title" className="display-title mt-4 max-w-xl text-[2.8rem] sm:text-[4rem]">Cada detalle cuenta.</h2>
            <p className="mt-5 max-w-md leading-relaxed text-fg-2">La mecánica, los símbolos, el bonus y el tráiler deben contar la misma historia. Así se construye un juego que se reconoce a primera vista.</p>
          </div>
          <ol className="divide-y divide-white/10 border-y border-white/10">
            {craft.map(({ no, icon: Icon, title, body, tint, stripe }) => (
              <li key={no} className="studio-tilt group grid grid-cols-[3.25rem_minmax(0,1fr)] gap-4 py-6 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-6 sm:py-8">
                <span className={`relative grid size-12 place-items-center overflow-hidden rounded-xl border border-white/10 bg-white/[0.035] ${tint}`}><span className={`absolute inset-x-0 top-0 h-[2px] ${stripe}`} /><Icon className="size-5" /></span>
                <span><span className="flex items-center gap-3"><span className="figure text-xs text-fg-3">{no}</span><h3 className="display-title text-[1.8rem] sm:text-[2.4rem]">{title}</h3></span><p className="mt-2 max-w-xl leading-relaxed text-fg-2">{body}</p></span>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      <section className="border-y border-white/10 bg-[#0b0b10] py-16 sm:py-20" aria-labelledby="trailer-title">
        <Container className="grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-center lg:gap-14">
          <div><p className="label text-cyan">Una mirada a su mundo</p><h2 id="trailer-title" className="display-title mt-4 text-[2.8rem] sm:text-[4rem]">Así cobra vida.</h2><p className="mt-4 max-w-md leading-relaxed text-fg-2">Seis segundos para entrar en el universo visual de AURA. En nuestras presentaciones privadas mostramos las versiones extendidas, las funciones del juego y el prototipo actual.</p><Link href="/games/aura" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:underline">Ver el proyecto <ArrowRight className="size-4" /></Link></div>
          <div className="relative overflow-hidden rounded-xl border border-white/15 bg-black p-2 shadow-[0_25px_90px_-40px_rgb(88_229_239/0.25)]">
            <video controls preload="none" playsInline poster="/games/aura/aura-keyart.webp" className="aspect-video w-full rounded-lg object-cover" aria-label="Tráiler cinematográfico de AURA, seis segundos, con subtítulos en español">
              <source src="/games/aura/aura-trailer-6s-en.mp4" type="video/mp4" /><track kind="subtitles" src="/games/aura/aura-trailer-es.vtt" srcLang="es" label="Español" default />
            </video>
            <span className="absolute right-5 top-5 rounded-full border border-white/20 bg-black/55 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur">AURA / Versión de 6 s</span>
          </div>
        </Container>
      </section>

      <section id="channel-13" className="relative overflow-hidden border-b border-white/10 bg-[#0d090b] py-16 sm:py-20" aria-labelledby="channel-13-title">
        <div aria-hidden className="pointer-events-none absolute -right-32 top-0 size-96 rounded-full bg-red-900/15 blur-[100px]" />
        <Container className="relative grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-center lg:gap-14">
          <div>
            <p className="label text-[#f09589]">DEAD AIR / CHANNEL 13</p>
            <h2 id="channel-13-title" className="display-title mt-4 text-[2.8rem] sm:text-[4rem]">Él sigue<br /><span className="text-[#f09589]">al otro lado.</span></h2>
            <p className="mt-4 max-w-md leading-relaxed text-fg-2">La emisión terminó. El presentador sigue mirando. Quince segundos de terror analógico para entrar en el universo de CHANNEL 13.</p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-fg-3">Contiene imágenes de terror y un sobresalto. Reproducción por clic.</p>
            <Link href="/games/dead-air-channel-13" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#f09589] hover:underline">Descubre CHANNEL 13 <ArrowRight className="size-4" /></Link>
          </div>
          <figure className="min-w-0">
            <div className="relative overflow-hidden rounded-xl border border-[#f09589]/25 bg-black p-2 shadow-[0_25px_90px_-40px_rgb(150_35_30/0.4)]">
              <video controls muted preload="none" playsInline poster="/games/channel-13/channel-13-presenter.jpg" className="aspect-video w-full rounded-lg object-cover" aria-label="Teaser visual de DEAD AIR — CHANNEL 13, quince segundos, terror y sobresalto">
                <source src="/games/channel-13/channel-13-teaser-15s.mp4" type="video/mp4" />
                <track kind="subtitles" src="/games/channel-13/channel-13-teaser-es.vtt" srcLang="es" label="Español" default />
              </video>
              <span className="pointer-events-none absolute right-5 top-5 rounded-full border border-[#f09589]/30 bg-black/70 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-[#f6b9b0]">CHANNEL 13 / 15 s</span>
            </div>
            <figcaption className="mt-3 text-xs leading-relaxed text-fg-3">Una señal que no debería seguir emitiendo. Presentaciones privadas para empresas.</figcaption>
          </figure>
        </Container>
      </section>

      <section id="obsidian-vault" className="relative overflow-hidden border-b border-white/10 bg-[#100e0a] py-16 sm:py-20" aria-labelledby="obsidian-trailer-title">
        <div aria-hidden className="pointer-events-none absolute -left-32 top-0 size-96 rounded-full bg-amber-700/10 blur-[100px]" />
        <Container className="relative grid gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-center lg:gap-14">
          <div>
            <p className="label text-commercial">OBSIDIAN / THE LOST VAULT</p>
            <h2 id="obsidian-trailer-title" className="display-title mt-4 text-[2.8rem] sm:text-[4rem]">El poder<br /><span className="text-commercial">tiene un precio.</span></h2>
            <p className="mt-4 max-w-md leading-relaxed text-fg-2">Un anillo de oro. Un umbral de piedra. Una cámara que guarda algo más que un tesoro. Entra en el universo de OBSIDIAN.</p>
            <Link href="/games/obsidian-the-lost-vault" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-commercial hover:underline">Descubre OBSIDIAN <ArrowRight className="size-4" /></Link>
          </div>
          <figure className="min-w-0">
            <div className="relative overflow-hidden rounded-xl border border-commercial/25 bg-black p-2 shadow-[0_25px_90px_-40px_rgb(186_135_42/0.35)]">
              <video controls preload="none" playsInline poster="/games/obsidian/obsidian-teaser-poster.jpg" className="aspect-video w-full rounded-lg object-cover" aria-label="Teaser cinematográfico de OBSIDIAN — The Lost Vault, diez segundos, con sonido">
                <source src="/games/obsidian/obsidian-teaser-10s.mp4" type="video/mp4" />
              </video>
              <span className="pointer-events-none absolute right-5 top-5 rounded-full border border-commercial/30 bg-black/70 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-commercial">OBSIDIAN / 10 s</span>
            </div>
            <figcaption className="mt-3 text-xs leading-relaxed text-fg-3">El umbral es solo el principio. Presentaciones privadas para empresas.</figcaption>
          </figure>
        </Container>
      </section>

      <Container as="section" className="py-16 sm:py-24" aria-labelledby="partners-title">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div><p className="label text-commercial">03 / La colaboración</p><h2 id="partners-title" className="display-title mt-4 text-[2.8rem] sm:text-[4rem]">Grandes juegos.<br />Acuerdos a su altura.</h2><p className="mt-5 max-w-md leading-relaxed text-fg-2">Adaptamos la colaboración al alcance del proyecto, los derechos y la vía de lanzamiento de cada empresa.</p></div>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { no: "A", name: "Precio de producción", copy: "Un importe por un encargo, alcance y entrega definidos.", color: "border-commercial/45" },
              { no: "B", name: "Por hitos", copy: "Pagos vinculados a las etapas, revisiones y aceptación del proyecto.", color: "border-violet/45" },
              { no: "C", name: "Acuerdo mixto", copy: "Un importe inicial más una participación negociada sobre condiciones de GGR definidas.", color: "border-cyan/45" },
            ].map((item) => <article key={item.no} className={`studio-tilt flex min-h-52 flex-col justify-between rounded-xl border ${item.color} bg-white/[0.025] p-5`}><span className="display-title text-4xl text-white/20">{item.no}</span><span><h3 className="display-title text-[1.55rem]">{item.name}</h3><p className="mt-2 text-sm leading-relaxed text-fg-2">{item.copy}</p></span></article>)}
          </div>
        </div>
        <p className="mt-6 border-l-2 border-white/15 pl-4 text-xs leading-relaxed text-fg-3">La participación en ingresos se negocia en cada acuerdo. Antes de firmar deben definirse el cálculo, las deducciones, la atribución, los informes, la auditoría, los mercados y la duración.</p>
      </Container>

      <section className="relative overflow-hidden py-16 sm:py-24" aria-labelledby="contact-title">
        <Container className="relative">
          <div aria-hidden className="absolute inset-0 -z-10 rounded-3xl border border-white/10 bg-[radial-gradient(ellipse_at_70%_20%,rgb(170_123_255/0.14),transparent_40%),radial-gradient(ellipse_at_20%_90%,rgb(88_229_239/0.09),transparent_35%)]" />
          <div className="grid gap-7 px-6 py-10 sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-14">
            <div><p className="label text-commercial">Cuéntanos tu idea</p><h2 id="contact-title" className="display-title mt-4 max-w-4xl text-[3.1rem] sm:text-[5rem]">Creemos su<br className="hidden sm:block" /> próximo juego favorito.</h2><p className="mt-5 max-w-xl text-lg text-fg-2">Edición, desarrollo, tráiler o una colaboración a medida. Todo empieza hablando.</p></div>
            <Link href="/contact" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-white px-6 text-sm font-bold text-black transition-transform hover:-translate-y-1 hover:bg-commercial">Hablemos <ArrowUpRight className="size-4" /></Link>
          </div>
        </Container>
      </section>

      <Container as="section" className="grid gap-6 border-t border-white/10 py-10 md:grid-cols-2" aria-label="Información editorial y de afiliación">
        <article className="flex items-start justify-between gap-4"><span><p className="label text-accent">Revista de slots</p><p className="mt-1 text-sm text-fg-3">Análisis documentados. Nuestros juegos se presentan como proyectos propios y nunca como recomendaciones independientes.</p></span><Link href="/slots" className="shrink-0 text-sm font-semibold text-accent hover:underline">Explorar <ArrowRight className="inline size-3.5" /></Link></article>
        <article className="flex items-start justify-between gap-4"><span><p className="label text-commercial">Estado de afiliación</p><p className="mt-1 text-sm text-fg-3">Aún no hay ofertas de casino aprobadas. Solo publicamos tras verificar el programa y el mercado.</p></span><Link href="/casinos" className="shrink-0 text-sm font-semibold text-commercial hover:underline">Criterios <ArrowRight className="inline size-3.5" /></Link></article>
      </Container>
    </>
  );
}
