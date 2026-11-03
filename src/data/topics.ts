export const topicSlugs = ['attention', 'design', 'digital-life', 'culture', 'living'] as const;

export type TopicSlug = (typeof topicSlugs)[number];

export interface Topic {
  slug: TopicSlug;
  name: string;
  number: string;
  shortDescription: string;
  intro: string;
}

export const topics: Topic[] = [
  {
    slug: 'attention',
    name: 'Attention',
    number: '01',
    shortDescription: 'Focus, distraction, and the art of noticing.',
    intro:
      'Attention is the most personal resource we have. These essays look at the rooms, rituals, and small decisions that help us give it away less carelessly — and get it back.',
  },
  {
    slug: 'design',
    name: 'Design',
    number: '02',
    shortDescription: 'Interfaces, objects, and the choices behind them.',
    intro:
      'Design is not decoration. It is the arrangement of decisions that shape how something feels to use. Here we look at color, craft, constraint, and the quiet intelligence of everyday things.',
  },
  {
    slug: 'digital-life',
    name: 'Digital Life',
    number: '03',
    shortDescription: 'How the internet shapes the way we live and remember.',
    intro:
      'The internet is not a place we visit anymore. It is the weather. These essays examine the feeds, platforms, and habits that have become part of the furniture of being alive online.',
  },
  {
    slug: 'culture',
    name: 'Culture',
    number: '04',
    shortDescription: 'Art, media, and the stories we tell about ourselves.',
    intro:
      'Culture is the shared language we use to make sense of the world. This is a place for close readings of the images, places, and stories that shape what we long for.',
  },
  {
    slug: 'living',
    name: 'Living',
    number: '05',
    shortDescription: 'Habits, rituals, and a considered everyday.',
    intro:
      'A good life is assembled in small, repeated gestures. These notes are about rest, ritual, and the ordinary practices that make a day feel like it belongs to you.',
  },
];

export const topicBySlug = Object.fromEntries(topics.map((topic) => [topic.slug, topic])) as Record<
  TopicSlug,
  Topic
>;

export function getTopic(slug: string): Topic {
  const topic = topics.find((item) => item.slug === slug);
  if (!topic) {
    throw new Error(`Unknown topic: ${slug}`);
  }
  return topic;
}
