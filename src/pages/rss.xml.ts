import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { siteUrl } from '../config';
import { site } from '../data/site';
import { getArticleTopic, getPublishedArticles } from '../lib/articles';
import { withBase } from '../lib/paths';

export async function GET(context: APIContext) {
  const articles = await getPublishedArticles();
  const origin = context.site ?? new URL(siteUrl);

  return rss({
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    site: new URL(withBase('/'), origin),
    items: articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.publishedAt,
      link: withBase(`/journal/${article.id}/`),
      categories: [getArticleTopic(article).name, ...article.data.tags],
    })),
    customData: `<language>en-gb</language><copyright>© ${new Date().getFullYear()} Brine</copyright>`,
  });
}
