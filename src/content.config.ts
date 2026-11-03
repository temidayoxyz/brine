import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { topicSlugs } from './data/topics';

const articles = defineCollection({
  loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(8).max(140),
      description: z.string().min(20).max(320),
      category: z.enum(topicSlugs),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      author: z.string().default('Brine Editorial'),
      cover: image(),
      coverAlt: z.string().min(10),
      coverCaption: z.string().optional(),
      coverCredit: z.string().default('Photograph via Unsplash'),
      coverPosition: z.string().default('center'),
      featured: z.boolean().default(false),
      tags: z.array(z.string()).default([]),
      keywords: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { articles };
