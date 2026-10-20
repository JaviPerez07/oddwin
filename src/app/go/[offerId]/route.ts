import { NextResponse } from "next/server";
import { resolveOfferRedirect } from "@/lib/affiliate-tracking";

const NO_INDEX = { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" };

export async function GET(request: Request, ctx: RouteContext<"/go/[offerId]">) {
  const { offerId } = await ctx.params;
  const url = new URL(request.url);
  const decision = await resolveOfferRedirect(offerId, url.searchParams.get("market"));

  if (!decision.ok) {
    const messages: Record<string, string> = { invalid_offer_id: "La oferta no es válida.", market_required: "Selecciona un mercado válido.", unknown_offer: "No encontramos esta oferta.", not_eligible: "La oferta no está disponible para este mercado o ya no está vigente." };
    return new NextResponse(messages[decision.reason] || "Este enlace no está disponible.", {
      status: decision.status,
      headers: { ...NO_INDEX, "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  // Minimal click log: no IP, no user agent, no cookies.
  console.info(JSON.stringify({ event: "affiliate_click", offer: decision.offerId, market: decision.market, ts: new Date().toISOString() }));

  return NextResponse.redirect(decision.destination, { status: 302, headers: { ...NO_INDEX, "Referrer-Policy": "no-referrer" } });
}
