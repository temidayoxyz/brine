import type { APIRoute } from 'astro';
import { getArticleTopic, estimateReadingTime, getPublishedArticles, plainText } from '../lib/articles';
import type { SearchRecord } from '../lib/search';

export const GET: APIRoute = async () => {
  const articles = await getPublishedArticles();

  const records: SearchRecord[] = articles.map((article) => ({
    slug: article.id,
    title: article.data.title,
    description: article.data.description,
    category: article.data.category,
    categoryName: getArticleTopic(article).name,
    publishedAt: article.data.publishedAt.toISOString(),
    readingTime: estimateReadingTime(article.body),
    tags: article.data.tags,
    keywords: article.data.keywords,
    body: plainText(article.body ?? ''),
  }));

  return new Response(JSON.stringify(records), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
