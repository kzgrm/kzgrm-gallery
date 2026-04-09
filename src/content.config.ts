import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const activities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/activities' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().max(180),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    coverImage: z.string().optional(),
    location: z.string().optional(),
    eventType: z.string().optional()
  })
});

export const collections = { activities };
