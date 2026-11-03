import { getCollection, type CollectionEntry } from 'astro:content';
import { topicBySlug, type TopicSlug } from '../data/topics';
import { withBase } from './paths';

export type Article = CollectionEntry<'articles'>;

const WORDS_PER_MINUTE = 220;

export async function getPublishedArticles(): Promise<Article[]> {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return articles.sort((a, b) => {
    const dateDifference = b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf();
    return dateDifference !== 0 ? dateDifference : a.data.title.localeCompare(b.data.title);
  });
}

export function getFeaturedArticle(articles: Article[]): Article {
  return articles.find((article) => article.data.featured) ?? articles[0];
}

export function articleUrl(article: Article): string {
  return withBase(`/journal/${article.id}/`);
}

export function topicUrl(slug: string): string {
  return withBase(`/topics/${slug}/`);
}

export function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^---+$/gm, ' ')
    .replace(/[*_~]{1,3}/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function wordCount(body: string | undefined): number {
  const text = plainText(body ?? '');
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

export function estimateReadingTime(body: string | undefined): number {
  return Math.max(1, Math.ceil(wordCount(body) / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

const longDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const shortDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const dayMonthFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

const monthYearFormatter = new Intl.DateTimeFormat('en-GB', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatDate(date: Date, style: 'long' | 'short' | 'day-month' = 'long'): string {
  if (style === 'short') return shortDateFormatter.format(date);
  if (style === 'day-month') return dayMonthFormatter.format(date);
  return longDateFormatter.format(date);
}

export function formatMonthYear(date: Date): string {
  return monthYearFormatter.format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString();
}

export function isoDuration(minutes: number): string {
  return `PT${minutes}M`;
}

export function getArticleTopic(article: Article) {
  return topicBySlug[article.data.category];
}

export function getRelatedArticles(article: Article, articles: Article[], limit = 3): Article[] {
  const sameTopic = articles.filter(
    (candidate) => candidate.id !== article.id && candidate.data.category === article.data.category,
  );
  const others = articles.filter(
    (candidate) => candidate.id !== article.id && candidate.data.category !== article.data.category,
  );
  return [...sameTopic, ...others].slice(0, limit);
}

export function getNextArticle(article: Article, articles: Article[]): Article | null {
  const index = articles.findIndex((candidate) => candidate.id === article.id);
  if (index === -1) return null;
  return articles[index + 1] ?? null;
}

export function getTopicCounts(articles: Article[]): Record<TopicSlug, number> {
  const counts = {
    attention: 0,
    design: 0,
    'digital-life': 0,
    culture: 0,
    living: 0,
  } satisfies Record<TopicSlug, number>;

  for (const article of articles) {
    counts[article.data.category] += 1;
  }

  return counts;
}

export interface ArticleMonthGroup {
  key: string;
  label: string;
  articles: Article[];
}

export interface ArticleYearGroup {
  year: number;
  count: number;
  months: ArticleMonthGroup[];
}

export function groupArticlesByYear(articles: Article[]): ArticleYearGroup[] {
  const years = new Map<number, Map<string, ArticleMonthGroup>>();

  for (const article of articles) {
    const date = article.data.publishedAt;
    const year = date.getUTCFullYear();
    const monthKey = `${year}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
    if (!years.has(year)) years.set(year, new Map());
    const months = years.get(year)!;
    if (!months.has(monthKey)) {
      months.set(monthKey, {
        key: monthKey,
        label: formatMonthYear(date),
        articles: [],
      });
    }
    months.get(monthKey)!.articles.push(article);
  }

  return Array.from(years.entries())
    .sort(([a], [b]) => b - a)
    .map(([year, months]) => ({
      year,
      count: Array.from(months.values()).reduce((total, month) => total + month.articles.length, 0),
      months: Array.from(months.values()).sort((a, b) => b.key.localeCompare(a.key)),
    }));
}

export function articleCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'story' : 'stories'}`;
}
