import Link from "next/link";
import { Container } from "@/components/editorial/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-20">
      <div className="max-w-xl border-t border-line-strong pt-4">
        <p className="label text-accent">404 · Fuera del tablero</p>
        <h1 className="headline mt-3 text-[3.4rem]">Esta página no ha salido.</h1>
        <p className="mt-3 text-[1.2rem] leading-snug text-fg-2">
          La página que buscas no existe o todavía no se ha publicado.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link href="/slots">Explorar el catálogo</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
