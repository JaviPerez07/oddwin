import type { SourceRecord } from "@/types/source";
import { formatDate } from "@/lib/utils";

const resultLabel: Record<SourceRecord["result"], string> = {
  confirmed: "Confirmado",
  not_loaded: "Sin consultar",
  conflict: "Contradicción",
  not_found: "No encontrado",
};

const trustLabel: Record<SourceRecord["trust"], string> = {
  primary: "Primaria",
  secondary: "Secundaria",
  search_index: "Referencia del buscador",
  preliminary: "Notas del editor",
};

const sourceFieldLabels: Record<string, string> = {
  rtp: "RTP", volatility: "Volatilidad", maxWin: "Premio máximo", grid: "Cuadrícula", payStructure: "Pagos",
  freeSpins: "Giros gratis", jackpot: "Bote", releaseDate: "Lanzamiento", demo: "Versión de prueba",
  mechanics: "Mecánicas", regulatoryAuthority: "Regulador", minimumLegalAge: "Edad mínima",
  licenceRegisterUrl: "Registro de licencias", promotionalRules: "Reglas de publicidad", provider: "Proveedor",
};

export function SourcesTable({ sources }: { sources: SourceRecord[] }) {
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-inset ring-line">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <caption className="sr-only">Fuentes y estado de verificación</caption>
        <thead>
          <tr className="border-b border-line bg-surface text-left text-xs text-fg-3">
            <th scope="col" className="px-4 py-2.5 font-medium">Fuente</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Uso</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Tipo</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Resultado</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Consultado</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((s) => (
            <tr key={s.id} className="border-b border-line align-top last:border-b-0">
              <td className="px-4 py-3">
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer nofollow" className="font-medium text-fg underline decoration-line-strong underline-offset-4 hover:text-accent">
                    {s.label}
                  </a>
                ) : (
                  <span className="font-medium">{s.label}</span>
                )}
                {s.editorNote ? <p className="mt-1 max-w-sm text-xs leading-snug text-fg-3">{s.editorNote}</p> : null}
              </td>
              <td className="figure px-4 py-3 text-xs text-fg-2">{s.fields.map((field) => sourceFieldLabels[field] ?? "Información del juego").join(", ")}</td>
              <td className="px-4 py-3 text-xs text-fg-2">{trustLabel[s.trust]}</td>
              <td className={`px-4 py-3 text-xs font-semibold ${s.result === "confirmed" ? "text-verified" : "text-pending"}`}>{resultLabel[s.result]}</td>
              <td className="figure px-4 py-3 text-xs text-fg-2">{formatDate(s.consultedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
