export interface SearchItem {
  type: "slot" | "provider" | "page";
  title: string;
  subtitle: string;
  href: string;
  keywords: string;
}

function normalise(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Small, dependency-free ranked search: every query token must match. */
export function searchItems(items: SearchItem[], query: string, limit = 8): SearchItem[] {
  const q = normalise(query);
  if (!q) return [];
  const tokens = q.split(" ");
  return items
    .map((item) => {
      const title = normalise(item.title);
      const hay = `${title} ${normalise(item.subtitle)} ${normalise(item.keywords)}`;
      if (!tokens.every((t) => hay.includes(t))) return null;
      let score = 0;
      if (title === q) score += 100;
      if (title.startsWith(q)) score += 50;
      for (const t of tokens) if (title.includes(t)) score += 10;
      if (item.type === "slot") score += 2;
      return { item, score };
    })
    .filter((x): x is { item: SearchItem; score: number } => x !== null)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((x) => x.item);
}
