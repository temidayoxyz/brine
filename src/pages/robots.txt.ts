import type { APIRoute } from 'astro';
import { siteUrl } from '../config';
import { withBase } from '../lib/paths';

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL(siteUrl);
  const sitemap = new URL(withBase('/sitemap-index.xml'), origin).href;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
