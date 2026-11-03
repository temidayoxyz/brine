import { withBase } from '../lib/paths';

export const site = {
  name: 'Brine',
  tagline: 'A journal of attention, design & digital life',
  description:
    'Brine is an independent journal about attention, design, and the texture of digital life. Essays for people who would rather think than scroll.',
  issue: {
    number: '04',
    season: 'Autumn 2026',
    name: 'The Quiet Issue',
  },
  nav: [
    { label: 'Journal', href: withBase('/journal/'), section: 'journal' },
    { label: 'Topics', href: withBase('/topics/'), section: 'topics' },
    { label: 'Archive', href: withBase('/archive/'), section: 'archive' },
    { label: 'About', href: withBase('/about/'), section: 'about' },
  ],
  social: [{ label: 'RSS feed', href: withBase('/rss.xml') }],
  colophon: {
    typefaces: 'Fraunces, Newsreader & Inter',
    platform: 'Set in type, built with Astro, and served from GitHub Pages.',
    photography:
      'Photography sourced from Unsplash and Pexels and used under their respective licences.',
  },
} as const;
