import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const activities = defineCollection({
  loader: glob({
    pattern: '**/index.md',
    base: './src/content/activities',
    generateId: ({ entry }) => entry.split('/')[0]!
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      tags: z.array(z.string()).default([]),
      thumnail: image()
    })
});

export const collections = { activities };
