import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clapperboard, Gamepad2, Layers3, Workflow } from "lucide-react";
import { Breadcrumbs } from "@/components/editorial/breadcrumbs";
import { Container } from "@/components/editorial/container";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `Servicios para empresas del sector — ${site.name}`,
  description: "Desarrollo de slots originales, marketing cinematográfico y producción creativa para editores, agregadores y operadores de casino.",
  path: "/services",
});

const capabilities = [
  { no: "01", icon: Gamepad2, title: "Desarrollo de juegos originales", copy: "De la primera idea al prototipo jugable: dirección, identidad visual, estructura del bonus, documentación matemática y planificación de producción.", color: "text-violet", accent: "border-violet/35" },
  { no: "02", icon: Clapperboard, title: "Marketing cinematográfico", copy: "Un tráiler debe transmitir la esencia del juego. Planificamos campañas a partir de su universo, imágenes reales del juego y una dirección audiovisual definida.", color: "text-cyan", accent: "border-cyan/35" },
  { no: "03", icon: Layers3, title: "Identidad visual y materiales de lanzamiento", copy: "Dirección de arte, imágenes de campaña, símbolos, grafismo animado y versiones para cada canal, con la misma identidad que el juego.", color: "text-commercial", accent: "border-commercial/35" },
  { no: "04", icon: Workflow, title: "Producción para empresas", copy: "Apoyo de producción para editores y operadores, con alcance, revisiones, entrega y criterios de aceptación definidos desde el principio.", color: "text-coral", accent: "border-coral/35" },
];

export default function ServicesPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image src="/studio/world-building-hero.webp" alt="" fill sizes="100vw" className="-z-20 object-cover object-[64%_47%] opacity-60" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#08090df5_0%,#08090ddd_48%,#08090d40_100%)]" />
        <Container className="relative pb-16 pt-5 sm:pb-24">
          <Breadcrumbs items={[{ name: "Inicio", path: "/" }, { name: "Servicios", path: "/services" }]} />
          <header className="mt-12 max-w-4xl sm:mt-16">
            <p className="label text-cyan">Para editores / agregadores / operadores</p>
            <h1 className="display-title mt-5 text-[3.2rem] sm:text-[5rem] lg:text-[6.4rem]">Dale forma.<br /><span className="text-commercial">Hazlo memorable.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/75 sm:text-xl">Desarrollo de slots y producción cinematográfica en un estudio independiente que trabaja con una visión completa de la experiencia.</p>
          </header>
          <div className="mt-10 flex flex-wrap gap-3 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/65">
            {["Concepto de juego", "Prototipo jugable", "Matemáticas y documentación", "Tráiler y campaña de lanzamiento"].map((item) => <span key={item} className="rounded-full border border-white/20 bg-black/20 px-3 py-2 backdrop-blur">{item}</span>)}
          </div>
        </Container>
      </section>

      <Container as="section" className="py-16 sm:py-24" aria-labelledby="services-list-title">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div><p className="label text-commercial">Servicios del estudio / 01—04</p><h2 id="services-list-title" className="display-title mt-3 text-[2.7rem] sm:text-[3.8rem]">Un mundo, de principio a fin.</h2></div>
          <span className="figure text-xs text-fg-3">IDEA → JUEGO → PANTALLA → MERCADO</span>
        </div>
        <ol className="grid gap-3 lg:grid-cols-2">
          {capabilities.map(({ no, icon: Icon, title, copy, color, accent }) => (
            <li key={no} className={`studio-tilt group relative isolate min-h-64 overflow-hidden rounded-2xl border ${accent} bg-[#101018] p-6 sm:p-8`}>
              <span aria-hidden className="absolute -right-8 -top-10 -z-10 size-48 rounded-full bg-white/[0.025] blur-3xl transition-colors group-hover:bg-white/[0.07]" />
              <span className="flex items-center justify-between"><span className={`grid size-12 place-items-center rounded-xl border border-white/10 bg-black/20 ${color}`}><Icon className="size-5" /></span><span className="display-title text-5xl text-white/10">{no}</span></span>
              <h3 className="display-title mt-8 text-[1.9rem] sm:text-[2.4rem]">{title}</h3>
              <p className="mt-3 max-w-xl leading-relaxed text-fg-2">{copy}</p>
            </li>
          ))}
        </ol>
      </Container>

      <section className="border-y border-white/10 bg-[#101018] py-14 sm:py-20" aria-labelledby="commercial-title">
        <Container className="grid gap-9 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
          <div><p className="label text-violet">Una colaboración a medida</p><h2 id="commercial-title" className="display-title mt-4 text-[2.8rem] sm:text-[4rem]">Un acuerdo.<br />Distintas formas de crear.</h2></div>
          <div>
            <p className="max-w-2xl text-lg leading-relaxed text-fg-2">Podemos trabajar con un precio cerrado, pagos por hitos o un modelo mixto con un importe inicial y una participación en ingresos acordada.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {[["PRECIO CERRADO", "Un importe por el alcance y las entregas acordados."], ["POR HITOS", "Pagos ligados a las revisiones y la aceptación."], ["MODELO MIXTO", "Importe inicial más una participación acordada en GGR."]].map(([title, copy], i) => <article key={title} className="border-t-2 border-white/15 pt-4"><span className={`figure text-[0.62rem] ${i === 0 ? "text-commercial" : i === 1 ? "text-violet" : "text-cyan"}`}>0{i + 1}</span><h3 className="display-title mt-2 text-[1.4rem]">{title}</h3><p className="mt-2 text-sm leading-relaxed text-fg-3">{copy}</p></article>)}
            </div>
            <p className="mt-6 border-l border-white/20 pl-4 text-xs leading-relaxed text-fg-3">Acordamos el alcance y las condiciones de cada proyecto. Cualquier participación en GGR requiere definir el cálculo, las deducciones, los informes, los derechos de auditoría, la atribución, los mercados y la duración.</p>
          </div>
        </Container>
      </section>

      <Container as="section" className="py-16 sm:py-20">
        <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-[#121018] p-6 sm:p-10 lg:p-14">
          <Image src="/games/aura/aura-keyart.webp" alt="" fill sizes="100vw" className="-z-10 object-cover object-center opacity-20" />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0a0a10] via-[#0a0a10]/90 to-transparent" />
          <div className="max-w-2xl"><p className="label text-commercial">¿Tienes un proyecto?</p><h2 className="display-title mt-4 text-[2.8rem] sm:text-[4.5rem]">Demos vida a tu idea.</h2><p className="mt-4 max-w-xl leading-relaxed text-fg-2">Tráenos una idea, un reto de producción o una propuesta de edición. Empezaremos por definir el encaje, el alcance y los siguientes pasos.</p><Link href="/contact" className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-full bg-commercial px-5 text-sm font-bold text-black transition-transform hover:-translate-y-0.5 hover:bg-[#ffda8a]">Hablemos del proyecto <ArrowUpRight className="size-4" /></Link></div>
        </div>
        <p className="mt-5 text-xs text-fg-3">No afirmamos disponer de certificación como proveedor ni de juegos lanzados con dinero real. El estado del producto y los requisitos se revisan en cada proyecto.</p>
      </Container>
    </>
  );
}
