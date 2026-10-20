import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, MoveUpRight } from "lucide-react";
import { Container } from "@/components/editorial/container";

export function StudioHero() {
  return (
    <section className="studio-hero relative isolate min-h-[690px] overflow-hidden border-b border-line sm:min-h-[740px] lg:min-h-[calc(100svh-4rem)]">
      <Image
        src="/studio/world-building-hero.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="studio-hero-art -z-20 object-cover object-center"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#08090df5_0%,#08090dde_32%,#08090d8c_57%,#08090d12_100%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,#08090df0_0%,transparent_37%,#08090d30_100%)]" />
      <div aria-hidden className="studio-orbit pointer-events-none absolute -right-32 top-24 -z-10 size-[34rem] rounded-full border border-white/10 lg:right-[6%] lg:top-1/2 lg:-translate-y-1/2">
        <span className="absolute left-[12%] top-[19%] size-3 rounded-full bg-cyan shadow-[0_0_24px_6px_rgb(88_229_239/0.55)]" />
        <span className="absolute bottom-[11%] right-[16%] size-2 rounded-full bg-commercial shadow-[0_0_22px_5px_rgb(244_199_106/0.55)]" />
      </div>

      <Container className="relative flex min-h-[690px] flex-col justify-center pb-28 pt-14 sm:min-h-[740px] lg:min-h-[calc(100svh-4rem)] lg:pb-36">
        <div className="max-w-[54rem]">
          <p className="studio-enter label flex items-center gap-3 text-cyan">
            <span className="studio-signal size-2 rounded-full bg-cyan" />
            Estudio independiente <span className="text-white/35">/</span> Mundos originales, creados para jugar
          </p>
          <h1 className="display-title studio-enter mt-7 text-[clamp(3.1rem,13.6vw,4.2rem)] leading-[0.94] sm:text-[5.3rem] lg:text-[6.6rem]">
            Tu próximo
            <br />
            <span className="relative inline-block text-commercial">gran mundo<span aria-hidden className="absolute -right-5 top-0 text-violet">✳</span></span>
            <br />
            empieza aquí.
          </h1>
          <p className="studio-enter mt-7 max-w-xl text-lg leading-relaxed text-white/75 sm:text-xl">
            Creamos slots con identidad propia. Y les damos vida con una producción cinematográfica que une el primer fotograma con el último giro.
          </p>
          <div className="studio-enter mt-9 flex flex-wrap gap-3">
            <Link href="/games" className="group inline-flex min-h-14 items-center gap-5 rounded-full bg-commercial px-6 text-sm font-bold text-[#17120a] transition-transform hover:-translate-y-0.5 hover:bg-[#ffda8a]">
              Descubre nuestros mundos <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link href="/services" className="inline-flex min-h-14 items-center gap-3 rounded-full border border-white/25 bg-black/20 px-6 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:border-white/60 hover:bg-white/10">
              Crea con Oddwin <MoveUpRight className="size-4" />
            </Link>
          </div>
        </div>

        <Link href="/games/aura" className="studio-project-peek group absolute bottom-16 right-5 hidden w-[18rem] rotate-2 overflow-hidden rounded-xl border border-white/25 bg-[#0b0a11]/85 p-2 shadow-[0_25px_70px_-25px_#000] backdrop-blur-sm transition-transform hover:rotate-0 sm:block lg:bottom-20 lg:right-10 lg:w-[21rem]">
          <span className="relative block aspect-[16/9] overflow-hidden rounded-lg">
            <Image src="/games/aura/aura-keyart.webp" alt="AURA, un concepto de juego original de Oddwin" fill sizes="336px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
            <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur">Creación original · En desarrollo</span>
          </span>
          <span className="flex items-center justify-between px-2 pb-1 pt-3">
            <span><span className="display-title block text-2xl text-white">AURA</span><span className="mt-1 block text-xs text-white/55">Un mundo de nuestro estudio</span></span>
            <span className="grid size-10 place-items-center rounded-full border border-white/20 text-commercial transition-colors group-hover:bg-commercial group-hover:text-black"><MoveUpRight className="size-4" /></span>
          </span>
        </Link>

        <a href="#studio-intro" className="absolute bottom-6 left-4 inline-flex items-center gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-white/60 hover:text-white sm:left-6 lg:bottom-8 lg:left-8">
          Sigue explorando <ArrowDown className="size-3" />
        </a>
        <span className="absolute bottom-8 right-8 hidden figure text-[0.6rem] text-white/40 lg:block">EST. 2026 / 01—03</span>
      </Container>
    </section>
  );
}

export function StudioTicker() {
  const items = ["Desarrollo de slots originales", "Mundos con identidad propia", "Tráilers cinematográficos", "Colaboración con editores y operadores", "Animación, sonido y dirección de arte"];
  return (
    <div className="overflow-hidden border-b border-white/10 bg-[#0a0a0f] py-4" aria-label="Servicios de Oddwin Studios">
      <div className="studio-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
        {[0, 1].map((loop) => (
          <div key={loop} className="flex items-center gap-8" aria-hidden={loop === 1}>
            {items.map((item, i) => <span key={item} className="flex items-center gap-8"><span className="display-title text-lg tracking-[0.05em] text-white/80">{item}</span><span className={i % 2 ? "text-cyan" : "text-commercial"}>✳</span></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}
