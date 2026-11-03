export interface SearchRecord {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryName: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
  keywords: string[];
  body: string;
}

export interface SearchResult extends SearchRecord {
  score: number;
}

export function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function searchArticles(
  records: readonly SearchRecord[],
  query: string,
  limit = 8,
): SearchResult[] {
  const terms = normalize(query)
    .split(/\s+/)
    .filter((term) => term.length > 0);

  if (terms.length === 0) return [];

  const results: SearchResult[] = [];

  for (const record of records) {
    const title = normalize(record.title);
    const description = normalize(record.description);
    const category = normalize(record.category);
    const categoryName = normalize(record.categoryName);
    const tags = normalize(record.tags.join(' '));
    const keywords = normalize(record.keywords.join(' '));
    const body = normalize(record.body);
    const haystack = [title, description, category, categoryName, tags, keywords, body].join(' ');

    if (!terms.every((term) => haystack.includes(term))) continue;

    let score = 0;

    for (const term of terms) {
      if (title === term) score += 80;
      else if (title.startsWith(term)) score += 36;
      else if (title.includes(term)) score += 24;

      if (categoryName.includes(term)) score += 12;
      if (tags.includes(term)) score += 10;
      if (keywords.includes(term)) score += 8;
      if (description.includes(term)) score += 6;

      const bodyMatches = body.match(new RegExp(escapeRegExp(term), 'g'));
      score += Math.min(bodyMatches?.length ?? 0, 10);
    }

    if (terms.length > 1) score += 4;

    results.push({ ...record, score });
  }

  return results
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, limit);
}
